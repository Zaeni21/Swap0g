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

// Token addresses
const TOKENS = {
  USDT: "0x3eC8A8705bE1D5ca90066b37ba62c4183B024ebf",
  BTC:  "0x36f6414FF1df609214dDAbA71c84f18bcf00F67d",
  ETH:  "0x0fE9B43625fA7EdD663aDcEC0728DD635e4AbF7c"
};

// Swap paths to cycle through
const SWAP_PATHS = [
  ["USDT", "BTC"],
  ["BTC", "USDT"],
  ["USDT", "ETH"],
  ["ETH", "USDT"],
  ["BTC", "ETH"],
  ["ETH", "BTC"]
];

function getRandomAmount() {
  // Random antara 1 s/d 10
  return (Math.random() * 9 + 1).toFixed(4); 
}

async function swap(fromSymbol, toSymbol) {
  const tokenA = TOKENS[fromSymbol];
  const tokenB = TOKENS[toSymbol];
  const amountStr = getRandomAmount();
  const amountIn = ethers.utils.parseUnits(amountStr, 18);
  const amountOutMin = 0;
  const slippage = 0;
  const to = wallet.address;
  const deadline = Math.floor(Date.now() / 1000) + 600;

  try {
    const tx = await router.swapExactTokensCustom(tokenA, tokenB, amountIn, to, deadline, amountOutMin, slippage);
    console.log(`🔁 Swapped ${amountStr} ${fromSymbol} → ${toSymbol} | TX: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ ${fromSymbol} → ${toSymbol} Success`);
  } catch (err) {
    console.error(`❌ ${fromSymbol} → ${toSymbol} Failed:`, err.message);
  }
}

(async () => {
  while (true) {
    for (const [from, to] of SWAP_PATHS) {
      await swap(from, to);
      await new Promise(r => setTimeout(r, 10000)); // 10 detik
    }
  }
})();