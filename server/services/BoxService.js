import Promise from 'bluebird'
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
const box_list = function () {
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

export default {
    box_start,
    box_list
};
