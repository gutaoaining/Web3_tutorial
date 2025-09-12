const { getNamedAccounts } = require("hardhat");

module.exports = async({getNamedAccounts, deployments}) =>{
    const {firstAccount} = await getNamedAccounts()
    const {deploy, log} = deployments
    log("NFTPoolBurnAndMint deploying...")

    //address _router ,address _link , address nftAddr
    const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator")
    const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address)
    const ccipConfig = await ccipSimulator.configuration()
    const destinationRouter = ccipConfig.destinationRouter_
    const linkToken =  ccipConfig.linkToken_
    const wnftDeployment = await deployments.get("WrappedMyToken")
    const wnftAddr = wnftDeployment.address

    await deploy("NFTPoolBurnAndMint",{
        contract: "NFTPoolBurnAndMint",
        from: firstAccount,
        log: true,
        args:[destinationRouter, linkToken,wnftAddr]

    })
    log("NFTPoolBurnAndMint deployed successfully")
}

module.exports.tag = ["sourcechain", "all"]