// pages/register/register.js
//获取应用实例
const app = getApp()
Page({
  data: {
    src: "../../images/close.png",
    status: 0,
    agreement: false,
    typeStatus: "number",
    phone: "",
    userinvitationuserid: null,
    password: "",
    passwordtype: true,
    userlatitude: '',
    userlongitude: '',
    disabled: false,
    time: "获取验证码",
    phoneStatus: false,
    currentTime: 60,
    code: "",
    againPassword: ""
  },
  onLoad: function(options) {
    console.log(options)
    var scene = options.userid //推广人  id
    if (scene == 'undefined') {
      scene = null
    } else {
      scene = scene
    }
    // console.log(scene)
    this.data.userinvitationuserid = scene
  },

  //事件处理函数
  // 协议
  agreen: function() {
    this.setData({
      agreement: !this.data.agreement
    })
    console.log(this.data.agreement)
  },
  //协议条款
  agreement: function e() {
    var that = this
    wx.showModal({
      content: "条款内容",
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          that.setData({
            agreement: true
          })

        }
      }
    });
  },
  //密码显示 隐藏
  eyes: function() {
    console.log(this.data.spreaduserid)
    if (this.data.status == 0) {
      this.setData({
        status: 1,
        src: "../../images/open.png",
        passwordtype: !this.data.passwordtype
      })
    } else {
      this.setData({
        status: 0,
        src: "../../images/close.png",
        passwordtype: !this.data.passwordtype
      })
    }
  },

  //获取手机号
  getPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 获取手机号失去焦点的时候
  outPhone: function(e) {
    var that = this;
    var phone = e.detail.value;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (phone == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
    } else if (!myreg.test(phone)) {
      wx.showToast({
        title: '请输入有效手机号',
        icon: "none"
      })
    } else {
      app.util.request({
        url: 'user/verificationPhone',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          userphone: phone,
        },
        success: function(res) {
          console.log(res)
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function(res) {

            }
          });
          if (res.data.msg != null) {
            that.setData({
              phone: ""
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
    }
  },

  //获取验证码
  getCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 去登录
  gologin: function(e) {
    wx.redirectTo({
      url: '../login/login'
    })
  },

  //获取密码
  getPassword: function(e) {
    this.setData({
      password: e.detail.value
    })
  },

  //获取第二次密码
  getAgainPassword: function(e) {
    this.setData({
      againPassword: e.detail.value
    })
  },

  //获取验证码按钮
  codeBtn: function(e) {
    var that = this
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (that.data.phone == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
    } else if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '请输入有效手机号',
        icon: "none"
      })
    } else {
      app.util.request({
        url: 'user/verificationCode',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          userphone: that.data.phone,
        },
        success: function(res) {
          console.log(res)
        }
      });
      var currentTime = that.data.currentTime;
      wx.setStorage({
        key: "mobile",
        data: that.data.mobile
      })
      that.setData({
        time: currentTime + '秒',
        disabled: true,
        phoneStatus: true,
      })

      var interval = setInterval(function() {

        that.setData({

          time: (currentTime - 1) +
            '秒'

        })
        if (currentTime <= 0) {

          clearInterval(interval)

          that.setData({
            time: '重新获取',
            currentTime: 60,
            disabled: false,
            phoneStatus: false
          })
        } else {
          currentTime--;
        }
      }, 1000)
    }
  },

  //下一步
  login: function(e) {
    console.log(e)
    console.log("下一步")
    var that = this
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(19[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (that.data.phone == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      return;
    } else if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '请输入正确手机号',
        icon: "none"
      })
      return;
    }
    if (that.data.code == "") {
      wx.showToast({
        title: '请输入验证码',
        icon: "none"
      })
      return;
    }
    if (that.data.name == "") {
      wx.showToast({
        title: '请输入姓名',
        icon: "none"
      })
      return;
    }
    if (that.data.password == "") {
      wx.showToast({
        title: '请输入密码',
        icon: "none"
      })
      return;
    } else if (that.data.password.length < 6) {
      wx.showToast({
        title: '密码最小长度为6',
        icon: "none"
      })
      return;
    }
    if (that.data.againPassword == "") {
      wx.showToast({
        title: '请再次输入密码',
        icon: "none"
      })
      return;
    } else if (that.data.password != that.data.againPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: "none"
      })
      return;
    }
    // 获取经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
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
    // 写入数据库
    if (that.data.agreement) {
      console.log("请求服务器")
      app.util.request({
        url: 'user/register',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          userphone: that.data.phone,
          userpassword: that.data.againPassword,
          userrealname: that.data.name,
          userlatitude: that.data.userlatitude,
          userlongitude: that.data.userlongitude,
          usersms: that.data.code,
          userinvitationuserid: that.data.userinvitationuserid
        },
        success: function(res) {
          if (res.data.count == 1) {
            wx.setStorage({
              key: "userid",
              data: res.data.data[0].userid
            })
            wx.showModal({
              content: "注册成功，点击确认完善信息",
              showCancel: false,
              success: function(res) {
                wx.redirectTo({
                  url: '../perfectInfo/perfectInfo'
                })
              }
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none"
            })
            return;
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
    } else {
      wx.showModal({
        content: "请同意服务条款",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            return;
          }
        }
      });
    }
  }
})