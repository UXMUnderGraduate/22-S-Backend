const express = require("express");
const multer = require("multer");
const axios = require("axios").default;
const FormData = require("form-data");
const CryptoJS = require("crypto-js");
const BloomFilter = require("../modules/bloom-filter");
const { isLoggedIn } = require("../middlewares/auth");
const Music = require("../models/Music");
const IPFS = require("../modules/ipfs");
const User = require("../models/User");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.delete("/:id", isLoggedIn, async (req, res) => {
  const userId = req.user.id; // 삭제하려고 하는 내 id
  const musicId = req.params.id; // 삭제할 뮤직의 id

  try {
    const music = await Music.findOne({
      where: { id: musicId }, // id가 musicId인 것을 찾음
      attributes: ["user_id"],
    });

    if (music.user_id !== userId) {
      return res.status(403).json({
        message: "음원 삭제 실패 - 권한이 없습니다.",
        data: {},
      });
    }

    await Music.destroy({ where: { id: musicId } });

    return res.status(200).json({
      message: "음원 삭제 성공.",
      data: {
        id: musicId,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "음원 삭제 실패",
      data: {},
    });
  }
});

router.get("/", isLoggedIn, async (req, res) => {
  const node = IPFS.getInstance();

  try {
    const userId = req.user.id;
    const music = await Music.findAll({
      where: { user_id: userId },
      attributes: ["id", "title", "artist", "cid1"],
    });
    const data = music.map((record) => record.toJSON());

    for (var i = 0; i < data.length; i++) {
      let cid1 = data[i].cid1;

      console.log(cid1);

      let chunks = [];
      for await (const chunk of node.cat(cid1)) {
        chunks.push(chunk);
      }
      let meta = Buffer.concat(chunks);

      let songInfo = JSON.parse(meta).songInfo;
      songInfo = JSON.stringify(songInfo);

      let imageCid = JSON.parse(songInfo).imageCid;
      chunks = [];
      for await (const chunk of node.cat(imageCid)) {
        chunks.push(chunk);
      }
      let image = Buffer.concat(chunks);
      let encode = Buffer.from(image).toString("base64");

      data[i].album = JSON.parse(songInfo).album;
      data[i].image = encode;

      delete data[i].cid1;
    }

    return res.json({
      message: "업로드한 음원 조회 성공",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "업로드한 음원 조회 실패",
      data: {},
    });
  }
});

router.post(
  "/check",
  isLoggedIn,
  upload.single("file"),
  async (req, res, next) => {
    const file = req.file;

    const formData = new FormData();
    formData.append("file", Buffer.from(file.buffer), file.originalname);

    // dejavu 도커 이미지에서 flask 서버 포트를 7000번으로 열어야 함
    const result = await axios.post(
      "http://localhost:7000/recognize",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    if (result.status !== 200) {
      return res.status(400).json({
        message: "중복 곡 체크 실패",
        data: {},
      });
    }

    let isDuplicated = false;
    const { data } = result.data;
    for (const song of data.results) {
      // confidence 값이 0.3 이상인 경우 중복 곡으로 판단
      if (song.input_confidence >= 0.3) {
        isDuplicated = true;
        break;
      }
    }

    return res.json({
      message: "중복 곡 체크 성공",
      data: { isDuplicated },
    });
  }
);

router.post(
  "/",
  isLoggedIn,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  async (req, res, next) => {
    const { originalname, buffer: imgBuffer } = req.files["image"][0];
    const { buffer } = req.files["file"][0];
    const {
      title,
      artist,
      artistId,
      album,
      genre,
      lyrics,
      composerId,
      songWriterId,
      holder,
      rate,
    } = req.body;
    const userId = req.user.id;

    try {
      const composers = JSON.parse(composerId);
      const songWriters = JSON.parse(songWriterId);
      const holders = JSON.parse(holder);
      const rates = JSON.parse(rate);

      const wordArray = CryptoJS.lib.WordArray.create(buffer);
      const sha1 = CryptoJS.SHA1(wordArray).toString();

      const key = process.env.IPFS_ENC_KEY;
      const iv = process.env.IPFS_ENC_IV;
      const encrypted = CryptoJS.AES.encrypt(buffer.toString("base64"), key, {
        iv,
      });

      const node = IPFS.getInstance();
      const { cid: imageCid } = await node.add({
        path: originalname,
        content: imgBuffer,
      });

      const metadata = {
        uploaderId: userId,
        uploadTime: new Date().toISOString(),
        songInfo: {
          title,
          artistId,
          artist,
          album,
          imageCid: imageCid.toString(),
          genre,
          lyrics,
          composerId: composers,
          songWriterId: songWriters,
        },
      };
      const { cid: cid1 } = await node.add(JSON.stringify(metadata));
      const { cid: cid3 } = await node.add(encrypted.toString());

      const { id: songId } = await Music.create({
        user_id: userId,
        title,
        genre,
        artist,
        cid1: cid1.toString(),
        cid2: "",
        cid3: cid3.toString(),
        sha1,
      });

      let rightHolders = await User.findAll({
        where: {
          id: holders,
        },
        attributes: [
          ["id", "userId"],
          ["wallet", "walletAddress"],
        ],
      });
      rightHolders = rightHolders.map((record) => record.toJSON());
      rightHolders.forEach((user, index) => {
        user.proportion = rates[index];
      });

      const copyright = {
        payProperty: {
          songId,
          rightHolders,
        },
      };

      const { cid: cid2 } = await node.add(JSON.stringify(copyright));
      await Music.update({ cid2: cid2.toString() }, { where: { id: songId } });

      const filter = new BloomFilter();
      filter.add(sha1);

      return res.send({
        message: "음원 업로드 성공",
        data: {
          id: songId,
        },
      });
    } catch (err) {
      console.error(err);
      return res.json({
        message: "음원 업로드 실패",
        data: {},
      });
    }
  }
);

module.exports = router;
