var app = getApp();
Page({
  data: {},
  onLoad: function(options) {
    var that = this
    var userid = wx.getStorageSync('userid')
    var orderid = options.orderid
    that.setData({
      orderid: orderid,
      userid: userid
    })
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
        var array = res.data.data[0];
        console.log(array)
        that.setData({
          orderaddress: array.orderaddress,
          customermoney: array.customermoney,
          ordercontactperson: array.ordercontactperson,
          ordercontactphone: array.ordercontactphone,
          orderplantime: array.orderplantime,
          orderprojectname: array.orderprojectname,
          orderprojecttype: array.orderprojecttype,
          ordertype: array.ordertype,
          ordertotalmoney: array.ordertotalmoney,
          orderintercepttotalmoney: array.orderintercepttotalmoney,
          ordertraveltotalmoney: array.ordertraveltotalmoney,
          buildingtypeid: array.buildingtypeid,
          orderpricetotalmoney: array.orderpricetotalmoney,
          ordercreateuserid: array.ordercreateuserid,
          orderlatitude: array.orderlatitude,
          orderlongitude: array.orderlongitude,
        })
      }
    });
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },

  // 微信支付
  // 微信支付
  payType: function () {
    var userid = wx.getStorageSync("userid");
    console.log(userid)
    var that = this
    var money = 0.01
    app.util.request({
      url: 'wechatpay/getPrepayId',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: userid,
        orderId: that.data.orderid,
        money: money,
        tradeType: "JSAPI"
      },
      success: function (res) {
        console.log(res)
        that.setData({
          prepayId: res.data.msg
        })
        app.util.request({
          url: 'wechatpay/pay',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            prepayId: that.data.prepayId
          },
          success: function (res) {
            // console.log(res)
            var date = res.data.msg
            var front1 = date.indexOf('appId='); // 设置参数字符串开始的位置
            var front2 = date.indexOf('&nonceStr='); // 设置参数字符串开始的位置
            var front3 = date.indexOf('&paySign='); // 设置参数字符串开始的位置
            var length = date.length; // 获取url的长度
            var appId = date.substr(front1 + 6, front2 - front1 - 6); // 取出参数字符串 这里会获得类似"appId=1"这样的字符串	
            var nonceStr = date.substr(front2 + 10, front3 - front2 - 10);
            var paySign = date.substr(front3 + 9, length - front2 - 9);
            // console.log(paySign)
            wx.requestPayment({
              'appId': appId,
              'timeStamp': '1414587457',
              'nonceStr': nonceStr,
              'package': "prepay_id=" + that.data.prepayId,
              'signType': 'MD5',
              'paySign': paySign,
              'success': function (paymentRes) {
                console.log(paymentRes)
                wx.switchTab({
                  url: '../personal/personal',
                })
              },
              'fail': function (error) {
                console.log(error)
              }
            })
          }
        })
      }
    });
  },
  // 银联支付
  UPpay: function() {
    console.log("银联支付")
    var orderid = this.data.orderid
    wx.redirectTo({
      url: '../underLinePayment/underLinePayment?orderid=' + orderid
    })
  }
})