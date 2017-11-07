<style scoped>
    .ivu-input-number {
        width: 100%;
    }

    h3 {
        padding-top: 10px;
        font-weight: normal;
    }

    .subtitle{
        font-weight: bold;
        padding-bottom: 10px;
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

    .clearHistory{
        float: right;
        margin-top: 6px;
        margin-right: 6px;
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
                <Collapse value="packages_list" style="margin-bottom: 20px">
                    <Panel name="packages_list">
                        Quick Start
                        <div slot="content">
                            <div class="prediv">
                                <h3 class="subtitle">脚本启动</h3>
                                <p>Mac, Linux系统：</p>
                                <pre>bash start.sh</pre>
                                <p>Windows系统，在cmd下执行：</p>
                                <pre>./start.cmd</pre>
                                <h3 class="subtitle">手动启动</h3>
                                <pre v-show="visual_packages === '1'">npm install -production<br>npm run server</pre>
                                <pre v-show="visual_packages === '0'">npm install -production<br>npm run server-box</pre>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
                <Collapse value="packages_list" style="margin-bottom: 20px">
                    <Panel name="packages_list">
                        历史打包记录
                        <div slot="content">
                            <p v-for="(item,index) in packages_list" :value="item" :key="index" class="package">
                                <span class="name">{{ item.name }}</span>
                                <span class="size">{{ item.size }}</span>
                                <span class="time">{{ item.time }}</span>
                                <span class="download"></span><a :href="'/api/download/' + item.name">下载</a>
                            </p>
                            <p v-if="packages_list.length === 0">暂无记录</p>
                        </div>
                    </Panel>
                </Collapse>
            </Form>
        </div>
        <div class="setting-btn">
            <Button type="primary" @click="startZip" :loading="loading">开始打包</Button>
            <Button type="ghost" @click="clearHistory">清除记录</Button>
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
            clearHistory() {
                this.packages_list = [];
                localStorage.removeItem('__gxbBox__prodPackages');
            }
        }
    };
</script>