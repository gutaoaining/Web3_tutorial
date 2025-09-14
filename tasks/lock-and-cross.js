const { task } = require("hardhat/config")
const { networkConfig } = require("../helper-hardhat-config")

task("lock-and-cross")
    .addParam("tokenid", "tokenId to be locked and crossed")
    .addOptionalParam("chainselector", "chain selector of destination chain")
    .addOptionalParam("receiver", "receiver in the destination chain")
    .setAction(async(taskArgs, hre) => {
        // get tokenId from parameter
        const tokenId = taskArgs.tokenid

        const { firstAccount } = await getNamedAccounts()
        console.log(`deployer is ${firstAccount}`)

        // get receiver contract 
        // deployed contract will be used if there is no receiver provided
        let destReceiver
        if(taskArgs.receiver) {
            destReceiver = taskArgs.receiver
        } else {
            const nftBurnAndMint = await hre.companionNetworks["destChain"].deployments.get("NFTPoolBurnAndMint")
            destReceiver = nftBurnAndMint.address
        }
        console.log(`NFTPoolBurnAndMint address on destination chain is ${destReceiver}`)

        // get the chain selector of destination chain
        // deployed contract will be used if there is no chain selector provided
        let destChainSelector
        if(taskArgs.chainselector) {
            destChainSelector = taskArgs.chainselector
        } else {
            destChainSelector = networkConfig[network.config.chainId].companionChainSelector
        }
        console.log(`destination chain selector is ${destChainSelector}`)

        const linkTokenAddr = networkConfig[network.config.chainId].linkToken
        const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddr)
        const nftPoolLockAndRelease = await ethers
            .getContract("NFTPoolLockAndRelease", firstAccount)
        
        // transfer 10 LINK token from deployer to pool
        const balanceBefore = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        console.log(`balance before: ${balanceBefore}`)
        // const transferTx = await linkToken.transfer(nftPoolLockAndRelease.target, ethers.parseEther("10"))
        // await transferTx.wait(6)
        const balanceAfter = await linkToken.balanceOf(nftPoolLockAndRelease.target)
        console.log(`balance after: ${balanceAfter}`)

 
        // approve the pool have the permision to transfer deployer's token
        const nft = await ethers.getContract("MyToken", firstAccount)
        const owner = await nft.ownerOf(tokenId);
        const [deployer] = await ethers.getSigners();
        console.log("NFT owner: ", owner);
        console.log("Deployer address: ", deployer.address);

        const approveTx = await nft.approve(nftPoolLockAndRelease.target, tokenId)
        await approveTx.wait(2);
        console.log("approve successfully")
        const approved = await nft.getApproved(tokenId);
        console.log("Approved address: ", approved);
        console.log("nftPoolLockAndRelease.target: ", nftPoolLockAndRelease.target);

        console.log("Approval confirmed with hash:", approveTx.hash);

        // ccip send
        console.log(`${tokenId}, ${firstAccount}, ${destChainSelector}, ${destReceiver}`)

        const ccipRouter = await nftPoolLockAndRelease.getRouter();
        console.log("CCIP Router address: ", ccipRouter);
            try {
            const gasEstimate = await nftPoolLockAndRelease.lockAndSendNFT.estimateGas(
                tokenId,
                firstAccount,
                destChainSelector,
                destReceiver
            );
            console.log("Gas estimate: ", gasEstimate.toString());
        } catch (estimateError) {
            console.error("Gas estimate failed:", estimateError.reason || estimateError.message);
            return; // 如果gas估算失败，停止执行
        }

        
        const lockAndCrossTx = await nftPoolLockAndRelease
            .lockAndSendNFT(
            tokenId, 
            firstAccount, 
            destChainSelector, 
            destReceiver,
            {
                gasLimit: 300000, // 添加足够的gas限制
            }
        )
        
        // provide t
        console.log(`NFT locked and crossed, transaction hash is ${lockAndCrossTx.hash}`)
        // 等待交易确认
        const receipt = await lockAndCrossTx.wait(2);
        console.log("Transaction confirmed in block:", receipt.blockNumber);
        console.log("Status:", receipt.status === 1 ? "Success" : "Failed");
})

module.exports = {}