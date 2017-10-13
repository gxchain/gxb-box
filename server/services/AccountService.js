import Promise from 'bluebird';
import {key, TransactionBuilder, FetchChain, PublicKey} from 'gxbjs';
import {Apis} from 'gxbjs-ws';
import ConfigStroe from './ConfigStore';
import dictionary from '../utils/dictionary_en.json';
import fetch from 'node-fetch';

const DEFAULT_FAUCET = "http://192.168.1.118:1337/gateway";
const DEFAULT_REFERRER = "nathan";

/**
 * 获取账户信息
 * @param account_name
 * @returns {*}
 */
const fetch_account = function (account_name) {
    return new Promise(function (resolve, reject) {
        return FetchChain('getAccount', account_name).then((account) => {
            resolve(account);
        }).catch((err) => {
            reject(err);
        });
    })
}

/**
 * 创建账号
 */
const create_account = function (account_type, new_account_name) {
    let brainkey = key.suggest_brain_key( dictionary.en );
    let private_key = key.get_brainPrivateKey( brainkey );
    let owner_pubkey = private_key.toPublicKey().toPublicKeyString();
    let active_pubkey = private_key.toPublicKey().toPublicKeyString();
    // using faucet
    let faucetAddress = DEFAULT_FAUCET;
    let referrer = DEFAULT_REFERRER;

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
                    "referrer": referrer
                }
            })
        }).then((r) => {
            //r.json()
            let config = {
                "account_name": new_account_name,
                "private_key": private_key.toWif()
            };
            if (account_type === 'merchant'){
                ConfigStroe.merchant_set(JSON.stringify(config)).then(()=>{
                    resolve(JSON.stringify(config));
                }).catch((err) => {
                    reject(err);
                });
            }
            if (account_type === 'datasource'){
                ConfigStroe.datasource_set(JSON.stringify(config)).then(()=>{
                    resolve(JSON.stringify(config));
                }).catch((err) => {
                    reject(err);
                });
            }
        }).catch((err) => {
            reject(err);
        })
    });
};

export default {
    fetch_account,
    create_account
};
