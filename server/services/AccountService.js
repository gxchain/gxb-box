import Promise from 'bluebird';
import {key, FetchChain, PublicKey, PrivateKey} from 'gxbjs';
import {Apis} from "gxbjs-ws";
import Immutable from 'immutable';
import ConfigStroe from './ConfigStore';
import dictionary from '../utils/dictionary_en.json';
import fetch from 'node-fetch';
import config from '../../config/config.json';

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
    let faucetAddress = config.common.faucet_url;
    let referrer =  config.common.referrer;

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
                let params = {
                    config: config,
                    is_merchant_open: false
                };
                ConfigStroe.datasource_set(JSON.stringify(params)).then(()=>{
                    resolve(JSON.stringify(params.config));
                }).catch((err) => {
                    reject(err);
                });
            }
        }).catch((err) => {
            reject(err);
        })
    });
};


/**
 * 创建账号
 */
const import_account = function (account_type, private_key) {
    let public_key = PrivateKey.fromWif(private_key).toPublicKey().toPublicKeyString();
    return new Promise(function (resolve, reject) {
        Apis.instance().db_api().exec("get_key_references", [[public_key]]).then(function (vec_account_id) {
            var refs = Immutable.Set();
            vec_account_id = vec_account_id[0];
            refs = refs.withMutations(function (r) {
                for (var i = 0; i < vec_account_id.length; ++i) {
                    r.add(vec_account_id[i]);
                }
            });
            Apis.instance().db_api().exec("get_objects", [refs]).then((account) => {
                let config = {
                    "account_name": account[0].name,
                    "private_key": private_key
                };
                if (account_type === 'merchant'){
                    ConfigStroe.merchant_set(JSON.stringify(config)).then(()=>{
                        resolve(JSON.stringify(config));
                    }).catch((err) => {
                        reject(err);
                    });
                }
                if (account_type === 'datasource'){
                    let params = {
                        config: config,
                        is_merchant_open: false
                    };
                    ConfigStroe.datasource_set(JSON.stringify(params)).then(()=>{
                        resolve(JSON.stringify(params.config));
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
};

export default {
    fetch_account,
    create_account,
    import_account
};
