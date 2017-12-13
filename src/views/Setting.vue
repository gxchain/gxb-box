<style scoped>
    .setting {
        width: 100%;
        padding: 30px;
    }

    .layout-content-main {
        padding: 0 30px;
    }
</style>
<template>
    <div class="setting">
        <Row>
            <i-col span="5">
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
                    <MenuItem name="3">
                        <Icon type="code-download"></Icon>
                        打包管理
                    </MenuItem>
                </Menu>
            </i-col>
            <i-col span="19">
                <div class="layout-content-main">
                    <div v-bind:is="list[current]" v-on:restart="restartBox()"></div>
                </div>
            </i-col>
        </Row>
    </div>
</template>
<script>
    import SettingAccount from './components/SettingAccount.vue';
    import SettingConfig from './components/SettingConfig.vue';
    import SettingApi from './components/SettingApi.vue';
    import SettingArchive from './components/SettingArchive.vue';
    import Handler from '../libs/handler';

    export default {
        data () {
            return {
                loading: false,
                current: localStorage.getItem('__gxbBox__activeSetting') ? Number(localStorage.getItem('__gxbBox__activeSetting')) : 0,
                list: {
                    0: 'SettingAccount',
                    1: 'SettingConfig',
                    2: 'SettingApi',
                    3: 'SettingArchive'
                }
            };
        },
        methods: {
            route (name) {
                switch (name) {
                    case '0':
                        this.current = 0;
                        break;
                    case '1':
                        this.current = 1;
                        break;
                    case '2':
                        this.current = 2;
                        break;
                    case '3':
                        this.current = 3;
                        break;
                }
                localStorage.setItem('__gxbBox__activeSetting', this.current);
            },
            restartBox () {
                this.$http.get('/api/box_restart').then(() => {
                    this.$router.push('/console');
                }).catch((err) => {
                    this.$Message.error('服务重启失败:' + Handler.error(err));
                });
            }
        },
        components: {
            SettingAccount: SettingAccount,
            SettingConfig: SettingConfig,
            SettingApi: SettingApi,
            SettingArchive: SettingArchive
        }
    };
</script>
