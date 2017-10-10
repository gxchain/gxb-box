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
                self.config.common = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/common-config.json'),'utf-8'));
                self.config.merchant = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/merchant-config.json'),'utf-8'));
                self.config.datasource = JSON.parse(fs.readFileSync(path.resolve(process.cwd(),'./config/datasource-config.json'),'utf-8'));
                resolve(self.config);
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