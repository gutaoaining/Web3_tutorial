const {task} = require("hardhat/config")
task("fundMe_fund", "interact with fundme contract").addParam("addr", "fundme contract address").setAction(async(taskArgs, hre) => {
    const fundMeFactory = await ethers.getContractFactory("FundMe")

    const fundMe = fundMeFactory.attach(taskArgs.addr)
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
})

module.exports = {}