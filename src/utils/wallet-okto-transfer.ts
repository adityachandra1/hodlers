import { ethers } from "ethers";
import { rpcMap, usdcAddresses } from "./mapping";


export const walletOktoTransfer = async function (recipient: any, amount: any, destinationChain: any) {
    const provider = new ethers.JsonRpcProvider(rpcMap[destinationChain]); // Use a valid RPC URL
    const privateKey = process.env.WALLET_PRIVATE_KEY; // Keep this secure!
    const wallet = new ethers.Wallet(privateKey, provider);

    // USDC Contract Address (Ethereum Mainnet)
    const usdcAddress = usdcAddresses[destinationChain];

    // ERC-20 ABI (only the transfer function)
    const erc20Abi = [
        "function transfer(address to, uint256 amount) external returns (bool)"
    ];

    const usdcContract = new ethers.Contract(usdcAddress, erc20Abi, wallet);

    const tx = await sendUSDC(recipient, amount, usdcContract);
    return tx;
};

async function sendUSDC(recipient: any, amount: any, usdcContract: any) {
    try {
        console.log(`Sending ${amount} USDC to ${recipient}...`);

        const tx = await usdcContract.transfer(recipient, amount);
        console.log("Transaction sent! Hash:", tx.hash);

        await tx.wait(); // Wait for confirmation
        console.log("Transaction confirmed!");
        return tx.hash;
    } catch (error) {
        console.error("Error sending USDC:", error);
    }
}
