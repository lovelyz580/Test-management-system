// pages/taskDetails/taskDetails.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    confirm: false,
    agreeMent:false,
    showAgreement:"相关协议相关协议相关协议相关协议相关协议",
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
      accepttraveltotalmoney:"",
      orderid: "",
      currentuserid: "",
      orderdaymoney: "",
      orderday: "",
      orderpeoplenumber: "",
      ordermaterialmoney: "",


    },
    orderDetailListEntity: {
      orderDetailList: [

      ]
    },

  },
  // 用户协议
  agreeMent: function (event) {
    var that = this;
    var agreeMent = that.data.agreeMent;
    that.setData({ "agreeMent": !agreeMent });
    console.log(that.data.agreeMent)
  },
  // 展示协议
  showAgreement:function (e){
    var that = this
    wx.showModal({
      content: that.data.showAgreement,
      showCancel: false,
      success: function (res) { }
    });
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
    var that  = this
    var userid = wx.getStorageSync("userid")
    that.setData({
      userid: userid
    })
    // 获取报价列表
    app.util.request({
      url: 'price/selectFourTablesByUnionData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: 1,
        pagesize: "10",
        pricestate: "Y",
        pricetype: "WX",
        priceupdateuserid: that.data.userid,
      },
      success: function (res) {
        console.log(res)
        if (res.data.count == 0) {
          that.setData({
            price: ""
          })
        } else {
          that.setData({
            dayrate: res.data.data[0].pricemoney
          })
        }
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
    var Storage = wx.getStorageSync("userrole")
    if (Storage == null || Storage == "") {
      that.setData({
        rolestatic: false
      })
    } else {
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
                dayrate: array.orderTableAndBuildingType.orderdaymoney,
                people: array.orderTableAndBuildingType.orderpeoplenumber,
                daysnumber: array.orderTableAndBuildingType.orderday,
                materialsexpenses: array.orderTableAndBuildingType.ordermaterialmoney,
                orderintercepttotalmoney: array.orderTableAndBuildingType.orderpriceservicetotalmoney,
                orderList: res.data.data[0].orderDetailList,
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
  // 差旅费
  accept: function(e) {
    var that = this
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
    //差旅费
    var acceptmoney = Number(money)
    that.setData({
      acceptmoney: acceptmoney
    })
  },
  // 日工资
  dayrate: function(e) {
    var that = this
    var dayrate = e.detail.value
    that.setData({
      dayrate: dayrate
    })
  },
  // 人数
  people: function(e) {
    var that = this
    var people = e.detail.value
    that.setData({
      people: people
    })
  },
  // 天数
  daysnumber: function(e) {
    var that = this
    var daysnumber = e.detail.value
    that.setData({
      daysnumber: daysnumber
    })
  },
  // 材料费
  materialsexpenses: function(e) {
    var that = this
    var materialsexpenses = e.detail.value
    that.setData({
      materialsexpenses: materialsexpenses
    })
  },
  // 确认总价
  setprice: function(e) {
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
    var dayrate = that.data.dayrate //日工资
    var people = that.data.people //人数
    var daysnumber = that.data.daysnumber //天数
    var materialsexpenses = that.data.materialsexpenses //材料费
    var acceptmoney = that.data.acceptmoney //差旅费
    if (dayrate == "" || dayrate == undefined ||
      people == "" || people == undefined ||
      daysnumber == "" || daysnumber == undefined ||
      materialsexpenses == "" || materialsexpenses == undefined ||
      acceptmoney == "" || acceptmoney == undefined) {
      wx.showModal({
        content: '某些必填项为填写,请重新填写',
        showCancel: false,
        success: function(res) {
          return;
        }
      });
      return
    } else {
      var moneys = Number(dayrate * people * daysnumber) + Number(materialsexpenses) + Number(acceptmoney)
      console.log(moneys)
      that.setData({
        orderintercepttotalmoney: moneys,
        confirm: true
      })
    }
  },
  //立即竞标
  orderTaking: function(e) {
    var that = this;
    var agreeMent = that.data.agreeMent;
    if(!agreeMent){
      wx.showModal({
        content: '请点击同意相关协',
        success: function (res) {
          if(res.confirm){
            that.setData({
              agreeMent: true
            })
          }else{
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
    that.setData({
      onclick: true
    })
    console.log(that.data.orderList)
    this.data.orderDetailListEntity.orderDetailList = this.data.orderList
    this.data.user.userrole = this.data.userrole;
    this.data.user.userid = this.data.userid;
    this.data.orderTable.currentuserid = this.data.userid;
    this.data.orderTable.accepttraveltotalmoney = this.data.acceptmoney
    this.data.orderTable.orderprojecttype = this.data.array.orderTableAndBuildingType.orderprojecttype;
    this.data.orderTable.buildingtypeid = this.data.array.orderTableAndBuildingType.buildingtypeid;
    this.data.orderTable.orderid = this.data.array.orderDetailList[0].orderid;
    this.data.orderTable.orderdaymoney = this.data.dayrate;
    this.data.orderTable.orderday = this.data.daysnumber;
    this.data.orderTable.orderpeoplenumber = this.data.people;
    this.data.orderTable.ordermaterialmoney = this.data.materialsexpenses;
    if (!this.data.confirm) {
      this.setData({
        onclick: false
      })
      wx.showModal({
        content: '请点击确认按钮',
        showCancel: false,
        success: function(res) {
          return;
        }
      });

    } else {
      app.util.request({
        url: 'operation_order/snatchUpdatePriceWX',
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