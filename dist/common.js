var config = require('./config.js');

var numberToLetter = function (num) {
    num2letter = {
        0: 'A',
        1: 'B',
        2: 'C',
        3: 'D',
        4: 'E',
        5: 'F',
        6: 'G',
        7: 'H',
        8: 'I',
        9: 'J'
    }
    return num2letter[num]
}

var request = function (option) {
    var url = config.host + option.url;

    var Authorization = option.header.Authorization || config.basic_token;
    wx.request({
        url: url,
        data: option.data || {},
        method: option.method && option.method.toUpperCase() || 'GET',
        header: {
            'content-type': 'application/json',
            'Authorization': Authorization
        },
        success: function (res) {
            var code = res.statusCode;
            if (/^2\d{2}$/.test(code)) {
                typeof option.success === 'function' && option.success(res);
            } else if (code === 403 || code === 401){
                login(option.that)
            }
            else {
                typeof option.fail === 'function' && option.fail(res);
            }
        },
        fail: function (res) {
            typeof option.fail === 'function' && option.fail(res);
        },
        complete: function (res) {
            typeof option.complete === 'function' && option.complete(res);
        }
    })
}

var login = function(that) {
    // 登录部分代码
    wx.login({
        // 调用 login 获取 code
        success: function (res) {
            var code = res.code;
            wx.getUserInfo({
                // 调用 getUserInfo 获取 encryptedData 和 iv
                success: function (res) {
                    // success
                    console.log(res)
                    console.log(that)
                    that.setData({
                        userInfo: res.userInfo
                    })
                    var encryptedData = res.encryptedData || 'encry';
                    var iv = res.iv || 'iv';
                    console.log(config.basic_token);
                    wx.request({ // 发送请求 获取 jwt
                        url: config.host + '/auth/oauth/token?code=' + code,
                        header: {
                            Authorization: config.basic_token
                        },
                        data: {
                            username: encryptedData,
                            password: iv,
                            grant_type: "password",
                            auth_approach: 'wxapp',
                        },
                        method: "POST",
                        success: function (res) {
                            if (res.statusCode === 201) {
                                // 得到 jwt 后存储到 storage，
                                wx.showToast({
                                    title: '登录成功',
                                    icon: 'success'
                                });
                                wx.setStorage({
                                    key: "jwt",
                                    data: res.data
                                });
                                that.setData({
                                    access_token: res.data.access_token,
                                    account_id: res.data.sub
                                })
                            } else if (res.statusCode === 401) {
                                // 如果没有注册调用注册接口
                                register(that);
                            } else {
                                // 提示错误信息
                                wx.showToast({
                                    title: res.data.text,
                                    icon: 'success',
                                    duration: 2000
                                });
                            }
                        },
                        fail: function (res) {
                            console.log('request token fail');
                        }
                    })
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
            })
        }
    })
}

var register = function(that) {
    // 注册代码
    wx.login({ // 调用登录接口获取 code
        success: function (res) {
            var code = res.code;
            wx.getUserInfo({
                // 调用 getUserInfo 获取 encryptedData 和 iv
                success: function (res) {
                    // success
                    that.setData({
                        userInfo: res.userInfo
                    });
                    var encryptedData = res.encryptedData || 'encry';
                    var iv = res.iv || 'iv';
                    console.log(iv);
                    wx.request({ // 请求注册用户接口
                        url: config.host + '/auth/accounts/wxapp',
                        header: {
                            Authorization: config.basic_token
                        },
                        data: {
                            username: encryptedData,
                            password: iv,
                            code: code,
                        },
                        method: "POST",
                        success: function (res) {
                            if (res.statusCode === 201) {
                                wx.showToast({
                                    title: '注册成功',
                                    icon: 'success'
                                });
                                login(that);
                            } else if (res.statusCode === 400) {
                                wx.showToast({
                                    title: '用户已注册',
                                    icon: 'success'
                                });
                                that.login();
                            } else if (res.statusCode === 403) {
                                wx.showToast({
                                    title: res.data.text,
                                    icon: 'success'
                                });
                            }
                            console.log(res.statusCode);
                            console.log('request token success');
                        },
                        fail: function (res) {
                            console.log('request token fail');
                        }
                    })
                },
                fail: function () {
                    // fail
                },
                complete: function () {
                    // complete
                }
            })
        }
    })
}

module.exports = {
    login: login,
    register: register,
    request: request
}