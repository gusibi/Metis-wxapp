// test.js
var app = getApp();
var config = require('../../../config.js');
var common = require('../../../common.js');
var util = require('../../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        test: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            title: options.title,
            test_id: options.test_id
        });
        app.checkLogin(that.get_test_detail);
        wx.setNavigationBarTitle({
            title: '随你选测试'
        });
    },

    get_test_detail: function() {
        var that = this,
            test_id = this.data.test_id;
        common.request({ // 发送请求 获取 jwts
            url: '/v1/tests/' + test_id,
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            method: "GET",
            that: that,
            success: function(res) {
                console.log(res.data)
                if (res.statusCode === 200) {
                    that.setData({
                        test: res.data
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