import superagent from 'superagent'
import ConfigStore from '../utils/ConfigStore'
import MerchantTask from '../tasks/MerchantTask'
import LevelDBService from '../services/LevelDBService'
export default{
    notify: function (params) {
        let config = ConfigStore.config;
        LevelDBService.put(`request-${params.request_id}-${new Date().getTime()}`,JSON.stringify(params));
        if(config.merchant.callback_url){
            superagent.post(config.merchant.callback_url).send(params).end((err, resp)=> {
                console.log('callback已提交');
                MerchantTask.dequeue(params.request_id);
            })
        }
    }
}