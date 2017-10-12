<style scoped>
    .ivu-btn {
        margin: 0 5px 20px 0;
    }
</style>
<template>
    <div class="account-certification">
        <Alert type="info">如果你希望在公信宝进行数据交易，请完成商户实名认证</Alert>
        <Button type="primary" @click="applyMerchant">认证为商户</Button>
        <Alert type="info">如果你希望在公信宝里成为数据源并出售数据，请完成数据源认证</Alert>
        <Button type="primary" disabled>请先完成商户认证</Button>
        <div class="step-btn-box">
            <Button type="primary" @click="lastStep()">上一步</Button>
            <Button type="primary" @click="nextStep()" disabled="">下一步</Button>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['account_type'],
        data () {
            return {
            };
        },
        methods: {
            applyMerchant (){
                this.$emit('next');
            },
            lastStep (){
                this.$emit('last');
            },
            nextStep (){
                this.$emit('next');
            }
        }
    };
</script>