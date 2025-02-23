import { erc721Abi } from "viem";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";

const proxyAgent = new HttpsProxyAgent("http://127.0.0.1:7899");

const client = createPublicClient({
	chain: mainnet,
	transport: http("https://eth-mainnet.public.blastapi.io"),
});

const blockNumber = await client.getBlockNumber();
console.log("blockNumber", blockNumber);

// NFT 合约地址
const nftContractAddress = "0x0483B0DFc6c78062B9E999A82ffb795925381415";

async function getNFTDetails(tokenId) {
	try {
		// 获取 NFT 的 owner
		const owner = await client.readContract({
			address: nftContractAddress,
			abi: erc721Abi,
			//abi: contractAbi,
			functionName: "ownerOf",
			args: [tokenId],
		});
		console.log("NFT Owner:", owner);

		// 获取 NFT 的 tokenURI
		const tokenURI = await client.readContract({
			address: nftContractAddress,
			abi: erc721Abi,
			//abi: contractAbi,
			functionName: "tokenURI",
			args: [tokenId],
		});
		console.log("Token URI:", tokenURI);

		// 获取 IPFS 元数据
		let metadata;
		if (tokenURI.startsWith("ipfs://")) {
			const ipfsHash = tokenURI.replace("ipfs://", "");
			const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
			console.log("fetch ipfs: ", ipfsUrl);
			const response = await fetch(ipfsUrl, {
				agent: proxyAgent,
				timeout: 3000,
			});
			if (!response.ok) {
				throw new Error(`Failed to fetch IPFS metadata: ${response.statusText}`);
			}
			metadata = await response.json();
			console.log("NFT Metadata:", metadata);
		} else {
			console.log("Token URI is not an IPFS link:", tokenURI);
		}

		return { owner, tokenURI, metadata };
	} catch (error) {
		console.error("Error fetching NFT details:", error);
	}
}

getNFTDetails(79);
