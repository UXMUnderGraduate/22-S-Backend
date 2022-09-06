const jwt = require("jsonwebtoken");

module.exports = {
  verify: (token) => {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.message === "jwt expired") {
        console.log("expired token");
      } else {
        console.log("invalid token");
      }
      return null;
    }
    return decoded;
  },
};
