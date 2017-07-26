import express from 'express';
let router = express.Router();

/**
 * 商户-数据回调示例
 */
router.all('/callback', function (req, res) {
    let params = Object.assign({}, req.body);
    console.log('数据回调:');
    console.log(JSON.stringify(params, null, '\t'));
    res.send({})
})

/**
 * 数据源-服务接口示例
 */
router.all('/call', function (req, res) {
    console.log(Object.assign({},req.query,req.body));
    res.send({
        code: 0,
        data: {
            result: true
        }
    })
})

module.exports = router;