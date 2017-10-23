//app.js
var config = require('./config.js');
var common = require('./common.js');

App({
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        var that = this;
    },
    checkLogin: function(cb) {
        var that = this;
        if (that.globalData.jwt) {
            cb && cb();
        } else {
            common.login(cb ? cb : function() {})
        }
    },
    globalData: {
        userInfo: null,
        jwt: null
    }
})