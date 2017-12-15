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
    <Header id="header">
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
    </Header>
</template>
<script>
    import Handler from '../../libs/handler';
    import Util from '../../libs/util';
    import {mapGetters} from 'vuex';

    export default {
        data () {
            return {
                envTest: 'ghost',
                envProd: 'ghost',
                loadingTest: false,
                loadingProd: false
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
                active_nav: 'active_nav',
                common_setting: 'common_setting'
            })
        },
        methods: {
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
                    url: '/api/write_config',
                    data: {
                        config: _config,
                        type: 'import'
                    }
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
                    _config = {common: Util.prodEnvConifg};
                }
                this.loadingProd = true;
                // 写入文件
                this.$http({
                    method: 'post',
                    url: '/api/write_config',
                    data: {
                        config: _config,
                        type: 'import'
                    }
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
            }
        }
    };
</script>
