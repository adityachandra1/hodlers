"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LoginButton } from "@/app/components/loginButton";
import GetButton from "@/app/components/getButton";
import {getAccount, useOkto } from '@okto_web3/react-sdk';
 
 
export default function Home() {
    const { data: session } = useSession();
    const oktoClient = useOkto();
    const [userInput, setUserInput] = useState("");

    //@ts-expect-error session type doesn't include id_token
    const idToken = useMemo(() => (session ? session.id_token : null), [session]);
 
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
    }, [idToken])

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
            </div>
        </main>
    );
}