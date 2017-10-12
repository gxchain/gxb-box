<style scoped>
    .ivu-btn {
        margin: 0 5px 20px 0;
    }
    .ivu-btn.no-margin{
        margin: 0;
    }
</style>
<template>
    <div class="account-setting">
        <div class="merchant" v-if="account_type === 'merchant'">
            <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="80">
                <FormItem label="账号" prop="account_name">
                    <Input v-model="formValidate1.account_name" placeholder="sample_user"></Input>
                </FormItem>
                <FormItem label="私钥" prop="private_key">
                    <Input v-model="formValidate1.private_key" placeholder="5Ka9YjFQtfUUX2DdnqkaPWH1rVeSeby7Cj2VdjRt79S9kKLvXR7"></Input>
                </FormItem>
                <FormItem label="回调地址" prop="callback_url">
                    <Input v-model="formValidate1.callback_url" placeholder="http://localhost:3000/demo/callback"></Input>
                </FormItem>
                <FormItem label="请求超时" prop="privacy_request_timeout">
                    <Input v-model="formValidate1.privacy_request_timeout" placeholder="120000"></Input>
                </FormItem>
                <FormItem label="默认超时" prop="default_timeout">
                    <Input v-model="formValidate1.default_timeout" placeholder="8000"></Input>
                </FormItem>
            </Form>
            <div class="step-btn-box">
                <Button type="primary" @click="lastStep()">上一步</Button>
                <Button type="primary" @click="handleSubmit1('formValidate1')">下一步</Button>
            </div>
        </div>
        <div class="datasource" v-if="account_type === 'datasource'">
            <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="80">
                <FormItem label="账号" prop="account_name">
                    <Input v-model="formValidate2.account_name" placeholder="sample_user"></Input>
                </FormItem>
                <FormItem label="私钥" prop="private_key">
                    <Input v-model="formValidate2.private_key" placeholder="5Ka9YjFQtfUUX2DdnqkaPWH1rVeSeby7Cj2VdjRt79S9kKLvXR7"></Input>
                </FormItem>
                <FormItem label="接口地址" prop="service">
                    <Input v-model="formValidate2.service" placeholder="http://localhost:3000/demo/call"></Input>
                </FormItem>
                <FormItem
                        v-for="(item, index) in formValidate2.subscribed_data_product"
                        :key="index"
                        :label="'产品ID-' + (index + 1)">
                    <Row>
                        <Col span="18">
                        <span>{{item}}</span>
                        </Col>
                        <Col span="4" offset="1">
                        <Button type="ghost" @click="handleRemove(index)" class="no-margin">删除</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Row>
                        <Col span="12">
                        <Input type="text" v-model="product_id" placeholder="请输入产品ID"></Input>
                        </Col>
                        <Col span="10" offset="2">
                        <Button type="dashed" long @click="handleAdd" icon="plus-round" class="no-margin">新增</Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
            <div class="step-btn-box">
                <Button type="primary" @click="lastStep()">上一步</Button>
                <Button type="primary" @click="handleSubmit2('formValidate2')">下一步</Button>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    export default {
        props: ['account_type'],
        data () {
            return {
                formValidate1: {
                    account_name: '',
                    private_key: '',
                    callback_url: '',
                    privacy_request_timeout: 120000,
                    default_timeout: 8000
                },
                ruleValidate1: {
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
                },
                product_id: '',
                formValidate2: {
                    account_name: '',
                    private_key: '',
                    service: '',
                    subscribed_data_product: []
                },
                ruleValidate2: {
                    account_name: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    private_key: [
                        {required: true, message: '私钥不能为空', trigger: 'blur'}
                    ],
                    service: [
                        {required: true, message: '接口地址不能为空', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            ...mapActions({
                setAccount: 'setAccount'
            }),
            handleSubmit1 (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/config/1',
                            data: this.formValidate1
                        }).then((res) => {
                            localStorage.setItem('account',JSON.stringify(this.formValidate1));
                            this.setAccount({account: this.formValidate1});
                            this.$Message.success(res.data.message);
                            this.$emit('next');
                        }).catch((err) => {
                            console.error(err);
                            this.$Message.error('提交失败');
                        });
                    } else {
                        this.$Message.error('验证失败');
                    }
                });
            },
            handleSubmit2 (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/config/2',
                            data: this.formValidate2
                        }).then((res) => {
                            localStorage.setItem('account',JSON.stringify(this.formValidate2));
                            this.setAccount({account: this.formValidate2});
                            this.$Message.success(res.data.message);
                            this.$emit('next');
                        }).catch((err) => {
                            console.error(err);
                            this.$Message.error('提交失败');
                        });
                    } else {
                        this.$Message.error('验证失败');
                    }
                });
            },
            handleAdd () {
                this.formValidate2.subscribed_data_product.push(this.product_id);
                this.product_id = '';
            },
            handleRemove (index) {
                this.formValidate2.subscribed_data_product.splice(index, 1);
            },
            lastStep (){
                this.$emit('last');
            },
        },
        computed: {
            ...mapGetters({
                account: 'account'
            }),
        }
    };
</script>