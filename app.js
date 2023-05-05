const express = require("express");

const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const passport = require("./passport");
const IPFS = require("./modules/ipfs");
const { sequelize } = require("./models");
const seed = require("./seeders");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const musicRouter = require("./routes/music");
const nftRouter = require("./routes/nft");
const uploadRouter = require("./routes/upload");
const purchaseRouter = require("./routes/purchase");
const versionRouter = require("./routes/version");
const cors = require("cors");

const app = express();
app.set("port", process.env.PORT || 5000);

const force = Number(process.env.DB_SYNC_FORCE); // 0이면 false, 1이면 true
sequelize
  .sync({ force })
  .then(() => {
    if (force) {
      // db 초기화 설정(sync force: true) 시 자동 seed (sequelize db:seed:all과 동일)
      seed(sequelize.getQueryInterface());
    }
  })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/music", musicRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/nft", nftRouter);
app.use("/api/v1/version", versionRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  console.error(err);
  res.send("Internal Server Error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
