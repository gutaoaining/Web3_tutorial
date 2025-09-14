const { getNamedAccounts } = require("hardhat")
const { developmentChains,networkConfig } = require("../helper-hardhat-config.js")


module.exports = async({getNamedAccounts, deployments}) =>{
    const {firstAccount} = await getNamedAccounts()
    const {deploy, log} = deployments
    log("NFTPoolBurnAndMint deploying...")
    let destinationRouter
    let linkToken
    //address _router ,address _link , address nftAddr
    if (developmentChains.includes(network.name)) {
        const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator")
        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address)
        const ccipConfig = await ccipSimulator.configuration()
        destinationRouter = ccipConfig.destinationRouter_
        linkToken =  ccipConfig.linkToken_
    } else {
        destinationRouter = networkConfig[network.config.chainId].router
        linkToken =  networkConfig[network.config.chainId].linkToken
    }

    const wnftDeployment = await deployments.get("WrappedMyToken")
    const wnftAddr = wnftDeployment.address
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);
    console.log("network.config.chainId: ", network.config.chainId);

    console.log("Balance:", (await ethers.provider.getBalance(firstAccount)));
    await deploy("NFTPoolBurnAndMint",{
        contract: "NFTPoolBurnAndMint",
        from: firstAccount,
        log: true,
        args:[destinationRouter, linkToken,wnftAddr]

    })
    log("NFTPoolBurnAndMint deployed successfully")
}

module.exports.tags = ["all", "destchain"]