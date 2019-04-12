// pages/transaction/transaction.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    money: "",
    userid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  taskListDetail: function (e) {
    wx.navigateTo({
      url: '../orderdetail/orderdetail?orderid=' + e.currentTarget.dataset.id,
    })
  },

  onLoad: function(options) {
    console.log("用户交易记录")
    var that = this
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          userid: res.data
        })
        app.util.request({
          url: 'user_customer_income_money/selectThreeTablesByUnionData',

          header: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          method: "POST",
          data: {
            version: app.siteinfo.version,
            usercustomerincomemoneyuserid: that.data.userid, //提现人员ID
            pagenumber: -1,
            pagesize: ""
          },
          success: function(res) {
            console.log(res)
            that.setData({
              list: res.data.data
            })
          },
          fail: function() {
            wx.showModal({
              content: "发送请求失败",
              showCancel: false,
              success: function(res) {
                if (res.confirm) {

                }
              }
            });
          }
        });



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