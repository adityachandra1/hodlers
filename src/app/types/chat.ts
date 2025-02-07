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