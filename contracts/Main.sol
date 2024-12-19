// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Admin.sol";
import "./Utils.sol";

contract CharityDonationPlatform is Admin {
    using Utils for Utils.Campaign;

    uint public campaignCount;
    mapping(uint => Utils.Campaign) public campaigns;
    mapping(uint => Utils.Donor[]) public donations;


    // Modifier to check if a campaign exists
    modifier campaignExists(uint campaignId) {
        require(campaignId < campaignCount, "Campaign does not exist");
        _;
    }

    // Modifier to ensure only the campaign owner can perform certain actions
    modifier onlyCampaignOwner(uint campaignId) {
        require(msg.sender == campaigns[campaignId].owner, "Not the campaign owner");
        _;
    }

    // Function to create a new campaign
    function createCampaign(
        string memory title,
        string memory description,
        uint targetAmount
    ) public {
        campaigns[campaignCount] = Utils.Campaign({
            id: campaignCount,
            title: title,
            description: description,
            targetAmount: targetAmount,
            raisedAmount: 0,
            owner: payable(msg.sender),
            isCompleted: false
        });

        emit Utils.CampaignCreated(campaignCount, title, msg.sender);
        campaignCount++;
    }

    // Function to donate to an existing campaign
    function donateToCampaign(uint campaignId) public payable campaignExists(campaignId) {
        require(msg.value > 0, "Donation must be greater than 0");
        Utils.Campaign storage campaign = campaigns[campaignId];

        require(!campaign.isCompleted, "Campaign is already completed");
        campaign.raisedAmount += msg.value;

        donations[campaignId].push(Utils.Donor({
            donorAddress: msg.sender,
            amount: msg.value
        }));

        emit Utils.DonationReceived(campaignId, msg.sender, msg.value);

        if (campaign.raisedAmount >= campaign.targetAmount) {
            campaign.isCompleted = true;
        }
    }

    // Function to withdraw funds from a campaign
    function withdrawFunds(uint campaignId, uint amount)
        public
        campaignExists(campaignId)
        onlyCampaignOwner(campaignId)
    {
        Utils.Campaign storage campaign = campaigns[campaignId];
        require(amount <= campaign.raisedAmount, "Insufficient funds");

        campaign.raisedAmount -= amount;
        campaign.owner.transfer(amount);

        emit Utils.FundsWithdrawn(campaignId, amount);
    }
}
