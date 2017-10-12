import Promise from 'bluebird';
import {key, TransactionBuilder, FetchChain, PublicKey} from 'gxbjs';
import {Apis} from 'gxbjs-ws';
import dictionary from '../utils/dictionary_en.json';
import fetch from 'node-fetch';

const DEFAULT_FAUCET = "http://192.168.1.118:1337/gateway";

/**
 * 创建账号
 */
const create_account = function (new_account_name) {
    let brainkey = key.suggest_brain_key( dictionary.en );
    let private_key = key.get_brainPrivateKey( brainkey );
    let owner_pubkey = private_key.toPublicKey().toPublicKeyString();
    let active_pubkey = private_key.toPublicKey().toPublicKeyString();

    // using faucet
    let faucetAddress = DEFAULT_FAUCET;

    return new Promise(function (resolve, reject) {
        let create_account_promise = fetch( faucetAddress + "/account/register", {
            method: "post",
            mode: "cors",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "account": {
                    "name": new_account_name,
                    "owner_key": owner_pubkey,
                    "active_key": active_pubkey,
                    "memo_key": active_pubkey,
                    "refcode": "",
                    "referrer": "nathan"
                }
            })
        }).then((r) => {
            resolve(r.json());
        }).catch((err) => {
            reject(err);
        })
    });
};

export default {
    create_account
};
