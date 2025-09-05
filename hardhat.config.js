require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:{
    sepolia:{
      url: SEPOLIA_URL,
      accounts:[PRIVATE_KEY_1],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
