<style scoped>
    .layout-content-main{
        padding: 0 30px;
    }
    .setting {
        width: 100%;
        padding: 30px;
    }
</style>
<template>
    <div class="setting">
        <Row>
            <Col span="5">
                <Menu :active-name="String(current)" width="auto" @on-select="route">
                    <MenuItem name="0">
                        <Icon type="person"></Icon>
                        账户管理
                    </MenuItem>
                    <MenuItem name="1">
                        <Icon type="settings"></Icon>
                        配置管理
                    </MenuItem>
                    <MenuItem name="2">
                        <Icon type="connection-bars"></Icon>
                        接入点管理
                    </MenuItem>
                </Menu>
            </Col>
            <Col span="19">
                <div class="layout-content-main">
                    <div v-bind:is="list[current]" v-on:restart="restartBox"></div>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    import SettingAccount from './components/SettingAccount.vue';
    import SettingConfig from './components/SettingConfig.vue';
    import SettingApi from './components/SettingApi.vue';

    export default {
        data () {
            return {
                loading: false,
                current: localStorage.getItem('__gxbBox__activeSetting') ? Number(localStorage.getItem('__gxbBox__activeSetting')) : 0,
                list:{
                    0: 'SettingAccount',
                    1: 'SettingConfig',
                    2: 'SettingApi'
                }
            };
        },
        methods: {
            route(name) {
                switch (name){
                    case '0':
                        this.current = 0;
                        break;
                    case '1':
                        this.current = 1;
                        break;
                    case '2':
                        this.current = 2;
                        break;
                }
                localStorage.setItem('__gxbBox__activeSetting',this.current);
            },
            restartBox(){
                console.log('Go to restart gxb-box!');
                this.$router.push('/console');
            }
        },
        components: {
            SettingAccount: SettingAccount,
            SettingConfig: SettingConfig,
            SettingApi: SettingApi,
        }
    };
</script>