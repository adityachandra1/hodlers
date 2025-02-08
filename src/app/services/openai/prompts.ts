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
    "hasRequiredFields": boolean,  // it should be true if all required fields are present and are valid
    "amount": number, // it should be greater than 0 
    "sourceChain": string, // it should be one of the supported chains map it yourself from the user query
    "destinationChain": string, // it should be one of the supported chains map it yourself from the user query
    "destinationWalletAddress": string, // it should be a valid wallet address
    "comments": string // Include detailed comments about the transfer request
}

Only these chains are supported:
[
    'Avalanche',
    'Sepolia',
    'Polygon',
    'Arbitrum',
    'Base',
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



export const GET_USER_INTENT_SYSTEM_PROMPT = {
    role: 'system',
    content: `Your goal is to extract the user's intent from this conversation history and provide a response based on the detected intent.

    Supported Intents: ["TokenTransfer", "RespondToQuery"]
    
    Your response should be a JSON object with a single "intent" field containing one of the supported intents.

    Sample Examples:

    Example 1:
    User: "I would like to initiate a transfer of 100 USDC tokens from my Ethereum wallet to the Polygon network, with the destination address being 0xabcdef123456789"
    Response:
    {"intent": "TokenTransfer"}

    Example 2:
    User: "Can you help me transfer some tokens?"
    Assistant: "Sure, I can help with that. What are the details of the transfer?"
    User: "I want to send 50 USDT to my polygon wallet"
    Assistant: "To execute the transfer also provide source chain and destination wallet address, i can see the amount and destination chain"
    User: "50 USDT from Avalanche to Polygon, wallet is 0x123456789"
    Response:
    {"intent": "TokenTransfer"}

    Example 3:
    User: "How many usdc do i have in my wallet?"
    Response:
    {"intent": "RespondToQuery"}

    User: "I want to partially transfer 200 tokens from Avalanche to Bsc, but I might split it into multiple smaller transactions."
    Response:
    {"intent": "TokenTransfer"}

    User: "Could you also tell me how many tokens remain on Avalanche after transferring 50 tokens to Bsc?"
    Response:
    {"intent": "RespondToQuery"}

    User: "I'd like to bridge 120 tokens from Sepolia to Arbitrum, then confirm my new Arbitrum balance."
    Response:
    {"intent": "TokenTransfer"}
    
    Now Respond to:
    
    `
};

function buildContextPrompt(userAccountDetails, chainDetails, orderHistory, portfolioDetails, portfolioActivity, tokenDetails) {
    // Build portfolio summary section
    const portfolioSummary = `
Portfolio Summary:
- Total Holdings Value: ${portfolioDetails.aggregatedData.totalHoldingPriceUsdt} USDT (${portfolioDetails.aggregatedData.totalHoldingPriceInr} INR)
- Number of Holdings: ${portfolioDetails.aggregatedData.holdingsCount}

Current Holdings:
${portfolioDetails.groupTokens.map(token =>
        `- ${token.symbol}: ${token.balance} (${token.holdingsPriceUsdt} USDT)`).join('\n')}
`;

    // Build wallet information
    const walletInfo = `
Connected Wallets:
${userAccountDetails.map(wallet =>
        `- ${wallet.networkName}: ${wallet.address}`).join('\n')}
`;

    // Build recent activity
    const recentActivity = `
Recent Activity:
${portfolioActivity.map(activity =>
        `- ${activity.description}: ${activity.amount} ${activity.symbol} on ${activity.networkName}`).join('\n')}
`;

    // Technical details as code blocks
    const technicalDetails = `
Technical Context:
\`\`\`json
{
  "supportedNetworks": ${JSON.stringify(chainDetails.map(chain => ({
        caipId: chain.caipId,
        networkName: chain.networkName,
        chainId: chain.chainId,
        type: chain.type
    })), null, 2)},
  "supportedTokens": ${JSON.stringify(tokenDetails.filter(token => token.whitelisted).map(token => ({
        symbol: token.symbol,
        networkName: token.networkName,
        address: token.address
    })), null, 2)},
  "recentTransactions": ${JSON.stringify(orderHistory.map(order => ({
        type: order.intentType,
        status: order.status,
        network: order.networkName,
        timestamp: order.blockTimestamp
    })), null, 2)}
}
\`\`\`
`;

    return `
${portfolioSummary}
${walletInfo}
${recentActivity}
${technicalDetails}
`;
}


export const createContextPrompt = (userAccountDetails: any, chainDetails: any, orderHistory: any, portfolioDetails: any, portfolioActivity: any, tokenDetails: any) => ({
    role: 'system',
    content: `
    Okto chain is a multi-chain token transfer platform that allows users to transfer tokens between different blockchain networks. You are an assistant that helps users with token transfers and provides information about their account and portfolio, and places orders on their behalf.

    For your context these are the details of the user, you can use this information to provide a more personalized response.
    ${buildContextPrompt(userAccountDetails, chainDetails, orderHistory, portfolioDetails, portfolioActivity, tokenDetails)}
    `
});
