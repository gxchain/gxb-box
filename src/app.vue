<style>
    html, body{
        height: 100%;
        margin: 0;
        padding: 0;
    }
</style>
<style scoped>
    #layout {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #eee;
    }

    #container{
        flex: 1;
        position:relative;
        overflow:auto;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .layout-content {
        flex: 1;
        margin: 30px 0;
        width: 90%;
        min-width: 900px;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .1);
    }
</style>
<template>
    <div id="layout">
        <vHeader></vHeader>
        <section id="container">
            <div class="layout-content">
                <router-view></router-view>
            </div>
        </section>
        <vFooter></vFooter>
    </div>
</template>
<script>
    import Header from './views/common/Header';
    import Footer from './views/common/Footer';

    export default {
        data() {
            return {};
        },
        components: {
            vHeader: Header,
            vFooter: Footer
        }
    };
</script>