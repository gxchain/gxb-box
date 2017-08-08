import Promise from 'bluebird'
import DatasourceService from '../services/DatasourceService'
import GXChainService from '../services/GXChainService'
import FaucetService from '../services/FaucetService'
import IPFSService from '../services/IPFSService'
import {TRANSACTION_STATUS_MAP} from '../utils/constants'
import validator from '../utils/validator'
import {ChainTypes, PrivateKey, hash, key} from 'gxbjs'
import ConfigStore from '../utils/ConfigStore'

let league_data_product_id_reg = new RegExp(`^1\.${ChainTypes.object_type.league_data_product}\.\\d+$`);
let taskQueue = [];

export default{

    init(){
        return new Promise((resolve, reject)=> {
            resolve(1);
        })
    },

    encrypt_params_for_free_market(params, requester){
        let data_source_private_key = ConfigStore.get_datasource_private_key();
        return new Promise((resolve, reject)=> {
            GXChainService.get_public_key_by_id(requester).then(function (pubKey) {
                let encryptedParams = GXChainService.encrypt_params(params, data_source_private_key, pubKey);
                resolve(encryptedParams);
            }).catch((ex)=> {
                console.error('获取商户公钥失败', ex);
                reject(ex);
            })
        });
    },

    decrypt_params_for_free_market(params, requester){
        let data_source_private_key = ConfigStore.get_datasource_private_key();
        return new Promise((resolve, reject)=> {
            GXChainService.get_public_key_by_id(requester).then(function (pubKey) {
                let decryptedParams = GXChainService.decrypt_msg(params, data_source_private_key, pubKey);
                resolve(JSON.parse(decryptedParams));
            }).catch((ex)=> {
                console.error('获取商户公钥失败', ex);
                reject(ex);
            })
        });
    },

    decrypt_params_for_league(params, requester, league_id, request_id){
        let config = ConfigStore.config;
        let data_source_private_key = ConfigStore.get_datasource_private_key();
        return new Promise((resolve, reject)=> {
            FaucetService.request_for_a_token(requester, league_id, request_id, config.datasource.account_name, data_source_private_key).then(function (resp) {
                let token = resp.data.token;
                let private_key = PrivateKey.fromSeed(key.normalize_brainKey(token));
                let public_key = private_key.toPublicKey().toPublicKeyString();
                let decryptedParams = GXChainService.decrypt_msg(params, private_key, public_key);
                resolve(JSON.parse(decryptedParams));
            }).catch((ex)=> {
                console.error('获取联盟数据交换凭证失败:', request_id, " ", ex);
                reject(ex);
            })
        });
    },

    encrypt_params_for_league(params, requester, league_id, request_id){
        let config = ConfigStore.config;
        let data_source_private_key = ConfigStore.get_datasource_private_key();
        return new Promise((resolve, reject)=> {
            FaucetService.request_for_a_token(requester, league_id, request_id, config.datasource.account_name, data_source_private_key).then(function (resp) {
                let token = resp.data.token;
                let private_key = PrivateKey.fromSeed(key.normalize_brainKey(token));
                let public_key = private_key.toPublicKey().toPublicKeyString();
                let encryptedParams = GXChainService.encrypt_params(params, private_key, public_key);
                resolve(encryptedParams);
            }).catch((ex)=> {
                console.error('获取联盟数据交换凭证失败:', request_id, " ", ex);
                reject(ex);
            })
        });
    },

    validate_error(request_id){
        let config = ConfigStore.config;
        return new Promise((resolve, reject)=> {
            console.log('validate_error',request_id);
            GXChainService.fetch_account(config.datasource.account_name).then(function (account) {
                GXChainService.data_transaction_datasource_validate_error(request_id, account.get('id')).then(function () {
                    resolve();
                }).catch((ex)=> {
                    console.error('数据源数据验证错误广播失败:', ex);
                    reject(ex);
                })
            }).catch((ex)=> {
                console.error('获取账户信息失败:', ex);
                reject(ex);
            })

        })
    },

    upload_data(data_hash, hash, request_id){
        console.log('upload_data',request_id);
        FaucetService.store_hash(data_hash, hash, request_id).then(function (result) {
            console.log('数据已上传至交易确认节点', result);
        }).catch((ex)=> {
            console.error('数据上传交易确认节点失败,', ex);
        })
    },

    exist:function (request_id) {
      return !!taskQueue.find(function (req_id) {
          return req_id==request_id;
      });
    },

    enqueue (request_id) {
        if(!this.exist(request_id)){
            taskQueue.push(request_id);
        }
    },

    dequeue (request_id) {
        taskQueue = taskQueue.filter(function (req_id) {
            return req_id!=request_id;
        });
    },

    deal_with_data_transaction(data_transaction){
        let config = ConfigStore.config;
        // var start = new Date().getTime();
        let self = this;
        let status = TRANSACTION_STATUS_MAP[data_transaction.status];
        let {request_id, product_id,requester} = data_transaction;
        let is_product_subscribed = config.datasource.subscribed_data_product.find(function (prod) {
            return prod == product_id;
        })

        // 数据源账户未配置
        if(!config.datasource.account_name){
            console.log('请config.js中配置datasource.account_name');
            return;
        }


        // 数据源私钥未配置
        if(!config.datasource.private_key){
            console.log('请在config.js中配置datasource.private_key');
            return;
        }

        // 不处理未确认的交易
        if (!(status && status == TRANSACTION_STATUS_MAP.CONFIRMED)) {
            return;
        }
        // 不处理未订阅的product_id
        else if (!is_product_subscribed) {
            return;
        }
        else {

            GXChainService.fetch_account(config.datasource.account_name).then(function (account) {
                let account_id = account.get('id');
                let currentAccountStatus = data_transaction.datasources_status.find(function (item) {
                    return item.datasource == account_id;
                });
                // 如果不在数据源列表中,则不进行处理
                if (!currentAccountStatus) {
                    return;
                }
                // 如果数据源状态不是初始化状态,则不处理
                else if (currentAccountStatus.status > 0) {
                    return;
                }
                // 不处理自己的请求
                else if(account_id==data_transaction.requester){
                    return;
                }
                // 不重复处理同一个请求
                if(self.exist(request_id)){
                    return;
                }
                self.enqueue(request_id);
                console.log('开始处理:',data_transaction.request_id,'\n产品id:',data_transaction.product_id,'\n请求方Id:',data_transaction.requester);
                let isLeague = league_data_product_id_reg.test(product_id);
                let promises = [GXChainService.fetch_data_product(product_id)];

                if (!isLeague) {
                    promises.push(self.decrypt_params_for_free_market(data_transaction.params, data_transaction.requester));
                }
                else {
                    promises.push(self.decrypt_params_for_league(data_transaction.params, data_transaction.requester, data_transaction.league_id, request_id));
                }

                Promise.all(promises).then(function (result) {
                    let product_info = result[0];
                    let schema_contexts = product_info.schema_contexts;
                    let current_schema = schema_contexts.find(function (schema) {
                        return schema.version == data_transaction.version;
                    });
                    let params = result[1];

                    DatasourceService.fetch_data({
                        request_id,
                        product_id,
                        requester,
                        params: params
                    }).then(function (result) {
                        console.log('数据返回',JSON.stringify(result,null,'\t'));
                        let code = result.code;
                        if (Object.keys(current_schema.schema_context.code).length > 0 && !current_schema.schema_context.code[code]) {
                            console.error('未知的返回码:', code);
                            self.dequeue(request_id);
                            self.validate_error(request_id);
                        }
                        else {
                            try {
                                let validatedData = validator.validate(result.data, current_schema.schema_context.output);
                                var data = {
                                    message: result.message || '',
                                    data: validatedData
                                };
                                if (typeof code != 'undefined') {
                                    data.code = result.code;
                                }
                                let promises = [];
                                if (isLeague) {
                                    promises.push(self.encrypt_params_for_league(data, data_transaction.requester, data_transaction.league_id, request_id));
                                }
                                else {
                                    promises.push(self.encrypt_params_for_free_market(data, data_transaction.requester));
                                }
                                // start=new Date().getTime();
                                Promise.all(promises).then(function (result) {
                                    let encryptedParams = result[0];
                                    let data_hash = hash.sha256(`${JSON.stringify(params)}${JSON.stringify(validatedData)}`).toString('hex');
                                    console.log('数据包大小:',new Buffer(encryptedParams).length,'B');
                                    // console.log('加密数据耗时:',new Date().getTime()-start);
                                    // start=new Date().getTime();
                                    FaucetService.store_data(encryptedParams,request_id,data_hash).then((result)=> {
                                        // console.log('加密数据提交到验证节点耗时:',new Date().getTime()-start);
                                        console.log('已存证到验证节点:', result);
                                        self.dequeue(request_id);
                                    }).catch((ex)=> {
                                        self.dequeue(request_id);
                                        console.error('数据保存到验证节点失败:', ex);
                                    })
                                }).catch((ex)=> {
                                    console.error('数据加密失败:', ex);
                                    self.dequeue(request_id);
                                })
                            }
                            catch (ex) {
                                console.error('数据格式验证失败:', ex.message);
                                self.validate_error(request_id);
                                self.dequeue(request_id);
                            }
                        }
                    }).catch(ex=>{
                        console.error('数据源获取数据失败',ex.message);
                        self.validate_error(request_id);
                        self.dequeue(request_id);
                    })
                }).catch((ex)=> {
                    console.error(ex);
                    self.dequeue(request_id);
                })
            })
        }
    }

}