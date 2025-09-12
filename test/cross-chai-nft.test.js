const { getNamedAccounts, ethers } = require("hardhat")
const { expect } = require("chai")

let firstAccount
let ccipSimulator
let nft
let nftPoolLockAndRelease
let wnft
let nftPoolBurnAndMint
before(async function() {
    //prepare: variables: contract ,account

    firstAccount = (await getNamedAccounts()).firstAccount
    await deployments.fixture(["all"])
    ccipSimulator = await ethers.getContract("CCIPLocalSimulator",firstAccount)
    nft = await ethers.getContract("MyToken",firstAccount)
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease",firstAccount)
    wnft = await ethers.getContract("WrappedMyToken",firstAccount)
    // nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint",firstAccount)
})

describe("source chain -> dest chain tests", async function() {
    it("test if user can mint a nft from nft contract successfully", async function() {
        await nft.safeMint(firstAccount)
        const onwer = await nft.ownerOf(0)
        expect(onwer).to.equal(firstAccount)
    })
})



// test if user can lock the nft in the pool and send ccip message on source chain

// test if user can get a wrapped nft in dest chain

//dest chain -> source chain
//test if user can burn the wnft and send ccip message on dest chain

//test if user have the nft unlocked on source chain