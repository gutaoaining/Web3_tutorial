const { getNamedAccounts } = require("hardhat");

module.exports = async({getNamedAccounts, deployments}) =>{
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
module.exports.tags = ["test", "all"]