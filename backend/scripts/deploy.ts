import { ethers } from "hardhat";

async function main() {
    const CharityDonationPlatform = await ethers.getContractFactory("CharityDonationPlatform");
    const charity = await CharityDonationPlatform.deploy();
    await charity.deployed();

    console.log("CharityDonationPlatform deployed to:", charity.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
