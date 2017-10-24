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
</style>
<template>
    <div class="setting-api">
        <div class="setting-header">
            <h2>接入点</h2>
            <h3>修改API及水龙头服务器</h3>
        </div>
        <div class="split-line"></div>
        <div class="setting-cont">
            <div class="api-server">
                <Select v-model="api">
                    <Option v-for="(item,index) in api_list" :value="item" :key="index">{{ item }}</Option>
                </Select>
            </div>
            <div class="faucet-server">
                <Input v-model="faucet_url" placeholder="请输入..."></Input>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                api: '',
                faucet_url: '',
                api_list: [],
                err: false
            };
        },
        created (){
            let commonSettings =  JSON.parse(localStorage.getItem('__gxbBox__commonSettings'));
            if (commonSettings && commonSettings.witnesses && commonSettings.faucet_url) {
                this.err = false;
                this.api_list = commonSettings.witnesses;
                this.faucet_url = commonSettings.faucet_url;
                this.api = commonSettings.witnesses[0];
            }else{
                this.err = true;

            }
        },
        methods: {
        },
        computed: {
        }
    };
</script>