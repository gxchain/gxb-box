/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 129);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = __webpack_require__(0);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _gxbjs = __webpack_require__(6);

var _fs = __webpack_require__(60);

var _fs2 = _interopRequireDefault(_fs);

var _path = __webpack_require__(62);

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    init: function init() {
        var self = this;
        return new _bluebird2.default(function (resolve, reject) {
            try {
                self.config = JSON.parse(_fs2.default.readFileSync(_path2.default.resolve(process.cwd(), 'config.json'), 'utf-8'));
                resolve(self.config);
            } catch (ex) {
                reject(ex);
            }
        });
    },
    get_merchant_private_key: function get_merchant_private_key() {
        var config = this.config;
        return config.merchant && config.merchant.private_key ? _gxbjs.PrivateKey.fromWif(config.merchant.private_key) : '';
    },
    get_datasource_private_key: function get_datasource_private_key() {
        var config = this.config;
        return config.datasource && config.datasource.private_key ? _gxbjs.PrivateKey.fromWif(config.datasource.private_key) : '';
    }
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(83), __esModule: true };

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 4 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 5 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("gxbjs");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = __webpack_require__(2);

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = __webpack_require__(19);

var _assign2 = _interopRequireDefault(_assign);

var _bluebird = __webpack_require__(0);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _gxbjsWs = __webpack_require__(61);

var _gxbjs = __webpack_require__(6);

var _ConfigStore = __webpack_require__(1);

var _ConfigStore2 = _interopRequireDefault(_ConfigStore);

var _immutable = __webpack_require__(121);

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 获取账户信息
 * @param account_name
 * @returns {*}
 */
var account_cache = {};
var fetch_account = function fetch_account(account_name) {
    return new _bluebird2.default(function (resolve, reject) {
        if (account_cache[account_name]) {
            return resolve(account_cache[account_name]);
        }
        if (!account_name) {
            resolve();
        }
        return (0, _gxbjs.FetchChain)('getAccount', account_name).then(function (account) {
            account_cache[account_name] = account;
            account_cache[account.get('id')] = account;
            resolve(account);
        }).catch(function (ex) {
            reject(ex);
        });
    });
};

/**
 * 根据账号获取该账号active public_key
 * @param account_id
 */
var get_public_key_by_id = function get_public_key_by_id(account_id) {
    return new _bluebird2.default(function (resolve, reject) {
        fetch_account(account_id).then(function (account) {
            var pubKey = account.toJS().active.key_auths[0][0];
            resolve(pubKey);
        }).catch(function (ex) {
            reject(ex);
        });
    });
};

/**
 * 获取产品信息
 * @param prod_id
 */
var fetch_data_product = function fetch_data_product(prod_id) {
    // let start = new Date();
    return new _bluebird2.default(function (resolve, reject) {
        var prod = _gxbjs.ChainStore.objects_by_id.get(prod_id);
        if (prod) {
            prod = prod.toJS();
            prod.schema_contexts = prod.schema_contexts.map(function (schema) {
                if (typeof schema.schema_context == 'string') {
                    schema.schema_context = JSON.parse(schema.schema_context);
                }
                return schema;
            });
            resolve(prod);
        } else {

            return _gxbjsWs.Apis.instance().db_api().exec('get_objects', [[prod_id]]).then(function (resp) {
                // console.log('获取产品信息耗时:',new Date()-start);
                if (!resp || resp.length == 0) {
                    reject(new Error('product not found'));
                } else {
                    var _prod = (0, _assign2.default)({ schema_contexts: [] }, resp[0]);
                    _prod.schema_contexts = _prod.schema_contexts.map(function (schema) {
                        if (typeof schema.schema_context == 'string') {
                            schema.schema_context = JSON.parse(schema.schema_context);
                        }
                        return schema;
                    });
                    _gxbjs.ChainStore.objects_by_id.set(prod_id, _immutable2.default.fromJS(_prod));
                    resolve(_prod);
                }
            }).catch(function (ex) {
                reject(ex);
            });
        }
    });
};

/**
 * 通过request_id获取data transaction
 * @param request_id
 */
var get_data_transaction_by_request_id = function get_data_transaction_by_request_id(request_id) {
    return new _bluebird2.default(function (resolve, reject) {
        return _gxbjsWs.Apis.instance().db_api().exec('get_data_transaction_by_request_id', [request_id]).then(function (resp) {
            resolve(resp);
        }).catch(function (ex) {
            reject(ex);
        });
    });
};

/**
 * 加密Json
 * @param params
 * @param private_key
 * @param public_key
 * @returns {Buffer}
 */
var encrypt_params = function encrypt_params(params, private_key, public_key) {
    var msg = (0, _stringify2.default)(params, null, 0);
    return _gxbjs.Aes.encrypt_with_checksum(private_key, public_key, null, new Buffer(msg).toString('base64')).toString('base64');
};

/**
 * 解密消息体
 * @param msg
 * @param private_key
 */
var decrypt_msg = function decrypt_msg(msg, private_key, public_key_string) {
    var base64Str = _gxbjs.Aes.decrypt_with_checksum(private_key, public_key_string ? public_key_string : private_key.toPublicKey().toPublicKeyString(), null, new Buffer(msg, 'base64')).toString("utf-8");
    // let base64Str = Aes.decrypt_with_checksum(private_key, public_key_string?public_key_string:private_key.toPublicKey().toPublicKeyString(), null, msg).toString("utf-8");
    return new Buffer(base64Str, 'base64').toString();
};

/**
 * 生成request_id
 */
var generate_request_id = function generate_request_id() {
    var merchant_private_key = _ConfigStore2.default.get_merchant_private_key();
    var nonce = _gxbjs.TransactionHelper.unique_nonce_uint64();
    var request_id = _gxbjs.hash.sha256(merchant_private_key.toPublicKey().toPublicKeyString() + nonce).toString('hex');
    return request_id;
};

/**
 * 创建数据交易请求
 * @param league_id
 * @param prod_id
 * @param version
 * @param params
 * @param account_id
 * @param token
 */
var create_data_transaction = function create_data_transaction(request_id, league_id, prod_id, version, encrypted_params, account_id) {
    var merchant_private_key = _ConfigStore2.default.get_merchant_private_key();
    return new _bluebird2.default(function (resolve, reject) {

        var tr = new _gxbjs.TransactionBuilder();

        var base64Str = encrypted_params.toString('base64');
        // let start = new Date();
        var operation = {
            request_id: request_id,
            product_id: prod_id,
            version: version,
            params: base64Str,
            fee: {
                amount: 0,
                asset_id: '1.3.0'
            },
            requester: account_id,
            create_date_time: new Date().toISOString().split('.')[0]
        };
        if (league_id) {
            operation.league_id = league_id;
        }
        tr.add_type_operation('data_transaction_create', operation);
        // start = new Date();
        tr.set_required_fees().then(function () {
            // console.log('获取费用耗时',new Date()-start);
            tr.add_signer(merchant_private_key);
            // start = new Date();
            tr.broadcast(function (result) {
                // console.log('广播耗时:',new Date()-start);
                resolve(request_id);
            }).catch(function (ex) {
                console.error('transaction create broadcast:', ex);
                reject(ex);
            });
        }).catch(function (ex) {
            reject(ex);
        });
    });
};

/**
 * 支付数据交易
 * @param request_id
 * @param from
 * @param to
 * @param amount
 */
var pay_data_transaction = function pay_data_transaction(request_id, from, to, amount) {
    var merchant_private_key = _ConfigStore2.default.get_merchant_private_key();
    return new _bluebird2.default(function (resolve, reject) {

        var tr = new _gxbjs.TransactionBuilder();

        tr.add_type_operation('data_transaction_pay', {
            request_id: request_id,
            from: from,
            to: to,
            amount: {
                amount: amount,
                asset_id: "1.3.0"
            },
            fee: {
                amount: 0,
                asset_id: "1.3.0"
            }
        });

        tr.set_required_fees().then(function () {
            tr.add_signer(merchant_private_key);
            tr.broadcast(function (result) {
                resolve(result);
            }).catch(function (ex) {
                console.error('transaction pay broadcast:', ex);
                reject(ex);
            });
        }, function (ex) {
            console.error('transaction pay set required fees:', ex);
            reject(ex);
        });
    });
};

/**
 * 数据返回错误
 * @param request_id
 * @param datasource
 */
var data_transaction_datasource_validate_error = function data_transaction_datasource_validate_error(request_id, datasource) {
    var datasource_private_key = _ConfigStore2.default.get_datasource_private_key();
    return new _bluebird2.default(function (resolve, reject) {

        var tr = new _gxbjs.TransactionBuilder();
        tr.add_type_operation('data_transaction_datasource_validate_error', {
            request_id: request_id,
            datasource: datasource,
            fee: {
                amount: 0,
                asset_id: "1.3.0"
            }
        });

        tr.set_required_fees().then(function () {
            tr.add_signer(datasource_private_key);
            tr.broadcast(function (result) {
                resolve(result);
            }).catch(function (ex) {
                reject(ex);
            });
        }, function (ex) {
            console.error('transaction datasource validate error set required fees:', ex);
            reject(ex);
        });
    });
};

/**
 * 获取联盟信息
 * @param prod_id
 */
var fetch_league = function fetch_league(league_id) {
    return new _bluebird2.default(function (resolve, reject) {
        return _gxbjsWs.Apis.instance().db_api().exec('get_objects', [[league_id]]).then(function (resp) {
            if (!resp || resp.length == 0) {
                reject(new Error('league not found'));
            } else {
                resolve(resp[0]);
            }
        }).catch(function (ex) {
            reject(ex);
        });
    });
};

