// pages/tests/answered.js
var app = getApp();
var config = require('../../../config.js');
var common = require('../../../common.js');
var util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showTopTips: false,
        error_msg: null,
        test_id: null,
        jwt: {},
        answer: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var step = Number(options.step) || 0,
            test_id = options.test_id,
            title = options.title,
            that = this,
            jwt = {};
        if (!test_id) {
            that.showTopTips('测试不存在！')
        } else {
            that.setData({
                test_id: test_id,
                title: title,
                step: step
            })
        };
        app.checkLogin(this.get_test_score);
    },
    get_test_score: function() {
        var that = this,
            test_id = this.data.test_id,
            step = this.data.step;
        common.request({ // 发送请求 获取 jwts
            url: '/v1/tests/' + test_id + '/score',
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            method: "GET",
            that: that,
            success: function(res) {
                if (res.statusCode === 200) {
                    that.setData({
                        answer: res.data
                    })
                } else {
                    // 提示错误信息
                    wx.showToast({
                        title: res.data.text,
                        icon: 'success',
                        duration: 2000
                    });
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})