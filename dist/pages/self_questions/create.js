// create.js
var config = require('../../config.js');
var common = require('../../common.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        test_id: '',
        test_title: '',
        showTopTips: false,
        checkboxItems: [
            { name: '', value: '0', checked: false },
            { name: '', value: '1', checked: false }
        ],
        error_msg: '错误提示',
        checkedItem: []

    },
    showTopTips: function (error_msg) {
        var that = this;
        this.setData({
            showTopTips: true
        });
        setTimeout(function () {
            that.setData({
                showTopTips: false
            });
        }, 3000);
    },
    checkboxChange: function (e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value);

        var checkboxItems = this.data.checkboxItems, values = e.detail.value;
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
        var checkboxItems = this.data.checkboxItems;
        var checkbox = checkboxItems[checkboxItems.length -1];
        var last_value = checkbox.value;
        var next_value = Number(last_value) + 1
        if (next_value < 5){
            checkboxItems.push({ name: '', value: next_value, checked: false })
            this.setData({
                checkboxItems: checkboxItems
            });
        } else{
            this.showTopTips("最多只能添加5个选项")
        }
       
    },
    formSubmit: function (e) {
        var that = this;
        var form_data = e.detail.value;
        console.log(form_data)
        console.log(this.data.checkboxItems)
        var options = [];
        this.data.checkboxItems.forEach(function(item) {
            var name = 'option' + item.value;
            var option = {
                "option": form_data[name],
                "index": Number(item.value),
                "is_checked": item.checked
            }
            options.push(option)
        })
        console.log(options)
        if (form_data.multiple_choice){
            var type = 'multiple_choice'
        }else{
            var type = 'single_choice'
        }
        var params = {
            'title': form_data.title,
            'options': options,
            'type': type
        };
        console.log('form发生了submit事件，表单数据为：', params);
        wx.request({ // 发送请求 获取 jwts
            url: config.host + '/v1/self/tests/' + that.data.test_id + '/questions',
            header: {
                Authorization: 'JWT' + ' ' + that.data.jwt.access_token
            },
            data: params,
            method: "POST",
            success: function (res) {
                if (res.statusCode === 201) {
                    // 得到 jwt 后存储到 storage，
                    wx.showToast({
                        title: '创建成功',
                        icon: 'success'
                    });
                    wx.redirectTo({
                        url: '/pages/self_tests/questions?test_id=' + that.data.test_id + '&title=' + that.data.test_title,
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
            fail: function (res) {
                console.log('添加测试失败');
            }
        })
    },
    formReset: function () {
        console.log('form发生了reset事件')
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this,
            jwt = {};
        try {
            var jwt = wx.getStorageSync('jwt')
            console.log(jwt);
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
        console.log(that.data)
        wx.setNavigationBarTitle({
            title: '随你选测试'
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})