// import ethers.js
// create main function
// execute main function

const { ethers } = require("hardhat") 

async function main() {

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

    //2 accounts info
    const [firstAccount, secondAccount] = await ethers.getSigners()

    //the first account fund tx
    const firstFundTx = await fundMe.fund({value: ethers.parseEther("0.005")})
    await firstFundTx.wait()

    console.log(`the first account is ${firstAccount.address}, the second account is ${secondAccount.address}`)
    
    //check the contract balance
    const balanceOfContractAfterFirstTx = await ethers.provider.getBalance(fundMe.target)
    console.log(`the balance of contract is ${balanceOfContractAfterFirstTx}`)

    //the second account fund tx
    const secondFundTx = await fundMe.connect(secondAccount).fund({value: ethers.parseEther("0.006")})
    await secondFundTx.wait()

    //check balance of contract
    const balanceOfContractAfterSecondTx = await ethers.provider.getBalance(fundMe.target)
    console.log(`the balance of contract is ${balanceOfContractAfterSecondTx}`)

    //get fundAmount of the account
    const firstFundAccountAmount = await fundMe.fundersToAmount(firstAccount.address)
    const secondFundAccountAmount = await fundMe.fundersToAmount(secondAccount.address)
    console.log(`balance of first account ${firstAccount.address} is ${firstFundAccountAmount}`)
    console.log(`balance of second account ${secondAccount.address} is ${secondFundAccountAmount}`)
}

async function verifyFundMe(fundMeAddr, args) {
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: args,
      });
}


main().then().catch((error) => {
    console.error(error)
    process.exit(0)
})