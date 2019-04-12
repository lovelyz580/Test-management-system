// pages/takesingle/takesingle.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    taskList: [
    ]
  },
  // 竞标详情页面
  taskListDetail: function (e) {
    wx.navigateTo({
      url: '../taskDetail/taskDetail?orderid=' + e.currentTarget.dataset.id,
    })
  },
  // 搜索
  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    })
  },
  // 请求后台
  suo: function (e) {
    var that = this
    console.log("执行搜索功能")
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
    // 查询操作
    var value = that.data.searchValue
    console.log(value)
    // 搜索功能
    // 请求后台
    app.util.request({
      url: 'snatch/selectThreeTablesBySelectDataByTime',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        orderserviceuserid: that.data.orderserviceuserid,
        orderprojectname: value
      },
      success: function (res) {
        console.log(res);
        if (res.data.count == 0) {
          wx.showModal({
            content: "暂无查询结果",
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  searchValue: ""
                })
              }
            }
          });
        } else {
          that.setData({
            taskList: res.data.data
          })
        }

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
  confirmreceipt: function (e) {
    var orderid = e.target.dataset.orderid
    //发送请求   确认收到货款 
    wx.showModal({
      title: '确认收款',
      content: '确认是否收到款？',
      showCancel: true,//是否显示取消按钮
      cancelText: "否",//默认是“取消”
      cancelColor: 'skyblue',//取消文字的颜色
      confirmText: "是",//默认是“确定”
      confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.cancel) {
          return;
        } else {
          //点击确定   将订单状态改成//YSK
          app.util.request({
            url: 'order_table/updateByOrderTable',
            header: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            data: {
              version: app.siteinfo.version,
              pagenumber: -1,
              pagesize: "",
              orderid: orderid,
              orderstate: "YSK"
            },
            success: function (res) {
              console.log(res)
              wx.navigateTo({
                url: '../repairTask/repairTask'
              })
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
        }
      },
    })
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
          orderserviceuserid: res.data
        })
        app.util.request({
          url: 'snatch/selectThreeTablesByUnionDataByTime',
          header: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          method: "POST",
          data: {
            version: app.siteinfo.version,
            pagenumber: -1,
            pagesize: "",
            serviceuserid: that.data.orderserviceuserid
          },
          success: function (res) {
            console.log(res)
            that.setData({
              taskList: res.data.data
            })
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
      }
    })
  },

  //事件处理函数
  //评价用户
  userEvaluate: function () {
    wx.navigateTo({
      url: '../userEvaluate/userEvaluate',
    })
  },

  //维修验收
  repairCollect: function (e) {
    wx.navigateTo({
      url: '../repairCollect/repairCollect?orderid=' + e.currentTarget.dataset.orderid,
    })
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