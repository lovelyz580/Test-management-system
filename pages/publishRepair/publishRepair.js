var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmap = new QQMapWX({
  //在腾讯地图开放平台申请密钥 http://lbs.qq.com/mykey.html
  key: 'XFDBZ-RTIH4-555UL-XKVG7-46RBV-QFF4X'
});
// pages/publishRepair/publishRepair.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索框状态
    inputShowed: true,
    //显示结果view的状态
    viewShowed: false,
    // 搜索框值
    inputVal: "",
    //搜索渲染推荐数据
    catList: [],
    required: true,
    startDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    startbidDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    productList: [],
    onclick: true,
    tempFilePaths: [],
    addclick: true,
    projectList: [],
    intext: true,
    addimage: true,
    intexts: true,
    classList: [{
        classType: null,
        className: "请选择"
      }, {
        classType: "WX",
        className: "维修"
      },
      {
        classType: "AZ",
        className: "安装"
      }
    ],
    classIndex: 0,
    index: 0,
    classType: "WX",
    projectIndex: 0,
    price: 20,
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
    orderTable: {
      orderposition: "",
      orderlatitude: "",
      orderlongitude: "",
      pagenumber: "",
      version: "",
    },
    goodsid: "",
    orderTable: {
      orderlatitude: "",
      orderlongitude: "",
      pagenumber: "",
      orderremark: "",
      version: "",
      currentuserid: "",
      orderprojectname: "",
      orderprojecttype: "",
      orderaddress: "",
      ordercontactperson: "",
      ordercontactphone: "",
      buildingtypeid: "",
      orderpropertycompanyid: "",
      orderplantime: "",
      orderposition: "",
      orderbiddingendtime: "",
      orderintercepttotalmoney: "" //总价
    },
    orderDetailListEntity: {
      orderDetailList: []
    },
    orderDetailList: [],
    projectName: "", //项目名称
    Contacts: "", //联系人
    phone: "", //联系电话
    list: [],
    images: null,
    url: 'https://www.fhmpt.cn/'
  },
