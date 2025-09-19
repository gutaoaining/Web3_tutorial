//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract HelloWorld{

    string public sayHello;

    address public owner;

    mapping(address => string) public phrases; //key -> value

    mapping(address => bool) public passList;

    constructor(){
        owner = msg.sender;
        addPassList(owner);
    }

    function setHelloWorldPhrases(string memory newPhrases) public {
        require(passList[msg.sender],"you are not in the passList ");
        phrases[msg.sender] = newPhrases;
    }

    function addPassList(address addrToAdd) public onlyOwner(){
        passList[addrToAdd] = true;
    }

    modifier onlyOwner(){
        require(msg.sender == owner,"only owner can operate");
        _;
    }
}