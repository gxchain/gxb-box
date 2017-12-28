import superagent from 'superagent';
import ConfigStore from '../utils/ConfigStore';
import MerchantTask from '../tasks/MerchantTask';
import LevelDBService from '../services/LevelDBService';
import {SYSTEM_ERROR_CODE} from '../utils/constants';

export default {
    notify: function (params) {
        let config = ConfigStore.config;
        let isTimeout = params.body && params.body.code == SYSTEM_ERROR_CODE.DATASOURCE_OFFLINE;
        if (isTimeout) {
            MerchantTask.dequeue(params.request_id);
        }
        LevelDBService.put(`request-${params.request_id}-${new Date().getTime()}`, JSON.stringify(params));
        if (config.merchant.callback_url) {
            superagent.post(config.merchant.callback_url).send(params).end((err, resp) => {
                if (err) {
                    console.error(err);
                }
                console.log('callback已提交');
                // MerchantTask.dequeue(params.request_id);
            });
        }
    }
};
