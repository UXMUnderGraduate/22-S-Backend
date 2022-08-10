const express = require("express");
const { Op } = require("sequelize");
const { isLoggedIn } = require("../middlewares/auth");
const Music = require("../models/Music");
const IPFS = require("ipfs-core");

const router = express.Router();

let node;
(async () => {
  node = await IPFS.create();
})();

router.get("/", isLoggedIn, async (req, res, next) => {
  const { search } = req.query;
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
    });
    const data = result.map((record) => record.toJSON());

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

router.get("/chart", isLoggedIn, async (req, res, next) => {
  const { genre } = req.query;

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
    });
    const data = result.map((record) => record.toJSON());

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

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const music = await Music.findOne({
      where: { id: id },
      attributes: ["title", "genre", "artist", "cid1"],
    });
    const { title, genre, artist, cid1 } = music;

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
    const encode = Buffer.from(image).toString('base64');

    return res.json({
      message: "음원 상세 조회 성공",
      data: {
        id: id,
        title,
        artist,
        album: JSON.parse(songInfo).album,
        image: encode,
        lyrics: JSON.parse(songInfo).lyrics,
        genre,
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
