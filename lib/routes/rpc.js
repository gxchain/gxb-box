import express from 'express'
import GXChainService from '../services/GXChainService'
import FaucetService from '../services/FaucetService'
import TimeoutService from '../services/TimeoutService'
import MerchantService from '../services/MerchantService'
import MerchantTask from '../tasks/MerchantTask'
import validator from '../utils/validator'
import Promise from 'bluebird'
import {SYSTEM_ERROR_CODE} from '../utils/constants'
import ConfigStore from '../utils/ConfigStore'
import {PrivateKey, key, EmitterInstance} from 'gxbjs'

let emitter = EmitterInstance();
let router = express.Router();
let timer = null;



/**
 * 联盟市场数据交易
 * @param req
 * @param res
 */
let league_data_product_transaction = function (req, res) {
    timer = new Date().getTime();
    let id = req.params.id;
    let league_id = req.params.league_id;
    let params = Object.assign({}, req.query, req.body);
    let version = req.params.version;
    let config = ConfigStore.config;
    let merchant_private_key = ConfigStore.get_merchant_private_key();
    if(!config.merchant||!config.merchant.account_name||!config.merchant.private_key){
        return res.send({
            message:'请先配置config.json文件的merchant信息, 检测account_name和private_key是否正确配置'
        })
    }
    Promise.all([
        GXChainService.fetch_account(config.merchant.account_name),
        GXChainService.fetch_data_product(id)
    ]).then(function (result) {
        let account_id = result[0].get('id');
        let prod = result[1];
        if (!prod || prod.status == 0) {
            return res.status(500).send({
                code: SYSTEM_ERROR_CODE.NOT_FOUND,
                message: "产品不存在"
            });
        }
        else if (prod.status == 2) {
            return res.status(500).send({
                code: SYSTEM_ERROR_CODE.FORBIDDEN,
                message: "产品已下架"
            });
        }
        let schema_contexts = prod.schema_contexts;
        if (schema_contexts.length == 0) {
            res.status(500).send({
                code: SYSTEM_ERROR_CODE.INVALID_PARAMS,
                message: 'schema定义为空,数据产品无效'
            });
        }
        else {
            let request_id = GXChainService.generate_request_id();
            FaucetService.request_for_a_token(account_id, league_id, request_id, config.merchant.account_name, merchant_private_key).then((resp)=> {
                let token = resp.data.token;
                let private_key = PrivateKey.fromSeed(key.normalize_brainKey(token));
                let public_key = private_key.toPublicKey().toPublicKeyString();
                let current_schema = null;
                if (!version) {
                    current_schema = schema_contexts[schema_contexts.length - 1];
                }
                else {
                    current_schema = schema_contexts.find(function (schema) {
                        return schema.version == version;
                    });
                }
                let filteredParams = null;
                try {
                    filteredParams = validator.validate(params, current_schema.schema_context.input);
                }
                catch (ex) {
                    console.error(ex);
                    return res.status(500).send({
                        code: SYSTEM_ERROR_CODE.INVALID_PARAMS,
                        message: ex.message
                    });
                }
                let encrypted_params = GXChainService.encrypt_params(filteredParams, private_key, public_key);
                let isPrivacy = current_schema.schema_context.privacy;
                MerchantTask.enqueue(request_id, isPrivacy);

                GXChainService.create_data_transaction(request_id, league_id, id, current_schema.version, encrypted_params, account_id).then(function (resp) {

                    //隐私数据发送用户授权认证
                    if (isPrivacy) {
                        FaucetService.send_auth_msg(filteredParams.name, filteredParams.idcard, params.mobile, request_id).then(function () {
                            console.log('请求用户授权短信已发送');
                            TimeoutService.add(request_id,config.merchant.privacy_request_timeout||120000);
                        }).catch((ex)=> {
                            console.error(ex.message);
                            MerchantService.notify({
                                request_id,
                                body: {
                                    code: SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                                    message: ex.message || '发送授权短信失败'
                                }
                            })
                        })
                    }
                    else{
                        TimeoutService.add(request_id,config.common.default_timeout||8000);
                    }
                    // 创建完数据交易请求后返回request_id
                    res.send({
                        code: 0,
                        data: {
                            request_id: request_id
                        }
                    });
                }).catch(function (ex) {
                    console.error('err:', ex);
                    let isLowBalance = /Insufficient Balance/.test(ex.message); // 余额不足
                    let isNotOpened = /not opened/.test(ex.message);
                    if (isLowBalance) {
                        res.status(500).send({
                            code: SYSTEM_ERROR_CODE.BALANCE_NOT_ENOUGH,
                            message: '余额不足'
                        });
                    }
                    else {
                        if (isNotOpened) {
                            emitter.emit('reconnect');
                        }
                        res.status(500).send({
                            code: SYSTEM_ERROR_CODE.INVALID_PARAMS,
                            message: ex.message
                        });
                    }
                })
            }).catch(function (ex) {
                console.error('err:', ex);
                res.status(500).send({
                    code: SYSTEM_ERROR_CODE.INVALID_PARAMS,
                    message: ex.message
                });
            })

        }
    }).catch(function (ex) {
        console.error(ex);
        res.status(500).send(ex);
    })
}

