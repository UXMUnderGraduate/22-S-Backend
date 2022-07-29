const express = require("express");
const jwt = require("jsonwebtoken");

const passport = require("../passport/index.js");

const router = express.Router();

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
