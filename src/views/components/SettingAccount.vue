<style scoped>
    h3 {
        padding-top: 10px;
        font-weight: normal;
    }

    .split-line {
        height: 1px;
        background: #eee;
        margin: 20px 0;
    }

    .info-header {
        font-weight: 500;
        margin: 30px 0 10px;
        position: relative;
    }

    .info-header:before {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background: #eee;
        position: absolute;
        top: 10px;
        left: 0;
    }

    .info-header span {
        display: inline-block;
        background: #fff;
        padding: 0 5px 0 18px;
        position: relative;
        margin-left: 30px;
        font-size: 14px;
    }

    .view-btn {
        width: 32px;
        height: 32px;
        font-size: 16px;
        text-align: center;
        color: #80848f;
        position: absolute;
        right: 0;
        top: 8px;
        z-index: 3;
        cursor: pointer;
    }

    .view-btn:hover {
        color:#2d8cf0
    }

    .mar-top-15{
        margin-top: 15px;
    }
</style>
<template>
    <div class="setting-account">
        <div class="setting-header">
            <h2>账户</h2>
            <h3>我的账户信息</h3>
        </div>
        <div class="split-line"></div>
        <div class="account-info" v-if="account">
            <h3>{{account.account_name}}</h3>
            <header class="info-header">
                <span>账户类型</span>
            </header>
            <div class="account-type mar-top-15">
                <AccountCertification></AccountCertification>
            </div>
            <header class="info-header">
                <span>账号备份</span>
            </header>
            <div class="account-bak mar-top-15">
                <Alert type="info">
                    <span v-show="is_show">{{account.private_key}}</span>
                    <span v-show="!is_show">--------- 点击右侧按钮查看私钥 ---------</span>
                    <div @click="showPrivateKey()"><Icon class="view-btn" type="eye"></Icon></div>
                </Alert>
            </div>
        </div>
    </div>
</template>
<script>
    import AccountCertification from './AccountCertification.vue';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                is_show: false
            };
        },
        methods: {
            showPrivateKey(){
                this.is_show = !this.is_show;
            }
        },
        computed: {
            ...mapGetters({
                account: 'account'
            })
        },
        components: {
            AccountCertification: AccountCertification
        }
    };
</script>