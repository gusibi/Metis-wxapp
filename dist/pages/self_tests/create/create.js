// tests/create.js
var config = require('../../../config.js');
var common = require('../../../common.js');
var upload = require('../../../utils/upload.js')
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        showTopTips: false,
        start_date: "2012-01-01",
        start_time: "00:00",
        end_date: "2020-12-30",
        end_time: "23:59",
        files: [],
        test_image: '',
        upload_fail: false,
        upload_progress: 0,
        upload_res: {},
        time_pickers: [{
                lable: "开始时间",
                date_name: "start_date",
                time_name: "start_time",
                start_date: '2015-09-01',
                end_date: '2017-09-01',
                start_time: '00:00',
                end_time: '23:59'
            },
            {
                lable: "结束时间",
                date_name: "end_date",
                time_name: "end_time",
                start_date: '2017-09-01',
                end_date: '2020-12-30',
                start_time: '00:00',
                end_time: '23:59',
            }
        ]
    },
    showTopTips: function() {
        var that = this;
        this.setData({
            showTopTips: true
        });
        setTimeout(function() {
            that.setData({
                showTopTips: false
            });
        }, 3000);
    },
    bindStartDateChange: function(e) {
        console.log('start_date：', e.detail.value)
        this.setData({
            start_date: e.detail.value
        })
    },
    bindStartTimeChange: function(e) {
        console.log('end_time：', e.detail.value)
        this.setData({
            start_time: e.detail.value
        })
    },
    bindEndDateChange: function(e) {
        console.log('end_date：', e.detail.value)
        this.setData({
            end_date: e.detail.value
        })
    },
    bindEndTimeChange: function(e) {
        console.log('end_time：', e.detail.value)
        this.setData({
            end_time: e.detail.value
        })
    },
    previewImage: function(e) {
        var that = this;
        var files = that.data.files;
        // 预览图片
        var image = files[e.currentTarget.id]
        console.log(image)
    },
    deleteImage: function(e) {
        // 长按删除图片
        var that = this;
        var files = that.data.files;
        files.splice(e.currentTarget.id, 1);
        that.setData({
            files: files
        })
    },
    formSubmit: function(e) {
        var that = this;
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        var form_data = e.detail.value;
        var params = {
            'title': form_data.title,
            'image': form_data.image,
            'description': form_data.description,
            'remark': form_data.remark,
            'start_time': form_data.start_date + ' ' + form_data.start_time,
            'end_time': form_data.end_date + ' ' + form_data.end_time
        };
        console.log('form发生了submit事件，表单数据为：', params);
        common.request({ // 发送请求 创建测试
            url: '/v1/self/tests',
            header: {
                Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
            },
            data: params,
            method: "POST",
            that: that,
            success: function(res) {
                if (res.statusCode === 201) {
                    wx.showToast({
                        title: '创建成功',
                        icon: 'success'
                    });
                    wx.redirectTo({
                        url: '/pages/self_tests/detail/detail?test_id=' + res.data.id + '&title=' + res.data.title,
                    });
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
    formReset: function() {
        console.log('form发生了reset事件')
    },
    uploadToCos: function() {
        var that = this;

        // 选择上传的图片
        wx.chooseImage({
                success: function(res) {

                    // 获取文件路径
                    var file = res.tempFiles[0];
                    console.log(file.size);

                    // 获取文件名
                    var fileName = file.path.match(/(wxfile:\/\/)(.+)/)
                    fileName = fileName[2]

                    // 文件上传cos
                    upload(file.path, fileName, that);
                }
            })
            // console.log()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        app.checkLogin();
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