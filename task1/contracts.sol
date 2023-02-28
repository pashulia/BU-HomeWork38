// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract Caller {

    function makeCall(address adr, bytes memory payload) public {
        (bool success, ) = adr.call(payload);
        require(success);
    }
}

contract Respondent {
    event eventCall(uint256 indexed, address indexed, string);

    function target(uint256 x, address adr, string memory str) public {
        emit eventCall(x, adr, str);
    }
}