// pages/orderManage/orderManage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onclick: true,
    status: 0,
    pagenumber: 1,
    taskList: [],
    orderTable: {
     orderid:null,
      version:1.1,
     currentuserid:null
    },
    cancelTable:{
      orderid: null,
      version: 1.1,
      canceluserid:null,
    }
  },
  // 取消订单
  delCollect: function(e) {
var  that = this
   var id =  e.currentTarget.dataset.id
    var currentuserid = wx.getStorageSync("userid")
    that.data.orderTable.orderid = id;
    that.data.orderTable.currentuserid = currentuserid ;
    that.data.cancelTable.orderid = id;
    that.data.cancelTable.canceluserid = currentuserid;
    console.log(that.data.orderTable)
    console.log(that.data.cancelTable)
    app.util.request({
      url: 'operation_customer_cancel/customerCancel',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        orderTable: JSON.stringify(that.data.orderTable),
        cancelTable: JSON.stringify(that.data.cancelTable)

      },
      success: function(res) {
        console.log(res);
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
  // 订单变更
  ChangesOrder: function(e) {
    // 订单变更 跳转到详情页面
    // console.log(e)
    var orderid = e.currentTarget.dataset.orderid
    // console.log(orderid)
    wx.navigateTo({
      url: '../confirmChange/confirmChange?orderid=' + orderid,
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
    var that = this
    console.log("执行搜索功能")
    var formId = e.detail.formId; //formid 
    // console.log(formId)
    if (formId == "the formId is a mock one" || formId == null || formId == undefined) {
      formId = null
    } else {
      that.setData({
        formId: formId
      })
      // console.log(that.data.formId)
    }
    var userid = wx.getStorageSync('userid')
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
          console.log(res)
        }
      });

    }
    var that = this;
    var value = that.data.searchValue
    // console.log(value)
    app.util.request({
      url: 'order_table/selectBySelectData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        ordercreateuserid: that.data.userid,
        orderprojectname: value
      },
      success: function(res) {
        // console.log(res);
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
  // 确认接收任务
  ConfirmButton: function(e) {
    console.log(e)
    var orderid = e.currentTarget.dataset.orderid
    var orderserviceuserid = e.currentTarget.dataset.orderserviceuserid
    wx.showModal({
      title: '确认接单',
      content: '请确认是否接单',
      cancelText: "拒绝",
      confirmText: "接单",
      success: function(res) {
        if (res.confirm) {
          // 确认接单
          app.util.request({
            url: 'operation_order/updateByDistributeConfirm',
            header: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            data: {
              version: app.siteinfo.version,
              pagenumber: -1,
              pagesize: "",
              orderid: orderid,
            },
            success: function(res) {
              console.log(res)
              wx.redirectTo({
                url: '../orderManage/orderManage'
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
              distributeconfirmserviceuserid: orderserviceuserid,
              distributeconfirmupdateuserid: orderserviceuserid,
              distributeconfirmstate: "CQX"
            },
            success: function(res) {
              console.log(res)
              wx.redirectTo({
                url: '../orderManage/orderManage'
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
  // 加载更多
  getMore: function() {
    var that = this;
    that.setData({
      userid: wx.getStorageSync("userid")
    })
    app.util.request({
      url: 'order_table/selectByOrderTable',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: that.data.pagenumber,
        pagesize: 10,
        ordercreateuserid: that.data.userid
      },
      success: function(res) {
        if (res.data.data.length == 0) {
          wx.showModal({
            content: "已加载全部内容",
            showCancel: false,
            success: function(res) {
              if (res.confirm) {

              }
            }
          });
        }
        var list = that.data.taskList
        var lists = [...list, ...res.data.data]
        that.setData({
          taskList: lists,
          pagenumber: that.data.pagenumber + 1
        })
        console.log(that.data.taskList)
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
    that.setData({
      userid: wx.getStorageSync("userid")
    })
    app.util.request({
      url: 'order_table/selectByOrderTable',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: 1,
        pagesize: 10,
        ordercreateuserid: that.data.userid
      },
      success: function(res) {
        console.log(res)
        that.setData({
          taskList: res.data.data
        })
        console.log(that.data.taskList)
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

  //事件处理函数
  taskListDetail: function(e) {
    wx.navigateTo({
      url: '../orderdetail/orderdetail?orderid=' + e.currentTarget.dataset.id,
    })
  },
  //查看抢标人详情
  orderby: function(e) {
    var that = this;
    that.setData({
      onclick: true
    })
    wx.navigateTo({
      url: '../orderby/orderby?orderid=' + e.currentTarget.dataset.id
    })

  },
  //发布项目
  repairCollect: function(e) {
    var that = this;
    that.setData({
      onclick: true
    })
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder?orderid=' + e.currentTarget.dataset.id,
    })
  },
  // 去付款
  gotopay: function(e) {
    wx.navigateTo({
      url: '../pay/pay?orderid=' + e.currentTarget.dataset.id,
    })
  },

  //评价
  userEvaluate: function(e) {
    wx.navigateTo({
      url: '../workerEvaluate/workerEvaluate?orderid=' + e.currentTarget.dataset.id + '&orderserviceuserid=' + e.currentTarget.dataset.orderserviceuserid,
    })
  },

  //验收
  checkBtn: function(e) {
    var that = this;
    that.setData({
      onclick: true
    })
    // console.log(e.currentTarget.dataset.ordertype)
    var ordertype = e.currentTarget.dataset.ordertype;
    if (ordertype == "PD") {
      wx.navigateTo({
        url: '../userCollect/userCollect?orderid=' + e.currentTarget.dataset.orderid,
      })
    } else {
      wx.navigateTo({
        url: '../robbingUserCollect/robbingUserCollect?orderid=' + e.currentTarget.dataset.orderid,
      })
    }
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
    var that = this;
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          userid: res.data
        })

        app.util.request({
          url: 'order_table/selectByOrderTable',
          header: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          method: "POST",
          data: {
            version: app.siteinfo.version,
            pagenumber: -1,
            pagesize: "",
            ordercreateuserid: that.data.userid
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
    wx.stopPullDownRefresh();


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})