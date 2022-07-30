const { ExtractJwt, Strategy: JWTStrategy } = require("passport-jwt");
const User = require("../models/User");

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = new JWTStrategy(JWTConfig, async (jwtPayload, done) => {
  console.info("___new JWTStrategy()");
  try {
    const user = await User.findOne({ where: { id: jwtPayload.id } });
    if (user) {
      done(null, user);
      return;
    }

    done(null, false, {
      message: "올바르지 않은 인증정보 입니다.",
    });
  } catch (error) {
    console.error(error);
    done(error);
  }
});
