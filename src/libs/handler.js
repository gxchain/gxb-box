let handler = {
    error: function (error) {
        let msg = '未知错误';
        if (error.response) {
            console.error(error.response);

            if (error.response.data && error.response.data.message) {
                msg = error.response.data.message;
            }
            if (error.response.data && error.response.data.data && error.response.data.data.message) {
                msg = error.response.data.data.message;
            }
            // 认证接口报错信息
            if (error.response.data && error.response.data.response && error.response.data.response.text) {
                let err_msg = JSON.parse(error.response.data.response.text);
                if (err_msg.base) {
                    msg = err_msg.base[0];
                }
            }
        } else if (error.request) {
            console.error(error.request);
            msg = error.request;
        } else {
            console.error(error.message);
            msg = error.message;
        }
        return JSON.stringify(msg);
    }
};

export default handler;
