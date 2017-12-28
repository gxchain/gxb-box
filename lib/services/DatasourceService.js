import superagent from 'superagent';
import Promise from 'bluebird';
import ConfigStore from '../utils/ConfigStore';

export default {
    fetch_data (params) {
        let config = ConfigStore.config;
        return new Promise((resolve, reject) => {
            superagent.post(config.datasource.service).send(params).end((err, resp) => {
                if (err) {
                    console.error('获取数据失败', resp && resp.text);
                    reject(new Error('offline'));
                } else {
                    try {
                        let result = JSON.parse(resp.text);
                        resolve(result);
                    } catch (ex) {
                        console.error('返回数据格式错误:', ex);
                        reject(new Error('invalid_format'));
                    }
                }
            });
        });
    }
};
