// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Counter {
    uint8 public count;

    function getCount() public view returns (uint8) {
        return count;
    }

    function increment() public {
        count += 1;
    }

    function decrement() public {
        count -= 1;
    }

    function hello(string memory _name) public pure returns (string memory) {
        return string(abi.encodePacked("Hello ", _name));    
    }
}