import IPFSService from '../lib/services/IPFSService'

IPFSService.download('QmXQe63nYL1DKsabmqLxjskpsgUETSybXw9khXUoeztGvz','/ip4/106.14.194.229/tcp/5001').then((data)=> {
    console.log('data:',data);
}).catch((ex)=> {
    console.error(ex);
})