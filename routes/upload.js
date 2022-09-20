const express = require("express");
const multer = require("multer");
const CryptoJS = require("crypto-js");
const zlib = require("zlib");
const crypto = require("crypto");
const filter = require("../modules/bloom-filter");
const { isLoggedIn } = require("../middlewares/auth");
const Music = require("../models/Music");
const IPFS = require("../modules/ipfs");
const User = require("../models/User");
const Web3 = require("web3");
const web3 = require("../modules/web3");

const abiSettle = require("../contracts/contracts_SettlementContract_sol_SettlementContract.json");

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.delete("/:id", isLoggedIn, async (req, res) => {
  const userId = req.user.id; // 삭제하려고 하는 내 id
  const musicId = req.params.id; // 삭제할 뮤직의 id

  try {
    const music = await Music.findOne({
      where: { id: musicId }, // id가 musicId인 것을 찾음
      attributes: ["user_id"],
    });

    if (music.user_id !== userId) {
      return res.status(403).json({
        message: "음원 삭제 실패 - 권한이 없습니다.",
        data: {},
      });
    }

    await Music.destroy({ where: { id: musicId } });

    return res.status(200).json({
      message: "음원 삭제 성공.",
      data: {
        id: musicId,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "음원 삭제 실패",
      data: {},
    });
  }
});

router.get("/", isLoggedIn, async (req, res) => {
  const node = IPFS.getInstance();

  try {
    const userId = req.user.id;
    const music = await Music.findAll({
      where: { user_id: userId },
      attributes: ["id", "title", "artist", "cid1", "address1"],
    });
    const data = music.map((record) => record.toJSON());

    for (var i = 0; i < data.length; i++) {
      data[i].settlementAddr = data[i].address1;

      let cid1 = data[i].cid1;

      console.log(cid1);

      let chunks = [];
      for await (const chunk of node.cat(cid1)) {
        chunks.push(chunk);
      }
      let meta = Buffer.concat(chunks);

      let songInfo = JSON.parse(meta).songInfo;
      songInfo = JSON.stringify(songInfo);

      let imageCid = JSON.parse(songInfo).imageCid;
      chunks = [];
      for await (const chunk of node.cat(imageCid)) {
        chunks.push(chunk);
      }
      let image = Buffer.concat(chunks);
      let encode = Buffer.from(image).toString("base64");

      data[i].album = JSON.parse(songInfo).album;
      data[i].image = encode;

      delete data[i].cid1;
      delete data[i].address1;
    }

    return res.json({
      message: "업로드한 음원 조회 성공",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "업로드한 음원 조회 실패",
      data: {},
    });
  }
});

router.post(
  "/check",
  isLoggedIn,
  upload.single("file"),
  async (req, res, next) => {
    try {
      const { buffer } = req.file;
      const wordArray = CryptoJS.lib.WordArray.create(buffer);
      const sha1 = CryptoJS.SHA1(wordArray).toString();

      let isDuplicated = false;
      if (filter.has(sha1)) {
        const exMusic = await Music.findOne({
          where: {
            sha1,
          },
        });
        if (exMusic) {
          isDuplicated = true;
        }
      }

      return res.json({
        message: "중복 곡 체크 성공",
        data: { isDuplicated },
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "중복 곡 체크 실패",
        data: {},
      });
    }
  }
);

router.post(
  "/meta",
  isLoggedIn,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { originalname, buffer: imgBuffer } = req.file;
      const {
        title,
        artist,
        artistId,
        album,
        genre,
        lyrics,
        composerId,
        songWriterId,
      } = req.body;
      const userId = req.user.id;

      const composers = JSON.parse(composerId);
      const songWriters = JSON.parse(songWriterId);

      const node = IPFS.getInstance();
      const { cid: imageCid } = await node.add({
        path: originalname,
        content: imgBuffer,
      });

      const metadata = {
        uploaderId: userId,
        uploadTime: new Date().toISOString(),
        songInfo: {
          title,
          artistId: Number(artistId),
          artist,
          album,
          imageCid: imageCid.toString(),
          genre,
          lyrics,
          composerId: composers,
          songWriterId: songWriters,
        },
      };

      const { cid } = await node.add(JSON.stringify(metadata));

      return res.json({
        message: "메타데이터 업로드 성공",
        data: {
          cid1: cid.toString(),
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "메타데이터 업로드 실패",
        data: {},
      });
    }
  }
);

router.post("/", isLoggedIn, upload.single("file"), async (req, res, next) => {
  try {
    const { buffer } = req.file;
    const { title, artist, genre, holder, rate, cid1, settlementAddr } =
      req.body;
    const userId = req.user.id;
    const userType = req.user.type;

    if (userType !== "Producer") {
      return res.status(403).json({
        message: "음원 업로드 실패 - 권한이 없습니다.",
        data: {},
      });
    }

    const holders = JSON.parse(holder);
    const rates = JSON.parse(rate);

    const addresses = [];
    const proportions = [];
    let rightHolders = await User.findAll({
      where: {
        id: holders,
      },
      attributes: [
        ["id", "userId"],
        ["wallet", "walletAddress"],
      ],
    });
    rightHolders = rightHolders.map((record) => record.toJSON());
    rightHolders.forEach((user, index) => {
      user.proportion = rates[index];
      addresses.push(user.walletAddress);
      proportions.push(user.proportion);
    });

    const encodedHash = web3.utils.keccak256(
      web3.eth.abi.encodeParameters(
        ["address[]", "uint256[]"],
        [addresses, proportions]
      )
    );
    const settlementContract = new web3.eth.Contract(abiSettle, settlementAddr);
    const keccak256Hash = await settlementContract.methods.keccak256Hash
      .call()
      .then((hash) => {
        return Web3.utils.hexToString(hash);
      });

    if (encodedHash !== keccak256Hash) {
      return res.status(400).json({
        message: "음원 업로드 실패 - 올바르지 않은 컨트랙트 입니다.",
        data: {},
      });
    }

    const wordArray = CryptoJS.lib.WordArray.create(buffer);
    const sha1 = CryptoJS.SHA1(wordArray).toString();

    const gzipped = zlib.gzipSync(buffer);

    const key = Buffer.from(process.env.IPFS_ENC_KEY, "utf8");
    const iv = Buffer.from(process.env.IPFS_ENC_IV, "utf8");
    const cipher = crypto.createCipheriv("aes-128-ctr", key, iv);

    let encrypted = cipher.update(gzipped);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    const node = IPFS.getInstance();
    const { cid: cid3 } = await node.add(encrypted);

    const { id: songId } = await Music.create({
      user_id: userId,
      title,
      genre,
      artist,
      cid1,
      cid2: "",
      cid3: cid3.toString(),
      sha1,
      address1: settlementAddr,
    });

    const copyright = {
      payProperty: {
        songId,
        rightHolders,
      },
    };

    const { cid: cid2 } = await node.add(JSON.stringify(copyright));
    await Music.update({ cid2: cid2.toString() }, { where: { id: songId } });

    filter.add(sha1);
    if (!filter.saveFilter()) {
      return res.status(400).json({
        message: "음원 업로드 실패",
        data: {},
      });
    }

    return res.json({
      message: "음원 업로드 성공",
      data: {
        id: songId,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "음원 업로드 실패",
      data: {},
    });
  }
});

module.exports = router;
