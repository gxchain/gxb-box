<style scoped>
    .ivu-input-number {
        width: 100%;
    }

    h3 {
        padding-top: 10px;
        font-weight: normal;
    }

    .spin-container{
        width: 100%;
        height: 540px;
        position: relative;
    }

    .split-line {
        height: 1px;
        background: #eee;
        margin: 20px 0;
    }

    .setting-btn{
        text-align: center;
    }
</style>
<template>
    <div class="setting-api">
        <div class="spin-container" v-show="!loaded">
            <Spin fix></Spin>
        </div>
        <div v-show="loaded">
            <div class="setting-header">
                <h2>接入点</h2>
                <h3>修改API、启动端口及水龙头服务器</h3>
            </div>
            <div class="split-line"></div>
            <div class="setting-cont">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                    <FormItem label="启动端口" prop="port">
                        <InputNumber v-model="formValidate.port" placeholder="请输入端口"></InputNumber>
                    </FormItem>
                    <FormItem label="水龙头地址" prop="faucet_url">
                        <Input v-model="formValidate.faucet_url" placeholder="请输入水龙头地址"></Input>
                    </FormItem>
                    <Collapse value="api_list" style="margin-bottom: 20px">
                        <Panel name="api_list">
                            API服务器
                            <div slot="content">
                                <p v-for="(item,index) in api_list" :value="item" :key="index">{{ item }}</p>
                            </div>
                        </Panel>
                    </Collapse>
                </Form>
            </div>
            <div class="setting-btn">
                <Button type="primary" @click="saveConfig">保存配置</Button>
                <Button type="success" @click="addApiServer">添加API服务器</Button>
                <Button type="error" @click="removeApiServer">移除API服务器</Button>
            </div>
        </div>

        <Modal  v-model="add_modal" title="添加新的 websocket API" @on-ok="handleAdd">
            <Input v-model="add_api">
                <span slot="prepend">wss://</span>
            </Input>
        </Modal>

        <Modal v-model="remove_modal" title="删除 websocket API" @on-ok="handleRemove">
            <Select v-model="remove_api">
                <Option v-for="(item,index) in api_list" :value="item" :key="index">{{ item }}</Option>
            </Select>
        </Modal>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                loaded: false,
                formValidate: {
                    port: 3000,
                    faucet_url: ''
                },
                ruleValidate: {
                    port: [
                        {required: true, type: 'integer', message: '只能输入数字', trigger: 'blur' }
                    ],
                    faucet_url: [
                        {required: true, type: 'url', message: '水龙头地址必须为URL', trigger: 'blur'}
                    ]
                },
                commonSettings: {},
                api_list: [],
                add_modal: false,
                remove_modal: false,
                add_api: '',
                remove_api: ''
            };
        },
        created (){
            this.$http.get('/api/fetch_config').then((res) => {
                this.commonSettings =  res.data['common'];
                if (this.commonSettings && this.commonSettings.port && this.commonSettings.witnesses && this.commonSettings.faucet_url) {
                    this.api_list = this.commonSettings.witnesses;
                    this.formValidate.port = this.commonSettings.port;
                    this.formValidate.faucet_url = this.commonSettings.faucet_url;
                }
                this.loaded = true;
            }).catch((err)=>console.error(err));
        },
        methods: {
            handleAdd() {
                if (this.add_api === ''){
                    this.$Message.error('地址不能为空');
                }else{
                    this.api_list.push('wss://' + this.add_api);
                }
            },
            handleRemove() {
                if (this.remove_api === ''){
                    this.$Message.error('请选择要删除的地址');
                }else{
                    this.api_list = this.api_list.filter(t => t !== this.remove_api);
                }
            },
            saveConfig() {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        if (this.api_list.length > 0){
                            this.commonSettings.port = this.formValidate.port;
                            this.commonSettings.faucet_url = this.formValidate.faucet_url;
                            this.commonSettings.witnesses = this.api_list;
                            this.$http({
                                method: 'post',
                                url: '/api/write_config',
                                data: {
                                    config: this.commonSettings,
                                    type: 'common'
                                }
                            }).then(() => {
                                this.$Message.success('保存成功');
                                this.$emit('restart');
                            }).catch((err) => {
                                console.error(err);
                                this.$Message.error('保存失败:' + JSON.stringify(err.response.data));
                            });
                        }else{
                            this.$Message.error('API服务器列表不能为空');
                        }
                    } else {
                        this.$Message.error('验证失败');
                    }
                });
            },
            addApiServer() {
                this.add_modal = true;
            },
            removeApiServer() {
                this.remove_modal = true;
            },
        },
        computed: {
        }
    };
</script>