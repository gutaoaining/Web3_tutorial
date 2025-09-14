const { task } = require("hardhat/config")

task("mint-nft").setAction(async(taskArgs,hre) => {
    const {firstAccount} = await getNamedAccounts()
    const nft = await ethers.getContract("MyToken",firstAccount)
    const nftTx = await nft.safeMint(firstAccount)
    nftTx.wait(6)
    console.log(`nft has minted.`)
})