# 🎲  Campaign Smart Contract

A decentralized crowdfunding smart contract built with Hardhat, TypeScript, and Solidity. It allows anyone to launch a campaign with a funding goal and deadline, collect contributions, create spending requests, and allow contributors to vote on them.

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/ruifernandes0013/kickstart-web3-dApp.git
cd kickstart-web3-dApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the .env using the .env.example

```bash
cp .env.example .env
```

### 4. Compile contracts

```bash
node ethereum/compile.js
```

### 5. Run tests

```bash
npm run test
```

### 5. Deployment (with truffle)

```bash
node ethereum/deploy.js
```

### 📜 Contract Overview

##### File: contracts/Campaign.sol

The CampaignFactory contract lets users create and track crowdfunding campaigns. Each Campaign allows:

## ✅ Features

### 📌 Campaign Initialization
- Anyone can create a campaign.
- Parameters include:
  - `minimumContribution`
  - `goalAmount`
  - `durationInDays`

### 💸 Contributions
- Contributors can send ETH to support a campaign.
- Must contribute more than the `minimumContribution`.
- Unique contributors are tracked.
- If total contributions meet or exceed the `goalAmount`, the campaign is marked as successful (`goalReached = true`).

### 🧾 Spending Requests
- Only the campaign manager can create spending requests.
- Each request includes:
  - `description`
  - `recipient`
  - `value`
- Contributors can vote to approve each request.
- A request can be finalized once it gets approval from more than 50% of contributors.

### 💰 Request Finalization
- Once approved by a majority of contributors:
  - The requested amount is transferred to the recipient.
  - The request is marked as completed and cannot be finalized again.

### 🔄 Refunds
- Contributors can request refunds if:
  - The campaign is canceled by the manager.
  - The deadline passes without reaching the funding goal.
- Refunds can only be claimed once per contributor.

### 🔐 Access Control
- `manager` (campaign creator) has exclusive access to:
  - `createRequest`
  - `finalizeRequest`
  - `cancelCampaign`
  - `getBalance`
- Only contributors can approve requests and request refunds.


### 📄 License

This project is licensed under the MIT License.

### 🤝 Connect with Me
[GitHub](https://github.com/ruifernandes0013) | [LinkedIn](http://linkedin.com/in/rui-pedro-fernandes-a83b14232)






