const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");

const { isNotLoggedIn } = require("../middlewares/auth");

const passport = require("../passport/index.js");

const router = express.Router();

router.post("/signup", isNotLoggedIn, async (req, res, next) => {
  const { email, password, name, type, nickname, wallet } = req.body;
  const salt = 12;

  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.status(400).json({ error: "이미 존재하는 이메일입니다." });
    }
    console.info("___User.create(): " + name);
    const hash = await bcrypt.hash(password, salt);
    await User.create({
      email,
      password: hash,
      name,
      type,
      nickname,
      wallet,
    });
    return res.status(201).json({
      message: "회원가입 성공",
      data: {
        id: nickname,
        name: name,
      },
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    console.info("___passport.authenticate()");
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res
        .status(400)
        .json({ message: `로그인 실패 - ${info.message}`, data: {} });
    }

    console.info("___req.login()");
    return req.login(user, { session: false }, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }

      const token = jwt.sign(
        { id: user.id, name: user.name },
        process.env.JWT_SECRET
      );
      return res.json({
        message: "로그인 성공",
        data: { access_token: token },
      });
    });
  })(req, res, next);
});

module.exports = router;
