// pages/disputeHandle/disputeHandle.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    content:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //事件处理函数

  //获取标题
  getTitle:function(e){
    this.setData({
      title: e.detail.value
    })
  },

  //获取内容
  getContent:function(e){
    this.setData({
      content: e.detail.value
    })
  },

  //提交
  submitBtn:function(){
    if(this.data.title==""){
      wx.showToast({
        title: '请输入标题',
        icon:"none"
      })
      return;
    }
    if (this.data.content == "") {
      wx.showToast({
        title: '请输入纠纷内容',
        icon: "none"
      })
      return;
    }
    app.util.request({
      url: 'dispute/insertByDispute',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        disputetitle: this.data.title, //纠纷标题
        dispute: this.data.content,  //纠纷内容
      },
      success: function (res) {
        console.log(res)
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