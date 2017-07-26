import LevelDBService from '../lib/services/LevelDBService'

LevelDBService.put('testcase',JSON.stringify({
    'foobar':{
        timestamp:new Date().getTime()
    }
})).then(function () {
    LevelDBService.get('testcase').then(function (val) {
        console.log(JSON.parse(val));
    })
})