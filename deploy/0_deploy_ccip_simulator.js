const { getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config.js")

module.exports = async({getNamedAccounts, deployments}) =>{
    if (developmentChains.includes(network.name)) {
        const {firstAccount} = await getNamedAccounts()
        const {deploy, log} = deployments

        log("deploying CCIP Simulator contract")
        await deploy("CCIPLocalSimulator",{
            contract: "CCIPLocalSimulator",
            from: firstAccount,
            log:true,
            args:[]
        })
        log("CCIP Simulator contract deployed successfully")
    }
  
}
module.exports.tags = ["all","test"]