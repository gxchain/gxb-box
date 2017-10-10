<style scoped>
    .ivu-btn {
        margin: 15px 0;
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
        <Button type="primary"  @click="boxStart()" :loading="loading" v-if="pm2_list.length === 0">
            <span v-if="!loading">启动服务</span>
            <span v-else>启动中...</span>
        </Button>
        <Button type="primary" @click="nextStep()" v-else>下一步</Button>
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
                        key: 'id'
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
                pm2_list: []
            };
        },
        methods: {
            boxStart (){
                let self = this;
                this.loading = true;
                this.$http({
                    method: 'get',
                    url: '/api/box_start',
                }).then((res) => {
                    self.loading = false;
                    if (res.data.length > 0){
                        for(let i=0; i<res.data.length; i++){
                            res.data[i].id = res.data[i].pm2_env.pm_id;
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
                            this.pm2_list.push(res.data[i]);
                        }
                        localStorage.setItem('init_step',3);
                        this.$Message.success('服务启动成功');
                    }else{
                        this.$Message.success('服务启动失败');
                    }
                }).catch((err) => {
                    console.error(err);
                    this.$Message.success('服务启动失败');
                });
            },
            nextStep (){
                this.current += 1;
            }
        }
    };
</script>