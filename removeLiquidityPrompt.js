const prompt = require("prompt-sync")();
const { ethers } = require("ethers");

const privateKey = prompt("🗝️  Enter your PRIVATE KEY: ");
const rpc = "https://evmrpc-testnet.0g.ai";
const provider = new ethers.providers.JsonRpcProvider(rpc, { chainId: 16601, name: "0G" });
const wallet = new ethers.Wallet(privateKey, provider);

const routerAbi = [
  "function removeLiquidity(address,address,uint,uint,uint,address,uint) external returns (uint,uint)"
];
const lpAbi = ["function approve(address spender, uint256 amount) public returns (bool)"];

const tokenA = "0x3eC8A8705bE1D5ca90066b37ba62c4183B024ebf";
const tokenB = "0x36f6414FF1df609214dDAbA71c84f18bcf00F67d";
const lpToken = "0xYOUR_LP_TOKEN_ADDRESS"; // Ganti ke LP Token yang sesuai

async function main() {
  const router = new ethers.Contract("0xD998a6A886C6c5408945aD1472fb43136d06e098", routerAbi, wallet);
  const lp = new ethers.Contract(lpToken, lpAbi, wallet);
  const liquidity = ethers.utils.parseUnits("1", 18); // LP token amount

  const approveTx = await lp.approve(router.address, liquidity);
  await approveTx.wait();

  const tx = await router.removeLiquidity(
    tokenA,
    tokenB,
    liquidity,
    0,
    0,
    wallet.address,
    Math.floor(Date.now() / 1000) + 600
  );
  console.log("🧼 RemoveLiquidity TX:", tx.hash);
  await tx.wait();
  console.log("✅ Liquidity removed!");
}

main().catch(console.error);