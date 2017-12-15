<template>
    <div class="env-type">
        <Alert type="info">首次体验盒子，请选择测试环境。</Alert>
        <Button type="primary"
                :loading="loadingTest"
                :disabled="loadingProd ? true : false"
                @click="changeType('development')">
            测试环境
        </Button>
        <Button type="primary"
                :loading="loadingProd"
                :disabled="loadingTest ? true : false"
                @click="changeType('production')">
            正式环境
        </Button>
    </div>
</template>
<script>
    import Handler from '../../libs/handler';
    import Util from '../../libs/util';
    import {mapActions} from 'vuex';

    export default {
        data () {
            return {
                loadingTest: false,
                loadingProd: false
            };
        },
        methods: {
            ...mapActions({
                setEnvType: 'setEnvType',
                setCommonSetting: 'setCommonSetting'
            }),
            changeType (type) {
                let _config;
                if (type === 'development') {
                    this.loadingTest = true;
                    _config = Util.testEnvConfig;
                } else {
                    this.loadingProd = true;
                    _config = Util.prodEnvConifg;
                }
                // 写入文件
                this.$http({
                    method: 'post',
                    url: '/api/write_config?env=' + type,
                    data: {
                        config: _config,
                        type: 'common'
                    }
                }).then(() => {
                    this.setCommonSetting({common_setting: _config});
                    localStorage.setItem('__gxbBox__env', type);
                    this.setEnvType({env_type: type});
                    location.reload();
                }).catch((err) => {
                    this.$Message.error('保存配置失败:' + Handler.error(err));
                });
            }
        }
    };
</script>
