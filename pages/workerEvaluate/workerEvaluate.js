// pages/workerEvaluate/userEvaluate.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    opinion: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(options)
    that.setData({
      orderid: options.orderid,
      orderserviceuserid: options.orderserviceuserid
    })
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          ordercreateuserid: res.data
        })
      }
    })
  // 查询订单详情
    app.util.request({
      url: 'evaluate_service_setup/selectByEvaluateServiceSetup',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: ""
      },
      success: function(res) {
        console.log(res.data)
        that.setData({
          list: res.data.data
        })
        console.log(that.data.list)
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

  },
  //事件处理函数

  //星星
  //增加星星
  start: function(e) {
    var id = e.currentTarget.dataset.key; //第几个
    var liang = e.currentTarget.dataset.in;
    var you;
    if (liang === 'liang') {
      you = Number(e.currentTarget.id);
    } else {
      you = Number(e.currentTarget.id) + this.data.wu;
    }
    if (you > 5) {
      return
    }
    this.setData({
      you: you,
      wu: 5 - you
    })
    this.data.list[id].evaluateservicesetupscore = this.data.you
    this.data.list[id].evaluateservicesetuplossscore = this.data.wu
    this.setData({
      list: this.data.list
    })
    console.log(this.data.list)

  },
  //获取意见
  getOpinion: function(e) {
    this.setData({
      opinion: e.detail.value
    })
  },

  //提交
  submitBtn: function() {
    var that = this
    var list = that.data.list
    var Evaluateid = ""
    var Evaluatename = ""
    var Evaluatstart = ""
    var num = 0;
    for (var a = 0; a < list.length; a++) {
      Evaluateid += list[a].evaluateservicesetupid + ",";
      Evaluatename += list[a].evaluateservicesetupname + ",";
      Evaluatstart += list[a].evaluateservicesetupscore + ",";
      num += list[a].evaluateservicesetupscore
    }
    app.util.request({
      url: 'evaluate_service/insertByEvaluateServiceUpdateOrderState',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        evaluateserviceopinion: that.data.opinion, //评价意见
        orderid: that.data.orderid,
        serviceuserid: that.data.orderserviceuserid,
        customeruserid: that.data.ordercreateuserid,
        evaluateservicesetupid: Evaluateid,
        evaluateservicesetupname: Evaluatename,
        evaluateservicesetupscore: Evaluatstart,
        evaluateservicescore: num,
      },
      success: function(res) {
        console.log(res)
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              // console.log('确定')
              wx.redirectTo({
                url: '../orderManage/orderManage',
              })
            }
          }
        });
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