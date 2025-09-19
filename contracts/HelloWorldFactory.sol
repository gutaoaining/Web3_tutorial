//SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;
import {HelloWorld} from "./HelloWorld.sol";

contract HelloWorldFactory{

    HelloWorld[] public hws;

    function createHelloWorldContract() public {
        HelloWorld hw = new HelloWorld();
        hws.push(hw);
    }

    function setHelloWorldPhraseByIndex(uint256 index, string memory newPhrase) public{
        hws[index].setHelloWorldPhrases(newPhrase);
    }

    function readHelloWorldPhraseByIndex(uint256 index) public view returns(string memory){
        //读取 HelloWorldFactory 这个工厂合约在对应的 HelloWorld 子合约中自己名下的那条记录
        return hws[index].phrases(address(this));
    }
}