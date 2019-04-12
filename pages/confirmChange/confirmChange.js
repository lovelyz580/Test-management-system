// pages/confirmOrder/confirmOrder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userrealname: "",
    userphone: "",
    usercredit: "",
    orderserviceuserid: "",
    releaseBg: "#ccc",
    orderList: "",
    leafletsBg: "#ed1b24",
    userid: "",
    goodsid: "",
    orderDetaiConfirlList:[],
    orderTable: {
      orderposition: "",
      version: app.siteinfo.version,
      pagenumber: -1,
      orderlatitude: "",
      orderlongitude: "",
      orderremark: "",
      currentuserid: "",
      orderprojectname: "",
      orderprojecttype: "",
      orderaddress: "",
      ordercontactperson: "",
      ordercontactphone: "",
      buildingtypeid: "",
      orderplantime: "",
      orderposition: "",
      orderbiddingendtime: "",
      orderintercepttotalmoney: "" //总价
    },
    orderDetailListEntity: {
      orderDetailList: []
    },
    orderDetailConfirmListEntity: {
      orderDetailConfirmList: []
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          userid: res.data
        })
      }
    })
    wx.getStorage({
      key: 'userrole',
      success: function(res) {
        that.setData({
          userrole: res.data
        })
      }
    })
    this.setData({
      orderid: options.orderid
    })
    app.util.request({
      url: 'order_table/selectThreeTablestByUnionData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        orderid: options.orderid,
        pagenumber: -1,
        pagesize: ""
      },
      success: function(res) {
        console.log(res)
        var array = res.data.data[0];
        that.setData({
          orderid: array.orderTableAndBuildingType.orderid,
          orderaddress: array.orderTableAndBuildingType.orderaddress,
          ordercontactperson: array.orderTableAndBuildingType.ordercontactperson,
          ordercontactphone: array.orderTableAndBuildingType.ordercontactphone,
          orderplantime: array.orderTableAndBuildingType.orderplantime,
          orderprojectname: array.orderTableAndBuildingType.orderprojectname,
          orderbiddingendtime: array.orderTableAndBuildingType.orderbiddingendtime,
          orderprojecttype: array.orderTableAndBuildingType.orderprojecttype,
          orderserviceuserid: array.orderTableAndBuildingType.orderserviceuserid,
          ordertype: array.orderTableAndBuildingType.ordertype,
          buildingtypename: array.orderTableAndBuildingType.buildingtypename,
          ordertotalmoney: array.orderTableAndBuildingType.ordertotalmoney,
          ordertype: array.orderTableAndBuildingType.ordertype,
          orderintercepttotalmoney: array.orderTableAndBuildingType.orderintercepttotalmoney,
          ordertraveltotalmoney: array.orderTableAndBuildingType.ordertraveltotalmoney,
          buildingtypeid: array.orderTableAndBuildingType.buildingtypeid,
          ordercreateuserid: array.orderTableAndBuildingType.ordercreateuserid,
          orderstate: array.orderTableAndBuildingType.orderstate,
          orderlatitude: array.orderTableAndBuildingType.orderlatitude,
          orderlongitude: array.orderTableAndBuildingType.orderlongitude,
          orderList: res.data.data[0].orderDetailList,
        })
      }
    });
 //查询新订单详情
    app.util.request({
      url: 'order_table/selectOrderTableConfirmByOrderTable',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        orderid: options.orderid,
        pagenumber: -1,
        pagesize: ""
      },
      success: function (res) {
        console.log(res)
        var array = res.data.data[0];
        that.setData({
          orderDetailConfirmList: res.data.data[0].orderDetailConfirmList,
        })
      


      }
    });
  },
  //事件处理函数
  chooseLocation: function(e) {
    var that = this
    wx.openLocation({
      longitude: that.data.orderlongitude,
      latitude: that.data.orderlatitude
    })
  },
  // 提交
  submitBtn: function(e) {
    // 收集formid
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
        success: function(res) {
          console.log(res)
        }
      });
    }
    //  保存订单
    app.util.request({
      url: 'operation_order/orderDetailConfirmByCustomer',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        orderid: that.data.orderid,
        currentuserid:userid
      },
      success: function(res) {
        console.log(res)
        if(res.data.count==1){
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              wx.switchTab({
                url: '../personal/personal'
              });
            }
          });
        }else{
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              wx.switchTab({
                url: '../personal/personal'
              });
            }
          });
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