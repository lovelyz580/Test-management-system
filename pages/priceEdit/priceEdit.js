// pages/priceEdit/priceEdit.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    priceArray: [],
    goodsname: "", //产品名称
    projectname: "", //项目名称
    pricemoney: "", //维修单价
    interceptmoney: "", //拦标价
    goodsid: "", //产品ID
    projectid: "", //项目ID
    priceid: "", //价格id
    userid: "",
    projecttype: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      goodsname: options.goodsname,
      projectname: options.projectname,
      pricemoney: options.pricemoney,
      interceptmoney: options.interceptmoney,
      goodsid: options.goodsid,
      projectid: options.projectid,
      priceid: options.priceid,
      projecttype: options.projecttype
    })
  },
  //事件处理函数
  //获取单价
  getPrice: function(e) {
    var that = this;
    that.setData({
      pricemoney: e.detail.value
    })
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          userid: res.data
        })
      }
    })
  },
  //提交
  submitBtn: function() {
    var that = this;
    app.util.request({
      url: 'price/insertOrUpdateByPrice',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        goodsid: that.data.goodsid, //产品ID
        projectid: that.data.projectid, //项目ID
        pricecreateuserid: that.data.userid, //用户id
        priceid: that.data.priceid, //维护单价ID
        pricemoney: that.data.pricemoney,
        pricetype: that.data.projecttype
      },
      success: function(res) {
        if (res.data.count == 0) {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
              }
            }
          });

        } else {
          wx.showModal({
            content: "操作成功",
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
              }
            }
          });
          var setInterval = setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
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