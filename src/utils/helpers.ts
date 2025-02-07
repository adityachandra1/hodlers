import {
	ChainAddress,
	ChainContext,
	Network,
	Signer,
	Wormhole,
	Chain,
} from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';

export interface SignerStuff<N extends Network, C extends Chain> {
	chain: ChainContext<N, C>;
	signer: Signer<N, C>;
	address: ChainAddress<C>;
}

// Function to fetch environment variables (like your private key)
function getEnv(key: string): string {
	const val = process.env[key];
	if (!val) throw new Error(`Missing environment variable: ${key}`);
	return val;
}

// Signer setup function for different blockchain platforms
export async function getSigner<N extends Network, C extends Chain>(
	chain: ChainContext<N, C>, chainName: string
): Promise<{ chain: ChainContext<N, C>; signer: Signer<N, C>; address: ChainAddress<C> }> {
	let signer: Signer;
	const platform = chain.platform.utils()._platform;

	switch (platform) {
		case 'Solana':
			signer = await (await solana()).getSigner(await chain.getRpc(), process.env.WALLET_PRIVATE_KEY);
			break;
		case 'Evm':
			signer = await (await evm()).getSigner(await chain.getRpc(), process.env.WALLET_PRIVATE_KEY);
			break;
		default:
			throw new Error('Unsupported platform: ' + platform);
	}

	return {
		chain,
		signer: signer as Signer<N, C>,
		address: Wormhole.chainAddress(chain.chain, signer.address()),
	};
}

export async function getTempSigner<N extends Network, C extends Chain>(
	chain: ChainContext<N, C>
): Promise<{ chain: ChainContext<N, C>; signer: Signer<N, C>; address: ChainAddress<C> }> {
	let signer: Signer;
	const platform = chain.platform.utils()._platform;

	switch (platform) {
		case 'Solana':
			signer = await (await solana()).getSigner(await chain.getRpc(), 'ac5ae851bd386008ef02b84b4a22609c6c376fdeecfd4e5772bf7cfdc7bbab43');
			break;
		case 'Evm':
			signer = await (await evm()).getSigner(await chain.getRpc(), 'ac5ae851bd386008ef02b84b4a22609c6c376fdeecfd4e5772bf7cfdc7bbab43');
			break;
		default:
			throw new Error('Unsupported platform: ' + platform);
	}

	return {
		chain,
		signer: signer as Signer<N, C>,
		address: Wormhole.chainAddress(chain.chain, signer.address()),
	};
}
