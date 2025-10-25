// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title N3SecurityOracle
 * @dev Emits security scan events for indexing by Envio
 */
contract N3SecurityOracle {
    
    // Events that Envio will index
    event VulnerabilityDetected(
        address indexed contractAddress,
        string vulnType,
        uint8 severity,
        uint256 timestamp
    );
    
    event SecurityScanCompleted(
        address indexed contractAddress,
        uint256 riskScore,
        uint256 timestamp
    );
    
    event ContractDeployed(
        address indexed contractAddress,
        address indexed deployer,
        uint256 timestamp
    );
    
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    /**
     * @dev Report a vulnerability detection
     */
    function reportVulnerability(
        address contractAddress,
        string memory vulnType,
        uint8 severity
    ) public onlyOwner {
        emit VulnerabilityDetected(
            contractAddress,
            vulnType,
            severity,
            block.timestamp
        );
    }
    
    /**
     * @dev Report a completed security scan
     */
    function reportScanCompleted(
        address contractAddress,
        uint256 riskScore
    ) public onlyOwner {
        emit SecurityScanCompleted(
            contractAddress,
            riskScore,
            block.timestamp
        );
    }
    
    /**
     * @dev Report a contract deployment
     */
    function reportContractDeployment(
        address contractAddress,
        address deployer
    ) public onlyOwner {
        emit ContractDeployed(
            contractAddress,
            deployer,
            block.timestamp
        );
    }
    
    /**
     * @dev Batch report vulnerabilities and complete scan
     */
    function reportBatchScan(
        address contractAddress,
        address deployer,
        string[] memory vulnTypes,
        uint8[] memory severities,
        uint256 riskScore
    ) public onlyOwner {
        require(vulnTypes.length == severities.length, "Array length mismatch");
        
        // Report deployment
        emit ContractDeployed(contractAddress, deployer, block.timestamp);
        
        // Report each vulnerability
        for (uint i = 0; i < vulnTypes.length; i++) {
            emit VulnerabilityDetected(
                contractAddress,
                vulnTypes[i],
                severities[i],
                block.timestamp
            );
        }
        
        // Report scan completion
        emit SecurityScanCompleted(contractAddress, riskScore, block.timestamp);
    }
}