exports.default = {
    fetch_league: fetch_league,
    fetch_account: fetch_account,
    get_public_key_by_id: get_public_key_by_id,
    fetch_data_product: fetch_data_product,
    encrypt_params: encrypt_params,
    decrypt_msg: decrypt_msg,
    generate_request_id: generate_request_id,
    create_data_transaction: create_data_transaction,
    pay_data_transaction: pay_data_transaction,
    get_data_transaction_by_request_id: get_data_transaction_by_request_id,
    data_transaction_datasource_validate_error: data_transaction_datasource_validate_error
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(9)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(11);
var createDesc = __webpack_require__(24);
module.exports = __webpack_require__(8) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(20);
var IE8_DOM_DEFINE = __webpack_require__(52);
var toPrimitive = __webpack_require__(40);
var dP = Object.defineProperty;

exports.f = __webpack_require__(8) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(53);
var defined = __webpack_require__(30);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(37)('wks');
var uid = __webpack_require__(25);
var Symbol = __webpack_require__(3).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// 数据交易状态
var TRANSACTION_STATUS_MAP = {
    "0": "INITIAL",
    INITIAL: 'INITIAL',
    "1": "CONFIRMED",
    CONFIRMED: 'CONFIRMED',
    "99": "PRIVACY_REJECTED",
    PRIVACY_REJECTED: 'PRIVACY_REJECTED'
    // 数据源状态
};var DATA_SOURCE_STATUS_MAP = {
    "0": "INITIAL",
    INITIAL: 'INITIAL',
    "1": "UPLOADED",
    UPLOADED: "UPLOADED",
    "2": "PAYED",
    PAYED: "PAYED",
    "3": "NO_DATA",
    NO_DATA: "NO_DATA",
    "99": "VALIDATE_FAIL",
    VALIDATE_FAIL: "VALIDATE_FAIL"
    // 支付状态
};var PAY_STATUS = {
    NOT_PAYED: "NOT_PAYED",
    PAYING: "PAYING",
    PAYED: "PAYED",
    PAY_FAILED: "PAY_FAILED"
};

var DOWNLOAD_STATUS = {
    NOT_DOWNLOADED: "NOT_DOWNLOADED",
    DOWNLOADING: "DOWNLOADING",
    DOWNLOADED: "DOWNLOADED",
    DOWNLOAD_FAILED: "DOWNLOAD_FAILED"

    //系统错误
};var SYSTEM_ERROR_CODE = {
    NOT_FOUND: "NOT_FOUND",
    INVALID_PARAMS: "INVALID_PARAMS",
    DATASOURCE_OFFLINE: "DATASOURCE_OFFLINE",
    FORBIDDEN: "FORBIDDEN",
    BALANCE_NOT_ENOUGH: "BALANCE_NOT_ENOUGH",
    PRIVACY_REJECTED: "PRIVACY_REJECTED",
    UNKNOWN_ERROR: "UNKNOWN_ERROR"
};

exports.TRANSACTION_STATUS_MAP = TRANSACTION_STATUS_MAP;
exports.DATA_SOURCE_STATUS_MAP = DATA_SOURCE_STATUS_MAP;
exports.PAY_STATUS = PAY_STATUS;
exports.DOWNLOAD_STATUS = DOWNLOAD_STATUS;
exports.SYSTEM_ERROR_CODE = SYSTEM_ERROR_CODE;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/*

The MIT License (MIT)

Original Library 
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var colors = {};
module['exports'] = colors;

colors.themes = {};

var ansiStyles = colors.styles = __webpack_require__(80);
var defineProps = Object.defineProperties;

colors.supportsColor = __webpack_require__(81);

if (typeof colors.enabled === "undefined") {
  colors.enabled = colors.supportsColor;
}

colors.stripColors = colors.strip = function(str){
  return ("" + str).replace(/\x1B\[\d+m/g, '');
};


var stylize = colors.stylize = function stylize (str, style) {
  if (!colors.enabled) {
    return str+'';
  }

  return ansiStyles[style].open + str + ansiStyles[style].close;
}

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp = function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe,  '\\$&');
}

function build(_styles) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles;
  // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.
  builder.__proto__ = proto;
  return builder;
}

var styles = (function () {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function (key) {
    ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function () {
        return build(this._styles.concat(key));
      }
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles);

function applyStyle() {
  var args = arguments;
  var argsLen = args.length;
  var str = argsLen !== 0 && String(arguments[0]);
  if (argsLen > 1) {
    for (var a = 1; a < argsLen; a++) {
      str += ' ' + args[a];
    }
  }

  if (!colors.enabled || !str) {
    return str;
  }

  var nestedStyles = this._styles;

  var i = nestedStyles.length;
  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
  }

  return str;
}

function applyTheme (theme) {
  for (var style in theme) {
    (function(style){
      colors[style] = function(str){
        if (typeof theme[style] === 'object'){
          var out = str;
          for (var i in theme[style]){
            out = colors[theme[style][i]](out);
          }
          return out;
        }
        return colors[theme[style]](str);
      };
    })(style)
  }
}

colors.setTheme = function (theme) {
  if (typeof theme === 'string') {
    try {
      colors.themes[theme] = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
      applyTheme(colors.themes[theme]);
      return colors.themes[theme];
    } catch (err) {
      console.log(err);
      return err;
    }
  } else {
    applyTheme(theme);
  }
};

function init() {
  var ret = {};
  Object.keys(styles).forEach(function (name) {
    ret[name] = {
      get: function () {
        return build([name]);
      }
    };
  });
  return ret;
}

var sequencer = function sequencer (map, str) {
  var exploded = str.split(""), i = 0;
  exploded = exploded.map(map);
  return exploded.join("");
};

// custom formatter methods
colors.trap = __webpack_require__(74);
colors.zalgo = __webpack_require__(75);

// maps
colors.maps = {};
colors.maps.america = __webpack_require__(76);
colors.maps.zebra = __webpack_require__(79);
colors.maps.rainbow = __webpack_require__(77);
colors.maps.random = __webpack_require__(78)

for (var map in colors.maps) {
  (function(map){
    colors[map] = function (str) {
      return sequencer(colors.maps[map], str);
    }
  })(map)
}

defineProps(colors, init());

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(57);
var enumBugKeys = __webpack_require__(31);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = __webpack_require__(19);

var _assign2 = _interopRequireDefault(_assign);

var _keys = __webpack_require__(29);

var _keys2 = _interopRequireDefault(_keys);

var _level = __webpack_require__(123);

var _level2 = _interopRequireDefault(_level);

var _bluebird = __webpack_require__(0);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _async = __webpack_require__(116);

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = (0, _level2.default)('./.data');

var tmp = {};

exports.default = {
    put: function put(key, val) {
        tmp[key] = val;
        return new _bluebird2.default(function (resolve, reject) {
            var keys = (0, _keys2.default)(tmp);
            _async2.default.map(keys, function (k, cb) {
                db.put(k, tmp[k], function (err) {
                    if (err) {
                        cb(err);
                    } else {
                        delete tmp[k];
                        cb(null, k);
                    }
                });
            }, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(1);
                }
            });
        });
    },
    get: function get(key) {
        return new _bluebird2.default(function (resolve, reject) {
            db.get(key, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    del: function del(key) {
        return new _bluebird2.default(function (resolve, reject) {
            db.del(key, function (err) {
                if (err) {
                    reject(err);
                } else {
                    delete tmp[key];
                    resolve(true);
                }
            });
        });
    },
    find: function find(options) {
        return new _bluebird2.default(function (resolve, reject) {
            options = (0, _assign2.default)({ keys: true, values: true, limit: 20, fillCache: true }, options);
            if (options.prefix) {
                options.start = options.prefix;
                options.end = options.prefix.substring(0, options.prefix.length - 1) + String.fromCharCode(options.prefix[options.prefix.length - 1].charCodeAt() + 1);
            }

            var results = [];
            db.createReadStream(options).on('data', function (data) {
                results.push(data);
            }).on('error', function (err) {
                console.log('leveldb find error', err);
                return reject([]);
            }).on('close', function () {}).on('end', function () {
                return resolve(results);
            });
        });
    }
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = __webpack_require__(2);

var _stringify2 = _interopRequireDefault(_stringify);

var _LevelDBService = __webpack_require__(17);

var _LevelDBService2 = _interopRequireDefault(_LevelDBService);

var _FaucetService = __webpack_require__(27);

var _FaucetService2 = _interopRequireDefault(_FaucetService);

var _GXChainService = __webpack_require__(7);

var _GXChainService2 = _interopRequireDefault(_GXChainService);

var _IPFSService = __webpack_require__(46);

var _IPFSService2 = _interopRequireDefault(_IPFSService);

var _MerchantService = __webpack_require__(28);

var _MerchantService2 = _interopRequireDefault(_MerchantService);

var _TimeoutService = __webpack_require__(47);

var _TimeoutService2 = _interopRequireDefault(_TimeoutService);

var _DataTransactionHandler = __webpack_require__(45);

var _DataTransactionHandler2 = _interopRequireDefault(_DataTransactionHandler);

var _ConfigStore = __webpack_require__(1);

var _ConfigStore2 = _interopRequireDefault(_ConfigStore);

var _gxbjs = __webpack_require__(6);

var _bluebird = __webpack_require__(0);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _constants = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var league_data_product_id_reg = new RegExp('^1.' + _gxbjs.ChainTypes.object_type.league_data_product + '.\\d+$');

var taskQueue = [];

// var start = new Date().getTime();

exports.default = {

    /**
     * 初始化,从 leveldb中加载上一次的任务队列
     */
    init: function init() {
        return new _bluebird2.default(function (resolve, reject) {
            _LevelDBService2.default.get('merchant_tasks').then(function (queue) {
                //筛选出未超时的任务
                queue = JSON.parse(queue || '[]');
                taskQueue = queue.filter(function (task) {
                    return task.expire < new Date().getTime();
                });
                resolve(taskQueue);
            }).catch(function (ex) {
                if (/Key not found/.test(ex.message)) {
                    _LevelDBService2.default.put('merchant_tasks', "[]").then(function () {
                        taskQueue = [];
                        resolve(taskQueue);
                    });
                } else {
                    console.error('初始化商户任务队列失败', ex);
                    reject(ex);
                }
            });
        });
    },


    /**
     * 将交易请求加入任务队列
     * @param request_id
     * @param isPrivacy
     */
    enqueue: function enqueue(request_id, isPrivacy) {
        taskQueue = taskQueue.filter(function (task) {
            return new Date() - task.expire <= 0;
        });
        var task = {
            request_id: request_id,
            status: _constants.TRANSACTION_STATUS_MAP.INITIAL,
            expire: new Date().getTime() + (isPrivacy ? 120000 : 30000),
            pay_status: {},
            download_status: {}
        };
        taskQueue.push(task);
    },


    /**
     * 将交易请求移出任务队列
     * @param request_id
     */
    dequeue: function dequeue(request_id) {
        taskQueue = taskQueue.filter(function (task) {
            return task.request_id != request_id;
        });
    },


    /**
     * 获取交易任务
     * @param request_id
     * @returns {*}
     */
    get_task: function get_task(request_id) {
        return taskQueue.find(function (task) {
            return task.request_id == request_id;
        });
    },


    /**
     * 查询某一个request是否在任务队列中
     * @param request_id
     * @returns {boolean}
     */
    exist: function exist(request_id) {
        return !!this.get_task(request_id);
    },


    /**
     * 持久化存储任务队列, 在程序异常关闭的时候尝试保存现场
     */
    store: function store() {
        _LevelDBService2.default.put('merchant_tasks', (0, _stringify2.default)(taskQueue));
    },


    /**
     * 获取某一个request的状态
     * @param request_id
     * @returns {*}
     */
    get_status: function get_status(request_id) {
        return this.get_task(request_id).status;
    },


    /**
     * 设置某一个request的状态
     * @param request_id
     * @param status
     */
    set_status: function set_status(request_id, status) {
        if (!_constants.TRANSACTION_STATUS_MAP[status]) {
            console.error('状态不存在:', status);
        } else {
            taskQueue = taskQueue.map(function (task) {
                if (task.request_id == request_id) {
                    task.status = status;
                }
                return task;
            });
        }
    },


    /**
     * 设置对某一个数据源的支付状态
     * @param request_id
     * @param datasource
     * @param status
     */
    set_pay_status: function set_pay_status(request_id, datasource, status) {
        var task = this.get_task(request_id);
        if (!_constants.PAY_STATUS[status]) {
            return;
        } else if (!task) {
            return;
        }
        task.pay_status[datasource] = status;
    },


    /**
     * 获取对某一个数据源的支付状态
     * @param request_id
     * @param datasource
     */
    get_pay_status: function get_pay_status(request_id, datasource) {
        var task = this.get_task(request_id);
        if (!task) {
            return;
        }
        if (!task.pay_status[datasource]) {
            task.pay_status[datasource] = _constants.PAY_STATUS.NOT_PAYED;
        }

        return task.pay_status[datasource];
    },


    /**
     * 设置从某一个数据源的下载状态
     * @param request_id
     * @param datasource
     * @param status
     */
    set_download_status: function set_download_status(request_id, datasource, status) {
        var task = this.get_task(request_id);
        if (!_constants.DOWNLOAD_STATUS[status]) {
            return;
        } else if (!task) {
            return;
        }
        task.download_status[datasource] = status;
        taskQueue = taskQueue.map(function (t) {
            if (t.request_id == request_id) {
                return task;
            }
            return t;
        });
    },


    /**
     * 获取从某一个数据源的下载状态
     * @param request_id
     * @param datasource
     */
    get_download_status: function get_download_status(request_id, datasource) {
        var task = this.get_task(request_id);
        if (!task) {
            return;
        }

        if (!task.download_status[datasource]) {
            task.download_status[datasource] = _constants.DOWNLOAD_STATUS.NOT_DOWNLOADED;
        }

        return task.download_status[datasource];
    },


    /**
     * 支付给某一个数据源
     * @param request_id
     * @param product_id
     * @param to
     */
    pay_data_transaction: function pay_data_transaction(request_id, product_id, league_id, to) {
        var config = _ConfigStore2.default.config;
        var self = this;
        var current_pay_status = this.get_pay_status(request_id, to);
        if (current_pay_status != _constants.PAY_STATUS.NOT_PAYED) {
            // already payed for this datasource, but please don't worry, witness will make a double check if you pay again
            return;
        }
        var promises = [_GXChainService2.default.fetch_data_product(product_id), _GXChainService2.default.fetch_account(config.merchant.account_name)];

        var isLeague = league_data_product_id_reg.test(product_id);
        if (isLeague) {
            promises.push(_GXChainService2.default.fetch_league(league_id));
        }
        this.set_pay_status(request_id, to, _constants.PAY_STATUS.PAYING);
        _bluebird2.default.all(promises).then(function (resp) {
            var amount = 0;
            if (isLeague) {
                var league = resp[2];
                var index = league.data_products.indexOf(product_id);
                amount = league.prices[index];
            } else {
                amount = resp[0].price;
            }
            var from = resp[1].get('id');
            _GXChainService2.default.pay_data_transaction(request_id, from, to, amount).then(function (resp) {
                console.log('成功向:', to, '支付一笔:', amount, '的费用');
                self.set_pay_status(request_id, to, _constants.PAY_STATUS.PAYED);
            }).catch(function (ex) {
                self.set_pay_status(request_id, to, _constants.PAY_STATUS.PAY_FAILED);
                var isPayForSelf = /from != to/.test(ex.message);
                var isLowBalance = /Insufficient Balance/.test(ex.message);
                var message = ex.message;
                if (isPayForSelf) {
                    message = '支付失败,不能向自己支付';
                }
                if (isLowBalance) {
                    message = '支付失败,余额不足';
                }
                _MerchantService2.default.notify({
                    request_id: request_id,
                    body: {
                        code: isLowBalance ? _constants.SYSTEM_ERROR_CODE.BALANCE_NOT_ENOUGH : _constants.SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                        message: message
                    }
                });
            });
        }).catch(function (ex) {
            console.error('获取支付账号和产品信息失败:', ex);
            self.set_pay_status(request_id, to, _constants.PAY_STATUS.PAY_FAILED);
            _MerchantService2.default.notify({
                request_id: request_id,
                body: {
                    code: _constants.SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                    message: ex.message
                }
            });
        });
    },


    /**
     * 自由市场解密数据包
     * @param params
     * @param datasource
     */
    decrypt_params_for_free_market: function decrypt_params_for_free_market(params, datasource) {
        var merchant_private_key = _ConfigStore2.default.get_merchant_private_key();
        return new _bluebird2.default(function (resolve, reject) {
            _GXChainService2.default.get_public_key_by_id(datasource).then(function (pubKey) {
                var decryptedParams = _GXChainService2.default.decrypt_msg(params, merchant_private_key, pubKey);
                resolve(JSON.parse(decryptedParams));
            }).catch(function (ex) {
                console.error('获取公钥失败', ex, datasource);
                reject(ex);
            });
        });
    },


    /**
     * 联盟市场解密数据包
     * @param params
     * @param requester
     * @param league_id
     * @param request_id
     */
    decrypt_params_for_league: function decrypt_params_for_league(params, requester, league_id, request_id) {
        var config = _ConfigStore2.default.config;
        var merchant_private_key = _ConfigStore2.default.get_merchant_private_key();
        return new _bluebird2.default(function (resolve, reject) {
            // var start = new Date();
            _FaucetService2.default.request_for_a_token(requester, league_id, request_id, config.merchant.account_name, merchant_private_key).then(function (resp) {
                var token = resp.data.token;
                // console.log('获取token耗时:', new Date() - start);
                var private_key = _gxbjs.PrivateKey.fromSeed(_gxbjs.key.normalize_brainKey(token));
                var public_key = private_key.toPublicKey().toPublicKeyString();
                var decryptedParams = _GXChainService2.default.decrypt_msg(params, private_key, public_key);
                resolve(JSON.parse(decryptedParams));
            }).catch(function (ex) {
                console.error('获取联盟数据交换凭证失败:', request_id, " ", ex);
                reject(ex);
            });
        });
    },


    /**
     * 根据request_id和数据源account_id获取ipfs_hash,下载数据并回调给商户
     * @param request_id
     * @param datasource
     */
    download_data: function download_data(data_transaction, datasource) {
        // var start = new Date().getTime();
        var self = this;
        var config = _ConfigStore2.default.config;
        var requester = data_transaction.requester,
            league_id = data_transaction.league_id,
            request_id = data_transaction.request_id,
            product_id = data_transaction.product_id;


        if (self.get_download_status(request_id, datasource) != _constants.DOWNLOAD_STATUS.NOT_DOWNLOADED) {
            return;
        }
        self.set_download_status(request_id, datasource, _constants.DOWNLOAD_STATUS.DOWNLOADING);
        //获取数据hash
        _FaucetService2.default.fetch_ipfs_hash(request_id, datasource).then(function (resp) {
            // console.log('网关获取ipfs hash耗时:', new Date().getTime() - start);
            var data_hash = resp.data.data_hash;
            // start = new Date().getTime();
            _IPFSService2.default.download(resp.data.hash, config.common.ipfs_addr).then(function (encryptedData) {
                // console.log('下载耗时:', new Date().getTime() - start);
                var promises = [];
                var isLeague = league_data_product_id_reg.test(product_id);
                if (isLeague) {
                    promises.push(self.decrypt_params_for_league(encryptedData, requester, league_id, request_id));
                } else {
                    promises.push(self.decrypt_params_for_free_market(encryptedData, datasource));
                }
                // start = new Date().getTime();
                //解密消息体
                _bluebird2.default.all(promises).then(function (result) {
                    // console.log('返回数据解密耗时:', new Date().getTime() - start);
                    var decryptedParams = result[0];
                    var notice = {
                        request_id: request_id,
                        datasource: datasource,
                        body: decryptedParams
                    };
                    self.set_download_status(request_id, datasource, _constants.DOWNLOAD_STATUS.DOWNLOADED);
                    //数据回调

                    _MerchantService2.default.notify(notice);
                }).catch(function (ex) {
                    console.error('解密消息体失败', ex);
                });
            }).catch(function (ex) {
                console.error('下载数据失败:', request_id, ex);
                self.set_download_status(request_id, datasource, _constants.DOWNLOAD_STATUS.DOWNLOAD_FAILED);
                _MerchantService2.default.notify({
                    request_id: request_id,
                    datasource: datasource,
                    body: {
                        code: _constants.SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                        message: '下载数据失败:' + ex.message
                    }
                });
            });
        }).catch(function (ex) {
            console.error('获取数据hash失败:', request_id, ex);
            self.set_download_status(request_id, datasource, _constants.DOWNLOAD_STATUS.DOWNLOAD_FAILED);
            _MerchantService2.default.notify({
                request_id: request_id,
                datasource: datasource,
                body: {
                    code: _constants.SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                    message: ex.message
                }
            });
        });
    },


    /**
     * 数据源数据格式验证失败
     */
    validate_error: function validate_error(data_transaction, datasource) {
        if (this.get_download_status(data_transaction.request_id, datasource) != _constants.DOWNLOAD_STATUS.NOT_DOWNLOADED) {
            return;
        }
        this.set_download_status(data_transaction.request_id, datasource, _constants.DATA_SOURCE_STATUS_MAP.VALIDATE_FAIL);
        _MerchantService2.default.notify({
            request_id: data_transaction.request_id,
            datasource: datasource,
            body: {
                code: _constants.SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                message: '数据源返回数据格式验证失败'
            }
        });
    },


    /**
     * 处理交易请求
     * @param data_transaction
     */
    deal_with_data_transaction: function deal_with_data_transaction(data_transaction) {

        var self = this;
        var request_id = data_transaction.request_id;

        if (!this.exist(request_id)) {
            return;
        }
        var request_status = this.get_status(request_id);

        var next_request_status = _constants.TRANSACTION_STATUS_MAP[data_transaction.status];
        var next_datasource_status = data_transaction.datasources_status;

        // 不处理已拒绝的交易
        if (request_status == _constants.TRANSACTION_STATUS_MAP.PRIVACY_REJECTED) {
            return;
        }

        // 处理被确认的交易
        if (next_request_status == _constants.TRANSACTION_STATUS_MAP.CONFIRMED) {
            this.set_status(request_id, _constants.TRANSACTION_STATUS_MAP.CONFIRMED);
            // 遍历每个数据源的状态
            next_datasource_status.forEach(function (item) {
                var status = _constants.DATA_SOURCE_STATUS_MAP[item.status];
                if (status != _constants.DATA_SOURCE_STATUS_MAP.INITIAL) {
                    _TimeoutService2.default.remove(data_transaction.request_id);
                }
                // 数据源已上传数据,则支付这笔交易
                if (status == _constants.DATA_SOURCE_STATUS_MAP.UPLOADED) {
                    // start = new Date().getTime();
                    self.pay_data_transaction(request_id, data_transaction.product_id, data_transaction.league_id, item.datasource);
                }
                // 支付已确认, 则可以下载数据
                else if (status == _constants.DATA_SOURCE_STATUS_MAP.PAYED) {
                        // console.log('开始支付到开始下载耗时:', new Date().getTime() - start);
                        self.download_data(data_transaction, item.datasource);
                    } else if (status == _constants.DATA_SOURCE_STATUS_MAP.VALIDATE_FAIL) {
                        self.validate_error(data_transaction, item.datasource);
                    }
            });
        }
        // 处理被拒绝的交易
        else if (next_request_status == _constants.TRANSACTION_STATUS_MAP.PRIVACY_REJECTED) {
                this.set_status(request_id, _constants.TRANSACTION_STATUS_MAP.PRIVACY_REJECTED);
                _MerchantService2.default.notify({
                    request_id: request_id,
                    body: {
                        code: _constants.SYSTEM_ERROR_CODE.PRIVACY_REJECTED,
                        message: '隐私查询被用户拒绝'
                    }
                });
            }
    },


    /**
     * 异常重启后尝试继续原来未完成未并且未过期的任务
     */
    resume: function resume() {
        var self = this;
        taskQueue.forEach(function (task) {
            var delta = task.expire - new Date().getTime();
            if (delta > 0) {
                _GXChainService2.default.get_data_transaction_by_request_id(task.request_id).then(_DataTransactionHandler2.default.schedule);
            } else {
                self.dequeue(task.request_id);
            }
        });
    }
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(84), __esModule: true };

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(22);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var core = __webpack_require__(4);
var ctx = __webpack_require__(91);
var hide = __webpack_require__(10);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = __webpack_require__(2);

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = __webpack_require__(29);

