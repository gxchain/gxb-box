var gxbjsws = require("gxbjs-ws");

var connectionManager = new gxbjsws.Manager({url:'wss://node1.gxb.io', urls: ['wss://node1.gxb.io']});
connectionManager.connectWithFallback(true).then(()=> {
    console.log('已连接');
}).catch((ex)=> {
    console.error('连接失败,3秒后重试', ex.message);
})

gxbjsws.Apis.setRpcConnectionStatusCallback(function (status) {
    var statusMap = {
        open: '开启',
        closed: '关闭',
        error: '错误',
        reconnect: '重新连接'
    }

    console.log('witness当前状态:', statusMap[status] || status);
});