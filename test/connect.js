var gxbjsws = require("gxbjs-ws");

gxbjsws.Apis.instance("wss://node1.gxb.io", true).init_promise.then(function (res) {
    console.log(res);
});