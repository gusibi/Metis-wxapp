// test_detail.js
var config = require('../../../config.js');
var common = require('../../../common.js');
var util = require('../../../utils/util.js');
var app = getApp();

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
        app.checkLogin();
        that.setData({
            title: options.title,
            test_id: options.test_id
        });
        that.get_test_detail(options.test_id);
        wx.setNavigationBarTitle({
            title: '随你选测试'
        });
    },

    get_test_detail: function(test_id) {
        var that = this;
        common.request({ // 发送请求 获取 jwts
            url: '/v1/self/tests/' + test_id,
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            method: "GET",
            that: that,
            success: function(res) {
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

    publishTest: function() {
        var that = this;
        common.request({ // 发送请求 获取 jwts
            url: '/v1/self/tests/' + that.data.test_id,
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            method: "PUT",
            data: { status: 'published' },
            that: that,
            success: function(res) {
                if (res.statusCode === 200) {
                    that.setData({
                        test: util.formatObjectTime(res.data, ['start_time', 'end_time'])
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
    cancelPublishTest: function() {
        var that = this;
        common.request({ // 发送请求 获取 jwts
            url: '/v1/self/tests/' + that.data.test_id,
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            method: "PUT",
            data: { status: 'draft' },
            that: that,
            success: function(res) {
                if (res.statusCode === 200) {
                    that.setData({
                        test: util.formatObjectTime(res.data, ['start_time', 'end_time'])
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
    updateTest: function() {
        var that = this;
        wx.redirectTo({
            url: '/pages/self_tests/update/update?test_id=' + that.data.test_id + '&title=' + that.data.test_title,
        });
    },
    deleteTest: function() {
        var that = this;
        common.request({ // 发送请求 获取 jwts
            url: '/v1/self/tests/' + that.data.test_id,
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            method: "DELETE",
            that: that,
            success: function(res) {
                if (res.statusCode === 204) {
                    wx.redirectTo({
                        url: '/pages/self_tests/list/list',
                    });
                } else {
                    // 提示错误信息
                    wx.showToast({
                        title: res.data.text,
                        icon: 'success',
                        duration: 2000
                    });
                }
            },
        })
    },
    redirectToQuestions: function() {
        var that = this;
        var url = "/pages/self_tests/questions/questions?test_id=" + that.data.test_id + "&title=" + that.data.test_title;
        wx.redirectTo({
            url: url,
            success: function(res) {
                // success
            },
            fail: function() {
                // fail
            },
            complete: function() {
                // complete
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