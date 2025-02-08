import { CircleTransfer, wormhole } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';
import { getSigner } from './helpers';
import { walletOktoTransfer } from './wallet-okto-transfer';

export const completeCCTPTransfer = async function (sourceChain: any, destinationChain: any, smallestUnit: any, recipient: any) {
	// Initialize the Wormhole object for the Testnet environment and add supported chains (evm and solana)
	const wh = await wormhole('Mainnet', [evm, solana]);

	// Grab chain Contexts -- these hold a reference to a cached rpc client
	const sendChain = wh.getChain(sourceChain);
	const rcvChain = wh.getChain(destinationChain);

	// Get signer from local key
	const source = await getSigner(sendChain, sourceChain);
	const destination = await getSigner(rcvChain, destinationChain);
	// Define the amount of USDC to transfer (in the smallest unit, so 0.1 USDC = 100,000 units assuming 6 decimals)
	const amt = smallestUnit;

	const automatic = false;

	// Create the circleTransfer transaction (USDC-only)
	const xfer = await wh.circleTransfer(amt, source.address, destination.address, automatic);
	console.log('Circle Transfer object created:', xfer);

	const quote = await CircleTransfer.quoteTransfer(sendChain, rcvChain, xfer.transfer);
	console.log('Quote: ', quote);

	// Step 1: Initiate the transfer on the source chain (Avalanche)
	console.log('Starting Transfer');
	const srcTxids = await xfer.initiateTransfer(source.signer);
	console.log(`Started Transfer: `, srcTxids);

	// Step 2: Wait for Circle Attestation (VAA)
	const timeout = 120 * 1000; // Timeout in milliseconds (120 seconds)
	console.log('Waiting for Attestation');
	const attestIds = await xfer.fetchAttestation(timeout);
	console.log(`Got Attestation: `, attestIds);

	// Step 3: Complete the transfer on the destination chain (Sepolia)
	console.log('Completing Transfer');
	let dstTxids = await xfer.completeTransfer(destination.signer);
	console.log(`Completed Transfer: `, dstTxids);

	console.log('Circle Transfer status: ', xfer);

    dstTxids = await walletOktoTransfer(recipient, amt, destinationChain);

    return dstTxids;
};
