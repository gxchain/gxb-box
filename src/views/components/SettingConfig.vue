<style scoped>
    h3 {
        padding-top: 10px;
        font-weight: normal;
    }

    .split-line {
        height: 1px;
        background: #dddee1;
        margin: 20px 0;
    }

    .setting-cont{
        text-align: center;
    }
</style>
<template>
    <div class="setting-config">
        <div class="setting-header">
            <h2>配置</h2>
            <h3>我的配置信息</h3>
        </div>
        <div class="split-line"></div>
        <div class="setting-cont">
            <AccountConfig :account_type="account_type"></AccountConfig>
        </div>
    </div>
</template>
<script>
    import AccountConfig from './AccountConfig.vue';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {};
        },
        methods: {
        },
        computed: {
            ...mapGetters({
                account_type: 'account_type',
            })
        },
        components: {
            AccountConfig: AccountConfig
        }
    };
</script>