import IPFSService from '../lib/services/IPFSService'

IPFSService.upload('bZMtv6paZIzApBhP50o1R6Y6MQwPE3o4YlxYM5n3MvO4yCDph93LzWK/Jvq72UJqYifPtGA+2PJRCKkMGu4FxYxNWSYIEhj11+3bOLYIqGo=', ["/ip4/139.196.138.193/tcp/5001", "/ip4/106.14.194.229/tcp/5001"]).then((hash) => {
    console.log('uploaded:', hash);
    IPFSService.download(hash, ["/ip4/139.196.138.193/tcp/5001", "/ip4/106.14.194.229/tcp/5001"]).then((data) => {
        console.log('data:', data);
    }).catch((ex) => {
        console.error(ex);
    })
})

