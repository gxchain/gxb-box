<style scoped>
    .ivu-input-number {
        width: 100%;
    }

    h3 {
        padding-top: 10px;
        font-weight: normal;
    }

    .split-line {
        height: 1px;
        background: #eee;
        margin: 20px 0;
    }

    .setting-btn{
        text-align: center;
    }

    .prediv pre {
        padding: 20px 0 20px 20px;
        margin: 10px 0;
        overflow: hidden;
        border: 1px solid #eee;
        background: #fbfbfb;
        border-radius: 4px;
        color: #657180;
        white-space: pre;
        line-height: 16px;
        display: block;
        font-family: monospace;
    }

    .package{
        display: flex;
        flex-direction: row;
        padding: 5px 0;
    }

    .package .name{
        flex:3;
    }

    .package .size{
        flex:2;
    }

    .package .time{
        flex:2;
    }

    .package .download{
        flex:1;
    }
</style>
<template>
    <div class="setting-archive">
        <div class="setting-header">
            <h2>打包</h2>
            <h3>一键生成生产环境压缩包</h3>
        </div>
        <div class="split-line"></div>
        <div class="setting-cont">
            <Form :label-width="100">
                <Alert type="error">可视化配置服务（推荐内网服务器使用，以免私钥泄露）</Alert>
                <FormItem label="可视化配置" >
                    <RadioGroup v-model="visual_packages">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
                <div class="prediv">
                    <pre v-show="visual_packages === '1'">---Quick Start---<br><br>npm install<br>npm run server</pre>
                    <pre v-show="visual_packages === '0'">---Quick Start---<br><br>npm install<br>npm run server-box</pre>
                </div>
                <Collapse value="packages_list" style="margin-bottom: 20px">
                    <Panel name="packages_list">
                        历史打包记录
                        <div slot="content">
                            <p v-for="(item,index) in packages_list" :value="item" :key="index" class="package">
                                <span class="name">{{ item.name }}</span>
                                <span class="size">{{ item.size }}</span>
                                <span class="time">{{ item.time }}</span>
                                <Button type="ghost" size="small" @click="downArchive(item.name)" class="download">下载</Button>
                            </p>
                            <p v-if="packages_list.length === 0">暂无记录</p>
                        </div>
                    </Panel>
                </Collapse>
            </Form>
        </div>
        <div class="setting-btn">
            <Button type="primary" @click="startZip" :loading="loading">开始打包</Button>
        </div>
    </div>
</template>
<script>
    import util from '../../libs/util';

    export default {
        data() {
            return {
                loading: false,
                visual_packages: '1',
                packages_list: [],
            };
        },
        created (){
            this.packages_list = localStorage.getItem('__gxbBox__prodPackages') ? JSON.parse(localStorage.getItem('__gxbBox__prodPackages')) : [];
        },
        methods: {
            startZip() {
                this.loading = true;
                this.$http.get('/api/get_box_prod_zip/' + this.visual_packages).then((res) => {
                    this.loading = false;
                    res.data.time = util.formatDateTime(res.data.time);
                    this.packages_list.unshift(res.data);
                    localStorage.setItem('__gxbBox__prodPackages', JSON.stringify(this.packages_list));
                }).catch((err)=>{
                    this.loading = false;
                    console.error(err);
                    this.$Message.error('打包失败:' + JSON.stringify(err.response.data));
                });
            },
            downArchive(filename) {
                console.log(filename);
            }
        }
    };
</script>