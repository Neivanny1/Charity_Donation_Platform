import { expect } from "chai";
import { ethers } from "hardhat";
import { Counter } from "../typechain-types"; // Assumes you're using typechain

describe("Counter", function () {
  let counter: Counter;

  beforeEach(async function () {
    const CounterFactory = await ethers.getContractFactory("Counter");
    counter = await CounterFactory.deploy() as Counter;
  });

  it("Should initialize count to 0", async function () {
    const count = await counter.getCount();
    expect(count).to.equal(0);
  });

  it("Should increment count", async function () {
    await counter.increment();
    const count = await counter.getCount();
    expect(count).to.equal(1);
  });

  it("Should decrement count", async function () {
    await counter.increment();
    await counter.decrement();
    const count = await counter.getCount();
    expect(count).to.equal(0);
  });

  it("Should generate correct hello message", async function () {
    const message = await counter.hello("World");
    expect(message).to.equal("Hello World");
  });
});