//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract FaucetDemo{
    function withdraw(uint256 amount) public {
        require(amount <= 100000000000000000,"the amount must be lower than 0.1 ETH");
        payable(msg.sender).transfer(amount);
    }

    receive() external payable{}

    function getBalance() public view returns(uint256) {
        return address(this).balance;
    }
}