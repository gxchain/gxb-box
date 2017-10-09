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
        <Menu mode="horizontal" :active-name="account&&certified ? '2' : '1'">
            <div class="layout-header">
                <div class="layout-logo"></div>
                <div class="layout-nav">
                    <span class="account">{{account.account_name}}</span>
                    <MenuItem name="1" v-show="!(account&&certified)">
                        <Icon type="key"></Icon>
                        {{$t('navs.headerNav.accountSetting')}}
                    </MenuItem>
                    <MenuItem name="2">
                        <Icon type="ios-keypad"></Icon>
                        {{$t('navs.headerNav.dataMarket')}}
                    </MenuItem>
                    <Submenu name="3">
                        <template slot="title">
                            <Icon type="gear"></Icon>
                            {{$t('navs.headerNav.setting')}}
                        </template>
                        <MenuItem name="3-1">{{$t('navs.headerNav.settingAccount')}}</MenuItem>
                        <MenuItem name="3-2">{{$t('navs.headerNav.settingBak')}}</MenuItem>
                        <MenuItem name="3-3">{{$t('navs.headerNav.settingNode')}}</MenuItem>
                    </Submenu>
                    <Button type="ghost" size="small" @click="switchLanguage($t('setting.locale'))">{{$t('setting.language')}}</Button>
                </div>
            </div>
        </Menu>
    </header>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        methods: {
            switchLanguage(locale) {
                this._i18n.locale = locale;
                window.localStorage.setItem('language',locale);
            },
        },
        computed: {
            ...mapGetters({
                account: 'account',
                certified: 'certified'
            })
        }
    };
</script>