// pages/confirmOrder/confirmOrder.js
var lasttime = 0;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    releaseBg: "#ccc",
    orderList: "",
    paytype: null,
    leafletsBg: "#ed1b24",
    onclick: true,
    fabuclick: false,
    userid: "",
    agreeMent: false,
    showAgreement: "相关协议相关协议相关协议相关协议相关协议",
    orderTable: {
      version: app.siteinfo.version,
      pagenumber: -1
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 付款方式
  paytype: function(e) {
    var that = this;
    that.setData({
      paytype: e.detail.value,
      orderpaymentmethodcontent: e.detail.value
    })
    console.log(that.data.paytype)
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
  // 第一次加载
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
          orderaddress: array.orderTableAndBuildingType.orderaddress,
          ordercontactperson: array.orderTableAndBuildingType.ordercontactperson,
          ordercontactphone: array.orderTableAndBuildingType.ordercontactphone,

          propertycompanyname: array.orderTableAndBuildingType.propertycompanyname,
          orderplantime: array.orderTableAndBuildingType.orderplantime,
          orderbiddingendtime: array.orderTableAndBuildingType.orderbiddingendtime,
          orderprojectname: array.orderTableAndBuildingType.orderprojectname,
          orderprojecttype: array.orderTableAndBuildingType.orderprojecttype,
          buildingtypename: array.orderTableAndBuildingType.buildingtypename,
          orderintercepttotalmoney: array.orderTableAndBuildingType.orderintercepttotalmoney,
          buildingtypeid: array.orderTableAndBuildingType.buildingtypeid,
          ordercreateuserid: array.orderTableAndBuildingType.ordercreateuserid,
          orderList: res.data.data[0].orderDetailList,
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
  },
  //事件处理函数
  //发布竞标
  releaseBill: function(e) {
    var that = this;
    var biddtime = that.data.orderbiddingendtime
    var ntime = new Date();
    biddtime = new Date(Date.parse(biddtime)); //竞标截止时间
    ntime = new Date(Date.parse(ntime)); //竞标截止时间
    // console.log(biddtime)
    // console.log(ntime)
    if (biddtime - ntime <= 2) {
      wx.showModal({
        content: "距离竞标截止日期太短，不允许发布竞标，请点击平台派单",
        showCancel: false,
        success: function(res) {
          return;
        }
      });
      return;
    }
    let d = new Date();
    let nowtime = d.getTime(); //获取点击时间
    if (nowtime - lasttime > 3000) { //1500ms内无法识别再点击
      var agreeMent = that.data.agreeMent;
      console.log(agreeMent)
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
      this.setData({
        releaseBg: "#ed1b24",
        leafletsBg: "#ccc",
      })
      var paytype = that.data.paytype
      console.log(paytype)
      if (paytype == null || paytype == "") {
        wx.showModal({
          content: "请输入付款方式，付款方式为必填项",
          success: function(res) {
            return
          }
        });
        return
      }
      app.util.request({
        url: 'operation_order/release',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          orderid: that.data.orderid,
          orderpaymentmethodcontent: that.data.orderpaymentmethodcontent,
          currentuserid: that.data.userid,
          version: app.siteinfo.version,
        },
        success: function(res) {
          that.setData({
            fabuclick: false
          })
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
      wx.showModal({
        content: "请勿重复点击！",
        showCancel: false,
        success: function(res) {
          return;
        }
      });
    }
    lasttime = nowtime;
  },


  //请平台派单按钮
  leafletsBtn: function(e) {
    var that = this;
    let d = new Date();
    let nowtime = d.getTime(); //获取点击时间
    if (nowtime - lasttime > 3000) { //1500ms内无法识别再点击
      var agreeMent = that.data.agreeMent;
      console.log(agreeMent)
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
      var type = that.data.orderprojecttype;
      if (type == "WX") {
        wx.showModal({
          content: "系统正在升级，该功能暂不能使用，为您带来的不便还请谅解！",
          showCancel: false,
          success: function(res) {
            return;
          }
        });
      } else {
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
            success: function(res) {}
          });

        }
        this.setData({
          releaseBg: "#ccc",
          leafletsBg: "#ed1b24",
        })
        app.util.request({
          url: 'operation_order/backDistributionNew',
          header: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          method: "POST",
          data: {
            orderid: that.data.orderid,
            currentuserid: that.data.userid,
            version: app.siteinfo.version,
            pagenumber: -1,
            orderpaymentmethodcontent: that.data.orderpaymentmethodcontent,
            orderprojecttype: that.data.orderprojecttype,
            orderintercepttotalmoney: that.data.orderintercepttotalmoney,
            buildingtypeid: that.data.buildingtypeid,
            ordercreateuserid: that.data.ordercreateuserid
          },
          success: function(res) {
            that.setData({
              fabuclick: false
            })
            // 判断不对
            if (res.data.count != 0) {
              wx.showModal({
                content: res.data.msg,
                showCancel: false,
                success: function(res) {
                  wx.switchTab({
                    url: '../workhome/workhome',
                  })
                }
              });
            } else {
              wx.showModal({
                content: res.data.msg,
                showCancel: false,
                success: function(res) {}
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
      }
    } else {
      wx.showModal({
        content: "请勿重复点击！",
        showCancel: false,
        success: function(res) {
          return;
        }
      });
    }
    lasttime = nowtime;
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
    this.setData({
      onclick: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
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