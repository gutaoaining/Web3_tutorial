require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
// require("@chainlink/env-enc").config()
require("./tasks")


const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const AMOY_URL = process.env.AMOY_URL


// const PRIVATE_KEY = process.env.PRIVATE_KEY
// const SEPOLIA_URL = process.env.SEPOLIA_URL
// const AMOY_URL = process.env.AMOY_URL

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks:{
    sepolia:{
      url: SEPOLIA_URL,
      accounts:[PRIVATE_KEY_2,PRIVATE_KEY_1],
      chainId: 11155111,
      blockConfirmations: 6,
      companionNetworks: {
        destChain: "amoy"
      }
    },
    amoy:{
      url: AMOY_URL,
      accounts:[PRIVATE_KEY_2],
      chainId: 80002,
      blockConfirmations: 6,
      companionNetworks: {
        destChain: "sepolia"
      }
    }
  },
  namedAccounts:{
    firstAccount: {
      default: 0
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
