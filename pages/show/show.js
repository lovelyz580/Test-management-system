// pages/show/show.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    readonly:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.util.request({
        url: 'area/selectByArea',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          pagenumber: -1,
          pagesize: "",
        },
        success: function(res) {
          console.log(res)
          var array = res.data.data;
          that.setData({
            provinceIndex: array
          })
        }
      })
  },
  checkboxChange: function (e) {
    var that = this
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    that.setData({
      readonly:true
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