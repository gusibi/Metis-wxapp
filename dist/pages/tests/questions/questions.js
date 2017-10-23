var config = require('../../../config.js');
var common = require('../../../common.js');
var util = require('../../../utils/util.js');
Page({
    data: {
        showTopTips: false,
        error_msg: null,
        checked_value: null,
        test_id: null,
        step: 0,
        jwt: {},
        questions: []
    },
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
        try {
            var jwt = wx.getStorageSync('jwt')
            if (jwt) {
                that.setData({
                    jwt: jwt
                })
            } else {
                common.login(that)
            }
        } catch (e) {
            common.login(that)
        }
        this.get_test_questions(test_id, step);
    },
    get_test_questions: function(test_id, step) {
        var that = this;
        common.request({ // 发送请求 获取 jwts
            url: '/v1/tests/' + test_id + '/questions',
            header: {
                Authorization: 'JWT' + ' ' + that.data.jwt.access_token
            },
            method: "GET",
            that: that,
            success: function(res) {
                if (res.statusCode === 200) {
                    that.setData({
                        questions: res.data,
                        question: res.data[step]
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
    showTips: function(msg) {
        var that = this;
        this.setData({
            showTopTips: true,
            error_msg: msg
        });
        setTimeout(function() {
            that.setData({
                showTopTips: false
            });
        }, 3000);
    },
    submit_answers: function(that) {
        common.request({ // 发送请求 获取 jwt
            url: '/v1/tests/' + that.data.test_id + '/answers',
            header: {
                Authorization: 'JWT' + ' ' + that.data.jwt.access_token
            },
            data: {
                question_id: that.data.question.id,
                options: [Number(that.checked_value)]
            },
            that: that,
            method: "POST",
            success: function(res) {
                if (res.statusCode === 201) {
                    if (res.data.last) {
                        // 跳到分数页
                        var url = "/pages/tests/answered/answered?test_id=" + that.data.test_id + "&title=" + that.data.title;
                    } else {
                        // 跳到下一题
                        var url = "/pages/tests/questions/questions?test_id=" + that.data.test_id + "&title=" + that.data.title + "&step=" + (Number(that.data.step) + 1);
                    }
                    wx.redirectTo({
                        url: url,
                    })
                } else {
                    // 提示错误信息
                    wx.showToast({
                        title: res.data.error_code,
                        icon: 'success',
                        duration: 2000
                    });
                }
            }
        })
    },
    submit: function() {
        var that = this;
        if (!that.checked_value) {
            that.showTips('请选择答案');
        } else {
            console.log(that);
            that.submit_answers(that)
        }
    },
    radioChange: function(e) {
        var that = this;
        // console.log('radio发生change事件，携带value值为：', e.detail.value);
        var question = this.data.question;
        var options = question.options;
        for (var i = 0, len = options.length; i < len; ++i) {
            options[i].checked = i == e.detail.value;
        }
        that.checked_value = e.detail.value;
        question['options'] = options
        this.setData({
            question: question
        });
    },
});