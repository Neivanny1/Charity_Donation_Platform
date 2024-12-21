import { expect } from "chai";
import { ethers } from "hardhat";
import { Utils } from "../typechain-types/Utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface";

describe("Utils Library", function () {
    let utilsContract: Utils;
    let priceFeedMock: AggregatorV3Interface;

    beforeEach(async function () {
        const Utils = await ethers.getContractFactory("Utils");
        utilsContract = await Utils.deploy();
        
        // Mock price feed contract address (replace with actual mock or deployed contract)
        priceFeedMock = await ethers.getContractAt("AggregatorV3Interface", "mock_price_feed_address");
    });

    it("Should correctly calculate conversion rate", async function () {
        const ethAmount = ethers.utils.parseEther("1");
        
        // Assuming you have a mock price feed contract that returns ETH price in USD
        const conversionRate = await utilsContract.getConversionRate(ethAmount, priceFeedMock);
        expect(conversionRate).to.equal(ethers.utils.parseUnits("3000", 18)); // Example check
    });
});
