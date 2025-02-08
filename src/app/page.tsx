"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LoginButton } from "@/app/components/loginButton";
import GetButton from "@/app/components/getButton";
import {getAccount, useOkto, tokenTransfer, getOrdersHistory } from '@okto_web3/react-sdk';
import { ethers } from "ethers";
import { usdcAddresses, chainIds } from "@/utils/mainnet-mapping";

type ChainType = "Avalanche" | "Ethereum" | "Polygon" | "Arbitrum" | "Base" | "Bsc" | "Optimism";

export default function Home() {
    const { data: session } = useSession();
    const oktoClient = useOkto();
    const [userInput, setUserInput] = useState("");
    const [intentId, setIntentId] = useState<any>(null);

    //@ts-expect-error session type doesn't include id_token
    const idToken = useMemo(() => (session ? session.id_token : null), [session]);

    async function handleTokenTransfer(amount: string, recipient: string, sourceChain: ChainType, destinationChain: ChainType): Promise<string | undefined> {

        try {
            const transferParams: any = {
                amount: BigInt(amount),
                recipient: "0xA76cF441BCd370EA47d64fc5B029BC22d8db3a48",
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
            console.log("IntentId", intentId);

            // Poll for order status
            const startTime = Date.now();
            const timeout = 60000; // 1 minute in milliseconds

            const checkOrderStatus = async () => {
                const order = await getOrdersHistory(oktoClient, { intentId: txHash.jobId });
                if (order[0]?.status === "SUCCESSFUL") {
                    const timeElapsed = (Date.now() - startTime) / 1000;
                    console.log(`Your order is successful! Time taken: ${timeElapsed.toFixed(2)} seconds`);
                    // Execute CCTP transfer after successful order
                    await executeCCTPTransfer(
                        BigInt(amount),
                        recipient,
                        sourceChain,
                        destinationChain
                    );
                    return true;
                }
                if (Date.now() - startTime >= timeout) {
                    console.log("Timeout reached while waiting for order success");
                    return false;
                }
                await new Promise(resolve => setTimeout(resolve, 5000));
                return checkOrderStatus();
            };

            checkOrderStatus();
            return txHash;
        } catch (error) {
            console.error('Error in token transfer:', error);
            return undefined;
        }
    }

    async function handleGetOrdersHistory(): Promise<any | undefined> {
        console.log("IntentId:", "e8466970-87e1-4411-ab6b-180c8cc4bdba");
        try {
            const order = await getOrdersHistory(oktoClient);
            console.log("Order:", order);
            return order;
        } catch (error) {
            console.error('Error in getOrdersHistory:', error);
            return undefined;
        }
    }
 
    async function handleAuthenticate(): Promise<string | { result: boolean; error: string }> {
        if (!idToken) {
            return { result: false, error: "No google login" };
        }
        const user = await oktoClient.loginUsingOAuth({
            idToken: idToken,
            provider: 'google',
        });
        console.log("Authentication Success", user);
        return JSON.stringify(user);
    }
 
    async function handleLogout() {
        try {
            signOut();
            return { result: "logout success" };
        } catch {
            return { result: "logout failed" };
        }
    }
 
    useEffect(()=>{
        if(idToken){
            handleAuthenticate();
        }
    }, [idToken, handleAuthenticate])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            try {
                const response = await fetch('/api/process-user-query', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: [{
                            role: 'user',
                            content: userInput
                        }]
                    })
                });
                
                const data = await response.json();
                console.log('AI Response:', data.result);
                setUserInput("");
            } catch (error) {
                console.error('Error processing query:', error);
            }
        }
    };

    const executeCCTPTransfer = async (amount: bigint, recipient: string, sourceChain: string, destinationChain: string) => {
            try {
                const response = await fetch('/api/cctp-transfer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: amount.toString(),
                        recipient: recipient,
                        source: sourceChain,
                        destination: destinationChain
                    })
                });
                
                const data = await response.json();
                console.log('Txn Hash:', data.result);
                setUserInput("");
            } catch (error) {
                console.error('Error processing query:', error);
            }
    };
 
    return (
        <main className="flex min-h-screen flex-col items-center space-y-6 p-12 bg-violet-200">
            <div className="text-black font-bold text-3xl mb-8">Template App</div>

            <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message and press Enter..."
                className="w-full max-w-lg p-2 rounded-md border border-gray-300 focus:outline-none focus:border-violet-500"
            />
 
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg mt-8">
                <LoginButton />
                <GetButton title="Okto Log out" apiFn={handleLogout} />
                <GetButton title="getAccount" apiFn={getAccount} />
                <GetButton 
                    title="Token Transfer" 
                    apiFn={(client) => handleTokenTransfer("100000", "0x55d70f37a7D69DD57BCf3D942a705E48991E5E81", "Avalanche", "Base")} 
                />
                <GetButton title="getOrdersHistory" apiFn={() => handleGetOrdersHistory()} />
            </div>
        </main>
    );
}