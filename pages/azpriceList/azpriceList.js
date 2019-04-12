// pages/azpriceList/azpriceList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagenumber:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userid = wx.getStorageSync("userid")
    that.setData({
      userid: userid
    })
    // 获取报价列表
    app.util.request({
      url: 'price/selectFourTablesByUnionData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: 1,
        pagesize: "10",
        pricestate: "Y",
        pricetype: "AZ",
        priceupdateuserid: that.data.userid,
      },
      success: function (res) {
        console.log(res)
        that.setData({
          priceList :res.data.data
        })
        console.log(that.data.priceList)
      },
      fail: function () {
        wx.showModal({
          content: "发送请求失败",
          showCancel: false,
          success: function (res) {
            if (res.confirm) { }
          }
        });
      }
    });
  },
  getMorePrice(){
    var that = this
    app.util.request({
      url: 'price/selectFourTablesByUnionData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: that.data.pagenumber,
        pagesize: "10",
        pricestate: "Y",
        pricetype: "AZ",
        priceupdateuserid: that.data.userid,
      },
      success: function (res) {
        console.log(res)
        if (res.data.data.length == 0) {
          wx.showModal({
            content: "已加载全部内容",
            showCancel: false,
            success: function (res) {
              return;
            }
          })
        }
        that.setData({
          pagenumber: that.data.pagenumber + 1
        })
        var list = that.data.priceList
        var lists = [...list, ...res.data.data]
        that.setData({
          priceList: lists,
        })
      },
      fail: function () {
        wx.showModal({
          content: "发送请求失败",
          showCancel: false,
          success: function (res) {
            if (res.confirm) { }
          }
        });
      }
    });
  },
// 点击修改单价
  alertPrice:function(e){
    console.log(e)
    var priceid = e.currentTarget.dataset.id
  wx.navigateTo({
    url: '../azpricealt/azpricealt?priceid=' + priceid,
  })
},
// 点击添加价格列表
  addprice:function (e){
    wx.navigateTo({
      url: '../azpriceadd/azpriceadd',
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
    this.setData({
      onclick: false,
      addclick: false
    })
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
  onReachBottom: function (e) {
    var that = this;
    this.getMorePrice()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})