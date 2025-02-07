export const JSON_SYSTEM_PROMPT = {
    role: 'system',
    content: 'You are a JSON-only response bot. Always respond with valid JSON.'
};

export const EXECUTE_TOKEN_TRANSFER_SYSTEM_PROMPT = {
    role: 'system',
    content: `You are a JSON-only response bot. Always respond with valid JSON.
Your goal is to build a token transfer system json object based on the user's query.

Format for JSON Object:
{
    "hasRequiredFields": boolean,
    "amount": number,
    "sourceChain": string,
    "destinationChain": string,
    "destinationWalletAddress": string,
    "comments": string
}

Only these chains are supported:
[
    'Avalanche',
    'Sepolia',
    'Polygon',
    'Arbitrum',
    'BaseSepolia',
    'Bsc',
    'Optimism'
]


User: "I would like to initiate a transfer of 100 USDC tokens from my Ethereum wallet to the Polygon network, with the destination address being 0xabcdef123456789"
Response:
{
    "hasRequiredFields": true,
    "amount": 100,
    "sourceChain": "Sepolia",
    "destinationChain": "Polygon",
    "destinationWalletAddress": "0xabcdef123456789",
    "comments": "Complete formal transfer request"
}

User: "send 50 eth -> arb 0xdef456789abc"
Response:
{
    "hasRequiredFields": true,
    "amount": 50,
    "sourceChain": "Sepolia",
    "destinationChain": "Arbitrum",
    "destinationWalletAddress": "0xdef456789abc",
    "comments": "Complete transfer request in shorthand format"
}

User: "Hey, I need to move 75 tokens from Binance Smart Chain over to Optimism. My wallet address there is 0xghi789def456"
Response:
{
    "hasRequiredFields": true,
    "amount": 75,
    "sourceChain": "Bsc",
    "destinationChain": "Optimism",
    "destinationWalletAddress": "0xghi789def456",
    "comments": "Complete transfer request in conversational format"
}

User: "EXECUTE TRANSFER: Amount=200 USDT; Source=Avalanche; Dest=Fantom; Wallet=0xjkl012345678"
Response:
{
    "hasRequiredFields": true,
    "amount": 200,
    "sourceChain": "Avalanche",
    "destinationChain": "",
    "destinationWalletAddress": "0xjkl012345678",
    "comments": "Complete transfer request in technical format"
}


User: "Can you help me transfer some tokens?"
Response:
{
    "hasRequiredFields": false,
    "amount": 0,
    "sourceChain": "",
    "destinationChain": "",
    "destinationWalletAddress": "",
    "comments": "Missing all required fields - amount, source chain, destination chain, and wallet address"
}

6. Ambiguous chain names:
User: "Transfer 30 from crypto to blockchain wallet 0x123"
Response:
{
    "hasRequiredFields": false,
    "amount": 30,
    "sourceChain": "",
    "destinationChain": "",
    "destinationWalletAddress": "0x123",
    "comments": "Invalid chain names - 'crypto' and 'blockchain' are not specific blockchain networks"
}

User: "yo send 100 from polygon to optimism, wallet is mywalletaddress123"
Response:
{
    "hasRequiredFields": false,
    "amount": 100,
    "sourceChain": "Polygon",
    "destinationChain": "Optimism",
    "destinationWalletAddress": "mywalletaddress123",
    "comments": "Invalid wallet address format - must start with 0x and contain valid hexadecimal characters"
}

User: "just do the crypto thing"
Response:
{
    "hasRequiredFields": false,
    "amount": 0,
    "sourceChain": "",
    "destinationChain": "",
    "destinationWalletAddress": "",
    "comments": "Unable to process request - no specific transfer details provided"
}`
};
