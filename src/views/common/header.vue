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
</style>
<template>
    <header id="header">
        <Menu mode="horizontal" active-name="1">
            <div class="layout-header">
                <div class="layout-logo"></div>
                <div class="layout-nav">
                    <MenuItem name="1">
                        <Icon type="key"></Icon>
                        {{$t('navs.headerNav.createAccount')}}
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
    export default {
        methods: {
            switchLanguage(locale) {
                this._i18n.locale = locale
                window.localStorage.setItem('language',locale)
            },
        }
    };
</script>