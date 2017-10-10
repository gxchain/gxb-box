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
        margin-left: 18%;
    }

    .init .operation-box{
        width: 45%;
        margin: 0 auto;
        margin-top: 50px;
    }

    .init .operation-box .ivu-form-item{
        text-align: center;
    }

    .init .step-box-1, .init .step-box-2, .init .step-box-3, .init .step-box-4{
        text-align: center;
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
                            <Step title="步骤1" content="账号配置"></Step>
                            <Step title="步骤2" content="商户/数据源认证"></Step>
                            <Step title="步骤3" content="启动数据盒子"></Step>
                            <Step title="步骤4" content="接口调试"></Step>
                        </Steps>
                    </div>
                    <div class="operation-box">
                        <div class="step-box-1" v-show="(current === 0) ? true : false">
                            <AccountSetting/>
                        </div>
                        <div class="step-box-2" v-show="(current === 1) ? true : false">
                            <AccountCertification/>
                        </div>
                        <div class="step-box-3" v-show="(current === 2) ? true : false">
                            <BoxStart/>
                        </div>
                        <div class="step-box-4" v-show="(current === 3) ? true : false">
                            <p>接口测试</p>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import AccountSetting from './components/AccountSetting.vue';
    import AccountCertification from './components/AccountCertification.vue';
    import BoxStart from './components/BoxStart.vue';

    export default {
        data () {
            return {
                current: localStorage.getItem('init_step') ? Number(localStorage.getItem('init_step')) : 0,
            };
        },
        components: {
            AccountSetting: AccountSetting,
            AccountCertification: AccountCertification,
            BoxStart: BoxStart
        }
    };
</script>