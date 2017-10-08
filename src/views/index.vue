<style scoped>
    .layout-content-main{
        padding: 10px;
    }
    .index {
        width: 100%;
        min-height: 800px;
        text-align: center;
    }
</style>
<template>
    <div class="index">
        <Row>
            <Col span="5">
            <Menu active-name="1-2" width="auto" :open-names="['1']">
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="ios-navigate"></Icon>
                        导航一
                    </template>
                    <MenuItem name="1-1">选项 1</MenuItem>
                    <MenuItem name="1-2">选项 2</MenuItem>
                    <MenuItem name="1-3">选项 3</MenuItem>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="ios-keypad"></Icon>
                        导航二
                    </template>
                    <MenuItem name="2-1">选项 1</MenuItem>
                    <MenuItem name="2-2">选项 2</MenuItem>
                </Submenu>
                <Submenu name="3">
                    <template slot="title">
                        <Icon type="ios-analytics"></Icon>
                        导航三
                    </template>
                    <MenuItem name="3-1">选项 1</MenuItem>
                    <MenuItem name="3-2">选项 2</MenuItem>
                </Submenu>
            </Menu>
            </Col>
            <Col span="19">
            <div class="layout-content-main">
                <h2>
                    <p>Welcome to GXB-BOX!</p>
                </h2>
            </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        methods: {
        }
    };
</script>