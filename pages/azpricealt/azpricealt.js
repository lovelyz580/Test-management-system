var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(options.priceid)
    that.setData({
      priceid: options.priceid
    })
    // 获取报价详情
    app.util.request({
      url: 'price/selectFourTablesByUnionData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        priceid: that.data.priceid
      },
      success: function (res) {
      
        that.setData({
          priceone:res.data.data[0]
        })
        console.log(that.data.priceone)
      },
      fail: function () {
        wx.showModal({
          content: "发送请求失败",
          showCancel: false,
          success: function (res) {
            if (res.confirm) { }
          }
        });
      }
    });
  },
  // 获取单价
  saveprice:function (e){
    var that = this
    console.log(e.detail.value)
    that.setData({
      price :e.detail.value
    })
  },
  //保存清单报价
  addPrice: function (e) {
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
        priceid: that.data.priceid, // 报价清单id
        pricemoney : that.data.price //清单价格
        
      },
      success: function (res) {
        console.log(res)
        if(res.data.count==1){
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              wx.switchTab({
                url: '../personal/personal'
              })
            }
          });
        }
      },
      fail: function () {
        wx.showModal({
          content: "发送请求失败",
          showCancel: false,
          success: function (res) {
            if (res.confirm) { }
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
    this.setData({
      onclick: false,
      addclick: false
    })
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