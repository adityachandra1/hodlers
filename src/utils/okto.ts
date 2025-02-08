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
            'eyJhbGciOiJSUzI1NiIsImtpZCI6ImVlYzUzNGZhNWI4Y2FjYTIwMWNhOGQwZmY5NmI1NGM1NjIyMTBkMWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTA3MjYxNDI5MjAxNzU2MjM1MzYiLCJoZCI6ImNvaW5kY3guY29tIiwiZW1haWwiOiJ2YWliaGF2LnBhbmRleUBjb2luZGN4LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiX3RUX3dsdVg2S0JENm1jckc3REtJZyIsIm5hbWUiOiJWYWliaGF2IFBhbmRleSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLTzdHclFNU0RhVXZ1M2YxZkRjc3loXzRMYVN2QkMyV3BfS1hIazFXMGEzUmpYa3c9czk2LWMiLCJnaXZlbl9uYW1lIjoiVmFpYmhhdiIsImZhbWlseV9uYW1lIjoiUGFuZGV5IiwiaWF0IjoxNzM5MDEzMTAxLCJleHAiOjE3MzkwMTY3MDF9.cBO5RvXqmnXWVEc8nOFjQnYaeVnWgxah6maQujT3Wuq6Z_6_SzdjAhntiUEOSrY_gBEId_VOYJipZ3r2l8ipO-2uWt7z_CLzjIEMTGUa-6YlwZLx5wKOkIK47lI5P2UQMJAklq_v3FPLUtxHaWK4yfeTLuJuyij2tA4kGxBmTa7C8hW40QSzeDGvPO7u0aG6QOTC1dnnSE6pU3-8KsgzOuAm7YdRKTbzICwc3DxuuZDsgNTP7Wh_qrXnnznFMxQTX9IrYnBnrk_XKpySLPlZNHnmnMZd-qXQNzA6hJxlQeee9IlYVnYQYNY-nbZHjbmtvvJ553A-aLLwYiYohDbTzw',
        provider: 'google',
    })
    console.log('User: ', user);

    const rawTx = await evmRawTransaction(oktoClient, {
        caip2Id: 'eip155:43114',
        transaction: {
            from: '0x55d70f37a7D69DD57BCf3D942a705E48991E5E81',
            to: '0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa',
            value: 0,
            data: '0x095ea7b30000000000000000000000008fe6b999dc680ccfdd5bf7eb0974218be2542daa00000000000000000000000000000000000000000000000000000000000186a0',
        }
    })
    console.log('Raw Tx: ', rawTx);

    const signedRawTx = await oktoClient.signUserOp(rawTx)
    console.log('Signed Raw Tx: ', signedRawTx);    

    const jobId = await oktoClient.executeUserOp(signedRawTx)
    console.log('Job ID: ', jobId);

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
