var app = getApp() //实例化小程序，从而获取全局数据或者使用全局函数
var MD5Util = require('../../utils/md5.js');
Page({
  // ===== 页面数据对象 =====
  data: {
    // 搜索框状态
    inputShowed: true,
    //显示结果view的状态
    viewShowed: false,
    // 搜索框值
    inputVal: "",
    //搜索渲染推荐数据
    catList: [],

    btnWidth: 300, //删除按钮的宽度单位
    startX: "", //收支触摸开始滑动的位置
    input: '',
    todos: [],
    leftCount: 0,
    allCompleted: false,
    logs: [],
    price: 0.01
  },

  onLoad: function() {
    var that = this;
    //初始化界面
    that.initEleWidth();
  },
  // 隐藏搜索框样式
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  // 清除搜索框值
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  // 键盘抬起事件2
  inputTyping: function(e) {
    console.log(e.detail.value)
    var that = this;
    if (e.detail.value == '') {
      return;
    }
    var name = e.detail.value
    console.log(name.length)
    that.setData({
      viewShowed: false,
      inputVal: e.detail.value
    });
    app.util.request({
      url: 'kingdee/selectByKingdee',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        kingdeename: name,
       
      },
      success: function (res) {
        console.log(res)
        that.setData({
          searchlist: res.data.data
        })
        console.log(that.data.searchlist)
      }
    });
  },
  // 获取选中推荐列表中的值
  btn_name: function(res) {
    console.log(res.currentTarget.dataset.index, res.currentTarget.dataset.name);
    var that = this;
    that.hideInput();
    that.setData({
      viewShowed: true,
      carNum: res.currentTarget.dataset.name,
      deviceId: res.currentTarget.dataset.index
    });
  },
  initEleWidth: function() {
    var btnWidth = this.getEleWidth(this.data.btnWidth);
    this.setData({
      btnWidth: btnWidth
    });
  },



  save: function() {
    // 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
    wx.setStorageSync('todo_list', this.data.todos)
    wx.setStorageSync('todo_logs', this.data.logs)
  },
  load: function() {
    var todos = wx.getStorageSync('todo_list')
    if (todos) {
      var leftCount = todos.filter(function(item) {
        return !item.completed
      }).length
      this.setData({
        todos: todos,
        leftCount: leftCount
      })
    }
    var logs = wx.getStorageSync('todo_logs')
    if (logs) {
      this.setData({
        logs: logs
      })
    }
  },
  // ===== 页面生命周期方法 =====
  onLoad: function() {
    this.load();
  },

  // ===== 事件处理函数 =====
  wxPay: function(e) {
    var code = '' //传给服务器以获得openId
    var timestamp = String(Date.parse(new Date())) //时间戳
    var nonceStr = '' //随机字符串，后台返回
    var prepayId = '' //预支付id，后台返回
    var paySign = '' //加密字符串
    //获取用户登录状态
    wx.login({
      success: function(res) {
        if (res.code) {
          code = res.code
          //发起网络请求,发起的是HTTPS请求，向服务端请求预支付
          wx.request({
            url: 'http://localhost:8080/wechat/prepay',
            header: {
              "Content-Type": "application/x-www-form-urlencoded" //post请求设置
            },
            method: "POST",
            data: {
              code: res.code
            },
            success: function(res) {
              console.log(res)
              if (res.statusCode == 200) {
                var appId = res.data.paydata.appId
                var nonceStr = res.data.paydata.nonceStr
                var packages = res.data.paydata.package
                var prepayId = packages.split("=")[1];
                console.log(prepayId)
                var timeStamp = res.data.paydata.timeStamp
                // 按照字段首字母排序组成新字符串

                var payDataA = "appId=" + app.globalData.appId + "&nonceStr=" + nonceStr + "&package=" + packages + "&signType=MD5&timeStamp=" + timestamp;
                var payDataB = payDataA + "&key=" + app.globalData.key;
                // 使用MD5加密算法计算加密字符串
                var paySign = MD5Util.MD5(payDataB).toUpperCase();
                // 发起微信支付
                wx.requestPayment({
                  'timeStamp': timestamp,
                  'nonceStr': nonceStr,
                  'package': 'prepay_id=' + prepayId,
                  'signType': 'MD5',
                  'paySign': paySign,
                  'success': function(res) {
                    // 保留当前页面，跳转到应用内某个页面，使用wx.nevigeteBack可以返回原页面
                    wx.navigateTo({
                      url: '../pay/pay'
                    })
                  },
                  'fail': function(res) {
                    console.log(res)
                  }
                })
              } else {
                console.log('请求失败' + res.data.info)
              }
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }
})