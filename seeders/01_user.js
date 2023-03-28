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
      {
        id: 6,
        name: "Christopher James Brenner",
        email: "team@chrisjames.lol",
        type: "Producer",
        password: hash,
        nickname: "Chris James",
        wallet: "0x8eEc6fa26B6B3B48D072C15FD32D3750b7dBEf2F",
      },
      {
        id: 7,
        name: "백예린",
        email: "yerinbaek@naver.com",
        type: "Producer",
        password: hash,
        nickname: "백예린",
        wallet: "0x8712E5CFA2860B9f7968c8A7215BfA0CE2b7564e",
      },
      {
        id: 8,
        name: "고형석",
        email: "khs@gmail.com",
        type: "Producer",
        password: hash,
        nickname: "구름",
        wallet: "0x1A87Dfc50FEaC0621fDDc167df3650CD97d76aE8",
      },
      {
        id: 9,
        name: "test",
        email: "test@test.com",
        type: "General",
        password: hash,
        nickname: "test",
        wallet: "0x1A87Dfc50FEaC0621fDDc167df3650CD97d76aE8",
      },
      {
        id: 10,
        name: "이지은",
        email: "iu@adam.com",
        type: "Producer",
        password: hash,
        nickname: "아이유",
        wallet: "0x1Fb5Fd68e9b34F8aF64d3B5e2D80ad9Df96F703B",
      },
      {
        id: 11,
        name: "김소현",
        email: "ccc@ccc.com",
        type: "General",
        password: hash,
        nickname: "킹왕짱",
        wallet: "0xB470f6bbC46fD644BF55388Ff5e69c614D51331a",
      },
      {
        id: 12,
        name: "최지현",
        email: "gus1043@mju.ac.kr",
        type: "General",
        password: hash,
        nickname: "최지현",
        wallet: "0xE5DA3bFCe871C233D33b79F9A072a3e94Cb04000",
      },
      {
        id: 13,
        name: "박강현",
        email: "aaa@aaa.com",
        type: "Producer",
        password: hash,
        nickname: "킹왕짱",
        wallet: "0xB470f6bbC46fD633BF14388Ff5e69c614D51331c",
      },
      {
        id: 14,
        name: "Oasis",
        email: "oasis@gmail.com",
        type: "Producer",
        password: hash,
        nickname: "Oasis",
        wallet: "0x53BeD45e5E2387E1ed367E7c69342c72D8877Cf5",
      },
      {
        id: 15,
        name: "testone",
        email: "test@test1.com",
        type: "Producer",
        password:
          "$2b$12$C1RfiFg2c2nR1BcBy9rYbOYKeN3DZ.Th/EJhGljDAceFJzWy3Ozo6",
        nickname: "test1",
        wallet: "0x2d4d860F81fdB19934fa3E9e4A7Cb4016c210976",
      },
      {
        id: 16,
        name: "testtestone",
        email: "testtest1@t.com",
        type: "General",
        password:
          "$2b$12$b.9oX9l6JnDDLtHqu6ha1ukxW9pnCuhAuhAUsoc.klTI.OJMPG2tO",
        nickname: "test1",
        wallet: "0x9a4eAdF9d570f783AAdD6537E9041C4c851eE929",
      },
      {
        id: 17,
        name: "testtesttwo",
        email: "testtest2@t.com",
        type: "Producer",
        password:
          "$2b$12$NLpfUSPE.oTpqrCUYlncy.vSjdkszW45x18APD22gW79ZVk40zMBi",
        nickname: "testtest2",
        wallet: "0xa1Ccb1FF58f5C25a66611BA0FB560468b3be4245",
      },
      {
        id: 18,
        name: "테스트테스트삼",
        email: "testtest3@test.com",
        type: "General",
        password:
          "$2b$12$oBilpXWi6YYQ/WfOCAIp7uz0f.esZyAyWilfFidrBEJ3KG/NiH68u",
        nickname: "testtest3",
        wallet: "0x023515f97C6350B18cec08b56879bE13D8e49112",
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
