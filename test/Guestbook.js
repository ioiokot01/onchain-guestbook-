const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  anyValue,
} = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("Guestbook", function () {
  let guestbook;
  let owner, alice, bob;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const Guestbook = await ethers.getContractFactory("Guestbook");
    guestbook = await Guestbook.deploy();
    await guestbook.waitForDeployment();
  });

  it("starts empty", async function () {
    expect(await guestbook.total()).to.equal(0n);
    expect(await guestbook.getMessages()).to.have.lengthOf(0);
  });

  it("stores a signed message with the right signer", async function () {
    await guestbook.connect(alice).sign("gm from alice");

    expect(await guestbook.total()).to.equal(1n);

    const entry = await guestbook.getEntry(0);
    expect(entry.signer).to.equal(alice.address);
    expect(entry.message).to.equal("gm from alice");
    expect(entry.timestamp).to.be.greaterThan(0n);
  });

  it("keeps entries in order from multiple signers", async function () {
    await guestbook.connect(alice).sign("first");
    await guestbook.connect(bob).sign("second");

    const messages = await guestbook.getMessages();
    expect(messages).to.have.lengthOf(2);
    expect(messages[0].message).to.equal("first");
    expect(messages[0].signer).to.equal(alice.address);
    expect(messages[1].message).to.equal("second");
    expect(messages[1].signer).to.equal(bob.address);
  });

  it("emits a Signed event", async function () {
    await expect(guestbook.connect(alice).sign("hello"))
      .to.emit(guestbook, "Signed")
      .withArgs(alice.address, "hello", anyValue);
  });

  it("rejects an empty message", async function () {
    await expect(guestbook.sign("")).to.be.revertedWith(
      "Guestbook: empty message"
    );
  });

  it("rejects a message longer than MAX_MESSAGE_LENGTH", async function () {
    const tooLong = "x".repeat(281);
    await expect(guestbook.sign(tooLong)).to.be.revertedWith(
      "Guestbook: message too long"
    );
  });

  it("reverts when reading an out-of-range index", async function () {
    await expect(guestbook.getEntry(0)).to.be.revertedWith(
      "Guestbook: index out of range"
    );
  });
});
