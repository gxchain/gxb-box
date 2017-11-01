<style scoped>
    .facolor-info{
        color: #2d8cf0;
    }

    .facolor-success{
        color: #19be6b;
    }

    .facolor-warning{
        color: #ff9900;
    }

    .facolor-error{
        color: #ed3f14;
    }

    .league {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        padding: 30px;
    }

    .spin-container{
        display: inline-block;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .loaded-container{
        width: 100%;
        height: 100%;
    }

    .league-intro{
        position: relative;
        min-height: 130px;
        display: flex;
        flex-direction: row;
    }

    .league-icon{
        width: 125px;
        height: 125px;
        border: 1px solid #eee;
        border-radius: 2px;
        padding: 30px;
    }

    .league-icon img{
        width: 100%;
        height: 100%;
    }

    .league-info{
        margin-left: 25px;
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .league-info h2 {
        font-size: 20px;
        line-height: 20px;
        padding: 10px 0;
        color: #555;
    }

    .league-info h2 strong {
        padding-right: 5px;
    }

    .league-info .tag{
        display: inline-block;
        font-size: 12px;
        line-height: 14px;
        vertical-align: top;
        border-radius: 2px;
        font-weight: 400;
        padding: 2px 6px;
        margin-right: 3px;
        color: #2d8cf0;
        border: 1px solid #2d8cf0;
    }
    .league-info .desc{
        line-height: 16px;
        height: 32px;
        overflow: hidden;
        padding: 4px 0 8px;
        color: #9ea7b4;
    }

    .league-info .arguments{
        flex: 1;
        display: flex;
        flex-direction: row;
    }

    .league-info .arguments .argument{
        flex: 1;
        align-self: center;
    }

    .league-info .arguments .argument p{
        height: 20px;
        line-height: 20px;
        color: #657180;
    }

    .member-info{
        display: inline-block;
        text-align: center;
        padding: 15px;
    }

    .member-info .member-icon{
        width: 60px;
        height: 60px;
    }

    .member-info .member-name{
        margin-top: 15px;
    }
</style>
<template>
    <div class="league">
        <div class="spin-container" v-show="!loaded">
            <Spin fix></Spin>
        </div>
        <div class="loaded-container" v-show="loaded">
            <Tabs value="1" :animated="false">
                <TabPane label="联盟数据" name="1">
                    <Row v-if="product_list.length > 0">
                        <Col span="4">
                            <Menu width="auto" :active-name="current" size="small" @on-select="changeProduct">
                                <MenuItem :name="index" v-for="(product,index) in product_list" :key="index">
                                    {{product.product_name}}
                                </MenuItem>
                            </Menu>
                        </Col>
                        <Col span="20">
                            <div is="Product" :product="current_product"></div>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane label="联盟介绍" name="2">
                    <div class="league-intro">
                        <div class="league-icon">
                            <img :src="league_info.icon">
                        </div>
                        <div class="league-info">
                            <h2>
                                <strong>{{league_info.league_name}}</strong>
                                <span class="tag">{{league_info.category_name}}</span>
                            </h2>
                            <p class="desc">{{league_info.brief_desc}}</p>
                            <div class="arguments">
                                <div class="argument">
                                    <p><strong>ID：</strong><span>{{this.$route.query.id}}</span></p>
                                    <p><strong>状态：</strong><span :class="league_info.status_class">{{league_info.status}}</span></p>
                                </div>
                                <div class="argument">
                                    <p><strong>数据产品：</strong><span>{{league_info.data_products_num}}个</span></p>
                                    <p><strong>数据源：</strong><span>{{league_info.members_num}}个</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPane>
                <TabPane label="联盟成员" name="3">
                    <div class="member-info" v-for="(member,index) in member_list" :key="index" v-if="member_list">
                        <div class="member-icon"><AccountImage :account="member.merchant_name"/></div>
                        <div class="member-name"><span>{{member.alias}}</span></div>
                    </div>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>
<script>
    import Product from './Product.vue';
    import AccountImage from './components/AccountImage.vue';

    export default {
        data () {
            return {
                loaded: false,
                league_info: {},
                product_list: [],
                member_list:[],
                current: 0,
                current_product: {}
            };
        },
        created() {
            this.$http.get('/api/fetch_league_info/' + this.$route.query.id).then((res)=>{
                this.league_info = res.data;
                switch (this.league_info.status){
                    case 0:
                        this.league_info.status = '未发布';
                        this.league_info.status_class = 'facolor-warning';
                        break;
                    case 1:
                        this.league_info.status = '正常';
                        this.league_info.status_class = 'facolor-success';
                        break;
                    case 2:
                        this.league_info.status = '已禁用';
                        this.league_info.status_class = 'facolor-error';
                        break;
                }
                this.league_info.data_products_num = this.league_info.data_products && this.league_info.data_products.length > 0 ? this.league_info.data_products.length : 0;
                this.league_info.members_num = this.league_info.members && this.league_info.members.length > 0 ? this.league_info.members.length : 0;
                this.$http.get('/api/fetch_data_market_categories_info/' + this.league_info.category_id).then((res)=>{
                    this.league_info.category_name = res.data.category_name;
                    this.$http.get('/api/fetch_league_data_products/' + JSON.stringify(this.league_info.data_products)).then((res)=>{
                        this.product_list = res.data;
                        this.current_product = this.product_list[0];
                        this.loaded = true;
                    }).catch((err)=>{
                        console.error(err);
                    });
                }).catch((err)=>{
                    console.error(err);
                });
            }).catch((err)=>{
                console.error(err);
            });

            this.$http.get('/api/fetch_league_members/' + this.$route.query.id).then((res)=>{
                this.member_list = res.data;
            }).catch((err)=>{
                console.error(err);
            });
        },
        methods: {
            changeProduct(index){
                this.current_product = this.product_list[index];
            }
        },
        components: {
            Product: Product,
            AccountImage: AccountImage
        }
    };
</script>