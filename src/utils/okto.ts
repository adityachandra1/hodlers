import { OktoClient } from "@okto_web3/core-js-sdk";
import { getAccount, getPortfolio, getChains, getTokens, getPortfolioActivity, getPortfolioNFT, getNftCollections, getOrdersHistory } from "@okto_web3/core-js-sdk/explorer";
import { tokenTransfer, nftTransfer, evmRawTransaction } from "@okto_web3/core-js-sdk/userop";
// import { Env } from "@okto_web3/core-js-sdk/dist/core/types";

const main = async () => {
    // Initialize OktoClient
    const oktoClient = new OktoClient({
        environment: 'sandbox',
        vendorPrivKey: '0xadf2181a7b2dec0f1ed22061ab31bd6182691c619d9e874a956e71ab7ecca413',
        vendorSWA: '0x6b6Fad2600Bc57075ee560A6fdF362FfefB9dC3C',
    });

    console.log('Okto Client: ', oktoClient);

    // Log in using Google OAuth and Okto Client
    const user = await oktoClient.loginUsingOAuth({
        idToken:
            'eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlYzUzNGZhNWI4Y2FjYTIwMWNhOGQwZmY5NmI1NGM1NjIyMTBkMWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTA3MjYxNDI5MjAxNzU2MjM1MzYiLCJoZCI6ImNvaW5kY3guY29tIiwiZW1haWwiOiJ2YWliaGF2LnBhbmRleUBjb2luZGN4LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiaGZqNnBVbWdDTzhGRE5nWWVTNEJTdyIsIm5hbWUiOiJWYWliaGF2IFBhbmRleSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLTzdHclFNU0RhVXZ1M2YxZkRjc3loXzRMYVN2QkMyV3BfS1hIazFXMGEzUmpYa3c9czk2LWMiLCJnaXZlbl9uYW1lIjoiVmFpYmhhdiIsImZhbWlseV9uYW1lIjoiUGFuZGV5IiwiaWF0IjoxNzM5MDE3MDc0LCJleHAiOjE3MzkwMjA2NzR9.hNdwcN3Ie1FSqjwyY9Fkhz2ZxdP3OypB08Dl5c3XB45O4hu8-3w6B3tFpl3ARr6pSsFiHZoIdXWvXAz__6MDlZBMmQa40bi_-DsT2u_K7-6pkfbNmm-r3KPmTTZrUhS9QeedqHzdeD16A6QaVMsJAQKWeqId2HgnMFfCojzXXYe8t53l-Lu7ZFiQyZDELOUFFwJn6nuuuOV3HN6nDWH2_CD4OgzR3mNfwdb5AxzvPGcNIQhD1r9ayPOnMMKgO4D-PuFOk_vkoZBgjPlR6MZdpo08DsVdV4WvfrruC8YXGdr8-heLha138gcDkW5rVK5iVDeIOM0Pa_MKjRtoAdvIVA',
        provider: 'google',
    })
    console.log('User: ', user);

    // const rawTx = await evmRawTransaction(oktoClient, {
    //     caip2Id: 'eip155:43114',
    //     transaction: {
    //         from: '0x55d70f37a7D69DD57BCf3D942a705E48991E5E81',
    //         to: '0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa',
    //         value: 0,
    //         data: '0x095ea7b30000000000000000000000006b25532e1060ce10cc3b0a99e5683b91bfde698200000000000000000000000000000000000000000000000000000000000186a0',
    //     }
    // })
    // console.log('Raw Tx: ', rawTx);

    // const signedRawTx = await oktoClient.signUserOp(rawTx)
    // console.log('Signed Raw Tx: ', signedRawTx);    

    // const jobId = await oktoClient.executeUserOp(signedRawTx)
    // console.log('Job ID: ', jobId);

    const rawTxForBurn = await evmRawTransaction(oktoClient, {
        caip2Id: 'eip155:43114',
        transaction: {
            from: '0x55d70f37a7D69DD57BCf3D942a705E48991E5E81',
            to: '0x6B25532e1060CE10cc3B0A99e5683b91BFDe6982',
            value: 0,
            data: '0x6fd3504e00000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000000000000000000600000000000000000000000055d70f37a7d69dd57bcf3d942a705e48991e5e81000000000000000000000000b97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
        }
    })

    console.log('Raw Tx For Burn: ', rawTxForBurn); 

    const signedRawTxForBurn = await oktoClient.signUserOp(rawTxForBurn)
    console.log('Signed Raw Tx For Burn: ', signedRawTxForBurn);

    const jobIdForBurn = await oktoClient.executeUserOp(signedRawTxForBurn)
    console.log('Job ID For Burn: ', jobIdForBurn);

    // // Verify login
    // const isLoggedIn = await oktoClient.verifyLogin()
    // console.log('Is Logged In: ', isLoggedIn);

    // // Generate authorization token
    // const authToken = await oktoClient.getAuthorizationToken()
    // console.log('Auth Token: ', authToken);

    // // Check your portfolio
    // const portfolio = await getPortfolio(oktoClient)
    // console.log('Portfolio: ', portfolio);

    // // Get all supported chains
    // const chains = await getChains(oktoClient)
    // console.log('Supported Chains: ', chains);

    // // Get all supported tokens
    // const tokens = await getTokens(oktoClient)
    // console.log('Supported Tokens: ', tokens);

    // // Get portfolio activity
    // const portfolioActivity = await getPortfolioActivity(oktoClient)
    // console.log('Portfolio Activity: ', portfolioActivity);

    // // Get NFT portfolio
    // const nftPortfolio = await getPortfolioNFT(oktoClient)
    // console.log('NFT Portfolio: ', nftPortfolio);

    // // Get NFT Collections
    // const nftCollections = await getNftCollections(oktoClient)
    // console.log('NFT Collections: ', nftCollections);

    // const signedTransferTokensUserOp = await oktoClient.signUserOp(transferTokensUserOp)
    // console.log('Signed Transfer Tokens UserOp: ', signedTransferTokensUserOp);

    // const jobId = await oktoClient.executeUserOp(signedTransferTokensUserOp)
    // console.log('Job ID: ', jobId);

    // // Transfer NFT
    // const transferNFTUserOp = await nftTransfer(oktoClient, {
    //     networkId: 'eip155:137',
    //     collectionAddress: '0x0000000000000000000000000000000000000000',
    //     nftId: '1',
    //     recipientWalletAddress: '0x0x0000000000000000000000000000000000000000',
    //     amount: 1,
    //     type: 'nft',
    // })
    // console.log('Transfer NFT UserOp: ', transferNFTUserOp);

    // const signedTransferNFTUserOp = await oktoClient.signUserOp(transferNFTUserOp)
    // console.log('Signed Transfer NFT UserOp: ', signedTransferNFTUserOp);

    // const jobId2 = await oktoClient.executeUserOp(signedTransferNFTUserOp)
    // console.log('Job ID: ', jobId2);

    // //Get Order History
    // const orderHistory = await getOrdersHistory(oktoClient)
    // console.log('Order History: ', orderHistory);
};

main();
