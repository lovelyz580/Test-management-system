//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    src: "../../images/close.png",
    status: 0,
    onclick: true,
    typeStatus: "block",
    textStatus: "none",
    phone: "",
    password: "",
    userStatus: "none",
    btnStatus: "block"
  },
  onLoad: function() {
    var that = this
    // 获取位置信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权<!--<!--dssasss，否则无法获取您所需数据',
            success: function (res) {
              if (res.cancel) {
                that.setData({
                  isshowCIty: false
                })
                wx.showToast({
                  title: '授权失败',
                  icon: 'success',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用getLocationt的API
                      wx.getLocation({
                        type: 'wgs84',
                        success: function (res) {
                          console.log(res)
                          that.setData({
                            userlatitude: res.latitude,
                            userlongitude: res.longitude
                          })
                          wx.setStorage({
                            key: "userlatitude",
                            data: that.data.userlatitude
                          })
                          wx.setStorage({
                            key: "userlongitude",
                            data: that.data.userlongitude
                          })
                        }
                      })

                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              console.log(res)
              that.setData({
                userlatitude: res.latitude,
                userlongitude: res.longitude
              })
              wx.setStorage({
                key: "userlatitude",
                data: that.data.userlatitude
              })
              wx.setStorage({
                key: "userlongitude",
                data: that.data.userlongitude
              })
            }
          })

        }
        else { //授权后默认加载

          wx.getLocation({
            type: 'wgs84',
            success: function (res) {
              console.log(res)
              var userlatitude = res.latitude
              var userlongitude = res.longitude
              that.setData({
                userlatitude: userlatitude,
                userlongitude: userlongitude
              })
              wx.setStorage({
                key: "userlatitude",
                data: that.data.userlatitude
              })
              wx.setStorage({
                key: "userlongitude",
                data: that.data.userlongitude
              })
            }
          })
        }
      }
    })
  // 获取位置信息
    var expiration = wx.getStorageSync("index_data_expiration"); //拿到过期时间
    var timestamp = Date.parse(new Date()); //拿到现在时间
    //进行时间比较
    if (expiration > timestamp) {    //缓存未过期
      var phone = wx.getStorageSync("phone");
      var password = wx.getStorageSync("password");
      that.setData({
        Storagrphone: phone,
        Storagrpassword: password
      })
      app.util.request({
        url: 'user/login',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          userphone: that.data.Storagrphone,
          userpassword: that.data.Storagrpassword
        },
        success: function(res) {
          if (res.data.count == 1) {
            if (res.data.data[0].userstate == "PZ" || res.data.data[0].userstate == "JF" || res.data.data[0].userstate == "TJ" || res.data.data[0].userstate == "BJ") {
              if (res.data.data[0].useropenid == "" || res.data.data[0].useropenid == null) {
                wx.setStorage({
                  key: "userid",
                  data: res.data.data[0].userid
                })
                wx.showModal({
                  title: '提示',
                  content: '未同意微信授权，请去编辑个人信息页面 点击微信授权',
                  success: function(rel) {
                    res.data.data[0].userid
                    if (rel.confirm) {
                      wx.navigateTo({
                        url: '../editInfo/editInfo?userid=' + res.data.data[0].userid
                      })
                    } else if (rel.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
              // 获取位置信息
              wx.getSetting({
                success: (res) => {
                  if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
                    wx.showModal({
                      title: '是否授权当前位置',
                      content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
                      success: function (res) {
                        if (res.cancel) {
                          that.setData({
                            isshowCIty: false
                          })
                          wx.showToast({
                            title: '授权失败',
                            icon: 'success',
                            duration: 1000
                          })
                        } else if (res.confirm) {
                          wx.openSetting({
                            success: function (dataAu) {
                              if (dataAu.authSetting["scope.userLocation"] == true) {
                                wx.showToast({
                                  title: '授权成功',
                                  icon: 'success',
                                  duration: 1000
                                })
                                //再次授权，调用getLocationt的API
                                wx.getLocation({
                                  type: 'wgs84',
                                  success: function (res) {
                                    console.log(res)
                                    that.setData({
                                      userlatitude: res.latitude,
                                        userlongitude: res.longitude
                                    })
                                    wx.setStorage({
                                      key: "userlatitude",
                                      data: that.data.userlatitude
                                    })
                                    wx.setStorage({
                                      key: "userlongitude",
                                      data: that.data.userlongitude
                                    })
                                  }
                                })

                              } else {
                                wx.showToast({
                                  title: '授权失败',
                                  icon: 'success',
                                  duration: 1000
                                })
                              }
                            }
                          })
                        }
                      }
                    })
                  } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
                    wx.getLocation({
                      type: 'wgs84',
                      success: function (res) {
                        console.log(res)
                        that.setData({
                          userlatitude: res.latitude,
                            userlongitude: res.longitude
                        })
                        wx.setStorage({
                          key: "userlatitude",
                          data: that.data.userlatitude
                        })
                        wx.setStorage({
                          key: "userlongitude",
                          data: that.data.userlongitude
                        })
                      }
                    })
                    
                  }
                  else { //授权后默认加载
                    wx.getLocation({
                      type: 'wgs84',
                      success: function (res) {
                        console.log(res)
                        var userlatitude = res.latitude
                        var userlongitude = res.longitude
                        that.setData({
                          userlatitude: userlatitude,
                          userlongitude: userlongitude
                        })
                        wx.setStorage({
                          key: "userlatitude",
                          data: that.data.userlatitude
                        })
                        wx.setStorage({
                          key: "userlongitude",
                          data: that.data.userlongitude
                        })
                      }
                    })
                  }
                }
              })
  // 获取位置信息
              wx.setStorage({
                key: 'phone',
                data: res.data.data[0].userphone,
              })
              wx.setStorage({
                key: 'password',
                data: res.data.data[0].userpassword,
              })

              wx.setStorage({
                key: "userid",
                data: res.data.data[0].userid
              })
              wx.setStorage({
                key: "userrole",
                data: res.data.data[0].userrole
              })
              wx.setStorage({
                key: "userservicestate",
                data: res.data.data[0].userservicestate
              })
              wx.reLaunch({
                url: '../workhome/workhome?userrole=' + res.data.data[0].userrole,
              })
            } else if (res.data.data[0].userstate == "FJ") {
              wx.showToast({
                title: '当前为封禁状态，不能登录',
                icon: "none"
              })
            }
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
    }else{
      wx.clearStorage();
    }
},

//事件处理函数

//密码显示 隐藏
eyes: function(e) {
    if (e.currentTarget.dataset.status == 0) {
      this.setData({
        status: 1,
        src: "../../images/open.png",
        typeStatus: "none",
        textStatus: "block"
      })
      console.log(this.data.status)
    } else {
      this.setData({
        status: 0,
        src: "../../images/close.png",
        typeStatus: "block",
        textStatus: "none"
      })
      console.log(this.data.status)
    }
  },

  //获取手机号
  getPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  //获取密码
  getPassword: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  //登录
  login: function(e) {
    // 将formid存入数据库
    var formId = e.detail.formId; //formid 
    if (formId == "the formId is a mock one" || formId == null || formId == undefined) {
      formId = null
    } else {
      this.setData({
        formId: formId
      })
      console.log(this.data.formId)
    }
    this.setData({
      onclick: true
    })
    var that = this
    setTimeout(function() {
      that.setData({
        onclick: false
      })
    }, 3000)
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    var that = this;
    if (this.data.phone == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      return;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: "none"
      })
      return;
    }
    if (this.data.password == "") {
      wx.showToast({
        title: '请输入密码',
        icon: "none"
      })
      return;
    }

    app.util.request({
      url: 'user/login',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        userphone: this.data.phone,
        userpassword: this.data.password
      },
      success: function(res) {
        console.log(res)

        if (res.data.count == 0) {
          wx.showToast({
            title: res.data.msg + "或者账号密码错误",
            icon: "none"
          })
          return;
        }
        if (res.data.data[0].userrole == null) {
          wx.setStorage({
            key: "userid",
            data: res.data.data[0].userid
          })
          wx.showModal({
            title: '提示',
            content: '请完善个人信息',
            success: function(rel) {
              if (rel.confirm) {
                wx.redirectTo({
                  url: '../perfectInfo/perfectInfo'
                })
              } else if (rel.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {
          if (res.data.count == 1) {
            if (res.data.data[0].userstate == "PZ" || res.data.data[0].userstate == "JF" || res.data.data[0].userstate == "TJ" || res.data.data[0].userstate == "BJ") {
              if (res.data.data[0].useropenid == "" || res.data.data[0].useropenid == null) {
                wx.setStorage({
                  key: "userid",
                  data: res.data.data[0].userid
                })
                wx.showModal({
                  title: '提示',
                  content: '未同意微信授权，请去编辑个人信息页面 点击微信授权',
                  success: function(rel) {
                    res.data.data[0].userid
                    if (rel.confirm) {
                      wx.navigateTo({
                        url: '../editInfo/editInfo?userid=' + res.data.data[0].userid
                      })
                    } else if (rel.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
              wx.setStorage({
                key: 'phone',
                data: res.data.data[0].userphone,
              })
              var timestamp = Date.parse(new Date());
              var expiration = timestamp + 432000; //432000秒（5天）
              wx.setStorageSync("index_data_expiration", expiration);
              wx.setStorage({
                key: 'password',
                data: res.data.data[0].userpassword,
              })
              that.setData({
                userid: res.data.data[0].userid
              })
              wx.setStorage({
                key: "userid",
                data: res.data.data[0].userid
              })
              wx.setStorage({
                key: "userrole",
                data: res.data.data[0].userrole
              })
              wx.setStorage({
                key: "userservicestate",
                data: res.data.data[0].userservicestate
              })
              wx.reLaunch({
                url: '../workhome/workhome?userrole=' + res.data.data[0].userrole,
              })
            } else if (res.data.data[0].userstate == "FJ") {
              wx.showToast({
                title: '当前为封禁状态，不能登录',
                icon: "none"
              })
            }
            // 将formid  传向后台


            var userid = that.data.userid
            console.log(userid)
            console.log(formId)
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

          }
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


    this.setData({
      onclick: false
    })

  },
  //注册
  toRegister: function() {
    wx.navigateTo({
      url: '../register/register',
    })
  },
  // 忘记密码
  forgetpassword:function(){
    wx.navigateTo({
      url: '../forgetpassword/forgetpassword',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      onclick: false
    })
  },
})