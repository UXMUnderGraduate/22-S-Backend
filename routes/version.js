const express = require("express");
const { getLast } = require("../modules/git-log");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const log = await getLast(process.env.PWD);
    return res.json({
      message: "버전 정보 조회 성공",
      data: log,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "버전 정보 조회 실패",
      data: {},
    });
  }
});

module.exports = router;
