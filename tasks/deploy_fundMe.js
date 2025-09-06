const {task} = require("hardhat/config")
task("deploy_fundMe","deploy and verify fundme conract").setAction(async(taskArgs, hre) => {

    //get contract deploy address
    const [deployer] = await ethers.getSigners()
    console.log(`the deployer of contract is ${deployer.address}`)
    // create factory 
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("contract deploying")
    // deploy contract from factory
    const fundMe = await fundMeFactory.deploy(300)
    await fundMe.waitForDeployment()
    console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`);

    // verify fundme
    if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(5) 
        await verifyFundMe(fundMe.target, [300])
    } else {
        console.log("verification skipped..")
    }

})

async function verifyFundMe(fundMeAddr, args) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
      });
}
module.exports = {}