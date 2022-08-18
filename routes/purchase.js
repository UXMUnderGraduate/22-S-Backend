const express = require("express");
const { isLoggedIn } = require("../middlewares/auth");
const Purchase = require("../models/Purchase");
const Music = require("../models/Music");
const IPFS = require("../modules/ipfs");

const router = express.Router();

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

      // console.log(data2);

      let chunks = [];
      for await (const chunk of node.cat(cid1)) {
        chunks.push(chunk);
      }
      const meta = Buffer.concat(chunks);

      let songInfo = JSON.parse(meta).songInfo;
      songInfo = JSON.stringify(songInfo);

      console.log(songInfo);

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
      message: "성공",
      data: list,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "목록 불러오기 실패",
      data: {},
    });
  }
});

module.exports = router;
