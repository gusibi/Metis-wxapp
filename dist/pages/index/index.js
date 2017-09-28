//index.js
//获取应用实例
var config = require('../../config.js');
var common = require('../../common.js');
var app = getApp()
Page({
    data: {
        userInfo: {},
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        handpicks: []
    },
    //事件处理函数
    onLoad: function() {
        var that = this,
          jwt = {};
        try {
          var jwt = wx.getStorageSync('jwt')
          if (jwt) {
              that.setData({
                  jwt: jwt
              })
          }else{
              common.login(that)
          }
      } catch (e) {
          common.login(that)
      }
      that.get_test_handpicks();
    },
    get_test_handpicks: function(){
      var that = this;
      common.request({
          url: '/v1/tests/handpick',
          header: {
              Authorization: 'JWT' + ' ' + that.data.jwt.access_token
          },
          method: "GET",
          that: this,
          success: function (res) {
              that.setData({
                  handpicks: res.data
              })
          }
      })
  },
})