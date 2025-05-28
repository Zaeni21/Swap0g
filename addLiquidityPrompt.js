const prompt = require("prompt-sync")();
const { ethers } = require("ethers");

const privateKey = prompt("🗝️  Enter your PRIVATE KEY: ");
const rpc = "https://evmrpc-testnet.0g.ai";
const provider = new ethers.providers.JsonRpcProvider(rpc, { chainId: 16601, name: "0G" });
const wallet = new ethers.Wallet(privateKey, provider);

const routerAbi = [
  "function addLiquidity(address,address,uint,uint,uint,uint,address,uint) external returns (uint,uint,uint)"
];
const router = new ethers.Contract("0xD998a6A886C6c5408945aD1472fb43136d06e098", routerAbi, wallet);

const tokenA = "0x3eC8A8705bE1D5ca90066b37ba62c4183B024ebf";
const tokenB = "0x36f6414FF1df609214dDAbA71c84f18bcf00F67d";

async function main() {
  const amountA = ethers.utils.parseUnits("100", 18);
  const amountB = ethers.utils.parseUnits("0.01", 18);

  const tx = await router.addLiquidity(
    tokenA,
    tokenB,
    amountA,
    amountB,
    0,
    0,
    wallet.address,
    Math.floor(Date.now() / 1000) + 600
  );

  console.log("🔁 AddLiquidity TX:", tx.hash);
  await tx.wait();
  console.log("✅ Liquidity added!");
}

main().catch(console.error);