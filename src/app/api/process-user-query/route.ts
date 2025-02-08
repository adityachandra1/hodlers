import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService } from '@/app/services/openai/openaiservice';
import { ProcessQueryRequest, ProcessQueryResponse } from '@/app/types/types';
import { completeCCTPTransfer } from "@/utils/cctp-transfer";
import { OktoAgent } from '@/app/services/agent/agent';

export async function POST(
    request: NextRequest
): Promise<NextResponse<ProcessQueryResponse>> {
    try {
        const body = await request.json() as ProcessQueryRequest;
        if (!body.messages || !Array.isArray(body.messages)) {
            return NextResponse.json(
                {
                    error: 'Invalid request format',
                    result: {
                        role: 'assistant',
                        content: '',
                    }
                },
                { status: 400 }
            );
        }
        console.log(body.messages)

        const agentResponse = await OktoAgent.processQuery(body.messages);

        console.log(agentResponse);

        const response: ProcessQueryResponse = {
            result: {
                role: 'assistant',
                content: agentResponse?.content,
                txn_details: agentResponse?.txn_details
            }
        };
        return NextResponse.json(response);
    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', result: { role: 'assistant', content: '' } },
            { status: 500 }
        );
    }
}

