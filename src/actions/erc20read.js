import {getBlockNumber, readContract} from "viem/actions";
import {erc20Abi} from "viem";

export const erc20ReadAction = (client) => ({
    // 获取 ERC20 余额
    getBalanceOf: (args) => fetchBalanceOf(client, args),
    // 获取 ERC20 代币名称
    getName: (args) => getTokenName(client, args),
    erc20Events: (args) => erc20Events(client, args)
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

// async function erc20Events(client, {contractAddress, recentNumber, eventName}) {
async function erc20Events(client, {contractAddress, eventName}) {
    // let convertRecentNumber;
    // if ( recentNumber === undefined) {
    //     convertRecentNumber = 10n;
    // }

    // const convertRecentNumber = BigInt(recentNumber);
    // console.log("convertRecentNumber block: ", convertRecentNumber);

    try {
        const currentBlock = await getBlockNumber(client);
        console.log("currentBlock block: ", currentBlock);

        const fromBlock = currentBlock - 100n;
        console.log("from block: ", fromBlock);

        const logs = await client.getLogs({
            address: contractAddress,
            event: erc20Abi.find(item => item.name === eventName),
            fromBlock: fromBlock,
            toBlock: currentBlock,
        });

        if (logs.length === 0) {
            console.log('No Transfer events found in the last 100 blocks.');
        } else {
            console.log(`Found ${logs.length} Transfer events in the last 100 blocks:`);
            logs.forEach((log, index) => {
                const { from, to, value } = log.args; // 解构事件参数
                console.log(
                    `${index + 1}. From: ${from}, To: ${to}, Value: ${value.toString()}`
                );
            });
        }

        return 0;
    } catch (error) {
        console.error('Error fetching Transfer events:', error.message);
        throw error;
    }
}