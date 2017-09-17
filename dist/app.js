//app.js
var config = require('./config.js');
var common = require('./common.js');

App({
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        var jwt = wx.getStorageSync('jwt');
        var that = this;
        if (!jwt.access_token){ //检查 jwt 是否存在 如果不存在调用登录
            common.login(that);
        } else {
            console.log(jwt.account_id);
        }
    },
    get_user_info: function(jwt) {
        config.request({
            url: '/auth/accounts/self',
            header: {
                Authorization: jwt.token_type + ' ' + jwt.access_token
            },
            method: "GET",
            that: this
        })
    },

    globalData: {
        userInfo: null
    }
})