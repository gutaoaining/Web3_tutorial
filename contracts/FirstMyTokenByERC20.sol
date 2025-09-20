// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity ^0.8.27;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


contract FirstMyTokenByERC20 is ERC20 {

    uint256 public minimum_value = 10 * 10 ** 18;//0x694AA1769357215DE4FAC081bf1f309aDC325306

    AggregatorV3Interface internal dataFeed = AggregatorV3Interface(0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43);
    
    constructor() ERC20("FirstMyTokenByERC20", "FMTERC20") {}

    function mint() public payable {
        require(getChainlinkDataFeedLatestAnswer(msg.value) >= (100 * 10 ** 18), "send more eth");
        _mint(msg.sender, minimum_value);
    }

    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer(uint256 ethAmount) public view returns (uint256) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return (ethAmount * uint256(answer) / (10 ** 8));
    }
}
