// pages/repairCollect/repairCollect.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    imgsrc: "",
    agreeMent: false,
    showAgreement: "相关协议相关协议相关协议相关协议相关协议",
    upload_picture_list: [],
    addImgStatus: "block",
    status: "none",
    addImgStatus: "blcok",
    path_server: "",
    userid: "",
    orderTable: {
      version: "",
      orderid: "",
      currentuserid: ""
    },
    applyCheck: {
      orderid: "1",
      applycheckimage: ""
    }
  },
  // 用户协议
  agreeMent: function(event) {
    var that = this;
    var agreeMent = that.data.agreeMent;
    that.setData({
      "agreeMent": !agreeMent
    });
    console.log(that.data.agreeMent)
  },
  // 展示协议
  showAgreement: function(e) {
    var that = this
    wx.showModal({
      content: that.data.showAgreement,
      showCancel: false,
      success: function(res) {}
    });
  },
  // 打开地图
  chooseLocation: function(e) {
    var that = this
    console.log(that.data.orderlongitude)
    console.log(that.data.orderlatitudee)

    wx.openLocation({
      longitude: that.data.orderlongitude,
      latitude: that.data.orderlatitude
    })
  },
  // 取消接受任务
  leafletsBtn: function(e) {
    var that = this;
    var agreeMent = that.data.agreeMent;
    if (!agreeMent) {
      wx.showModal({
        content: '请点击同意相关协',
        success: function(res) {
          if (res.confirm) {
            that.setData({
              agreeMent: true
            })
          } else {
            return
          }

        }
      });
      return
    }


    console.log("取消接单申请后台")

  },

  // 同意接受任务
  configOrder: function(e) {
    var that = this;
    var agreeMent = that.data.agreeMent;
    if (!agreeMent) {
      wx.showModal({
        content: '请点击同意相关协',
        success: function(res) {
          if (res.confirm) {
            that.setData({
              agreeMent: true
            })
          } else {
            return
          }

        }
      });
      return
    }
    console.log("确认接单提交后台")
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var orderserviceuserid = wx.getStorageSync('userid')
    that.setData({
      userid: orderserviceuserid,
      orderid: options.orderid
    })
    app.util.request({
      url: 'order_table/selectThreeTablestByUnionDataAndSnatchMoney',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        orderid: that.data.orderid,
        pagenumber: -1,
        pagesize: "",
        currentuserid: that.data.userid
      },
      success: function(res) {
        console.log(res)
        that.setData({
          array: res.data.data[0]
        })
        var array = res.data.data[0];
        that.setData({
          orderaddress: array.orderTableAndBuildingType.orderaddress,
          ordercontactperson: array.orderTableAndBuildingType.ordercontactperson,
          ordercontactphone: array.orderTableAndBuildingType.ordercontactphone,
          orderbiddingendtime: array.orderTableAndBuildingType.orderbiddingendtime,
          ordertraveltotalmoney: array.orderTableAndBuildingType.ordertraveltotalmoney,
          ordercreatetime: array.orderTableAndBuildingType.ordercreatetime,
          orderlatitude: array.orderTableAndBuildingType.orderlatitude,
          orderlongitude: array.orderTableAndBuildingType.orderlongitude,
          orderprojectname: array.orderTableAndBuildingType.orderprojectname,
          orderplantime: array.orderTableAndBuildingType.orderprojectname,
          orderprojecttype: array.orderTableAndBuildingType.orderprojecttype,
          orderremark: array.orderTableAndBuildingType.orderremark,
          buildingtypename: array.orderTableAndBuildingType.buildingtypename,
          dayrate: array.orderTableAndBuildingType.orderdaymoney,
          people: array.orderTableAndBuildingType.orderpeoplenumber,
          daysnumber: array.orderTableAndBuildingType.orderday,
          materialsexpenses: array.orderTableAndBuildingType.ordermaterialmoney,
          orderintercepttotalmoney: array.orderTableAndBuildingType.orderpriceservicetotalmoney,
          orderList: res.data.data[0].orderDetailList,
        })
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