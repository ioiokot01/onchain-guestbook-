// Reads and prints every entry from the deployed Guestbook.
//
//   npx hardhat run scripts/read.js --network baseSepolia

const hre = require("hardhat");

const CONTRACT_ADDRESS = "0x0352f75eEcc8316c194d38FB4F1526bf9f674c30";

async function main() {
  const guestbook = await hre.ethers.getContractAt(
    "Guestbook",
    CONTRACT_ADDRESS
  );

  const entries = await guestbook.getMessages();
  console.log(`Total entries: ${entries.length}\n`);

  entries.forEach((entry, i) => {
    const when = new Date(Number(entry.timestamp) * 1000).toLocaleString();
    console.log(`#${i} — ${entry.signer} @ ${when}`);
    console.log(`   "${entry.message}"\n`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
