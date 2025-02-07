import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/app/services/openai/openaiservice';
import { ProcessQueryRequest, ProcessQueryResponse } from '@/app/types/chat';
import { completeCCTPTransfer } from "@/utils/cctp-transfer";

export async function POST(
    request: NextRequest
): Promise<NextResponse<ProcessQueryResponse>> {
    try {
        const body = await request.json() as ProcessQueryRequest;

        if (!body.messages || !Array.isArray(body.messages)) {
            return NextResponse.json(
                { error: 'Invalid request format', result: { role: 'assistant', content: '' } },
                { status: 400 }
            );
        }

        const result = await OpenAIService.processQuery(body.messages);
        let txids;
        interface TransferContent {
            hasRequiredFields: boolean;
            sourceChain: string;
            destinationChain: string;
            amount: number;
            destinationWalletAddress: string;
        }

        console.log(result);
        if (result.content) {
            const content = result.content as unknown as TransferContent;
            if (content.hasRequiredFields === true) {
            txids = await completeCCTPTransfer(
                content.sourceChain,
                content.destinationChain,
                content.amount * Math.pow(10, 6),
                content.destinationWalletAddress
            );
            console.log(txids);
            }
        }
        console.log(result);
        console.log(txids);
        return NextResponse.json({ result });
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', result: { role: 'assistant', content: '' } },
            { status: 500 }
        );
    }
}