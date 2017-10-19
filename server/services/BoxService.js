import Promise from 'bluebird'
import readline from 'readline'
import fs from 'fs'
import path from 'path'
import pm2 from 'pm2'

/**
 * 数据盒子服务 - 启动
 */
const box_start = function () {
  return new Promise(function (resolve, reject) {
      pm2.connect(function(err) {
          if (err) {
              reject(err);
              process.exit(2);
          }
          pm2.start({
              script    : path.join(process.cwd(),'server-box-dist/gxb-box.js'),         // Script to be run
              exec_mode : 'fork',        // Allows your app to be clustered
              max_memory_restart : '100M'   // Optional: Restarts your app if it reaches 100Mo
          }, function(err, apps) {
              pm2.disconnect();   // Disconnects from PM2
              if (err) {
                  reject(err);
              }else{
                  resolve(apps);
              }
          });
      });
  })
};

/**
 * 数据盒子服务 - 列表
 */
const fetch_box_list = function () {
    return new Promise(function (resolve, reject) {
        pm2.connect(function(err) {
            if (err) {
                reject(err);
                process.exit(2);
            }
            pm2.list(function(err, processDescriptionList) {
                pm2.disconnect();   // Disconnects from PM2
                if (err) {
                    reject(err);
                }else{
                    resolve(processDescriptionList);
                }
            });
        });
    })
};

/**
 * 数据盒子服务 - 获取日志
 */
const fetch_log = function (pm_id, path) {
    return new Promise(function (resolve, reject) {
        let log = [];
        try {
            fs.exists(path, function(exists) {
                if (exists) {
                    let rl = readline.createInterface({
                        input: fs.createReadStream(path),
                    });

                    rl.on('line', function(line) {
                        let obj = {};
                        obj.pm_id = pm_id;
                        obj.tip = line;
                        log.push(obj);
                    });

                    rl.on('close', ()=>{
                        resolve(log);
                    });
                }else{
                    reject(path+'文件不存在');
                }
            });
        }
        catch(ex) {
            reject(ex);
        }
    })
};

export default {
    box_start,
    fetch_box_list,
    fetch_log
};
