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
    result: QueryResponseObject;
    error?: string;
}

export interface QueryResponseObject {
    role: 'assistant';
    content: string;
    txn_details?: TransferContent;
}

export interface TransferContent {
    hasRequiredFields: boolean;
    sourceChain: string;
    destinationChain: string;
    amount: number;
    destinationWalletAddress: string;
    comments: string;
}
