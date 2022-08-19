const express = require("express");
const { isLoggedIn } = require("../middlewares/auth");
const Purchase = require("../models/Purchase");
const Music = require("../models/Music");
const IPFS = require("../modules/ipfs");
const CryptoJS = require("crypto-js");

const router = express.Router();

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

    console.log(cid3);
    console.log(typeof cid3);

    let chunks = [];

    const key = process.env.IPFS_ENC_KEY;
    const iv = process.env.IPFS_ENC_IV;

    for await (const chunk of node.cat(cid3)) {
      chunks.push(chunk);
    }

    console.log(typeof cid3);

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
