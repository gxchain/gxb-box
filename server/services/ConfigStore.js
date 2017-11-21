import Promise from 'bluebird';
import {PrivateKey} from 'gxbjs';
import fs from 'fs';
import os from 'os';
import path from 'path';

let config_path = path.resolve(process.cwd(),'./config/config.json');

export default{
    get_ip_address(){
        let interfaces = os.networkInterfaces();
        for(let devName in interfaces){
            if (interfaces.hasOwnProperty(devName)) {
                let iface = interfaces[devName];
                for (let i = 0; i < iface.length; i++) {
                    let alias = iface[i];
                    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                        return alias.address;
                    }
                }
            }
        }
    },
    init() {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                self.config = {};
                self.config = JSON.parse(fs.readFileSync(config_path, 'utf-8'));
                self.config.common.box_ip = self.get_ip_address();
                resolve(self.config);
            }
            catch (ex){
                reject(ex);
            }
        });
    },
    common_set(config) {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                let _config = JSON.parse(fs.readFileSync(config_path, 'utf-8'));
                _config.common = JSON.parse(config);
                fs.writeFileSync(config_path,JSON.stringify(_config));
                self.config = _config;
                resolve({
                    'message':'系统配置保存成功',
                    'data': _config.common
                });
            }
            catch (ex){
                reject(ex);
            }
        });
    },
    merchant_set(config) {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                let _config = JSON.parse(fs.readFileSync(config_path, 'utf-8'));
                if (_config.datasource){
                    delete(_config.datasource);
                }
                _config.merchant = JSON.parse(config);
                fs.writeFileSync(config_path, JSON.stringify(_config));
                self.config = _config;
                resolve({
                    'message':'商户账号配置保存成功',
                    'data': {
                        'account_name': _config.merchant.account_name,
                        'private_key': _config.merchant.private_key
                    }
                });
            }
            catch (ex){
                reject(ex);
            }
        });
    },
    datasource_set(merchant_config, datasource_config, is_merchant_open) {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                let _config = JSON.parse(fs.readFileSync(config_path, 'utf-8'));
                if (!is_merchant_open){
                    delete(_config.merchant);
                }else{
                    if (merchant_config !== null){
                        _config.merchant = JSON.parse(merchant_config);
                    }
                }
                _config.datasource = JSON.parse(datasource_config);
                fs.writeFileSync(config_path, JSON.stringify(_config));
                self.config = _config;
                resolve({
                    message:'数据源账号配置保存成功',
                    data: {
                        'account_name': _config.datasource.account_name,
                        'private_key': _config.datasource.private_key
                    }
                });
            }
            catch (ex){
                reject(ex);
            }
        });
    },
    get_merchant_private_key (){
        let config = this.config;
        return config.merchant && config.merchant.private_key ? PrivateKey.fromWif(config.merchant.private_key) : '';
    },
    get_datasource_private_key (){
        let config = this.config;
        return config.datasource && config.datasource.private_key ? PrivateKey.fromWif(config.datasource.private_key) : '';
    }
};