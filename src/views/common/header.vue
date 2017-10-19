<style scoped>
    #header .ivu-menu-horizontal {
        height: 80px;
        line-height: 80px;
    }
    .layout-header{
        width: 90%;
        height: 80px;
        margin: 0 auto;
    }
    .layout-logo{
        width: 167px;
        height: 30px;
        background: url("/static/img/gxb-box.png");
        background-size: cover;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 25px;
    }
    .layout-nav{
        height: inherit;
        float: right;
    }

    .layout-nav .account{
        float: left;
        padding: 0 20px;
    }

</style>
<template>
    <header id="header">
        <Menu mode="horizontal" :active-name="this.init_step != 'finished' ? '1' : '2'" @on-select="route">
            <div class="layout-header">
                <div class="layout-logo"></div>
                <div class="layout-nav">
                    <span class="account" v-if="account">
                        {{account.account_name.toUpperCase()}}
                    </span>
                    <MenuItem name="1" v-show="this.init_step != 'finished'">
                        <Icon type="compass"></Icon>
                        使用引导
                    </MenuItem>
                    <MenuItem name="2" v-show="this.init_step == 'finished'">
                        <Icon type="ios-keypad"></Icon>
                        数据市场
                    </MenuItem>
                    <Submenu name="3" v-show="this.init_step == 'finished'">
                        <template slot="title">
                            <Icon type="gear"></Icon>
                            设置
                        </template>
                        <MenuItem name="3-1">账号管理</MenuItem>
                        <MenuItem name="3-2">配置管理</MenuItem>
                        <MenuItem name="3-3">接入点管理</MenuItem>
                    </Submenu>
                </div>
            </div>
        </Menu>
    </header>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        data () {
            return {
            };
        },
        methods: {
            route(name) {
                switch (name){
                    case '1':
                        this.$router.push('/init');
                        break;
                    case '2':
                        this.$router.push('/');
                        break;
                }
            }
        },
        computed: {
            ...mapGetters({
                account: 'account',
                init_step: 'init_step',
            })
        }
    };
</script>