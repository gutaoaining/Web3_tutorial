const { getNamedAccounts } = require("hardhat");

module.exports = async({getNamedAccounts, deployments}) => {
    const {firstAccount} = await getNamedAccounts()
    const {deploy, log} = deployments
    console.log(`the firstAccount is ${firstAccount}`)
    console.log("MyCoolToken contract begin deploy..... ")
    await deploy("MyCoolToken",{
        contract: "MyCoolToken",
        from: firstAccount,
        log: true,
        args: [firstAccount]
    })

    console.log("MyCoolToken contract begin successfully")

}
module.exports.tags=["nft"]