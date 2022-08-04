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
      {
        id: 2,
        name: "이선웅",
        email: "lsu123@google.com",
        type: "Producer",
        password: hash,
        nickname: "에픽하이",
        wallet: "0xa5FA319a89B863c0a56a013c290b7a7DeaE7337f",
      },
      {
        id: 3,
        name: "김민수",
        email: "minsu@naver.com",
        type: "General",
        password: hash,
        nickname: "쁘리티민수",
        wallet: "0x03a8CEF481a109B24fF267E4F86ca9ECBEa28B4F",
      },
      {
        id: 4,
        name: "최지현",
        email: "gus104@google.com",
        type: "Producer",
        password: hash,
        nickname: "큐티빠띠져니><",
        wallet: "0xc05171FAE4E6aF21366812F107872287f2B80Ec5",
      },
      {
        id: 5,
        name: "채기웅",
        email: "dipito@naver.com",
        type: "Producer",
        password: hash,
        nickname: "DIPITO",
        wallet: "0x28D5015a69073E561da6C47dDB2e71265CE6de1B",
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
