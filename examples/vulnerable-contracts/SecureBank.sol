// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SecureBank
 * @notice Properly secured version following best practices
 * @dev Demonstrates secure patterns that N3 approves
 */
contract SecureBank is ReentrancyGuard, Ownable {
    mapping(address => uint256) public balances;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    event EmergencyWithdrawal(address indexed admin, uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev SECURE: Follows Checks-Effects-Interactions pattern
     * Uses ReentrancyGuard for additional protection
     */
    function withdraw(uint256 amount) external nonReentrant {
        // Checks
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // Effects - State changes BEFORE external calls
        balances[msg.sender] -= amount;
        
        // Interactions - External calls LAST
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @dev SECURE: Properly protected with onlyOwner
     */
    function emergencyWithdrawAll() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");
        
        emit EmergencyWithdrawal(msg.sender, balance);
    }
    
    /**
     * @dev Deposit function
     */
    function deposit() external payable {
        require(msg.value > 0, "Must deposit something");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Get user balance
     */
    function getUserBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    receive() external payable {
        balances[msg.sender] += msg.value;
    }
}
