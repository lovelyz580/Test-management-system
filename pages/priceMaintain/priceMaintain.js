// pages/priceMaintain/priceMaintain.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    priceArray: [],
    priceid: "",
    priceListEntity: {
      priceList: []
    },
  },
  // 搜索
  searchValueInput: function(e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    })
    console.log(value)
  },
  // 请求后台
  suo: function(e) {
    // 存formid
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
    var value = that.data.searchValue
    console.log(value)
    // 查询操作
    app.util.request({
      url: 'announcement/selectThreeTablesBySelectData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        orderprojecttype: "WX",
        ordertype: "QD",
        currentuserid: that.data.userid,
        orderprojectname: that.data.searchValue
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
  save: function(e) {
    var that = this
    var index = e.target.dataset.id
    var money = e.detail.value;
    var array = money.split(".");
    if ((array.length > 1 && array[1].length > 2) || array.length > 2) {
      wx.showModal({
        content: "限制小数点后两位",
        showCancel: false,
        success: function(res) {}
      });
    }
    var reg = /^\d+(\.\d+)?$/;
    if (!reg.test(money)) {
      var that = this
      wx.showModal({
        content: "只能输入数字",
        showCancel: false,
        success: function(res) {}
      });
    }

    that.data.priceArray[index].pricemoney = Number(money)
    console.log(that.data.priceArray)
    that.setData({
      priceArray: that.data.priceArray
    })
  },
  // 取消
  Btnoff: function(e) {
    console.log("取消")
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
    var setInterval = setTimeout(function() {
      wx.navigateBack({
        delta: 1
      })
    }, 1000)
  },

  // 提交
  buttonBtn: function(e) {
    var that = this
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
    }
    var userid = wx.getStorageSync('userid');
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
    that.data.priceListEntity.priceList = that.data.priceArray
    that.setData({
      priceListEntity: that.data.priceListEntity
    })
    var pricecreateuserid = wx.getStorageSync('userid');
    app.util.request({
      url: 'price/insertOrUpdateByPriceModel',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        priceListEntity: JSON.stringify(that.data.priceListEntity),
        pricecreateuserid: pricecreateuserid
      },
      success: function(res) {
        if (res.data.count == 1) {
          wx.showModal({
            content: "更新成功",
            showCancel: false,
            success: function(res) {
              var setInterval = setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          });
        } else {
          wx.showModal({
            content: "更新失败",
            showCancel: false,
            success: function(res) {
              var setInterval = setTimeout(function() {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var userid = wx.getStorageSync("userid")
    var userrole = wx.getStorageSync("userrole")
    that.setData({
      userid: userid,
      userrole: userrole
    })
    if (that.data.userrole == "WX,") {
      that.data.userrole = "WX"
    } else if (that.data.userrole == "WX,AZ," || that.data.userrole == "AZ,WX,") {
      that.data.userrole = ""
    } else if (that.data.userrole == "AZ,") {
      that.data.userrole = "AZ"
    }
    app.util.request({
      //查询所有单价
      url: 'price/selectProjectAndGoods',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: 1,
        pagesize: 10,
        priceupdateuserid: that.data.userid, //用户id 
        projecttype: that.data.userrole //角色
      },
      success: function(res) {
        console.log(res)
        that.setData({
          priceArray: res.data.data
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


  },
  getMoreprice:function (e){
    if (that.data.userrole == "WX,") {
      that.data.userrole = "WX"
    } else if (that.data.userrole == "WX,AZ," || that.data.userrole == "AZ,WX,") {
      that.data.userrole = ""
    } else if (that.data.userrole == "AZ,") {
      that.data.userrole = "AZ"
    }
    app.util.request({
      //查询所有单价
      url: 'price/selectProjectAndGoods',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: 1,
        pagesize: "10",
        priceupdateuserid: that.data.userid, //用户id 
        projecttype: that.data.userrole //角色
      },
      success: function (res) {
        if (res.data.data.length == 0) {
          wx.showModal({
            content: "已加载全部内容",
            showCancel: false,
            success: function (res) {
              return;
            }
          })
        }
        that.setData({
          pagenumber: that.data.pagenumber + 1
        })
        var list = that.data.priceArray
        var lists = [...list, ...res.data.data]
        that.setData({
          priceArray: lists,  
        })
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
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
  // 下拉刷新
  onReachBottom: function (e) {
    var that = this;
    this.getMoreprice()

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})