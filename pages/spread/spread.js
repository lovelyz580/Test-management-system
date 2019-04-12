// pages/spread/spread.js
var app = getApp();
Page({
      /**
       * 页面的初始数据
       */
      data: {
        userid: "",
         url: 'https://www.fhmpt.cn',
        images:""
      },
      closs: function() {
        this.setData({
          isShow: false
        })
      },

      // 查看图片
  previewImage: function (e) {
    var url = this.data.url+this.data.images
    console.log(url)
    wx.previewImage({
      urls: url.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错
    })
  },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function(options) {
          var that = this;
          wx.getStorage({
            key: 'userid',
            success: function(res) {
              that.setData({
                userid: res.data
              })
              app.util.request({
                url: 'wechat/getExtensionQRCode',
                method: 'post',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  userId: that.data.userid
                },
                success: function(res) {
                  that.setData({
                    images: res.data.msg
                  })
                },
                fail: function () {
                  wx.showModal({
                    content: "发送请求失败",
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                      }
                    }
                  });
                }
              });
              app.util.request({
                url: 'user/selectThreeTablesByUnionData',
                method: 'post',
                header: {
                  "Content-Type": "application/json;charset=UTF-8"
                },
                data: {
                  version: app.siteinfo.version,
                  pagenumber: -1,
                  pagesize: "",
                  userinvitationuserid: that.data.userid
                },
                success: function (res) {
                  that.setData({
                    sum:res.data.count,
                    userlist:res.data.data
                  })
                },
                fail: function () {
                  wx.showModal({
                    content: "发送请求失败",
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                      }
                    }
                  });
                }
              });
            },
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