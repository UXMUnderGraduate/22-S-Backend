const passport = require("passport");
const localStrategy = require("./localStrategy");
const JwtStrategy = require("./JwtStrategy");
const User = require("../models/User");

passport.serializeUser((user, done) => {
  console.info("___passport.serializeUser()");
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  console.info("___passport.deserializeUser()");
  User.findOne({ where: { email } })
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

passport.use(localStrategy);
passport.use(JwtStrategy);

module.exports = passport;
