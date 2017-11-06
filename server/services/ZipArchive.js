import 'shelljs/global';
import Promise from 'bluebird';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';

export default{
    get_box_prod_zip(visual){
        return new Promise((resolve, reject)=> {
            let archiveFileName = 'gxb-box-' + new Date().valueOf() + '.zip';
            let archiveFilePath = path.join(process.cwd(), './static/archive/' + archiveFileName);
            let archive = archiver('zip');
            let output = fs.createWriteStream(archiveFilePath);
            output.on('close', function () {
                let zip_info = {
                    name: archiveFileName,
                    size: archive.pointer() + ' total bytes',
                    path: '/static/archive/' + archiveFileName,
                    time: new Date().valueOf()
                };
                resolve(zip_info);
            });
            archive.on('error', function (err) {
                reject(err);
            });
            archive.pipe(output);
            archive.directory(path.join(process.cwd(),'./config'), './config', {date: new Date()});
            if (visual === '1'){
                archive.directory(path.join(process.cwd(),'./dist'), './dist', {date: new Date()});
                archive.directory(path.join(process.cwd(),'./server-dist'), './server-dist', {date: new Date()});
            }
            archive.directory(path.join(process.cwd(),'./server-box-dist'), './server-box-dist', {date: new Date()});
            archive.file(path.join(process.cwd(),'./start.sh'), {date: new Date(), name: 'start.sh'});
            archive.file(path.join(process.cwd(),'./start.cmd'), {date: new Date(), name: 'start.cmd'});
            archive.file(path.join(process.cwd(),'./package.json'), {date: new Date(), name: 'package.json'});
            archive.finalize();
        })
    }
}
