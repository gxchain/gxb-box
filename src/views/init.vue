<style scoped>
    .init {
        width: 100%;
        height: 800px;
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

    .init .step-box{
        width: 50%;
        margin: 0 auto;
        margin-top: 50px;
    }

    .init .step-btn {
        text-align: center;
        margin-top: 50px;
    }

    .init h2 {
        color: #666;
        margin-top: 50px;
        text-align: center;
    }

    .init h2 p {
        margin: 0 0 50px;
    }

    .init .ivu-row-flex {
        height: 100%;
    }

    @-webkit-keyframes rotation{
        from {-webkit-transform: rotate(0deg);}
        to {-webkit-transform: rotate(360deg);}
    }

</style>
<template>
    <div class="init">
        <Row type="flex" justify="center" align="middle">
            <Col span="24">
                <h1><img src="/static/img/init.svg"></h1>
                <h2><p>{{$t('init.welcome')}}</p></h2>
                <div class="step-box">
                    <Steps :current="current">
                        <Step :title="$t('init.step') + '1'" :content="$t('init.step1')"></Step>
                        <Step :title="$t('init.step') + '2'" :content="$t('init.step2')"></Step>
                        <Step :title="$t('init.step') + '3'" :content="$t('init.step3')"></Step>
                        <Step :title="$t('init.step') + '4'" :content="$t('init.step4')"></Step>
                    </Steps>
                </div>
                <div class="step-btn">
                    <Button type="primary" @click="next">{{$t('init.initBtn')}}</Button>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                current: 0
            }
        },
        methods: {
            next () {
                if (this.current == 4) {
                    this.current = 0;
                } else {
                    this.current += 1;
                }
            }
        }
    }
</script>