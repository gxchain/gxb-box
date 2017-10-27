<style scoped>
    .market {
        width: 100%;
        height: 100%;
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


    .data-market-box{
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-left:30px;
    }

    .data-market-list{
        flex: 1;
    }

    .product-card{
        cursor: pointer;
        margin: 6px;
        position: relative;
    }

    .product-card img{
        width: 100%;
        height: 100%;
    }

    .product-box{
        height:110px;
    }

    .product-info{
        overflow: hidden;
    }

    .product-info .title{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .product-info .desc{
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
    }

    .product-info .title{
        margin-bottom: 10px;
    }

    .product-info .desc{
        margin-bottom: 20px;
    }

    .product-info .price{
        color: #38adff;
    }

    .product-info .price span{
        font-size: 16px;
    }

    .page-box{
        height: 25px;
        text-align: center;
        margin-top: 30px;
    }
</style>
<template>
    <div class="market">
        <div class="spin-container" v-show="!loaded">
            <Spin fix></Spin>
        </div>
        <Row class="loaded-container" v-show="loaded">
            <Col span="5">
                <Menu ref="dataMarketMenu" :active-name="active_category" width="auto" :open-names="['1']">
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="ios-keypad"></Icon>
                            自由市场
                        </template>
                        <MenuItem :name="category.id" v-for="(category,index) in free_data_categorys" :key="index">{{category.category_name}}</MenuItem>
                    </Submenu>
                    <Submenu name="2">
                        <template slot="title">
                            <Icon type="ios-people"></Icon>
                            联盟市场
                        </template>
                        <MenuItem :name="category.id" v-for="(category,index) in league_data_categorys" :key="index">{{category.category_name}}</MenuItem>
                    </Submenu>
                </Menu>
            </Col>
            <Col span="19" class="data-market-box">
                <Row class="data-market-list">
                    <Col span="8" v-for="(product,index) in product_list" :key="index">
                        <Card class="product-card">
                            <Row type="flex" align="middle" justify="center" class="product-box">
                                <Col span="6">
                                <img :src="product.icon">
                                </Col>
                                <Col span="16" offset="2">
                                <div class="product-info">
                                    <h3 class="title">{{product.product_name}}</h3>
                                    <p class="desc">{{product.brief_desc}}</p>
                                    <p class="price">价格: <span>{{formatterPrice(product.price)}}</span> GXC</p>
                                </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <div class="page-box">
                    <Page :curren="current" :total="total" :page-size="page_size" show-total show-elevator size="small" @on-change="changePage"></Page>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                active_category: null,
                free_data_categorys: [],
                league_data_categorys: [],
                loaded: false,
                current: 1,
                page_size: 9,
                product_list:[],
                total: 0,
            };
        },
        created (){
            this.$http.get('/api/fetch_data_market_categories/1').then((res)=>{
                if (res.data && res.data.length>0){
                    this.free_data_categorys = res.data;
                    this.active_category = this.free_data_categorys[0].id;
                    this.$http.get('/api/fetch_free_data_products/' + this.active_category + '/' + (this.current-1) + '/' + this.page_size).then((res)=>{
                        if (res.data){
                            this.product_list = res.data.list;
                            this.total = res.data.total;
                            this.loaded = true;
                        }
                    }).catch((err)=>{
                        console.error(err);
                    });
                }
                this.$nextTick(function() {
                    this.$refs.dataMarketMenu.updateActiveName();
                });
            }).catch((err)=>{
                console.error(err);
            });
            this.$http.get('/api/fetch_data_market_categories/2').then((res)=>{
                if (res.data && res.data.length>0){
                    this.league_data_categorys = res.data;
                }
            }).catch((err)=>{
                console.error(err);
            });
        },
        methods: {
            changePage(page){
                this.$http.get('/api/fetch_free_data_products/' + this.active_category + '/' + (page-1) + '/' + this.page_size).then((res)=>{
                    if (res.data){
                        this.product_list = [];
                        this.product_list = res.data.list;
                        this.total = res.data.total;
                        this.loaded = true;
                    }
                }).catch((err)=>{
                    console.error(err);
                    this.$Message.error(JSON.stringify(err.response.data));
                });
            },
            formatterPrice(price){
                return price / 100000;
            }
        }
    };
</script>