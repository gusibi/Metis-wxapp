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
            console.log('111111')
            cb && cb();
        } else {
            console.log('22222')
            common.login(cb ? cb : function() {})
        }
    },
    globalData: {
        userInfo: null,
        jwt: null
    }
})