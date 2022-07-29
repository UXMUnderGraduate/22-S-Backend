const express = require("express");
const User = require("../models/User");

const router = express.Router();

// 마이페이지 - 내 정보 조회
router.get("/", async (req, res, next) => {
  
    try {
      // User 테이블에서 해당 사용자의 정보를 가져온다.
      const user = await User.findOne({
        where: { id: 1 },
        attributes: ["type", "email", "name", "nickname", "wallet"],
      });
      const { type, email, name, nickname, wallet } = user;
  
      return res.json({
        title: "마이페이지",
        type,
        email,
        name,
        nickname,
        wallet,
      });
    } catch (err) {
      console.error(err);
      return res.status(400).end();
    }
  });
  
  module.exports = router;
  