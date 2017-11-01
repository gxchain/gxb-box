import Promise from 'bluebird';
import {key, PrivateKey, Signature} from 'gxbjs';
import {Apis} from "gxbjs-ws";
import Immutable from 'immutable';
import ConfigStroe from './ConfigStore';
import dictionary from '../utils/dictionary_en.json';
import request from 'superagent';
import config from '../../config/config.json';
/**
 * 创建账号
 */
const create_account = function (account_type, new_account_name, protocol) {
    let brainkey = key.suggest_brain_key( dictionary.en );
    let private_key = key.get_brainPrivateKey( brainkey );
    let owner_pubkey = private_key.toPublicKey().toPublicKeyString();
    let active_pubkey = private_key.toPublicKey().toPublicKeyString();
    let faucetAddress = config.common.faucet_url;
    if (protocol === "https:") {
        faucetAddress = faucetAddress.replace(/http:\/\//, "https://");
    }
    let referrer =  config.common.referrer;

    return new Promise(function (resolve, reject) {
        let body = {
            account: {
                name: new_account_name,
                owner_key: owner_pubkey,
                active_key: active_pubkey,
                memo_key: active_pubkey,
                refcode: "",
                referrer: referrer
            }
        };
        request
            .post(faucetAddress + "/account/register")
            .send(body)
            .set('Accpet','application/json')
            .set('Content-Type', 'application/json')
            .end(function (err,res) {
                if (err) {
                    reject(err)
                } else {
                    let config = {
                        "account_name": new_account_name,
                        "private_key": private_key.toWif()
                    };
                    if (account_type === 'merchant'){
                        ConfigStroe.merchant_set(JSON.stringify(config)).then(()=>{
                            resolve(config);
                        }).catch((err) => {
                            reject(err);
                        });
                    }else{
                        ConfigStroe.datasource_set(null, JSON.stringify(config), false).then(()=>{
                            resolve(config);
                        }).catch((err) => {
                            reject(err);
                        });
                    }
                }
            });
    });
};

/**
 * 获取账户信息
 */
const fetch_account = function (account_name) {
    return new Promise(function (resolve, reject) {
        Apis.instance().db_api().exec("get_account_by_name", [account_name]).then((account)=>{
            resolve(account);
        }).catch((err)=>{
            reject(err);
        })
    })
};

/**
 * 导入账号
 */
const import_account = function (account_type, private_key) {
    let public_key = PrivateKey.fromWif(private_key).toPublicKey().toPublicKeyString();
    return new Promise(function (resolve, reject) {
        Apis.instance().db_api().exec("get_key_references", [[public_key]]).then(function (vec_account_id) {
            let refs = Immutable.Set();
            vec_account_id = vec_account_id[0];
            refs = refs.withMutations(function (r) {
                for (let i = 0; i < vec_account_id.length; ++i) {
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
                        resolve(config);
                    }).catch((err) => {
                        reject(err);
                    });
                }else{
                    ConfigStroe.datasource_set(null, JSON.stringify(config), false).then(()=>{
                        resolve(config);
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

/**
 * 获取序列
 */
const sortJSON = function (json) {
    let keys = Object.keys(json);
    keys.sort();
    let result = {};
    keys.forEach(function (k) {
        result[k] = json[k];
    });
    return result;
};

/**
 * 获取签名
 */
const getSign = function (body = '',type) {
    return new Promise(function (resolve, reject) {
        try {
            let private_key;
            if (type === 'merchant'){
                private_key = ConfigStroe.get_merchant_private_key();
            }else{
                private_key = ConfigStroe.get_datasource_private_key();
            }
            let signature = Signature.sign(body, private_key).toHex();
            resolve(signature);
        }
        catch (ex) {
            reject(ex);
        }
    })
};

/**
 * 获取商户信息
 */
const fetch_merchant = function (account_name, account_type, protocol) {
    let faucetAddress = config.common.faucet_url;
    if (protocol === "https:") {
        faucetAddress = faucetAddress.replace(/http:\/\//, "https://");
    }
    return new Promise(function (resolve, reject) {
        fetch_account(account_name).then((account)=> {
            let body = {};
            body.account_id = account.id;
            body = sortJSON(body);
            getSign(JSON.stringify(body), account_type).then(function (signature) {
                body.signature = signature;
                request
                    .get(faucetAddress + "/merchant/info")
                    .query(body)
                    .set('Accpet','application/json')
                    .set('Content-Type', 'application/json')
                    .end(function (err,res) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(res.body);
                        }
                    });
            }).catch(err=>reject(err));
        }).catch(err=>reject(err));
    });
};

/**
 * 申请认证商户
 */
const apply_merchant = function (body, account_name, account_type, protocol) {
    let faucetAddress = config.common.faucet_url;
    if (protocol === "https:") {
        faucetAddress = faucetAddress.replace(/http:\/\//, "https://");
    }
    return new Promise(function (resolve, reject) {
        fetch_account(account_name).then((account)=>{
            body.account_id = account.id;
            body = sortJSON(body);
            getSign(JSON.stringify(body), account_type).then(function (signature) {
                body.signature = signature;
                request
                    .post(faucetAddress + "/merchant/create")
                    .send(body)
                    .set('Accpet','application/json')
                    .set('Content-Type', 'application/json')
                    .end(function (err,res) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(res.body);
                        }
                    });
            }).catch(err=>reject(err));
        }).catch(err=>reject(err));
    });
};

/**
 * 申请认证数据源
 */
const apply_datasource = function (body, account_name, account_type, protocol) {
    let faucetAddress = config.common.faucet_url;
    if (protocol === "https:") {
        faucetAddress = faucetAddress.replace(/http:\/\//, "https://");
    }
    return new Promise(function (resolve, reject) {
        fetch_account(account_name).then((account)=>{
            body.account_id = account.id;
            body = sortJSON(body);
            getSign(JSON.stringify(body), account_type).then(function (signature) {
                body.signature = signature;
                request
                    .post(faucetAddress + "/dataSource/create")
                    .send(body)
                    .set('Accpet','application/json')
                    .set('Content-Type', 'application/json')
                    .end(function (err,res) {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(res.body);
                        }
                    });
            }).catch(err=>reject(err));
        }).catch(err=>reject(err));
    });
};

/**
 * 获取申请状态
 */
const is_applying = function (account_name, protocol) {
    let faucetAddress = config.common.faucet_url;
    if (protocol === "https:") {
        faucetAddress = faucetAddress.replace(/http:\/\//, "https://");
    }
    return new Promise(function (resolve, reject) {
        fetch_account(account_name).then((account) => {
            request
                .get(faucetAddress + "/account/apply_status")
                .query({account_id: account.id})
                .set('Accpet','application/json')
                .set('Content-Type', 'application/json')
                .end(function (err,res) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res.body);
                    }
                });
        }).catch(err => reject(err));
    });
};

const fetch_league_members = function (league_id, protocol) {
    let faucetAddress = config.common.faucet_url;
    if (protocol === "https:") {
        faucetAddress = faucetAddress.replace(/http:\/\//, "https://");
    }
    return new Promise(function (resolve, reject) {
        request
            .get(faucetAddress + "/leagueDataSource/memberInfo")
            .query({league_id: league_id})
            .set('Accpet','application/json')
            .set('Content-Type', 'application/json')
            .end(function (err,res) {
                if (err) {
                    reject(err)
                } else {
                    resolve(res.body);
                }
            });
    })
};

export default {
    create_account,
    import_account,
    fetch_account,
    fetch_merchant,
    fetch_league_members,
    apply_merchant,
    apply_datasource,
    is_applying
};
