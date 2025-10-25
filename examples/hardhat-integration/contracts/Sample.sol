// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Sample {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    // Vulnerable withdraw function
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount);
        
        // Reentrancy vulnerability
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        
        balances[msg.sender] -= amount;
    }
}
