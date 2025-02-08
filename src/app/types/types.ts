import { completeCCTPTransfer } from '@/utils/cctp-transfer';

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant' | 'function';
    content: string;
    name?: string;
};

export interface ProcessQueryRequest {
    messages: ChatMessage[];
}

export interface ProcessQueryResponse {
    result: ChatMessage;
    error?: string;
}

interface TransferContent {
    hasRequiredFields: boolean;
    sourceChain: string;
    destinationChain: string;
    amount: number;
    destinationWalletAddress: string;
}

export interface AgentResponse {
    role: 'assistant';
    content: {
        reply: string,
    }
    transactionConfirmed: boolean
}
