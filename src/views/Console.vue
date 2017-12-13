<style scoped>
    .layout-content-main{
        padding: 10px;
    }
    .console {
        height: 100%;
        width: 100%;
        text-align: center;
        padding: 30px;
    }
</style>
<template>
    <div class="console">
        <ConsoleManage></ConsoleManage>
    </div>
</template>
<script>
    import ConsoleManage from './components/ConsoleManage.vue';

    export default {
        methods: {
        },
        components: {
            ConsoleManage: ConsoleManage
        }
    };
</script>
