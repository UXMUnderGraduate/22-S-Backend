const Sequelize = require("sequelize");

const User = require("./User");
const Music = require("./Music");
const Purchase = require("./Purchase");
const NFT = require("./NFT");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config.js")[env];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;
db.Music = Music;
db.Purchase = Purchase;
db.NFT = NFT;

User.init(sequelize);
Music.init(sequelize);
Purchase.init(sequelize);
NFT.init(sequelize);

module.exports = db;
