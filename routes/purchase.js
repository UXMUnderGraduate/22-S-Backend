const express = require("express");
const { isLoggedIn } = require("../middlewares/auth");
const Purchase = require("../models/Purchase");
const Music = require("../models/Music");
const User = require("../models/User");
const IPFS = require("../modules/ipfs");
const CryptoJS = require("crypto-js");
const Web3 = require("web3");

const router = express.Router();

let web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://ropsten.infura.io/v3/${process.env.ETH_API_KEY}`
  )
);

router.post("/:id", isLoggedIn, async (req, res, next) => {
  const userId = req.user.id;
  const musicId = req.params.id;
  const hash = req.body.hash;

  try {
    const receipt = await web3.eth
      .getTransactionReceipt(hash)
      .then(function (receipt) {
        return receipt;
      });

    const logs = web3.eth.abi.decodeLog(
      [
        {
          type: "address",
          name: "buyer",
        },
        {
          type: "bytes32",
          name: "songCid",
        },
        {
          type: "uint256",
          name: "amount",
        },
      ],
      receipt.logs[0].data,
      receipt.logs[0].topics
    );

    const user = await User.findOne({
      where: { wallet: logs.buyer },
      attributes: ["id"],
    });
    const user_id = user.id;

    const music = await Music.findOne({
      where: { cid1: logs.songCid },
      attributes: ["id"],
    });
    const music_id = music.id;

    if (user_id != userId || music_id != musicId) {
      return res.status(403).json({
        message: "음원 결제 실패 - 권한이 없습니다.",
        data: {},
      });
    }

    const { id } = await Purchase.create({
      user_id,
      music_id,
    });

    return res.status(200).json({
      message: "음원 결제 성공",
      data: {
        id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "음원 결제 실패",
      data: {},
    });
  }
});

router.get("/:id", isLoggedIn, async (req, res) => {
  const node = IPFS.getInstance();

  const userId = req.user.id;
  const musicId = req.params.id;

  try {
    const buy = await Purchase.findOne({
      where: { user_id: userId, music_id: musicId },
    });

    if (buy == null) {
      return res.status(403).json({
        message: "음원 다운로드 실패 - 권한이 없습니다.",
        data: {},
      });
    }

    const music = await Music.findOne({
      where: { id: musicId },
      attributes: ["cid3"],
    });
    const { cid3 } = music;

    let chunks = [];

    const key = process.env.IPFS_ENC_KEY;
    const iv = process.env.IPFS_ENC_IV;

    for await (const chunk of node.cat(cid3)) {
      chunks.push(chunk);
    }

    const data = Buffer.concat(chunks);

    const decrypted = CryptoJS.AES.decrypt(data.toString(), key, { iv });

    const buffer = Buffer.from(decrypted.toString(CryptoJS.enc.Utf8), "base64");

    return res.send(buffer);
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "음원 다운로드 실패",
      data: {},
    });
  }
});

router.get("/", isLoggedIn, async (req, res, next) => {
  const node = IPFS.getInstance();

  try {
    const music = await Purchase.findAll({
      where: { user_id: req.user.id },
      attributes: ["music_id"],
    });
    const data = music.map((record) => record.toJSON());

    let list = [];
    for (var i = 0; i < data.length; i++) {
      const info = await Music.findOne({
        where: { id: music[i].music_id },
        attributes: ["id", "title", "artist", "cid1"],
      });

      // const data2 = info.map((record) => record.toJSON());

      const { cid1 } = info;

      let chunks = [];
      for await (const chunk of node.cat(cid1)) {
        chunks.push(chunk);
      }
      const meta = Buffer.concat(chunks);

      let songInfo = JSON.parse(meta).songInfo;
      songInfo = JSON.stringify(songInfo);

      // const imageCid = JSON.parse(songInfo).imageCid;
      // chunks = [];
      // for await (const chunk of node.cat(imageCid)) {
      //   chunks.push(chunk);
      // }
      // const image = Buffer.concat(chunks);
      // const encode = Buffer.from(image).toString("base64");

      list.push({
        id: info.id,
        title: info.title,
        artist: info.artist,
        album: JSON.parse(songInfo).album,
      });
    }

    return res.status(200).json({
      message: "음원 구매 내역 조회 성공",
      data: list,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "음원 구매 내역 조회 실패",
      data: {},
    });
  }
});

module.exports = router;
