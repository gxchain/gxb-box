<style scoped>
    .ivu-btn {
        margin: 0 5px 20px 0;
    }
    .ivu-btn.no-margin {
        margin: 0;
    }
    .ivu-input-icon:hover{
        cursor: pointer;
        color: #2d8cf0
    }
    .important {
        color: #ed3f14
    }
</style>
<style>
    .account_input .ivu-input{
        text-transform: lowercase;
    }
</style>
<template>
    <div class="account-create">
        <Tabs :animated="false" v-if="!created">
            <TabPane label="创建账户" icon="person-add">
                <div class="action-create">
                    <Alert type="info">
                        请输入你期望的账户名，长度不少于3位，包含至少一个横杠、数字或者不含元音字母
                    </Alert>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                        <FormItem label="账号" prop="account_name">
                            <Row>
                                <Col span="18"><Input v-model="formValidate.account_name" placeholder="sample_user" class="account_input"></Input></Col>
                                <Col span="4" offset="2">
                                <Button type="ghost" @click="createAccount('formValidate')" class="no-margin" :loading="loading">
                                    <span v-show="!loading">创建账号</span>
                                    <span v-show="loading">创建中...</span>
                                </Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </div>
            </TabPane>
            <TabPane label="导入私钥" icon="key">
                <div class="action-import">
                    <Alert type="info">
                        请复制备份的私钥，并点击导入
                    </Alert>
                    <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="80">
                        <FormItem label="私钥" prop="private_key">
                            <Row>
                                <Col span="18">
                                <div @click="changeShowType()"><Icon class="ivu-input-icon" type="eye"></Icon></div>
                                <Input :type="show_type" v-model="formValidate2.private_key" placeholder="请输入账户私钥"></Input>
                                </Col>
                                <Col span="4" offset="2">
                                <Button type="ghost" @click="importAccount('formValidate2')" class="no-margin" :loading="loading">
                                    <span v-show="!loading">导入</span>
                                    <span v-show="loading">导入...</span>
                                </Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </div>
            </TabPane>
        </Tabs>

        <div class="action-bak" v-if="created&&(!imported)">
            <Alert type="warning">
                {{account.account_name}}，请先备份账号私钥<span class="important">（重要！重要！重要）</span>，再进行下一步操作
            </Alert>
            <Button type="ghost" v-show="!is_bak" @click="bakStep()">备份账号私钥</Button>
            <Alert type="info" v-show="is_bak">
                {{account.private_key}}
            </Alert>
        </div>

        <div class="action-import-success"  v-if="created&&imported">
            <Alert type="success">账号导入成功</Alert>
        </div>

        <div class="step-btn-box">
            <Button type="primary" @click="lastStep()">上一步</Button>
            <Button type="primary" @click="nextStep()" :disabled="!is_bak">下一步</Button>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        props: ['account_type'],
        data () {
            const validateAccount = (rule, value, callback) => {
                value = value.toLowerCase();
                if (value.length < 3){
                    callback(new Error('账户名长度不少于3位'));
                }
                if (value.length > 63){
                    callback(new Error('账户名长度不超过63位'));
                }
                let ref = value.split('.');
                for (let i = 0; i < ref.length; i++) {
                    let label = ref[i];
                    if (!/^[~a-z]/.test(label)) {
                        callback(new Error('每个帐户段只能以字母为首位'));
                    }
                    if (!/^[~a-z0-9-]*$/.test(label)) {
                        callback(new Error('每个帐户段只能包含字母、数字或破折号'));
                    }
                    if (/--/.test(label)) {
                        callback(new Error('每个帐户段只能包含一个破折号'));
                    }
                    if (!/[a-z0-9]$/.test(label)) {
                        callback(new Error('每个帐户段只能以字母、数字结尾'));
                    }
                    if (!(label.length >= 3)) {
                        callback(new Error('每个帐户段长度不少于3位'));
                    }
                }
                if (!(/[0-9-]/.test(value) || !/[aeiouy]/.test(value))){
                    callback(new Error('包含至少一个横杠、数字或者不含元音字母'));
                }
                this.$http.get('/api/fetch_account/' + value).then((res) => {
                    if (res.data.name) {
                        callback(new Error('账户已存在'));
                    } else {
                        callback();
                    }
                }).catch((err) => {
                    callback(new Error(err));
                });
            };
            return {
                loading: false,
                created: false,
                imported: false,
                is_bak: false,
                show_type: 'password',
                formValidate: {
                    account_name: '',
                },
                ruleValidate: {
                    account_name: [
                        {required: true, message: '账户名不能为空', trigger: 'blur'},
                        {validator: validateAccount, trigger: 'blur'}
                    ]
                },
                formValidate2: {
                    private_key: '',
                },
                ruleValidate2: {
                    private_key: [
                        {required: true, message: '私钥不能为空', trigger: 'blur'}
                    ]
                },
            };
        },
        created (){
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
                            this.$Message.error('账号创建失败:' + JSON.stringify(err.response.data));
                            console.error(err);
                        });
                    } else {
                        this.loading = false;
                        this.$Message.error('验证失败');
                    }
                });
            },
            importAccount (name){
                this.loading = true;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/api/import_account',
                            data: {
                                'type': this.account_type,
                                'private_key': this.formValidate2.private_key
                            }
                        }).then((res) => {
                            this.loading = false;
                            this.$Message.success('账号导入成功');
                            this.setAccount({account: res.data});
                            this.created = true;
                            this.is_bak = true;
                            this.imported = true;
                        }).catch((err)=>{
                            this.loading = false;
                            this.$Message.error('账号导入失败:' + JSON.stringify(err.response.data));
                            console.error(err);
                        });
                    } else {
                        this.loading = false;
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
            bakStep (){
                this.is_bak = true;
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