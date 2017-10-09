import Promise from 'bluebird'
import {PrivateKey} from 'gxbjs'
import fs from 'fs'
import path from 'path'

export default{
    common_init() {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                self.config.common = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/common-config.json'),'utf-8'));
                resolve(self.config);
            }
            catch (ex){
                reject(ex);
            }
        })
    },
    merchant_init() {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                self.config.merchant = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/account-config.json'),'utf-8'));
                resolve(self.config);
            }
            catch (ex){
                reject(ex);
            }
        })
    },
    datasource_init() {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                self.config.datasource = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/account-config.json'),'utf-8'));
                resolve(self.config);
            }
            catch (ex){
                reject(ex);
            }
        })
    },
    set(config) {
        return new Promise((resolve, reject)=> {
            try{
                fs.writeFileSync(path.resolve(process.cwd(),'./config/account-config.json'),config);
                resolve('账号配置保存成功');
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