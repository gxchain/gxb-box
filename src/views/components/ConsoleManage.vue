<style scoped>
    .ivu-btn {
        margin: 15px 0;
    }

    .server-status{
        margin-bottom: 10px;
    }

    .server-logs{
        border: 1px solid #dddee1;
        position: relative;
        transition: all .2s ease-in-out;
        margin-bottom: 25px;
    }

    .log-header {
        text-align: left;
        padding-left: 10px;
        font-weight: 500;
        height: 40px;
        line-height: 40px;
        position: relative;
        background-color: #f8f8f9;
        border-bottom: 1px solid #e9eaec;
    }

    .log-box {
        padding-top: 5px;
        text-align: left;
        height: 400px;
        overflow-y: auto;
        background: #333;
        color: #fff;
    }

    .log-box .out{
        color: #19be6b
    }

    .log-box .err{
        color: #ed3f14
    }

    .log-box ul:after {
        content: "\2590";
        -webkit-animation: blinker 1s linear infinite;
        -moz-animation: blinker 1s linear infinite;
        animation: blinker 1s linear infinite;
    }
    .log-box ul li {
        font-size: 12px;
        background-color: transparent;
        color: #FFF;
        line-height: 1.4;
        white-space: pre;
        padding: 1px 5px;
        font-family: monospace;
    }

    .spin-container{
        display: inline-block;
        width: 200px;
        height: 100px;
        position: relative;
    }

    @-moz-keyframes blinker {
        0% {
            opacity: 1.0;
        }
        50% {
            opacity: 0.0;
        }
        100% {
            opacity: 1.0;
        }
    }
    @-webkit-keyframes blinker {
        0% {
            opacity: 1.0;
        }
        50% {
            opacity: 0.0;
        }
        100% {
            opacity: 1.0;
        }
    }
    @keyframes blinker {
        0% {
            opacity: 1.0;
        }
        50% {
            opacity: 0.0;
        }
        100% {
            opacity: 1.0;
        }
    }
</style>
<style>
    td.state-online{
        color: #19be6b
    }
    td.state-stopped{
        color: #ed3f14
    }
    td.state-info{
        color: #2d8cf0
    }
