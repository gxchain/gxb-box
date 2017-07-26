import ConfigStore from '../utils/ConfigStore'
import MerchantTask from '../tasks/MerchantTask'
import DatasourceTask from '../tasks/DatasourceTask'
import {TRANSACTION_STATUS_MAP} from '../utils/constants'

export default{

    /**
     * 数据交易调度函数
     * @param data_transaction
     */
    schedule(data_transaction){
        let request_id = data_transaction.request_id;
        let product_id = data_transaction.product_id;
        let status = TRANSACTION_STATUS_MAP[data_transaction.status];
        let config = ConfigStore.config;
        let is_product_subscribed = config.datasource&&config.datasource.subscribed_data_product&&config.datasource.subscribed_data_product.find(function (prod) {
            return prod == product_id;
        })
        let is_request_in_queue = MerchantTask.exist(request_id);

        // 已确认的交易, 数据源可以回传数据
        if (status == TRANSACTION_STATUS_MAP.CONFIRMED && is_product_subscribed) {
            DatasourceTask.deal_with_data_transaction(data_transaction);
        }
        // 已确认的交易, 商户根据状态进行处理
        if (status == TRANSACTION_STATUS_MAP.CONFIRMED && is_request_in_queue) {
            MerchantTask.deal_with_data_transaction(data_transaction);
        }
    }
}