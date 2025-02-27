import { mnemonicToAccount, generateMnemonic } from "viem/accounts";
// 交互输入
import inquirer from "inquirer";
// color
import chalk from "chalk";
import {readWallet} from "../client/wallet.js";
import {erc20ReadAction} from "../actions/erc20read.js";
import {sepolia,mainnet} from "viem/chains";

//export const erc20ReadWallet = readWallet("https://ethereum-sepolia-rpc.publicnode.com").extend(erc20ReadAction);
const DEFAULT_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";

export const erc20ReadCommand = {
    name: "erc20-read",
    description: "Read data from an ERC20 contract",
    setup: (cmd) =>
        cmd
            .option(
            "--rpc <url>",
            "RPC URL for the Ethereum network",
            DEFAULT_RPC_URL
        )
            .option(
                "--network <network>",
                "chain network",
                "sepolia"
            ),
    action: erc20ReadCmdAction,
};

async function erc20ReadCmdAction(options) {
    const rpcUrl = options.rpc;
    let chain;
    if (options.network === "ethereum") {
        chain = mainnet
    } else if (options.network === "sepolia") {
        chain = sepolia
    }
    const erc20ReadWallet = readWallet(chain, rpcUrl).extend(erc20ReadAction);

    // 提示用户选择操作类型和输入参数
    const { operation } = await inquirer.prompt([
        {
            type: "list",
            name: "operation",
            message: "Select an ERC20 read operation:",
            choices: [
                { name: "Get Balance", value: "getBalanceOf" },
                { name: "Get Name", value: "getName" },
                { name: "ERC20 Events log", value: "erc20Events" },
            ],
        },
    ]);

    // 根据操作类型提示参数
    let args;
    if (operation === "getBalanceOf") {
        args = await inquirer.prompt([
            {
                type: "input",
                name: "contractAddress",
                message: "Enter ERC20 contract address:",
                validate: (input) => (input ? true : "Contract address is required"),
            },
            {
                type: "input",
                name: "address",
                message: "Enter wallet address:",
                validate: (input) => (input ? true : "Wallet address is required"),
            },
        ]);
    } else if (operation === "getName") {
        args = await inquirer.prompt([
            {
                type: "input",
                name: "contractAddress",
                message: "Enter ERC20 contract address:",
                validate: (input) => (input ? true : "Contract address is required"),
            },
        ]);
    } else if (operation === "erc20Events") {
        args = await inquirer.prompt([
            {
                type: "input",
                name: "contractAddress",
                message: "Enter ERC20 contract address:",
                validate: (input) => (input ? true : "Contract address is required"),
            },
            // {
            //     type: "number",
            //     name: "recentBlock",
            //     message: "Fetch recent block:",
            //     validate: (input) => (input ? true : "number is required"),
            // },
            {
                type: "list",
                name: "eventName",
                message: "Select event name:",
                choices: [
                    { name: "Transfer", value: "Transfer" },
                    { name: "Approval", value: "Approval" },
                ],
            },

        ]);
    }

    try {
        // 调用对应的读取方法
        console.log(`function: ${operation}`);
        console.log(`args: ${JSON.stringify(args)}`);
        const result = await erc20ReadWallet[operation](args);
        if (result === 0) {
            console.log("Done!")
        } else {
            console.log(chalk.green(`${operation} result: ${result}`));
        }
    } catch (error) {
        console.error(chalk.red(`Error: ${error.message}`));
    }
}
