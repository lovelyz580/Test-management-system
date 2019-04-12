// pages/wxpriceadd/wxpriceadd.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // 获取输入的单价
  priceadd: function(e) {
    var that = this
    var reg = /^\d+(\.\d+)?$/;
    var price = e.detail.value;
    if (!reg.test(price)) {
      wx.showModal({
        content: "只能输入数字",
        showCancel: false,
        success: function (res) { }
      });
    }else{
      that.setData({
        price: price
      })
    }
    console.log(that.data.price)
  },
  // 提交单价
  addprice: function(e) {
    var that = this
    var formId = e.detail.formId; //formid 
    console.log(formId)
    if (formId == "the formId is a mock one" || formId == null || formId == undefined) {
      formId = null
    } else {
      that.setData({
        formId: formId
      })
      console.log(that.data.formId)
    }
    var userid = wx.getStorageSync('userid')
    console.log(userid)
    that.setData({
      userid: userid
    })
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
        success: function(res) {
          console.log(res)
        }
      });
    }
    // 提交单价
    app.util.request({
      url: 'price/insertOrUpdateByPriceNew',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        priceupdateuserid: that.data.userid,
        pricestate: "Y",
        pricetype: "WX",
        pricemoney: that.data.price,
      },
      success: function(res) {
        console.log(res)
        wx.showModal({
          content: "操作成功",
          showCancel: false,
          success: function(res) {
            wx.switchTab({
              url: '../personal/personal',
            })
          }
        });



      },
      fail: function() {
        wx.showModal({
          content: "发送请求失败",
          showCancel: false,
          success: function(res) {
            if (res.confirm) {}
          }
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var userid = wx.getStorageSync("userid")
    that.setData({
      userid: userid
    })
    // 获取报价列表
    app.util.request({
      url: 'price/selectFourTablesByUnionData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: 1,
        pagesize: "10",
        pricestate: "Y",
        pricetype: "WX",
        priceupdateuserid: that.data.userid,
      },
      success: function(res) {
        console.log(res)
        if (res.data.count == 0) {
          that.setData({
            price: ""
          })
        } else {
          that.setData({
            price: res.data.data[0].pricemoney
          })
        }
      },
      fail: function() {
        wx.showModal({
          content: "发送请求失败",
          showCancel: false,
          success: function(res) {
            if (res.confirm) {}
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