// 模糊搜索
  // 隐藏搜索框样式
  hideInput: function () {
    this.setData({
      inputShowed: false
    });
  },
  // 清除搜索框值
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  // 键盘抬起事件2
  inputTyping: function (e) {
    console.log(e.detail.value)
    var that = this;
    if (e.detail.value == '') {
      return;
    }
    var name = e.detail.value
    console.log(name.length)
    // 名称
    that.setData({
      viewShowed: false,
      inputVal: e.detail.value,
      projectName: e.detail.value,
      inputlist: true
    });
    console.log(that.data.kingdeeorderid)
    app.util.request({
      url: 'kingdee/selectByKingdee',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        kingdeename: name,
      },
      success: function (res) {
        console.log(res)
        that.setData({
          searchlist: res.data.data
        })
        console.log(that.data.searchlist)
      }
    });

  },
  // 获取选中推荐列表中的值
  btn_name: function (res) {
    console.log(res.currentTarget.dataset.index, res.currentTarget.dataset.name);
    var that = this;
    // 名称
    that.setData({
      viewShowed: true,
      projectName: res.currentTarget.dataset.name.kingdeename,
      inputVal: res.currentTarget.dataset.name.kingdeename,
      kingdeeorderid: res.currentTarget.dataset.name.kingdeeorderid,
      kingdeeorderfnumber: res.currentTarget.dataset.name.kingdeeorderfnumber,
      inputlist:false
    });
    console.log(that.data.projectName)
    console.log(that.data.kingdeeorderid)
    console.log(that.data.kingdeeorderfnumber)
    that.hideInput();
  },

  // 获取项目名称
  getProjectName: function (e) {
    this.setData({
      projectName: e.detail.value
    })
  },
  // 查看所需工具
  detail: function(e) {
    console.log(e)
    wx.showModal({
      content: e.currentTarget.dataset.detail,
      showCancel: false,
      success: function(res) {}
    });
  },
  // 查看图片
  previewImage: function(e) {
    console.log(e)
    let src = e.currentTarget.dataset.src;
    let urlarr = [];
    urlarr.push(src)
    console.log(urlarr)
    wx.previewImage({
      current: src,
      urls: urlarr
    })
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
        console.log(that.data.userid);
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
      }
    })
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
          EstateList: res.data.data,
          estatetypeid: res.data.data[0].propertycompanyid
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
  // 获取维修地点
  getPosition: function() {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          name: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
          positionStatus: true
        })
        qqmap.reverseGeocoder({
          location: {
            latitude: that.data.latitude,
            longitude: that.data.longitude
          },
          success: function(res) {
            var ad_info = res.result.ad_info
            console.log(ad_info)
            //获取市和区（区可能为空）
            that.setData({
              city_code: ad_info.city_code
            })
          }
        })
      },
      fail: function(res) {
        console.log(res)
        if (res.errMsg == "chooseLocation:fail auth deny") {
          wx.chooseLocation({
            success: function(res) {
              console.log(res)
              that.setData({
                name: res.name,
                latitude: res.latitude,
                longitude: res.longitude,
                address: res.address
              })
            }
          })
        }
      }
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



  //获取联系人
  getContacts: function(e) {
    this.setData({
      Contacts: e.detail.value
    })
    var p = /[0-9]/;
    var b = p.test(this.data.Contacts);
    if (b) {
      wx.showModal({
        content: "请输入中文联系人",
        showCancel: false,
        success: function(res) {
          return;
        }
      });
    }
  },

  //获取联系电话
  getPhone: function(e) {
    var that = this;
    that.setData({
      phone: e.detail.value
    })
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (that.data.phone == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      that.setData({
        phone: null
      })
    } else if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: "none"
      })
      that.setData({
        phone: null
      })
    }
  },
  //获取抢标截止时间
  binddDateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var time = e.detail.value; //完工时间
    var times = this.data.biddate; //竞标时间
    var jbdate = new Date(Date.parse(time.replace(/-/g, "/")));
    var wgdate = new Date(Date.parse(times.replace(/-/g, "/")));
    if (wgdate <= jbdate) {
      wx.showModal({
        content: "完工日期不能比竞标日期提前",
        showCancel: false,
        success: function(res) {
          return;
        }
      });
    } else {
      this.setData({
        biddate: e.detail.value,
        intext: false
      })
    }
  },
  //获取完工时间
  bindDateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var time = e.detail.value; //完工时间
    console.log(time)
    var times = this.data.biddate; //竞标时间
    var wgdate = new Date(Date.parse(time.replace(/-/g, "/")));
    var jbdate = new Date(Date.parse(times.replace(/-/g, "/")));
    if (wgdate <= jbdate) {
      wx.showModal({
        content: "完工日期不能比竞标日期提前",
        showCancel: false,
        success: function(res) {
          return;
        }
      });
    } else {
      this.setData({
        date: e.detail.value,
        intexts: false
      })
    }
  },
  //维修类型
  bindClass: function(e) {
    var that = this
    that.setData({
      classIndex: e.detail.value,
      classType: that.data.classList[e.detail.value].classType
    })
    console.log(that.data.classType)
    if (that.data.classType != null) {
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
          goodstype: that.data.classType
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
    }
  },
  // 添加附件
  addAcc: function(e) {
    var that = this
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths //图片
        console.log(tempFilePaths[0])
        var url = "https://www.fhmpt.cn/sunweb/upload/uploadImg";
        wx.uploadFile({
          url: url, //接口地址
          filePath: tempFilePaths[0],
          name: 'file', //文件对应的参数名字(key)
          success: function(res) {
            var jsonStr = res.data;
            jsonStr = jsonStr.replace(" ", "");
            if (typeof jsonStr != 'object') {
              jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
              var jj = JSON.parse(jsonStr);
              res.data = jj;
            }
            var imgsrc = res.data.srcImg
            that.setData({
              images: imgsrc,
              addimage: false
            })
            console.log(that.data.images)
            wx.showToast({
              title: "图片上传成功",
              icon: "none"
            })
          }
        })
      },
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
    if (this.data.num == "") {
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
    var list = this.data.list;
    var productList = this.data.productList;
    var projectList = this.data.projectList;
    var index = this.data.index;
    var projectIndex = this.data.projectIndex;
    var orderDetailList = this.data.orderDetailListEntity.orderDetailList;
    var newData = {
      productName: productList[index].projectname,
      projectName: projectList[projectIndex].goodsname,
      projectremark: this.data.projectremark,
      num: this.data.num,
      price: this.data.price,
      allPrice: this.data.allPrice,
      del: "删除"
    }
    var data = {
      id: "",
      goodsName: projectList[projectIndex].goodsname,
      projectid: this.data.projectid,
      goodsid: this.data.goodsid,
      projectName: productList[index].projectname,
      orderdetailnumber: this.data.num,
      interceptmoney: this.data.price,
      orderdetailintercepttotalmoney: this.data.num * this.data.price,
      interceptid: this.data.interceptid
    }
    // 判断是否添加重复项
    var count = that.data.orderDetailListEntity.orderDetailList.length
    var orderDetail = that.data.orderDetailListEntity.orderDetailList
    if (count > 0) {
      for (var i = 0; i < count; i++) {
        if (data.goodsid == orderDetail[i].goodsid && data.projectid == orderDetail[i].projectid) {
          wx.showModal({
            content: "请勿添加重复项",
            showCancel: false,
            success: function(res) {}
          });
          that.setData({
            num: null,
          })
          return
        }
      }
      list.push(newData);
      orderDetailList.push(data);
      that.data.orderDetailListEntity.orderDetailList = orderDetailList;
      that.setData({
        orderDetailListEntity: that.data.orderDetailListEntity,
        list: list,
        num: null,
      })
    } else {
      list.push(newData);
      orderDetailList.push(data);
      that.data.orderDetailListEntity.orderDetailList = orderDetailList;
      that.setData({
        list: list,
        num: null,
      })
    }

    console.log(that.data.list)





  },
  //删除
  deleteBtn: function(e) {
    var list = this.data.list;
    var listIndex = e.currentTarget.dataset.index;
    var orderDetailList = this.data.orderDetailListEntity.orderDetailList;
    list.splice(listIndex, 1);
    orderDetailList.splice(listIndex, 1);
    this.setData({
      list: list
    })
    this.data.orderDetailListEntity.orderDetailList = orderDetailList;
  },
  //提交 上传图片
  submitBtn: function(e) {
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
      // 存储dormid
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
      addclick: true
    })
    setTimeout(function() {
      that.setData({
        addclick: false
      })
    }, 3000)
    that.data.orderTable.version = app.siteinfo.version;
    that.data.orderTable.pagenumber = -1;
    that.data.orderTable.currentuserid = that.data.userid;
    that.data.orderTable.orderprojectname = that.data.projectName;
    that.data.orderTable.kingdeeorderid = that.data.kingdeeorderid
    that.data.orderTable. kingdeeorderfnumber = that.data. kingdeeorderfnumber
    that.data.orderTable.orderprojecttype = that.data.classType;
    that.data.orderTable.orderpropertycompanyid = that.data.estatetypeid;
    that.data.orderTable.orderaddress = that.data.address;
    that.data.orderTable.ordercontactperson = that.data.Contacts
    that.data.orderTable.ordercontactphone = that.data.phone;
    that.data.orderTable.buildingtypeid = that.data.buildingtypeid;
    that.data.orderTable.orderplantime = that.data.date;
    that.data.orderTable.orderbiddingendtime = that.data.biddate;
    that.data.orderTable.orderlatitude = that.data.latitude;
    that.data.orderTable.orderlongitude = that.data.longitude;
    that.data.orderTable.orderremark = that.data.images
    that.data.orderTable.orderposition = that.data.city_code
    var list = that.data.list;
    var sum = 0;
    for (var i = 0; i < list.length; i++) {
      sum = sum + list[i].allPrice;
    }
    that.data.orderTable.orderintercepttotalmoney = sum;
    var list = that.data.list;
    if (that.data.projectName == "") {
      wx.showToast({
        title: '请输入项目名称',
        icon: "none"
      })
      that.setData({
        required: false
      })
      return;
    } else {
      that.setData({
        required: true
      })
    }
    if (that.data.address == "") {
      wx.showToast({
        title: '请输入维修地点',
        icon: "none"
      })
      that.setData({
        required: false
      })
      return;
    } else {
      that.setData({
        required: true
      })
    }
    if (that.data.ArchitectureIndex == 0) {
      wx.showToast({
        title: '请选择建筑类型',
        icon: "none"
      })
      that.setData({
        required: false
      })
      return;
    } else {
      that.setData({
        required: true
      })
    }
    if (that.data.Contacts == "") {
      wx.showToast({
        title: '请输入联系人',
        icon: "none"
      })
      that.setData({
        required: false
      })
      return;
    } else {
      that.setData({
        required: true
      })
    }
    if (that.data.phone == "" || that.data.phone == null) {
      wx.showToast({
        title: '请输入联系电话',
        icon: "none"
      })
      that.setData({
        required: false
      })
      return;
    } else {
      that.setData({
        required: true
      })
    }
    console.log(that.data.orderTable.orderbiddingendtime)
    if (that.data.orderTable.orderbiddingendtime == " ") {
      wx.showToast({
        title: '请输入竞标截止时间',
        icon: "none"
      })
      that.setData({
        required: false
      })
      return;
    } else {
      that.setData({
        required: true
      })
    }
    console.log(that.data.orderTable.orderplantime)
    if (that.data.orderTable.orderplantime == " ") {
      wx.showToast({
        title: '请输入维修时间',
        icon: "none"
      })
      that.setData({
        required: false
      })
      return;
    } else {
      that.setData({
        required: true
      })
    }
    if (that.data.buildingtypeid == 1) {
      wx.showToast({
        title: '请选择建筑类型',
        icon: "none"
      })
      that.setData({
        required: false
      })
      return;
    } else {
      that.setData({
        required: true
      })
    }
    if (list.length < 1) {
      wx.showToast({
        title: '请添加项目清单',
        icon: "none"
      })
      that.setData({
        required: false
      })
      return;
    } else {
      that.setData({
        required: true
      })
    }
    var wgdate = new Date(Date.parse(that.data.orderTable.orderplantime.replace(/-/g, "/")));
    var jbdate = new Date(Date.parse(that.data.orderTable.orderbiddingendtime.replace(/-/g, "/")));
    console.log(wgdate)
    console.log(jbdate)
    if (jbdate >= wgdate) {
      wx.showToast({
        title: '完工日期不能比竞标日期提前',
        icon: "none"
      })
      that.setData({
        required: false
      })
      return;
    } else {
      that.setData({
        required: true
      })
    }
    var required = that.data.required
    console.log(that.data.orderTable)
    console.log(that.data.orderDetailListEntity)
    if (required) {
      app.util.request({
        url: 'operation_order/saveOrder',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          orderTable: JSON.stringify(that.data.orderTable),
          orderDetailListEntity: JSON.stringify(that.data.orderDetailListEntity)
        },
        success: function(res) {
          console.log(res)
          wx.navigateTo({
            url: '../confirmOrder/confirmOrder?orderid=' + res.data.data[0].orderid,
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
      wx.showToast({
        title: '请检查表单是否填写完整',
        icon: "none"
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