import express from 'express';
import LevelDBService from '../services/LevelDBService'
import GXChainService from '../services/GXChainService'
let router = express.Router();

router.get('/request/:request_id',function (req,res) {
    GXChainService.get_data_transaction_by_request_id(req.params.request_id).then(function (data_transaction) {
        res.send(data_transaction);
    }).catch(ex=>{
        res.status(500).send(ex.message);
    })
})

router.get('/request/:request_id/data',function (req,res) {
    let request_id = req.params.request_id;
    // 默认最多返回20条
    LevelDBService.find({prefix:`request-${request_id}-`}).then(function (results) {
        results = (results||[]).map((result)=>{
            return JSON.parse(result.value);
        }).reverse();
        res.send(results);
    }).catch(ex=>{
        res.status(404).send({
            request_id:request_id,
            message:'未查询到结果'
        });
    })
})

module.exports = router;