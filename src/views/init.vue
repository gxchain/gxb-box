<style scoped>
    .init {
        width: 100%;
        min-height: 800px;
    }

    .init h1 {
        margin-top: 50px;
        height: 150px;
    }

    .init h1 img {
        width: 100%;
        height: 100%;
        -webkit-transform: rotate(360deg);
        animation: rotation 5s linear infinite;
        -moz-animation: rotation 5s linear infinite;
        -webkit-animation: rotation 5s linear infinite;
        -o-animation: rotation 5s linear infinite;
    }

    @-webkit-keyframes rotation {
        from {
            -webkit-transform: rotate(0deg);
        }
        to {
            -webkit-transform: rotate(360deg);
        }
    }

    .init h2 {
        color: #666;
        margin-top: 25px;
        text-align: center;
    }

    .init h2 p {
        margin: 0 0 50px;
    }

    .init .step-box{
        width: 80%;
        margin-left: 15%;
    }

    .init .operation-box{
        width: 45%;
        margin: 0 auto;
        margin-top: 50px;
    }

    .init .operation-box .ivu-form-item{
        text-align: center;
    }

    .init .step-box-1, .init .step-box-2, .init .step-box-3, .init .step-box-4,.init .step-box-5{
        text-align: center;
    }

    .init .step-box-1 .ivu-btn {
        margin: 0 5px 20px 0;
    }
</style>
<template>
    <div class="init">
        <Row type="flex" justify="center" align="middle">
            <Col span="24">
                <div class="layout-content-main">
                    <h1><img src="/static/img/init.svg"></h1>
                    <h2><p>欢迎使用GXB-BOX!</p></h2>
                    <div class="step-box">
                        <Steps :current="current">
                            <Step title="步骤1" content="选择商户/数据源"></Step>
                            <Step title="步骤2" content="创建/导入账号"></Step>
                            <Step title="步骤3" content="账号认证"></Step>
                            <Step title="步骤4" content="账号配置"></Step>
                            <Step title="步骤5" content="启动数据盒子"></Step>
                        </Steps>
                    </div>
                    <div class="operation-box">
                        <div class="step-box-1" v-if="(current === 0) ? true : false">
                            <div class="account-type">
                                <Alert type="info">商户指数据买方，在公信链上是购买数据的角色。</Alert>
                                <Button type="primary" @click="changeType('merchant')">申请成为商户</Button>
                                <Alert type="info">数据源指数据卖方，在公信链上是出售数据的角色。</Alert>
                                <Button type="primary" @click="changeType('datasource')">申请成为数据源</Button>
                            </div>
                        </div>
                        <div class="step-box-2" v-if="(current === 1) ? true : false">
                            <AccountCreate v-on:last="lastStep" v-on:next="nextStep" :account_type="account_type"></AccountCreate>
                        </div>
                        <div class="step-box-3" v-if="(current === 2) ? true : false">
                            <AccountCertification v-on:last="lastStep" v-on:next="nextStep" :account_type="account_type"></AccountCertification>
                        </div>
                        <div class="step-box-4" v-if="(current === 3) ? true : false">
                            <AccountSetting v-on:last="lastStep" v-on:next="nextStep" :account_type="account_type"></AccountSetting>
                        </div>
                        <div class="step-box-5" v-if="(current === 4) ? true : false">
                            <BoxInitStart v-on:last="lastStep" v-on:next="nextStep"></BoxInitStart>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import AccountCreate from './components/AccountCreate.vue';
    import AccountSetting from './components/AccountSetting.vue';
    import AccountCertification from './components/AccountCertification.vue';
    import BoxInitStart from './components/BoxInitStart.vue';

    export default {
        data () {
            return {
                current: localStorage.getItem('init_step') ? Number(localStorage.getItem('init_step')) : 0,
                account_type: localStorage.getItem('account_type') ? localStorage.getItem('account_type') : '',
            };
        },
        methods: {
            ...mapActions({
                setAccount: 'setAccount'
            }),
            changeType (type){
                this.account_type = type;
                localStorage.setItem('account_type',type);
                this.$http.get('/api/fetch_config/' + type).then((res) => {
                    if (res.data.account_name){
                        this.setAccount({account: res.data});
                    }else{
                        this.setAccount({account: null});
                    }
                    this.nextStep();
                }).catch((err)=> {
                    console.error(err);
                });
            },
            lastStep (){
                this.current -= 1;
            },
            nextStep (){
                this.current += 1;
                localStorage.setItem('init_step',this.current);
            }
        },
        components: {
            AccountCreate: AccountCreate,
            AccountSetting: AccountSetting,
            AccountCertification: AccountCertification,
            BoxInitStart: BoxInitStart,
        },
        computed: {
            ...mapGetters({
                account: 'account',
                certified: 'certified'
            }),
        }
    };
</script>