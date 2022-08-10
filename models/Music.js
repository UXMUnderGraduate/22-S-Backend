const Sequelize = require("sequelize");

module.exports = class Music extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        genre: {
          type: Sequelize.ENUM(
            "R&B",
            "Hip-Hop",
            "Ballad",
            "Pop",
            "Jazz",
            "Rock"
          ),
          allowNull: false,
        },
        artist: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        cid1: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        cid2: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        cid3: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        sha1: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Music",
        tableName: "music",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {}
};
