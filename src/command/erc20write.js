import inquirer from "inquirer";
import {writeWallet} from "../client/wallet.js";
import {erc20WriteAction} from "../actions/erc20write.js";
import chalk from "chalk";
import {loadMnemonic} from "./mnemonic_util.js";
import {mnemonicToAccount} from "viem/accounts";

const DEFAULT_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
export const erc20WriteCommand = {
    name: "erc20-write",
    description: "Write data to an ERC20 contract",
    setup: (cmd) =>
        cmd.option(
            "--rpc <url>",
            "RPC URL for the Ethereum network",
            DEFAULT_RPC_URL
        ),
    action: erc20WriteCmdAction,
}

async function erc20WriteCmdAction(options) {
    const rpcUrl = options.rpc;
    const mnemonic = await loadMnemonic();

    if (!mnemonic) {
        console.log("Please import mnemonic first");
        return;
    }

    const account = mnemonicToAccount(mnemonic);
    console.log("Use default the mnemonic's account:", account);

    const erc20WriteWallet = writeWallet(account, rpcUrl).extend(erc20WriteAction);

    // 提示用户选择操作类型和输入参数
    const { operation } = await inquirer.prompt([
        {
            type: "list",
            name: "operation",
            message: "Select an ERC20 write operation:",
            choices: [
                { name: "Transfer", value: "transfer" },
                { name: "Mint", value: "mint" },
            ],
        },
    ]);

    // 根据操作类型提示参数
    let args;
    if (operation === "transfer") {
        args = await inquirer.prompt([
            {
                type: "input",
                name: "contractAddress",
                message: "Enter ERC20 contract address:",
                validate: (input) => (input ? true : "Contract address is required"),
            },
            {
                type: "input",
                name: "to",
                message: "Enter recipient address:",
                validate: (input) => (input ? true : "Recipient address is required"),
            },
            {
                type: "input",
                name: "amount",
                message: "Enter transfer amount:",
                validate: (input) => (input ? true : "Transfer amount is required"),
            },
        ]);
    } else if (operation === "mint") {
        args = await inquirer.prompt([
            {
                type: "input",
                name: "contractAddress",
                message: "Enter ERC20 contract address:",
                validate: (input) => (input ? true : "Contract address is required"),
            },
            {
                type: "input",
                name: "to",
                message: "Enter recipient address:",
                validate: (input) => (input ? true : "Recipient address is required"),
            },
            {
                type: "input",
                name: "amount",
                message: "Enter mint amount:",
                validate: (input) => (input ? true : "Mint amount is required"),
            },
        ]);
    }

    // 执行操作
    try {
        console.log(`function: ${operation}`);
        console.log(`args: ${JSON.stringify(args)}`);
        const result = await erc20WriteWallet[operation](args);
        console.log(result);
    } catch (error) {
        console.error(chalk.red(`Error: ${error.message}`));
    }

}