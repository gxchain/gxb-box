import FaucetService from '../lib/services/FaucetService'
import * as config from 'config'
import {Apis} from "gxbjs-ws"
import {ChainStore,PrivateKey} from 'gxbjs'

let merchant_private_key = PrivateKey.fromWif(config.merchant.private_key);

Apis.instance("ws://192.168.1.118:28090", true)
    .init_promise.then((res) => {

    ChainStore.init().then(() => {

        FaucetService.request_for_a_token('1.2.19', '1.19.0', 'foobar',config.merchant.account_name,merchant_private_key).then((resp)=> {
            console.log(resp);
        }).catch((ex)=> {
            console.error(ex);
        })
    }).catch((ex)=>{
        console.error(ex);
    })

}).catch((ex)=>{
    console.error(ex);
});