const user = require("./01_user");
const music = require("./02_music");
const purchase = require("./03_purchase");

module.exports = async (queryInterface) => {
  // const seeds = [user, music, purchase];
  const seeds = [user];

  for (const seed of seeds) {
    await seed.up(queryInterface);
  }
};
