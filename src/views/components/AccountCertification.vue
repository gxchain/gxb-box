<style scoped>
    .ivu-btn {
        margin: 0 5px 20px 0;
    }
    .info {
        color: #2d8cf0
    }
</style>
<template>
    <div class="account-certification" v-if="!certified">
        <div class="merchant-certification" v-if="account_type == 'merchant'">
            <Alert type="info">如果你希望在公信宝进行数据交易，请完成商户实名认证</Alert>
            <Button type="primary" @click="applyMerchant">认证为商户</Button>
        </div>
        <div class="datasource-certification" v-else>
            <Alert type="info">如果你希望在公信宝进行数据交易，请完成商户实名认证</Alert>
            <Button type="primary" @click="applyMerchant">认证为商户</Button>
            <Alert type="info">如果你希望在公信宝里成为数据源并出售数据，请完成数据源认证</Alert>
            <Button type="primary" disabled>请先完成商户认证</Button>
        </div>

        <div class="step-btn-box">
            <Button type="primary" @click="lastStep()">上一步</Button>
            <Button type="primary" @click="nextStep()" disabled="">下一步</Button>
        </div>
    </div>
    <div class="account-certified" v-else>
        <Alert type="success">已通过认证，
            <span class="info">{{account.account_name}}</span>
            已成为认证
            <span class="info" v-if="account_type === 'merchant'">商户</span>
            <span class="info" v-else>数据源</span>
        </Alert>
        <div class="step-btn-box">
            <Button type="primary" @click="lastStep()">上一步</Button>
            <Button type="primary" @click="nextStep()">下一步</Button>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    export default {
        props: ['account_type'],
        data () {
            return {
            };
        },
        methods: {
            ...mapActions({
                setAccount: 'setAccount',
                setCertified: 'setCertified'
            }),
            applyMerchant (){
                this.$emit('next');
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
                account: 'account',
                certified: 'certified'
            }),
        }
    };
</script>