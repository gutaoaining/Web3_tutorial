const { task } = require("hardhat/config")

task("mint-cool-nft").addParam("url", "token image url").setAction(async(taskArgs, hre) => {
    const {firstAccount} = await getNamedAccounts()
    const url = taskArgs.url
    const coolnft = await ethers.getContract("MyCoolToken", firstAccount)
    console.log(`deployer is ${firstAccount}`)

    const coolNFTTx = await coolnft.safeMint(firstAccount, url)
    coolNFTTx.wait(6)
    console.log(`coolNFTTx has minted.`)
})
module.exports = {}