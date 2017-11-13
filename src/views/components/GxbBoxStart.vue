<style scoped>
    .box-start {
        width: 100%;
        height: 100%;
    }
    .step-btn-box {
        margin: 25px 0;
    }
</style>
<template>
    <div class="box-start">
        <Alert type="info">
            启动数据盒子服务前，请检查服务器环境是否已全局安装
            <a href="http://pm2.keymetrics.io/docs/usage/quick-start/" target="_blank">PM2</a>
        </Alert>
        <div class="step-btn-box">
            <Button type="primary"  @click="boxStart()" :loading="loading">
                <span v-show="!loading">启动服务</span>
                <span v-show="loading">启动中...</span>
            </Button>
            <Button type="primary" @click="lastStep()">上一步</Button>
        </div>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    import Handler from '../../libs/handler';

    export default {
        data () {
            return {
                loading: false,
            };
        },
        methods: {
            ...mapActions({
                setInitStep: 'setInitStep'
            }),
            boxStart (){
                this.loading = true;
                this.$http.get('/api/box_start').then((res) => {
                    if (res.data && res.data.length && res.data.length > 0){
                        this.setInitStep({init_step: 'finished'});
                        this.goToConsole();
                    }else{
                        this.$Message.error('服务启动失败:未知错误');
                    }
                    this.loading = false;
                }).catch((err) => {
                    this.$Message.error('服务启动失败:' + Handler.error(err));
                });
            },
            lastStep (){
                this.$emit('last');
            },
            goToConsole (){
                this.$router.push('/console');
            }
        }
    };
</script>