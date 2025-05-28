const prompt = require("prompt-sync")();
const { ethers } = require("ethers");

const privateKey = prompt("🗝️  Enter your PRIVATE KEY: ");
const rpc = "https://evmrpc-testnet.0g.ai";
const provider = new ethers.providers.JsonRpcProvider(rpc, { chainId: 16601, name: "0G" });
const wallet = new ethers.Wallet(privateKey, provider);

const erc20Abi = ["function approve(address spender, uint amount) public returns (bool)"];
const router = "0xD998a6A886C6c5408945aD1472fb43136d06e098";

const tokens = [
  "0x3eC8A8705bE1D5ca90066b37ba62c4183B024ebf", // USDT
  "0x36f6414FF1df609214dDAbA71c84f18bcf00F67d"  // BTC
];

async function approve(token) {
  const contract = new ethers.Contract(token, erc20Abi, wallet);
  const tx = await contract.approve(router, ethers.constants.MaxUint256);
  console.log(`Approving ${token}:`, tx.hash);
  await tx.wait();
  console.log("✅ Approved!");
}

(async () => {
  for (const token of tokens) {
    await approve(token);
  }
})();