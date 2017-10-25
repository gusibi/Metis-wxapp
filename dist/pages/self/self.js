// self.js
const app = getApp()
var config = require('../../config.js');
var common = require('../../common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        items: [{
                icon: '../../assets/images/iconfont-order.png',
                text: '我创建的测试',
                path: '/pages/self_tests/list/list'
            },
            {
                icon: '../../assets/images/iconfont-addr.png',
                text: '我参与的测试',
                path: '/pages/self_testing/list'
            },
        ],
        jwt: {},
        account: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    navigateTo: function(e) {
        const index = e.currentTarget.dataset.index
        const path = e.currentTarget.dataset.path

        wx.navigateTo({ 'url': path })
    },
    onLoad: function(options) {
        var test_id = options.test_id,
            that = this,
            jwt = {};

        app.checkLogin(that.get_user_info());
    },

    get_user_info: function() {
        var that = this;
        common.request({ // 请求注册用户接口
            url: '/auth/accounts/self',
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            method: "GET",
            that: this,
            success: function(res) {
                if (res.statusCode === 200) {
                    wx.showToast({
                        title: '取到用户信息',
                        icon: 'success'
                    });
                    that.setData({
                        account: res.data
                    });
                    that.save_user_info(res.data);
                } else if (res.statusCode === 404) {
                    wx.showToast({
                        title: '用户不存在',
                        icon: 'success'
                    });
                }
            }
        })
    },

    save_user_info: function(account) {
        wx.setStorage({
            key: 'account_self',
            data: account,
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