const Web3 = require("web3");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://sepolia.infura.io/v3/${process.env.ETH_API_KEY}`
  )
);

module.exports = web3;
