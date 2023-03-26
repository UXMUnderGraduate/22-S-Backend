const Sequelize = require("sequelize");

module.exports = class NFT extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        music_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        cid: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        contract_addr: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "NFT",
        tableName: "nft",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {}
};
