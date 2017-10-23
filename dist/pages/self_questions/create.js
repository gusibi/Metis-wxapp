// create.js
var config = require('../../config.js');
var common = require('../../common.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        test_id: '',
        test_title: '',
        showTopTips: false,
        radioItems: [
            { name: '', value: '0', checked: false },
            { name: '', value: '1', checked: false },
            { name: '', value: '2', checked: false },
            { name: '', value: '3', checked: false }
        ],
        error_msg: '错误提示'

    },
    showTips: function(error_msg) {
        var that = this;
        this.setData({
            showTopTips: true,
            error_msg: error_msg
        });
        setTimeout(function() {
            that.setData({
                showTopTips: false
            });
        }, 3000);
    },
    radioChange: function(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            radioItems: radioItems
        });
    },
    checkboxChange: function(e) {
        var checkboxItems = this.data.checkboxItems,
            values = e.detail.value;
        for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
            checkboxItems[i].checked = false;
            for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (checkboxItems[i].value == values[j]) {
                    checkboxItems[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            checkboxItems: checkboxItems
        });
        console.log(checkboxItems)
    },
    addOption: function() {
        console.log('添加一个题目')
        var radioItems = this.data.radioItems;
        var checkbox = radioItems[radioItems.length - 1];
        var last_value = checkbox.value;
        var next_value = Number(last_value) + 1
        if (next_value < 5) {
            radioItems.push({ name: '', value: next_value, checked: false })
            this.setData({
                radioItems: radioItems
            });
        } else {
            this.showTips("最多只能添加5个选项")
        }
    },
    formSubmit: function(e) {
        var that = this;
        var form_data = e.detail.value;
        var options = [];
        var is_checked = false;
        this.data.radioItems.forEach(function(item) {
            var name = 'option' + item.value;
            console.log(item);
            var option = {
                "option": form_data[name],
                "index": Number(item.value),
                "is_checked": item.checked
            }
            if (item.checked) {
                is_checked = item.checked;
            }
            options.push(option)
        })
        if (!is_checked) {
            this.showTips("请选择答案")
        } else {
            if (form_data.multiple_choice) {
                var type = 'multiple_choice'
            } else {
                var type = 'single_choice'
            }
            var params = {
                'title': form_data.title,
                'options': options,
                'type': type
            };
            common.request({
                url: '/v1/self/tests/' + that.data.test_id + '/questions',
                header: {
                    Authorization: 'JWT' + ' ' + app.globalData.jwt.access_token
                },
                data: params,
                method: "POST",
                that: this,
                success: function(res) {
                    if (res.statusCode === 201) {
                        wx.showToast({
                            title: '创建成功',
                            icon: 'success'
                        });
                        wx.redirectTo({
                            url: '/pages/self_tests/questions/questions?test_id=' + that.data.test_id + '&title=' + that.data.test_title,
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
        }

    },
    formReset: function() {
        console.log('form发生了reset事件')
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
        console.log(that.data)
        wx.setNavigationBarTitle({
            title: '随你选测试'
        });
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