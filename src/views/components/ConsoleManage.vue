<style scoped>
    .console-manage {
        width: 100%;
        height: 100%;
    }

    .spin-container{
        display: inline-block;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .loaded-container{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .server-status{
        height: 90px;
        margin-bottom: 15px;
    }

    .server-logs{
        flex: 1;
        border: 1px solid #dddee1;
        position: relative;
        transition: all .2s ease-in-out;
        display: flex;
        flex-direction: column;
    }

    .server-logs .log-header {
        text-align: left;
        padding-left: 10px;
        font-weight: 500;
        height: 40px;
        line-height: 40px;
        position: relative;
        background-color: #f8f8f9;
        border-bottom: 1px solid #e9eaec;
    }

    .server-logs .log-box {
        flex: 1;
        height:0;
        padding-top: 5px;
        text-align: left;
        overflow-y: auto;
        background: #333;
        color: #fff;
    }

    .server-logs .log-box .out{
        color: #19be6b
    }

    .server-logs .log-box .err{
        color: #ed3f14
    }

    .server-logs .log-box ul:after {
        content: "\2590";
        -webkit-animation: blinker 1s linear infinite;
        -moz-animation: blinker 1s linear infinite;
        animation: blinker 1s linear infinite;
    }
    .server-logs .log-box ul li {
        font-size: 12px;
        background-color: transparent;
        color: #FFF;
        line-height: 1.4;
        white-space: pre;
        padding: 1px 5px;
        font-family: monospace;
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
        <div class="loaded-container" v-show="loaded">
            <div class="server-status" v-show="pm2_list.length > 0">
                <Table stripe :columns="pm2_columns" :data="pm2_list"></Table>
            </div>
            <div class="server-logs" v-show="pm2_list.length > 0">
                <header class="log-header">日志</header>
                <div class="log-box" id="scroll-box">
                    <ul>
                        <li v-for="(log, index) in pm2_logs" :key="index">
                            <span :class="log.type">[{{log.type}}]|{{pm2_list[0].name}}</span>
                            <span :class="log.type">  | </span>
                            <span :class="log.type === 'err' ? 'err' : ''">{{log.tip}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
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
                                            loading: this.loading[0],
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
                                            loading: this.loading[1],
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
                                            loading: this.loading[1],
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
                pm2_logs: [],
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
        methods: {
            boxRender (data){
                let pm2 = {};
                pm2.pid = data.pid;
                pm2.pm_id = data.pm_id;
                pm2.name = data.name;
                pm2.mode = data.pm2_env.exec_mode;
                pm2.restarts = data.pm2_env.restart_time;
                pm2.pm_uptime = data.pm2_env.pm_uptime;
                pm2.cpu = data.monit.cpu + '%';
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
            },
            boxStop (){
                this.loading[0] = true;
                this.$http.get('/api/box_stop').then((res) => {
                    if (res.data && res.data.length && res.data.length > 0){
                        this.pm2_status = false;
                        this.boxRender(res.data[0]);
                    }else{
                        this.$Message.success('服务停止失败:未知错误');
                    }
                    this.loading[0] = false;
                }).catch((err) => {
                    console.error(err);
                    this.$Message.error('服务停止失败:' + JSON.stringify(err.response.data));
                });
            },
            boxRestart (){
                this.loading[1] = true;
                this.$http.get('/api/box_restart').then((res) => {
                    if (res.data && res.data.length && res.data.length > 0){
                        this.pm2_status = true;
                        this.boxRender(res.data[0]);
                    }else{
                        this.$Message.success('服务重启失败:未知错误');
                    }
                    this.loading[1] = false;
                }).catch((err) => {
                    console.error(err);
                    this.$Message.error('服务重启失败:' + JSON.stringify(err.response.data));
                });
            }
        },
        socket: {
            events: {
                message(type, msg) {
                    let msg_list = msg.split('\n');
                    for (let i=0; i < msg_list.length; i++){
                        if (msg_list[i] !== ''){
                            this.pm2_logs.push({
                                type: type,
                                tip: msg_list[i]
                            });
                        }
                    }
                    //滚动到底部
                    if (document.getElementById('scroll-box')){
                        setTimeout(function () {
                            document.getElementById('scroll-box').scrollTop = document.getElementById('scroll-box').scrollHeight;
                        },500);
                    }
                },
                system(data) {
                    this.boxRender(data[0]);
                }
            }
        }
    };
</script>