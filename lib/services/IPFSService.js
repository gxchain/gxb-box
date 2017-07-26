import Promise from 'bluebird'
import ipfsAPI from 'ipfs-api'

export default{
    /**
     * 上传数据到ipfs
     * @param data
     */
    upload:function (data,addr) {
        let ipfs_api = ipfsAPI(addr);
        return new Promise(function (resolve,reject) {
            const obj = {
                Data:new Buffer(data),
                Links:[]
            }
            ipfs_api.object.put(obj,function (err,node) {
                if(err){
                    reject(err);
                }
                else{
                    const nodeJSON = node.toJSON();
                    resolve(nodeJSON.multihash);
                }
            })
        })
    },
    /**
     * 通过hash从ipfs下载数据
     * @param hash
     */
    download:function (hash,addr) {
        let ipfs_api = ipfsAPI(addr);
        return new Promise(function (resolve,reject) {
            ipfs_api.object.data(hash,function (err,data) {
                if(err){
                    reject(err);
                }
                else{
                    resolve(data.toString());
                }
            })
        })
    }
}