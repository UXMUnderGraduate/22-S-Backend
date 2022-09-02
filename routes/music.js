const express = require("express");
const { Op } = require("sequelize");
const { isLoggedIn } = require("../middlewares/auth");
const Music = require("../models/Music");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const IPFS = require("../modules/ipfs");

const router = express.Router();

router.get("/", isLoggedIn, async (req, res, next) => {
  const { search } = req.query;
  const node = IPFS.getInstance();
  const operators = [];

  if (search === undefined) {
    return res.status(400).json({
      message: "음원 검색 실패 - 검색어가 없습니다.",
      data: {},
    });
  }

  for (const keyword of search.split(" ")) {
    if (keyword !== "") {
      operators.push({
        title: {
          [Op.substring]: keyword,
        },
      });
      operators.push({
        artist: {
          [Op.substring]: keyword,
        },
      });
    }
  }

  if (operators.length === 0) {
    return res.status(400).json({
      message: "음원 검색 실패 - 검색어가 없습니다.",
      data: {},
    });
  }

  try {
    const result = await Music.findAll({
      where: {
        [Op.or]: operators,
      },
      attributes: [
        "id",
        "user_id",
        "title",
        "genre",
        "artist",
        ["cid1", "image"],
      ],
    });
    const data = result.map((record) => record.toJSON());
    for (const element of data) {
      let chunks = [];
      for await (const chunk of node.cat(element.image)) {
        chunks.push(chunk);
      }
      const meta = Buffer.concat(chunks);

      let songInfo = JSON.parse(meta).songInfo;
      songInfo = JSON.stringify(songInfo);

      const imageCid = JSON.parse(songInfo).imageCid;
      chunks = [];
      for await (const chunk of node.cat(imageCid)) {
        chunks.push(chunk);
      }
      const image = Buffer.concat(chunks);
      const encode = Buffer.from(image).toString("base64");
      element.image = encode;
    }

    return res.json({
      message: "음원 검색 성공",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "음원 검색 실패",
      data: {},
    });
  }
});

router.get("/chart", async (req, res, next) => {
  const { genre } = req.query;
  const node = IPFS.getInstance();

  if (genre === undefined) {
    return res.status(400).json({
      message: "음원 리스트 조회 실패 - 장르가 없습니다.",
      data: {},
    });
  }

  try {
    const result = await Music.findAll({
      where: {
        genre: genre,
      },
      attributes: [
        "id",
        "user_id",
        "title",
        "genre",
        "artist",
        ["cid1", "image"],
      ],
    });
    const data = result.map((record) => record.toJSON());
    for (const element of data) {
      let chunks = [];
      for await (const chunk of node.cat(element.image)) {
        chunks.push(chunk);
      }
      const meta = Buffer.concat(chunks);

      let songInfo = JSON.parse(meta).songInfo;
      songInfo = JSON.stringify(songInfo);

      const imageCid = JSON.parse(songInfo).imageCid;
      chunks = [];
      for await (const chunk of node.cat(imageCid)) {
        chunks.push(chunk);
      }
      const image = Buffer.concat(chunks);
      const encode = Buffer.from(image).toString("base64");
      element.image = encode;
    }

    return res.json({
      message: "음원 리스트 조회 성공",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "음원 리스트 조회 실패",
      data: {},
    });
  }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  const id = req.params.id;
  const node = IPFS.getInstance();

  try {
    const music = await Music.findOne({
      where: { id: id },
      attributes: ["title", "genre", "artist", "cid1", "address1", "address2"],
    });
    let { title, genre, artist, cid1, address1, address2 } = music;

    const purchase = await Purchase.findOne({
      where: { user_id: req.user.id, music_id: id },
    });
    if (purchase) {
      address1 = null;
      address2 = null;
    }

    let chunks = [];
    for await (const chunk of node.cat(cid1)) {
      chunks.push(chunk);
    }
    const meta = Buffer.concat(chunks);

    let songInfo = JSON.parse(meta).songInfo;
    songInfo = JSON.stringify(songInfo);

    const imageCid = JSON.parse(songInfo).imageCid;
    chunks = [];
    for await (const chunk of node.cat(imageCid)) {
      chunks.push(chunk);
    }
    const image = Buffer.concat(chunks);
    const encode = Buffer.from(image).toString("base64");

    const composerId = JSON.parse(songInfo).composerId;
    const composers = [];
    for (let i in composerId) {
      const composer = await User.findOne({
        where: { id: composerId[i] },
      });
      composers.push(composer.nickname);
    }

    const songWriterId = JSON.parse(songInfo).songWriterId;
    const songWriters = [];
    for (let i in songWriterId) {
      const songWriter = await User.findOne({
        where: { id: songWriterId[i] },
      });
      songWriters.push(songWriter.nickname);
    }

    return res.json({
      message: "음원 상세 조회 성공",
      data: {
        id: id,
        title,
        artistId: JSON.parse(songInfo).artistId,
        artist,
        album: JSON.parse(songInfo).album,
        image: encode,
        lyrics: JSON.parse(songInfo).lyrics,
        genre,
        composerId,
        composer: composers,
        songWriterId,
        songWriter: songWriters,
        sellerAddr: address1,
        settlementAddr: address2,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "음원 상세 조회 실패",
      data: {},
    });
  }
});

module.exports = router;
