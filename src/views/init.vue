<style scoped>
    .init {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .init h1 {
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
        margin: 25px 0 50px 0;
        text-align: center;
    }

    .init .step-box{
        width: 80%;
        margin-left: 15%;
    }

    .init .operation-box{
        width: 65%;
        margin: 50px auto 0;
    }

    .init .operation-box{
        text-align: center;
    }

    .init .operation-box .ivu-form-item{
        text-align: center;
    }

</style>
<template>
    <div class="init">
        <div class="layout-content-main">
            <h1><img src="/static/img/init.svg"></h1>
            <h2>欢迎使用GXB-BOX!</h2>
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
                <div v-bind:is="list[current]"
                     v-on:last="lastStep"
                     v-on:next="nextStep"
                     scene="init"
                ></div>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import AccountType from './components/AccountType.vue';
    import AccountCreate from './components/AccountCreate.vue';
    import AccountConfig from './components/AccountConfig.vue';
    import AccountCertification from './components/AccountCertification.vue';
    import GxbBoxStart from './components/GxbBoxStart.vue';

    export default {
        data () {
            return {
                loading: false,
                current: 0,
                list:{
                    0: 'AccountType',
                    1: 'AccountCreate',
                    2: 'AccountCertification',
                    3: 'AccountConfig',
                    4: 'GxbBoxStart'
                }
            };
        },
        created() {
            if (this.init_step !== 'finished'){
                this.current = Number(this.init_step);
            }else{
                this.$router.push('/');
            }
        },
        methods: {
            ...mapActions({
                setInitStep: 'setInitStep',
            }),
            lastStep (){
                this.current -= 1;
            },
            nextStep (){
                this.current += 1;
                this.setInitStep({init_step: this.current});
            }
        },
        components: {
            AccountType: AccountType,
            AccountCreate: AccountCreate,
            AccountConfig: AccountConfig,
            AccountCertification: AccountCertification,
            GxbBoxStart: GxbBoxStart
        },
        computed: {
            ...mapGetters({
                account_type: 'account_type',
                init_step: 'init_step'
            }),
        }
    };
</script>