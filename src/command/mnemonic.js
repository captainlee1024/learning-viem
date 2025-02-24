import { mnemonicToAccount, generateMnemonic } from "viem/accounts";
// 交互输入
import inquirer from "inquirer";
// color
//import chalk from "chalk";
import { wordlists, saveMnemonic, loadMnemonic } from "./mnemonic_util.js";

export const genMnemonicCommand = {
	name: "gen-mnemonic",
	description: "Generate a new mnemonic phrase",
	action: genMnemonic,
}

export const importMnemonicCommand = {
	name: "import-mnemonic",
	description: "Import mnemonic phrase, gen default account",
	action: importMne,
}

export const genAccountCommand = {
	name: "gen-account",
	description: "Generate default account",
	action: genAccount,
}

async function genMnemonic() {
	// 获取用户输入
	const args = await inquirer.prompt([
		{
			type: "list",
			name: "wordlist",
			message: "select mnemonic word type",
			choices: ["english", "chinese"],
			default: "english",
		},
		{
			type: "number",
			name: "strength",
			message: "strength mnemonic strength 128-256 bits",
			default: 256,
		},
	]);

	// 解析wordlist类型
	const wordlist = wordlists[args.wordlist];

	// 解析strength
	const strength = args.strength;

	console.log(generateMnemonic(wordlist, strength));
}

// TODO: metamask 是如何保存助记词的?
export async function importMne() {
	const args = await inquirer.prompt([
		{
			type: "input",
			name: "mnemonic",
			message: "import mnemonic",
		},
	]);

	const mnemonic = args.mnemonic;
	const defaultAccount = mnemonicToAccount(mnemonic);
	saveMnemonic(mnemonic);
	const loadMne = loadMnemonic();

	console.log(`Import mnemonic: ${loadMne}`);
	console.log("Default account for the mnemonic:", defaultAccount);
}

export async function genAccount() {
	const mnemonic = loadMnemonic();
	if (!mnemonic) {
		console.log("Please import mnemonic first");
		return;
	}

	const account = mnemonicToAccount(mnemonic);
	console.log("Default account for the mnemonic:", account);
}
