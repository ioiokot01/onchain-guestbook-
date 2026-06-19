# Onchain Guestbook

[![CI](https://github.com/ioiokot01/onchain-guestbook-/actions/workflows/ci.yml/badge.svg)](https://github.com/ioiokot01/onchain-guestbook-/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636.svg)
![Chain](https://img.shields.io/badge/Base-Sepolia-0052ff.svg)

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
- [x] Deploy script + Base Sepolia network config
- [x] Web frontend (wallet connect, sign, live feed)
- [x] Deploy to Base Sepolia + wire address into frontend
- [ ] Polish: ENS names, pagination, themes

## Deployments

| Network | Address |
| --- | --- |
| Base Sepolia | [`0x0352f75eEcc8316c194d38FB4F1526bf9f674c30`](https://sepolia.basescan.org/address/0x0352f75eEcc8316c194d38FB4F1526bf9f674c30) |

## Security notes

- Secrets (`.env`, private keys) are git-ignored and never committed.
- All development and deployment targets a **testnet** — no real funds involved.

## License

MIT
