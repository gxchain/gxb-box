import 'shelljs/global';
import Promise from 'bluebird';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';

/**
 * 检查archive目录是否创建，未创建则创建
 */
export const create_archive_folder = () => {
    return new Promise((resolve, reject) => {
        fs.exists(path.join(process.cwd(), './archive'), function (exists) {
            if (!exists) {
                fs.mkdir(path.join(process.cwd(), './archive'), function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    });
};

/**
 * 打包
 * @param visual 是否打包可视化模块
 */
export const get_box_prod_zip = () => {
    return new Promise((resolve, reject) => {
        create_archive_folder().then(() => {
            let archiveFileName = 'gxb-box-' + new Date().valueOf() + '.zip';
            let archiveFilePath = path.join(process.cwd(), './archive/' + archiveFileName);
            let archive = archiver('zip');
            let output = fs.createWriteStream(archiveFilePath);
            output.on('close', function () {
                let zip_info = {
                    name: archiveFileName,
                    size: archive.pointer() + ' total bytes',
                    time: new Date().valueOf()
                };
                resolve(zip_info);
            });
            archive.on('error', function (err) {
                reject(err);
            });
            archive.pipe(output);
            archive.file(path.join(process.cwd(), './script/start.sh'), {
                date: new Date(),
                name: 'start-box.sh'
            });
            archive.file(path.join(process.cwd(), './script/start.cmd'), {
                date: new Date(),
                name: 'start-box.cmd'
            });
            archive.directory(path.join(process.cwd(), './dist/box'), './box', {date: new Date()});
            archive.directory(path.join(process.cwd(), './dist/config'), './config', {date: new Date()});
            archive.file(path.join(process.cwd(), './package.json'), {date: new Date(), name: 'package.json'});
            archive.finalize();
        }).catch(reject);
    });
};
