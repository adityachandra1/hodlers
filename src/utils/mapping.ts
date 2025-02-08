interface RpcMap {
    [key: string]: string;
}

interface UsdcAddresses {
    [key: string]: string;
}

export const rpcMap: RpcMap = {
    Avalanche: 'https://avax-fuji.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    Sepolia: 'https://eth-sepolia.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    Polygon: 'https://polygon-amoy.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    Arbitrum: 'https://arb-sepolia.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    BaseSepolia: 'https://base-sepolia.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    Bsc: 'https://bnb-testnet.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
    Optimism: 'https://opt-sepolia.g.alchemy.com/v2/B0RgFDK3Iup5ctn0olfVUXv2f9A7W6-4',
}

export const usdcAddresses: UsdcAddresses = {
    Avalanche: '0x5425890298aed601595a70ab815c96711a31bc65',
    Sepolia: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    Polygon: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
    Arbitrum: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
    BaseSepolia: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    Bsc: '0x55d398326f99059ff775485246999027b3197955',
    Optimism: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
}

export const chainIds = {
    Avalanche: 43114,
    Sepolia: 11155111,
    Polygon: 137,
    Arbitrum: 42161,
    BaseSepolia: 84532,
    Bsc: 97,
    Optimism: 10,
}