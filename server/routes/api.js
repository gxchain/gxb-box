import express from 'express';
import BoxService from '../services/BoxService';
import AccountService from '../services/AccountService';
import DataService from '../services/DataService';
import ConfigStore from '../services/ConfigStore';
import ZipArchive from '../services/ZipArchive';
import ConnectService from '../services/ConnectService';
import fs from 'fs';

let router = express.Router();

/**
 * 读取配置文件
 */

router.get('/fetch_config', function (req, res) {
    ConfigStore.init().then((config) => {
        res.send(config);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 写入配置文件
 */

router.post('/save_config', function (req, res) {
    ConfigStore.set(req.body.config).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 切换配置环境
 */

router.post('/change_config_env', function (req, res) {
    ConfigStore.change_config_env(req.query.env, req.body.config).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 获取本机IP
 */

router.get('/get_ip_address', function (req, res) {
    ConnectService.get_ip_address().then((box_ip) => {
        res.send(box_ip);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 账户信息
 */

router.get('/fetch_account/:account_id_or_name', function (req, res) {
    AccountService.fetch_account(req.params.account_id_or_name).then((account) => {
        res.send(account);
    }).catch(err => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 创建账号
 */

router.post('/create_account', function (req, res) {
    AccountService.create_account(req.query.env, req.body.type, req.body.name, req.protocol).then((account) => {
        res.send(account);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 导入账号
 */

router.post('/import_account', function (req, res) {
    AccountService.import_account(req.body.type, req.body.private_key).then((account) => {
        res.send(account);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 申请认证商户
 */

router.post('/apply_merchant', function (req, res) {
    AccountService.apply_merchant(req.query.env, req.body.apply_info, req.body.account_name, req.body.account_type, req.protocol).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 申请认证数据源
 */

router.post('/apply_datasource', function (req, res) {
    AccountService.apply_datasource(req.query.env, req.body.apply_info, req.body.account_name, req.body.account_type, req.protocol).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 查询认证状态
 */

router.get('/is_applying/:account_name', function (req, res) {
    AccountService.is_applying(req.query.env, req.params.account_name, req.protocol).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 获取认证商户信息
 */

router.get('/fetch_merchant/:account_name/:account_type', function (req, res) {
    AccountService.fetch_merchant(req.query.env, req.params.account_name, req.params.account_type, req.protocol).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 获取数据市场二级栏目
 */

router.get('/fetch_data_market_categories/:data_market_type', function (req, res) {
    DataService.fetch_data_market_categories(req.params.data_market_type).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 获取栏目信息
 */

router.get('/fetch_data_market_categories_info/:category_id', function (req, res) {
    DataService.fetch_data_market_categories_info(req.params.category_id).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 获取自由市场产品列表
 */

router.get('/fetch_free_data_products/:category_id/:page/:pageSize', function (req, res) {
    DataService.fetch_free_data_products(req.params.category_id, req.params.page, req.params.pageSize, req.params.keywords || '').then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 获取自由市场产品详情
 */

router.get('/fetch_free_data_product_details/:product_id', function (req, res) {
    DataService.fetch_free_data_product_details(req.params.product_id).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 获取联盟市场联盟列表
 */

router.get('/fetch_league_list/:category_id/:page/:pageSize', function (req, res) {
    DataService.fetch_league_list(req.params.category_id, req.params.page, req.params.pageSize, req.params.keywords || '').then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 获取联盟信息
 */

router.get('/fetch_league_info/:league_id', function (req, res) {
    DataService.fetch_league_info(req.params.league_id).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 获取联盟成员列表
 */

router.get('/fetch_league_members/:league_id', function (req, res) {
    AccountService.fetch_league_members(req.query.env, req.params.league_id, req.protocol).then((members) => {
        res.send(members);
    }).catch(err => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 获取联盟产品列表
 */

router.get('/fetch_league_data_products/:data_product_ids', function (req, res) {
    DataService.fetch_league_data_products(req.params.data_product_ids).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 数据盒子服务 - 启动
 */

router.get('/box_start', function (req, res) {
    BoxService.box_start().then((pm2) => {
        res.send(pm2);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 数据盒子服务 - 停止
 */

router.get('/box_stop', function (req, res) {
    BoxService.box_stop().then((pm2) => {
        res.send(pm2);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 数据盒子服务 - 删除
 */

router.get('/box_delete', function (req, res) {
    BoxService.box_delete().then((pm2) => {
        res.send(pm2);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 数据盒子服务 - 重启
 */

router.get('/box_restart', function (req, res) {
    BoxService.box_restart().then((pm2) => {
        res.send(pm2);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 数据盒子服务 - 查询
 */

router.get('/fetch_box', function (req, res) {
    BoxService.fetch_box().then((pm2) => {
        res.send(pm2);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

/**
 * 生产环境 - 打包
 */

router.get('/get_box_prod_zip/:visual', function (req, res) {
    ZipArchive.get_box_prod_zip(req.params.visual).then((zip) => {
        res.send(zip);
    }).catch((err) => {
        console.error(err);
        res.status(400).send(err);
    });
});

router.get('/download/:filename', function (req, res) {
    let filename = req.params.filename;
    let path = 'archive/' + req.params.filename;
    fs.exists(path, function (exists) {
        if (exists) {
            res.download(path, filename);
        } else {
            res.status(404).send({
                status: 404,
                message: '请求错误'
            });
        }
    });
});

module.exports = router;
