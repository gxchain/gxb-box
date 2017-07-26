import MerchantService from './MerchantService'
import {SYSTEM_ERROR_CODE} from '../utils/constants'
let timeoutCollection={};
export default{
    /**
     * 添加超时通知任务
     * @param request_id
     * @param timeout
     */
    add(request_id,timeout){
        if(!timeoutCollection[request_id]){
            timeoutCollection[request_id]=setTimeout(function () {
                MerchantService.notify({
                    request_id,
                    body:{
                        code:SYSTEM_ERROR_CODE.DATASOURCE_OFFLINE,
                        message:`${timeout/1000}秒内无响应,可能原因:\n1. 数据源离线了\n2. 涉及个人隐私数据交易未得到本人授权`
                    }
                })
            },timeout);
        }
    },

    /**
     * 取消超时通知任务
     * @param request_id
     */
    remove(request_id){
        if(timeoutCollection[request_id]){
            clearTimeout(timeoutCollection[request_id]);
            delete timeoutCollection[request_id];
        }
    }
}