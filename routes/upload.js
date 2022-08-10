const express = require("express");
const { Op } = require("sequelize");
const { isLoggedIn } = require("../middlewares/auth");
const Music = require("../models/Music");

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

module.exports = router;
