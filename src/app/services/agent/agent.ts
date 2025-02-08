import { openai, DEFAULT_MODEL, DEFAULT_TEMPERATURE } from '@/app/services/openai/config';
import { JSON_SYSTEM_PROMPT, GET_USER_INTENT_SYSTEM_PROMPT, EXECUTE_TOKEN_TRANSFER_SYSTEM_PROMPT } from '@/app/services/openai/prompts';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatMessage, TransferContent, QueryResponseObject } from '@/app/types/types';
import { OpenAIService } from '../openai/openaiservice';
import { completeCCTPTransfer } from '@/utils/cctp-transfer';

export class OktoAgent {
    static async getIntent(conversation: string): Promise<any> {
        try {
            const prompt = GET_USER_INTENT_SYSTEM_PROMPT.content + conversation;
            const response = await OpenAIService.getSinglePromptResponse(prompt);
            return response;
        }
        catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }

    static async getResponse(conversation: string): Promise<any> {
        try {
            const prompt = "Go through the converstation history and respond to the user about their query in 2-3 lines: " + conversation;
            console.log(prompt)
            const response = await OpenAIService.getSinglePromptResponse(prompt);
            return {
                role: 'assistant',
                content: JSON.parse(response.content).response,
                txn_details: null
            }
        }
        catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }
        
    static async processQuery(messages: ChatMessage[]): Promise<any> {
        try {
            let conversation = '';
            messages.forEach(message => {
                conversation += `${message.role}: ${message.content}\n`;
            });
            console.log(conversation);
            const userIntent = await OktoAgent.getIntent(conversation);
            console.log(userIntent);
            const parsedResponse = JSON.parse(userIntent.content);

            switch (parsedResponse.intent) {
                case 'TokenTransfer':
                    return await OktoAgent.processTransfer(messages, conversation);
                default:
                    return await OktoAgent.getResponse(conversation);
            }
        } catch (error) {
            console.error('OpenAI API Error:', error);
            throw error;
        }
    }

    static async processTransfer(messages: ChatMessage[], conversations: any): Promise<any> {
        try {
            const promptedMessages = [
                ...messages, 
                { role: 'system' as const, content: EXECUTE_TOKEN_TRANSFER_SYSTEM_PROMPT.content }
            ]
            const response = await OpenAIService.getResponse(promptedMessages);
            const content = response.content as TransferContent;
            console.log(response)
            let responsePrompt = '';
            if (content.hasRequiredFields === true) {
                responsePrompt = "Confirm with the user the transaction details, and if they want to proceed with the txn" + conversations;

                const responseMessage = await OpenAIService.getSingleTextPromptResponse(responsePrompt);
                return {
                    role: 'assistant',
                    content: responseMessage.content,
                    txn_details: {
                        hasRequiredFields: content.hasRequiredFields,
                        sourceChain: content.sourceChain,
                        destinationChain: content.destinationChain,
                        amount: content.amount,
                        destinationWalletAddress: content.destinationWalletAddress,
                        comments: content.comments
                    }
                } as QueryResponseObject

                // try {
                    // const txnIds = await completeCCTPTransfer(
                    //     content.sourceChain,
                    //     content.destinationChain,
                    //     content.amount * 10 ** 6,
                    //     content.destinationWalletAddress
                    // );
                    // responsePrompt = "Tell  " + txnIds + "." + conversations;
                    // const responseMessage = await OpenAIService.getSingleTextPromptResponse(responsePrompt);
                    // return {
                    //     role: 'assistant',
                    //     content: responseMessage.content,
                    //     txn_details: {
                    //         hasRequiredFields: content.hasRequiredFields,
                    //         sourceChain: content.sourceChain,
                    //         destinationChain: content.destinationChain,
                    //         amount: content.amount,
                    //         destinationWalletAddress: content.destinationWalletAddress,
                    //         comments: content.comments
                    //     }
                    // } as QueryResponseObject;
                // } catch (err) {
                //     responsePrompt = "Tell the user that the transaction has failed. " + err + "." + conversations;
                //     const responseMessage = await OpenAIService.getSingleTextPromptResponse(responsePrompt);
                //     return {
                //         role: 'assistant',
                //         content: responseMessage.content,
                //         txn_details: {
                //             hasRequiredFields: content.hasRequiredFields,
                //             sourceChain: content.sourceChain,
                //             destinationChain: content.destinationChain,
                //             amount: content.amount,
                //             destinationWalletAddress: content.destinationWalletAddress,
                //             comments: content.comments
                //         }
                //     } as QueryResponseObject;
                // }
            } else {
                responsePrompt = "Tell the user that you need more information to complete the transfer: " + content.comments + "." + conversations;
                const responseMessage = await OpenAIService.getSingleTextPromptResponse(responsePrompt);
                return {
                    role: 'assistant',
                    content: responseMessage.content,
                    txn_details: {
                        hasRequiredFields: content.hasRequiredFields,
                        sourceChain: content.sourceChain,
                        destinationChain: content.destinationChain,
                        amount: content.amount,
                        destinationWalletAddress: content.destinationWalletAddress,
                        comments: content.comments
                    }
                } as QueryResponseObject;
            }
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