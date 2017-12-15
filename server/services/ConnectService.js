import {Apis, Manager} from 'gxbjs-ws';
import config from '../../config';

let connected = false;
let connectionManager = null;
let _env;

/**
 * 连接witness
 * @param callback
 */
let connect = function (env, reconnect, callback) {
    let witnesses = env === 'development' ? config.dev.witnesses : config.build.witnesses;
    _env = env;
    if (reconnect) {
        connected = false;
        connectionManager = new Manager({url: witnesses[0], urls: witnesses});
    }
    if (connected) {
        return callback(connected);
    }
    if (!connectionManager) {
        connectionManager = new Manager({url: witnesses[0], urls: witnesses});
    }
    connectionManager.connectWithFallback(true).then(() => {
        callback && callback(connected);
    }).catch((ex) => {
        console.error(ex);
    });
};

/**
 * websocket 状态处理
 * @param status
 */
Apis.setRpcConnectionStatusCallback(function (status) {
    let statusMap = {
        open: '开启',
        closed: '关闭',
        error: '错误',
        reconnect: '重新连接'
    };
    console.log('witness当前状态:', statusMap[status] || status);
    if (!connected && status === 'open') {
        connected = true;
    }
    if (status === 'reconnect') {
        console.log('断开重连');
    } else if (connected && (status === 'closed' || status === 'error')) { // 出错重连
        connected = false;
        console.log('重新连接其他witness');
        connect(_env, false, function () {});
    }
});

export default {
    connect
};
