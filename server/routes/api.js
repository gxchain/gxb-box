import express from 'express';
import BoxService from '../services/BoxService';
import AccountService from '../services/AccountService';
import ConfigStore from '../services/ConfigStore';
let router = express.Router();


/**
 * 读取配置文件
 */

router.get('/fetch_config/:account_type', function (req, res) {
    if (req.params.account_type === 'merchant'){
        ConfigStore.init().then((config)=>{
            res.send(config.merchant);
        }).catch((err)=>{
            res.status(500).send(err);
        });
    }else{
        ConfigStore.init().then((config)=>{
            res.send(config.datasource);
        }).catch((err)=>{
            res.status(500).send(err);
        });
    }
});

/**
 * 账户查询
 */

router.get('/fetch_account/:account_id_or_name', function (req, res) {
    AccountService.fetch_account(req.params.account_id_or_name).then((account) => {
        res.send(account.toJS());
    }).catch(err => {
        res.status(500).send(err);
    })
});

/**
 * 创建账号
 */

router.post('/create_account', function (req, res) {
    AccountService.create_account(req.body.type, req.body.name).then((account) => {
        res.send(account);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

/**
 * 导入账号
 */

router.post('/import_account', function (req, res) {
    AccountService.import_account(req.body.type, req.body.private_key).then((account) => {
        res.send(account);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

/**
 * 数据盒子服务 - 启动
 */

router.get('/box_start', function (req, res) {
    BoxService.box_start().then((pm2) => {
        res.send(pm2);
    }).catch((err) => {
        res.status(500).send(err);
    })
});

/**
 * 数据盒子服务 - 获取PM2列表
 */

router.get('/fetch_box_list', function (req, res) {
    BoxService.fetch_box_list().then((pm2) => {
        res.send(pm2);
    }).catch((err) => {
        res.status(500).send(err);
    })
});

/**
 * 数据盒子服务 - 获取PM2日志
 */

router.post('/fetch_log', function (req, res) {
    BoxService.fetch_log(req.body.pm_id, req.body.path).then((log) => {
        res.send(log);
    }).catch((err) => {
        res.status(500).send(err);
    })
});

module.exports = router;
