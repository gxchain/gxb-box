# Introduction （[中文](README-CN.md)）
GXB-BOX is a client-side, deployed at local merchant and datasource, and based on Node.js.
Merchant and datasource can trade data via locally call, data transfer is all the way encrypted, and GXB-BOX simplified this process.
## System requirement

(Required): Node 6+

(Operation system): OSX、Linux

## Install under Node environment

Recommend to use NVM([Node Version Manager](https://github.com/creationix/nvm)) for installation:

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
. ~/.nvm/nvm.sh
nvm install v6
nvm use v6
```

## Clone project

```
git clone https://github.com/gxchain/gxb-box.git
```

## Quick start

```
npm install
npm run build
npm run gui
```

## Development mode start

Development mode depends on babel-node, execute the following commands to install dependencies under cloned engineering mode:

```
npm install -g babel-node
npm install
npm start
```

## Docking files
[https://doc.gxb.io/box/](https://doc.gxb.io/box/)

## FAQ

### Q: Data transaction failed after set multi-signature
A: We recommend to use single signature for data transactions, due to the efficiency limitation of multi-signature
### Q: Error: "failed to get initial information, please check configuration of merchant account and datasource account".
A: Check config/config.json to see if the name of merchant or datasource is correct. For merchant, NO need for datasource configuration; for datasource, do not have to perform merchant configuration.

merchant configuration sample:

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

Datasource configuration sample:

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
