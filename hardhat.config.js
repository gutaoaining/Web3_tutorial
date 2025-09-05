require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SEPOLIA_URL= process.env.SEPOLIA_URL
PRIVATE_KEY_1=process.env.PRIVATE_KEY_1
ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks:{
    sepolia:{
      url: SEPOLIA_URL,
      accounts:[PRIVATE_KEY_1]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
