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
    import Handler from '../../libs/handler';
    import {mapGetters, mapActions} from 'vuex';

    export default {
        computed: {
            ...mapGetters({
                commonSettings: 'common_setting'
            })
        },
        methods: {
            ...mapActions({
                setAccountType: 'setAccountType',
                setAccount: 'setAccount',
                setCommonSetting: 'setCommonSetting'
            }),
            changeType (type){
                this.commonSettings.account_type = type;
                //写入文件
                this.$http({
                    method: 'post',
                    url: '/api/write_config',
                    data: {
                        config: this.commonSettings,
                        type: 'common'
                    }
                }).then(() => {
                    this.setCommonSetting({common_setting: this.commonSettings});
                    this.setAccountType({account_type: type});

                    return this.$http.get('/api/fetch_config');
                }).then((res) => {
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
                    this.$Message.error('保存配置失败:' + Handler.error(err));
                });
            }
        }
    };
</script>