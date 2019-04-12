// pages/confirmOrder/confirmOrder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userrealname: "",
    userphone: "",
    usercredit: "",
    orderserviceuserid: "",
    releaseBg: "#ccc",
    orderList: "",
    leafletsBg: "#ed1b24",
    userid: "",
    goodsid: "",
    orderDetaiConfirlList: [],
    orderTable: {
      orderposition: "",
      version: app.siteinfo.version,
      pagenumber: -1,
      orderlatitude: "",
      orderlongitude: "",
      orderremark: "",
      currentuserid: "",
      orderprojectname: "",
      orderprojecttype: "",
      orderaddress: "",
      ordercontactperson: "",
      ordercontactphone: "",
      buildingtypeid: "",
      orderplantime: "",
      orderposition: "",
      orderbiddingendtime: "",
      orderintercepttotalmoney: "" //总价
    },
    orderDetailListEntity: {
      orderDetailList: []
    },
    orderDetailConfirmListEntity: {
      orderDetailConfirmList: []
    },
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
          userid: res.data
        })
      }
    })
    wx.getStorage({
      key: 'userrole',
      success: function(res) {
        that.setData({
          userrole: res.data
        })
      }
    })
    this.setData({
      orderid: options.orderid
    })
    app.util.request({
      url: 'order_table/selectThreeTablesAndOrderPriceByUnionData',
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
          orderplantime: array.orderTableAndBuildingType.orderplantime,
          orderprojectname: array.orderTableAndBuildingType.orderprojectname,
          orderbiddingendtime: array.orderTableAndBuildingType.orderbiddingendtime,
          orderprojecttype: array.orderTableAndBuildingType.orderprojecttype,
          orderserviceuserid: array.orderTableAndBuildingType.orderserviceuserid,
          ordertype: array.orderTableAndBuildingType.ordertype,
          buildingtypename: array.orderTableAndBuildingType.buildingtypename,
          ordertotalmoney: array.orderTableAndBuildingType.ordertotalmoney,
          ordertype: array.orderTableAndBuildingType.ordertype,
          orderintercepttotalmoney: array.orderTableAndBuildingType.orderintercepttotalmoney,
          ordertraveltotalmoney: array.orderTableAndBuildingType.ordertraveltotalmoney,
          buildingtypeid: array.orderTableAndBuildingType.buildingtypeid,
          ordercreateuserid: array.orderTableAndBuildingType.ordercreateuserid,
          orderstate: array.orderTableAndBuildingType.orderstate,
          orderlatitude: array.orderTableAndBuildingType.orderlatitude,
          orderlongitude: array.orderTableAndBuildingType.orderlongitude,
          orderList: res.data.data[0].orderDetailList,
          changesorderList: res.data.data[0].orderDetailList,
        })
        that.data.orderDetailListEntity.orderDetailList = that.data.changesorderList;
        //维修类型
        app.util.request({
          url: 'goods/selectByGoods',
          header: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          method: "POST",
          data: {
            version: app.siteinfo.version,
            pagenumber: -1,
            pagesize: "",
            goodstype: that.data.orderprojecttype
          },
          success: function (res) {
            console.log(res)
            that.setData({
              projectList: res.data.data,
              goodsid: res.data.data[0].goodsid
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
      }
    });




  },
  //事件处理函数
  chooseLocation: function(e) {
    var that = this
    wx.openLocation({
      longitude: that.data.orderlongitude,
      latitude: that.data.orderlatitude
    })
  },
  //获取清单项目
  getProject: function(id) {
    var that = this;
    app.util.request({
      url: 'project/selectByProject',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        goodsid: id
      },
      success: function(res) {
        that.setData({
          productList: res.data.data,
          projectid: res.data.data[0].projectid
        })
        that.getPrice(id, that.data.projectid)
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

  //获取单价
  getPrice: function(goodsid, projectid) {
    var that = this;
    app.util.request({
      url: 'intercept/selectThreeTablesByUnionData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        projectid: projectid,
        goodsid: goodsid
      },
      success: function(res) {
        console.log(res)
        that.setData({
          price: res.data.data[0].interceptmoney,
          interceptid: res.data.data[0].interceptid
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
  //更改清单项目
  bindChangeProduct: function(e) {
    this.setData({
      index: e.detail.value,
      projectid: this.data.productList[e.detail.value].projectid
    })
    this.getPrice(this.data.goodsid, this.data.projectid)
  },

  //更改产品类别
  bindChangeProject: function(e) {
    this.setData({
      projectIndex: e.detail.value,
      goodsid: this.data.projectList[e.detail.value].goodsid
    })
    this.getProject(this.data.goodsid)
  },

  //更改建筑类型
  bindChangeArchitecture: function(e) {
    this.setData({
      ArchitectureIndex: e.detail.value,
      buildingtypeid: this.data.ArchitectureList[e.detail.value].buildingtypeid
    })
  },
  //获取维修数量
  getNum: function(e) {
    this.setData({
      num: e.detail.value
    })
  },

  //计算项目总价
  getAllPrice: function() {
    this.setData({
      allPrice: this.data.num * this.data.price
    })
  },
  //添加清单项目
  addBtn: function(e) {
    var that = this
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
        success: function(res) {
          console.log(res)
        }
      });
    }
    // console.log(this.data.num)
    if (this.data.num == "" || this.data.num == undefined) {
      wx.showToast({
        title: '请输入维修数量',
        icon: "none"
      })
      return;
    }
    if (this.data.num < 1) {
      wx.showToast({
        title: '维修数量最低为1',
        icon: "none"
      })
      return;
    }
    var changesorderList = this.data.changesorderList;
    var productList = this.data.productList;
    var projectList = this.data.projectList;
    var index = this.data.index;
    var projectIndex = this.data.projectIndex;
    var orderDetailList = this.data.orderDetailListEntity.orderDetailList;
    var newData = {
      productName: productList[index].projectname,
      projectName: projectList[projectIndex].goodsname,
      num: this.data.num,
      price: this.data.price,
      allPrice: this.data.allPrice,
      del: "删除"
    }
    var data = {
      id: "",
      goodsname: projectList[projectIndex].goodsname,
      projectid: this.data.projectid,
      goodsid: this.data.goodsid,
      projectname: productList[index].projectname,
      orderdetailnumber: this.data.num,
      interceptmoney: this.data.price,
      orderdetailintercepttotalmoney: this.data.num * this.data.price,
      interceptid: this.data.interceptid
    }

    // 添加重复项
    var count = that.data.orderDetailListEntity.orderDetailList.length
    var orderDetail = that.data.orderDetailListEntity.orderDetailList
    if (count > 0) {
      for (var i = 0; i < count; i++) {
        if (data.goodsid == orderDetail[i].goodsid && data.projectid == orderDetail[i].projectid) {
          wx.showModal({
            content: "请勿添加重复项",
            showCancel: false,
            success: function (res) { }
          });
          that.setData({
            num: null,
          })
          return
        }
      }
      changesorderList.push(data);
      that.data.orderDetailListEntity.orderDetailList = changesorderList;
      that.setData({
        changesorderList: changesorderList,
        orderDetailListEntity: that.data.orderDetailListEntity,
        num: null     //清空所填内容
      })
    }else{
      changesorderList.push(data);
      that.data.orderDetailListEntity.orderDetailList = changesorderList;
      that.setData({
        changesorderList: changesorderList,
        orderDetailListEntity: that.data.orderDetailListEntity,
        num: null     //清空所填内容
      })
    }
  },
  //删除
  deleteBtn: function(e) {
    var changesorderList = this.data.changesorderList;
    var listIndex = e.currentTarget.dataset.index;
    var orderDetailList = this.data.orderDetailListEntity.orderDetailList;
    changesorderList.splice(listIndex, 1);
    orderDetailList.splice(listIndex, 1);
    this.setData({
      changesorderList: changesorderList
    })
    this.data.orderDetailListEntity.orderDetailList = this.data.changesorderList;
  },
  // 保存数量
  save: function(e) {
    var index = e.target.dataset.index;
    var changeSum = e.detail.value
    this.data.changesorderList[index].orderdetailnumber = changeSum
    this.data.orderDetailListEntity.orderDetailList = this.data.changesorderList;
  },
  savepricemoney: function(e) {
    var index = e.target.dataset.index;
    var changeprice = e.detail.value
    this.data.changesorderList[index].orderdetailpricemoney = changeprice
    this.data.orderDetailListEntity.orderDetailList = this.data.changesorderList;
  },

  // 提交
  submitBtn: function(e) {
    var that = this
    var orderDetaiConfirlList = [] //将数组 存放数组里
    var count = this.data.orderDetailListEntity.orderDetailList.length
    console.log(that.data.orderDetailListEntity.orderDetailList)
    for (var i = 0; i < count; i++) {
      var oneConfirmList = {} //一个空数组
      oneConfirmList.goodsid = that.data.orderDetailListEntity.orderDetailList[i].goodsid,
        oneConfirmList.orderdetailconfirmintercepttotalmoney = that.data.orderDetailListEntity.orderDetailList[i].orderdetailintercepttotalmoney,
        oneConfirmList.orderdetailconfirmnumber = Number(that.data.orderDetailListEntity.orderDetailList[i].orderdetailnumber),
        oneConfirmList.orderdetailconfirmpricemoney = Number(that.data.orderDetailListEntity.orderDetailList[i].orderdetailpricemoney),
        oneConfirmList.projectid = that.data.orderDetailListEntity.orderDetailList[i].projectid
      orderDetaiConfirlList.push(oneConfirmList)
    }
    that.data.orderDetailConfirmListEntity.orderDetailConfirmList = orderDetaiConfirlList
    that.data.orderTable.orderid = that.data.orderid
    that.setData({
      orderDetailConfirmListEntity: that.data.orderDetailConfirmListEntity,
      orderTable: that.data.orderTable
    })
    console.log(that.data.orderDetailConfirmListEntity)
    // 收集formid
    var that = this
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
        success: function(res) {
          console.log(res)
        }
      });
    }
    //  保存订单
    app.util.request({
      url: 'operation_order/saveOrderDetailConfirm',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        orderTable: JSON.stringify(that.data.orderTable),
        orderDetailConfirmListEntity: JSON.stringify(that.data.orderDetailConfirmListEntity)
      },
      success: function(res) {
        console.log(res)
        if (res.data.count == 0) {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function(res) {}
          });
          return
        } else {
          wx.showModal({
            content: "操作成功",
            showCancel: false,
            success: function(res) {
              wx.switchTab({
                url: '../personal/personal'
              });
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