var _keys2 = _interopRequireDefault(_keys);

var _ConfigStore = __webpack_require__(1);

var _ConfigStore2 = _interopRequireDefault(_ConfigStore);

var _superagent = __webpack_require__(43);

var _superagent2 = _interopRequireDefault(_superagent);

var _bluebird = __webpack_require__(0);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _GXChainService = __webpack_require__(7);

var _GXChainService2 = _interopRequireDefault(_GXChainService);

var _gxbjs = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sortJSON = function sortJSON(json) {
    var keys = (0, _keys2.default)(json);
    keys.sort();
    var result = {};
    keys.forEach(function (k) {
        result[k] = json[k];
    });
    return result;
};

var sign = function sign() {
    var body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var pKey = arguments[1];

    if (!pKey) {
        pKey = _ConfigStore2.default.get_merchant_private_key();
    }
    return _gxbjs.Signature.sign(body, pKey).toHex();
};

exports.default = {

    /**
     * 商户|数据源方法 - 联盟成员请求数据交换授权令牌
     * @param name 姓名
     * @param idcard 身份证号
     * @param mobile 手机号
     * @param request_id 请求id
     */
    request_for_a_token: function request_for_a_token(requester, league_id, request_id, account_name, private_key) {

        var params = {
            league_id: league_id,
            request_id: request_id,
            requester: requester
        };
        var config = _ConfigStore2.default.config;

        return new _bluebird2.default(function (resolve, reject) {

            _GXChainService2.default.fetch_account(account_name).then(function (account) {
                params.account_id = account.get('id');
                params.signature = sign((0, _stringify2.default)(sortJSON(params)), private_key);
                _superagent2.default.post(config.common.faucet_url + '/chain/auth_token').send(params).end(function (err, resp) {
                    if (err) {
                        reject(new Error(resp.body && (resp.body.message || resp.body.base[0])));
                    } else {
                        resolve(resp.body);
                    }
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    },


    /**
     * 商户方法 - 发送短信授权验证
     * @param name
     * @param idcard
     * @param mobile
     * @param request_id
     */
    send_auth_msg: function send_auth_msg(name, idcard, mobile, request_id) {

        var params = {
            name: name,
            idcard: idcard,
            mobile: mobile,
            request_id: request_id
        };
        var config = _ConfigStore2.default.config;

        return new _bluebird2.default(function (resolve, reject) {
            _GXChainService2.default.fetch_account(config.merchant.account_name).then(function (account) {
                params.account_id = account.get('id');
                params.signature = sign((0, _stringify2.default)(sortJSON(params)));
                _superagent2.default.post(config.common.faucet_url + '/chain/auth_msg').send(params).end(function (err, resp) {
                    if (err) {
                        console.error('发送授权短信失败:', resp.body && (resp.body.message || resp.body.base[0]));
                        reject(new Error(resp && resp.body ? resp.body.message : '网络故障'));
                    } else {
                        resolve(resp.body);
                    }
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    },


    /**
     * 数据源方法 - 保存数据hash
     * @param hash
     */
    store_data: function store_data(data, request_id, data_hash) {
        var params = {
            data: data,
            request_id: request_id,
            data_hash: data_hash
        };
        var config = _ConfigStore2.default.config;
        var datasource_private_key = _ConfigStore2.default.get_datasource_private_key();

        return new _bluebird2.default(function (resolve, reject) {
            _GXChainService2.default.fetch_account(config.datasource.account_name).then(function (account) {
                params.account_id = account.get('id');
                params.signature = sign((0, _stringify2.default)(sortJSON(params)), datasource_private_key);
                _superagent2.default.post(config.common.faucet_url + '/chain/store_data').send(params).end(function (err, resp) {
                    if (err) {
                        console.error('保存数据hash失败:', resp.body && (resp.body.message || resp.body.base[0]));
                        reject(new Error(resp && resp.body ? resp.body.message || resp.body.base[0] : '网络故障'));
                    } else {
                        resolve(resp.body);
                    }
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    },

    /**
     * 商户方法-通过request_id获取hash
     * @param request_id
     */
    fetch_ipfs_hash: function fetch_ipfs_hash(request_id, datasource) {
        var params = {
            request_id: request_id,
            datasource: datasource
        };
        var config = _ConfigStore2.default.config;

        return new _bluebird2.default(function (resolve, reject) {
            _GXChainService2.default.fetch_account(config.merchant.account_name).then(function (account) {
                params.account_id = account.get('id');
                params.signature = sign((0, _stringify2.default)(sortJSON(params)));
                _superagent2.default.get(config.common.faucet_url + '/chain/get_hash').query(params).end(function (err, resp) {
                    if (err) {
                        console.error('获取ipfs_hash失败:', err.body);
                        reject(new Error(resp.body && (resp.body.message || resp.body.base[0])));
                    } else {
                        resolve(resp.body);
                    }
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    }
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = __webpack_require__(2);

var _stringify2 = _interopRequireDefault(_stringify);

var _superagent = __webpack_require__(43);

var _superagent2 = _interopRequireDefault(_superagent);

var _ConfigStore = __webpack_require__(1);

var _ConfigStore2 = _interopRequireDefault(_ConfigStore);

var _MerchantTask = __webpack_require__(18);

var _MerchantTask2 = _interopRequireDefault(_MerchantTask);

var _LevelDBService = __webpack_require__(17);

var _LevelDBService2 = _interopRequireDefault(_LevelDBService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    notify: function notify(params) {
        var config = _ConfigStore2.default.config;
        _LevelDBService2.default.put('request-' + params.request_id + '-' + new Date().getTime(), (0, _stringify2.default)(params));
        if (config.merchant.callback_url) {
            _superagent2.default.post(config.merchant.callback_url).send(params).end(function (err, resp) {
                console.log('callback已提交');
                _MerchantTask2.default.dequeue(params.request_id);
            });
        }
    }
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(85), __esModule: true };

/***/ }),
/* 30 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(11).f;
var has = __webpack_require__(5);
var TAG = __webpack_require__(13)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(37)('keys');
var uid = __webpack_require__(25);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 38 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(30);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(22);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(3);
var core = __webpack_require__(4);
var LIBRARY = __webpack_require__(33);
var wksExt = __webpack_require__(42);
var defineProperty = __webpack_require__(11).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(13);


/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = require("superagent");

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ConfigStore = __webpack_require__(1);

var _ConfigStore2 = _interopRequireDefault(_ConfigStore);

var _MerchantTask = __webpack_require__(18);

var _MerchantTask2 = _interopRequireDefault(_MerchantTask);

var _DatasourceTask = __webpack_require__(48);

var _DatasourceTask2 = _interopRequireDefault(_DatasourceTask);

var _constants = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    /**
     * 数据交易调度函数
     * @param data_transaction
     */
    schedule: function schedule(data_transaction) {
        var request_id = data_transaction.request_id;
        var product_id = data_transaction.product_id;
        var status = _constants.TRANSACTION_STATUS_MAP[data_transaction.status];
        var config = _ConfigStore2.default.config;
        var is_product_subscribed = config.datasource && config.datasource.subscribed_data_product && config.datasource.subscribed_data_product.find(function (prod) {
            return prod == product_id;
        });
        var is_request_in_queue = _MerchantTask2.default.exist(request_id);

        // 已确认的交易, 数据源可以回传数据
        if (status == _constants.TRANSACTION_STATUS_MAP.CONFIRMED && is_product_subscribed) {
            _DatasourceTask2.default.deal_with_data_transaction(data_transaction);
        }
        // 已确认的交易, 商户根据状态进行处理
        if (status == _constants.TRANSACTION_STATUS_MAP.CONFIRMED && is_request_in_queue) {
            _MerchantTask2.default.deal_with_data_transaction(data_transaction);
        }
    }
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = __webpack_require__(0);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ipfsApi = __webpack_require__(122);

var _ipfsApi2 = _interopRequireDefault(_ipfsApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    /**
     * 上传数据到ipfs
     * @param data
     */
    upload: function upload(data, addr) {
        var ipfs_api = (0, _ipfsApi2.default)(addr);
        return new _bluebird2.default(function (resolve, reject) {
            var obj = {
                Data: new Buffer(data),
                Links: []
            };
            ipfs_api.object.put(obj, function (err, node) {
                if (err) {
                    reject(err);
                } else {
                    var nodeJSON = node.toJSON();
                    resolve(nodeJSON.multihash);
                }
            });
        });
    },
    /**
     * 通过hash从ipfs下载数据
     * @param hash
     */
    download: function download(hash, addr) {
        var ipfs_api = (0, _ipfsApi2.default)(addr);
        return new _bluebird2.default(function (resolve, reject) {
            ipfs_api.object.data(hash, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString());
                }
            });
        });
    }
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _MerchantService = __webpack_require__(28);

var _MerchantService2 = _interopRequireDefault(_MerchantService);

var _constants = __webpack_require__(14);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var timeoutCollection = {};
exports.default = {
    /**
     * 添加超时通知任务
     * @param request_id
     * @param timeout
     */
    add: function add(request_id, timeout) {
        if (!timeoutCollection[request_id]) {
            timeoutCollection[request_id] = setTimeout(function () {
                _MerchantService2.default.notify({
                    request_id: request_id,
                    body: {
                        code: _constants.SYSTEM_ERROR_CODE.DATASOURCE_OFFLINE,
                        message: timeout / 1000 + '\u79D2\u5185\u65E0\u54CD\u5E94,\u53EF\u80FD\u539F\u56E0:\n1. \u6570\u636E\u6E90\u79BB\u7EBF\u4E86\n2. \u6D89\u53CA\u4E2A\u4EBA\u9690\u79C1\u6570\u636E\u4EA4\u6613\u672A\u5F97\u5230\u672C\u4EBA\u6388\u6743'
                    }
                });
            }, timeout);
        }
    },


    /**
     * 取消超时通知任务
     * @param request_id
     */
    remove: function remove(request_id) {
        if (timeoutCollection[request_id]) {
            clearTimeout(timeoutCollection[request_id]);
            delete timeoutCollection[request_id];
        }
    }
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = __webpack_require__(29);

var _keys2 = _interopRequireDefault(_keys);

var _stringify = __webpack_require__(2);

var _stringify2 = _interopRequireDefault(_stringify);

var _bluebird = __webpack_require__(0);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _DatasourceService = __webpack_require__(67);

var _DatasourceService2 = _interopRequireDefault(_DatasourceService);

var _GXChainService = __webpack_require__(7);

var _GXChainService2 = _interopRequireDefault(_GXChainService);

var _FaucetService = __webpack_require__(27);

var _FaucetService2 = _interopRequireDefault(_FaucetService);

var _IPFSService = __webpack_require__(46);

var _IPFSService2 = _interopRequireDefault(_IPFSService);

var _constants = __webpack_require__(14);

var _validator = __webpack_require__(49);

var _validator2 = _interopRequireDefault(_validator);

var _gxbjs = __webpack_require__(6);

var _ConfigStore = __webpack_require__(1);

var _ConfigStore2 = _interopRequireDefault(_ConfigStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var league_data_product_id_reg = new RegExp('^1.' + _gxbjs.ChainTypes.object_type.league_data_product + '.\\d+$');
var taskQueue = [];

exports.default = {
    init: function init() {
        return new _bluebird2.default(function (resolve, reject) {
            resolve(1);
        });
    },
    encrypt_params_for_free_market: function encrypt_params_for_free_market(params, requester) {
        var data_source_private_key = _ConfigStore2.default.get_datasource_private_key();
        return new _bluebird2.default(function (resolve, reject) {
            _GXChainService2.default.get_public_key_by_id(requester).then(function (pubKey) {
                var encryptedParams = _GXChainService2.default.encrypt_params(params, data_source_private_key, pubKey);
                resolve(encryptedParams);
            }).catch(function (ex) {
                console.error('获取商户公钥失败', ex);
                reject(ex);
            });
        });
    },
    decrypt_params_for_free_market: function decrypt_params_for_free_market(params, requester) {
        var data_source_private_key = _ConfigStore2.default.get_datasource_private_key();
        return new _bluebird2.default(function (resolve, reject) {
            _GXChainService2.default.get_public_key_by_id(requester).then(function (pubKey) {
                var decryptedParams = _GXChainService2.default.decrypt_msg(params, data_source_private_key, pubKey);
                resolve(JSON.parse(decryptedParams));
            }).catch(function (ex) {
                console.error('获取商户公钥失败', ex);
                reject(ex);
            });
        });
    },
    decrypt_params_for_league: function decrypt_params_for_league(params, requester, league_id, request_id) {
        var config = _ConfigStore2.default.config;
        var data_source_private_key = _ConfigStore2.default.get_datasource_private_key();
        return new _bluebird2.default(function (resolve, reject) {
            _FaucetService2.default.request_for_a_token(requester, league_id, request_id, config.datasource.account_name, data_source_private_key).then(function (resp) {
                var token = resp.data.token;
                var private_key = _gxbjs.PrivateKey.fromSeed(_gxbjs.key.normalize_brainKey(token));
                var public_key = private_key.toPublicKey().toPublicKeyString();
                var decryptedParams = _GXChainService2.default.decrypt_msg(params, private_key, public_key);
                resolve(JSON.parse(decryptedParams));
            }).catch(function (ex) {
                console.error('获取联盟数据交换凭证失败:', request_id, " ", ex);
                reject(ex);
            });
        });
    },
    encrypt_params_for_league: function encrypt_params_for_league(params, requester, league_id, request_id) {
        var config = _ConfigStore2.default.config;
        var data_source_private_key = _ConfigStore2.default.get_datasource_private_key();
        return new _bluebird2.default(function (resolve, reject) {
            _FaucetService2.default.request_for_a_token(requester, league_id, request_id, config.datasource.account_name, data_source_private_key).then(function (resp) {
                var token = resp.data.token;
                var private_key = _gxbjs.PrivateKey.fromSeed(_gxbjs.key.normalize_brainKey(token));
                var public_key = private_key.toPublicKey().toPublicKeyString();
                var encryptedParams = _GXChainService2.default.encrypt_params(params, private_key, public_key);
                resolve(encryptedParams);
            }).catch(function (ex) {
                console.error('获取联盟数据交换凭证失败:', request_id, " ", ex);
                reject(ex);
            });
        });
    },
    validate_error: function validate_error(request_id) {
        var config = _ConfigStore2.default.config;
        return new _bluebird2.default(function (resolve, reject) {
            console.log('validate_error', request_id);
            _GXChainService2.default.fetch_account(config.datasource.account_name).then(function (account) {
                _GXChainService2.default.data_transaction_datasource_validate_error(request_id, account.get('id')).then(function () {
                    resolve();
                }).catch(function (ex) {
                    console.error('数据源数据验证错误广播失败:', ex);
                    reject(ex);
                });
            }).catch(function (ex) {
                console.error('获取账户信息失败:', ex);
                reject(ex);
            });
        });
    },
    upload_data: function upload_data(data_hash, hash, request_id) {
        console.log('upload_data', request_id);
        _FaucetService2.default.store_hash(data_hash, hash, request_id).then(function (result) {
            console.log('数据已上传至交易确认节点', result);
        }).catch(function (ex) {
            console.error('数据上传交易确认节点失败,', ex);
        });
    },


    exist: function exist(request_id) {
        return !!taskQueue.find(function (req_id) {
            return req_id == request_id;
        });
    },

    enqueue: function enqueue(request_id) {
        if (!this.exist(request_id)) {
            taskQueue.push(request_id);
        }
    },
    dequeue: function dequeue(request_id) {
        console.log('处理结束', request_id, ' ', new Date().getTime());
        setTimeout(function () {
            taskQueue = taskQueue.filter(function (req_id) {
                return req_id != request_id;
            });
        }, 1000);
    },
    deal_with_data_transaction: function deal_with_data_transaction(data_transaction) {
        var config = _ConfigStore2.default.config;
        // var start = new Date().getTime();
        var self = this;
        var status = _constants.TRANSACTION_STATUS_MAP[data_transaction.status];
        var request_id = data_transaction.request_id,
            product_id = data_transaction.product_id,
            requester = data_transaction.requester;

        var is_product_subscribed = config.datasource.subscribed_data_product.find(function (prod) {
            return prod == product_id;
        });

        // 数据源账户未配置
        if (!config.datasource.account_name) {
            console.log('请config.js中配置datasource.account_name');
            return;
        }

        // 数据源私钥未配置
        if (!config.datasource.private_key) {
            console.log('请在config.js中配置datasource.private_key');
            return;
        }

        // 不处理未确认的交易
        if (!(status && status == _constants.TRANSACTION_STATUS_MAP.CONFIRMED)) {
            return;
        }
        // 不处理未订阅的product_id
        else if (!is_product_subscribed) {
                return;
            } else {

                _GXChainService2.default.fetch_account(config.datasource.account_name).then(function (account) {
                    var account_id = account.get('id');
                    var currentAccountStatus = data_transaction.datasources_status.find(function (item) {
                        return item.datasource == account_id;
                    });
                    // 如果不在数据源列表中,则不进行处理
                    if (!currentAccountStatus) {
                        return;
                    }
                    // 如果数据源状态不是初始化状态,则不处理
                    else if (currentAccountStatus.status > 0) {
                            return;
                        }
                        // 不处理自己的请求
                        else if (account_id == data_transaction.requester) {
                                return;
                            }
                    // 不重复处理同一个请求
                    if (self.exist(request_id)) {
                        return;
                    }
                    self.enqueue(request_id);
                    console.log('开始处理:', data_transaction.request_id, (0, _stringify2.default)(data_transaction), ' ', new Date().getTime(), '\n产品id:', data_transaction.product_id, '\n请求方Id:', data_transaction.requester);
                    var isLeague = league_data_product_id_reg.test(product_id);
                    var promises = [_GXChainService2.default.fetch_data_product(product_id)];

                    if (!isLeague) {
                        promises.push(self.decrypt_params_for_free_market(data_transaction.params, data_transaction.requester));
                    } else {
                        promises.push(self.decrypt_params_for_league(data_transaction.params, data_transaction.requester, data_transaction.league_id, request_id));
                    }

                    _bluebird2.default.all(promises).then(function (result) {
                        var product_info = result[0];
                        var schema_contexts = product_info.schema_contexts;
                        var current_schema = schema_contexts.find(function (schema) {
                            return schema.version == data_transaction.version;
                        });
                        var params = result[1];

                        _DatasourceService2.default.fetch_data({
                            request_id: request_id,
                            product_id: product_id,
                            requester: requester,
                            params: params
                        }).then(function (result) {
                            console.log('数据返回', (0, _stringify2.default)(result, null, '\t'));
                            var code = result.code;
                            if ((0, _keys2.default)(current_schema.schema_context.code).length > 0 && !current_schema.schema_context.code[code]) {
                                console.error('未知的返回码:', code);
                                self.dequeue(request_id);
                                self.validate_error(request_id);
                            } else {
                                try {
                                    var validatedData = _validator2.default.validate(result.data, current_schema.schema_context.output);
                                    var data = {
                                        message: result.message || '',
                                        data: validatedData
                                    };
                                    if (typeof code != 'undefined') {
                                        data.code = result.code;
                                    }
                                    var _promises = [];
                                    if (isLeague) {
                                        _promises.push(self.encrypt_params_for_league(data, data_transaction.requester, data_transaction.league_id, request_id));
                                    } else {
                                        _promises.push(self.encrypt_params_for_free_market(data, data_transaction.requester));
                                    }
                                    // start=new Date().getTime();
                                    _bluebird2.default.all(_promises).then(function (result) {
                                        var encryptedParams = result[0];
                                        var data_hash = _gxbjs.hash.sha256('' + (0, _stringify2.default)(params) + (0, _stringify2.default)(validatedData)).toString('hex');
                                        console.log('数据包大小:', new Buffer(encryptedParams).length, 'B');
                                        // console.log('加密数据耗时:',new Date().getTime()-start);
                                        // start=new Date().getTime();
                                        console.log('上传数据 ======== ', request_id);
                                        _FaucetService2.default.store_data(encryptedParams, request_id, data_hash).then(function (result) {
                                            // console.log('加密数据提交到验证节点耗时:',new Date().getTime()-start);
                                            console.log('已存证到验证节点:', result);
                                            self.dequeue(request_id);
                                        }).catch(function (ex) {
                                            self.dequeue(request_id);
                                            console.error('数据保存到验证节点失败:', ex, request_id, config.datasource.account_name, currentAccountStatus);
                                        });
                                    }).catch(function (ex) {
                                        console.error('数据加密失败:', ex);
                                        self.dequeue(request_id);
                                    });
                                } catch (ex) {
                                    console.error('数据格式验证失败:', ex.message);
                                    self.validate_error(request_id);
                                    self.dequeue(request_id);
                                }
                            }
                        }).catch(function (ex) {
                            console.error('数据源获取数据失败', ex.message);
                            self.validate_error(request_id);
                            self.dequeue(request_id);
                        });
                    }).catch(function (ex) {
                        console.error(ex);
                        self.dequeue(request_id);
                    });
                });
            }
    }
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = __webpack_require__(2);

var _stringify2 = _interopRequireDefault(_stringify);

var _typeof2 = __webpack_require__(72);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    validate: function validate(params, schema) {
        var self = this;
        if ((typeof params === 'undefined' ? 'undefined' : (0, _typeof3.default)(params)) != 'object') {
            throw new Error('params ' + params + ' should be an object');
        }

        if ((typeof schema === 'undefined' ? 'undefined' : (0, _typeof3.default)(schema)) != 'object') {
            throw new Error('schema ' + schema + ' should be an object');
        }

        var result = {};

        for (var key in schema) {
            var type = schema[key].type;
            var value = params[key];
            var defaultValue = schema[key].defaultsTo;

            // assign a default value if the value is not assigned
            if (typeof value == 'undefined' && typeof defaultValue != 'undefined') {
                value = defaultValue;
                result[key] = value;
            }

            //throw an error if value is required but not assigned
            if (typeof value == 'undefined' && schema[key].required) {
                throw new Error(key + ' in ' + (0, _stringify2.default)(params, null, '\t') + ' is required');
            }

            switch (type) {
                case 'integer':
                    if (!/^\d+$/.test(value)) {
                        throw new Error(key + ' should be a type of ' + type + ', but get a value of ' + value);
                    } else {
                        result[key] = value;
                    }
                    break;
                case 'string':
                case 'boolean':
                case 'number':
                    if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) != type) {
                        throw new Error('In case of schema definition:' + (0, _stringify2.default)(schema, null, '\t') + ',' + key + ' in ' + (0, _stringify2.default)(params, null, '\t') + ' should be a type of ' + type + ', but get a value of ' + value + ' which indicated as type of ' + (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)));
                    } else {
                        result[key] = value;
                    }
                    break;
                case 'json':
                    if (!value instanceof Object) {
                        throw new Error(key + ' should be json, but get a value of ' + value + ' which indicated as instance of ' + value.constructor.name);
                    }
                    result[key] = self.validate(value, schema.fields || {});
                    break;
                case 'array':
                    if (!value instanceof Array) {
                        throw new Error(key + ' should be an instance of array, but get a value of ' + value + ' which indicated as instance of ' + value.constructor.name);
                    } else if (!schema[key].columns) {
                        throw new Error('columns definition should be assigned for ' + key + ' since schema ' + schema + '[' + key + '] is type of array');
                    } else if ((0, _typeof3.default)(schema[key].columns) != 'object') {
                        throw new Error(key + ' should be an instance of array, but get a value of ' + value + ' which indicated as instance of ' + value.constructor.name);
                    } else {
                        result[key] = [];
                        value = value.forEach(function (item) {
                            result[key].push(self.validate(item, schema[key].columns));
                        });
                    }
                default:
                    console.warn('unknown type ' + type + ' found in ' + (0, _stringify2.default)(params, null, '\t') + ', which is not supported at this time, will be ignored');

            }
        }
        return result;
    }
};

/***/ }),
/* 50 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(22);
var document = __webpack_require__(3).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(8) && !__webpack_require__(9)(function () {
  return Object.defineProperty(__webpack_require__(51)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(50);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(33);
var $export = __webpack_require__(21);
var redefine = __webpack_require__(58);
var hide = __webpack_require__(10);
var has = __webpack_require__(5);
var Iterators = __webpack_require__(32);
var $iterCreate = __webpack_require__(95);
var setToStringTag = __webpack_require__(35);
var getPrototypeOf = __webpack_require__(102);
var ITERATOR = __webpack_require__(13)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(20);
var dPs = __webpack_require__(99);
var enumBugKeys = __webpack_require__(31);
var IE_PROTO = __webpack_require__(36)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(51)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(93).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(57);
var hiddenKeys = __webpack_require__(31).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(5);
var toIObject = __webpack_require__(12);
var arrayIndexOf = __webpack_require__(90)(false);
var IE_PROTO = __webpack_require__(36)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(10);


/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = require("extract-text-webpack-plugin");

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = require("gxbjs-ws");

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stringify = __webpack_require__(2);

var _stringify2 = _interopRequireDefault(_stringify);

var _express = __webpack_require__(26);

var _express2 = _interopRequireDefault(_express);

var _morgan = __webpack_require__(124);

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = __webpack_require__(117);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = __webpack_require__(120);

var _http2 = _interopRequireDefault(_http);

var _bluebird = __webpack_require__(0);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _gxbjsWs = __webpack_require__(61);

var _gxbjs = __webpack_require__(6);

var _DataTransactionHandler = __webpack_require__(45);

var _DataTransactionHandler2 = _interopRequireDefault(_DataTransactionHandler);

var _MerchantTask = __webpack_require__(18);

var _MerchantTask2 = _interopRequireDefault(_MerchantTask);

var _DatasourceTask = __webpack_require__(48);

var _DatasourceTask2 = _interopRequireDefault(_DatasourceTask);

var _GXChainService = __webpack_require__(7);

var _GXChainService2 = _interopRequireDefault(_GXChainService);

var _LevelDBService = __webpack_require__(17);

var _LevelDBService2 = _interopRequireDefault(_LevelDBService);

var _ConfigStore = __webpack_require__(1);

var _ConfigStore2 = _interopRequireDefault(_ConfigStore);

var _figlet = __webpack_require__(118);

var _figlet2 = _interopRequireDefault(_figlet);

var _safe = __webpack_require__(82);

var _safe2 = _interopRequireDefault(_safe);

var _opn = __webpack_require__(125);

var _opn2 = _interopRequireDefault(_opn);

var _webpackDev = __webpack_require__(69);

var _webpackDev2 = _interopRequireDefault(_webpackDev);

var _webpack = __webpack_require__(44);

var _webpack2 = _interopRequireDefault(_webpack);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var devMiddleware = null;
var hotMiddleware = null;
var autoOpenBrowser = false;

if (app.get('env') === 'development') {
    var compiler = (0, _webpack2.default)(_webpackDev2.default);
    devMiddleware = __webpack_require__(126)(compiler, {
        publicPath: _webpackDev2.default.output.publicPath,
        quiet: true
    });
    hotMiddleware = __webpack_require__(127)(compiler, {
        log: console.log,
        heartbeat: 2000
    });
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
            hotMiddleware.publish({ action: 'reload' });
            cb();
        });
    });
    autoOpenBrowser = true;
    app.use((0, _morgan2.default)('dev'));
    app.use(devMiddleware);
    app.use(hotMiddleware);
    app.use('/static', _express2.default.static('./static'));
} else {
    app.use((0, _morgan2.default)('combined'));
    app.use(_express2.default.static('./dist'));
}

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
var connected = false;
var connectedCheck = function connectedCheck(req, res, next) {
    if (connected) {
        next();
    } else {
        res.status(500).send({
            code: 'UNKNOWN_ERROR',
            message: '正在连接网络,请稍后再试'
        });
    }
};

app.use('/rpc', connectedCheck, __webpack_require__(66));
app.use('/demo', connectedCheck, __webpack_require__(65));
app.use('/api', connectedCheck, __webpack_require__(64));

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});

var filterAndSortURLs = function filterAndSortURLs(latencies, witnesses) {
    var us = witnesses.filter(function (a) {
        /* Only keep the nodes we were able to connect to */
        return !!latencies[a];
    }).sort(function (a, b) {
        return latencies[a] - latencies[b];
    });
    return us;
};

_bluebird2.default.all([_ConfigStore2.default.init(), _MerchantTask2.default.init(), _DatasourceTask2.default.init()]).then(function (results) {

    var config = results[0];
    var witnesses = config && config.common && config.common.witnesses || [];
    var connectionManager = new _gxbjsWs.Manager({ url: witnesses[0], urls: witnesses });
    if (witnesses.length == 0) {
        console.error('未配置启动节点,请先在config.json文件中配置common.witnesses');
        return;
    }
    /**
     * 连接witness
     * @param callback
     */
    var connect = function connect(callback) {
        connectionManager.checkConnections().then(function (resp) {
            console.log('延迟\n', (0, _stringify2.default)(resp, null, '\t'));
            var urls = filterAndSortURLs(resp, witnesses);
            if (urls.length == 0) {
                // setTimeout(function () {
                //     connect(callback);
                // }, 3000);
                console.log('witnesses', witnesses);
                connectionManager.url = witnesses[0];
                connectionManager.urls = witnesses;

                connectionManager.connectWithFallback(true).then(function () {
                    console.log('已连接');
                    connected = true;
                    callback && callback();
                }).catch(function (ex) {
                    console.error('连接失败,3秒后重试', ex.message);
                    setTimeout(function () {
                        connect(callback);
                    }, 3000);
                });
            } else {
                connectionManager.urls = urls;
                connectionManager.connectWithFallback(true).then(function () {
                    console.log('已连接');
                    connected = true;
                    callback && callback();
                }).catch(function (ex) {
                    console.error('连接失败,3秒后重试', ex.message);
                    setTimeout(function () {
                        connect(callback);
                    }, 3000);
                });
            }
        }).catch(function (ex) {
            console.error('检查连接失败,3秒后重试', ex.message);
            setTimeout(function () {
                connect(callback);
            }, 3000);
        });
    };

    /**
     * 启动web服务
     */
    var serverStarted = false;
    var startServer = function startServer() {
        if (serverStarted) {
            return;
        }
        serverStarted = true;
        var port = parseInt(config.common.port || '3000');
        app.set('port', port);
        var server = _http2.default.createServer(app);
        server.listen(port);
        server.on('error', onError);
        server.on('listening', function () {
            devMiddleware && devMiddleware.waitUntilValid(function () {
                var uri = 'http://localhost:' + port;
                console.log('> Listening at ' + uri + '\n');
                if (app.get('env') == 'development' && autoOpenBrowser) {
                    (0, _opn2.default)(uri);
                }
            });
            if (app.get('env') == 'production') {
                var _port = server.address().port;
                console.log("> 应用实例，访问地址为 http://服务器外网IP:%s", _port);
            }
        });
        (0, _figlet2.default)('GXB-BOX', 'ANSI Shadow', function (err, text) {
            console.log(_safe2.default.rainbow('\n=*=*=*=*=*=*=*=*=*==*=*= \u516C\u4FE1\u5B9D\u6570\u636E\u4EA4\u6613\u5BA2\u6237\u7AEF\u5DF2\u542F\u52A8 =*=*=*==*=*=*=*=*=*=*=*=\n'));
            console.log(_safe2.default.cyan('' + (text || '').split('\n').map(function (line) {
                return '\t' + line;
            }).join('\n')));
            console.log(_safe2.default.rainbow('=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=**=*=*=*=*=*=*==*=*=*=\n'));
        });
    };

    /**
     * 数据交易消息订阅
     * @param data_transactions
     */
    var subscriber = function subscriber(data_transactions) {
        data_transactions.forEach(function (data_transaction) {
            _DataTransactionHandler2.default.schedule(data_transaction);
        });
    };

    /**
     * 初始化连接
     */
    var initConnection = function initConnection() {
        console.log('初始化数据缓存');
        var promises = [_gxbjs.ChainStore.init()];
        if (config.merchant && config.merchant.account_name) {
            promises.push(_GXChainService2.default.fetch_account(config.merchant.account_name));
        }
        if (config.datasource && config.datasource.account_name) {
            promises.push(_GXChainService2.default.fetch_account(config.datasource.account_name));
        }
        _bluebird2.default.all(promises).then(function () {
            //订阅数据交易广播
            // Apis.instance().db_api().exec('unsubscribe_from_transaction', [subscriber, true])
            _gxbjsWs.Apis.instance().db_api().exec('set_data_transaction_subscribe_callback', [subscriber, true]);
            console.log('已订阅数据交易事件');
            startServer();
            _MerchantTask2.default.resume();
        }).catch(function (ex) {
            var isNotSync = /ChainStore sync error/.test(ex.message);
            if (isNotSync) {
                console.error('获取初始信息失败,请检查:\n1. 节点数据是否同步 \n2. 系统时钟是否正确\n', ex);
            } else {
                console.error('获取初始信息失败,请检查:账号(merchant或者datasource)是否正确配置', ex);
            }
        });
    };
    // websocket 状态处理
    _gxbjsWs.Apis.setRpcConnectionStatusCallback(function (status) {
        var statusMap = {
            open: '开启',
            closed: '关闭',
            error: '错误',
            reconnect: '重新连接'
        };

        console.log('witness当前状态:', statusMap[status] || status);

        if (status === "reconnect") {
            console.log('断开重连');
            _gxbjs.ChainStore.resetCache();
        } else if (connected && (status == 'closed' || status == 'error')) {
            // 出错重连
            connected = false;
            console.log('重新连接其他witness');
            connect(function () {
                _gxbjs.ChainStore.subscribed = false;
                _gxbjs.ChainStore.subError = null;
                _gxbjs.ChainStore.clearCache();
                _gxbjs.ChainStore.head_block_time_string = null;
                initConnection();
            });
        }
    });

    startServer();
    // 首次连接
    // connect(function () {
    //     initConnection();
    // })
}).catch(function (ex) {
    console.error('加载配置失败,请检查config.json', ex);
});

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

process.stdin.resume();

function exitHandler(reason, err) {
    if (err) console.log(err.stack);
    console.log('程序退出:', reason);
    _bluebird2.default.all([_MerchantTask2.default.store(), _LevelDBService2.default.put('last-close', new Date().getTime())]).then(function () {
        process.exit();
    }).catch(function (ex) {
        process.exit();
    });
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, 'exit'));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, 'SIGINT'));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, 'uncaughtException'));

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(26);

var _express2 = _interopRequireDefault(_express);

var _LevelDBService = __webpack_require__(17);

var _LevelDBService2 = _interopRequireDefault(_LevelDBService);

var _GXChainService = __webpack_require__(7);

var _GXChainService2 = _interopRequireDefault(_GXChainService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/request/:request_id', function (req, res) {
    _GXChainService2.default.get_data_transaction_by_request_id(req.params.request_id).then(function (data_transaction) {
        res.send(data_transaction);
    }).catch(function (ex) {
        res.status(500).send(ex.message);
    });
});

router.get('/request/:request_id/data', function (req, res) {
    var request_id = req.params.request_id;
    // 默认最多返回20条
    _LevelDBService2.default.find({ prefix: 'request-' + request_id + '-' }).then(function (results) {
        results = (results || []).map(function (result) {
            return JSON.parse(result.value);
        }).reverse();
        res.send(results);
    }).catch(function (ex) {
        res.status(404).send({
            request_id: request_id,
            message: '未查询到结果'
        });
    });
});

router.get('/request/:request_id/delete', function (req, res) {
    var request_id = req.params.request_id;
    _LevelDBService2.default.find({ prefix: 'request-' + request_id + '-' }).then(function (results) {
        (results || []).forEach(function (result) {
            console.log(result);
            _LevelDBService2.default.del(result.key);
        });
        res.send({});
    }).catch(function (ex) {
        console.error(ex);
        res.status(500).send({
            request_id: request_id,
            message: '删除失败'
        });
    });
});

module.exports = router;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _stringify = __webpack_require__(2);

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = __webpack_require__(19);

var _assign2 = _interopRequireDefault(_assign);

var _express = __webpack_require__(26);

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/**
 * 商户-数据回调示例
 */
router.all('/callback', function (req, res) {
    var params = (0, _assign2.default)({}, req.body);
    console.log('数据回调:');
    console.log((0, _stringify2.default)(params, null, '\t'));
    res.send({});
});

/**
 * 数据源-服务接口示例
 */
router.all('/call', function (req, res) {
    console.log((0, _assign2.default)({}, req.query, req.body));
    res.send({
        code: 0,
        data: {
            result: true
        }
    });
});

module.exports = router;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _assign = __webpack_require__(19);

var _assign2 = _interopRequireDefault(_assign);

var _express = __webpack_require__(26);

var _express2 = _interopRequireDefault(_express);

var _GXChainService = __webpack_require__(7);

var _GXChainService2 = _interopRequireDefault(_GXChainService);

var _FaucetService = __webpack_require__(27);

var _FaucetService2 = _interopRequireDefault(_FaucetService);

var _TimeoutService = __webpack_require__(47);

var _TimeoutService2 = _interopRequireDefault(_TimeoutService);

var _MerchantService = __webpack_require__(28);

var _MerchantService2 = _interopRequireDefault(_MerchantService);

var _MerchantTask = __webpack_require__(18);

var _MerchantTask2 = _interopRequireDefault(_MerchantTask);

var _validator = __webpack_require__(49);

var _validator2 = _interopRequireDefault(_validator);

var _bluebird = __webpack_require__(0);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _constants = __webpack_require__(14);

var _ConfigStore = __webpack_require__(1);

var _ConfigStore2 = _interopRequireDefault(_ConfigStore);

var _gxbjs = __webpack_require__(6);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emitter = (0, _gxbjs.EmitterInstance)();
var router = _express2.default.Router();
var timer = null;

/**
 * 联盟市场数据交易
 * @param req
 * @param res
 */
var league_data_product_transaction = function league_data_product_transaction(req, res) {
    timer = new Date().getTime();
    var id = req.params.id;
    var league_id = req.params.league_id;
    var params = (0, _assign2.default)({}, req.query, req.body);
    var version = req.params.version;
    var config = _ConfigStore2.default.config;
    var merchant_private_key = _ConfigStore2.default.get_merchant_private_key();
    if (!config.merchant || !config.merchant.account_name || !config.merchant.private_key) {
        return res.send({
            message: '请先配置config.json文件的merchant信息, 检测account_name和private_key是否正确配置'
        });
    }
    _bluebird2.default.all([_GXChainService2.default.fetch_account(config.merchant.account_name), _GXChainService2.default.fetch_data_product(id)]).then(function (result) {
        var account_id = result[0].get('id');
        var prod = result[1];
        if (!prod || prod.status == 0) {
            return res.status(500).send({
                code: _constants.SYSTEM_ERROR_CODE.NOT_FOUND,
                message: "产品不存在"
            });
        } else if (prod.status == 2) {
            return res.status(500).send({
                code: _constants.SYSTEM_ERROR_CODE.FORBIDDEN,
                message: "产品已下架"
            });
        }
        var schema_contexts = prod.schema_contexts;
        if (schema_contexts.length == 0) {
            res.status(500).send({
                code: _constants.SYSTEM_ERROR_CODE.INVALID_PARAMS,
                message: 'schema定义为空,数据产品无效'
            });
        } else {
            var request_id = _GXChainService2.default.generate_request_id();
            _FaucetService2.default.request_for_a_token(account_id, league_id, request_id, config.merchant.account_name, merchant_private_key).then(function (resp) {
                var token = resp.data.token;
                var private_key = _gxbjs.PrivateKey.fromSeed(_gxbjs.key.normalize_brainKey(token));
                var public_key = private_key.toPublicKey().toPublicKeyString();
                var current_schema = null;
                if (!version) {
                    current_schema = schema_contexts[schema_contexts.length - 1];
                } else {
                    current_schema = schema_contexts.find(function (schema) {
                        return schema.version == version;
                    });
                }
                var filteredParams = null;
                try {
                    filteredParams = _validator2.default.validate(params, current_schema.schema_context.input);
                } catch (ex) {
                    console.error(ex);
                    return res.status(500).send({
                        code: _constants.SYSTEM_ERROR_CODE.INVALID_PARAMS,
                        message: ex.message
                    });
                }
                var encrypted_params = _GXChainService2.default.encrypt_params(filteredParams, private_key, public_key);
                var isPrivacy = current_schema.schema_context.privacy;
                _MerchantTask2.default.enqueue(request_id, isPrivacy);

                _GXChainService2.default.create_data_transaction(request_id, league_id, id, current_schema.version, encrypted_params, account_id).then(function (resp) {

                    //隐私数据发送用户授权认证
                    if (isPrivacy) {
                        _FaucetService2.default.send_auth_msg(filteredParams.name, filteredParams.idcard, params.mobile, request_id).then(function () {
                            console.log('请求用户授权短信已发送');
                            _TimeoutService2.default.add(request_id, config.merchant.privacy_request_timeout || 120000);
                        }).catch(function (ex) {
                            console.error(ex.message);
                            _MerchantService2.default.notify({
                                request_id: request_id,
                                body: {
                                    code: _constants.SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                                    message: ex.message || '发送授权短信失败'
                                }
                            });
                        });
                    } else {
                        _TimeoutService2.default.add(request_id, config.common.default_timeout || 8000);
                    }
                    // 创建完数据交易请求后返回request_id
                    res.send({
                        data: {
                            request_id: request_id
                        }
                    });
                }).catch(function (ex) {
                    console.error('err:', ex);
                    var isLowBalance = /Insufficient Balance/.test(ex.message); // 余额不足
                    var isNotOpened = /not opened/.test(ex.message);
                    if (isLowBalance) {
                        res.status(500).send({
                            code: _constants.SYSTEM_ERROR_CODE.BALANCE_NOT_ENOUGH,
                            message: '余额不足'
                        });
                    } else {
                        if (isNotOpened) {
                            emitter.emit('reconnect');
                        }
                        res.status(500).send({
                            code: _constants.SYSTEM_ERROR_CODE.INVALID_PARAMS,
                            message: ex.message
                        });
                    }
                });
            }).catch(function (ex) {
                console.error('err:', ex);
                res.status(500).send({
                    code: _constants.SYSTEM_ERROR_CODE.INVALID_PARAMS,
                    message: ex.message
                });
            });
        }
    }).catch(function (ex) {
        console.error(ex);
        res.status(500).send(ex);
    });
};

/**
 * 联盟市场数据交易接口 - 最新版本
 */
router.all('/league/:league_id/:id', league_data_product_transaction);

/**
 * 联盟市场数据交易 - 指定版本号
 */
router.all('/league/:league_id/:id/:version', league_data_product_transaction);

/**
 * 自由市场数据交易
 * @param req
 * @param res
 */
var free_data_prod_transaction = function free_data_prod_transaction(req, res) {

    timer = new Date().getTime();
    var id = req.params.id;
    var params = (0, _assign2.default)({}, req.query, req.body);
    var version = req.params.version;
    // let _start = new Date().getTime();
    var config = _ConfigStore2.default.config;
    var merchant_private_key = _ConfigStore2.default.get_merchant_private_key();
    if (!config.merchant || !config.merchant.account_name || !config.merchant.private_key) {
        return res.send({
            message: '请先配置config.json文件的merchant信息, 检测account_name和private_key是否正确配置'
        });
    }
    _bluebird2.default.all([_GXChainService2.default.fetch_account(config.merchant.account_name), _GXChainService2.default.fetch_data_product(id)]).then(function (result) {
        var account_id = result[0].get('id');
        var prod = result[1];
        if (!prod || prod.status == 0) {
            return res.status(500).send({
                code: _constants.SYSTEM_ERROR_CODE.NOT_FOUND,
                message: "产品不存在"
            });
        } else if (prod.status == 2) {
            return res.status(500).send({
                code: _constants.SYSTEM_ERROR_CODE.FORBIDDEN,
                message: "产品已下架"
            });
        }
        var schema_contexts = prod.schema_contexts;
        if (schema_contexts.length == 0) {
            res.status(500).send({
                code: _constants.SYSTEM_ERROR_CODE.INVALID_PARAMS,
                message: 'schema定义为空,数据产品无效'
            });
        } else {
            // _start = new Date().getTime();
            _GXChainService2.default.get_public_key_by_id(prod.datasource).then(function (dataSourcePubKey) {
                // console.log('获取公钥耗时:', new Date().getTime() - _start);
                var current_schema = null;
                if (!version) {
                    current_schema = schema_contexts[schema_contexts.length - 1];
                } else {
                    current_schema = schema_contexts.find(function (schema) {
                        return schema.version == version;
                    });
                }
                var filteredParams = null;
                try {
                    filteredParams = _validator2.default.validate(params, current_schema.schema_context.input);
                } catch (ex) {
                    console.error(ex);
                    return res.status(500).send({
                        code: _constants.SYSTEM_ERROR_CODE.INVALID_PARAMS,
                        message: ex.message
                    });
                }
                // _start = new Date().getTime();
                var encrypted_params = _GXChainService2.default.encrypt_params(filteredParams, merchant_private_key, dataSourcePubKey);
                var request_id = _GXChainService2.default.generate_request_id();
                var isPrivacy = current_schema.schema_context.privacy;
                _MerchantTask2.default.enqueue(request_id, isPrivacy);
                //创建交易请求

                _GXChainService2.default.create_data_transaction(request_id, null, id, current_schema.version, encrypted_params, account_id).then(function (resp) {
                    // console.log('创建交易耗时:', new Date().getTime() - _start);
                    //隐私数据发送用户授权认证
                    if (isPrivacy) {
                        _FaucetService2.default.send_auth_msg(filteredParams.name, filteredParams.idcard, params.mobile, request_id).then(function () {
                            console.log('请求用户授权短信已发送');
                            _TimeoutService2.default.add(request_id, config.merchant.privacy_request_timeout || 120000);
                        }).catch(function (ex) {
                            console.error(ex.message);
                            _MerchantService2.default.notify({
                                request_id: request_id,
                                body: {
                                    code: _constants.SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                                    message: ex.message || '发送授权短信失败'
                                }
                            });
                        });
                    } else {
                        _TimeoutService2.default.add(request_id, config.merchant.default_timeout || 8000);
                    }
                    // 创建完数据交易请求后返回request_id
                    res.send({
                        data: {
                            request_id: request_id
                        }
                    });
                }).catch(function (ex) {
                    console.error('err:', ex);
                    var isLowBalance = /Insufficient Balance/.test(ex.message); // 余额不足
                    var isNotOpened = /not opened/.test(ex.message);
                    if (isLowBalance) {
                        res.status(500).send({
                            code: _constants.SYSTEM_ERROR_CODE.BALANCE_NOT_ENOUGH,
                            message: '余额不足'
                        });
                    } else {
                        if (isNotOpened) {
                            emitter.emit('reconnect');
                        }
                        res.status(500).send({
                            code: _constants.SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                            message: ex.message
                        });
                    }
                });
            }).catch(function (ex) {
                console.error(ex);
                res.status(500).send({
                    code: _constants.SYSTEM_ERROR_CODE.UNKNOWN_ERROR,
                    message: '获取数据源信息失败'
                });
            });
        }
    }).catch(function (ex) {
        console.error(ex);
        res.status(500).send({
            code: _constants.SYSTEM_ERROR_CODE.INVALID_PARAMS,
            message: ex.message
        });
    });
};

/**
 * 自由市场数据交易接口 - 最新版本
 */
router.all('/:id', free_data_prod_transaction);

/**
 * 自由市场数据交易 - 指定版本
 */
router.all('/:id/:version', free_data_prod_transaction);

module.exports = router;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _superagent = __webpack_require__(43);

var _superagent2 = _interopRequireDefault(_superagent);

var _bluebird = __webpack_require__(0);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ConfigStore = __webpack_require__(1);

var _ConfigStore2 = _interopRequireDefault(_ConfigStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    fetch_data: function fetch_data(params) {
        var config = _ConfigStore2.default.config;
        return new _bluebird2.default(function (resolve, reject) {
            _superagent2.default.post(config.datasource.service).send(params).end(function (err, resp) {
                if (err) {
                    console.error('获取数据失败', resp && resp.text);
                    reject(new Error('offline'));
                } else {
                    try {
                        var result = JSON.parse(resp.text);
                        resolve(result);
                    } catch (ex) {
                        console.error('返回数据格式错误:', ex);
                        reject(new Error('invalid_format'));
                    }
                }
            });
        });
    }
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var path = __webpack_require__(62);
var webpack = __webpack_require__(44);
var ExtractTextPlugin = __webpack_require__(59);

module.exports = {
    entry: {
        main: './src/main',
        vendors: './src/vendors'
    },
    output: {
        path: path.join(__dirname, './dist')
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    sass: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                        use: ['css-loader?minimize', 'autoprefixer-loader', 'sass-loader'],
                        fallback: 'vue-style-loader'
                    })),
                    css: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                        use: ['css-loader', 'autoprefixer-loader'],
                        fallback: 'vue-style-loader'
                    }))
                }
            }
        }, {
            test: /iview\/.*?js$/,
            loader: 'babel-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                use: ['css-loader?minimize', 'autoprefixer-loader'],
                fallback: 'style-loader'
            }))
        }, {
            test: /\.sass/,
            use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                use: ['autoprefixer-loader', 'sass-loader'],
                fallback: 'style-loader'
            }))
        }, {
            test: /\.(gif|jpg|png|svg)\??.*$/,
            loader: 'url-loader?limit=1024'
        }, {
            test: /\.(woff|eot|ttf)\??.*$/,
            loader: 'url-loader?limit=1024'
        }, {
            test: /\.(html|tpl)$/,
            loader: 'html-loader'
        }]
    },
    resolve: {
        extensions: ['.js', '.vue', 'css'],
        alias: {
            'vue': 'vue/dist/vue.esm.js'
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var webpack = __webpack_require__(44);
var HtmlWebpackPlugin = __webpack_require__(119);
var ExtractTextPlugin = __webpack_require__(59);
var merge = __webpack_require__(128);
var webpackBaseConfig = __webpack_require__(68);
var fs = __webpack_require__(60);

fs.open('./src/config/env.js', 'w', function (err, fd) {
    var buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',
    entry: {
        main: ['./src/main', 'webpack-hot-middleware/client?reload=true'],
        vendors: ['./src/vendors']
    },
    output: {
        publicPath: '/',
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js'
    },
    plugins: [new ExtractTextPlugin({
        filename: 'static/css/[name].css',
        allChunks: true
    }), new webpack.optimize.CommonsChunkPlugin({
        name: 'vendors',
        filename: 'static/js/vendors.js'
    }), new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin(), new HtmlWebpackPlugin({
        filename: './index.html',
        template: './src/template/index.ejs',
        inject: false
    })]
});

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(86), __esModule: true };

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(87), __esModule: true };

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(71);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(70);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 73 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 73;

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module['exports'] = function runTheTrap (text, options) {
  var result = "";
  text = text || "Run the trap, drop the bass";
  text = text.split('');
  var trap = {
    a: ["\u0040", "\u0104", "\u023a", "\u0245", "\u0394", "\u039b", "\u0414"],
    b: ["\u00df", "\u0181", "\u0243", "\u026e", "\u03b2", "\u0e3f"],
    c: ["\u00a9", "\u023b", "\u03fe"],
    d: ["\u00d0", "\u018a", "\u0500" , "\u0501" ,"\u0502", "\u0503"],
    e: ["\u00cb", "\u0115", "\u018e", "\u0258", "\u03a3", "\u03be", "\u04bc", "\u0a6c"],
    f: ["\u04fa"],
    g: ["\u0262"],
    h: ["\u0126", "\u0195", "\u04a2", "\u04ba", "\u04c7", "\u050a"],
    i: ["\u0f0f"],
    j: ["\u0134"],
    k: ["\u0138", "\u04a0", "\u04c3", "\u051e"],
    l: ["\u0139"],
    m: ["\u028d", "\u04cd", "\u04ce", "\u0520", "\u0521", "\u0d69"],
    n: ["\u00d1", "\u014b", "\u019d", "\u0376", "\u03a0", "\u048a"],
    o: ["\u00d8", "\u00f5", "\u00f8", "\u01fe", "\u0298", "\u047a", "\u05dd", "\u06dd", "\u0e4f"],
    p: ["\u01f7", "\u048e"],
    q: ["\u09cd"],
    r: ["\u00ae", "\u01a6", "\u0210", "\u024c", "\u0280", "\u042f"],
    s: ["\u00a7", "\u03de", "\u03df", "\u03e8"],
    t: ["\u0141", "\u0166", "\u0373"],
    u: ["\u01b1", "\u054d"],
    v: ["\u05d8"],
    w: ["\u0428", "\u0460", "\u047c", "\u0d70"],
    x: ["\u04b2", "\u04fe", "\u04fc", "\u04fd"],
    y: ["\u00a5", "\u04b0", "\u04cb"],
    z: ["\u01b5", "\u0240"]
  }
  text.forEach(function(c){
    c = c.toLowerCase();
    var chars = trap[c] || [" "];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof trap[c] !== "undefined") {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;

}


/***/ }),
/* 75 */
/***/ (function(module, exports) {

// please no
module['exports'] = function zalgo(text, options) {
  text = text || "   he is here   ";
  var soul = {
    "up" : [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚'
    ],
    "down" : [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣'
    ],
    "mid" : [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉'
    ]
  },
  all = [].concat(soul.up, soul.down, soul.mid),
  zalgo = {};

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function is_char(character) {
    var bool = false;
    all.filter(function (i) {
      bool = (i === character);
    });
    return bool;
  }
  

  function heComes(text, options) {
    var result = '', counts, l;
    options = options || {};
    options["up"] =   typeof options["up"]   !== 'undefined' ? options["up"]   : true;
    options["mid"] =  typeof options["mid"]  !== 'undefined' ? options["mid"]  : true;
    options["down"] = typeof options["down"] !== 'undefined' ? options["down"] : true;
    options["size"] = typeof options["size"] !== 'undefined' ? options["size"] : "maxi";
    text = text.split('');
    for (l in text) {
      if (is_char(l)) {
        continue;
      }
      result = result + text[l];
      counts = {"up" : 0, "down" : 0, "mid" : 0};
      switch (options.size) {
      case 'mini':
        counts.up = randomNumber(8);
        counts.mid = randomNumber(2);
        counts.down = randomNumber(8);
        break;
      case 'maxi':
        counts.up = randomNumber(16) + 3;
        counts.mid = randomNumber(4) + 1;
        counts.down = randomNumber(64) + 3;
        break;
      default:
        counts.up = randomNumber(8) + 1;
        counts.mid = randomNumber(6) / 2;
        counts.down = randomNumber(8) + 1;
        break;
      }

      var arr = ["up", "mid", "down"];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0 ; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  // don't summon him
  return heComes(text, options);
}


/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(15);

module['exports'] = (function() {
  return function (letter, i, exploded) {
    if(letter === " ") return letter;
    switch(i%3) {
      case 0: return colors.red(letter);
      case 1: return colors.white(letter)
      case 2: return colors.blue(letter)
    }
  }
})();

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(15);

module['exports'] = (function () {
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']; //RoY G BiV
  return function (letter, i, exploded) {
    if (letter === " ") {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
})();



/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(15);

module['exports'] = (function () {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'];
  return function(letter, i, exploded) {
    return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 1))]](letter);
  };
})();

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(15);

module['exports'] = function (letter, i, exploded) {
  return i % 2 === 0 ? letter : colors.inverse(letter);
};

/***/ }),
/* 80 */
/***/ (function(module, exports) {

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var styles = {};
module['exports'] = styles;

var codes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],

  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49]

};

