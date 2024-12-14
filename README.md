# Charity Donation Platform

This repository provides the foundation for building the Charity Donation Platform using Hardhat. It includes everything needed to simplify Hardhat setup, configuration, and smart contract development, deployment, and testing. The platform is designed for secure, transparent, and accountable donations on the blockchain.

## Features
- Simplified Hardhat project setup.
- Smart contract for managing donation campaigns.
- Full support for testing and deployment.
- Configurable for Alchemy or Infura as the network provider.

## Getting Started
### Commands to Run After Cloning:

1. Install necessary dependencies:
   ```shell
   npm install
   npm i dotenv
   ```

2. Configure the `.env` file at the project root with the following variables:
   ```plaintext
   ALCHEMY_RPC_SEPOLIA=<Your_Alchemy_RPC_URL>
   WALLET_PRIVATE_KEY=<Your_Wallet_Private_Key>
   ```

3. In `hardhat.config.ts`, you can update the network URL to use Infura if you are not using Alchemy.

## Usage
### Smart Contract Setup
This project includes the Charity Donation Platform smart contract for managing donation campaigns. The contract provides:

- **Campaign Management**: Create and manage campaigns.
- **Donation Handling**: Accept donations securely.
- **Funds Withdrawal**: Allow campaign owners to withdraw funds.
- **Event Logging**: Maintain transparency with event-based logs.

### Commands

1. **Compile the Contract**
   ```shell
   npx hardhat compile
   ```

2. **Test the Contract**
   ```shell
   npx hardhat test
   ```

### Deployment
1. **Deploy Locally**
   ```shell
   npx hardhat run scripts/deploy.ts
   ```

2. **Deploy to Sepolia Testnet**
   ```shell
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

## Deployment Script Template
Below is the `deploy.ts` template used for deploying the smart contract:

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const CharityDonationPlatform = await ethers.getContractFactory("CharityDonationPlatform");

  // Deploy the contract
  const contract = await CharityDonationPlatform.deploy();

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
```

## Smart Contract Structure
The smart contract includes the following:

- **Campaign**: Tracks details like ID, title, description, target amount, funds raised, owner, and completion status.
- **Donor**: Records donor addresses and amounts donated.
- **Functions**:
  - `createCampaign`
  - `donateToCampaign`
  - `withdrawFunds`
- **Events**:
  - `CampaignCreated`
  - `DonationReceived`
  - `FundsWithdrawn`

## Testing
The contract includes test cases to validate functionality such as:

- Campaign creation.
- Donations to campaigns.
- Withdrawal of funds by campaign owners.

Run the tests with:
```shell
npx hardhat test
```

## Project Goals
This project aims to:
- Enable transparent and secure donations.
- Build trust with event logging and accountability.
- Demonstrate Solidity development skills using Hardhat.

---

### Let's build something impactful! 🚀
