import {readContract} from "viem/actions";
import {erc20Abi} from "viem";
import {createWalletClient} from "viem";

export const erc20ReadAction = (client) => ({
    // 获取 ERC20 余额
    getBalanceOf: (args) => fetchBalanceOf(client, args),
    // 获取 ERC20 代币名称
    getName: (args) => getTokenName(client, args),
});

async function fetchBalanceOf(client, { contractAddress, address }) {
    const balance = await readContract(client, {
        address: contractAddress,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address],
    });
    return balance;
}

async function getTokenName(client, { contractAddress }) {
    console.log("getTokenName", contractAddress);
    const name = await readContract(client, {
        address: contractAddress,
        abi: erc20Abi,
        functionName: "name",
        args: [],
    });
    return name;
}
