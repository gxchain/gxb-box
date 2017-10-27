<style scoped>
    .merchant-type,.datasource-type {
        margin-bottom: 15px;
    }
</style>
<template>
    <div class="account-type">
        <div class="merchant-type">
            <Alert type="info">商户指数据买方，在公信链上是购买数据的角色。</Alert>
            <Button type="primary" @click="changeType('merchant')">申请成为商户</Button>
        </div>
        <div class="datasource-type">
            <Alert type="info">数据源指数据卖方，在公信链上是出售数据的角色。</Alert>
            <Button type="primary" @click="changeType('datasource')">申请成为数据源</Button>
        </div>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';

    export default {
        data () {
            return {};
        },
        methods: {
            ...mapActions({
                setAccountType: 'setAccountType',
                setAccount: 'setAccount',
                setCertified: 'setCertified'
            }),
            changeType (type){
                localStorage.setItem('__gxbBox__accountType',type);
                this.setAccountType({account_type: type});
                this.setCertified({certified: false});
                this.$http.get('/api/fetch_config').then((res) => {
                    if (res.data[type] && res.data[type].account_name && res.data[type].private_key){
                        let account_info = {
                            account_name: res.data[type].account_name,
                            private_key: res.data[type].private_key
                        };
                        this.setAccount({account: account_info});
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