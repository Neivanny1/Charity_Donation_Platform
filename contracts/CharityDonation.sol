// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CharityDonationPlatform {
    /* VARIABLES AND MAPPINGS ARE DECLARED HERE */
    // struct to hold compaign data
    struct Campaign {
        uint256 id;
        string title;
        string description;
        uint256 targetAmount;
        uint256 raisedAmount;
        address payable owner;
        bool isCompleted;
    }
    // Struct to hold donor details
    struct Donor {
        address donorAddress;
        uint256 amount;
    }
    // variables
    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping (uint256 => Donor[]) public donations;

    /* EVENTS ARE DECLARED HERE */
    event CampaignCreated(uint256 campaignId, string title, address indexed owner);
    event DonationReceived(uint campaignId, address indexed donor, uint256 amount);
    event FundsWithdrawn(uint campaignId, uint256 amount);

    /* CONSTRUCTORS AND MODIFIERS ARE DECLARED HERE */
    // modifier to check onwership
    modifier onlyOnwer(uint256 campaignId) {
        require(msg.sender == campaigns[campaignId].owner, "You are not the campaign onwer");
        _;
    }

    // modifier to check if campaign exists
    modifier campaignExists(uint256 campaignId) {
        require(campaignId  < campaignCount, "The campaign doesn`t exist!");
        _;
    }

    /* FUNCTIONS */
    // Function to create a campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _targetAmount 
    ) public {
        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            title: _title,
            description: _description,
            targetAmount: _targetAmount,
            raisedAmount: 0,
            owner: payable(msg.sender),
            isCompleted: false
        });
        emit CampaignCreated(campaignCount, _title, msg.sender);
        campaignCount++;
    }

    // Function to handles funds send to compaign
    function donateToCampaign(uint256 _campaignId)
        public payable campaignExists(_campaignId) {
            require(!campaigns[_campaignId].isCompleted, "Campaign is completed");
            require(msg.value > 0, "Donation must be greater than 0");

            Campaign storage campaign = campaigns[_campaignId];
            campaign.raisedAmount += msg.value;
            donations[_campaignId].push(Donor({
                donorAddress: msg.sender,
                amount: msg.value
            }));
            emit DonationReceived(_campaignId, msg.sender, msg.value);
            if (campaign.raisedAmount >= campaign.targetAmount) {
                campaign.isCompleted = true;
            }
        }


    function withdrawFunds() public {}

}