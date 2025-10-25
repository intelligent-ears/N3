import hre from "hardhat";
import fs from "fs";
import "@nomicfoundation/hardhat-ethers";

async function main() {
  console.log("🚀 Deploying N3SecurityOracle...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  const N3SecurityOracle = await hre.ethers.getContractFactory("N3SecurityOracle");
  const oracle = await N3SecurityOracle.deploy();
  
  await oracle.waitForDeployment();
  
  const oracleAddress = await oracle.getAddress();
  
  console.log("✅ N3SecurityOracle deployed to:", oracleAddress);
  console.log("\n📋 Next steps:");
  console.log("1. Update packages/envio-indexer/config.yaml with this address");
  console.log("2. Add RPC URL to config.yaml");
  console.log("3. Run 'envio dev' to start indexing");
  console.log("\n🔗 View on block explorer:");
  
  const network = await hre.ethers.provider.getNetwork();
  const chainId = network.chainId;
  
  if (chainId === 11155111n) {
    console.log(`https://sepolia.etherscan.io/address/${oracleAddress}`);
  } else if (chainId === 1n) {
    console.log(`https://etherscan.io/address/${oracleAddress}`);
  } else {
    console.log(`Chain ID: ${chainId}`);
  }
  
  // Emit some test events
  console.log("\n🧪 Emitting test events...");
  
  const testContract = "0x1234567890123456789012345678901234567890";
  const testDeployer = deployer.address;
  
  // Report a batch scan with vulnerabilities
  const vulnTypes = ["reentrancy-001", "access-001", "oracle-001"];
  const severities = [4, 3, 4]; // 4=CRITICAL, 3=HIGH
  const riskScore = 45;
  
  const tx = await oracle.reportBatchScan(
    testContract,
    testDeployer,
    vulnTypes,
    severities,
    riskScore
  );
  
  await tx.wait();
  
  console.log("✅ Test events emitted!");
  console.log("   - 1 ContractDeployed event");
  console.log("   - 3 VulnerabilityDetected events");
  console.log("   - 1 SecurityScanCompleted event");
  console.log("\nTransaction hash:", tx.hash);
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: chainId.toString(),
    contractAddress: oracleAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    txHash: tx.hash
  };
  
  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
