const { task } = require("hardhat/config")
const { networkConfig } = require("../helper-hardhat-config")

task("lock-and-cross")
    .addParam("tokenid", "tokenid to be locked and crossed")
    .addOptionalParam("chainselector", "chain selector of destination chain")
    .addOptionalParam("receiver", "receiver in the destination chain")
    .setAction(async(taskArgs,hre) => {
        const tokenId = taskArgs.tokenid
        const {firstAccount} = await getNamedAccounts()
        console.log(`deployer is ${firstAccount}`)
        let destChainSelector
        let destReceiver
        if (taskArgs.chainselector) {
            destChainSelector = taskArgs.chainselector
        } else {
            console.log(`chainselector is not set`)
            destChainSelector = networkConfig[network.config.chainId].companionChainSelector
        }
        console.log(`the destChainSelector is ${destChainSelector}`)
        if (taskArgs.receiver) {
            destReceiver = taskArgs.receiver
        } else {
            console.log(`receiver is not set`)
            const nftBurnAndMint = await hre.companionNetworks["destChain"].deployments.get("NFTPoolBurnAndMint")
            destReceiver = nftBurnAndMint.address
        }
        console.log(`NFTPoolBurnAndMint address on destination chain is ${destReceiver}`)

        const linkTokenAddr = networkConfig[network.config.chainId].linkToken
        const linkToken = await ethers.getContractAt("LinkToken",linkTokenAddr)
        console.log(`linkToken addr is ${linkTokenAddr}`)
        const nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease",firstAccount)
        // transfer 10 link token from deployer to pool
        // const balanceBefore = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        // console.log(`balance before : ${balanceBefore}`)
        // const transferTx = await linkToken.transfer(nftPoolLockAndRelease.target, ethers.parseEther("10"))
        // await transferTx.wait(6)
        // const balanceAfter = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        // console.log(`balance after : ${balanceAfter}`)

        //approve the pool have the permission to transfer deployer's token
        const nft = await ethers.getContract("MyToken", firstAccount)
        await nft.approve(nftPoolLockAndRelease.target, tokenId)
        console.log(`approve successfully.`)
        
        //ccip send
        console.log(`${tokenId}, ${firstAccount}, ${destChainSelector}, ${destReceiver}`)
        try {
            const lockAndReleaseTx = await nftPoolLockAndRelease.lockAndSendNFT(
                tokenId,
                firstAccount,
                destChainSelector,
                destReceiver
            )
            console.log(`NFT locked and crossed, transaction hash is ${lockAndReleaseTx.hash}`)
            const receipt = await lockAndReleaseTx.wait();
            console.log(`Transaction confirmed in block ${receipt.blockNumber}`);


        } catch (e) {
            console.log("Revert reason:", e);
        }
    })