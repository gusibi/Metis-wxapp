// pages/tests/testing/list.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var config = require('../../config.js');
var common = require('../../common.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: ["已完成", "进行中"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        finished_tests: [],
        pending_tests: []
    },
    tabClick: function(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        if (e.currentTarget.id == 0) {
            this.get_tests('finished');
        } else if (e.currentTarget.id == 1) {
            this.get_tests('pending');
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        var that = this;
        app.checkLogin();
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
                });
            }
        });
        that.get_tests('finished');
    },

    get_tests: function(status) {
        var that = this;
        common.request({ // 已发布的测试
            url: '/v1/self/testings?status=' + status,
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            method: "GET",
            that: that,
            success: function(res) {
                if (res.statusCode === 200) {
                    if (status === 'finished') {
                        that.setData({
                            finished_tests: res.data
                        });
                    } else if (status == 'pending') {
                        that.setData({
                            pending_tests: res.data
                        });
                    }
                } else if (res.statusCode !== 200) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success'
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