Object.keys(codes).forEach(function (key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});

/***/ }),
/* 81 */
/***/ (function(module, exports) {

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var argv = process.argv;

module.exports = (function () {
  if (argv.indexOf('--no-color') !== -1 ||
    argv.indexOf('--color=false') !== -1) {
    return false;
  }

  if (argv.indexOf('--color') !== -1 ||
    argv.indexOf('--color=true') !== -1 ||
    argv.indexOf('--color=always') !== -1) {
    return true;
  }

  if (process.stdout && !process.stdout.isTTY) {
    return false;
  }

  if (process.platform === 'win32') {
    return true;
  }

  if ('COLORTERM' in process.env) {
    return true;
  }

  if (process.env.TERM === 'dumb') {
    return false;
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
    return true;
  }

  return false;
})();

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

//
// Remark: Requiring this file will use the "safe" colors API which will not touch String.prototype
//
//   var colors = require('colors/safe);
//   colors.red("foo")
//
//
var colors = __webpack_require__(15);
module['exports'] = colors;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(4);
var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(108);
module.exports = __webpack_require__(4).Object.assign;


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(109);
module.exports = __webpack_require__(4).Object.keys;


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(112);
__webpack_require__(110);
__webpack_require__(113);
__webpack_require__(114);
module.exports = __webpack_require__(4).Symbol;


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(111);
__webpack_require__(115);
module.exports = __webpack_require__(42).f('iterator');


/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(12);
var toLength = __webpack_require__(106);
var toAbsoluteIndex = __webpack_require__(105);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(88);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(16);
var gOPS = __webpack_require__(34);
var pIE = __webpack_require__(23);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(3).document;
module.exports = document && document.documentElement;


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(50);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(55);
var descriptor = __webpack_require__(24);
var setToStringTag = __webpack_require__(35);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(10)(IteratorPrototype, __webpack_require__(13)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(25)('meta');
var isObject = __webpack_require__(22);
var has = __webpack_require__(5);
var setDesc = __webpack_require__(11).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(9)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(16);
var gOPS = __webpack_require__(34);
var pIE = __webpack_require__(23);
var toObject = __webpack_require__(39);
var IObject = __webpack_require__(53);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(9)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(11);
var anObject = __webpack_require__(20);
var getKeys = __webpack_require__(16);

module.exports = __webpack_require__(8) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(23);
var createDesc = __webpack_require__(24);
var toIObject = __webpack_require__(12);
var toPrimitive = __webpack_require__(40);
var has = __webpack_require__(5);
var IE8_DOM_DEFINE = __webpack_require__(52);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(8) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(12);
var gOPN = __webpack_require__(56).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(5);
var toObject = __webpack_require__(39);
var IE_PROTO = __webpack_require__(36)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(21);
var core = __webpack_require__(4);
var fails = __webpack_require__(9);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(38);
var defined = __webpack_require__(30);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(38);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(38);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(89);
var step = __webpack_require__(96);
var Iterators = __webpack_require__(32);
var toIObject = __webpack_require__(12);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(54)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(21);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(98) });


/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(39);
var $keys = __webpack_require__(16);

__webpack_require__(103)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 110 */
/***/ (function(module, exports) {



/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(104)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(54)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(3);
var has = __webpack_require__(5);
var DESCRIPTORS = __webpack_require__(8);
var $export = __webpack_require__(21);
var redefine = __webpack_require__(58);
var META = __webpack_require__(97).KEY;
var $fails = __webpack_require__(9);
var shared = __webpack_require__(37);
var setToStringTag = __webpack_require__(35);
var uid = __webpack_require__(25);
var wks = __webpack_require__(13);
var wksExt = __webpack_require__(42);
var wksDefine = __webpack_require__(41);
var enumKeys = __webpack_require__(92);
var isArray = __webpack_require__(94);
var anObject = __webpack_require__(20);
var toIObject = __webpack_require__(12);
var toPrimitive = __webpack_require__(40);
var createDesc = __webpack_require__(24);
var _create = __webpack_require__(55);
var gOPNExt = __webpack_require__(101);
var $GOPD = __webpack_require__(100);
var $DP = __webpack_require__(11);
var $keys = __webpack_require__(16);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(56).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(23).f = $propertyIsEnumerable;
  __webpack_require__(34).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(33)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(10)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(41)('asyncIterator');


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(41)('observable');


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(107);
var global = __webpack_require__(3);
var hide = __webpack_require__(10);
var Iterators = __webpack_require__(32);
var TO_STRING_TAG = __webpack_require__(13)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 116 */
/***/ (function(module, exports) {

module.exports = require("async");

/***/ }),
/* 117 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 118 */
/***/ (function(module, exports) {

module.exports = require("figlet");

/***/ }),
/* 119 */
/***/ (function(module, exports) {

module.exports = require("html-webpack-plugin");

/***/ }),
/* 120 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 121 */
/***/ (function(module, exports) {

module.exports = require("immutable");

/***/ }),
/* 122 */
/***/ (function(module, exports) {

module.exports = require("ipfs-api");

/***/ }),
/* 123 */
/***/ (function(module, exports) {

module.exports = require("level");

/***/ }),
/* 124 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 125 */
/***/ (function(module, exports) {

module.exports = require("opn");

/***/ }),
/* 126 */
/***/ (function(module, exports) {

module.exports = require("webpack-dev-middleware");

/***/ }),
/* 127 */
/***/ (function(module, exports) {

module.exports = require("webpack-hot-middleware");

/***/ }),
/* 128 */
/***/ (function(module, exports) {

module.exports = require("webpack-merge");

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(63);


/***/ })
/******/ ]);