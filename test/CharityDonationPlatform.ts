import { ethers } from "hardhat";
import { expect } from "chai";

describe("CharityDonationPlatform", function () {
  let CharityDonationPlatform: any;
  let charity: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    CharityDonationPlatform = await ethers.getContractFactory("CharityDonationPlatform");
    [owner, addr1, addr2] = await ethers.getSigners();
    charity = await CharityDonationPlatform.deploy();
    await charity.deployed();
  });

  it("Should allow campaign creation", async function () {
    await charity.createCampaign("Test Campaign", "Description", 100);
    const campaign = await charity.campaigns(0);

    expect(campaign.title).to.equal("Test Campaign");
    expect(campaign.description).to.equal("Description");
    expect(campaign.targetAmount).to.equal(100);
    expect(campaign.raisedAmount).to.equal(0);
    expect(campaign.owner).to.equal(owner.address);
  });

  it("Should allow donations", async function () {
    await charity.createCampaign("Test Campaign", "Description", 100);

    await charity.connect(addr1).donateToCampaign(0, { value: ethers.utils.parseEther("1") });
    const campaign = await charity.campaigns(0);

    expect(campaign.raisedAmount).to.equal(ethers.utils.parseEther("1"));
    const donations = await charity.donations(0, 0);
    expect(donations.donorAddress).to.equal(addr1.address);
    expect(donations.amount).to.equal(ethers.utils.parseEther("1"));
  });

  it("Should allow fund withdrawal by owner", async function () {
    await charity.createCampaign("Test Campaign", "Description", 100);
    await charity.connect(addr1).donateToCampaign(0, { value: ethers.utils.parseEther("1") });

    await charity.withdrawFunds(0, ethers.utils.parseEther("0.5"));
    const campaign = await charity.campaigns(0);

    expect(campaign.raisedAmount).to.equal(ethers.utils.parseEther("0.5"));
  });

  it("Should not allow non-owner to withdraw funds", async function () {
    await charity.createCampaign("Test Campaign", "Description", 100);
    await charity.connect(addr1).donateToCampaign(0, { value: ethers.utils.parseEther("1") });

    await expect(
      charity.connect(addr2).withdrawFunds(0, ethers.utils.parseEther("0.5"))
    ).to.be.revertedWith("Not the campaign owner");
  });
});
