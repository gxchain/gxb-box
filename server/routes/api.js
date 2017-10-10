import express from 'express';
import BoxService from '../services/BoxService'
let router = express.Router();

/**
 * 数据盒子服务 - 启动
 */

router.get('/box_start', function (req, res) {
    BoxService.box_start().then((pm2) => {
        res.send(pm2);
    }).catch((err) => {
        res.send({});
    })
});

module.exports = router;
