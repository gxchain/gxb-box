<style scoped>
    .ivu-btn {
        margin: 15px 0;
    }

    .server-status{
        margin-bottom: 10px;
    }

    .logs-box{
        border: 1px solid #eee;
        border-radius: 6px;
        margin-bottom: 20px;
        position: relative;
        transition: all .2s ease-in-out;
    }


    .log-header {
        font-weight: 500;
        height: 40px;
        line-height: 40px;
        position: relative;
        background-color: #f8f8f9;
        border-bottom: 1px solid #e9eaec;
    }

    .log-box {
        padding: 0 20px;
        margin: 10px 0;
        text-align: left;
        height: 200px;
        overflow-y: auto;
    }

    .log-box .out{
        color: #19be6b
    }

    .log-box .err{
        color: #ed3f14
    }

    .split {
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        border: 1px dashed #eee;
    }

    .spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
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
        <Alert type="info">
            启动数据盒子服务前，请检查服务器环境是否已全局安装
            <a href="http://pm2.keymetrics.io/docs/usage/quick-start/" target="_blank">PM2</a>
        </Alert>
        <div class="server-status">
            <Table stripe :columns="pm2_columns" :data="pm2_list" v-show="pm2_list.length > 0"></Table>
        </div>
        <div class="server-logs" v-show="pm2_list.length > 0">
            <Row class="logs-box">
                <Col span="12">
                    <header class="log-header">Out</header>
                    <div class="log-box">
                        <Spin fix v-show="pm2_out_logs.length == 0">
                            <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
                            <div>Loading</div>
                        </Spin>
                        <ul>
                            <li v-for="(log,index) in pm2_out_logs" :key="index">
                                <span class="out">ID:{{log.pm_id}}</span>
                                <span class="out">|</span>
                                <span>{{log.tip}}</span>
                            </li>
                        </ul>
                    </div>
                </Col>
                <div class="split"></div>
                <Col span="12">
                    <header class="log-header">Error</header>
                    <div class="log-box">
                        <Spin fix v-show="pm2_err_logs.length == 0">
                            <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
                            <div>Loading</div>
                        </Spin>
                        <ul>
                            <li v-for="(log,index) in pm2_err_logs" :key="index">
                                <span class="err">ID:{{log.pm_id}}</span>
                                <span class="err">|</span>
                                <span>{{log.tip}}</span>
                            </li>
                        </ul>
                    </div>
                </Col>
            </Row>
        </div>
        <div class="service-btn-box" v-if="pm2_list.length === 0">
            <Button type="primary"  @click="boxStart()" :loading="loading">
                <span v-if="!loading">启动服务</span>
                <span v-else>启动中...</span>
            </Button>
            <Button type="primary" @click="lastStep()">上一步</Button>
        </div>
        <div class="step-btn-box" v-else>
            <Button type="primary" @click="lastStep()">上一步</Button>
            <Button type="primary" @click="goToMarket()">完成</Button>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                loading: false,
                pm2_columns: [
                    {
                        title: 'PM2-ID',
                        key: 'pm_id'
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
                pm2_out_logs: [],
                pm2_err_logs: []
            };
        },
        created() {
            this.$http({
                method: 'get',
                url: '/api/fetch_box_list',
            }).then((res) => {
                if (res.data.length > 0){
                    for(let i=0; i<res.data.length; i++){
                        res.data[i].state = res.data[i].pm2_env.status;
                        res.data[i].mode = res.data[i].pm2_env.exec_mode;
                        res.data[i].created_time = new Date(parseInt(res.data[i].pm2_env.created_at)).toLocaleString();
                        switch (res.data[i].state){
                            case 'online':
                                res.data[i].cellClassName = {state: 'state-online'};
                                break;
                            case 'stopped':
                                res.data[i].cellClassName = {state: 'state-stopped'};
                                break;
                            default:
                                res.data[i].cellClassName = {state: 'state-info'};
                        }
                        this.pm2_out_log_interval = setInterval(() => {
                            this.getOutLogs(res.data[i].pm_id, res.data[i].pm2_env.pm_out_log_path);
                        }, 5000);
                        this.pm2_err_log_interval = setInterval(() => {
                            this.getErrLogs(res.data[i].pm_id, res.data[i].pm2_env.pm_err_log_path);
                        }, 5000);
                        this.pm2_list.push(res.data[i]);
                    }
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
            boxStart (){
                let self = this;
                this.loading = true;
                this.$http.get('/api/box_start').then((res) => {
                    self.loading = false;
                    if (res.data.length > 0){
                        for(let i=0; i<res.data.length; i++){
                            res.data[i].pm_id = res.data[i].pm2_env.pm_id;
                            res.data[i].name = res.data[i].pm2_env.npm_package_name;
                            res.data[i].state = res.data[i].pm2_env.status;
                            res.data[i].mode = res.data[i].pm2_env.exec_mode;
                            res.data[i].created_time = new Date(parseInt(res.data[i].pm2_env.created_at)).toLocaleString();
                            switch (res.data[i].state){
                                case 'online':
                                    res.data[i].cellClassName = {state: 'state-online'};
                                    break;
                                case 'stopped':
                                    res.data[i].cellClassName = {state: 'state-stopped'};
                                    break;
                                default:
                                    res.data[i].cellClassName = {state: 'state-info'};
                            }
                            this.pm2_out_log_interval = setInterval(() => {
                                this.getOutLogs(res.data[i].pm_id, res.data[i].pm2_env.pm_out_log_path);
                            }, 1000);
                            this.pm2_err_log_interval = setInterval(() => {
                                this.getErrLogs(res.data[i].pm_id, res.data[i].pm2_env.pm_err_log_path);
                            }, 1000);
                            this.pm2_list.push(res.data[i]);
                        }
                        this.$Message.success('服务启动成功');
                    }else{
                        this.$Message.success('服务启动失败');
                    }
                }).catch((err) => {
                    console.error(err);
                    this.$Message.success('服务启动失败');
                });
            },
            getErrLogs (pm_id, path) {
                this.$http({
                    method: 'post',
                    url: '/api/fetch_log',
                    data: {
                        'pm_id': pm_id,
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
                });
            },
            getOutLogs (pm_id, path) {
                this.$http({
                    method: 'post',
                    url: '/api/fetch_log',
                    data: {
                        'pm_id': pm_id,
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
                });
            },
            lastStep (){
                this.$emit('last');
            },
            goToMarket (){
                this.$router.push('/');
            }
        }
    };
</script>