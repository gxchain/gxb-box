import express from 'express';
import io from 'socket.io';
import logger from 'morgan';
import bodyParser from 'body-parser';
import http from 'http';
import path from 'path';
import fs from 'fs';
import os from 'os';
import {Apis, Manager} from "gxbjs-ws";

import opn from 'opn';
import webpackConfig from '../build/webpack.dev.conf';
import webpack from 'webpack';
import config from '../config';

let debug = require('debug')('gxb-box:server');
let autoOpenBrowser = config.dev.autoOpenBrowser;
let app = express();
let compiler = webpack(webpackConfig);

let devMiddleware = null;
let hotMiddleware = null;

app.use(require('connect-history-api-fallback')({
    index: '/',
    rewrites: [
        { from: '/^\/abc$/', to: '/' },
        {
            from: '/api/*', to: function (options) {
              return options.parsedUrl.href;
            }
        }
    ]
}));

if (app.get('env') === 'development') {
  devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
  });
  hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: console.log,
    heartbeat: 2000
  });
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
      hotMiddleware.publish({action: 'reload'});
      cb()
    })
  });
  app.use(logger('dev'));
  app.use(devMiddleware);
  app.use(hotMiddleware);

  let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
  app.use(staticPath, express.static('./static'));
}
else {
  app.use(logger('combined'));
  app.use(express.static('./dist'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let connected = false;
const connectedCheck = function (req, res, next) {
  if (connected) {
    next();
  }
  else {
    res.status(500).send({
      message: '正在初始化数据,请稍后再试'
    })
  }
};

app.use('/api', connectedCheck, require('./routes/api'));

app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

/**
 * 获取本机IP
 */
const get_ip_address = () => {
    let interfaces = os.networkInterfaces();
    for(let devName in interfaces){
        let iface = interfaces[devName];
        for(let i=0;i<iface.length;i++){
            let alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
};

/**
 * 过滤可连接的节点
 * @param latencies
 * @param witnesses
 * @returns {Array.<T>|*}
 */
const filterAndSortURLs = (latencies, witnesses) => {
    return witnesses
    .filter(a => {
      /* Only keep the nodes we were able to connect to */
      return !!latencies[a];
    })
    .sort((a, b) => {
      return latencies[a] - latencies[b];
    });
};

let witnesses = app.get('env') === 'development' ? config.dev.witnesses : config.build.witnesses;
if (witnesses.length === 0) {
  console.error('未配置启动节点');
  process.exit(1);
}
/**
 * 连接witness
 * @param callback
 */
let connect = function (callback) {
  let connectionManager = new Manager({url: witnesses[0], urls: witnesses});
  connectionManager.checkConnections().then((resp) => {
    let urls = filterAndSortURLs(resp, witnesses);
    console.log(urls);
    if (urls.length === 0) {
      console.error('无可用连接,3秒后重试');
      setTimeout(function () {
        connect(callback);
      }, 3000);
    }
    else {
      connectionManager.urls = urls;
      connectionManager.connectWithFallback(true).then(() => {
        console.log('witnesses已连接');
        connected = true;
        callback && callback();
      }).catch((ex) => {
        console.error('连接失败,3秒后重试', ex.message);
        setTimeout(function () {
          connect(callback);
        }, 3000);
      })
    }
  }).catch((ex) => {
    console.error('检查连接失败,3秒后重试', ex.message);
    setTimeout(function () {
      connect(callback);
    }, 3000);
  })
};

/**
 * 初始化连接
 */
let initConnection = function () {
    console.log('检查配置文件...');
    //检查配置文件
    let config_path = path.resolve(process.cwd(),'./config/config.json');
    fs.exists(config_path, function(exists) {
        if (exists) {
            startServer();
        }else{
            try{
                let _config = app.get('env') === 'development' ? config.dev.visualizationConfig : config.build.visualizationConfig;
                fs.writeFileSync(config_path, JSON.stringify(_config));
                startServer();
            }
            catch (ex){
                console.error('获取配置信息失败,请检查:\n1. 请确认配置文件以及读写权限 \n', ex);
            }
        }
    });
};

/**
 * 启动web服务
 */
let serverStarted = false;
let startServer = function () {
  if (serverStarted) {
    return;
  }
  serverStarted = true;
  let port = parseInt(process.env.port || '3031');
  app.set('port', port);
  let server = http.createServer(app);
  let websocket = io(server);
  websocket.on('connection', function(socket){
      socket.on("message", function(type, data) {
          websocket.emit("message", type, data);
      });
      socket.on("system", function(data) {
          websocket.emit("system", data);
      });
  });
  server.listen(port);
  server.on('error', onError);
  server.on('listening', () => {
      devMiddleware && devMiddleware.waitUntilValid(() => {
          let uri = `http://localhost:${port}`;
          if (app.get('env') === 'development' && autoOpenBrowser) {
              opn(uri);
          }
      });
      let local_ip = get_ip_address();
      console.log('公信宝数据盒子配置系统已启动');
      console.log('> 访问地址：' + 'http://' + local_ip + ':' + port)
  });
};

// websocket 状态处理
Apis.setRpcConnectionStatusCallback(function (status) {
  let statusMap = {
    open: '开启',
    closed: '关闭',
    error: '错误',
    reconnect: '重新连接'
  };
  console.log('witness当前状态:', statusMap[status] || status);
  if (status === "reconnect") {
    console.log('断开重连');
  } else if (connected && (status === 'closed' || status === 'error')) { // 出错重连
    connected = false;
    console.log('重新连接其他witness');
    connect(function () {
      initConnection();
    })
  }
});

// 首次连接
connect(function () {
  initConnection();
});

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

process.stdin.resume();

function exitHandler(reason, err) {
  if (err) console.log(err.stack);
  console.log('程序退出:', reason);
  process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, 'exit'));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, 'SIGINT'));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, 'uncaughtException'));
