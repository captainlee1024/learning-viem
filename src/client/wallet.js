import { mnemonicToAccount } from "viem/accounts";
import {loadMnemonic} from "../command/mnemonic_util.js";
import { createPublicClient, createClient, http } from 'viem';


export const defaultAccount = mnemonicToAccount(loadMnemonic());
export function readWallet(chain, url, config) {
    return createPublicClient({
        chain: chain,
        transport: http(url, config),
    })
}
export function writeWallet(chain, account, url, config) {
    return createClient({
        chain: chain,
        transport: http(url, config),
        account: account,
    })
}