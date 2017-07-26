import ConfigStore from '../utils/ConfigStore'
import superagent from 'superagent'
import Promise from 'bluebird'
import GXChainService from './GXChainService'

import {PrivateKey, FetchChain, Signature} from 'gxbjs'


const sortJSON = function (json) {
    var keys = Object.keys(json);
    keys.sort();
    var result = {};
    keys.forEach(function (k) {
        result[k] = json[k];
    });
    return result;
}

const sign = function (body = '', pKey) {
    if (!pKey) {
        pKey = ConfigStore.get_merchant_private_key();
    }
    return Signature.sign(body, pKey).toHex();
}

export default{

    /**
     * 商户|数据源方法 - 联盟成员请求数据交换授权令牌
     * @param name 姓名
     * @param idcard 身份证号
     * @param mobile 手机号
     * @param request_id 请求id
     */
    request_for_a_token(requester, league_id, request_id, account_name, private_key){

        let params = {
            league_id,
            request_id,
            requester
        };
        let config = ConfigStore.config;

        return new Promise((resolve, reject)=> {

            GXChainService.fetch_account(account_name).then((account)=> {
                params.account_id = account.get('id');
                params.signature = sign(JSON.stringify(sortJSON(params)), private_key);
                superagent.post(`${config.common.faucet_url}/chain/auth_token`).send(params).end(function (err, resp) {
                    if (err) {
                        reject(new Error(resp.body&&(resp.body.message||resp.body.base[0])));
                    }
                    else {
                        resolve(resp.body);
                    }
                })
            }).catch((err)=> {
                reject(err);
            })
        })
    },

    /**
     * 商户方法 - 发送短信授权验证
     * @param name
     * @param idcard
     * @param mobile
     * @param request_id
     */
    send_auth_msg (name, idcard, mobile, request_id) {

        let params = {
            name,
            idcard,
            mobile,
            request_id: request_id
        };
        let config = ConfigStore.config;

        return new Promise((resolve, reject)=> {
            GXChainService.fetch_account(config.merchant.account_name).then((account)=> {
                params.account_id = account.get('id');
                params.signature = sign(JSON.stringify(sortJSON(params)));
                superagent.post(`${config.common.faucet_url}/chain/auth_msg`).send(params).end(function (err, resp) {
                    if (err) {
                        console.error('发送授权短信失败:', resp.body&&(resp.body.message||resp.body.base[0]));
                        reject(new Error(resp && resp.body ? resp.body.message : '网络故障'));
                    }
                    else {
                        resolve(resp.body);
                    }
                })
            }).catch((err)=> {
                reject(err);
            })
        })
    },

    /**
     * 数据源方法 - 保存数据hash
     * @param hash
     */
    store_data: function (data,request_id,data_hash) {
        let params = {
            data,
            request_id,
            data_hash
        };
        let config = ConfigStore.config;
        let datasource_private_key = ConfigStore.get_datasource_private_key();

        return new Promise((resolve, reject)=> {
            GXChainService.fetch_account(config.datasource.account_name).then((account)=> {
                params.account_id = account.get('id');
                params.signature = sign(JSON.stringify(sortJSON(params)), datasource_private_key);
                superagent.post(`${config.common.faucet_url}/chain/store_data`).send(params).end(function (err, resp) {
                    if (err) {
                        console.error('保存数据hash失败:', resp.body&&(resp.body.message||resp.body.base[0]));
                        reject(new Error(resp && resp.body ? resp.body.message||resp.body.base[0] : '网络故障'));
                    }
                    else {
                        resolve(resp.body);
                    }
                })
            }).catch((err)=> {
                reject(err);
            })
        })
    },

    /**
     * 商户方法-通过request_id获取hash
     * @param request_id
     */
    fetch_ipfs_hash(request_id, datasource){
        let params = {
            request_id,
            datasource
        };
        let config = ConfigStore.config;
        
        return new Promise((resolve, reject)=> {
            GXChainService.fetch_account(config.merchant.account_name).then((account)=> {
                params.account_id = account.get('id');
                params.signature = sign(JSON.stringify(sortJSON(params)));
                superagent.get(`${config.common.faucet_url}/chain/get_hash`).query(params).end(function (err, resp) {
                    if (err) {
                        console.error('获取ipfs_hash失败:', err.body);
                        reject(new Error(resp.body&&(resp.body.message||resp.body.base[0])));
                    }
                    else {
                        resolve(resp.body);
                    }
                })
            }).catch((err)=> {
                reject(err);
            })
        })
    }
}