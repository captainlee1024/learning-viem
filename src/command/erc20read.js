import { mnemonicToAccount, generateMnemonic } from "viem/accounts";
// 交互输入
import inquirer from "inquirer";
// color
import chalk from "chalk";
import { wordlists, saveMnemonic, loadMnemonic } from "./mnemonic_util.js";
import {readWallet} from "../client/wallet.js";
import {erc20ReadAction} from "../actions/erc20read.js";
import {genAccount} from "./mnemonic.js";

//export const erc20ReadWallet = readWallet("https://ethereum-sepolia-rpc.publicnode.com").extend(erc20ReadAction);
const DEFAULT_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";

export const erc20ReadCommand = {
    name: "erc20-read",
    description: "Read data from an ERC20 contract",
    setup: (cmd) =>
        cmd.option(
            "--rpc <url>",
            "RPC URL for the Ethereum network",
            DEFAULT_RPC_URL
        ),
    action: erc20ReadCmdAction,
};

async function erc20ReadCmdAction(options) {
    const rpcUrl = options.rpc;
    const erc20ReadWallet = readWallet(rpcUrl).extend(erc20ReadAction);

    // 提示用户选择操作类型和输入参数
    const { operation } = await inquirer.prompt([
        {
            type: "list",
            name: "operation",
            message: "Select an ERC20 read operation:",
            choices: [
                { name: "Get Balance", value: "getBalanceOf" },
                { name: "Get Name", value: "getName" },
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
    }

    try {
        // 调用对应的读取方法
        console.log(`function: ${operation}`);
        console.log(`args: ${JSON.stringify(args)}`);
        const result = await erc20ReadWallet[operation](args);
        console.log(chalk.green(`${operation} result: ${result}`));
    } catch (error) {
        console.error(chalk.red(`Error: ${error.message}`));
    }
}
