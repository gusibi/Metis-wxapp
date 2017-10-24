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
        handpicks: [],
        banner_tests: [],
    },
    //事件处理函数
    onLoad: function() {
        var that = this;
        app.checkLogin(that.get_test_banner);
        app.checkLogin(that.get_test_handpicks);
        // this.onPullDownRefresh()
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        var that = this;
        wx.showLoading({
            title: "加载中",
        })
        that.get_test_banner();
        that.get_test_handpicks();
        wx.stopPullDownRefresh();
    },
    get_test_banner: function() {
        var that = this;
        common.request({
            url: '/v1/tests/banner',
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            method: "GET",
            that: that,
            success: function(res) {
                wx.hideLoading()
                that.setData({
                    banner_tests: res.data
                })
            }
        })
    },
    get_test_handpicks: function() {
        var that = this;
        common.request({
            url: '/v1/tests/handpick',
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            method: "GET",
            that: that,
            success: function(res) {
                wx.hideLoading()
                that.setData({
                    handpicks: res.data
                })
            }
        })
    },
})