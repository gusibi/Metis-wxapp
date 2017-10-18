// test_detail.js
var config = require('../../config.js');
var common = require('../../common.js');
var util = require('../../utils/util.js');

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
        var that = this,
            jwt = {};
        try {
            var jwt = wx.getStorageSync('jwt')
            if (jwt) {
                that.setData({
                    jwt: jwt
                })
            }
        } catch (e) {
            common.login(that)
        }
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
        wx.request({ // 发送请求 获取 jwts
            url: config.host + '/v1/self/tests/' + test_id,
            header: {
                Authorization: 'JWT' + ' ' + that.data.jwt.access_token
            },
            method: "GET",
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
            },
            fail: function(res) {
                console.log('添加测试失败');
            }
        })
    },

    publishTest: function() {
        console.log('publish');
        var that = this;
        wx.request({ // 发送请求 获取 jwts
            url: config.host + '/v1/self/tests/' + that.data.test_id,
            header: {
                Authorization: 'JWT' + ' ' + that.data.jwt.access_token
            },
            method: "PUT",
            data: { status: 'published' },
            success: function(res) {
                console.log(res.data)
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
            },
            fail: function(res) {
                console.log('发布测试失败');
            }
        })
    },
    cancelPublishTest: function() {
        console.log('cancel publish');
        var that = this;
        wx.request({ // 发送请求 获取 jwts
            url: config.host + '/v1/self/tests/' + that.data.test_id,
            header: {
                Authorization: 'JWT' + ' ' + that.data.jwt.access_token
            },
            method: "PUT",
            data: { status: 'draft' },
            success: function(res) {
                console.log(res.data)
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
            },
            fail: function(res) {
                console.log('发布测试失败');
            }
        })
    },
    updateTest: function() {
        console.log('update');
        var that = this;
        wx.redirectTo({
            url: '/pages/self_tests/update?test_id=' + that.data.test_id + '&title=' + that.data.test_title,
        });
    },
    deleteTest: function() {
        console.log('delete');
        var that = this;
        wx.request({ // 发送请求 获取 jwts
            url: config.host + '/v1/self/tests/' + that.data.test_id,
            header: {
                Authorization: 'JWT' + ' ' + that.data.jwt.access_token
            },
            method: "DELETE",
            success: function(res) {
                console.log(res.data)
                if (res.statusCode === 204) {
                    wx.redirectTo({
                        url: '/pages/self_tests/list',
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
            fail: function(res) {
                console.log('删除失败');
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