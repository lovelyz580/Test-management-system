var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    required: true,
    productList: [],
    onclick: true,
    tempFilePaths: [],
    addclick: true,
    projectList: [],
    intext: true,
    intexts: true,
    classIndex: 0,
    index: 0,
    classType: "WX",
    projectIndex: 0,
    price: 0,
    allPrice: "0.00",
    buildingtypeid: 1, //建筑类型ID
    estatetypeid: 0, //地产公司
    num: "",
    userid: "",
    latitude: "",
    longitude: "",
    name: "",
    EstateIndex: 0,
    address: "",
    projectid: "",
    positionStatus: false,
    date: ' ',
    biddate: ' ',
    goodsid: "",

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var userid = wx.getStorageSync("userid")
    that.setData({
      userid: userid
    })
    //获取用户信息
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
        userid: that.data.userid
      },
      success: function(res) {
        that.setData({
          Contacts: res.data.data[0].userrealname,
          phone: res.data.data[0].userphone
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
    // 获取任务类别
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
        goodsstate: "Y",
        goodstype: "AZ"
      },
      success: function(res) {
        console.log(res)
        that.setData({
          projectList: res.data.data,
          goodsid: res.data.data[0].goodsid
        })
        // that.getProject(that.data.goodsid) //获取清单项目
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
    //获取区域
    app.util.request({
      url: 'area/selectByAreaNoAll',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        areacitycode: "156"
      },
      success: function(res) {
        console.log(res.data.data)
        that.setData({
          areaList: res.data.data
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
    //获取建筑类型
    app.util.request({
      url: 'building_type/selectByBuildingType',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        buildingtypestate: "Y"
      },
      success: function(res) {
        that.setData({
          ArchitectureList: res.data.data
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
    //获取地产公司
    app.util.request({
      url: 'property_company/selectByPropertyCompany',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        propertycompanystate: "Y"
      },
      success: function(res) {
        console.log(res.data.data)
        that.setData({
          EstateList: res.data.data
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
        projectstate: "Y",
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
  // 获取市
  getCity: function(areaprovincecode) {
    console.log(areaprovincecode)
    var that = this
    app.util.request({
      url: 'area/selectByArea',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        areacitycode: areaprovincecode
      },
      success: function(res) {
        if (res.data.data == null) {
          that.setData({
            cityList: that.data.priceareaprovinceAne,
            CityIndex: 0,
            priceareacode: that.data.priceareaprovinceAne[0].areaprovincecode,
            priceareaname: that.data.priceareaprovinceAne[0].areaprovince
          })
        } else {
          that.setData({
            cityList: res.data.data
          })
        }
        // console.log(that.data.cityList)
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
  // 获取清单报价
  ChangePrice: function(e) {
    var that = this
    that.setData({
      price: e.detail.value
    })
    console.log(that.data.price)
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
        // console.log(res)
        that.setData({
          price: res.data.data[0].interceptmoney,
          interceptid: res.data.data[0].interceptid,
          projectremark: res.data.data[0].projectremark

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
  // 选择省
  bindChangeArea: function(e) {
    var that = this
    var priceareaprovinceAne = []
    priceareaprovinceAne.push(that.data.areaList[e.detail.value])
    that.setData({
      AreaIndex: e.detail.value,
      priceareaprovincecode: that.data.areaList[e.detail.value].areaprovincecode,
      priceareaprovincename: that.data.areaList[e.detail.value].areaprovince,
      priceareaprovinceAne: priceareaprovinceAne
    })
    // console.log(that.data.priceareaprovinceAne)
    this.getCity(that.data.priceareaprovincecode);
  },
  // 选择市
  bindChangeCity: function(e) {
    var that = this
    that.setData({
      CityIndex: e.detail.value,
      priceareacode: that.data.cityList[e.detail.value].areaprovincecode,
      priceareaname: that.data.cityList[e.detail.value].areaprovince
    })
    console.log(that.data.priceareaprovincecode) //省代码
    console.log(that.data.priceareaprovincename) //省名字
    console.log(that.data.priceareacode) //市代码
    console.log(that.data.priceareaname) //市名字
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
    var that = this
    that.setData({
      projectIndex: e.detail.value,
      goodsid: that.data.projectList[e.detail.value].goodsid
    })
    // console.log(that.data.goodsid)
    this.getProject(that.data.goodsid)
  },

  //更改建筑类型
  bindChangeArchitecture: function(e) {
    var that = this
    that.setData({
      ArchitectureIndex: e.detail.value,
      buildingtypeid: this.data.ArchitectureList[e.detail.value].buildingtypeid
    })
    // console.log(that.data.buildingtypeid)
  },
  // 更改地产公司
  bindChangeEstate: function(e) {
    var that = this
    console.log(that.data.EstateList[e.detail.value])
    that.setData({
      EstateIndex: e.detail.value,
      estatetypeid: that.data.EstateList[e.detail.value].propertycompanyid
    })
    console.log(that.data.estatetypeid)
  },
  //保存清单报价
  addPrice: function(e) {
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
    var priceid = "" // 报价id
    var priceupdateuserid = that.data.userid // 维修单价维护人
    var goodsid = that.data.goodsid //产品ID
    var projectid = that.data.projectid //清单id
    var pricetype = "AZ" //维修单价类型
    var pricemoney = that.data.price //维修单价
    var pricestate = "Y" //维修单价状态(Y:有效/N:无效)
    var pricecreateuserid = that.data.userid // 维修单价創建人
    var priceareaprovincecode = that.data.priceareaprovincecode //省代码
    var priceareacode = that.data.priceareacode //市代码
    var pricebuildingtypeid = that.data.buildingtypeid //建筑类型
    var pricepropertycompanyid = that.data.estatetypeid //地产公司
    // if (this.data.num == "") {
    //   wx.showToast({
    //     title: '请输入维修数量',
    //     icon: "none"
    //   })
    //   return;
    // }
    app.util.request({
      url: 'price/insertOrUpdateByPriceNew',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        priceupdateuserid: that.data.userid,
        goodsid: goodsid,
        projectid: projectid,
        pricecreateuserid: pricecreateuserid,
        pricetype: pricetype,
        pricemoney: pricemoney,
        pricepropertycompanyid: pricepropertycompanyid,
        pricebuildingtypeid: pricebuildingtypeid,
        priceareacode: priceareacode,
        priceareaprovincecode: priceareaprovincecode,
        pricestate: pricestate
      },
      success: function(res) {
        console.log(res)
        wx.showModal({
          content: "操作成功",
          showCancel: false,
          success: function (res) {
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
    this.setData({
      onclick: false,
      addclick: false
    })
    // console.log(this.data.onclick)
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