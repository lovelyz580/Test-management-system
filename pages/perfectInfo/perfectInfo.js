// pages/perfectInfo/perfectInfo.js
var app = getApp();
var checkValue = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ImgSrc: "../../images/select.png",
    ImgUrl: "../../images/unselect.png",
    array: [],
    goods:[],
    selectgoods:[],
    // cityArray: ['美国', '中国', '巴西', '日本'],
    // areaArray: ['美国', '中国', '巴西', '日本'],
    cartArr: [{
        name: "KH",
        value: '用户',
        status: false
      },
      {
        name: "WX",
        value: '维修师傅',
        status: false
      },
      {
        name: "AZ",
        value: '安装队',
        status: false
      },
    ],
    singleScaleArray: [],
    userCustomer: {
      usercustomercity: ""
    },
    accredit: true,
    provinceIndex: 0,
    code: null,
    singleScaleIndex: 0,
    // cityIndex:0,
    // areaIndex:0,
    status: "block",
    name: "", //姓名
    man: "Y", //男
    women: "X", //女
    sex: "Y", //选中的性别
    phone: "", //联系电话
    emil: "", //邮箱
    idNumber: "", //身份证号
    userservicerole: "",
    userService: {
      areaid: "1",
      scaleid: "1",
      userservicerole: "",
      goodid:"",
      userservicestate: "Y"
    },
    areaid: "1",
    scaleid: "1",
    userrole: "",
    useropenid: '',
    idCardType: "",
    user: {
      version: "",
      pagenumber: "",
      userrealname: "",
      usersex: "",
      userphone: "",
      useremail: "",
      usercodeid: "",
      userrole: "",
      userid: "",
      useropenid: ""
    }
  },
  // 跳转接单区域页面
  takearea:function (){
    wx.navigateTo({
      url: '../city/city',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //获取姓名
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
        userid: wx.getStorageSync("userid")
      },
      success: function (res) {
        console.log(res)
        that.setData({
          userrealname: res.data.data[0].userrealname,
          phone: res.data.data[0].userphone

        })
      }
    });


    //获取接单项目类别
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
      },
      success: function (res) {
        console.log(res)
        var array = res.data.data
        array = array.splice(1,array.length-1);
        that.setData({
          goods: array
        })
      }
    });


    //获取接单规模
    app.util.request({
      url: 'scale/selectByScale',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: ""
      },
      success: function(res) {
        console.log(res)
        that.setData({
          singleScaleArray: res.data.data
        })
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

  // 授权登录
  login: function(e) {
    var that = this;
    wx.login({
      success: function(r) {
        var code = r.code;
        that.setData({
          code: code
        })
        if (code) {
          //2、调用获取用户信息接口
          wx.getUserInfo({
            success: function(res) {
              //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
              app.util.request({
                url: 'wechat/getOpenId',
                method: 'post',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  code: that.data.code
                },
                success: function(data) {
                  console.log(data);
                  that.setData({
                    useropenid: data.data.msg,
                    accredit: !that.data.accredit

                  })
                  wx.setStorage({
                    key: "useropenid",
                    data: data.data.msg
                  })
                },
                fail: function() {
                  console.log('系统错误')
                  wx.showModal({
                    content: '授权失败,必须授权微信帐号，否则无法使用小程序',
                    showCancel: false,
                    success: function(res) {
                      if (res.confirm) {
                        // console.log('确定')
                      }
                    }
                  });
                }
              })
            },
            fail: function() {
              console.log('获取用户信息失败')

              wx.showModal({
                content: '授权失败,必须授权微信帐号，否则无法使用小程序',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {
                    // console.log('确定')
                  }
                }
              });

            }
          })

        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
          wx.showModal({
            content: '授权失败,必须授权微信帐号，否则无法使用小程序',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                // console.log('确定')
              }
            }
          });
        }
      },
      fail: function() {
        console.log('登陆失败')
        wx.showModal({
          content: '授权失败,必须授权微信帐号，否则无法使用小程序',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              // console.log('确定')
            }
          }
        });
      }
    })
  },

  //选择性别
  selectSex: function(e) {

    this.setData({
      sex: e.currentTarget.dataset.status
    })
    console.log(this.data.sex)
    if (e.currentTarget.dataset.status == "Y") {
      this.setData({
        ImgSrc: "../../images/select.png",
        ImgUrl: "../../images/unselect.png"
      })
    } else {
      this.setData({
        ImgSrc: "../../images/unselect.png",
        ImgUrl: "../../images/select.png"
      })
    }
  },
  //获取联系电话
  getPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  //获取邮箱
  getEmil: function(e) {
    this.setData({
      emil: e.detail.value
    })
  },

  //获取身份证号
  getIdNumber: function(e) {
    this.setData({
      idNumber: e.detail.value
    })
  },



  //接单规模
  bindSingleScaleChange: function(e) {
    var arraySingle = this.data.singleScaleArray;
    this.setData({
      singleScaleIndex: e.detail.value,
      scaleid: arraySingle[e.detail.value].scaleid
    })
    this.data.userService.scaleid = arraySingle[e.detail.value].scaleid
  },

  //选择身份类别
  checkboxChange: function(e) {
    var that = this;
    console.log(e)
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var array = e.detail.value;
    var cartArr = this.data.cartArr;
    if (e.detail.value == "KH" && array.length == 1) {
      cartArr[1].status = true;
      cartArr[2].status = true
      this.setData({
        status: "none"
      })
      this.data.userrole = e.detail.value.join(",") + ",";
      this.data.idCardType = e.detail.value;

      this.data.userService.scaleid = "";

      console.log(this.data.userrole)
      console.log(this.data.userService.userservicerole)
    } else {
      this.setData({
        status: "block"
      })
      cartArr[1].status = false;
      cartArr[2].status = false;
      console.log(this.data.userrole)
    }
    if (e.detail.value == "WX" || e.detail.value == "AZ" || array.length == 2) {
      cartArr[0].status = true;
      this.setData({
        status: "block"
      })
      this.data.userService.scaleid = this.data.scaleid;
      this.data.userservicerole = e.detail.value.join(",");
      this.data.userrole = e.detail.value.join(",") + ",";
      this.data.idCardType = e.detail.value;
      this.data.userCustomer = null;
      console.log(this.data.userrole)

      var goodstype = ""
      if (array.length == 1){
        goodstype = e.detail.value.join(",");
      }
      //获取接单项目类别
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
          goodstype: goodstype,
        },
        success: function (res) {
          console.log(res)
          var arrayData = res.data.data
          if (e.detail.value == "WX" || array.length == 2 ){
            arrayData = arrayData.splice(1, arrayData.length - 1);
          }
          that.setData({
            goods: arrayData
          })
        }
      });
    } else {
      cartArr[0].status = false;
      this.data.userCustomer = this.data.userCustomer;

      //获取接单项目类别
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
        },
        success: function (res) {
          console.log(res)
          var array = res.data.data
          array = array.splice(1, array.length - 1);
          that.setData({
            goods: array
          })
        }
      });
    }
    this.setData({
      cartArr: cartArr
    })
  },

  //提交按钮
  submitBtn: function() {
    this.data.user.version = app.siteinfo.version;
    this.data.user.pagenumber = -1;
    this.data.user.userrealname = this.data.userrealname
    this.data.user.usersex = this.data.sex
    this.data.user.userid= wx.getStorageSync("userid")
    this.data.user.userphone = this.data.phone
    this.data.user.useremail = this.data.emil
    this.data.user.usercodeid = this.data.idNumber
    this.data.user.userrole = this.data.userrole
    console.log(this.data.useropenid)
    this.data.user.useropenid = this.data.useropenid
    this.data.userService.userservicerole = this.data.userservicerole

    var goodid="";
    for (var i = 0; i < checkValue.length; i++){
      goodid = goodid + checkValue[i] + ",";
    }
    this.data.userService.goodid = goodid
    console.log(this.data.user)
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var validateEmil = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    var validateIdNumber = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (this.data.idCardType.length < 1) {
      wx.showToast({
        title: '请选择身份类别',
        icon: "none"
      })
      return;
    }
    var that = this;
    // console.log(that.data.accredit)
    if (!that.data.accredit) {
      app.util.request({
        url: 'user/updateTwoTablesByPerfect',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          user: JSON.stringify(that.data.user),
          userService: JSON.stringify(that.data.userService),
          userCustomer: JSON.stringify(that.data.userCustomer)
        },
        success: function(res) {
          console.log(res)
          wx.redirectTo({
            url: '../login/login',
          })
        }
      });
    } else {
      wx.showModal({
        content: '必须授权微信帐号，否则无法使用小程序',
        showCancel: false,
        success: function(res) {
          return;
        }
      });

    }


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // // 选择区域
  // itemSelected: function (e) {
  //   var index = e.currentTarget.dataset.index;
  //   console.log(index)
  //   var item = this.data.goods[index];
  //   item.isSelected = !item.isSelected;
  //   var selectgoods= [];
  //   if(item.isSelected){
  //     selectgoods[index] = item;
  //   }
  //   this.setData({
  //     goods: this.data.goods,
  //   });
  //   this.setData({
  //     selectgoods: selectgoods,
  //   });
  // },
  checkboxGoodsChange: function (e) {

    checkValue = e.detail.value;

    //this.data.userservice.goodid = this.data.userservice.goodid + e.detail.value.join(",");

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