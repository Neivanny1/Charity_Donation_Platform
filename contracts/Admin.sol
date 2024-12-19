// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Admin {
    address public admin;

    event AdminChanged(address indexed previousAdmin, address indexed newAdmin);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function transferAdminRole(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "New admin cannot be zero address");
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }
}