</style>
<template>
    <div class="console-manage">
        <div class="spin-container" v-show="!loaded">
            <Spin fix></Spin>
        </div>
        <div v-show="loaded">
            <Alert type="info" v-if="(pm2_list.length === 0) && (scene === 'init')">
                启动数据盒子服务前，请检查服务器环境是否已全局安装
                <a href="http://pm2.keymetrics.io/docs/usage/quick-start/" target="_blank">PM2</a>
            </Alert>
            <Alert type="success" v-if="(pm2_list.length !== 0) && (scene === 'init')">
                恭喜您已完成所有初始化配置，请检查日志确认数据盒子服务是否正常启动
            </Alert>
            <div class="server-status">
                <Table stripe :columns="pm2_columns" :data="pm2_list" v-show="pm2_list.length > 0"></Table>
            </div>
            <div class="server-logs" v-show="pm2_list.length > 0">
                <header class="log-header">日志</header>
                <div class="log-box" id="scroll-box">
                    <ul>
                        <li v-for="(log, index) in pm2_out_logs" :key="index">
                            <span class="out">{{pm2_list[0].pm_id}}|{{pm2_list[0].name}}</span>
                            <span class="out">  | </span>
                            <span>{{log.tip}}</span>
                        </li>
                        <li v-for="(log, index) in pm2_err_logs" :key="index">
                            <span class="err">{{pm2_list[0].pm_id}}|{{pm2_list[0].name}}</span>
                            <span class="err">  | </span>
                            <span class="err">{{log.tip}}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="service-btn-box" v-if="(pm2_list.length === 0) && (scene === 'init')">
                <Button type="primary"  @click="boxStart()" :loading="loading[0]">
                    <span v-show="!loading[0]">启动服务</span>
                    <span v-show="loading[0]">启动中...</span>
                </Button>
                <Button type="primary" @click="lastStep()">上一步</Button>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    export default {
        props: ['scene'],
        data () {
            return {
                loaded: false,
                loading: {
                    0: false,
                    1: false,
                    2: false
                },
                pm2_status: true,
                pm2_columns: [
                    {
                        title: 'PID',
                        key: 'pid'
                    },
                    {
                        title: '名称',
                        key: 'name',
                    },
                    {
                        title: '模式',
                        key: 'mode',
                        className: 'state-info'
                    },
                    {
                        title: '重启次数',
                        key: 'restarts'
                    },
                    {
                        title: '运行时间',
                        key: 'pm_uptime',
                        render: (h, params) => {
                            return h('timeago', {
                                props: {
                                    'auto-update': 60,
                                    'since': params.row.pm_uptime
                                }
                            });
                        }
                    },
                    {
                        title: '状态',
                        key: 'state'
                    },
                    {
                        title: 'CPU',
                        key: 'cpu'
                    },
                    {
                        title: '内存',
                        key: 'memory'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h) => {
                            if (this.pm2_status){
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            loading: this.loading[1],
                                            type: 'error',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.boxStop();
                                            }
                                        }
                                    }, '停止'),
                                    h('Button', {
                                        props: {
                                            loading: this.loading[2],
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.boxRestart();
                                            }
                                        }
                                    }, '重启')
                                ]);
                            }else{
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            loading: this.loading[2],
                                            type: 'success',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.boxRestart();
                                            }
                                        }
                                    }, '启动')
                                ]);
                            }
                        }
                    }
                ],
                pm2_list: [],
                pm2_out_log_interval: '',
                pm2_err_log_interval: '',
                pm2_out_logs: [],
                pm2_err_logs: []
            };
        },
        created() {
            this.$http.get('/api/fetch_box').then((res) => {
                if (res.data && res.data.length && res.data.length > 0){
                    this.boxRender(res.data[0]);
                }
                this.loaded = true;
            }).catch((err) => {
                console.error(err);
            });
        },
        beforeDestroy () {
            clearInterval(this.pm2_out_log_interval);
            clearInterval(this.pm2_err_log_interval);
        },
        methods: {
            ...mapActions({
                setInitStep: 'setInitStep'
            }),
            boxRender (data){
                let pm2 = {};
                pm2.pid = data.pid;
                pm2.pm_id = data.pm_id;
                pm2.name = data.name;
                pm2.mode = data.pm2_env.exec_mode;
                pm2.restarts = data.pm2_env.restart_time;
                pm2.pm_uptime = data.pm2_env.pm_uptime;
                pm2.cpu = data.monit.cpu;
                pm2.memory = (data.monit.memory / 1024 / 1024).toFixed(2) + 'MB';
                pm2.state = data.pm2_env.status;
                switch (pm2.state){
                    case 'online':
                        pm2.cellClassName = {state: 'state-online'};
                        this.pm2_status = true;
                        break;
                    case 'stopped':
                        pm2.cellClassName = {state: 'state-stopped'};
                        this.pm2_status = false;
                        break;
                    default:
                        pm2.cellClassName = {state: 'state-info'};
                }
                this.pm2_list = [];
                this.pm2_list.push(pm2);
                clearInterval(this.pm2_out_log_interval);
                clearInterval(this.pm2_err_log_interval);
                this.pm2_out_log_interval = setInterval(() => {
                    this.getOutLogs(data.pm2_env.pm_out_log_path);
                }, 1000);
                this.pm2_err_log_interval = setInterval(() => {
                    this.getErrLogs(data.pm2_env.pm_err_log_path);
                }, 1000);
            },
            boxStart (){
                this.loading[0] = true;
                this.$http.get('/api/box_start').then((res) => {
                    if (res.data && res.data.length && res.data.length > 0){
                        this.setInitStep({init_step: 'finished'});
                        this.goToMarket();
                    }else{
                        this.$Message.success('服务启动失败:未知错误');
                    }
                    this.loading[0] = false;
                }).catch((err) => {
                    console.error(err);
                    this.$Message.error('服务启动失败:' + JSON.stringify(err.response.data));
                });
            },
            boxStop (){
                this.loading[1] = true;
                this.$http.get('/api/box_stop').then((res) => {
                    if (res.data && res.data.length && res.data.length > 0){
                        this.pm2_status = false;
                        this.boxRender(res.data[0]);
                    }else{
                        this.$Message.success('服务停止失败:未知错误');
                    }
                    this.loading[1] = false;
                }).catch((err) => {
                    console.error(err);
                    this.$Message.error('服务停止失败:' + JSON.stringify(err.response.data));
                });
            },
            boxRestart (){
                this.loading[2] = true;
                this.$http.get('/api/box_restart').then((res) => {
                    if (res.data && res.data.length && res.data.length > 0){
                        this.pm2_status = true;
                        this.boxRender(res.data[0]);
                    }else{
                        this.$Message.success('服务重启失败:未知错误');
                    }
                    this.loading[2] = false;
                }).catch((err) => {
                    console.error(err);
                    this.$Message.error('服务重启失败:' + JSON.stringify(err.response.data));
                });
            },
            getErrLogs (path) {
                this.$http({
                    method: 'post',
                    url: '/api/fetch_log',
                    data: {
                        'path': path
                    }
                }).then((res) => {
                    if (res.data && res.data.length && res.data.length>0){
                        if (this.loaded && (res.data.length !== this.pm2_out_logs.length)){
                            this.pm2_err_logs = [];
                            for(let i=0; i<res.data.length; i++) {
                                this.pm2_err_logs.push(res.data[i]);
                            }
                            setTimeout(function () {
                                document.getElementById('scroll-box').scrollTop = document.getElementById('scroll-box').scrollHeight;
                            },100);
                        }
                    }
                }).catch((err)=>{
                    console.error(err);
                    this.$Message.error('获取错误日志失败:' + JSON.stringify(err.response.data));
                });
            },
            getOutLogs (path) {
                this.$http({
                    method: 'post',
                    url: '/api/fetch_log',
                    data: {
                        'path': path
                    }
                }).then((res) => {
                    if (res.data && res.data.length && res.data.length>0){
                        if (this.loaded && (res.data.length !== this.pm2_out_logs.length)){
                            this.pm2_out_logs = [];
                            for(let i=0; i<res.data.length; i++) {
                                this.pm2_out_logs.push(res.data[i]);
                            }
                            setTimeout(function () {
                                document.getElementById('scroll-box').scrollTop = document.getElementById('scroll-box').scrollHeight;
                            },100);
                        }
                    }
                }).catch((err)=>{
                    console.error(err);
                    this.$Message.error('获取输出日志失败:' + JSON.stringify(err.response.data));
                });
            },
            lastStep (){
                this.$emit('last');
            },
            goToMarket (){
                this.$router.push('/console');
            }
        }
    };
</script>