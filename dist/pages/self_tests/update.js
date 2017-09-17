// update.js
var config = require('../../config.js');
var common = require('../../common.js');
var upload = require('../../utils/upload.js');
var start_time_picker = {
                lable: "开始时间",
                date_value: null,
                time_value: null,
                date_name: "start_date",
                time_name: "start_time",
                start_date: '2015-09-01',
                end_date: '2017-09-01',
                start_time: '00:00',
                end_time: '23:59'
            };
var end_time_picker = {
                lable: "结束时间",
                date_value: null,
                time_value: null,
                date_name: "end_date",
                time_name: "end_time",
                start_date: '2017-09-01',
                end_date: '2020-12-30',
                start_time: '00:00',
                end_time: '23:59',
            };
Page({

  /**
   * 页面的初始数据
   */
  data: {
      files: [],
      start_time_picker: start_time_picker,
      end_time_picker:  end_time_picker,
      time_pickers: [start_time_picker, end_time_picker],
      test: {}
  },

      showTopTips: function () {
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
    bindStartDateChange: function (e) {
        console.log('start_date：', e.detail.value)
        this.setData({
            start_date: e.detail.value
        })
    },
    bindStartTimeChange: function (e) {
        console.log('end_time：', e.detail.value)
        this.setData({
            start_time: e.detail.value
        })
    },
    bindEndDateChange: function (e) {
        console.log('end_date：', e.detail.value)
        this.setData({
            end_date: e.detail.value
        })
    },
    bindEndTimeChange: function (e) {
        console.log('end_time：', e.detail.value)
        this.setData({
            end_time: e.detail.value
        })
    },
    previewImage: function(e){
        var that = this;
        var files = that.data.files;
        // 预览图片
        var image = files[e.currentTarget.id]
        console.log(image)
    },
    deleteImage: function(e){
        // 长按删除图片
        var that = this;
        var files = that.data.files;
        files.splice(e.currentTarget.id, 1);
        that.setData({
            files: files
        })
    },
    formSubmit: function (e) {
        var that = this;
        console.log('form发生了submit事件，携带数据为：', e.detail.value)
        var form_data = e.detail.value;
        var params = {
            'title': form_data.title,
            'image': form_data.image,
            'description': form_data.description,
            'remark': form_data.remark,
            'start_time': form_data.start_date  + ' ' + form_data.start_time,
            'end_time': form_data.end_date + ' ' + form_data.end_time
        };
        console.log('form发生了submit事件，表单数据为：', params);
        wx.request({ // 发送请求 获取 jwts
            url: config.host + '/v1/self/tests/' + that.data.test_id,
            header: {
                Authorization: 'JWT' + ' ' + that.data.jwt.access_token
            },
            data: params,
            method: "PUT",
            success: function (res) {
                if (res.statusCode === 200) {
                    // 得到 jwt 后存储到 storage，
                    wx.showToast({
                        title: '修改成功',
                        icon: 'success'
                    });
                    wx.redirectTo({
                        url: '/pages/self_tests/test_detail?test_id=' + res.data.id + '&title=' + res.data.title,
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
                console.log('更新测试失败');
            }
        })
    },
    formReset: function () {
        console.log('form发生了reset事件')
    },
    uploadToCos: function () {
        var that = this;

        // 选择上传的图片
        wx.chooseImage({
            sizeType: ['original', 'compressed'],
            success: function (res) {

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
      that.get_test_detail(options.test_id);
      wx.setNavigationBarTitle({
          title: '随你选测试'
      });
  },

  get_test_detail: function(test_id){
      var that = this;
      wx.request({ // 发送请求 获取 jwts
          url: config.host + '/v1/self/tests/' + test_id,
          header: {
              Authorization: 'JWT' + ' ' + that.data.jwt.access_token
          },
          method: "GET",
          success: function (res) {
              console.log(res.data)
              if (res.statusCode === 200) {
                  var start_time_picker = that.data.start_time_picker;
                  var end_time_picker = that.data.end_time_picker;
                  end_time_picker.time_value = res.data.time_end;
                  end_time_picker.date_value = res.data.date_end;
                  start_time_picker.time_value = res.data.time_start;
                  start_time_picker.date_value = res.data.date_start;
                  that.setData({
                      test: res.data,
                      files: [res.data.image],
                      time_pickers: [start_time_picker, end_time_picker]
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
          fail: function (res) {
              console.log('添加测试失败');
          }
      })
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