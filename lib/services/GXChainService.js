import Promise from 'bluebird'
import {Apis} from 'gxbjs-ws'
import {ChainStore, PrivateKey, TransactionBuilder, TransactionHelper, hash, FetchChain, key, Aes} from 'gxbjs'
import ConfigStore from '../utils/ConfigStore'
import Immutable from 'immutable'

/**
 * 获取账户信息
 * @param account_name
 * @returns {*}
 */
let account_cache = {};
const fetch_account = function (account_name) {
    return new Promise(function (resolve, reject) {
        if (account_cache[account_name]) {
            return resolve(account_cache[account_name]);
        }
        if(!account_name){
            resolve();
        }
        return FetchChain('getAccount', account_name).then((account)=> {
            account_cache[account_name] = account;
            account_cache[account.get('id')] = account;
            resolve(account);
        }).catch((ex)=> {
            reject(ex);
        });
    })
}

/**
 * 根据账号获取该账号active public_key
 * @param account_id
 */
const get_public_key_by_id = function (account_id) {
    return new Promise(function (resolve, reject) {
        fetch_account(account_id).then(function (account) {
            let pubKey = account.toJS().active.key_auths[0][0];
            resolve(pubKey);
        }).catch((ex)=> {
            reject(ex);
        });
    })
}

/**
 * 获取产品信息
 * @param prod_id
 */
const fetch_data_product = function (prod_id) {
    // let start = new Date();
    return new Promise(function (resolve, reject) {
        let prod = ChainStore.objects_by_id.get(prod_id);
        if(prod){
            resolve(prod.toJS());
        }
        else{

            return Apis.instance().db_api().exec('get_objects', [[prod_id]]).then(function (resp) {
                // console.log('获取产品信息耗时:',new Date()-start);
                if (!resp || resp.length == 0) {
                    reject(new Error('product not found'));
                }
                else {
                    let prod = Object.assign({schema_contexts:[]},resp[0]);
                    prod.schema_contexts = prod.schema_contexts.map(function (schema) {
                        schema.schema_context = JSON.parse(schema.schema_context);
                        return schema;
                    });
                    ChainStore.objects_by_id.set(prod_id,Immutable.fromJS(prod));
                    resolve(prod);
                }
            }).catch(function (ex) {
                reject(ex);
            });
        }
    })
}

/**
 * 通过request_id获取data transaction
 * @param request_id
 */
const get_data_transaction_by_request_id = function (request_id) {
    return new Promise(function (resolve, reject) {
        return Apis.instance().db_api().exec('get_data_transaction_by_request_id', [request_id]).then(function (resp) {
            resolve(resp);
        }).catch(function (ex) {
            reject(ex);
        });
    })
}

/**
 * 加密Json
 * @param params
 * @param private_key
 * @param public_key
 * @returns {Buffer}
 */
const encrypt_params = function (params, private_key, public_key) {
    let msg = JSON.stringify(params, null, 0);
    return Aes.encrypt_with_checksum(private_key, public_key, null, new Buffer(msg).toString('base64')).toString('base64');
}

/**
 * 解密消息体
 * @param msg
 * @param private_key
 */
const decrypt_msg = function (msg, private_key, public_key_string) {
    let base64Str = Aes.decrypt_with_checksum(private_key, public_key_string ? public_key_string : private_key.toPublicKey().toPublicKeyString(), null, new Buffer(msg, 'base64')).toString("utf-8");
    // let base64Str = Aes.decrypt_with_checksum(private_key, public_key_string?public_key_string:private_key.toPublicKey().toPublicKeyString(), null, msg).toString("utf-8");
    return new Buffer(base64Str, 'base64').toString()
}

/**
 * 生成request_id
 */
const generate_request_id = function () {
    let merchant_private_key = ConfigStore.get_merchant_private_key();
    let nonce = TransactionHelper.unique_nonce_uint64();
    let request_id = hash.sha256(merchant_private_key.toPublicKey().toPublicKeyString() + nonce).toString('hex');
    return request_id;
}

