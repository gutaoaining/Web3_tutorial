// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";


contract MyNFTTokenByVRFPlus is ERC721, ERC721Enumerable, ERC721URIStorage, VRFConsumerBaseV2Plus {
    uint256 private _nextTokenId;
    uint256 s_subscriptionId;
    address vrfCoordinator = 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B;
    bytes32 s_keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    uint32 callbackGasLimit = 400000;
    uint16 requestConfirmations = 3;
    uint32 numWords =  1;
    mapping(uint256 => uint256) public requestIdToTokenIdMap;
    string constant public META_DATA_1 = "ipfs://QmYt7Vt3fgvQhuQJSGwa4XaKYmovzPxFomBf7anoH8KvKQ";
    string constant public META_DATA_2 = "ipfs://Qmcs98BAPaa5nVdrkHCqxVK19U3pqGM3NtfYXo1ojnKxaP";
    string constant public META_DATA_3 = "ipfs://QmQvBnT5u9A1icTN2hqd2PbHMQ23U746dta95zPP1fQWP8";
    event TokenURISet(uint256,string);

    constructor(uint256 subscriptionId)
        ERC721("MyNFTTokenByVRF", "VRFNFT")
        VRFConsumerBaseV2Plus(vrfCoordinator)
    {
        s_subscriptionId = subscriptionId;
    }

    function safeMint()
        public
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                // Set nativePayment to true to pay for VRF requests with Sepolia ETH instead of LINK
                extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: true}))
            })
        );
        requestIdToTokenIdMap[requestId] = tokenId;
        return tokenId;
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
    function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal override {
        uint256 randomWord = randomWords[0];
        uint256 tokenId = requestIdToTokenIdMap[requestId];
        string memory uri;
        if (randomWord % 3 == 0){
            uri = META_DATA_1;
        } else if (randomWord % 3 == 1){
            uri = META_DATA_2;
        } else {
            uri = META_DATA_3;
        }
        _setTokenURI(tokenId, uri);
        emit TokenURISet(tokenId, uri);
    }
}