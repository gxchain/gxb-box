<style scoped>
    .ivu-btn {
        margin: 15px 0;
    }

    .server-status{
        margin-bottom: 10px;
    }

    .server-logs{
        border: 1px solid #eee;
        border-radius: 6px;
        position: relative;
        transition: all .2s ease-in-out;
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
        font-family: Airl;
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
    <div class="box-start">
        <div class="spin-container" v-show="!loaded">
            <Spin fix></Spin>
        </div>
        <div v-show="loaded">
            <Alert type="info" v-if="pm2_list.length === 0">
                启动数据盒子服务前，请检查服务器环境是否已全局安装
                <a href="http://pm2.keymetrics.io/docs/usage/quick-start/" target="_blank">PM2</a>
            </Alert>
            <Alert type="success" v-else>
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
            <div class="service-btn-box" v-if="pm2_list.length === 0">
                <Button type="primary"  @click="boxStart()" :loading="loading">
                    <span v-show="!loading">启动服务</span>
                    <span v-show="loading">启动中...</span>
                </Button>
                <Button type="primary" @click="lastStep()">上一步</Button>
            </div>
            <div class="step-btn-box" v-else>
                <Button type="primary" @click="lastStep()">上一步</Button>
                <Button type="primary" @click="goToMarket()">完成</Button>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    export default {
        data () {
            return {
                loaded: false,
                loading: false,
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
                        title: '状态',
                        key: 'state'
                    },
                    {
                        title: '创建时间',
                        key: 'created_time'
                    }
                ],
                pm2_list: [],
                pm2_out_log_interval: '',
                pm2_err_log_interval: '',
                scroll_interval: '',
                pm2_out_logs: [],
                pm2_err_logs: []
            };
        },
        created() {
            this.$http({
                method: 'get',
                url: '/api/fetch_box_list',
            }).then((res) => {
                this.loaded = true;
                if (res.data.length > 0){
                    res.data[0].state = res.data[0].pm2_env.status;
                    res.data[0].mode = res.data[0].pm2_env.exec_mode;
                    res.data[0].created_time = new Date(parseInt(res.data[0].pm2_env.created_at)).toLocaleString();
                    switch (res.data[0].state){
                        case 'online':
                            res.data[0].cellClassName = {state: 'state-online'};
                            break;
                        case 'stopped':
                            res.data[0].cellClassName = {state: 'state-stopped'};
                            break;
                        default:
                            res.data[0].cellClassName = {state: 'state-info'};
                    }
                    this.pm2_out_log_interval = setInterval(() => {
                        this.getOutLogs(res.data[0].pm2_env.pm_out_log_path);
                    }, 5000);
                    this.pm2_err_log_interval = setInterval(() => {
                        this.getErrLogs(res.data[0].pm2_env.pm_err_log_path);
                    }, 5000);
                    this.pm2_list.push(res.data[0]);
                }
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
            boxStart (){
                let self = this;
                this.loading = true;
                this.$http.get('/api/box_start').then((res) => {
                    self.loading = false;
                    if (res.data.length > 0){
                        res.data[0].pid = res.data[0].process.pid;
                        res.data[0].name = res.data[0].pm2_env.npm_package_name;
                        res.data[0].state = res.data[0].pm2_env.status;
                        res.data[0].mode = res.data[0].pm2_env.exec_mode;
                        res.data[0].created_time = new Date(parseInt(res.data[0].pm2_env.created_at)).toLocaleString();
                        switch (res.data[0].state){
                            case 'online':
                                res.data[0].cellClassName = {state: 'state-online'};
                                break;
                            case 'stopped':
                                res.data[0].cellClassName = {state: 'state-stopped'};
                                break;
                            default:
                                res.data[0].cellClassName = {state: 'state-info'};
                        }
                        this.pm2_out_log_interval = setInterval(() => {
                            this.getOutLogs(res.data[0].pm2_env.pm_out_log_path);
                        }, 1000);
                        this.pm2_err_log_interval = setInterval(() => {
                            this.getErrLogs(res.data[0].pm2_env.pm_err_log_path);
                        }, 1000);
                        this.pm2_list.push(res.data[0]);
                        this.$Message.success('服务启动成功');
                    }else{
                        this.$Message.success('服务启动失败');
                    }
                }).catch((err) => {
                    console.error(err);
                    this.$Message.error('服务启动失败:' + JSON.stringify(err.response.data));
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
                    if (res.data.length>0){
                        this.pm2_err_logs = [];
                        for(let i=0; i<res.data.length; i++) {
                            this.pm2_err_logs.push(res.data[i]);
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
                    if (res.data.length>0){
                        this.pm2_out_logs = [];
                        for(let i=0; i<res.data.length; i++) {
                            this.pm2_out_logs.push(res.data[i]);
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
                this.setInitStep({init_step: 'finished'});
                this.$router.push('/');
            }
        }
    };
</script>