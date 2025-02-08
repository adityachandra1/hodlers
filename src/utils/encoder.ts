import { ethers, zeroPadValue, getAddress } from 'ethers';

const iface = new ethers.Interface([
    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint32",
            "name": "destinationDomain",
            "type": "uint32"
          },
          {
            "internalType": "bytes32",
            "name": "mintRecipient",
            "type": "bytes32"
          },
          {
            "internalType": "address",
            "name": "burnToken",
            "type": "address"
          }
        ],
        "name": "depositForBurn",
        "outputs": [
          {
            "internalType": "uint64",
            "name": "_nonce",
            "type": "uint64"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
]);

const address = "0x55d70f37a7D69DD57BCf3D942a705E48991E5E81";
const bytes32Recipient = zeroPadValue(getAddress(address), 32);

const data = iface.encodeFunctionData("depositForBurn", [
    100000,
    6,
    bytes32Recipient,
    "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
]);

console.log(data);