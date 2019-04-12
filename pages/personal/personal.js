// pages/personal/personal.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: " ",
    userrole: "",
    moneystatic: false,
    onclick: true,
    receiptText: "我要接受派单",
    user: {
      version: app.siteinfo.version,
      pagenumber: -1,
      userid: "",
      userrole: ""
    },
    userService: {
      userservicestate: ""
    },
  },
  // 修改密码
  //修改密码
  updatepassword: function() {
    wx.navigateTo({
      url: '../updatepassword/updatepassword',
    })
  },
  // money: function(e) {
  //   console.log(e)
  //   var that = this
  //   var moneystatic = that.data.moneystatic
  //   console.log(moneystatic)
  //   if (!moneystatic) {
  //     that.setData({

  //       moneyeye: that.data.usermoney,
  //       moneystatic: !that.data.moneystatic
  //     })
  //   } else {
  //     that.setData({
  //       moneyeye: "****",
  //       moneystatic: !that.data.moneystatic
  //     })
  //   }

  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'userrole',
      success: function(res) {
        that.setData({
          userrole: res.data
        })
        console.log(that.data.userrole)
        that.data.user.userrole = res.data;
      }
    })
    wx.getStorage({
      key: 'userservicestate',
      success: function(res) {
        that.setData({
          userservicestate: res.data
        })
        if (res.data == "N" || null) {
          that.setData({
            receiptText: "我要接受派单"
          })
        } else {
          that.setData({
            receiptText: "暂停接受派单"
          })
        }
      }
    })
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          userid: res.data
        })
        that.data.user.userid = res.data;
        // 获取用户信息
        app.util.request({
          url: 'user/selectThreeTablesByUnionData',
          header: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          method: "POST",
          data: {
            version: app.siteinfo.version,
            pagenumber: -1,
            pagesize: "",
            userid: res.data
          },
          success: function(res) {
            console.log(res)
            var obj = res.data.data[0];
            that.setData({
              phone: obj.userphone,
              name: obj.userrealname,
              moneyeye: obj.usermoney,
              // moneyeye: "****",
              usercredit: obj.usercredit,
            })
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
    })
  },

  //事件处理函数
  // // 被拍单任务
  //   takesingle:function (){
  //     wx.navigateTo({
  //       url: '../takesingle/takesingle',
  //     })
  //   },
  //订单列表
  orderList: function() {
    wx.navigateTo({
      url: '../orderManage/orderManage',
    })
  },
  // 竞标任务
  biddTask: function() {
    wx.navigateTo({
      url: '../orderbiddlist/orderbiddlist',
    })
  },
  outlogin: function(e) {
    var that = this
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
    // 清除缓存
    wx.clearStorage();
    // console.log("123")
    // Chase218人对此回答表示赞同
    // 退出之后刷新当前页面
    wx.switchTab({
      url: '../workhome/workhome',
      success: function(e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        // page.onLoad();
        page.onShow()
      }
    })
  },
  //编辑信息
  editInfo: function() {
    wx.navigateTo({
      url: '../editInfo/editInfo',
    })
  },
  // 推广二维码
  spread: function() {
    wx.navigateTo({
      url: '../spread/spread',
    })
  },

  //钱包
  myWallet: function() {
    wx.navigateTo({
      url: '../myWallet/myWallet',
    })
  },

  //维修任务
  repairTask: function() {
    wx.navigateTo({
      url: '../repairTask/repairTask',
    })
  },

  //单价维护
  priceMaintain: function() {
    wx.navigateTo({
      url: '../pricemanagement/pricemanagement',
    })
  },

  //拨打电话
  phonecallevent: function(e) {
    wx.showActionSheet({
      itemList: ['平台客服--曹振环', '平台客服--葛  辉', '平台办公'],
      success: function(res) {
        // console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.makePhoneCall({
            phoneNumber: '15373123277',
          })
        }
        if (res.tapIndex == 1) {
          wx.makePhoneCall({
            phoneNumber: '18931222014',
          })
        }
        if (res.tapIndex == 2) {
          wx.makePhoneCall({
            phoneNumber: '0312-5971018',
          })
        }

      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },

  //竞标
  receipt: function(e) {
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
      onclick: true
    })
    setTimeout(function() {
      that.setData({
        onclick: false
      })
    }, 3000)
    wx.getStorage({
      key: 'userservicestate',
      success: function(res) {
        that.setData({
          userservicestate: res.data
        })
        if (that.data.userservicestate == "Y") {
          that.data.userService.userservicestate = "N"
          app.util.request({
            url: 'user/updateTwoTables',
            header: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            data: {
              user: JSON.stringify(that.data.user),
              userService: JSON.stringify(that.data.userService)
            },
            success: function(res) {
              console.log(res);
              wx.showModal({
                content: "更新成功",
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {}
                }
              });
              wx.setStorage({
                key: "userservicestate",
                data: res.data.data[0].userservicestate
              })
              that.setData({
                receiptText: "我要接受派单"
              })
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
        } else {
          that.data.userService.userservicestate = "Y"
          app.util.request({
            url: 'user/updateTwoTables',
            header: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            data: {
              user: JSON.stringify(that.data.user),
              userService: JSON.stringify(that.data.userService)
            },
            success: function(res) {
              console.log(res);
              wx.setStorage({
                key: "userservicestate",
                data: res.data.data[0].userservicestate
              })
              that.setData({
                receiptText: "暂停接单"
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
    this.setData({
      onclick: false
    })
    var userrole = wx.getStorageSync("userrole");
    if (userrole == "") {
      wx.showModal({
        content: "您未登录，请点击登录",
        showCancel: true,
        cancelText: "取消",
        confirmText: "登录",
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
          } else {
            wx.switchTab({
              url: '../workhome/workhome',
            })
          }
        }
      })
    }

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