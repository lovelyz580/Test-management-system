// pages/taskList/taskList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    taskList: [
      { orderNum: "201808240014832", projectName: "河北大学", time: "2018-08-24 13:23", allPrice:2000, status: 0 },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //事件处理函数
  //评价用户
  userEvaluate: function () {
    wx.navigateTo({
      url: '../userEvaluate/userEvaluate',
    })
  },

  //维修验收
  repairCollect: function () {
    wx.navigateTo({
      url: '../repairCollect/repairCollect',
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