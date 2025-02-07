interface RpcMap {
    [key: string]: string;
}

interface UsdcAddresses {
    [key: string]: string;
}

export const rpcMap: RpcMap = {
    Avalanche: 'https://avax-mainnet.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    Ethereum: 'https://eth-mainnet.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    Polygon: 'https://polygon-mainnet.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    Arbitrum: 'https://arb-mainnet.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    Base: 'https://base-mainnet.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    Bsc: 'https://bnb-mainnet.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    Optimism: 'https://opt-mainnet.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
}

export const usdcAddresses: UsdcAddresses = {
    Avalanche: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    Ethereum: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    Polygon: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
    Arbitrum: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    Base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    Bsc: '0x55d398326f99059ff775485246999027b3197955',
    Optimism: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
}
