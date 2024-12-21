import { expect } from "chai";
import { ethers } from "hardhat";
import { Admin } from "../typechain-types/Admin";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("Admin Contract", function () {
    let adminContract: Admin;
    let owner: SignerWithAddress;
    let newAdmin: SignerWithAddress;
    let addr1: SignerWithAddress;

    beforeEach(async function () {
        [owner, newAdmin, addr1] = await ethers.getSigners();
        const Admin = await ethers.getContractFactory("Admin");
        adminContract = await Admin.deploy();
    });

    it("Should set the deployer as the admin", async function () {
        expect(await adminContract.admin()).to.equal(owner.address);
    });

    it("Should transfer admin role", async function () {
        await expect(adminContract.transferAdminRole(newAdmin.address))
            .to.emit(adminContract, "AdminChanged")
            .withArgs(owner.address, newAdmin.address);
        expect(await adminContract.admin()).to.equal(newAdmin.address);
    });

    it("Should not allow non-admin to transfer admin role", async function () {
        await expect(adminContract.connect(addr1).transferAdminRole(newAdmin.address))
            .to.be.revertedWith("Only admin can call this function");
    });

    it("Should not allow setting admin to the zero address", async function () {
        await expect(adminContract.transferAdminRole(ethers.constants.AddressZero))
            .to.be.revertedWith("New admin cannot be zero address");
    });
});
