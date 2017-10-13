import IPFSService from '../lib/services/IPFSService'

IPFSService.upload('123123',["/ip4/139.196.138.193/tcp/5001","/ip4/106.14.194.229/tcp/5001"]).then((hash)=>{
    console.log('uploaded:',hash);
    IPFSService.download(hash,["/ip4/139.196.138.193/tcp/5001","/ip4/106.14.194.229/tcp/5001"]).then((data)=> {
        console.log('data:',data);
    }).catch((ex)=> {
        console.error(ex);
    })
})

