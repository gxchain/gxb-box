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
        margin-left: 20%;
    }

    .init .operation-box{
        width: 45%;
        margin: 0 auto;
        margin-top: 50px;
    }

    .init .operation-box .ivu-form-item{
        text-align: center;
    }

    .init .step-btn {
        text-align: center;
        margin-top: 50px;
    }

</style>
<template>
    <div class="init">
        <Row type="flex" justify="center" align="middle">
            <Col span="24">
                <div class="layout-content-main">
                    <h1><img src="/static/img/init.svg"></h1>
                    <h2><p>{{$t('init.welcome')}}</p></h2>
                    <div class="step-box">
                        <Steps :current="current">
                            <Step :title="$t('init.step') + '1'" :content="$t('init.step1')"></Step>
                            <Step :title="$t('init.step') + '2'" :content="$t('init.step2')"></Step>
                            <Step :title="$t('init.step') + '3'" :content="$t('init.step3')"></Step>
                        </Steps>
                    </div>
                    <div class="operation-box">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                            <FormItem label="账号" prop="account_name">
                                <Input v-model="formValidate.account_name" placeholder="sample_user"></Input>
                            </FormItem>
                            <FormItem label="私钥" prop="private_key">
                                <Input v-model="formValidate.private_key" placeholder="5Ka9YjFQtfUUX2DdnqkaPWH1rVeSeby7Cj2VdjRt79S9kKLvXR7"></Input>
                            </FormItem>
                            <FormItem label="回调地址" prop="callback_url">
                                <Input v-model="formValidate.callback_url" placeholder="http://localhost:3000/demo/callback"></Input>
                            </FormItem>
                            <FormItem label="请求超时" prop="privacy_request_timeout">
                                <Input v-model="formValidate.privacy_request_timeout" placeholder="120000"></Input>
                            </FormItem>
                            <FormItem label="默认超时" prop="default_timeout">
                                <Input v-model="formValidate.default_timeout" placeholder="8000"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="handleSubmit('formValidate')">{{$t('init.stepBtn')}}</Button>
                                <Button type="ghost" @click="sign">{{$t('init.signBtn')}}</Button>
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    export default {
        data () {
            return {
                current: 0,
                formValidate: {
                    account_name: '',
                    private_key: '',
                    callback_url: '',
                    privacy_request_timeout: 120000,
                    default_timeout: 8000
                },
                ruleValidate: {
                    account_name: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    private_key: [
                        {required: true, message: '私钥不能为空', trigger: 'blur'}
                    ],
                    callback_url: [
                        {required: true, message: '回调地址不能为空', trigger: 'blur'}
                    ],
                    privacy_request_timeout: [
                        { type: 'integer', message: '只能输入数字', trigger: 'blur' }
                    ],
                    default_timeout: [
                        { type: 'integer', message: '只能输入数字', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            ...mapActions({
                setAccount: 'setAccount'
            }),
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/config',
                            data: this.formValidate
                        }).then((res) => {
                            localStorage.setItem('account',JSON.stringify(this.formValidate));
                            this.setAccount({account: this.formValidate});
                            this.$Message.success(res.data.message);
                        }).catch((err) => {
                            this.$Message.error(err);
                        });
//                        if (this.current == 4) {
//                            this.current = 0;
//                        } else {
//                            this.current += 1;
//                        }
                    } else {
                        this.$Message.error('验证失败');
                    }
                });
            },
            sign () {
                alert('创建账号');
            }
        },
        computed: {
            ...mapGetters({
                account: 'account'
            }),
        }
    };
</script>