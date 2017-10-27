import Promise from 'bluebird';
import {Apis} from "gxbjs-ws";

/**
 * 获取数据市场二级栏目
 */
const fetch_data_market_categories = function (data_market_type) {
    return new Promise(function (resolve, reject) {
        Apis.instance().db_api().exec('list_data_market_categories', [data_market_type]).then(function (res) {
            res = (res||[]).filter(function (cate) {
                return cate.status === 1;
            });
            resolve(res);
        }).catch(function (err) {
            reject(err);
        })
    })
};

/**
 * 获取自由市场产品列表
 */
const fetch_free_data_products = function (category_id, page, pageSize, keywords) {
    return new Promise(function (resolve, reject) {
        console.log(1);
        Apis.instance().db_api().exec('list_free_data_products', [category_id, page * pageSize, pageSize, "", keywords,false]).then(function (res) {
            let data = {
                list: res.data,
                total: res.filtered_total
            };
            resolve(data);
        }).catch(function (err) {
            reject(err);
        })
    })
};

/**
 * 获取自由市场产品详情
 */
const fetch_free_data_product_details = function (product_id) {
    return new Promise(function (resolve, reject) {
        Apis.instance().db_api().exec('get_free_data_products', [[product_id]]).then(function (res) {
            let result = res && res.length > 0 ? res[0] : {};
            let schema_contexts = result.schema_contexts.map(function (schema) {
                let schemaJSON = JSON.parse(schema.schema_context);
                return {
                    version: schema.version,
                    input: schemaJSON.input,
                    output: schemaJSON.output,
                    code: schemaJSON.code
                }
            }).reverse();
            let latestVersion = '';
            if (schema_contexts.length > 0) {
                latestVersion = schema_contexts[0].version;
            }

            let data = {
                product_name: result.product_name,
                brief_desc: result.brief_desc,
                datasource: result.datasource,
                status: result.status,
                total: result.total,
                version: latestVersion,
                latestVersion: latestVersion,
                category_id: result.category_id,
                schema_contexts: schema_contexts,
                price: result.price,
                icon: result.icon
            };
            resolve(data);
        }).catch(function (err) {
            reject(err);
        })
    })
};

/**
 * 获取联盟市场产品列表
 */
const fetch_league_data_products = function (category_id, page, pageSize, keywords) {
    return new Promise(function (resolve, reject) {
        Apis.instance().db_api().exec('list_leagues', [category_id, page * pageSize, pageSize, "", keywords,false]).then(function (res) {
            let data = {
                list: res.data,
                total: res.filtered_total
            };
            resolve(data);
        }).catch(function (err) {
            reject(err);
        })
    })
};

export default {
    fetch_data_market_categories,
    fetch_free_data_products,
    fetch_free_data_product_details,
    fetch_league_data_products
};
