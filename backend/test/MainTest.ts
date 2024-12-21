import { expect } from "chai";
import { ethers } from "hardhat";
import { CharityDonationPlatform } from "../typechain"; // Import the generated contract type

describe("CharityDonationPlatform", function () {
    let charityDonationPlatform: CharityDonationPlatform;
    let admin: any;
    let donor: any;
    let campaignOwner: any;
    let otherDonor: any;
    let campaignId: number;
    let title = "Help Children";
    let description = "Campaign to support underprivileged children";
    let targetAmount = ethers.utils.parseEther("10");

    beforeEach(async function () {
        // Deploying the CharityDonationPlatform contract
        [admin, donor, campaignOwner, otherDonor] = await ethers.getSigners();

        const CharityDonationPlatformFactory = await ethers.getContractFactory("CharityDonationPlatform");
        charityDonationPlatform = await CharityDonationPlatformFactory.deploy();
        await charityDonationPlatform.deployed();
    });

    it("should create a campaign", async function () {
        // Campaign owner creates a new campaign
        await charityDonationPlatform.connect(campaignOwner).createCampaign(title, description, targetAmount);

        // Get the campaign data
        const campaign = await charityDonationPlatform.campaigns(0);
        
        // Assert campaign data is set correctly
        expect(campaign.title).to.equal(title);
        expect(campaign.description).to.equal(description);
        expect(campaign.targetAmount).to.equal(targetAmount);
        expect(campaign.owner).to.equal(campaignOwner.address);
    });

    it("should allow donation to a campaign", async function () {
        // Create a campaign
        await charityDonationPlatform.connect(campaignOwner).createCampaign(title, description, targetAmount);

        // Donor donates to the campaign
        const donationAmount = ethers.utils.parseEther("2");
        await charityDonationPlatform.connect(donor).donateToCampaign(0, { value: donationAmount });

        // Verify the raised amount is updated
        const campaign = await charityDonationPlatform.campaigns(0);
        expect(campaign.raisedAmount).to.equal(donationAmount);

        // Verify the donor's donation
        const donation = await charityDonationPlatform.donations(0, 0);
        expect(donation.donorAddress).to.equal(donor.address);
        expect(donation.amount).to.equal(donationAmount);
    });

    it("should mark campaign as completed when target is reached", async function () {
        // Create a campaign
        await charityDonationPlatform.connect(campaignOwner).createCampaign(title, description, targetAmount);

        // Donate enough funds to complete the campaign
        await charityDonationPlatform.connect(donor).donateToCampaign(0, { value: targetAmount });

        // Verify the campaign is completed
        const campaign = await charityDonationPlatform.campaigns(0);
        expect(campaign.isCompleted).to.be.true;
    });

    it("should allow campaign owner to withdraw funds", async function () {
        // Create a campaign
        await charityDonationPlatform.connect(campaignOwner).createCampaign(title, description, targetAmount);

        // Donor donates to the campaign
        const donationAmount = ethers.utils.parseEther("2");
        await charityDonationPlatform.connect(donor).donateToCampaign(0, { value: donationAmount });

        // Campaign owner withdraws funds
        await expect(() =>
            charityDonationPlatform.connect(campaignOwner).withdrawFunds(0, donationAmount)
        ).to.changeEtherBalances([campaignOwner, charityDonationPlatform], [donationAmount, -donationAmount]);

        // Verify the raised amount is updated
        const campaign = await charityDonationPlatform.campaigns(0);
        expect(campaign.raisedAmount).to.equal(0);
    });

    it("should revert if non-owner tries to withdraw funds", async function () {
        // Create a campaign
        await charityDonationPlatform.connect(campaignOwner).createCampaign(title, description, targetAmount);

        // Donor donates to the campaign
        const donationAmount = ethers.utils.parseEther("2");
        await charityDonationPlatform.connect(donor).donateToCampaign(0, { value: donationAmount });

        // Attempt withdrawal by someone who is not the owner
        await expect(
            charityDonationPlatform.connect(otherDonor).withdrawFunds(0, donationAmount)
        ).to.be.revertedWith("Not the campaign owner");
    });

    it("should revert if campaign does not exist", async function () {
        // Attempt donation to a non-existing campaign
        await expect(
            charityDonationPlatform.connect(donor).donateToCampaign(0, { value: ethers.utils.parseEther("1") })
        ).to.be.revertedWith("Campaign does not exist");
    });

    it("should revert if donation amount is 0", async function () {
        // Create a campaign
        await charityDonationPlatform.connect(campaignOwner).createCampaign(title, description, targetAmount);

        // Attempt to donate with 0 amount
        await expect(
            charityDonationPlatform.connect(donor).donateToCampaign(0, { value: 0 })
        ).to.be.revertedWith("Donation must be greater than 0");
    });

    it("should revert if withdrawing more than available funds", async function () {
        // Create a campaign
        await charityDonationPlatform.connect(campaignOwner).createCampaign(title, description, targetAmount);

        // Donor donates to the campaign
        const donationAmount = ethers.utils.parseEther("2");
        await charityDonationPlatform.connect(donor).donateToCampaign(0, { value: donationAmount });

        // Attempt to withdraw more than the raised amount
        await expect(
            charityDonationPlatform.connect(campaignOwner).withdrawFunds(0, ethers.utils.parseEther("3"))
        ).to.be.revertedWith("Insufficient funds");
    });
});
