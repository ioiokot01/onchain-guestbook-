# Onchain Guestbook

A tiny full-stack dApp for the [Base](https://base.org) ecosystem: anyone can
sign an on-chain guestbook with a short message, and every entry is stored
permanently on the blockchain.

This is the first project in a learning series — built to understand how a real
dApp fits together end to end:

- **Smart contract** (Solidity + Hardhat)
- **Tests** (Hardhat + Chai)
- **Frontend** (coming next — connect wallet, sign, read messages)
- **Deploy** to Base Sepolia testnet

## Stack

- [Hardhat 2](https://hardhat.org) — compile, test, deploy
- Solidity `0.8.24`
- Target chain: Base Sepolia (testnet)

## Getting started

```bash
npm install      # install dev dependencies
npx hardhat compile
npx hardhat test
```

## Contract

`contracts/Guestbook.sol`

| Function | Description |
| --- | --- |
| `sign(string message)` | Store a message (1–280 bytes) from the caller |
| `total()` | Number of entries so far |
| `getMessages()` | Return all entries |
| `getEntry(uint256 index)` | Return a single entry |

Emits a `Signed(address signer, string message, uint256 timestamp)` event on
every signature.

## Roadmap

- [x] Guestbook contract + tests
- [ ] Deploy script + Base Sepolia deployment
- [ ] Web frontend (wallet connect, sign, live feed)
- [ ] Polish: ENS names, pagination, themes

## Security notes

- Secrets (`.env`, private keys) are git-ignored and never committed.
- All development and deployment targets a **testnet** — no real funds involved.

## License

MIT
