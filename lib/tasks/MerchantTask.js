import LevelDBService from '../services/LevelDBService'
import FaucetService from '../services/FaucetService'
import GXChainService from '../services/GXChainService'
import IPFSService from '../services/IPFSService'
import MerchantService from '../services/MerchantService'
import TimeoutService from '../services/TimeoutService'
import DataTransactionHandler from '../handler/DataTransactionHandler'
import ConfigStore from '../utils/ConfigStore'
import {PrivateKey, ChainTypes, key, ChainStore} from 'gxbjs'
import Promise from 'bluebird'
import {
    TRANSACTION_STATUS_MAP,
    DATA_SOURCE_STATUS_MAP,
    SYSTEM_ERROR_CODE,
    PAY_STATUS,
    DOWNLOAD_STATUS
} from '../utils/constants'

let league_data_product_id_reg = new RegExp(`^1\.${ChainTypes.object_type.league_data_product}\.\\d+$`);

let taskQueue = [];

// var start = new Date().getTime();

export default {

    /**
     * 初始化,从 leveldb中加载上一次的任务队列
     */
    init() {
        return new Promise((resolve, reject) => {
            LevelDBService.get('merchant_tasks').then((queue) => {
                //筛选出未超时的任务
                queue = JSON.parse(queue || '[]');
                taskQueue = queue.filter(function (task) {
                    return task.expire < new Date().getTime();
                });
                resolve(taskQueue);
            }).catch((ex) => {
                if (/Key not found/.test(ex.message)) {
                    LevelDBService.put('merchant_tasks', "[]").then(function () {
                        taskQueue = [];
                        resolve(taskQueue);
                    })
                }
                else {
                    console.error('初始化商户任务队列失败', ex);
                    reject(ex)
                }
            })
        })
    },

    /**
     * 将交易请求加入任务队列
     * @param request_id
     * @param isPrivacy
     */
    enqueue(request_id, isPrivacy) {
        taskQueue = taskQueue.filter(function (task) {
            return new Date() - task.expire <= 0;
        });
        let task = {
            request_id: request_id,
            status: TRANSACTION_STATUS_MAP.INITIAL,
            expire: new Date().getTime() + (isPrivacy ? 120000 : 30000),
            pay_status: {},
            download_status: {}
        }
        taskQueue.push(task);
    },

    /**
     * 将交易请求移出任务队列
     * @param request_id
     */
    dequeue (request_id){
        taskQueue = taskQueue.filter(function (task) {
            return task.request_id != request_id;
        });
    },

    /**
     * 获取交易任务
     * @param request_id
     * @returns {*}
     */
    get_task(request_id) {
        return taskQueue.find(function (task) {
            return task.request_id == request_id;
        });
    },

    /**
     * 查询某一个request是否在任务队列中
     * @param request_id
     * @returns {boolean}
     */
    exist(request_id){
        return !!this.get_task(request_id)
    },

    /**
     * 持久化存储任务队列, 在程序异常关闭的时候尝试保存现场
     */
    store() {
        LevelDBService.put('merchant_tasks', JSON.stringify(taskQueue));
    },

    /**
     * 获取某一个request的状态
     * @param request_id
     * @returns {*}
     */
    get_status(request_id) {
        return this.get_task(request_id).status;
    },

    /**
     * 设置某一个request的状态
     * @param request_id
     * @param status
     */
    set_status(request_id, status) {
        if (!TRANSACTION_STATUS_MAP[status]) {
            console.error('状态不存在:', status);
        }
        else {
            taskQueue = taskQueue.map(function (task) {
                if (task.request_id == request_id) {
                    task.status = status;
                }
                return task;
            })
        }
    },

    /**
     * 设置对某一个数据源的支付状态
     * @param request_id
     * @param datasource
     * @param status
     */
    set_pay_status(request_id, datasource, status) {
        let task = this.get_task(request_id);
        if (!PAY_STATUS[status]) {
            return;
        }
        else if (!task) {
            return;
        }
        task.pay_status[datasource] = status;
    },

    /**
     * 获取对某一个数据源的支付状态
     * @param request_id
     * @param datasource
     */
    get_pay_status(request_id, datasource) {
        let task = this.get_task(request_id);
        if (!task) {
            return;
        }
        if (!task.pay_status[datasource]) {
            task.pay_status[datasource] = PAY_STATUS.NOT_PAYED;
        }

        return task.pay_status[datasource];
    },

    /**
     * 设置从某一个数据源的下载状态
     * @param request_id
     * @param datasource
     * @param status
     */
    set_download_status(request_id, datasource, status) {
        let task = this.get_task(request_id);
        if (!DOWNLOAD_STATUS[status]) {
            return;
        }
        else if (!task) {
            return;
        }
        task.download_status[datasource] = status;
        taskQueue = taskQueue.map(function (t) {
            if (t.request_id == request_id) {
                return task;
            }
            return t;
        })
    },

    /**
     * 获取从某一个数据源的下载状态
     * @param request_id
     * @param datasource
     */
    get_download_status(request_id, datasource) {
        let task = this.get_task(request_id);
        if (!task) {
            return;
        }

        if (!task.download_status[datasource]) {
            task.download_status[datasource] = DOWNLOAD_STATUS.NOT_DOWNLOADED;
        }

        return task.download_status[datasource]
    },

    /**
     * 支付给某一个数据源
     * @param request_id
     * @param product_id
     * @param to
     */
    pay_data_transaction(request_id, product_id, league_id, to) {
        let config = ConfigStore.config;
        let self = this;
        let current_pay_status = this.get_pay_status(request_id, to);
        if (current_pay_status != PAY_STATUS.NOT_PAYED) {
            // already payed for this datasource, but please don't worry, witness will make a double check if you pay again
            return;
        }
        let promises = [
            GXChainService.fetch_data_product(product_id),
            GXChainService.fetch_account(config.merchant.account_name)
        ];

        let isLeague = league_data_product_id_reg.test(product_id);
        if (isLeague) {
            promises.push(GXChainService.fetch_league(league_id))
        }
        this.set_pay_status(request_id, to, PAY_STATUS.PAYING);
        Promise.all(promises).then(function (resp) {
            let amount = 0;
            if (isLeague) {
                let league = resp[2];
                let index = league.data_products.indexOf(product_id);
                amount = league.prices[index];
            }
            else {
                amount = resp[0].price;
            }
            let from = resp[1].get('id');
            GXChainService.pay_data_transaction(request_id, from, to, amount).then(function (resp) {
                console.log('成功向:', to, '支付一笔:', amount, '的费用');
                self.set_pay_status(request_id, to, PAY_STATUS.PAYED);
            }).catch((ex) => {
                self.set_pay_status(request_id, to, PAY_STATUS.PAY_FAILED);
                let isPayForSelf = /from != to/.test(ex.message);
                let isLowBalance = /Insufficient Balance/.test(ex.message);
                let message = ex.message;
                if (isPayForSelf) {
                    message = '支付失败,不能向自己支付';
                }
                if (isLowBalance) {
                    message = '支付失败,余额不足';
                }
                MerchantService.notify({
                    request_id: request_id,
                    body: {
                        code: isLowBalance ? SYSTEM_ERROR_CODE.BALANCE_NOT_ENOUGH : SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                        message: message
                    }
                })
            })
        }).catch((ex) => {
            console.error('获取支付账号和产品信息失败:', ex);
            self.set_pay_status(request_id, to, PAY_STATUS.PAY_FAILED);
            MerchantService.notify({
                request_id: request_id,
                body: {
                    code: SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                    message: ex.message
                }
            })
        })
    },


    /**
     * 自由市场解密数据包
     * @param params
     * @param datasource
     */
    decrypt_params_for_free_market(params, datasource) {
        let merchant_private_key = ConfigStore.get_merchant_private_key();
        return new Promise((resolve, reject) => {
            GXChainService.get_public_key_by_id(datasource).then(function (pubKey) {
                let decryptedParams = GXChainService.decrypt_msg(params, merchant_private_key, pubKey);
                resolve(JSON.parse(decryptedParams));
            }).catch((ex) => {
                console.error('获取公钥失败', ex, datasource);
                reject(ex);
            })
        });
    },

    /**
     * 联盟市场解密数据包
     * @param params
     * @param requester
     * @param league_id
     * @param request_id
     */
    decrypt_params_for_league(params, requester, league_id, request_id) {
        let config = ConfigStore.config;
        let merchant_private_key = ConfigStore.get_merchant_private_key();
        return new Promise((resolve, reject) => {
            // var start = new Date();
            FaucetService.request_for_a_token(requester, league_id, request_id, config.merchant.account_name, merchant_private_key).then(function (resp) {
                let token = resp.data.token;
                // console.log('获取token耗时:', new Date() - start);
                let private_key = PrivateKey.fromSeed(key.normalize_brainKey(token));
                let public_key = private_key.toPublicKey().toPublicKeyString();
                let decryptedParams = GXChainService.decrypt_msg(params, private_key, public_key);
                resolve(JSON.parse(decryptedParams));
            }).catch((ex) => {
                console.error('获取联盟数据交换凭证失败:', request_id, " ", ex);
                reject(ex);
            })
        });
    },

    /**
     * 根据request_id和数据源account_id获取ipfs_hash,下载数据并回调给商户
     * @param request_id
     * @param datasource
     */
    download_data(data_transaction, datasource) {
        // var start = new Date().getTime();
        let self = this;
        let config = ConfigStore.config;
        let {requester, league_id, request_id, product_id} = data_transaction;

        if (self.get_download_status(request_id, datasource) != DOWNLOAD_STATUS.NOT_DOWNLOADED) {
            return;
        }
        self.set_download_status(request_id, datasource, DOWNLOAD_STATUS.DOWNLOADING);
        //获取数据hash
        FaucetService.fetch_ipfs_hash(request_id, datasource).then(function (resp) {
            // console.log('网关获取ipfs hash耗时:', new Date().getTime() - start);
            let data_hash = resp.data.data_hash;
            // start = new Date().getTime();
            IPFSService.download(resp.data.hash, config.common.ipfs_addr).then(function (encryptedData) {
                // console.log('下载耗时:', new Date().getTime() - start);
                let promises = [];
                let isLeague = league_data_product_id_reg.test(product_id);
                if (isLeague) {
                    promises.push(self.decrypt_params_for_league(encryptedData, requester, league_id, request_id));
                }
                else {
                    promises.push(self.decrypt_params_for_free_market(encryptedData, datasource));
                }
                // start = new Date().getTime();
                //解密消息体
                Promise.all(promises).then(function (result) {
                    // console.log('返回数据解密耗时:', new Date().getTime() - start);
                    let decryptedParams = result[0];
                    let notice = {
                        request_id: request_id,
                        datasource,
                        body: decryptedParams
                    }
                    self.set_download_status(request_id, datasource, DOWNLOAD_STATUS.DOWNLOADED);
                    //数据回调

                    MerchantService.notify(notice);
                }).catch((ex) => {
                    console.error('解密消息体失败', ex);
                })

            }).catch((ex) => {
                console.error('下载数据失败:', request_id, ex);
                self.set_download_status(request_id, datasource, DOWNLOAD_STATUS.DOWNLOAD_FAILED);
                MerchantService.notify({
                    request_id,
                    datasource,
                    body: {
                        code: SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                        message: '下载数据失败:' + ex.message
                    }
                })
            })

        }).catch((ex) => {
            console.error('获取数据hash失败:', request_id, ex);
            self.set_download_status(request_id, datasource, DOWNLOAD_STATUS.DOWNLOAD_FAILED);
            MerchantService.notify({
                request_id,
                datasource,
                body: {
                    code: SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                    message: ex.message
                }
            })
        })
    },

    /**
     * 数据源数据格式验证失败
     */
    validate_error(data_transaction, datasource) {
        if (this.get_download_status(data_transaction.request_id, datasource) != DOWNLOAD_STATUS.NOT_DOWNLOADED) {
            return;
        }
        this.set_download_status(data_transaction.request_id, datasource, DATA_SOURCE_STATUS_MAP.VALIDATE_FAIL);
        MerchantService.notify({
            request_id: data_transaction.request_id,
            datasource: datasource,
            body: {
                code: SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                message: '数据源返回数据格式验证失败'
            }
        })
    },

    // isTimeout(request_id) {
    //     return new Promise((resolve, reject) => {
    //         LevelDBService.find({prefix: `request-${request_id}-`}).then(function (results) {
    //             console.log(results);
    //             if (results && results.some(function (result) {
    //                     let returnResult = JSON.parse(result.value);
    //                     return returnResult && returnResult.body && returnResult.body.code == SYSTEM_ERROR_CODE.DATASOURCE_OFFLINE;
    //                 })) {
    //                 resolve(true);
    //             }
    //             else {
    //                 resolve(false);
    //             }
    //         }).catch(ex => {
    //             resolve(false);
    //         })
    //     })
    // },

    /**
     * 处理交易请求
     * @param data_transaction
     */
    deal_with_data_transaction(data_transaction) {

        let self = this;
        let {request_id} = data_transaction;
        if (!this.exist(request_id)) {
            return;
        }
        let request_status = this.get_status(request_id);

        let next_request_status = TRANSACTION_STATUS_MAP[data_transaction.status];
        let next_datasource_status = data_transaction.datasources_status;

        // 处理被确认的交易
        if (next_request_status == TRANSACTION_STATUS_MAP.CONFIRMED) {
            this.set_status(request_id, TRANSACTION_STATUS_MAP.CONFIRMED);
            // 遍历每个数据源的状态
            next_datasource_status.forEach((item) => {
                let status = DATA_SOURCE_STATUS_MAP[item.status];
                if (status != DATA_SOURCE_STATUS_MAP.INITIAL) {
                    TimeoutService.remove(data_transaction.request_id);
                }
                // 数据源已上传数据,则支付这笔交易
                if (status == DATA_SOURCE_STATUS_MAP.UPLOADED) {
                    self.pay_data_transaction(request_id, data_transaction.product_id, data_transaction.league_id, item.datasource);
                    // self.isTimeout(request_id).then(function (timeout) {
                    //     console.log('isTimeout', timeout);
                    //     if (!timeout) {
                    //         start = new Date().getTime();
                    //         console.log('未超时,开始支付');
                    //         self.pay_data_transaction(request_id, data_transaction.product_id, data_transaction.league_id, item.datasource);
                    //     }
                    // })
                }
                // 支付已确认, 则可以下载数据
                else if (status == DATA_SOURCE_STATUS_MAP.PAYED) {
                    // console.log('开始支付到开始下载耗时:', new Date().getTime() - start);
                    self.download_data(data_transaction, item.datasource);
                }
                else if (status == DATA_SOURCE_STATUS_MAP.VALIDATE_FAIL) {
                    self.validate_error(data_transaction, item.datasource);
                }

            })
        }
        // 处理被拒绝的交易
        else if (next_request_status == TRANSACTION_STATUS_MAP.PRIVACY_REJECTED) {
            this.set_status(request_id, TRANSACTION_STATUS_MAP.PRIVACY_REJECTED);
            MerchantService.notify({
                request_id,
                body: {
                    code: SYSTEM_ERROR_CODE.PRIVACY_REJECTED,
                    message: '隐私查询被用户拒绝'
                }
            })

        }
    },

    /**
     * 异常重启后尝试继续原来未完成未并且未过期的任务
     */
    resume() {
        let self = this;
        taskQueue.forEach((task) => {
            let delta = task.expire - new Date().getTime();
            if (delta > 0) {
                GXChainService.get_data_transaction_by_request_id(task.request_id).then(DataTransactionHandler.schedule);
            }
            else {
                self.dequeue(task.request_id);
            }
        })
    }
}