// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract MyNFTTokenByVRF is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, VRFConsumerBaseV2 {
    uint256 private _nextTokenId;
    VRFCoordinatorV2Interface COORDINATOR;
    uint64 s_subscriptionId;
    address vrfCoordinator = 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625;
    bytes32 s_keyHash = 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;
    uint32 callbackGasLimit = 400000;
    uint16 requestConfirmations = 3;
    uint32 numWords =  1;
    uint256 public REQUEST_ID;
    uint256 public NOW_TOKEN_ID;
    string public NOW_URI;
    mapping(uint256 => uint256) public requestIdToTokenIdMap;
    string constant public META_DATA_1 = "ipfs://QmYt7Vt3fgvQhuQJSGwa4XaKYmovzPxFomBf7anoH8KvKQ";
    string constant public META_DATA_2 = "ipfs://Qmcs98BAPaa5nVdrkHCqxVK19U3pqGM3NtfYXo1ojnKxaP";
    string constant public META_DATA_3 = "ipfs://QmQvBnT5u9A1icTN2hqd2PbHMQ23U746dta95zPP1fQWP8";


    constructor(address initialOwner, uint64 subscriptionId)
        ERC721("MyNFTTokenByVRF", "VRFNFT")
        Ownable(initialOwner)
        VRFConsumerBaseV2(vrfCoordinator)
    {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_subscriptionId = subscriptionId;
    }

    function safeMint()
        public
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        uint256 requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        requestIdToTokenIdMap[requestId] = tokenId;
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // fulfillRandomWords function
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 randomWord = randomWords[0];
        uint256 tokenId = requestIdToTokenIdMap[requestId];
        if (randomWord % 3 == 0){
            _setTokenURI(tokenId, META_DATA_1);//币
            log(requestId, META_DATA_1, tokenId);
        } else if (randomWord % 3 == 1){
            _setTokenURI(tokenId, META_DATA_2);//佐菲
            log(requestId, META_DATA_1, tokenId);

        } else {
            _setTokenURI(tokenId, META_DATA_3);//赛文
            log(requestId, META_DATA_1, tokenId);

        }
        
    }

    function log(uint256 requestId, string memory url, uint256 tokenId) internal {
        REQUEST_ID = requestId;
        NOW_TOKEN_ID = tokenId;
        NOW_URI = url;
    }
}