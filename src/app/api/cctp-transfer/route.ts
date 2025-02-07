import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { completeCCTPTransfer } from "@/utils/cctp-transfer";

// If you need to handle data in the request body, use POST instead
export async function POST(request: Request) {
    try {
        const { source, destination, amount, recipient } = await request.json();
        const smallestUnit = ethers.parseUnits(amount, 6); // 6 decimals for USDC
        console.log(source, destination, smallestUnit, recipient);
        
        const txids = await completeCCTPTransfer(source, destination, smallestUnit, recipient);
        return NextResponse.json({ message: `TxIds: ${txids}`, status: 200 });
    } catch (error) {
        console.error('Error in CCTP transfer:', error);
        return NextResponse.json(
            { message: "Invalid request body" },
            { status: 400 }
        );
    }
}
