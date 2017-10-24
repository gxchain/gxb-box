<style scoped>
    .ivu-btn {
        margin: 0 5px 20px 0;
    }
    .ivu-btn.no-margin {
        margin: 0;
    }
    .ivu-input-number {
        width: 100%;
    }
    .split-line {
        height: 1px;
        width: 100%;
        margin-bottom: 20px;
        border-top: 1px solid #e2e2e2;
        text-align: center;
    }
    .txt{
        position: relative;
        top:-8px;
        background: #fff;
        display: inline-block;
    }
</style>
<style>
    .account_input .ivu-input{
        text-transform: lowercase;
    }
</style>
<template>
    <div class="account-setting">
        <div class="merchant" v-if="account_type === 'merchant'">
            <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="100">
                <FormItem label="账号" prop="account_name">
                    <Input v-model="formValidate1.account_name" placeholder="sample_user" class="account_input"></Input>
                </FormItem>
                <FormItem label="私钥" prop="private_key">
                    <div @click="changeShowType()" style="cursor: pointer"><Icon class="ivu-input-icon" type="eye"></Icon></div>
                    <Input :type="show_type" v-model="formValidate1.private_key" placeholder="请输入账户私钥"></Input>
                </FormItem>
                <FormItem label="回调地址" prop="callback_url">
                    <Input v-model="formValidate1.callback_url" placeholder="http://localhost:3000/demo/callback"></Input>
                </FormItem>
                <FormItem label="请求超时/毫秒" prop="privacy_request_timeout">
                    <InputNumber v-model="formValidate1.privacy_request_timeout" placeholder="120000"></InputNumber>
                </FormItem>
                <FormItem label="默认超时/毫秒" prop="default_timeout">
                    <InputNumber v-model="formValidate1.default_timeout" placeholder="8000"></InputNumber>
                </FormItem>
            </Form>
            <div class="step-btn-box" v-if="scene === 'init'">
                <Button type="primary" @click="lastStep()">上一步</Button>
                <Button type="primary" @click="handleSubmit1('formValidate1')">下一步</Button>
            </div>
            <div class="save-btn-box" v-else>
                <Button type="primary" @click="handleSubmit1('formValidate1')">保存</Button>
            </div>
        </div>
        <div class="datasource" v-if="account_type === 'datasource'">
            <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="100">
                <FormItem label="账号" prop="account_name">
                    <Input v-model="formValidate2.account_name" placeholder="sample_user" class="account_input"></Input>
                </FormItem>
                <FormItem label="私钥" prop="private_key">
                    <div @click="changeShowType()" style="cursor: pointer"><Icon class="ivu-input-icon" type="eye"></Icon></div>
                    <Input :type="show_type" v-model="formValidate2.private_key" placeholder="请输入账户私钥"></Input>
                </FormItem>
                <div class="split-line"><span class="txt">数据源（出售数据）</span></div>
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
                        <Input v-model="product_id" placeholder="请输入产品ID"></Input>
                        </Col>
                        <Col span="10" offset="2">
                        <Button type="dashed" long @click="handleAdd" icon="plus-round" class="no-margin">新增</Button>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="商户功能">
                    <i-switch v-model="is_merchant_open" size="large" style="float:right">
                        <span slot="open">开启</span>
                        <span slot="close">关闭</span>
                    </i-switch>
                </FormItem>
                <div class="merchant_config" v-if="is_merchant_open">
                    <div class="split-line"><span class="txt">商户（购买数据）</span></div>
                    <FormItem label="回调地址" prop="callback_url">
                        <Input v-model="formValidate2.callback_url" placeholder="http://localhost:3000/demo/callback"></Input>
                    </FormItem>
                    <FormItem label="请求超时/毫秒" prop="privacy_request_timeout">
                        <InputNumber v-model="formValidate2.privacy_request_timeout" placeholder="120000"></InputNumber>
                    </FormItem>
                    <FormItem label="默认超时/毫秒" prop="default_timeout">
                        <InputNumber v-model="formValidate2.default_timeout" placeholder="8000"></InputNumber>
                    </FormItem>
                </div>
            </Form>
            <div class="step-btn-box" v-if="scene === 'init'">
                <Button type="primary" @click="lastStep()">上一步</Button>
                <Button type="primary" @click="handleSubmit2('formValidate2')">下一步</Button>
            </div>
            <div class="save-btn-box" v-else>
                <Button type="primary" @click="handleSubmit2('formValidate2')">保存</Button>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    export default {
        props: ['account_type','scene'],
        data () {
            return {
                show_type: 'password',
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
                        {required: true, type: 'url', message: '回调地址必须为URL', trigger: 'blur'}
                    ],
                    privacy_request_timeout: [
                        {required: true, type: 'integer', message: '只能输入数字', trigger: 'blur'}
                    ],
                    default_timeout: [
                        {required: true, type: 'integer', message: '只能输入数字', trigger: 'blur'}
                    ]
                },
                product_id: '',
                is_merchant_open: false,
                formValidate2: {
                    account_name: '',
                    private_key: '',
                    callback_url: '',
                    privacy_request_timeout: 120000,
                    default_timeout: 8000,
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
                    callback_url: [
                        {required: true, type: 'url', message: '回调地址必须为URL', trigger: 'blur'}
                    ],
                    privacy_request_timeout: [
                        {required: true, type: 'integer', message: '只能输入数字', trigger: 'blur' }
                    ],
                    default_timeout: [
                        {required: true, type: 'integer', message: '只能输入数字', trigger: 'blur' }
                    ],
                    service: [
                        {required: true, type: 'url', message: '接口地址必须为URL', trigger: 'blur'}
                    ]
                }
            };
        },
        created (){
            if (this.account){
                if (this.account_type === 'merchant'){
                    this.formValidate1.account_name = this.account.account_name;
                    this.formValidate1.private_key = this.account.private_key;
                    this.formValidate1.callback_url = this.account.callback_url;
                    this.formValidate1.privacy_request_timeout = this.account.privacy_request_timeout ? this.account.privacy_request_timeout : 120000;
                    this.formValidate1.default_timeout = this.account.default_timeout ? this.account.default_timeout : 8000;
                }else{
                    this.formValidate2.account_name = this.account.account_name;
                    this.formValidate2.private_key = this.account.private_key;
                    this.formValidate2.callback_url = this.account.callback_url;
                    this.formValidate2.privacy_request_timeout = this.account.privacy_request_timeout ? this.account.privacy_request_timeout : 120000;
                    this.formValidate2.default_timeout = this.account.default_timeout ? this.account.default_timeout : 8000;
                    this.formValidate2.service = this.account.service;
                    this.formValidate2.subscribed_data_product = this.account.subscribed_data_product ? this.account.subscribed_data_product : [];
                }
            }
        },
        methods: {
            ...mapActions({
                setAccount: 'setAccount'
            }),
            handleSubmit1 (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.formValidate1.account_name = this.formValidate1.account_name.toLowerCase();
                        this.$http({
                            method: 'post',
                            url: '/api/write_config',
                            data: {
                                config: this.formValidate1,
                                type: 'merchant'
                            }
                        }).then(() => {
                            this.setAccount({account: this.formValidate1});
                            this.$Message.success('提交成功');
                            this.$emit('next');
                        }).catch((err) => {
                            console.error(err);
                            this.$Message.error('提交失败:' + JSON.stringify(err.response.data));
                        });
                    } else {
                        this.$Message.error('验证失败');
                    }
                });
            },
            handleSubmit2 (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.formValidate2.subscribed_data_product.length === 0){
                            this.$Message.error('至少需要添加一个产品ID');
                        }else{
                            let merchant_config = {
                                account_name: this.formValidate2.account_name.toLowerCase(),
                                private_key: this.formValidate2.private_key,
                                callback_url: this.formValidate2.callback_url,
                                privacy_request_timeout: this.formValidate2.privacy_request_timeout,
                                default_timeout: this.formValidate2.default_timeout
                            };
                            let datasource_config = {
                                account_name: this.formValidate2.account_name.toLowerCase(),
                                private_key: this.formValidate2.private_key,
                                service: this.formValidate2.service,
                                subscribed_data_product: this.formValidate2.subscribed_data_product
                            };
                            if (this.is_merchant_open){
                                this.$http({
                                    method: 'post',
                                    url: '/api/write_config',
                                    data: {
                                        config: merchant_config,
                                        type: 'merchant'
                                    }
                                }).then(() => {
                                    this.$http({
                                        method: 'post',
                                        url: '/api/write_config',
                                        data: {
                                            config: datasource_config,
                                            type: 'datasource',
                                            is_merchant_open: true,
                                        }
                                    }).then(() => {
                                        this.setAccount({account: this.formValidate2});
                                        this.$Message.success('提交成功');
                                        this.$emit('next');
                                    }).catch((err) => {
                                        console.error(err);
                                        this.$Message.error('提交失败:' + JSON.stringify(err.response.data));
                                    });
                                }).catch((err) => {
                                    console.error(err);
                                    this.$Message.error('提交失败:' + JSON.stringify(err.response.data));
                                });
                            }else{
                                this.$http({
                                    method: 'post',
                                    url: '/api/write_config',
                                    data: {
                                        config: datasource_config,
                                        type: 'datasource',
                                        is_merchant_open: false,
                                    }
                                }).then(() => {
                                    this.setAccount({account: datasource_config});
                                    this.$Message.success('提交成功');
                                    this.$emit('next');
                                }).catch((err) => {
                                    console.error(err);
                                    this.$Message.error('提交失败:' + JSON.stringify(err.response.data));
                                });
                            }
                        }
                    } else {
                        this.$Message.error('验证失败');
                    }
                });
            },
            changeShowType () {
                if (this.show_type === 'password'){
                    this.show_type = 'text';
                }else{
                    this.show_type = 'password';
                }
            },
            handleAdd () {
                if (this.product_id !== ''){
                    this.formValidate2.subscribed_data_product.push(this.product_id);
                    this.product_id = '';
                }else{
                    this.$Message.error('产品ID不能为空');
                }
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