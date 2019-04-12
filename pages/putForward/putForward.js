// pages/putForward/putForward.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allMoney:"",
    money:"",
    name:"",
    idNumber:"",
    openBank:"",
    userid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userid',
      success: function (res) {
        that.setData({
          userid: res.data
        })
      }
    })
    this.setData({
      allMoney: options.money
    })
  },
  //事件处理函数

  //获取提现金额
  getMoney:function(e){
    this.setData({
      money: e.detail.value
    })
  },

  //获取姓名
  getName: function (e){
    this.setData({
      name: e.detail.value
    })
  },

  //获取银行号
  getIdNumber:function(e){
    this.setData({
      idNumber: e.detail.value
    })
  },

  //获取开户行
  getOpenBank:function(e){
    this.setData({
      openBank: e.detail.value
    })
  },

  //全部提现
  allPut:function(){
    this.setData({
      money:this.data.allMoney
    })
  },

  //提现
  putForwardBtn:function(){
    if(this.data.money==""){
      wx.showToast({
        title: '请输入提现金额',
        icon:"none"
      })
      return;
    } else if (this.data.money<1){
      wx.showToast({
        title: '最低提现金额为1元',
        icon: "none"
      })
      return;
    } else if (this.data.money > this.data.allMoney){
      wx.showToast({
        title: '提现金额超过可体现金额',
        icon: "none"
      })
      return;
    }
    if(this.data.name==""){
      wx.showToast({
        title: '请输入真实姓名',
        icon:"none"
      })
      return;
    }
    if(this.data.idNumber==""){
      wx.showToast({
        title: '请输入银行卡号',
        icon: "none"
      })
      return;
    }
    if(this.data.openBank==""){
      wx.showToast({
        title: '请输入开户行',
        icon: "none"
      })
      return;
    }
    var that=this;
    app.util.request({
      url: 'user_extract_money/insertByUserExtractMoney',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        userextractmoney:that.data.money,//提现金额
        userextractmoneyuserid: that.data.userid, //提现人员ID
        userextractmoneybankcard:that.data.idNumber,//提现银行卡  
        userextractmoneybankaddress:that.data.openBank,//开户行
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