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
        music_id: 7,
      },
      {
        id: 2,
        user_id: 2,
        music_id: 4,
      },
      {
        id: 3,
        user_id: 3,
        music_id: 7,
      },
    ];

    await queryInterface.bulkInsert("Purchase", bulk, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("purchase", null, {});
  },
};
