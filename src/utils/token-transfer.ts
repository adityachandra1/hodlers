import { getOrdersHistory, tokenTransfer } from '@okto_web3/react-sdk';
import { usdcAddresses, chainIds } from "@/utils/mainnet-mapping";

export type ChainType = "Avalanche" | "Ethereum" | "Polygon" | "Arbitrum" | "Base" | "Bsc" | "Optimism";

export async function handleCCTPTransfer(
    amount: string,
    recipient: string,
    sourceChain: ChainType,
    destinationChain: ChainType,
    oktoClient: any,
    setIntentId: (id: string) => void
): Promise<string | undefined> {
    try {
        const transferParams: any = {
            amount: BigInt(amount),
            recipient,
            token: String(usdcAddresses[sourceChain]),
            chain: `eip155:${chainIds[sourceChain]}`
        };
        console.log(transferParams);
        
        const userOp = await tokenTransfer(oktoClient, transferParams);
        console.log("userOp", userOp);
        
        const signedOp = await oktoClient.signUserOp(userOp);
        console.log("signedOp", signedOp);
        
        const txHash: any = await oktoClient.executeUserOp(signedOp);
        console.log('Transfer transaction hash:', txHash);
        setIntentId(txHash.jobId);

        await pollOrderStatus(oktoClient, txHash.jobId, amount, recipient, sourceChain, destinationChain);
        return txHash;
    } catch (error) {
        console.error('Error in token transfer:', error);
        return undefined;
    }
}

async function pollOrderStatus(oktoClient: any, intentId: string, amount: string, recipient: string, sourceChain: ChainType, destinationChain: ChainType) {
    const startTime = Date.now();
    const timeout = 60000;

    const checkOrderStatus = async () => {
        const order = await getOrdersHistory(oktoClient);
        if (order[0]?.status === "SUCCESSFUL") {
            console.log(`Order successful! Time: ${(Date.now() - startTime) / 1000}s`);
            await executeCCTPTransfer(BigInt(amount), recipient, sourceChain, destinationChain);
            return;
        }
        if (Date.now() - startTime >= timeout) {
            console.log("Timeout while waiting for order success");
            return;
        }
        setTimeout(checkOrderStatus, 5000);
    };

    checkOrderStatus();
}

export const executeCCTPTransfer = async (amount: bigint, recipient: string, sourceChain: string, destinationChain: string) => {
    try {
        const response = await fetch('/api/cctp-transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amount.toString(), recipient, source: sourceChain, destination: destinationChain })
        });
        const data = await response.json();
        console.log('Txn Hash:', data.result);
    } catch (error) {
        console.error('Error processing query:', error);
    }
};