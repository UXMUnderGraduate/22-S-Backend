const passport = require("../passport/index.js");

exports.isLoggedIn = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ message: "로그인이 필요합니다.", data: {} });
  }

  passport.authenticate("jwt", { session: false }, (authError, user, info) => {
    console.info("___passport.authenticate()");
    if (authError) {
      console.error(authError);
      return next(authError);
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: `JWT 토큰 인증 실패 - ${info.message}`, data: {} });
    }

    const { id, name, type } = user;
    req.user = { id, name, type };
    next();
  })(req, res, next);
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.headers.authorization) {
    next();
  } else {
    return res.status(400).json({ message: "로그인한 상태입니다.", data: {} });
  }
};
