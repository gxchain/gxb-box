import Promise from 'bluebird';
import path from 'path';
import pm2 from 'pm2';
import io from 'socket.io-client';

let is_started = false;
let port = parseInt(process.env.port || '3031');
let url = 'http://localhost:' + port;

/**
 * 数据盒子服务 - 启动
 */
const box_start = function () {
    return new Promise(function (resolve, reject) {
        pm2.connect(function (err) {
            if (err) {
                reject(err);
                process.exit(2);
            }
            pm2.start({
                name: 'gxb-box-pm2',
                script: path.join(process.cwd(), 'dist/box/gxb-box.js'),
                exec_mode: 'fork',
                max_memory_restart: '100M'
            }, function (err, apps) {
                if (err) {
                    reject(err);
                } else {
                    resolve(apps);
                }
            });
        });
    });
};

/**
 * 数据盒子服务 - 停止
 */
const box_stop = function () {
    return new Promise(function (resolve, reject) {
        pm2.connect(function (err) {
            if (err) {
                reject(err);
                process.exit(2);
            }
            pm2.stop('gxb-box-pm2', function (err) {
                if (err) {
                    reject(err);
                } else {
                    pm2.describe('gxb-box-pm2', function (err, processDescription) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(processDescription);
                        }
                    });
                }
            });
        });
    });
};

/**
 * 数据盒子服务 - 删除
 */
const box_delete = function () {
    return new Promise(function (resolve, reject) {
        pm2.connect(function (err) {
            if (err) {
                reject(err);
                process.exit(2);
            }
            pm2.describe('gxb-box-pm2', function (err, processDescription) {
                if (err) {
                    reject(err);
                } else {
                    if (processDescription.length === 0) {
                        resolve();
                    } else {
                        pm2.delete('gxb-box-pm2', function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }
                }
            });
        });
    });
};

/**
 * 数据盒子服务 - 重启
 */
const box_restart = function () {
    return new Promise(function (resolve, reject) {
        pm2.connect(function (err) {
            if (err) {
                reject(err);
                process.exit(2);
            }
            pm2.restart('gxb-box-pm2', function (err) {
                if (err) {
                    reject(err);
                } else {
                    pm2.describe('gxb-box-pm2', function (err, processDescription) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(processDescription);
                        }
                    });
                }
            });
        });
    });
};

/**
 * 数据盒子服务 - 查询
 */
const fetch_box = function () {
    return new Promise(function (resolve, reject) {
        pm2.connect(function (err) {
            if (err) {
                reject(err);
                process.exit(2);
            }
            pm2.describe('gxb-box-pm2', function (err, processDescription) {
                if (err) {
                    reject(err);
                } else {
                    // 启动消息BUS，监听日志
                    if ((!is_started) && (processDescription && processDescription.length > 0)) {
                        let websocket = io.connect(url);

                        setInterval(function () {
                            pm2.describe('gxb-box-pm2', function (processDescription) {
                                websocket.emit('system', processDescription);
                            });
                        }, 1000);

                        pm2.launchBus(function (err, bus) {
                            if (err) return reject(err);
                            is_started = true;
                            bus.on('log:out', function (packet) {
                                websocket.emit('message', 'out', packet.data);
                            });
                            bus.on('log:err', function (packet) {
                                websocket.emit('message', 'err', packet.data);
                            });
                            return resolve(processDescription);
                        });
                    } else {
                        resolve(processDescription);
                    }
                }
            });
        });
    });
};

export default {
    box_start,
    box_stop,
    box_delete,
    box_restart,
    fetch_box
};
