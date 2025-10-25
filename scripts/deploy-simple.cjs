const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("???? Deploying N3SecurityOracle (Template-Based Scanner)...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  const N3SecurityOracle = await hre.ethers.getContractFactory("N3SecurityOracle");
  const oracle = await N3SecurityOracle.deploy();
  
  await oracle.waitForDeployment();
  
  const oracleAddress = await oracle.getAddress();
  
  console.log("??? N3SecurityOracle deployed to:", oracleAddress);
  console.log("\n???? This contract stores results from N3's template-based scanner");
  console.log("   Templates: SWC, DeFi, Smart Contract patterns");
  
  // Emit test events
  console.log("\n???? Emitting test vulnerability events...");
  
  const tx = await oracle.reportBatchScan(
    "0x1234567890123456789012345678901234567890",
    deployer.address,
    ["reentrancy-001", "access-001", "oracle-001"],
    [4, 3, 4],
    45
  );
  
  await tx.wait();
  console.log("??? Template scan results stored on-chain!");
  
  const deploymentInfo = {
    network: (await hre.ethers.provider.getNetwork()).name,
    contractAddress: oracleAddress,
    deployer: deployer.address,
    scanner: "N3 Template-Based Vulnerability Scanner"
  };
  
  fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("\n???? Deployment info saved");
}

main().catch(console.error);
