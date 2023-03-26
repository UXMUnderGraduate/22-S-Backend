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
        cid1: "QmPBa5H9kawGcaCkgMP9k9drwjnnZMtxjbmby9cfaCsUHt",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
        cid3: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihZd",
        sha1: "df6f9addab24bfa6d0d50a490d6442406c7fa1a2",
        address1: "0xEc7d9C588E8C07C80529E2DEBfd71EBF08d2354d",
      },
      {
        id: 2,
        user_id: 1,
        title: "라일락",
        genre: "Pop",
        artist: "아이유",
        cid1: "QmWZipPtKnuVkn1mwNMqEw8apx513me2B3aCByCchsCmHk",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
        cid3: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihZd",
        sha1: "df6f9addab24bfa6d0d50a490d6442406c7fa1a2",
        address1: "0x75986f6Ec6A27fE66e78863DaB7111Ff9267e37b",
      },
      {
        id: 3,
        user_id: 2,
        title: "비 오는 날 듣기 좋은 노래",
        genre: "Hip-Hop",
        artist: "에픽하이",
        cid1: "QmberjDV3Y3WUbvjpMS2EEycMP9z2WcWR7iYQ79ZZgfZN5",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
        cid3: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihZd",
        sha1: "df6f9addab24bfa6d0d50a490d6442406c7fa1a2",
        address1: "0x75986f6Ec6A27fE66e78863DaB7111Ff9267e37b",
      },
      {
        id: 4,
        user_id: 3,
        title: "LOVE me",
        genre: "Hip-Hop",
        artist: "쁘리티민수",
        cid1: "QmberjDV3Y3WUbvjpMS2EEycMP9z2WcWR7iYQ79ZZgfZN5",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
        cid3: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihZd",
        sha1: "df6f9addab24bfa6d0d50a490d6442406c7fa1a2",
        address1: "0x75986f6Ec6A27fE66e78863DaB7111Ff9267e37b",
      },
      {
        id: 5,
        user_id: 3,
        title: "민수는 혼란스럽다",
        genre: "Pop",
        artist: "쁘리티민수",
        cid1: "QmberjDV3Y3WUbvjpMS2EEycMP9z2WcWR7iYQ79ZZgfZN5",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
        cid3: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihZd",
        sha1: "df6f9addab24bfa6d0d50a490d6442406c7fa1a2",
        address1: "0x75986f6Ec6A27fE66e78863DaB7111Ff9267e37b",
      },
      {
        id: 6,
        user_id: 4,
        title: "마지막으로",
        genre: "Hip-Hop",
        artist: "큐티빠띠져니><",
        cid1: "QmberjDV3Y3WUbvjpMS2EEycMP9z2WcWR7iYQ79ZZgfZN5",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
        cid3: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihZd",
        sha1: "df6f9addab24bfa6d0d50a490d6442406c7fa1a2",
        address1: "0x75986f6Ec6A27fE66e78863DaB7111Ff9267e37b",
      },
      {
        id: 7,
        user_id: 6,
        title: "Make the Move",
        genre: "Pop",
        artist: "Chris James",
        cid1: "QmberjDV3Y3WUbvjpMS2EEycMP9z2WcWR7iYQ79ZZgfZN5",
        cid2: "QmZLh8MmkF9TgBxnhrdCC9D64wwZvNULtACg9bczrbFSFX",
        cid3: "QmWivSrufNi2pVT3kxdJ9GehTDjjxwDZtjNvK1g2VPb4GV",
        sha1: "df6f9addab24bfa6d0d50a490d6442406c7fa1ec",
        address1: "0x75986f6Ec6A27fE66e78863DaB7111Ff9267e37b",
      },
      {
        id: 8,
        user_id: 10,
        title: "아이와 나와 바다",
        genre: "Pop",
        artist: "아이유",
        cid1: "QmWZipPtKnuVkn1mwNMqEw8apx513me2B3aCByCchsCmHk",
        cid2: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihTc",
        cid3: "QmSvj5TRVNGWEZxzcLnQNNhW12UKaCdMsGYjgUczdvihZd",
        sha1: "df6f9addab24bfa6d0d50a490d6442406c7fa1a2",
        address1: "0x983b35886F4c9E64d0619826916C7500E0952821",
      },
      {
        id: 9,
        user_id: 14,
        title: "Champagne Supernova",
        genre: "Rock",
        artist: "Oasis",
        cid1: "QmcXEzse9wKagKFe1SgekmFH5XX3ZCzZ6idDK5Az69XFDA",
        cid2: "QmVj2zMuQjZpPBLkPmh9axSn2TsYPvAmzox9e2MEnJkm5A",
        cid3: "QmQnzGhm4p42mhE44pE8UszsANxcSAnehdh9zS5FWVUkkh",
        sha1: "72f621e9828b2a9ce514dbd5628b35b70c4a731d",
        address1: "0x983b35886F4c9E64d0619826916C7500E0952821",
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
