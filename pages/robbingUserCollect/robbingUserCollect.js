// pages/robbingUserCollect/robbingUserCollect.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    standardtext:null,
    url: 'https://www.fhmpt.cn/'
  },
  // 查看图片
  previewImage: function(e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = e.currentTarget.dataset.list; //获取data-list
    for (var a = 0; a < imgList.length; a++) {
      imgList[a] = this.data.url + imgList[a]
    }
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  // 验收不合格原因
  nostandard:function (e){
var that = this
that.setData({
  standardtext:e.detail.value
})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      orderid: options.orderid,
    })
    var userid = wx.getStorageSync("userid")
    that.setData({
      userid: userid
    })
    app.util.request({
      url: 'order_table/selectThreeTablestByUnionDataAndCheckPrice?orderid=' + options.orderid,
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        orderid: that.data.orderid,
        pagenumber: -1,
        pagesize: ""
      },
      success: function(res) {
        console.log(res)
        that.setData({
          array: res.data.data[0]
        })
        var array = res.data.data[0];
        that.setData({
          orderid: array.orderTableAndBuildingType.orderid,
          orderaddress: array.orderTableAndBuildingType.orderaddress,
          ordercontactperson: array.orderTableAndBuildingType.ordercontactperson,
          ordercontactphone: array.orderTableAndBuildingType.ordercontactphone,
          ordercreatetime: array.orderTableAndBuildingType.ordercreatetime,
          orderprojectname: array.orderTableAndBuildingType.orderprojectname,
          orderprojecttype: array.orderTableAndBuildingType.orderprojecttype,
          buildingtypename: array.orderTableAndBuildingType.buildingtypename,
          orderintercepttotalmoney: array.orderTableAndBuildingType.orderintercepttotalmoney,
          orderid: array.orderTableAndBuildingType.orderid,
          ordertraveltotalmoney: array.orderTableAndBuildingType.ordertraveltotalmoney,
          ordertotalmoney: array.orderTableAndBuildingType.ordertotalmoney,
          orderserviceuserid: array.orderTableAndBuildingType.orderserviceuserid,
          orderpricetotalmoney: array.orderTableAndBuildingType.orderpricetotalmoney,
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
    // 查询验收金额
    app.util.request({
      url: 'apply_check/selectThreeTablesByUnionDataByTimeDesc',
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
        var applaylist = res.data.data
        var customermoney = res.data.data[0].customermoney
        var applycheckremark = res.data.data[0].applycheckremark
        that.setData({
          applaylist: applaylist,
          customermoney: customermoney,
          applycheckremark: applycheckremark
        })
        var images = res.data.data[0].applycheckimage
        if (images != null) {
          var m = images.split(",");
          that.setData({
            images: m
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

  //事件处理函数
  //验收合格
  qualified: function (e) {
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
    that.setData({
      userid:userid
    })
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
    var orderid = that.data.orderid
    var orderserviceuserid = that.data.orderserviceuserid
    var applycheckmoney = that.data.customermoney    //验收金额
    var orderprojectname = that.data.orderprojectname
    app.util.request({
      url: 'operation_check/updateApplyCheckQualified',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        orderid: that.data.orderid,
        currentuserid: that.data.userid
      },
      success: function (res) {
        console.log(res)
        if (res.data.count == 1) {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../pay/pay?orderid=' + orderid,
                })
              }
            }
          });
        } else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('确定')
                wx.redirectTo({
                  url: '../orderManage/orderManage'
                })
              }
            }
          });
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
  //验收不合格委托平台派单
  noQualifiedPd: function(e) {
    var that = this;
    app.util.request({
      url: 'operation_check/updateApplyCheckUnqualifiedAndPicketing',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        orderid: e.currentTarget.dataset.orderid,
        currentuserid: that.data.userid
      },
      success: function(res) {
        console.log(res)
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              //跳转到客服页面
              wx.redirectTo({
                url: '../disputeHandle/disputeHandle',
              })

            }
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
  },

  //验收不合格转平台服务
  noQualifiedService: function(e) {
    var that = this;
    if (that.data.standardtext == null || that.data.standardtext ==""){
      wx.showModal({
        content: "请填写不合格原因",
        showCancel: false,
        success: function (res) {
          return
        }
      });
      return
    }
    app.util.request({
      url: 'operation_check/updateApplyCheckUnqualifiedNew',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        orderid: e.currentTarget.dataset.orderid,
        applycheckcontent: that.data.standardtext,
        currentuserid: that.data.userid
      },
      success: function(res) {
        console.log(res)
        //提示
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              // //跳转到客服页面
              wx.redirectTo({
                url: '../disputeHandle/disputeHandle',
              })
              // 跳转首页
              // wx.switchTab({
              //   url: '../personal/personal',
              // })

            }
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