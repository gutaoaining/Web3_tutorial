//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract FirstMyToken {

    string public tokenName;
    string public tokenSymbol;
    uint256 public totalSupply;

    constructor(string memory _tokenName, string memory _tokenSymbol){
        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
    }

    mapping(address => uint256) public balances;

    function mint(uint256 tokenAmount) public {
        balances[msg.sender] += tokenAmount;
        totalSupply += tokenAmount;
    }

    function transfer(uint256 tokenAmount, address payeeAddress) public {
        require(balances[msg.sender] >= tokenAmount, "your balance is not enough.");
        balances[msg.sender] -= tokenAmount;
        balances[payeeAddress] += tokenAmount;
    }
}