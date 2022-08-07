"use strict";

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
    const bulk = [
      {
        id: 1,
        user_id: 1,
        title: "좋은 날",
        genre: "Pop",
        artist: "아이유",
        cid1: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUcyuvibCh",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
      },
      {
        id: 2,
        user_id: 1,
        title: "싫은 날",
        genre: "Pop",
        artist: "아이유",
        cid1: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUcyuvibCh",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
      },
      {
        id: 3,
        user_id: 2,
        title: "비 오는 날 듣기 좋은 노래",
        genre: "Hip-Hop",
        artist: "에픽하이",
        cid1: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUcyuvibCh",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
      },
      {
        id: 4,
        user_id: 3,
        title: "LOVE me",
        genre: "Hip-Hop",
        artist: "쁘리티민수",
        cid1: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUcyuvibCh",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
      },
      {
        id: 5,
        user_id: 3,
        title: "민수는 혼란스럽다",
        genre: "Pop",
        artist: "쁘리티민수",
        cid1: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUcyuvibCh",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
      },
      {
        id: 6,
        user_id: 4,
        title: "마지막으로",
        genre: "Hip-Hop",
        artist: "큐티빠띠져니><",
        cid1: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUcyuvibCh",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
      },
    ];

    await queryInterface.bulkInsert("music", bulk, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("music", null, {});
  },
};
