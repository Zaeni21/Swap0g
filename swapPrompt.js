const prompt = require("prompt-sync")();
const { ethers } = require("ethers");

const privateKey = prompt("🗝️  Enter your PRIVATE KEY: ");
const rpc = "https://evmrpc-testnet.0g.ai";
const provider = new ethers.providers.JsonRpcProvider(rpc, { chainId: 16601, name: "0G" });
const wallet = new ethers.Wallet(privateKey, provider);

const routerAbi = [
  "function swapExactTokensCustom(address,address,uint256,address,uint256,uint256,uint256) external returns (uint256)"
];

const router = new ethers.Contract("0xD998a6A886C6c5408945aD1472fb43136d06e098", routerAbi, wallet);

const tokenA = "0x3eC8A8705bE1D5ca90066b37ba62c4183B024ebf"; // USDT
const tokenB = "0x36f6414FF1df609214dDAbA71c84f18bcf00F67d"; // BTC

async function main() {
  const amountIn = ethers.utils.parseUnits("3000", 18);
  const amountOutMin = ethers.BigNumber.from("3635c9adc5dea00000");
  const slippage = ethers.BigNumber.from("2ae0191a45cd8e0");
  const to = wallet.address;
  const deadline = 1748807481;

  const tx = await router.swapExactTokensCustom(tokenA, tokenB, amountIn, to, deadline, amountOutMin, slippage);
  console.log("🔁 Swap TX:", tx.hash);
  await tx.wait();
  console.log("✅ Swap success!");
}

main().catch(console.error);