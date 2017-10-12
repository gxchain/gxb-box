import express from 'express';
import BoxService from '../services/BoxService';
import AccountService from '../services/AccountService';
let router = express.Router();

/**
 * 创建账号
 */

router.get('/create_account/:name', function (req, res) {
    AccountService.create_account(req.params.name).then((account) => {
        res.send(account);
    }).catch((err) => {
        res.send(err);
    })
});

/**
 * 数据盒子服务 - 启动
 */

router.get('/box_start', function (req, res) {
    BoxService.box_start().then((pm2) => {
        res.send(pm2);
    }).catch((err) => {
        res.send(err);
    })
});

/**
 * 数据盒子服务 - 获取PM2列表
 */

router.get('/fetch_box_list', function (req, res) {
    BoxService.fetch_box_list().then((pm2) => {
        res.send(pm2);
    }).catch((err) => {
        res.send(err);
    })
});

/**
 * 数据盒子服务 - 获取PM2日志
 */

router.post('/fetch_log', function (req, res) {
    BoxService.fetch_log(req.body.pm_id, req.body.path).then((log) => {
        res.send(log);
    }).catch((err) => {
        res.send(err);
    })
});

module.exports = router;
