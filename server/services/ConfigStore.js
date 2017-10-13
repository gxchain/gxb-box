import Promise from 'bluebird'
import {PrivateKey} from 'gxbjs'
import fs from 'fs'
import path from 'path'

export default{
    common_init() {
        let self = this;
        return new Promise((resolve, reject)=> {
            try{
                self.config = {};
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
                self.config = {};
                self.config.merchant = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/merchant-config.json'),'utf-8'));
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
                self.config = {};
                self.config.datasource = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/datasource-config.json'),'utf-8'));
                resolve(self.config);
            }
            catch (ex){
                reject(ex);
            }
        })
    },
    merchant_set(config) {
        return new Promise((resolve, reject)=> {
            try{
                fs.writeFileSync(path.resolve(process.cwd(),'./config/merchant-config.json'),config);
                resolve('商户账号配置保存成功');
            }
            catch (ex){
                reject(ex);
            }
        })
    },
    datasource_set(config) {
        return new Promise((resolve, reject)=> {
            try{
                fs.writeFileSync(path.resolve(process.cwd(),'./config/datasource-config.json'),config);
                resolve('数据源账号配置保存成功');
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