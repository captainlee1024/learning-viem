import { mnemonicToAccount } from "viem/accounts";
import {loadMnemonic} from "../command/mnemonic_util.js";
import { createClient, http } from 'viem';
import {sepolia} from "viem/chains";


export const defaultAccount = mnemonicToAccount(loadMnemonic());
export function readWallet(url, config) {
    return createClient({
        chain: sepolia,
        transport: http(url, config),
        // account: defaultAccount
    })
}
export function writeWallet(account, url, config) {
    return createClient({
        chain: sepolia,
        transport: http(url, config),
        account: account,
    })
}