<style scoped>
    .ivu-btn {
        margin: 0 5px 20px 0;
    }
</style>
<template>
    <div class="account-create">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="账号" prop="account_name">
                <Input v-model="formValidate.account_name" placeholder="sample_user"></Input>
            </FormItem>
        </Form>
        <div class="step-btn-box">
            <Button type="primary" @click="lastStep()">上一步</Button>
            <Button type="primary" @click="handleSubmit('formValidate')">下一步</Button>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        props: ['account_type'],
        data () {
            return {
                formValidate: {
                    account_name: '',
                },
                ruleValidate: {
                    account_name: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ]
                },
            };
        },
        mounted (){
            this.createAccount('xlogic92');
        },
        methods: {
            ...mapActions({
                setAccount: 'setAccount'
            }),
            createAccount (new_account_name){
                this.$http.get('/api/create_account/' + new_account_name).then((res) => {
                    console.log(res.data);
                }).catch((err)=>{
                    console.error(err);
                });

            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$emit('next');
                    } else {
                        this.$Message.error('验证失败');
                    }
                });
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