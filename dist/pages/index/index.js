//index.js
//获取应用实例
var config = require('../../config.js');
var common = require('../../common.js');
var app = getApp()
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        imgUrls: [
            '../../style/images/tooopen_sy_143912755726.jpg',
            '../../style/images/tooopen_sy_175866434296.jpg',
            '../../style/images/tooopen_sy_175833047715.jpg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        handpicks: []
    },
    //事件处理函数
    bindViewTap: function() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function() {
        var that = this,
          jwt = {};
        try {
          var jwt = wx.getStorageSync('jwt')
          console.log(jwt);
          if (jwt) {
              that.setData({
                  jwt: jwt
              })
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