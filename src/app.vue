<style scoped>
    #layout{
        background: #eee;
    }
    .layout-content{
        background: #fff;
        width: 90%;
        margin: 30px auto 20px;
        border-radius: 6px;
        box-shadow: 0 1px 1px 0 rgba(0,0,0,.1);
    }
</style>
<template>
    <div id="layout">
        <v-header/>
        <section id="container">
            <div class="layout-content">
                <router-view></router-view>
            </div>
        </section>
        <v-footer/>
    </div>
</template>
<script>
    import header from './views/common/header';
    import footer from './views/common/footer';

    export default {
        data() {
            return {

            };
        },
        mounted() {

        },
        beforeDestroy() {

        },
        methods: {

        },
        components: {
            vHeader: header,
            vFooter: footer
        }
    };
</script>