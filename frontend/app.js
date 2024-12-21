require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const contractABI = require("./contractABI.json");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Connect to Sepolia Testnet via RPC
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

// REST API Endpoints

// 1. Create Campaign
app.post("/campaigns", async (req, res) => {
    const { title, description, targetAmount } = req.body;

    try {
        const tx = await contract.createCampaign(title, description, ethers.parseUnits(targetAmount, "ether"));
        await tx.wait(); // Wait for transaction to be mined
        res.status(201).send({ message: "Campaign created successfully", transactionHash: tx.hash });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 2. Donate to a Campaign
app.post("/campaigns/:id/donate", async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    try {
        const tx = await contract.donateToCampaign(id, { value: ethers.parseUnits(amount, "ether") });
        await tx.wait(); // Wait for transaction to be mined
        res.status(200).send({ message: "Donation successful", transactionHash: tx.hash });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 3. Withdraw Funds
app.post("/campaigns/:id/withdraw", async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    try {
        const tx = await contract.withdrawFunds(id, ethers.parseUnits(amount, "ether"));
        await tx.wait(); // Wait for transaction to be mined
        res.status(200).send({ message: "Withdrawal successful", transactionHash: tx.hash });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 4. Get Campaign Details
app.get("/campaigns/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const campaign = await contract.campaigns(id);
        res.status(200).send({
            id: campaign.id.toString(),
            title: campaign.title,
            description: campaign.description,
            targetAmount: ethers.formatEther(campaign.targetAmount),
            raisedAmount: ethers.formatEther(campaign.raisedAmount),
            owner: campaign.owner,
            isCompleted: campaign.isCompleted,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
