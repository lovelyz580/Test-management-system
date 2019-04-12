// pages/workerEvaluate/userEvaluate.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,

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
      url: 'evaluate_customer_setup/selectByEvaluateCustomerSetup',
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

  //获取意见
  getOpinion: function(e) {
    this.setData({
      opinion: e.detail.value
    })
    console.log(this.data.opinion)
  },
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
    this.data.list[id].evaluatecustomersetupscore = this.data.you
    this.data.list[id].evaluatecustomersetuplossscore = this.data.wu
    this.setData({
      list: this.data.list
    })
    console.log(this.data.list)

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
      Evaluateid = Evaluateid + list[a].evaluatecustomersetupid + ",";
      Evaluatename = Evaluatename + list[a].evaluatecustomersetupname + ",";
      Evaluatstart = Evaluatstart + list[a].evaluatecustomersetupscore + ",";
      num += list[a].evaluatecustomersetupscore
    }
    app.util.request({
      url: 'evaluate_customer/insertByEvaluateCustomerUpdateOrderState',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        evaluatecustomeropinion: that.data.opinion, //评价意见
        orderid: that.data.orderid,
        serviceuserid: that.data.orderserviceuserid,
        customeruserid: that.data.ordercreateuserid,
        evaluatecustomersetupid: Evaluateid,
        evaluatecustomersetupname: Evaluatename,
        evaluatecustomersetupscore: Evaluatstart,
        evaluatecustomerscore: num,
      },
      success: function(res) {
        console.log(res)
        if (res.data.count == 1) {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../repairTask/repairTask'
                })
              }
            }
          });
        } else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../repairTask/repairTask'
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