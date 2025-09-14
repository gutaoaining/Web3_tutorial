const { getNamedAccounts } = require("hardhat");
const { developmentChains,networkConfig } = require("../helper-hardhat-config.js")


module.exports = async({getNamedAccounts, deployments}) =>{
    const {firstAccount} = await getNamedAccounts()
    const {deploy, log} = deployments
    log("NFTPoolLockAndRelease deploying...")
    let sourceRouter
    let linkToken
    //address _router ,address _link , address nftAddr
    if(developmentChains.includes(network.name)){
        const ccipSimulatorDeployment = await deployments.get("CCIPLocalSimulator")
        const ccipSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipSimulatorDeployment.address)
        const ccipConfig = await ccipSimulator.configuration()
        sourceRouter = ccipConfig.sourceRouter_
        linkToken =  ccipConfig.linkToken_
    } else{
        sourceRouter = networkConfig[network.config.chainId].router
        linkToken = networkConfig[network.config.chainId].linkToken

    }

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