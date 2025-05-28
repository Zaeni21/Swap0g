const { ethers } = require("ethers");
const prompt = require("prompt-sync")();

const rpc = "https://evmrpc-testnet.0g.ai";
const provider = new ethers.providers.JsonRpcProvider(rpc);
const privateKey = prompt("Enter PRIVATE KEY: ");
const wallet = new ethers.Wallet(privateKey, provider);

const erc20Abi = ["function balanceOf(address) view returns (uint256)"];

const tokens = {
  USDT: "0x3eC8A8705bE1D5ca90066b37ba62c4183B024ebf",
  BTC:  "0x36f6414FF1df609214dDAbA71c84f18bcf00F67d",
  ETH:  "0x0fE9B43625fA7EdD663aDcEC0728DD635e4AbF7c"
};

(async () => {
  for (const [name, addr] of Object.entries(tokens)) {
    const token = new ethers.Contract(addr, erc20Abi, wallet);
    const bal = await token.balanceOf(wallet.address);
    console.log(`${name}:`, ethers.utils.formatUnits(bal, 18));
  }
})();
