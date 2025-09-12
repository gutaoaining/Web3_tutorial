const { getNamedAccounts } = require("hardhat");

module.exports = async({getNamedAccounts, deployments}) =>{
    const {firstAccount} = await getNamedAccounts()
    const {deploy, log} = deployments
    log("NFTPoolLockAndRelease deploying...")

    //address _router ,address _link , address nftAddr
    const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator")
    const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address)
    const ccipConfig = await ccipSimulator.configuration()
    const sourceRouter = ccipConfig.sourceRouter_
    const linkToken =  ccipConfig.linkToken_
    const nftDeployment = await deployments.get("MyToken")
    const nftAddr = nftDeployment.address

    await deploy("NFTPoolLockAndRelease",{
        contract: "NFTPoolLockAndRelease",
        from: firstAccount,
        log: true,
        args:[sourceRouter, linkToken,nftAddr]

    })
    log("NFTPoolLockAndRelease deployed successfully")
}

module.exports.tags = ["all","sourcechain"]