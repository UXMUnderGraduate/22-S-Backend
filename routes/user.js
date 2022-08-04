const express = require("express");
const { Op } = require("sequelize");
const { isLoggedIn } = require("../middlewares/auth");
const User = require("../models/User");

const router = express.Router();

// 유저 검색
router.get("/", isLoggedIn, async (req, res, next) => {
  const { search } = req.query;
  if (search === undefined) {
    return next();
  }

  try {
    const users = await User.findAll({
      where: {
        email: {
          [Op.like]: `%${search}%`,
        },
      },
      attributes: ["id", "email", "nickname"],
    });
    const data = users.map((record) => record.toJSON());
    console.log(data);
    return res.json({
      message: "유저 조회 성공",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "유저 검색 실패",
      data: {},
    });
  }
});

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
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "내 정보 조회 실패",
      data: {},
    });
  }
});

router.put("/", isLoggedIn, async (req, res, next) => {
  const { email, name, nickname } = req.body;

  if (name) {
    data.name = name;
  }
  if (email) {
    data.email = email;
  }
  if (nickname) {
    data.nickname = nickname;
  }

  try {
    await User.update(data, {
      where: {
        id: req.user.id,
      },
    });

    return res.json({
      message: "회원 정보 수정 성공",
      data: {
        id: req.user.id,
        name: name,
        nickname: nickname,
      },
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
