<style scoped>
    .layout-content-main{
        padding: 10px;
    }
    .market {
        width: 100%;
        min-height: 800px;
        text-align: center;
    }
</style>
<template>
    <div class="market">
        <Row>
            <Col span="5">
                <Menu active-name="1-1" width="auto" :open-names="['1']">
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-keypad"></Icon>
                            自由市场
                        </template>
                        <MenuItem name="1-1">普惠金融</MenuItem>
                    </Submenu>
                    <Submenu name="2">
                        <template slot="title">
                            <Icon type="ios-people"></Icon>
                            联盟市场
                        </template>
                        <MenuItem name="2-1">普惠金融</MenuItem>
                    </Submenu>
                </Menu>
            </Col>
            <Col span="19">
                <div class="layout-content-main">
                    <Card style="width:30%">
                        <p slot="title">标准卡片</p>
                        <p>卡片内容</p>
                        <p>卡片内容</p>
                        <p>卡片内容</p>
                    </Card>
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