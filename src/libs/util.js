let util = {
    isValidPhone: function (phone) {
        return /^1\d{10}$/.test(phone);
    },

    /**
     *验证组织机构代码是否合法：组织机构代码为8位数字或者拉丁字母+“-”+1位校验码。
     *验证最后那位校验码是否与根据公式计算的结果相符。
     *编码规则请参看
     *http://wenku.baidu.com/view/d615800216fc700abb68fc35.html
     */
    isValidOrgCode: function (orgCode) {
        var ret = false;
        var codeVal = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        var intVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
        var crcs = [3, 7, 9, 10, 5, 8, 4, 2];
        if (orgCode && orgCode.length === 10) {
            var sum = 0;
            for (var i = 0; i < 8; i++) {
                var codeI = orgCode.substring(i, i + 1);
                var valI = -1;
                for (var j = 0; j < codeVal.length; j++) {
                    if (codeI === codeVal[j]) {
                        valI = intVal[j];
                        break;
                    }
                }
                sum += valI * crcs[i];
            }
            var crc = 11 - (sum % 11);
            switch (crc) {
                case 10: {
                    crc = 'X';
                    break;
                }
                default: {
                    break;
                }
            }
            if (crc === orgCode.substring(9)) {
                ret = true;
            }
        }
        return ret;
    },

    /**
     *验证营业执照是否合法：营业执照长度须为15位数字，前14位为顺序码，
     *最后一位为根据GB/T 17710 1999(ISO 7064:1993)的混合系统校验位生成算法
     *计算得出。此方法即是根据此算法来验证最后一位校验位是否政正确。如果
     *最后一位校验位不正确，则认为此营业执照号不正确(不符合编码规则)。
     *以下说明来自于网络:
     *我国现行的营业执照上的注册号都是15位的，不存在13位的，从07年开始国
     *家进行了全面的注册号升级就全部都是15位的了，如果你看见的是13位的注
     *册号那肯定是假的。
     *15位数字的含义，代码结构工商注册号由14位数字本体码和1位数字校验码
     *组成，其中本体码从左至右依次为：6位首次登记机关码、8位顺序码。
     * 一、前六位代表的是工商行政管理机关的代码，国家工商行政管理总局用
     * “100000”表示，省级、地市级、区县级登记机关代码分别使用6位行
     * 政区划代码表示。设立在经济技术开发区、高新技术开发区和保税区
     * 的工商行政管理机关（县级或县级以上）或者各类专业分局应由批准
     * 设立的上级机关统一赋予工商行政管理机关代码，并报国家工商行政
     * 管理总局信息化管理部门备案。
     * 二、顺序码是7-14位，顺序码指工商行政管理机关在其管辖范围内按照先
     * 后次序为申请登记注册的市场主体所分配的顺序号。为了便于管理和
     * 赋码，8位顺序码中的第1位（自左至右）采用以下分配规则：
     * 1）内资各类企业使用“0”、“1”、“2”、“3”；
     * 2）外资企业使用“4”、“5”；
     * 3）个体工商户使用“6”、“7”、“8”、“9”。
     * 顺序码是系统根据企业性质情况自动生成的。
     * 三、校验码是最后一位，校验码用于检验本体码的正确性
     *
     *18位编码的校验依据GB 32100-2015
     * 《法人和其他组织统一社会信用代码编码规则》，
     * 统一代码由十八位阿拉伯数字或大写英文字母（不使用I、O、Z、S、V）组成，
     * 包括第1位登记管理部门代码、第2位机构类别代码、第3位~第8位登记管理机关行政区划码、
     * 第9位~第17位主体标识码（组织机构代码）、第18位校验码五个部份。
     */
    isValidBusCode: function (busCode) {
        var ret = false;
        if (busCode.length === 15) {
            var sum = 0;
            var s = [];
            var p = [];
            var a = [];
            var m = 10;
            p[0] = m;
            for (var i = 0; i < busCode.length; i++) {
                a[i] = parseInt(busCode.substring(i, i + 1), m);
                s[i] = (p[i] % (m + 1)) + a[i];
                if (s[i] % m === 0) {
                    p[i + 1] = 10 * 2;
                } else {
                    p[i + 1] = (s[i] % m) * 2;
                }
            }
            if ((s[14] % m) === 1) {
                // 营业执照编号正确!
                ret = true;
            } else {
                // 营业执照编号错误!
                ret = false;
            }
        } else if (busCode.length === 18) {
            var reg = /^[1-9A-GY]{1}[1239]{1}[1-5]{1}[0-9]{5}[0-9A-Z]{10}$/;
            if (!reg.test(busCode)) {
                ret = false;
            } else {
                var str = '0123456789ABCDEFGHJKLMNPQRTUWXY';
                var ws = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
                var codes = [];
                codes[0] = busCode.substr(0, busCode.length - 1);
                codes[1] = busCode.substr(busCode.length - 1, busCode.length);
                sum = 0;
                for (let i = 0; i < 17; i++) {
                    sum += str.indexOf(codes[0].charAt(i)) * ws[i];
                }
                var c18 = 31 - (sum % 31);
                if (c18 === 31) {
                    c18 = 'Y';
                } else if (c18 === 30) {
                    c18 = '0';
                }

                if (str.charAt(c18) !== codes[1]) {
                    ret = false;
                } else {
                    ret = true;
                }
            }
        }
        return ret;
    },
    /**
     *验证国税税务登记号是否合法:税务登记证是6位区域代码+组织机构代码
     */
    isValidTaxCode: function (taxCode) {
        var ret = false;
        if (taxCode.length === 15 && /\d{6}.test(taxCode.substr(0,6))/ && this.isValidOrgCode(taxCode.substr(5))) {
            ret = true;
        }
        return ret;
    },

    formatDateTime: function (inputTime) {
        let date = new Date(inputTime);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        let second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },

    title: function (title) {
        title = title ? title + ' - GXB-BOX' : 'GXB-BOX';
        window.document.title = title;
    },

    testEnvConfig: {
        'port': 3000,
        'ipfs_addr': ['/ip4/192.168.1.118/tcp/5001'],
        'witnesses': [
            'ws://47.96.164.78:28090'
        ],
        'faucet_url': 'http://47.96.164.78:8888',
        'referrer': 'nathan'
    },

    prodEnvConfig: {
        'port': 3000,
        'ipfs_addr': ['/ip4/139.196.138.193/tcp/5001', '/ip4/106.14.194.229/tcp/5001'],
        'witnesses': [
            'wss://node1.gxb.io',
            'wss://node5.gxb.io',
            'wss://node8.gxb.io',
            'wss://node11.gxb.io'
        ],
        'faucet_url': 'https://opengateway.gxb.io'
    }
};

export default util;
