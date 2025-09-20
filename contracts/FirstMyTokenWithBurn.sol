//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {FirstMyToken} from "./FirstMyToken.sol";

contract FirstMyTokenWithBurn is FirstMyToken {

    constructor(string memory tokenName, string memory tokenSymbol) FirstMyToken(tokenName, tokenSymbol){}

    function burn(uint256 tokenAmount) public {
        require(balances[msg.sender] >= tokenAmount, "your balance is not enough.");
        balances[msg.sender] -= tokenAmount;
        totalSupply -= tokenAmount;
    }
}