<style scoped>
    .ivu-btn {
        margin: 0 5px 20px 0;
    }
</style>
<template>
    <div class="account-type">
        <Alert type="info">商户指数据买方，在公信链上是购买数据的角色。</Alert>
        <Button type="primary" @click="changeType('merchant')">申请成为商户</Button>
        <Alert type="info">数据源指数据卖方，在公信链上是出售数据的角色。</Alert>
        <Button type="primary" @click="changeType('datasource')">申请成为数据源</Button>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';

    export default {
        data () {
            return {

            };
        },
        methods: {
            ...mapActions({
                setAccountType: 'setAccountType',
                setAccount: 'setAccount',
                setCertified: 'setCertified'
            }),
            changeType (type){
                localStorage.setItem('account_type',type);
                this.setAccountType({account_type: type});
                this.setCertified({certified: false});
                this.$http.get('/api/fetch_config/' + type).then((res) => {
                    if (res.data.account_name){
                        this.setAccount({account: res.data});
                    }else{
                        this.setAccount({account: null});
                    }
                    this.$emit('next');
                }).catch((err)=> {
                    console.error(err);
                });
            }
        }
    };
</script>