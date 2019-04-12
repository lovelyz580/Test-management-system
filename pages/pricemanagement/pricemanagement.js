// pages/pricemanagement/pricemanagement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
  },
  // 安装报价
  anprice: function(e) {
    wx.navigateTo({
      url: '../azpriceList/azpriceList',
    })
  },
  // 维修报价
  wxprice: function(e) {
    wx.navigateTo({
      url: '../wxpriceMaintain/wxpriceMaintain',
    })
  },
  // 获取维修工资
 
  //点击按钮痰喘指定的hiddenmodalput弹出框  
  modalinput:function() {
    wx.navigateTo({
      url: '../wxpriceadd/wxpriceadd',
    })
  },
  // 兼职报价
  jzprice: function(e) {
    wx.navigateTo({
      url: '../priceMaintain/priceMaintain',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var userrole = wx.getStorageSync("userrole")
    if(userrole =="WX,"){
      that.setData({
        userrole:"WX"
      })
    }
    if (userrole == "WX,AZ," || userrole == "AZ,WX,") {
      that.setData({
        userrole: "WA"
      })
    }
    if (userrole == "KH,") {
      that.setData({
        userrole: "KH"
      })
    }
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