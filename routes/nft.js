const express = require("express");
const IPFS = require("../modules/ipfs");
const { isLoggedIn } = require("../middlewares/auth");
const { Music, NFT } = require("../models");

const router = express.Router();

router.get("/hasMinted", isLoggedIn, async (req, res, next) => {
  const { musicId } = req.body;
  const userId = req.user.id;

  try {
    const nft = await NFT.findAll({
      where: { music_id: musicId },
    });

    const data = {
      hasMinted: nft.length > 0,
    };

    return res.json({
      message: "NFT 검색 성공",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "NFT 검색 실패",
      data: {},
    });
  }
});

router.post("/meta", isLoggedIn, async (req, res, next) => {
  const { musicId, propotion } = req.body;
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

module.exports = router;
