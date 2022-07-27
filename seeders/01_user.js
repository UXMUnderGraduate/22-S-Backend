"use strict";

const bcrypt = require("bcrypt");
const salt = 12;

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const hash = bcrypt.hashSync("1234", salt);

    const bulk = [
      {
        id: 1,
        name: "현선재",
        email: "hsj106@mju.ac.kr",
        type: "Producer",
        password: hash,
        nickname: "아이유",
        wallet: "0xC788797F401A4e0AB68B0Ea1Ed855a4c7dF6cdfb",
      },
    ];

    await queryInterface.bulkInsert("user", bulk, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("user", null, {});
  },
};
