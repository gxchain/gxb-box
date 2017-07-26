import GXChainService from '../lib/services/GXChainService'
import {Apis} from "gxbjs-ws"
import {ChainStore} from 'gxbjs'

Apis.instance("ws://192.168.1.118:28090", true)
    .init_promise.then((res) => {

    ChainStore.init().then(() => {
        GXChainService.fetch_data_product('1.17.0').then(function (prod) {
            console.log(prod);
        }).catch((ex)=>{
            console.error(ex);
        })
    }).catch((ex)=>{
        console.error(ex);
    })

}).catch((ex)=>{
    console.error(ex);
});