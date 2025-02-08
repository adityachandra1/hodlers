import { openai, DEFAULT_MODEL, DEFAULT_TEMPERATURE } from '@/app/services/openai/config';
import { JSON_SYSTEM_PROMPT, EXECUTE_TOKEN_TRANSFER_SYSTEM_PROMPT } from '@/app/services/openai/prompts';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatMessage, AgentResponse } from '@/app/types/types';
import { OpenAIService } from '../openai/openaiservice';

export class OktoAgent {
    static async processQuery(messages: ChatMessage[]): Promise<AgentResponse> {
        try {
            const response = await OpenAIService.getResponse(messages);
            return {
                role: 'assistant',
                content: {
                    reply: response.content,
                },
                transactionConfirmed: false
            };
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }

    static async processJsonQuery<T>(messages: ChatMessage[]): Promise<T> {
        try {
            const completion = await openai.chat.completions.create({
                model: DEFAULT_MODEL,
                messages: [JSON_SYSTEM_PROMPT, ...messages] as ChatCompletionMessageParam[],
                temperature: DEFAULT_TEMPERATURE,
                response_format: { type: "json_object" }
            });

            if (!completion.choices[0].message?.content) {
                throw new Error('No response from OpenAI');
            }

            return JSON.parse(completion.choices[0].message.content) as T;
        } catch (error) {
            console.error('OpenAI JSON API Error:', error);
            throw error;
        }
    }

    static async processStructuredQuery<T>(
        messages: ChatMessage[],
        functionName: string,
        parameters: Record<string, unknown>
    ): Promise<T> {
        try {
            const completion = await openai.chat.completions.create({
                model: DEFAULT_MODEL,
                messages: messages as ChatCompletionMessageParam[],
                temperature: DEFAULT_TEMPERATURE,
                functions: [{
                    name: functionName,
                    parameters: parameters
                }],
                function_call: { name: functionName }
            });

            const functionCall = completion.choices[0].message?.function_call;
            if (!functionCall?.arguments) {
                throw new Error('No function call response from OpenAI');
            }

            return JSON.parse(functionCall.arguments) as T;
        } catch (error) {
            console.error('OpenAI Structured API Error:', error);
            throw error;
        }
    }
}