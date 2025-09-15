const { task } = require("hardhat/config")

task("check-wnft").setAction(async(taskArgs, hre) => {
    const { firstAccount } = await getNamedAccounts()
    console.log(`the firstAccount is ${firstAccount}`)
    const wnft = await ethers.getContract("WrappedMyToken", firstAccount)
    const totalSupply = await wnft.totalSupply()
    console.log("checking status of WrappedMyToken")
    // for(let tokenId =0; tokenId < totalSupply; tokenId++) {
    //     const owenr = await wnft.ownerOf(tokenId)
    //     console.log(`tokenId: ${tokenId}, owner: ${owenr}`)
    // }
    for (let i = 0; i < totalSupply; i++) {
        const tokenId = await wnft.tokenByIndex(i);
        const owner = await wnft.ownerOf(tokenId);
        console.log(`Token ${tokenId} owner: ${owner}`);
    }
})
module.exports = {}