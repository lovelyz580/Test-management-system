// pages/charge/index.js
Page({
  data: {
    inputValue: 0
  },
  // 页面加载
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '充值'
    })
  },
  // 存储输入的充值金额
  bindInput: function (res) {
    this.setData({
      inputValue: res.detail.value
    })
  },
  // 充值
  charge: function (e) {
    var that = this;
    console.log("获取formid");
    console.log(e.detail.formId);
    var formId = e.detail.formId; //formid 
    if (formId == "the formId is a mock one" || formId == null || formId == undefined) {
      formId = null
    } else {
      that.setData({
        formId: formId
      })
      console.log(that.data.formId)
    }
    var userid = wx.getStorageSync('userid');
    console.log(userid)
    if (formId != null) {
      app.util.request({
        url: 'wechat_form/insertByWechatForm',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          pagenumber: -1,
          pagesize: "",
          userid: userid,
          formid: that.data.formId
        },
        success: function (res) {
          console.log(res)
        }
      });

    }

    // 必须输入大于0的数字
    if (parseInt(this.data.inputValue) <= 0 || isNaN(this.data.inputValue)) {
      wx.showModal({
        title: "警告",
        content: "请输入大于0的金额",
        showCancel: false,
        confirmText: "确定"
      })
    } else {
      wx.redirectTo({
        url: '../wallet/index',
        success: function (res) {
          wx.showModal({
            content: "充值成功",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../myWallet/myWallet',
                })
              }
            }
          });
         
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
      })
    }
  },
  // 页面销毁，更新本地金额，（累加）
  onUnload: function () {
    wx.getStorage({
      key: 'overage',
      success: (res) => {
        wx.setStorage({
          key: 'overage',
          data: {
            overage: parseInt(this.data.inputValue) + parseInt(res.data.overage)
          }
        })
      },
      // 如果没有本地金额，则设置本地金额
      fail: (res) => {
        wx.setStorage({
          key: 'overage',
          data: {
            overage: parseInt(this.data.inputValue)
          },
        })
      }
    })
  }
})