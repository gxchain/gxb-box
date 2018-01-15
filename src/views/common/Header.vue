<style scoped>
    #header .ivu-menu-horizontal {
        height: 80px;
        line-height: 80px;
    }

    .layout-header {
        width: 90%;
        height: 80px;
        margin: 0 auto;
    }

    .layout-logo {
        width: 167px;
        height: 30px;
        background: url("/static/img/gxb-box.png");
        background-size: cover;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 25px;
    }

    .layout-env{
        padding-left: 20px;
    }

    .layout-nav {
        height: inherit;
        float: right;
    }

    .layout-nav .account {
        float: left;
        padding: 0 20px;
    }

</style>
<template>
    <div id="header">
        <Menu mode="horizontal" :active-name="active_nav" @on-select="route">
            <div class="layout-header">
                <div class="layout-logo"></div>
                <ButtonGroup size="small" v-show="env_type" class="layout-env">
                    <Button :type="envTest"
                            :loading="loadingTest"
                            :disabled="loadingProd ? true : false"
                            @click="changToTestEnv">
                        测试环境
                    </Button>
                    <Button :type="envProd"
                            :loading="loadingProd"
                            :disabled="loadingTest ? true : false"
                            @click="changToProdEnv">
                        生产环境
                    </Button>
                </ButtonGroup>
                <Button type="error" size="small" style="margin-left: 10px" @click="openReloadModal">初始化</Button>
                <div class="layout-nav">
                    <span class="account" v-if="account">
                        {{account.account_name.toUpperCase()}}
                    </span>
                    <MenuItem name="1" v-show="this.init_step != 'finished'">
                        <Icon type="compass"></Icon>
                        使用引导
                    </MenuItem>
                    <MenuItem name="2" v-show="this.init_step == 'finished'">
                        <Icon type="cube"></Icon>
                        控制台
                    </MenuItem>
                    <MenuItem name="3" v-show="this.init_step == 'finished'">
                        <Icon type="ios-keypad"></Icon>
                        数据市场
                    </MenuItem>
                    <MenuItem name="4" v-show="this.init_step == 'finished'">
                        <Icon type="gear-a"></Icon>
                        设置
                    </MenuItem>
                </div>
            </div>
        </Menu>
        <Modal v-model="reloadModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>初始化</span>
            </p>
            <div style="text-align:center">
                <p>确定是否要清空当前所有配置？</p>
                <p>请确保备份重要信息，清空后不可逆！</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="loadingModal" @click="reload">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import Handler from '../../libs/handler';
    import Util from '../../libs/util';
    import {mapGetters, mapActions} from 'vuex';

    export default {
        data () {
            return {
                envTest: 'ghost',
                envProd: 'ghost',
                loadingTest: false,
                loadingProd: false,
                loadingModal: false,
                reloadModal: false
            };
        },
        mounted () {
            this.changeType();
        },
        watch: {
            env_type () {
                this.changeType();
            }
        },
        computed: {
            ...mapGetters({
                env_type: 'env_type',
                account: 'account',
                init_step: 'init_step',
                active_nav: 'active_nav'
            })
        },
        methods: {
            ...mapActions({
                setReload: 'setReload'
            }),
            route (name) {
                switch (name) {
                    case '1':
                        this.$router.push('/init');
                        break;
                    case '2':
                        this.$router.push('/console');
                        break;
                    case '3':
                        this.$router.push('/market');
                        break;
                    case '4':
                        this.$router.push('/setting');
                        break;
                }
            },
            changeType () {
                if (this.env_type === 'development') {
                    this.envTest = 'primary';
                    this.envProd = 'ghost';
                } else {
                    this.envTest = 'ghost';
                    this.envProd = 'primary';
                }
            },
            changToTestEnv () {
                let _config;
                if (localStorage.getItem('__gxbBox__TestEnvSetting')) {
                    _config = JSON.parse(localStorage.getItem('__gxbBox__TestEnvSetting'));
                } else {
                    _config = {common: Util.testEnvConfig};
                }
                this.loadingTest = true;
                // 写入文件
                this.$http({
                    method: 'post',
                    url: '/api/change_config_env?env=development',
                    data: { config: _config }
                }).then((res) => {
                    localStorage.setItem('__gxbBox__ProdEnvSetting', JSON.stringify(res.data.data.old_config));
                    this.envTest = 'primary';
                    this.envProd = 'ghost';
                    localStorage.setItem('__gxbBox__env', 'development');
                    location.reload();
                }).catch((err) => {
                    this.loadingTest = false;
                    this.$Message.error('切换环境失败:' + Handler.error(err));
                });
            },
            changToProdEnv () {
                let _config;
                if (localStorage.getItem('__gxbBox__ProdEnvSetting')) {
                    _config = JSON.parse(localStorage.getItem('__gxbBox__ProdEnvSetting'));
                } else {
                    _config = {common: Util.prodEnvConfig};
                }
                this.loadingProd = true;
                // 写入文件
                this.$http({
                    method: 'post',
                    url: '/api/change_config_env?env=production',
                    data: { config: _config }
                }).then((res) => {
                    localStorage.setItem('__gxbBox__TestEnvSetting', JSON.stringify(res.data.data.old_config));
                    this.envTest = 'ghost';
                    this.envProd = 'primary';
                    localStorage.setItem('__gxbBox__env', 'production');
                    location.reload();
                }).catch((err) => {
                    this.loadingTest = false;
                    this.$Message.error('切换环境失败:' + Handler.error(err));
                });
            },
            openReloadModal () {
                this.reloadModal = true;
            },
            reload () {
                this.loadingModal = true;
                // 清空config
                this.$http({
                    method: 'post',
                    url: '/api/change_config_env?env=' + this.env_type,
                    data: { config: {} }
                }).then((res) => {
                    // 清空localStorage
                    localStorage.clear();
                    // 清空vuex store
                    this.setReload();
                    location.reload();
                }).catch((err) => {
                    this.loadingModal = false;
                    this.reloadModal = false;
                    this.$Message.error('初始化失败:' + Handler.error(err));
                });
            }
        }
    };
</script>
