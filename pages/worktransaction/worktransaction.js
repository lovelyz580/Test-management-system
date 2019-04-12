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
  onLoad: function(options) {
    console.log("维修交易记录")
    var that = this
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          userid: res.data
        })
        app.util.request({
          url: 'user_service_income_money/selectThreeTablesByUnionData',
          header: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          method: "POST",
          data: {
            version: app.siteinfo.version,
            userserviceincomemoneyuserid: that.data.userid, //提现人员ID
            pagenumber: -1,
            pagesize: ""
          },
          success: function(res) {
            console.log(res)
            if(res.data.count>0){

            
            that.setData({
              list: res.data.data
            })
            }else{
              wx.showModal({
                content: res.data.msg,
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../myWallet/myWallet',
                    })
                  }
                }
              });
            }
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
// 查询一条记录
  taskListDetail: function (e) {
    wx.navigateTo({
      url: '../orderdetail/orderdetail?orderid=' + e.currentTarget.dataset.id,
    })
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