/**
 * 创建数据交易请求
 * @param league_id
 * @param prod_id
 * @param version
 * @param params
 * @param account_id
 * @param token
 */
const create_data_transaction = function (request_id, league_id, prod_id, version, encrypted_params, account_id) {
    let merchant_private_key = ConfigStore.get_merchant_private_key();
    return new Promise(function (resolve, reject) {
            
        let tr = new TransactionBuilder();
        
        let base64Str = encrypted_params.toString('base64');
        // let start = new Date();
        let operation = {
            request_id: request_id,
            product_id: prod_id,
            version: version,
            params: base64Str,
            fee: {
                amount: 0,
                asset_id: '1.3.0'
            },
            requester: account_id,
            create_date_time: new Date().toISOString().split('.')[0]
        }
        if (league_id) {
            operation.league_id = league_id;
        }
        tr.add_type_operation('data_transaction_create', operation);
        // start = new Date();
        tr.set_required_fees().then(()=> {
            // console.log('获取费用耗时',new Date()-start);
            tr.add_signer(merchant_private_key);
            // start = new Date();
            tr.broadcast(function (result) {
                // console.log('广播耗时:',new Date()-start);
                resolve(request_id);
            }).catch((ex)=> {
                console.error('transaction create broadcast:', ex);
                reject(ex);
            })

        }).catch(function (ex) {
            reject(ex);
        })
    })
}

/**
 * 支付数据交易
 * @param request_id
 * @param from
 * @param to
 * @param amount
 */
const pay_data_transaction = function (request_id, from, to, amount) {
    let merchant_private_key = ConfigStore.get_merchant_private_key();
    return new Promise(function (resolve, reject) {

        let tr = new TransactionBuilder();

        tr.add_type_operation('data_transaction_pay', {
            request_id: request_id,
            from: from,
            to: to,
            amount: {
                amount: amount,
                asset_id: "1.3.0"
            },
            fee: {
                amount: 0,
                asset_id: "1.3.0"
            }
        });

        tr.set_required_fees().then(() => {
            tr.add_signer(merchant_private_key);
            tr.broadcast(function (result) {
                resolve(result);
            }).catch((ex)=> {
                console.error('transaction pay broadcast:', ex);
                reject(ex);
            })
        }, (ex)=> {
            console.error('transaction pay set required fees:', ex);
            reject(ex);
        })
    })
}

/**
 * 数据返回错误
 * @param request_id
 * @param datasource
 */
const data_transaction_datasource_validate_error = function (request_id, datasource) {
    let datasource_private_key = ConfigStore.get_datasource_private_key();
    return new Promise(function (resolve, reject) {

        let tr = new TransactionBuilder();
        tr.add_type_operation('data_transaction_datasource_validate_error', {
            request_id: request_id,
            datasource: datasource,
            fee: {
                amount: 0,
                asset_id: "1.3.0"
            }
        });

        tr.set_required_fees().then(() => {
            tr.add_signer(datasource_private_key);
            tr.broadcast(function (result) {
                resolve(result);
            }).catch((ex)=> {
                reject(ex);
            })
        }, (ex)=> {
            console.error('transaction datasource validate error set required fees:', ex);
            reject(ex);
        })
    });
}

/**
 * 获取联盟信息
 * @param prod_id
 */
const fetch_league = function (league_id) {
    return new Promise(function (resolve, reject) {
        return Apis.instance().db_api().exec('get_objects', [[league_id]]).then(function (resp) {
            if (!resp || resp.length == 0) {
                reject(new Error('league not found'));
            }
            else {
                resolve(resp[0]);
            }
        }).catch(function (ex) {
            reject(ex);
        });
    })
}

export default{
    fetch_league,
    fetch_account,
    get_public_key_by_id,
    fetch_data_product,
    encrypt_params,
    decrypt_msg,
    generate_request_id,
    create_data_transaction,
    pay_data_transaction,
    get_data_transaction_by_request_id,
    data_transaction_datasource_validate_error
};