/**
 * 联盟市场数据交易接口 - 最新版本
 */
router.all('/league/:league_id/:id', league_data_product_transaction);

/**
 * 联盟市场数据交易 - 指定版本号
 */
router.all('/league/:league_id/:id/:version', league_data_product_transaction);





/**
 * 自由市场数据交易
 * @param req
 * @param res
 */
let free_data_prod_transaction = function (req, res) {

    timer = new Date().getTime();
    let id = req.params.id;
    let params = Object.assign({}, req.query, req.body);
    let version = req.params.version;
    // let _start = new Date().getTime();
    let config = ConfigStore.config;
    let merchant_private_key = ConfigStore.get_merchant_private_key();
    if(!config.merchant||!config.merchant.account_name||!config.merchant.private_key){
        return res.send({
            message:'请先配置config.json文件的merchant信息, 检测account_name和private_key是否正确配置'
        })
    }
    Promise.all([
        GXChainService.fetch_account(config.merchant.account_name),
        GXChainService.fetch_data_product(id)
    ]).then(function (result) {
        let account_id = result[0].get('id');
        let prod = result[1];
        if (!prod || prod.status == 0) {
            return res.status(500).send({
                code: SYSTEM_ERROR_CODE.NOT_FOUND,
                message: "产品不存在"
            });
        }
        else if (prod.status == 2) {
            return res.status(500).send({
                code: SYSTEM_ERROR_CODE.FORBIDDEN,
                message: "产品已下架"
            });
        }
        let schema_contexts = prod.schema_contexts;
        if (schema_contexts.length == 0) {
            res.status(500).send({
                code: SYSTEM_ERROR_CODE.INVALID_PARAMS,
                message: 'schema定义为空,数据产品无效'
            });
        }
        else {
            // _start = new Date().getTime();
            GXChainService.get_public_key_by_id(prod.datasource).then((dataSourcePubKey)=> {
                // console.log('获取公钥耗时:', new Date().getTime() - _start);
                let current_schema = null;
                if (!version) {
                    current_schema = schema_contexts[schema_contexts.length - 1];
                }
                else {
                    current_schema = schema_contexts.find(function (schema) {
                        return schema.version == version;
                    });
                }
                let filteredParams = null;
                try {
                    filteredParams = validator.validate(params, current_schema.schema_context.input);
                }
                catch (ex) {
                    console.error(ex);
                    return res.status(500).send({
                        code: SYSTEM_ERROR_CODE.INVALID_PARAMS,
                        message: ex.message
                    });
                }
                // _start = new Date().getTime();
                let encrypted_params = GXChainService.encrypt_params(filteredParams, merchant_private_key, dataSourcePubKey);
                let request_id = GXChainService.generate_request_id();
                let isPrivacy = current_schema.schema_context.privacy;
                MerchantTask.enqueue(request_id, isPrivacy);
                //创建交易请求

                GXChainService.create_data_transaction(request_id, null, id, current_schema.version, encrypted_params, account_id).then(function (resp) {
                    // console.log('创建交易耗时:', new Date().getTime() - _start);
                    //隐私数据发送用户授权认证
                    if (isPrivacy) {
                        FaucetService.send_auth_msg(filteredParams.name, filteredParams.idcard, params.mobile, request_id).then(function () {
                            console.log('请求用户授权短信已发送');
                            TimeoutService.add(request_id,config.merchant.privacy_request_timeout||120000);
                        }).catch((ex)=> {
                            console.error(ex.message);
                            MerchantService.notify({
                                request_id,
                                body: {
                                    code: SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                                    message: ex.message || '发送授权短信失败'
                                }
                            })
                        })
                    }
                    else{
                        TimeoutService.add(request_id,config.merchant.default_timeout||8000);
                    }
                    // 创建完数据交易请求后返回request_id
                    res.send({
                        code: 0,
                        data: {
                            request_id: request_id
                        }
                    });

                }).catch(function (ex) {
                    console.error('err:', ex);
                    let isLowBalance = /Insufficient Balance/.test(ex.message); // 余额不足
                    let isNotOpened = /not opened/.test(ex.message);
                    if (isLowBalance) {
                        res.status(500).send({
                            code: SYSTEM_ERROR_CODE.BALANCE_NOT_ENOUGH,
                            message: '余额不足'
                        });
                    }
                    else {
                        if (isNotOpened) {
                            emitter.emit('reconnect');
                        }
                        res.status(500).send({
                            code: SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                            message: ex.message
                        });
                    }

                })
            }).catch((ex)=> {
                console.error(ex);
                res.status(500).send({
                    code: SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                    message: '获取数据源信息失败'
                });
            })
        }
    }).catch(function (ex) {
        console.error(ex);
        res.status(500).send({
            code: SYSTEM_ERROR_CODE.INVALID_PARAMS,
            message: ex.message
        });
    })
}

/**
 * 自由市场数据交易接口 - 最新版本
 */
router.all('/:id', free_data_prod_transaction);

/**
 * 自由市场数据交易 - 指定版本
 */
router.all('/:id/:version', free_data_prod_transaction);

module.exports = router;
