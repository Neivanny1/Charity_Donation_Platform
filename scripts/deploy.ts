import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const Counter = await ethers.getContractFactory("Counter");
  
  // Deploy the contract
  const contract = await Counter.deploy();
  
  // Wait for the contract to be deployed
  await contract.deploymentTransaction()?.wait();
  
  console.log(`Contract deployed to: ${await contract.getAddress()}`);
}

// Recommended pattern for handling async errors
main()
.then(() => process.exit(0))
.catch((error) => {
console.error(error);
process.exit(1);
});