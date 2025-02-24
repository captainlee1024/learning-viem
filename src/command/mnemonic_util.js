import fs from "fs";
import path from "path";
import { wordlist as wordlist_english } from "@scure/bip39/wordlists/english";
import { wordlist as wordlist_chinese } from "@scure/bip39/wordlists/simplified-chinese";

export const wordlists = {
	english: wordlist_english,
	chinese: wordlist_chinese,
};

export const wordPathStr = "./current_mnemonic";
export const wordFilePath = path.resolve(wordPathStr);

export function saveMnemonic(mnemonic) {
	fs.writeFileSync(wordFilePath, mnemonic, { encoding: "utf-8" });
}

export function loadMnemonic() {
	if (fs.existsSync(wordFilePath)) {
		return fs.readFileSync(wordFilePath, { encoding: "utf-8" }).trim();
	}
	return null;
}
