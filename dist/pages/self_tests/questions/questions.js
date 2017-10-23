// pages/self_tests/questions.js
var config = require('../../../config.js');
var common = require('../../../common.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        test: {},
        test_id: null,
        test_title: null,
        questions: []
    },

    get_test_questions: function() {
        var that = this;
        var test_id = that.data.test_id;
        common.request({ // 发送请求 获取 jwts
            url: '/v1/self/tests/' + test_id + '/questions',
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            method: "GET",
            that: that,
            success: function(res) {
                if (res.statusCode === 200) {
                    res.data.forEach(function(q) {
                        q.open = false
                    })
                    that.setData({
                        questions: res.data
                    })
                    console.log(that.data)
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
    kindToggle: function(e) {
        var id = e.currentTarget.id,
            list = this.data.questions;
        for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].open = !list[i].open
            } else {
                list[i].open = false
            }
        }
        this.setData({
            questions: list
        });
    },
    redirectAddQuestion: function() {
        var that = this;
        var url = "/pages/self_questions/create?test_id=" + that.data.test_id + "&title=" + that.data.test_title;
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        that.setData({
            test_id: options.test_id,
            test_title: options.title
        });
        app.checkLogin(that.get_test_questions)
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