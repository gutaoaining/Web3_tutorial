const { getNamedAccounts } = require("hardhat");

module.exports = async({getNamedAccounts, deployments}) =>{
    const {firstAccount} = await getNamedAccounts()
    const {deploy, log} = deployments

    log("deploying nft contract")
    log("firstAccount: " + firstAccount)
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);
    console.log("network.config.chainId: ", network.config.chainId);

    console.log("Balance:", (await ethers.provider.getBalance(firstAccount)));
    
    

    await deploy("MyToken",{
        contract: "MyToken",
        from: firstAccount,
        log:true,
        args:["MyToken","MT"]
    })
    log("nft contract deployed successfully")
}
module.exports.tags = ["all","sourcechain"]