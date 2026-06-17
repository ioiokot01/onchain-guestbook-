// Deploys the Guestbook contract to the configured network.
//
//   Local:        npx hardhat run scripts/deploy.js
//   Base Sepolia: npx hardhat run scripts/deploy.js --network baseSepolia
//
// For a real network, set BASE_SEPOLIA_RPC_URL and PRIVATE_KEY in a .env file
// (see .env.example). Never commit your real .env — it is git-ignored.

const hre = require("hardhat");

async function main() {
  const network = hre.network.name;
  console.log(`Deploying Guestbook to network: ${network}`);

  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance:  ${hre.ethers.formatEther(balance)} ETH`);

  const Guestbook = await hre.ethers.getContractFactory("Guestbook");
  const guestbook = await Guestbook.deploy();
  await guestbook.waitForDeployment();

  const address = await guestbook.getAddress();
  console.log(`\n✅ Guestbook deployed to: ${address}`);

  if (network === "baseSepolia") {
    console.log(`🔎 Explorer: https://sepolia.basescan.org/address/${address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
