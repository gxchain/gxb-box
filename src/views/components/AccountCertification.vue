<style scoped>
    .step-btn-box {
        margin: 25px 0;
    }

    .info {
        color: #2d8cf0
    }

    .center {
        text-align: center;
    }

    .txt {
        position: relative;
        top: -8px;
        background: #fff;
        display: inline-block;
    }

    .spin-container {
        display: inline-block;
        width: 200px;
        height: 100px;
        position: relative;
    }

    .split-line {
        height: 1px;
        width: 100%;
        margin-bottom: 20px;
        border-top: 1px solid #eee;
        text-align: center;
    }

    .apply-merchant {
        margin-bottom: 15px;
    }

    .ivu-upload input[type=file] {
        display: block;
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: pointer
    }

    .upload-file-status {
        color: #19be6b;
        margin-left: 5px;
    }

    .view-btn {
        width: 32px;
        height: 32px;
        font-size: 16px;
        text-align: center;
        color: #80848f;
        position: absolute;
        right: 0;
        top: 8px;
        z-index: 3;
        cursor: pointer;
    }

    .view-btn:hover {
        color: #2d8cf0
    }

</style>
<template>
    <div class="account-authentication">
        <div class="spin-container" v-show="!loaded">
            <Spin fix></Spin>
        </div>
        <div v-if="loaded">
            <div class="account-certification" v-if="!certified&!is_applying">
                <div class="merchant-certification" v-if="account_type == 'merchant'">
                    <Alert type="info">如果你希望在公信宝进行数据交易，请完成商户实名认证</Alert>
                    <Button type="primary" @click="applyMerchant()">认证为商户</Button>
                </div>
                <div class="datasource-certification" v-else>
                    <div class="apply-merchant">
                        <Alert v-show="!merchant_certified" type="info">如果你希望在公信宝进行数据交易，请完成商户实名认证</Alert>
                        <Button v-show="!merchant_certified" type="primary" @click="applyMerchant()">认证为商户</Button>
                        <Alert type="success" v-show="merchant_certified">
                            <span class="info">{{merchant_name}}({{merchant_alias}})</span>已通过认证成为<span class="info">认证商户</span>
                        </Alert>
                    </div>
                    <div class="apply-datasource">
                        <Alert type="info">如果你希望在公信宝里成为数据源并出售数据，请完成数据源认证</Alert>
                        <Button type="primary" :disabled="!merchant_certified" @click="applyDatasource()">
                            <span v-show="!merchant_certified">请先完成商户认证</span>
                            <span v-show="merchant_certified">认证为数据源</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div class="account-applying" v-if="!certified&is_applying">
                <Alert type="warning">
                    已提交认证申请，请耐心等待审核，<span class="info">审核结果</span>将以邮件形式发送到联系人邮箱
                </Alert>
            </div>

            <div class="account-certified" v-if="certified">
                <Alert type="success">
                    <span class="info">{{merchant_name}}({{merchant_alias}})</span> 已通过认证成为
                    <span class="info" v-if="account_type === 'merchant'">认证商户</span>
                    <span class="info" v-else>认证数据源</span>
                    <div @click="applyDatasource()" v-if="((account_type === 'merchant') && (scene !== 'init'))">
                        <Tooltip content="升级为数据源" placement="top" class="view-btn">
                            <Icon type="person-add"></Icon>
                        </Tooltip>
                    </div>
                </Alert>
            </div>

            <div class="step-btn-box" v-if="scene === 'init'">
                <Button type="primary" @click="lastStep()">上一步</Button>
                <Button type="primary" @click="nextStep()" :disabled="!certified">下一步</Button>
            </div>
        </div>

        <Modal v-model="merchant_modal" width="80%">
            <p slot="header" class="center">
                <span>商户认证</span>
            </p>
            <Form ref="formMerchant" :model="formMerchant" :rules="merchantValidate" :label-width="110">
                <FormItem label="商户类型" prop="type">
                    <RadioGroup v-model="formMerchant.type">
                        <Radio label="enterprise">企业</Radio>
                    </RadioGroup>
                </FormItem>
                <div class="split-line"><span class="txt">基本信息</span></div>
                <FormItem label="公司名称" prop="name">
                    <i-input v-model="formMerchant.name" placeholder="公司名称用于发票抬头，请谨慎填写"></i-input>
                </FormItem>
                <FormItem label="公司别称" prop="alias">
                    <i-input v-model="formMerchant.alias" placeholder="公司的简称（将作为商户名），例如浙江电信"></i-input>
                </FormItem>
                <FormItem label="所在地区" prop="areas">
                    <Cascader :data="cityList" v-model="formMerchant.areas" placeholder="请选择所在地区，暂不支持港澳台地区"></Cascader>
                </FormItem>
                <FormItem label="详细地址" prop="address">
                    <i-input v-model="formMerchant.address" placeholder="补充详细的街道、小区、楼号、房号等地址"></i-input>
                </FormItem>
                <div class="split-line"><span class="txt">企业信息</span></div>
                <FormItem label="证件类型" prop="cert_type">
                    <RadioGroup v-model="formMerchant.cert_type">
                        <Radio label="normal">普通营业执照</Radio>
                        <Radio label="5in1">五证合一营业执照</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="营业执照编号" prop="cert_no">
                    <i-input v-model="formMerchant.cert_no"></i-input>
                </FormItem>
                <FormItem label="税务登记证编号" prop="tax_no" v-if="formMerchant.cert_type === 'normal'">
                    <i-input v-model="formMerchant.tax_no"></i-input>
                </FormItem>
                <FormItem label="组织机构编号" prop="org_no" v-if="formMerchant.cert_type === 'normal'">
                    <i-input v-model="formMerchant.org_no"></i-input>
                </FormItem>
                <FormItem label="营业执照副本" prop="cert_image">
                    <div class="ivu-form-item-content">
                        <div class="ivu-upload">
                            <div class="ivu-upload ivu-upload-select">
                                <input type="file" @change="handleCertImageChange" :disabled="upload_loading">
                                <Button class="ivu-btn ivu-btn-ghost" :loading="upload_loading">
                                    <Icon v-show="!upload_loading" type="ios-cloud-upload-outline"></Icon>
                                    <span v-show="!upload_loading">选择要上传文件的文件</span>
                                    <span v-show="upload_loading">文件上传中</span>
                                </Button>
                                <span v-show="filename" class="upload-file-status">{{filename}}上传成功</span>
                            </div>
                        </div>
                    </div>
                </FormItem>
                <div class="split-line"><span class="txt">联系人信息</span></div>
                <FormItem label="联系人姓名" prop="contact_name">
                    <i-input v-model="formMerchant.contact_name"></i-input>
                </FormItem>
                <FormItem label="联系人电话" prop="contact_tel">
                    <i-input v-model="formMerchant.contact_tel"></i-input>
                </FormItem>
                <FormItem label="联系人邮箱" prop="contact_mail">
                    <i-input v-model="formMerchant.contact_mail"></i-input>
                </FormItem>
            </Form>
            <div slot="footer" class="center">
                <Button type="primary" @click="sendMerchantForm('formMerchant')" :loading="loading">确认发送</Button>
                <Button type="ghost" @click="closeMerchant()">取消</Button>
            </div>
        </Modal>

        <Modal v-model="datasource_modal" width="80%">
            <p slot="header" class="center">
                <span>数据源认证</span>
            </p>
            <Form ref="formDatasource" :model="formDatasource" :rules="datasourceValidate" :label-width="110">
                <div class="split-line"><span class="txt">商户信息</span></div>
                <FormItem label="商户名称">
                    <span>{{formDatasource.merchant_name}}</span>
                </FormItem>
                <div class="split-line"><span class="txt">数据源信息</span></div>
                <FormItem label="生产数据描述" prop="ability_desc">
                    <i-input type="textarea" v-model="formDatasource.ability_desc" :rows="4"
                             placeholder="请对贵公司所生产的数据类型进行描述"></i-input>
                </FormItem>
                <FormItem label="数据生成能力" prop="data_desc">
                    <i-input type="textarea" v-model="formDatasource.data_desc" :rows="4"
                             placeholder="公信宝仅接入有数据原始生产能力的商户，请贵商户对准备接入公信宝数据源的数据生产过程加以简单说明"></i-input>
                </FormItem>

            </Form>
            <div slot="footer" class="center">
                <Button type="primary" @click="sendDatasourceForm('formDatasource')" :loading="loading">确认发送</Button>
                <Button type="ghost" @click="closeDatasource()">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {mapActions, mapGetters} from 'vuex';
    import {areaList} from '../../libs/china_regions';
    import util from '../../libs/util';
    import Handler from '../../libs/handler';

    export default {
        props: ['scene'],
        data () {
            const isValidCertNo = (rule, value, callback) => {
                if (util.isValidBusCode(value)) {
                    if ((this.formMerchant.cert_type === 'normal') && (value.length !== 15)) {
                        callback(new Error('普通营业执照长度为15位,请填写合法的营业执照编号'));
                    }
                    if ((this.formMerchant.cert_type === '5in1') && (value.length !== 18)) {
                        callback(new Error('请填写合法的18位营业执照编号(社会信用统一编号)'));
                    }
                    callback();
                } else {
                    callback(new Error('请填写合法的营业执照编号'));
                }
            };
            const isValidOrgCode = (rule, value, callback) => {
                if ((this.formMerchant.cert_type === 'normal') && (!util.isValidOrgCode(value))) {
                    callback(new Error('请填写合法的组织机构编号'));
                }
                callback();
            };
            const isValidTaxCode = (rule, value, callback) => {
                if ((this.formMerchant.cert_type === 'normal') && (!util.isValidTaxCode(value))) {
                    callback(new Error('请填写合法的税务登记证编号'));
                }
                callback();
            };
            const isValidPhone = (rule, value, callback) => {
                if (util.isValidPhone(value)) {
                    callback();
                } else {
                    callback(new Error('请填写正确联系人手机号'));
                }
            };
            return {
                filename: '',
                loaded: false,
                loading: false,
                upload_loading: false,
                merchant_modal: false,
                datasource_modal: false,
                is_applying: false,
                merchant_certified: false,
                datasource_certified: false,
                merchant_name: '',
                merchant_alias: '',
                cityList: areaList,
                formMerchant: {
                    type: 'enterprise',
                    name: '',
                    alias: '',
                    areas: [],
                    address: '',
                    cert_type: 'normal',
                    cert_no: '',
                    tax_no: '',
                    org_no: '',
                    cert_image: '',
                    contact_name: '',
                    contact_tel: '',
                    contact_mail: ''
                },
                merchantValidate: {
                    type: [
                        {required: true, message: '请选择商户类型', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请填写公司名称', trigger: 'blur'},
                        {type: 'string', max: 35, message: '不能超过35字', trigger: 'blur'}
                    ],
                    alias: [
                        {required: true, message: '请填写公司别称或简称', trigger: 'blur'},
                        {type: 'string', max: 35, message: '不能超过35字', trigger: 'blur'}
                    ],
                    areas: [
                        {required: true, type: 'array', min: 1, message: '请选择公司所在地省市区', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请补充详细地址', trigger: 'blur'},
                        {type: 'string', max: 50, message: '不能超过50字', trigger: 'blur'}
                    ],
                    cert_type: [
                        {required: true, message: '请选择证件类型', trigger: 'blur'}
                    ],
                    cert_no: [
                        {required: true, message: '请填写营业执照编号', trigger: 'blur'},
                        {validator: isValidCertNo, trigger: 'blur'}
                    ],
                    tax_no: [
                        {required: true, message: '请填写税务登记证编号', trigger: 'blur'},
                        {validator: isValidTaxCode, trigger: 'blur'}
                    ],
                    org_no: [
                        {required: true, message: '请填写组织机构编号', trigger: 'blur'},
                        {validator: isValidOrgCode, trigger: 'blur'}
                    ],
                    cert_image: [
                        {required: true, message: '请上传营业执照副本', trigger: 'blur'}
                    ],
                    contact_name: [
                        {required: true, message: '请填写联系人姓名', trigger: 'blur'},
                        {type: 'string', max: 35, message: '不能超过35字', trigger: 'blur'}
                    ],
                    contact_tel: [
                        {required: true, message: '请填写联系人手机号', trigger: 'blur'},
                        {validator: isValidPhone, trigger: 'blur'}
                    ],
                    contact_mail: [
                        {required: true, message: '请填写联系人邮箱', trigger: 'blur'},
                        {type: 'email', message: '请填写正确的联系人邮箱', trigger: 'blur'}
                    ]
                },
                formDatasource: {
                    merchant_name: '',
                    data_desc: '',
                    ability_desc: ''
                },
                datasourceValidate: {
                    data_desc: [
                        {required: true, message: '请填写数据描述', trigger: 'blur'}
                    ],
                    ability_desc: [
                        {required: true, message: '请填写生产能力描述', trigger: 'blur'}
                    ]
                }
            };
        },
        created () {
            // 初始化账号认证：获取认证状态
            this.$http.get('/api/fetch_account/' + this.account.account_name).then((res) => {
                this.merchant_certified = res.data.merchant_expiration_date !== '1970-01-01T00:00:00';
                this.datasource_certified = res.data.datasource_expiration_date !== '1970-01-01T00:00:00';
                if (this.merchant_certified && (this.account_type === 'merchant')) {
                    this.setCertified({certified: true});
                }
                if (this.datasource_certified) {
                    this.setCertified({certified: true});
                }
                return this.getApplyingStatus();
            }).catch((err) => {
                Handler.error(err);
            });
        },
        computed: {
            ...mapGetters({
                account: 'account',
                account_type: 'account_type',
                certified: 'certified',
                config: 'config',
                env_type: 'env_type'
            })
        },
        methods: {
            ...mapActions({
                setAccountType: 'setAccountType',
                setCertified: 'setCertified',
                setConfig: 'setConfig'
            }),
            applyMerchant () {
                this.merchant_modal = true;
            },
            closeMerchant () {
                this.merchant_modal = false;
            },
            applyDatasource () {
                this.datasource_modal = true;
            },
            closeDatasource () {
                this.datasource_modal = false;
            },
            upgradeDatasource () {
                // 升级为数据源
                this.config.common.account_type = 'datasource';
                this.config.datasource = {
                    account_name: this.account.account_name,
                    private_key: this.account.private_key
                };
                this.$http({
                    method: 'post',
                    url: '/api/save_config',
                    data: {config: this.config}
                }).then(() => {
                    this.setAccountType({account_type: 'datasource'});
                    this.setConfig({config: self.config});
                    return this.getMerchantInfo();
                }).catch((err) => {
                    Handler.error(err);
                });
            },
            getApplyingStatus () {
                this.$http.get('/api/is_applying/' + this.account.account_name + '?env=' + this.env_type).then((res) => {
                    if ((res.data.merchant_status === 'PASSED') && !this.merchant_certified) {
                        res.data.merchant_status = 'INITIAL';
                    }
                    if ((res.data.datasource_status === 'PASSED') && !this.datasource_certified) {
                        res.data.datasource_status = 'INITIAL';
                    }
                    this.is_applying = ((res.data.merchant_status === 'INITIAL') || (res.data.datasource_status === 'INITIAL'));
                    if (this.merchant_certified || this.datasource_certified) {
                        // 认证商户升级为数据源通过
                        if ((this.account_type === 'merchant') && this.datasource_certified) {
                            // 升级为数据源
                            this.upgradeDatasource();
                        } else {
                            this.getMerchantInfo();
                        }
                    } else {
                        this.loaded = true;
                    }
                }).catch((err) => {
                    Handler.error(err);
                });
            },
            getMerchantInfo () {
                this.$http.get('/api/fetch_merchant/' + this.account.account_name + '/' + this.account_type + '?env=' + this.env_type).then((res) => {
                    this.formDatasource.merchant_name = res.data.name;
                    this.merchant_name = res.data.name;
                    this.merchant_alias = res.data.alias;
                    this.loaded = true;
                }).catch((err) => {
                    Handler.error(err);
                });
            },
            sendMerchantForm (name) {
                this.loading = true;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.formMerchant.province = this.formMerchant.areas[0];
                        this.formMerchant.city = this.formMerchant.areas[1];
                        this.formMerchant.area = this.formMerchant.areas[2];

                        this.$http({
                            method: 'post',
                            url: '/api/apply_merchant?env=' + this.env_type,
                            data: {
                                'apply_info': this.formMerchant,
                                'account_name': this.account.account_name,
                                'account_type': this.account_type
                            }
                        }).then(() => {
                            this.loading = false;
                            this.merchant_modal = false;
                            this.is_applying = true;
                            this.$Message.success('申请成功');
                        }).catch((err) => {
                            this.loading = false;
                            this.$Message.error('申请失败:' + Handler.error(err));
                        });
                    } else {
                        this.loading = false;
                        this.$Message.error('验证失败');
                    }
                });
            },
            sendDatasourceForm (name) {
                this.loading = true;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http({
                            method: 'post',
                            url: '/api/apply_datasource?env=' + this.env_type,
                            data: {
                                'apply_info': this.formDatasource,
                                'account_name': this.account.account_name,
                                'account_type': this.account_type
                            }
                        }).then(() => {
                            this.loading = false;
                            this.datasource_modal = false;
                            this.is_applying = true;
                            this.$Message.success('申请成功');
                        }).catch((err) => {
                            this.loading = false;
                            this.$Message.error('申请失败:' + Handler.error(err));
                        });
                    } else {
                        this.loading = false;
                        this.$Message.error('验证失败');
                    }
                });
            },
            handleCertImageChange (e) {
                let file = e.target.files[0];
                if (!/\.(jpe?g|png)$/i.test(file.name)) {
                    this.$Message.error('格式不正确,请重新选择');
                    return false;
                }
                if (file.size > 5 * 1024 * 1024) {
                    this.$Message.error('图片大小不可超过5M');
                    return false;
                }
                this.filename = file.name;
                let reader = new FileReader();
                let self = this;
                this.upload_loading = true;
                reader.readAsDataURL(file);
                reader.onload = function () {
                    self.upload_loading = false;
                    self.formMerchant.cert_image = this.result;
                };
            },
            lastStep () {
                this.$emit('last');
            },
            nextStep () {
                this.$emit('next');
            }
        }
    };
</script>
