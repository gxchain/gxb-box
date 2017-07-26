import GXChainService from '../lib/services/GXChainService'
import {Apis} from "gxbjs-ws"
import {ChainStore} from 'gxbjs'

Apis.instance("ws://192.168.1.118:28090", true)
    .init_promise.then((res) => {

    ChainStore.init().then(() => {
        GXChainService.fetch_league('1.19.0').then(function (league) {
            console.log(league);
        }).catch((ex)=>{
            console.error(ex);
        })
    }).catch((ex)=>{
        console.error(ex);
    })

}).catch((ex)=>{
    console.error(ex);
});