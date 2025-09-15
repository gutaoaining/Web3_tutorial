const { task } = require("hardhat/config")
const { networkConfig } = require("../helper-hardhat-config")

task("burn-and-cross")
    .addParam("tokenid", "tokenId to be burn and crossed")
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
            const nftPoolLockAndRelease = await hre.companionNetworks["destChain"].deployments.get("NFTPoolLockAndRelease")
            destReceiver = nftPoolLockAndRelease.address
        }
        console.log(`nftPoolLockAndRelease address on destination chain is ${destReceiver}`)

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
        const nftPoolBurnAndMint = await ethers
            .getContract("NFTPoolBurnAndMint", firstAccount)
        
        // transfer 10 LINK token from deployer to pool
        const balanceBefore = await linkToken.balanceOf(nftPoolBurnAndMint.target)
        console.log(`balance before: ${balanceBefore}`)
        const transferTx = await linkToken.transfer(nftPoolBurnAndMint.target, ethers.parseEther("10"))
        await transferTx.wait(6)
        const balanceAfter = await linkToken.balanceOf(nftPoolBurnAndMint.target)
        console.log(`balance after: ${balanceAfter}`)

 
        // approve the pool have the permision to transfer deployer's token
        const wnft = await ethers.getContract("WrappedMyToken", firstAccount)
        const owner = await wnft.ownerOf(tokenId);
        const [deployer] = await ethers.getSigners();
        console.log("NFT owner: ", owner);
        console.log("Deployer address: ", deployer.address);

        const approveTx = await wnft.approve(nftPoolBurnAndMint.target, tokenId)
        await approveTx.wait(2);
        console.log("approve successfully")
        const approved = await wnft.getApproved(tokenId);
        console.log("Approved address: ", approved);
        console.log("nftPoolBurnAndMint.target: ", nftPoolBurnAndMint.target);

        console.log("Approval confirmed with hash:", approveTx.hash);

        // ccip send
        console.log(`${tokenId}, ${firstAccount}, ${destChainSelector}, ${destReceiver}`)

        const ccipRouter = await nftPoolBurnAndMint.getRouter();
        console.log("CCIP Router address: ", ccipRouter);
            try {
            const gasEstimate = await nftPoolBurnAndMint.burnAndSendNFT.estimateGas(
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

        
        const burnAndCrossTx = await nftPoolBurnAndMint
            .burnAndSendNFT(
            tokenId, 
            firstAccount, 
            destChainSelector, 
            destReceiver,
            {
                gasLimit: 300000, // 添加足够的gas限制
            }
        )
        
        // provide t
        console.log(`WNFT burn and crossed, transaction hash is ${burnAndCrossTx.hash}`)
        // 等待交易确认
        const receipt = await burnAndCrossTx.wait(2);
        console.log("Transaction confirmed in block:", receipt.blockNumber);
        console.log("Status:", receipt.status === 1 ? "Success" : "Failed");
})

module.exports = {}