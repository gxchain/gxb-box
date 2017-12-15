# 产品介绍 ([For Eglish](README.md))

公信宝数据交易客户端GXB-Box是基于Nodejs开发的一个部署在商户和数据源本地的客户端，商户和数据源可以通过本地调用的方式购买和出售数据，数据交易的全程请求参数和回传数据都是经过加密处理的，而GXB-BOX简化了这样的一个流程。

## 环境依赖

必要环境: Node 6+

建议系统: OSX、Linux

## Node环境安装

建议使用NVM([Node Version Manager](https://github.com/creationix/nvm))进行安装:

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
. ~/.nvm/nvm.sh
nvm install v6
nvm use v6
```

## 克隆项目

```
git clone https://github.com/gxchain/gxb-box.git
```
## 快速开始

```
npm install
npm run build
npm run server-gui
```

## 开发模式启动

开发模式依赖于babel-node, 在克隆的工程下执行以下命令安装依赖:

```
npm install -g babel-node
npm install
npm run dev
```

## 对接文档
[https://doc.gxb.io/box/](https://doc.gxb.io/box/)

## 常见问题

### Q: 在设置了多重签名后,数据交易失败了
A: 多重签名涉及到效率问题, 数据交易采用活跃权限进行单重签名, 请勿在参与数据交易的账户中设置多重签名,以免造成签名验证失败

### Q: 发生错误:"获取初始信息失败,请检查:账号(merchant或者datasource)是否正确配置"
A: 检查config/config.json文件是否配置了错误的merchant或者datasource账户名, 如果是商户则**不需要**datasource配置，如果是数据源则**不一定需要**商户配置

商户配置示例:

```
{
  "common": {
    "port":"3000",
    "ipfs_addr": "/ip4/139.196.138.193/tcp/5001",
    "witnesses": [
      "wss://node1.gxb.io","wss://node5.gxb.io","wss://node8.gxb.io","wss://node11.gxb.io"
    ],
    "faucet_url": "https://opengateway.gxb.io"
  },
  "merchant":{
    "account_name": "sample_user",
    "private_key":"5Ka9YjFQtfUUX2DdnqkaPWH1rVeSeby7Cj2VdjRt79S9kKLvXR7",
    "callback_url":"http://localhost:3000/demo/callback",
    "privacy_request_timeout":120000,
    "default_timeout":8000
  }
}
```

数据源配置示例:

```
{
  "common": {
    "port":"3000",
    "ipfs_addr": "/ip4/139.196.138.193/tcp/5001",
    "witnesses": [
      "wss://node1.gxb.io","wss://node5.gxb.io","wss://node8.gxb.io","wss://node11.gxb.io"
    ],
    "faucet_url": "https://opengateway.gxb.io"
  },
  "datasource": {
    "account_name": "sample_datasource",
    "private_key": "5JLL3mqAFt2YHVJf8W3h9oUPP2sjceLYSSyEbSt1yMjeucxGH98",
    "service": "http://localhost:3000/demo/call",
    "subscribed_data_product": [
      "1.17.1"
    ]
  }
 }
```

