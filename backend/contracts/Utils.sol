// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library Utils {
    // Structs
    struct Campaign {
        uint id;
        string title;
        string description;
        uint targetAmount;
        uint raisedAmount;
        address payable owner;
        bool isCompleted;
    }

    struct Donor {
        address donorAddress;
        uint amount;
    }

    // Events
    event CampaignCreated(uint indexed campaignId, string title, address indexed owner);
    event DonationReceived(uint indexed campaignId, address indexed donor, uint amount);
    event FundsWithdrawn(uint indexed campaignId, uint amount);

    // Price Conversion Functions
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        (, int256 answer,,,) = priceFeed.latestRoundData();
        // ETH/USD rate with 18 decimals
        return uint256(answer * 1e10);
    }

    function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }

    // Helper to check if an address is a valid campaign owner
    function isOwner(address owner, address caller) internal pure returns (bool) {
        return owner == caller;
    }
}
