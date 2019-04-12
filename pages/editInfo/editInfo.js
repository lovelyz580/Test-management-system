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
    goods: [],
    goodid: "",
    selectgoods: [],
    cartArr: [{
        name: "WX",
      value: '我是维修师傅',
        status: false
      },
      {
        name: "AZ",
        value: '我有安装队伍',
        status: false
      },
    ],
    singleScaleArray: [],
    userCustomer: {
      usercustomercity: "",
      userid: ""
    },
    selectStatus: "none",
    roleStatus: "block",
    provinceIndex: 0,
    singleScaleIndex: 0,
    status: "block",
    name: "", //姓名
    useraccount:null,//银行卡号
    useraccountaddress:null,//开户行
    man: "Y", //男
    women: "X", //女
    sex: "Y", //选中的性别
    phone: "", //联系电话
    areName: "",
    userroleText: "",
    emil: "", //邮箱
    idNumber: "", //身份证号
    iftrue: null,
    userService: {
      areaid: "1",
      scaleid: "1",
      goodid: "",
      userid: ""
    },
    areaid: "",
    userrole: "",
    useropenid: "",
    idCardType: "",
    user: {
      version: "",
      pagenumber: "",
      userrealname: "",
      usersex: "",
      useraccount:"",
      useraccountaddress:"",
      userphone: "",
      useremail: "",
      usercodeid: "",
      userrole: "",
      useropenid: "",
      userid: ""
    }
  },
  // 跳转接单区域页面
  takearea: function() {
    wx.navigateTo({
      url: '../city/city?areacode=' + this.data.areacode,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.data.user.userid = options.userid
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          userid: res.data
        })
        that.data.user.userid = res.data;
        that.data.userService.userid = res.data;
        that.data.userCustomer.userid = res.data;
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
              sex: obj.usersex,
              idNumber: obj.usercodeid,
              emil: obj.useremail,
              userrole: obj.userrole,
              idCardType: obj.userrole,
              useropenid: obj.useropenid,
              goodid: obj.goodid,
              areacode: obj.areacode,
              useraccount: obj.useraccount,
              useraccountaddress: obj.useraccountaddress

            })
            that.data.userService.scaleid = obj.scaleid;
            // console.log(that.data.userrole);
            //获取接单区域
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
              },
              success: function(res) {

                console.log(res)
                var array = res.data.data;
                for (var i = 0; i < array.length; i++) {
                  array[i].areaid = array[i].areaid
                  if (array[i].areaid == obj.areaid) {
                    that.setData({
                      provinceIndex: i
                    })
                  }
                }
                that.setData({
                  array: array
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
                pagesize: "",
              },
              success: function(res) {
                console.log(res)
                var array = res.data.data

                for (var i = 0; i < array.length; i++) {

                  if (array[i].scaleid == obj.scaleid) {
                    that.setData({
                      singleScaleIndex: i
                    })
                  }
                }
                that.setData({
                  singleScaleArray: array
                })
              }
            });
            var goodstype = "";
            if (that.data.userrole == "WX,") {
              goodstype = "WX";
            } else if (that.data.userrole == "AZ,") {
              goodstype = "AZ";
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
              success: function(res) {
                console.log(res)
                var array = res.data.data
                if (goodstype = "WX") {
                  array = array.splice(1, array.length - 1);
                }
                var goodsids = that.data.goodid;
                if (goodsids != null || goodsids != "") {
                  var goodsidList = goodsids.split(",");
                  for (var i = 0; i < array.length; i++) {
                    for (var j = 0; j < goodsidList.length; j++) {
                      if (goodsidList[j] == array[i].goodsid) {
                        array[i].checked = true;
                      }
                    }
                  }
                }
                that.setData({
                  goods: array
                })
              }
            });
            if (obj.usersex == "Y") {
              that.setData({
                ImgSrc: "../../images/select.png",
                ImgUrl: "../../images/unselect.png",
              })
            } else {
              that.setData({
                ImgUrl: "../../images/select.png",
                ImgSrc: "../../images/unselect.png",
              })
            }
            var cartArr = that.data.cartArr;
            if (obj.userrole == "WX,") {
              that.setData({
                userroleText: "维修师傅"
              })
            } else if (obj.userrole == "KH,") {
              that.setData({
                userroleText: "客户"
              })
            } else if (obj.userrole == "AZ,") {
              that.setData({
                userroleText: "安装队"
              })
            } else if (obj.userrole == "WX,AZ,") {
              that.setData({
                userroleText: "维修师傅,安装队"
              })
            }
            that.setData({
              cartArr: cartArr
            })
            if (that.data.userrole == "KH,") {
              that.setData({
                iftrue: false
              })
            } else {
              that.setData({
                iftrue: true
              })
            }
            // console.log(that.data.iftrue);

          }

        });
        // console.log(that.data.iftrue)
      }

    })



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
          console.log(code)
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
  //获取姓名
  getName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 获取银行卡号
  getCard:function (e){
    this.setData({
      useraccount: e.detail.value
    })
  },
  getCardname:function (e){
    this.setData({
      useraccountaddress: e.detail.value
    })
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
    })
    this.data.userService.scaleid = arraySingle[e.detail.value].scaleid
    console.log(this.data.userService.scaleid)
  },

  //选择身份类别
  cardName: function() {
    if (this.data.userrole != "KH,") {
      this.setData({
        roleStatus: "none",
        selectStatus: "block"
      })
    }
  },
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
        status: "none",
      })
      this.data.userrole = e.detail.value.join(",") + ",";
      this.data.idCardType = e.detail.value;

      this.data.userService.scaleid = "";
      console.log(this.data.userrole)
    }
    if (e.detail.value == "WX" || e.detail.value == "AZ" || array.length == 2) {
      cartArr[0].status = true;
      this.setData({
        status: "block"
      })
      this.data.userrole = e.detail.value.join(",") + ",";
      this.data.idCardType = e.detail.value;
      this.data.userCustomer = null;
      console.log(this.data.userrole)

      var goodstype = ""
      if (array.length == 1) {
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
        success: function(res) {
          console.log(res)
          var arrayData = res.data.data
          if (e.detail.value == "WX" || array.length == 2) {
            arrayData = arrayData.splice(1, arrayData.length - 1);
          }
          var goodsids = that.data.goodid;
          if (goodsids != null || goodsids != "") {
            var goodsidList = goodsids.split(",");
            for (var i = 0; i < arrayData.length; i++) {
              for (var j = 0; j < goodsidList.length; j++) {
                if (goodsidList[j] == arrayData[i].goodsid) {
                  arrayData[i].checked = true;
                }
              }
            }
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
        success: function(res) {
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
  // 选择接单区域
  city: function e() {
    wx.redirectTo({
      url: '../city/city',
    })

  },
  //提交按钮
  submitBtn: function(e) {
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
        success: function (res) {
          console.log(res)
        }
      });

    }
    that.data.user.version = app.siteinfo.version;
    that.data.user.pagenumber = -1;
    that.data.user.userrealname = that.data.name
    that.data.user.usersex = that.data.sex
    that.data.user.userphone = that.data.phone
    that.data.user.useremail = that.data.emil
    that.data.user.usercodeid = that.data.idNumber
    that.data.user.userrole = that.data.userrole
    that.data.user.useropenid = that.data.useropenid
    that.data.user.useraccount = that.data.useraccount
    that.data.user.useraccountaddress = that.data.useraccountaddress
    that.data.userService.goodid = that.data.goodid
    var goodid = "";
    for (var i = 0; i < checkValue.length; i++) {
      goodid = goodid + checkValue[i] + ",";
    }
    that.data.userService.goodid = goodid
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var validateEmil = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    var validateIdNumber = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (that.data.name == "") {
      wx.showToast({
        title: '请输入真实姓名',
        icon: "none"
      })
      return;
    }
    var reg = /^\d{19}$/g; // 以19位數字開頭，以19位數字結尾 
    if (that.data.useraccount.length != 16 && this.data.useraccount != ""){
    if (!reg.test(that.data.useraccount) ) {
      wx.showToast({
        title: '请输入正确的银行卡号',
        icon: "none"
      })
      return;
    }
    }
    var reg = /^\d{16}$/g; // 以19位數字開頭，以19位數字結尾 
    if (that.data.useraccount.length != 19 && this.data.useraccount != "") {
      if (!reg.test(that.data.useraccount)) {
        wx.showToast({
          title: '请输入正确的银行卡号',
          icon: "none"
        })
        return;
      }
    }
    if (that.data.useraccountaddress != "" || that.data.useraccount != "") {
      var reg = /^[\u2E80-\u9FFF]+$/;
      if (!reg.test(this.data.useraccountaddress)) {
        wx.showToast({
          title: '请输入中文的开户行名称',
          icon: "none"
        })
        return;
      }
    }
    if (that.data.idCardType.length < 1) {
      wx.showToast({
        title: '请选择身份类别',
        icon: "none"
      })
      return;
    }
  
    app.util.request({
      url: 'user/updateTwoTables',
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
        if (res.data.count == 1) {
          wx.showToast({
            title: "提交成功,请重新登录",
            icon: "none"
          })
          var setInterval = setTimeout(function() {
            wx.reLaunch({
              url: "../login/login"
            })
          }, 1000)
        } else {
          wx.showModal({
            content: res.data.msg,
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
  checkboxGoodsChange: function(e) {
    checkValue = e.detail.value;
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