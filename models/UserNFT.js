const Sequelize = require("sequelize");

module.exports = class UserNFT extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        nft_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        sell_tx: {
          type: Sequelize.STRING(255),
          allowNull: true,
          defaultValue: null,
        },
        purchase_tx: {
          type: Sequelize.STRING(255),
          allowNull: true,
          defaultValue: null,
        },
        is_sale: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "UserNFT",
        tableName: "user_nft",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {}
};
