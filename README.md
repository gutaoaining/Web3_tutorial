内容介绍
1、如何使用
    将 repo clone到本地： git clone https://github.com/gutaoaining/Web3_tutorial.git
    进入 lesson-4 文件夹 cd Web3_tutorial_Chinese/lesson-4
    安装 NPM package
    运行 npm install 安装 NPM package
    添加环境变量
    npx hardhat env-enc set-pw 为 .env.enc 设置密码
    添加环境变量npx hardhat env-enc set: PRIVATE_KEY, PRIVATE_KEY_1, SEPOLIA_RPC_URL 和 ETHERSCAN_API_KEY
    编译并且与 FundMe.sol 交互
    npx hardhat run scripts/deployFundMe.js --network sepolia 运行 deploy 脚本。
    在 Sepolia 区块链浏览器中查看验证的合约
    [可选] 运行 npx hardhat deploy-fundme --network sepolia 通过hardhat task部署FundMe合约
    [可选] 运行 npx hardhat fund-fundme --network sepolia通过hardhat task与FundMe合约交互


2、构建一个 ERC721 的合约，让这个合约可以被从 Sepolia 区块链被跨链跨到 Amoy 区块链。

    完成整个过程需要先在 Sepolia 区块链部署合约：

    ERC-721合约 MyToken：这个合约是我们需要用到的 NFT
    NFTPoolLockAndRelease：用来锁定用户合约，并且执行跨链操作，在 Amoy 区块链上铸造一个新的 NFT
    在 Amoy 区块链上部署合约

    基于 ERC-721 合约的包装合约 WrappedMyToken：这个合约会用来铸造和燃烧 NFT，因为 NFT 的主合约在 Sepolia 上，所在 Amoy 的 NFT 合约需要先进行铸造。
    NFTPoolMintAndBurn：通过 ccipReceive 来接受跨链消息，然后基于消息内容铸造 NFT，同时在 Amoy 中的 NFT 跨链回到 Sepolia 的时候，将 NFT 进行燃烧。

    安装 npm package：npm install

    测试合约：npx hardhat test，此过程使用到了 chainlink-local，会在链下模拟 ccip 行为

    通过 env-enc 添加配置信息：

    npx env-enc set-pw
    npx env-enc set
    依次加入环境变量：

    PRIVATE_KEY
    SEPOLIA_RPC_URL
    AMOY_RPC_URL
    在 source chain 部署合约：npx hardhat deploy --tags sourcechain --network sepolia，如果你在上一步使用的sepolia 和 amoy，那么请相应调整 network 名字

在 dest chain 部署合约：npx hardhat deploy --tags destchain --network amoy 如果你在上一步使用的不是 sepolia 和 amoy，那么请相应调整 network 名字

    a、铸造 nft：npx hardhat mint-nft --network sepolia

    b、查看 nft 状态：npx hardhat check-nft --network sepolia

    c、锁定并且跨链 nft：npx hardhat lock-and-cross --tokenid 0 --network sepolia

    d、查看 wrapped NFT 状态：npx hardhat check-wrapped-nft --tokenid 0 --network amoy

    e、燃烧并且跨链 wnft：npx hardhat burn-and-cross --tokenid 0 --network amoy

    7、再次查看 nft 状态：npx hardhat check-nft --network sepolia

3、构建一个 ERC20 的合约，让这个合约可以进行fund，然后铸造token