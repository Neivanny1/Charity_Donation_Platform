import { ethers } from "hardhat";
import { expect } from "chai";

describe("CharityDonationPlatform", function () {
    let charityContract: any;
    let adminContract: any;
    let owner: any;
    let addr1: any;
    let addr2: any;

    beforeEach(async function () {
        // Deploy Admin contract
        const Admin = await ethers.getContractFactory("Admin");
        adminContract = await Admin.deploy();
        await adminContract.deployed();

        // Deploy CharityDonationPlatform contract
        const CharityDonationPlatform = await ethers.getContractFactory("CharityDonationPlatform");
        [owner, addr1, addr2] = await ethers.getSigners();
        charityContract = await CharityDonationPlatform.deploy();
        await charityContract.deployed();
    });

    it("Should create a new campaign", async function () {
        await charityContract.createCampaign(
            "Save the Forest",
            "Plant trees worldwide",
            ethers.parseUnits("10", "ether")
        );
        const campaign = await charityContract.campaigns(0);

        expect(campaign.title).to.equal("Save the Forest");
        expect(campaign.description).to.equal("Plant trees worldwide");
        expect(campaign.targetAmount.toString()).to.equal(ethers.parseUnits("10", "ether").toString());
        expect(campaign.raisedAmount.toString()).to.equal("0");
        expect(campaign.owner).to.equal(owner.address);
    });

    it("Should allow a user to donate to a campaign", async function () {
        await charityContract.createCampaign(
            "Save the Ocean",
            "Clean up the oceans",
            ethers.parseUnits("5", "ether")
        );

        await charityContract.connect(addr1).donateToCampaign(0, {
            value: ethers.parseUnits("2", "ether"),
        });
        const campaign = await charityContract.campaigns(0);

        expect(campaign.raisedAmount.toString()).to.equal(ethers.parseUnits("2", "ether").toString());

        const donation = await charityContract.donations(0, 0);
        expect(donation.donorAddress).to.equal(addr1.address);
        expect(donation.amount.toString()).to.equal(ethers.parseUnits("2", "ether").toString());
    });

    it("Should allow the owner to withdraw funds", async function () {
        await charityContract.createCampaign(
            "Build a School",
            "Support education",
            ethers.parseUnits("10", "ether")
        );
        await charityContract.connect(addr1).donateToCampaign(0, {
            value: ethers.parseUnits("5", "ether"),
        });

        // Get balances as BigNumbers
        const initialBalance = ethers.BigNumber.from(await ethers.provider.getBalance(owner.address));
        const tx = await charityContract.withdrawFunds(0, ethers.parseUnits("3", "ether"));
        const receipt = await tx.wait();

        const gasUsed = receipt.gasUsed.mul(receipt.effectiveGasPrice); // BigNumber operation
        const finalBalance = ethers.BigNumber.from(await ethers.provider.getBalance(owner.address));

        // BigNumber calculations for balance validation
        const balanceDifference = finalBalance.add(gasUsed).sub(initialBalance);
        expect(balanceDifference.toString()).to.equal(ethers.parseUnits("3", "ether").toString());

        const campaign = await charityContract.campaigns(0);
        expect(campaign.raisedAmount.toString()).to.equal(ethers.parseUnits("2", "ether").toString());
    });

    it("Should revert if non-owner tries to withdraw funds", async function () {
        await charityContract.createCampaign(
            "Help Wildlife",
            "Protect endangered species",
            ethers.parseUnits("8", "ether")
        );
        await charityContract.connect(addr1).donateToCampaign(0, {
            value: ethers.parseUnits("4", "ether"),
        });

        await expect(
            charityContract.connect(addr2).withdrawFunds(0, ethers.parseUnits("2", "ether"))
        ).to.be.revertedWith("Not the campaign owner");
    });

    it("Should revert if donation amount is zero", async function () {
        await charityContract.createCampaign(
            "Support Orphans",
            "Provide food and education",
            ethers.parseUnits("5", "ether")
        );

        await expect(
            charityContract.connect(addr1).donateToCampaign(0, { value: 0 })
        ).to.be.revertedWith("Donation must be greater than 0");
    });

    it("Should allow admin to transfer admin role", async function () {
        await adminContract.transferAdminRole(addr1.address);

        const newAdmin = await adminContract.admin();
        expect(newAdmin).to.equal(addr1.address);
    });
});
