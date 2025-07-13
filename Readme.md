**\# 💱 SimpleSwap \- Decentralized Token Swap DApp**

SimpleSwap is a decentralized application that replicates basic Uniswap functionality. Users can add/remove liquidity and perform ERC20 token swaps directly from a React-based interface. This project was developed as the final assignment for Module 4 of a blockchain development course.

\---

**\#\# 🔍 Overview**

This project includes:

\- A \*\*Solidity smart contract\*\* deployed on the Sepolia testnet.  
\- A \*\*React front-end\*\* for interacting with the smart contract.  
\- \*\*Unit testing\*\* with Hardhat, achieving over 70% test coverage.  
\- Deployment of the front-end on \*\*Vercel\*\* and the smart contract verified on \*\*Sepolia Etherscan\*\*.

\---

**\#\# 🧠 Features**

\- ✅ Add liquidity to a token pair    
\- ✅ Remove liquidity    
\- ✅ Swap ERC20 tokens using a constant product formula    
\- ✅ Price estimation and slippage protection    
\- ✅ View total and per-user liquidity    
\- ✅ Public access to pair keys and swap calculations

\---

**\#\# 📁 Project Structure**

SimpleSwapProject/  
├── frontend/ \# React front-end (Vercel deployed)  
├── smart-contracts/ \# Hardhat project for Solidity contract  
│ ├── contracts/  
│ ├── test/  
│ ├── scripts/  
│ ├── hardhat.config.cjs  
│ └── ...  
├── [README.md](http://README.md)

\---

**\#\# ⚙️ Technologies Used**

\- \*\*Solidity (v0.8.x)\*\* – Smart contract development    
\- \*\*Hardhat\*\* – Ethereum dev environment and testing    
\- \*\*Chai / Mocha\*\* – JavaScript test framework    
\- \*\*Ethers.js\*\* – Web3 interaction library    
\- \*\*React.js\*\* – Front-end library    
\- \*\*Vercel\*\* – Front-end hosting    
\- \*\*Sepolia Testnet\*\* – Smart contract deployment network  

\---

**\#\# 🧪 Test Coverage**

Run the following inside the \`smart-contracts/\` folder:

\`\`\`bash  
npx hardhat coverage

Achieved test coverage:

* ✅ Statements: \>60%

* ✅ Functions: ≥50%

* ✅ Lines: ≥70%

* ✅ Branches: \~40%

## **🚀 Deployment Links**

* 🔗 **Live Frontend**: https://your-vercel-app.vercel.app

* 🔗 **Smart Contract Address (Sepolia)**: 0x30B0c8787F826D26811aD5216bF968980100B179

* 🔗 **Etherscan (Verified)**: [https://sepolia.etherscan.io/address/0x30B0c8787F826D26811aD5216bF968980100B179\#code](https://sepolia.etherscan.io/address/0x30B0c8787F826D26811aD5216bF968980100B179#code)

## **📦 How to Run Locally**

### **💡 Prerequisites**

* Node.js and npm

* Git

* Metamask \+ Sepolia ETH

* Vercel account (optional)

## **✍️ Author**

**Susana Carolina Sánchez**

## **📜 License**

This project is licensed under the MIT License.

