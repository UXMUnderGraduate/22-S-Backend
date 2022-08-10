const express = require("express");
const multer = require("multer");
const axios = require("axios").default;
const FormData = require("form-data");
const { isLoggedIn } = require("../middlewares/auth");
const Music = require("../models/Music");

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
      if (song.input_confidence > 0.3) {
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

module.exports = router;
