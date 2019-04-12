// pages/repairTask/repairTask.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    status: 0,
    taskList: []
  },
  // 外面的弹窗
  // 禁止屏幕滚动
  preventTouchMove: function() {},

  // 弹出层里面的弹窗
  ok: function() {
    this.setData({
      showModal: false
    })
  },
  // 确认取消
  delkhApply: function(e) {
    var orderid = e.currentTarget.dataset.orderid
    console.log(orderid)
    var that = this
    app.util.request({
      url: 'operation_customer_cancel/confirmCancel',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        canceluserid: wx.getStorageSync("userid"),
        orderid: orderid,
      },
      success: function(res) {
        console.log(res)
        if (res.data.count == 1) {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function(res) {
              wx.switchTab({
                url: '../workhome/workhome',
              })
            }
          });
        }
      }
    })
  },
  // 取消订单
  delApply: function(e) {
    var orderid = e.currentTarget.dataset.orderid
    console.log(orderid)
    var that = this
    app.util.request({
      url: 'operation_service_return/returnOrder',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        orderid: orderid,
        returnuserid: wx.getStorageSync("userid")
      },
      success: function(res) {
        console.log(res)
        if (res.data.count == 1) {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function(res) {
              wx.switchTab({
                url: '../workhome/workhome',
              })
            }
          });
        }
      }
    })
  },
  // 申请打卡
  Applyclock: function(e) {
    wx.showModal({
      content: "系统正在升级，该功能暂不能使用，为您带来的不便还请谅解！",
      showCancel: false,
      success: function(res) {
        return;
      }
    });
    return
    // 传递orderid
    // console.log(e)
    var orderid = e.currentTarget.dataset.orderid
    console.log(orderid)
    wx.navigateTo({
      url: '../applyclock/applyclock?orderid=' + orderid,
    })
  },
  // 订单变更
  ChangesOrder: function(e) {
    //  订单变更  跳转到详情页面
    // console.log(e)
    var orderid = e.currentTarget.dataset.orderid
    // console.log(orderid)
    wx.navigateTo({
      url: '../changesorder/changesorder?orderid=' + orderid,
    })
  },
  // 订单详情页面
  taskListDetail: function(e) {
    wx.navigateTo({
      url: '../orderdetail/orderdetail?orderid=' + e.currentTarget.dataset.id,
    })
  },
  // 搜索
  searchValueInput: function(e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    })
    // console.log(value)
  },
  // 请求后台
  suo: function(e) {
    // 这里是获取fromid
    var that = this;
    console.log("获取formid");
    // console.log(e.detail.formId);
    var formId = e.detail.formId; //formid 
    if (formId == "the formId is a mock one" || formId == null || formId == undefined) {
      formId = null
    } else {
      that.setData({
        formId: formId
      })
      // console.log(that.data.formId)
    }
    var userid = wx.getStorageSync('userid');
    // console.log(userid)
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
          // console.log(res)
        }
      });

    }
    var value = that.data.searchValue
    // console.log(value)
    // 搜索功能
    // 请求后台
    app.util.request({
      url: 'task/selectThreeTablesBySelectData',
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
      success: function(res) {
        console.log(res);
        if (res.data.count == 0) {
          wx.showModal({
            content: "暂无查询结果",
            showCancel: false,
            success: function(res) {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          orderserviceuserid: res.data
        })
        app.util.request({
          url: 'task/selectThreeTablesByUnionData',
          header: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          method: "POST",
          data: {
            version: app.siteinfo.version,
            pagenumber: -1,
            pagesize: "",
            orderserviceuserid: that.data.orderserviceuserid

          },
          success: function(res) {
            console.log(res)
            that.setData({
              taskList: res.data.data
            })
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
      }
    })
  },
  // 确认接收任务
  ConfirmButton: function(e) {
    console.log(e)
    var confirmserviceuserid = wx.getStorageSync("userid")
    var orderid = e.currentTarget.dataset.orderid
    wx.showModal({
      title: '确认接单',
      content: '请确认是否接单',
      cancelText: "拒绝",
      confirmText: "接单",
      success: function(res) {
        if (res.confirm) {
          // 确认接单
          app.util.request({
            url: 'distributeConfirm/updateByDistributeConfirmService',
            header: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            data: {
              version: app.siteinfo.version,
              pagenumber: -1,
              pagesize: "",
              orderid: orderid,
              distributeconfirmserviceuserid: confirmserviceuserid,
              distributeconfirmupdateuserid: confirmserviceuserid,
              distributeconfirmstate: "SY"
            },
            success: function(res) {
              console.log(res)
              wx.showModal({
                content: res.data.msg,
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
                  if (res.confirm) {

                  }
                }
              });
            }
          });
        } else {
          // 取消接单
          console.log("取消")
          app.util.request({
            url: 'operation_order/updateByDistributeConfirmCancel',
            header: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            data: {
              version: app.siteinfo.version,
              pagenumber: -1,
              pagesize: "",
              orderid: orderid,
              distributeconfirmserviceuserid: confirmserviceuserid,
              distributeconfirmupdateuserid: confirmserviceuserid,
              distributeconfirmstate: "SQX"
            },
            success: function(res) {
              console.log(res)
              wx.redirectTo({
                url: '../repairTask/repairTask'
              })
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
        }
      },
    })
  },

  //事件处理函数
  //评价用户
  userEvaluate: function(e) {
    console.log(e)
    var orderid = e.target.dataset.id
    var orderserviceuserid = e.target.dataset.orderserviceuserid
    wx.navigateTo({
      url: '../userEvaluate/userEvaluate?orderid=' + orderid + "&orderserviceuserid=" + orderserviceuserid,
    })
  },

  //维修验收
  repairCollect: function(e) {
    wx.navigateTo({
      url: '../repairCollect/repairCollect?orderid=' + e.currentTarget.dataset.orderid,
    })
  },
  // 确认收款
  confirmreceipt: function(e) {

    var orderid = e.target.dataset.orderid
    //发送请求   确认收到货款 
    wx.showModal({
      title: '确认付款',
      content: '请确认是否付款成功',
      cancelText: "取消",
      confirmText: "确认",
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //点击确定   将订单状态改成//YSK
          app.util.request({
            url: 'order_table/updateByOrderTableAndServiceMoney',
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
            success: function(res) {
              console.log(res)
              wx.redirectTo({
                url: '../repairTask/repairTask'
              })
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
        } else if (res.cancel) {
          wx.redirectTo({
            url: '../repairTask/repairTask',
            success: function(res) {},
          })

        }
      }
    })
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