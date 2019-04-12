// pages/orderby/orderby.js
var app = getApp();
var that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    calibration: false,
    onclick: true,
    choseone: null,
    ArchitectureList: null,
    orderList: null,
    orderid: null,
    serviceuserid: null,
    orderTable: {
      ordertableid: "",
      currentuserid: "",
    },
    user: {
      version: "",
      pagenumber: "",
      userid: ""
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var that = this;
    wx.getStorage({
      key: 'userrole',
      success: function(res) {
        that.setData({
          userrole: res.data
        })
      }
    })
    //查询抢标人的信息
    this.data.orderid = options.orderid;
    //  查看订单详情
    app.util.request({
      url: 'order_table/selectThreeTablestByUnionData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        orderid: that.data.orderid
      },
      success: function(res) {
        var time = res.data.data[0].orderTableAndBuildingType.orderbiddingendtime
        var tadaytime = new Date(); //现在的时间   把字符串格式转化为日期类
        time = time.replace(/-/g, '/');
        
        var endtime = new Date(Date.parse(time)); //竞标截止时间
        that.setData({
          tadaytime: tadaytime,
          endtime: endtime
        })
        console.log(tadaytime)
        console.log(endtime)
        if (endtime > tadaytime) {
          wx.showModal({
            content: "未到竞标截止日期,不能查看竞标人",
            showCancel: false,
            success: function(res) {
              wx.switchTab({
                url: '../personal/personal',
              })
            }
          });
        } else {
          app.util.request({
            url: 'snatch/selectThreeTablesByUnionData',
            header: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            data: {
              version: app.siteinfo.version,
              pagenumber: -1,
              pagesize: "",
              orderid: that.data.orderid
            },
            success: function(res) {
              console.log(res);
              if (res.data.count == 0) {
                wx.showModal({
                  content: "暂无人员竞标",
                  showCancel: false,
                  success: function(res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '../personal/personal',
                      })
                    }
                  }
                });
              } else {
                that.setData({
                  orderList: res.data.data
                })
                //                 var today = that.data.tadaytime    //今天
                //                 var time = that.data.endtime
                //                 var calibration  = new Date();
                //                 calibration.setDate(time.getDate() + 2);  //定标截止日期
                // console.log(calibration)
                // console.log(today)
                //                if(calibration <today){
                //                  that.setData({
                //                    calibration:true
                //                  })
                //                }
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
        }
      },
      fail: function() {
        wx.showModal({
          content: "发送请求失败",
          showCancel: false,
          success: function(res) {}
        });
      }
    });
  },
  // 选中中标人
  choese: function(e) {
    var that = this;
    that.setData({
      choseone: e.currentTarget
        .dataset.index,
      checked: true
    })
    that.data.orderTable.orderid = e.currentTarget.dataset.id
    that.data.user.userid = e.currentTarget.dataset.serviceuserid
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.data.orderTable.currentuserid = res.data
      }
    })
  },
  //取消中标人
  Btnoff: function(e) {
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
        success: function(res) {
          console.log(res)
        }
      });
    }
    that.setData({
      onclick: true,
      choseone: null,
      onclick: false
    })
    that.data.orderTable.orderid = null
    that.data.user.userid = null
    that.data.orderTable.currentuserid = null
  },
  // //确认中标人发送请求
  // buttonBtn: function (e) {
  //   var that = this;
  //   console.log("获取formid");
  //   console.log(e.detail.formId);
  //   var formId = e.detail.formId; //formid 
  //   if (formId == "the formId is a mock one" || formId == null || formId == undefined) {
  //     formId = null
  //   } else {
  //     that.setData({
  //       formId: formId
  //     })
  //     console.log(that.data.formId)
  //   }
  //   var userid = wx.getStorageSync('userid');
  //   console.log(userid)
  //   if (formId != null) {
  //     app.util.request({
  //       url: 'wechat_form/insertByWechatForm',
  //       header: {
  //         "Content-Type": "application/json;charset=UTF-8"
  //       },
  //       method: "POST",
  //       data: {
  //         version: app.siteinfo.version,
  //         pagenumber: -1,
  //         pagesize: "",
  //         userid: userid,
  //         formid: that.data.formId
  //       },
  //       success: function (res) {
  //         console.log(res)
  //       }
  //     });

  //   }
  //   that.setData({
  //     onclick: true
  //   })
  //   if (that.data.user.userid == null) {
  //     wx.showModal({
  //       content: "请选择中标人",
  //       showCancel: false,
  //       success: function(res) {
  //         if (res.confirm) {
  //           return
  //         }
  //       }
  //     });
  //   } else {
  //     app.util.request({
  //       url: 'operation_order/confirmSnatch',
  //       header: {
  //         "Content-Type": "application/json;charset=UTF-8"
  //       },
  //       method: "POST",
  //       data: {
  //         user: JSON.stringify(that.data.user),
  //         orderTable: JSON.stringify(that.data.orderTable),
  //       },
  //       success: function(res) {
  //         that.setData({
  //           onclick: false
  //         })
  //         console.log(res)
  //         wx.showModal({
  //           content: res.data.msg,
  //           showCancel: false,
  //           success: function(res) {
  //             if (res.confirm) {
  //               // console.log('确定')
  //               wx.redirectTo({
  //                 url: '../workhome/workhome',
  //               })
  //             }
  //           }
  //         });

  //         setTimeout(function() {
  //           wx.switchTab({
  //             url: '../workhome/workhome'
  //           })
  //         }, 3000);

  //       },
  //       fail: function() {
  //         wx.showModal({
  //           content: "发送请求失败",
  //           showCancel: false,
  //           success: function(res) {
  //             if (res.confirm) {

  //             }
  //           }
  //         });
  //       }
  //     });
  //   }
  // },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      onclick: false
    })
    console.log(this.data.onclick)
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