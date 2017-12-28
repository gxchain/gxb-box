npm install -production
pm2 stop gxb-box
pm2 start ./box/gxb-box.js --name gxb-box
