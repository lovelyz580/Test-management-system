// pages/underLinePayment/underLinePayment.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paystatic: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.setData({
      orderid: options.orderid,
    })
    // 查询订单详情
    app.util.request({
      url: 'apply_check/selectThreeTablesByUnionDataByTimeDesc',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        orderid: this.data.orderid,
        pagenumber: -1,
        pagesize: ""
      },
      success: function(res) {
        console.log(res)
        var array = res.data.data[0];
        that.setData({
          orderaddress: array.orderaddress,
          customermoney: array.customermoney,
          ordercontactperson: array.ordercontactperson,
          ordercontactphone: array.ordercontactphone,
          orderplantime: array.orderplantime,
          orderprojectname: array.orderprojectname,
          orderprojecttype: array.orderprojecttype,
          applycheckmoney: array.applycheckmoney,
          ordertype: array.ordertype,
          ordertotalmoney: array.ordertotalmoney,
          orderintercepttotalmoney: array.orderintercepttotalmoney,
          ordertraveltotalmoney: array.ordertraveltotalmoney,
          buildingtypeid: array.buildingtypeid,
          orderpricetotalmoney: array.orderpricetotalmoney,
          ordercreateuserid: array.ordercreateuserid,
          orderlatitude: array.orderlatitude,
          orderlongitude: array.orderlongitude,
          code: "JH" + that.data.orderid
        })
      }
    });
  },
  Btn: function e() {
    var that = this
    var type = this.data.ordertype
    //  存数据库   跳转到订单列表页
    wx.showModal({
      title: '确认付款',
      content: '请确认是否付款成功',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.util.request({
            url: 'userPayment/insertByUserPaymentAndUpdateOrderAndUpdateMoney',
            header: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            data: {
              version: app.siteinfo.version,
              pagenumber: -1,
              pagesize: "",
              orderid: that.data.orderid,
              orderprojectname: that.data.orderprojectname,
              identificationcode: that.data.code,
              orderpricetotalmoney: that.data.customermoney,
              userpaymentother2: that.data.applycheckmoney,
              remitteruserid: that.data.ordercreateuserid

            },
            success: function(res) {
              console.log(res)
              wx.switchTab({
                url: '../personal/personal',
              })
            }
          });
        } else if (res.cancel) {
          wx.redirectTo({
            url: '../orderManage/orderManage',
            success: function(res) {},
          })

        }
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