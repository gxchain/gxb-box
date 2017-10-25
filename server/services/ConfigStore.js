import Promise from 'bluebird'
import {PrivateKey} from 'gxbjs'
import fs from 'fs'
import path from 'path'

export default{
    init() {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                self.config = {};
                self.config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/config.json'),'utf-8'));
                resolve(self.config);
            }
            catch (ex){
                reject(ex);
            }
        })
    },
    common_set(config) {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                let _config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/config.json'),'utf-8'));
                _config.common = JSON.parse(config);
                fs.writeFileSync(path.resolve(process.cwd(),'./config/config.json'),JSON.stringify(_config));
                self.config = _config;
                resolve({message:'系统配置保存成功'});
            }
            catch (ex){
                reject(ex);
            }
        })
    },
    merchant_set(config) {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                let _config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/config.json'),'utf-8'));
                if (_config.datasource){
                    delete(_config.datasource);
                }
                _config.merchant = JSON.parse(config);
                fs.writeFileSync(path.resolve(process.cwd(),'./config/config.json'),JSON.stringify(_config));
                self.config = _config;
                resolve({message:'商户账号配置保存成功'});
            }
            catch (ex){
                reject(ex);
            }
        })
    },
    datasource_set(config, is_merchant_open) {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                let _config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/config.json'),'utf-8'));
                _config.datasource = JSON.parse(config);
                if (!is_merchant_open){
                    delete(_config.merchant);
                }
                fs.writeFileSync(path.resolve(process.cwd(),'./config/config.json'),JSON.stringify(_config));
                self.config = _config;
                resolve({message:'数据源账号配置保存成功'});
            }
            catch (ex){
                reject(ex);
            }
        })
    },
    get_merchant_private_key (){
        let config = this.config;
        return config.merchant && config.merchant.private_key ? PrivateKey.fromWif(config.merchant.private_key) : '';
    },
    get_datasource_private_key (){
        let config = this.config;
        return config.datasource && config.datasource.private_key ? PrivateKey.fromWif(config.datasource.private_key) : '';
    }
}