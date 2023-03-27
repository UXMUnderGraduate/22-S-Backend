const express = require("express");
const IPFS = require("../modules/ipfs");
const { isLoggedIn } = require("../middlewares/auth");
const { sequelize, Music, NFT, UserNFT } = require("../models");
const { QueryTypes } = require("sequelize");

const router = express.Router();

router.get("/hasMinted", isLoggedIn, async (req, res, next) => {
  const { musicId } = req.body;
  const userId = req.user.id;

  try {
    const nft = await NFT.findAll({
      where: { user_id: userId, music_id: musicId },
    });

    const data = {
      hasMinted: nft.length > 0,
    };

    return res.json({
      message: "NFT 발행여부 조회 성공",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "NFT 발행여부 조회 실패",
      data: {},
    });
  }
});

router.post("/meta", isLoggedIn, async (req, res, next) => {
  const { musicId } = req.body;
  const userId = req.user.id;
  const node = IPFS.getInstance();

  try {
    const music = await Music.findOne({
      where: { id: musicId },
    });
    if (!music) {
      return res.status(400).json({
        message: "음원 조회 실패",
        data: {},
      });
    }

    let chunks = [];
    for await (const chunk of node.cat(music.cid2)) {
      chunks.push(chunk);
    }
    const copyrightInfoBuffer = Buffer.concat(chunks);
    const copyrightInfo = JSON.parse(copyrightInfoBuffer);
    const holders = copyrightInfo.payProperty.rightHolders;
    const uploader = holders.filter((holder) => holder.userId === userId).pop();
    if (!uploader) {
      return res.json(400).json({
        message: "NFT 메타데이터 업로드 실패 - 권한이 없습니다.",
        data: {},
      });
    }

    const holderNo =
      holders.findIndex((holder) => holder.userId === userId) + 1;

    const meta = {
      name: `${holderNo}/${holders.length}`,
      minter: uploader.walletAddress,
      mainContent: {
        cid1: music.cid1,
        cid2: music.cid2,
      },
      proportion: uploader.proportion,
      supply: 1,
    };

    const { cid } = await node.add(JSON.stringify(meta));

    return res.json({
      message: "NFT 메타데이터 업로드 성공",
      data: {
        cid: cid.toString(),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "NFT 메타데이터 업로드 실패",
      data: {},
    });
  }
});

router.post("/create", isLoggedIn, async (req, res, next) => {
  const { musicId, cid, contractAddr, txId } = req.body;
  const userId = req.user.id;

  try {
    // TODO: 트랜잭션 검증 로직 추가
    const isValid = true;

    if (!isValid) {
      return res.status(400).json({
        message: "NFT 생성 실패 - 컨트랙트 정보가 올바르지 않습니다.",
        data: {},
      });
    }

    const { id: nftId } = await NFT.create({
      user_id: userId,
      music_id: musicId,
      contract_addr: contractAddr,
      cid,
    });

    const { id: userNftId } = await UserNFT.create({
      user_id: userId,
      nft_id: nftId,
      sell_tx: txId,
      is_sale: true,
    });

    return res.json({
      message: "NFT 생성 성공",
      data: {
        nftId,
        userNftId,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "NFT 생성 실패",
      data: {},
    });
  }
});

router.post("/sell/:id", isLoggedIn, async (req, res, next) => {
  const id = req.params.id;
  const { txId } = req.body;
  const userId = req.user.id;

  try {
    // TODO: 트랜잭션 검증 로직 추가
    const isValid = true;

    if (!isValid) {
      return res.status(400).json({
        message: "NFT 판매등록 실패 - 컨트랙트 정보가 올바르지 않습니다.",
        data: {},
      });
    }

    const userNft = await UserNFT.findOne({
      where: { user_id: userId, id },
    });
    if (!userNft) {
      return res.status(400).json({
        message: "NFT 판매등록 실패 - 권한이 없습니다.",
        data: {},
      });
    }

    await UserNFT.update(
      { sell_tx: txId, purchase_tx: null, is_sale: true },
      { where: { id } }
    );

    return res.json({
      message: "NFT 판매등록 성공",
      data: {
        id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "NFT 판매등록 실패",
      data: {},
    });
  }
});

router.post("/purchase/:id", isLoggedIn, async (req, res, next) => {
  const id = req.params.id;
  const { txId } = req.body;
  const userId = req.user.id;

  try {
    // TODO: 트랜잭션 검증 로직 추가
    const isValid = true;

    if (!isValid) {
      return res.status(400).json({
        message: "NFT 구매 실패 - 컨트랙트 정보가 올바르지 않습니다.",
        data: {},
      });
    }

    const userNft = await UserNFT.findOne({
      where: { id },
    });
    if (!userNft) {
      return res.status(400).json({
        message: "NFT 조회 실패",
        data: {},
      });
    }

    await UserNFT.update(
      { user_id: userId, sell_tx: null, purchase_tx: txId, is_sale: false },
      { where: { id } }
    );

    return res.json({
      message: "NFT 구매 성공",
      data: {
        id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "NFT 구매 실패",
      data: {},
    });
  }
});

router.get("/", isLoggedIn, async (req, res, next) => {
  const { musicId } = req.query;

  try {
    let conditions = "";
    if (musicId) {
      conditions += `AND n.music_id = ${musicId}`;
    } else {
      conditions += "AND un.is_sale = 1";
    }

    const query = `
      SELECT n.*
      FROM nft n INNER JOIN user_nft un
        WHERE n.id = un.nft_id ${conditions};
    `;

    const nfts = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    return res.json({
      message: "NFT 판매목록 조회 성공",
      data: nfts,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "NFT 판매목록 조회 실패",
      data: {},
    });
  }
});

router.get("/my", isLoggedIn, async (req, res, next) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT n.*
      FROM nft n INNER JOIN user_nft un
        WHERE n.id = un.nft_id AND un.user_id = ${userId};
    `;

    const nfts = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    return res.json({
      message: "나의 NFT 판매목록 조회 성공",
      data: nfts,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "나의 NFT 판매목록 조회 실패",
      data: {},
    });
  }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  const id = req.params.id;

  try {
    const nft = await NFT.findOne({
      where: { id },
    });
    if (!nft) {
      return res.status(400).json({
        message: "NFT 조회 실패",
        data: {},
      });
    }

    return res.json({
      message: "NFT 조회 성공",
      data: { ...nft },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "NFT 조회 실패",
      data: {},
    });
  }
});

module.exports = router;
