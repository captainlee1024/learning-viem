import {erc20Abi} from "viem";
import {waitForTransactionReceipt, writeContract} from "viem/actions";


// ERC20 写操作动作（目前只实现 transfer）
export const erc20WriteAction = (client) => ({
    transfer: (args) => transferTokens(client, args),
    mint: (args) => mintTokens(client, args),
});

// ERC20 transfer
async function transferTokens(client, { contractAddress, to, amount }) {
    // writeContract
    const txHash = await writeContract(client, {
        address: contractAddress,
        abi: erc20Abi,
        functionName: "transfer",
        args: [to, amount],
        account: client.account, // 确保 account 已配置
    });

    // 等待交易确认
    const receipt = await waitForTransactionReceipt(client, { hash: txHash });
    return receipt;
}

async function mintTokens(client, { contractAddress, to, amount }) {
    // writeContract
    const txHash = await writeContract(client, {
        address: contractAddress,
        abi: erc20Abi,
        functionName: "mint",
        args: [to, amount],
        account: client.account, // 确保 account 已配置
    });

    // 等待交易确认
    const receipt = await waitForTransactionReceipt(client, { hash: txHash });
    return receipt;
}