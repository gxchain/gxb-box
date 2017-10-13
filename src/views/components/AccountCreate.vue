<style scoped>
    .ivu-btn {
        margin: 0 5px 20px 0;
    }
    .ivu-btn.no-margin {
        margin: 0;
    }
    .important {
        color: #ed3f14
    }
</style>
<template>
    <div class="account-create">
        <div class="action-create" v-if="!created">
            <Alert type="info">
                请输入你期望的账户名。这个账户名将在区块链上进行注册，并将作为你的身份标识
            </Alert>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="账号" prop="account_name">
                    <Row>
                        <Col span="18"><Input v-model="formValidate.account_name" placeholder="sample_user"></Input></Col>
                        <Col span="4" offset="2">
                            <Button type="ghost" @click="createAccount('formValidate')" class="no-margin" :loading="loading">
                                <span v-if="!loading">创建账号</span>
                                <span v-else>创建中...</span>
                            </Button>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
        </div>
        <div class="action-bak" v-if="created">
            <Alert type="warning">
                {{formValidate.account_name}}，请先备份账号<span class="important">（重要！重要！重要）</span>，再进行下一步操作
            </Alert>
            <Button type="ghost">备份账号</Button>
        </div>

        <div class="step-btn-box">
            <Button type="primary" @click="lastStep()">上一步</Button>
            <Button type="primary" @click="nextStep()" :disabled="!created">下一步</Button>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        props: ['account_type'],
        data () {
            const validateAccount = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('账户不能为空'));
                } else {
                    this.$http.get('/api/fetch_account/' + value).then((res) => {
                        if (res.data.name){
                            callback(new Error('账户已存在'));
                        }else{
                            callback();
                        }
                    }).catch((err)=>{
                        callback(new Error(err));
                    });
                }
            };
            return {
                loading: false,
                created: false,
                formValidate: {
                    account_name: '',
                },
                ruleValidate: {
                    account_name: [
                        {validator: validateAccount, trigger: 'blur'}
                    ]
                },
            };
        },
        mounted (){
            if (this.account){
                this.formValidate.account_name = this.account.account_name;
                this.created = true;
            }
        },
        methods: {
            ...mapActions({
                setAccount: 'setAccount'
            }),
            createAccount (name){
                this.loading = true;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/api/create_account',
                            data: {
                                'type': this.account_type,
                                'name': this.formValidate.account_name
                            }
                        }).then((res) => {
                            this.loading = false;
                            this.$Message.success('账号创建成功');
                            this.setAccount({account: res.data});
                            this.created = true;
                        }).catch((err)=>{
                            this.loading = false;
                            this.$Message.error('账号创建失败');
                            console.error(err);
                        });
                    } else {
                        this.$Message.error('验证失败');
                    }
                });
            },
            lastStep (){
                this.$emit('last');
            },
            nextStep (){
                this.$emit('next');
            }
        },
        computed: {
            ...mapGetters({
                account: 'account'
            }),
        }
    };
</script>