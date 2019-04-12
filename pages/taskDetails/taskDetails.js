// pages/taskDetails/taskDetails.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'https://www.fhmpt.cn/',
    onclick: true,
    accepttraveltotalmoney: null,
    user: {
      version: app.siteinfo.version,
      userrole: "",
      userid: "",
    },
    orderTable: {
      orderprojecttype: "",
      buildingtypeid: "",
      orderid: "",
      currentuserid: ""
    },
    orderDetailListEntity: {
      orderDetailList: [

      ]
    },

  },
  // 展示所需工具
  detail: function(e) {
    console.log(e)
    wx.showModal({
      content: e.currentTarget.dataset.detail,
      showCancel: false,
      success: function(res) {}
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  chooseLocation: function(e) {
    var that = this
    wx.openLocation({
      longitude: that.data.orderlongitude,
      latitude: that.data.orderlatitude
    })
  },
  // 查看图片
  previewImage: function(e) {
    console.log(e)
    var url = e.target.dataset.url
    console.log(url)
    console.log(url)
    wx.previewImage({
      urls: url.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错
    })
  },
  onLoad: function(options) {
    var that = this;
    var Storage = wx.getStorageSync("userrole")
    if(Storage ==null ||Storage==""){
      that.setData({
        rolestatic:false
      })
    }else{
      that.setData({
        rolestatic: true
      })
    }
    console.log(options)
    this.setData({
      ordertype: options.ordertype,
      orderid: options.orderid
    })
    wx.getStorage({
      key: 'userrole',
      success: function(res) {
        that.setData({
          userrole: res.data
        })
      }
    })
    var userid = wx.getStorageSync("userid")
    that.setData({
      userid: userid
    })
    // 第一步
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
        orderid: that.data.orderid,
        serviceuserid: that.data.userid

      },
      success: function(res) {
        console.log(res)
        var count = res.data.count
        that.setData({
          count: count
        })
        console.log(that.data.count)
        if (count > 0) {
          console.log("参与过竞标")
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
                propertycompanyname: array.orderTableAndBuildingType.propertycompanyname,
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
                orderList: res.data.data[0].orderDetailList,
              })
              var list = that.data.orderList
              var sum = 0;
              for (var i = 0; i < list.length; i++) {
                sum = sum + (list[i].orderpricemoney * list[i].orderdetailnumber);
              }
              that.setData({
                orderintercepttotalmoney: sum + that.data.ordertraveltotalmoney
              })
              that.setData({
                sum: that.data.orderintercepttotalmoney
              })
            }
          });
        } else {
          console.log("未参与过竞标")
          app.util.request({
            url: 'order_table/selectThreeTablestByUnionDataAndPrice',
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
                propertycompanyname: array.orderTableAndBuildingType.propertycompanyname,
                ordercreatetime: array.orderTableAndBuildingType.ordercreatetime,
                orderplantime: array.orderTableAndBuildingType.orderplantime,
                orderlatitude: array.orderTableAndBuildingType.orderlatitude,
                orderlongitude: array.orderTableAndBuildingType.orderlongitude,
                orderprojectname: array.orderTableAndBuildingType.orderprojectname,
                orderprojecttype: array.orderTableAndBuildingType.orderprojecttype,
                orderremark: array.orderTableAndBuildingType.orderremark,
                ordertype: array.orderTableAndBuildingType.ordertype,
                buildingtypename: array.orderTableAndBuildingType.buildingtypename,
                orderList: res.data.data[0].orderDetailList,
              })
              var list = that.data.orderList
              var sum = 0;
              for (var i = 0; i < list.length; i++) {
                sum = sum + (list[i].orderpricemoney * list[i].orderdetailnumber);
              }
              that.setData({
                orderintercepttotalmoney: sum

              })
              that.setData({
                sum: that.data.orderintercepttotalmoney
              })
            }
          });
        }
      }
    });
  

  },

  //事件处理函数
  //  保存单价
  save: function(e) {
    var index = e.target.dataset.index;
    var price = e.detail.value
    var array = price.split(".");
    if ((array.length > 1 && array[1].length > 2) || array.length > 2) {
      wx.showModal({
        content: "限制小数点后两位",
        showCancel: false,
        success: function(res) {}
      });

    } else {
      price = price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    }
    if (price == null || price == "") {
      wx.showModal({
        content: "请输入单价",
        showCancel: false,
        success: function(res) {

        }
      });
    }

    var reg = /^\d+(\.\d+)?$/;
    if (!reg.test(price)) {
      var that = this
      wx.showModal({
        content: "只能输入数字",
        showCancel: false,
        success: function(res) {}
      });
    }
    this.data.orderList[index].orderpricemoney = price.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    console.log(this.data.orderList[index].orderpricemoney)
    var list = this.data.orderList
    var sum = 0;
    for (var i = 0; i < list.length; i++) {
      sum = sum + (list[i].orderpricemoney * list[i].orderdetailnumber);
    }
    console.log(sum)
    var count = 0
    count = Math.floor(sum * 100) / 100
    this.setData({
      orderintercepttotalmoney: count,
      sum: count
    })
  },


  focus: function(e) {
    var that = this
    var sum = this.data.sum
    if (sum == null || sum == undefined) {
      wx.showModal({
        content: "必须先填写单价",
        showCancel: false,
        success: function(res) {
          return
        }
      });
    }
    that.setData({
      orderintercepttotalmoney: sum,
    })
  },
  // 差旅费
  accept: function(e) {
    if (e.detail.value == null) {
      wx.showModal({
        content: "请输入差旅费",
        showCancel: false,
        success: function(res) {}
      });
    }
    var money = e.detail.value
    var array = money.split(".");
    if ((array.length > 1 && array[1].length > 2) || array.length > 2) {
      wx.showModal({
        content: "限制小数点后两位",
        showCancel: false,
        success: function(res) {

        }
      });

    } else {
      money = money.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
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
    var acceptmoney = this.data.orderintercepttotalmoney + Number(money)
    this.setData({
      accepttraveltotalmoney: money,
      orderintercepttotalmoney: acceptmoney
    })
  },
  //立即竞标
  orderTaking: function(e) {
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
    console.log(that.data.orderList)
    this.data.orderDetailListEntity.orderDetailList = this.data.orderList
    this.data.user.userrole = this.data.userrole;
    this.data.user.userid = this.data.userid;
    this.data.orderTable.currentuserid = this.data.userid;
    this.data.orderTable.accepttraveltotalmoney = this.data.accepttraveltotalmoney
    this.data.orderTable.orderprojecttype = this.data.array.orderTableAndBuildingType.orderprojecttype;
    this.data.orderTable.buildingtypeid = this.data.array.orderTableAndBuildingType.buildingtypeid;
    this.data.orderTable.orderid = this.data.array.orderDetailList[0].orderid;
    var SUM = this.data.orderDetailListEntity.orderDetailList.length
    for (var i = 0; i < SUM; i++) {
      console.log(this.data.orderDetailListEntity.orderDetailList[i].orderpricemoney)
      if (this.data.orderDetailListEntity.orderDetailList[i].orderpricemoney <= 0 ||
        this.data.orderDetailListEntity.orderDetailList[i].orderpricemoney == "" ||
        this.data.orderDetailListEntity.orderDetailList[i].orderpricemoney == NaN) {
        wx.showModal({
          content: '某些单价为0,请重新填写',
          showCancel: false,
          success: function(res) {
            return;
          }
        });
        that.setData({
          onclick: false
        })
        return;

      }
    }


    app.util.request({
      url: 'operation_order/snatchUpdatePrice',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        user: JSON.stringify(that.data.user),
        orderTable: JSON.stringify(that.data.orderTable),
        orderDetailListEntity: JSON.stringify(that.data.orderDetailListEntity)

      },
      success: function(res) {
        console.log(res);
        if (res.data.count == 1) {
          wx.showModal({
            content: '竞标成功',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../workhome/workhome',
                })
              }
            }
          });
        } else {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../workhome/workhome',
                })
              }
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
    that.setData({
      onclick: false
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