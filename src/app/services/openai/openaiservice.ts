import { openai, DEFAULT_MODEL, DEFAULT_TEMPERATURE } from '@/app/services/openai/config';
import { JSON_SYSTEM_PROMPT, EXECUTE_TOKEN_TRANSFER_SYSTEM_PROMPT } from '@/app/services/openai/prompts';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatMessage } from '@/app/types/types';

const BASE_CONTEXT = {
    role: 'system',
    content: 'You are an expert OKTO Agent specializing in cross- chain USDC transfers.Your primary functions are: \n1.Facilitating secure transfers using OKTO chain SDK\n2.Educating users about blockchain technology and OKTO features\n3.Ensuring compliance and safety in transactions\n You have access to user users wallets and profilio data you perform transactions on their behalf. Provide clear, concise responses in valid JSON format.'
}

export class OpenAIService {
    static async getResponse(messages: ChatMessage[]): Promise<any> {
        try {
            const completion = await openai.chat.completions.create({
                model: DEFAULT_MODEL,
                messages: [BASE_CONTEXT, ...messages] as ChatCompletionMessageParam[],
                temperature: DEFAULT_TEMPERATURE,
                response_format: { type: "json_object" }
            });

            if (!completion.choices[0].message) {
                throw new Error('No response from OpenAI');
            }

            const content = completion.choices[0].message.content;
            if (!content) {
                throw new Error('No content in OpenAI response');
            }
            
            return {
                role: 'assistant',
                content: JSON.parse(content),
            };
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }

    static async getSinglePromptResponse(prompt: string): Promise<ChatMessage> {
        try {
            const completion = await openai.chat.completions.create({
                model: DEFAULT_MODEL,
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are an expert OKTO Agent specializing in cross-chain USDC transfers. Your primary functions are:\n1. Facilitating secure transfers using OKTO chain SDK\n2. Educating users about blockchain technology and OKTO features\n3. Ensuring compliance and safety in transactions\nProvide clear, concise responses in valid JSON format.You have access to user users wallets and profilio data you perform transactions on their behalf. Always be to the point and direct'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ] as ChatCompletionMessageParam[],
                temperature: DEFAULT_TEMPERATURE,
                response_format: { type: "json_object" }
            });

            if (!completion.choices[0].message) {
                throw new Error('No response from OpenAI');
            }

            const content = completion.choices[0].message.content;
            if (!content) {
                throw new Error('No content in OpenAI response');
            }
            return {
                role: 'assistant',
                content: content,
            };
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }

    static async getSingleTextPromptResponse(prompt: string): Promise<ChatMessage> {
        try {
            const completion = await openai.chat.completions.create({
                model: DEFAULT_MODEL,
                messages: [
                    { role: 'system', content: `${prompt}` }
                ] as ChatCompletionMessageParam[],
                temperature: DEFAULT_TEMPERATURE,
            });

            if (!completion.choices[0].message) {
                throw new Error('No response from OpenAI');
            }

            const content = completion.choices[0].message.content;
            if (!content) {
                throw new Error('No content in OpenAI response');
            }

            return {
                role: 'assistant',
                content: content,
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
                messages: [BASE_CONTEXT, JSON_SYSTEM_PROMPT, ...messages] as ChatCompletionMessageParam[],
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
                messages: [BASE_CONTEXT, ...messages] as ChatCompletionMessageParam[],
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