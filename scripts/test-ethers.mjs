import "./hardhat.config.js";
import hre from "hardhat";

console.log("hre keys:", Object.keys(hre));
console.log("hre.ethers:", hre.ethers);
console.log("hre.ethers type:", typeof hre.ethers);

if (hre.ethers) {
  console.log("ethers methods:", Object.keys(hre.ethers));
}
