const express = require("express");
const User = require("../models/User");

const { isLoggedIn } = require("../middlewares/auth");

const router = express.Router();

// 마이페이지 - 내 정보 조회
router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    // User 테이블에서 해당 사용자의 정보를 가져온다.
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ["type", "email", "name", "nickname", "wallet"],
    });
    const { id, type, email, name, nickname, wallet } = user;
    console.log(req.user.id);
    return res.json({
      message: "내 정보 조회 성공",
      data: {
        id: req.user.id,
        email,
        name,
        type,
        nickname,
        wallet,
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "내 정보 조회 실패",
      data: {},
    });
  }
});

module.exports = router;
