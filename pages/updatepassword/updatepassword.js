// pages/perfectInfo/perfectInfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ImgSrc: "../../images/select.png",
    ImgUrl: "../../images/unselect.png",
    src: "../../images/close.png",
    passwordtypesrc: "../../images/close.png",
    againpasswordsrc: "../../images/close.png",
    status: 0,
    passwordtypestatus: 0,
    againpasswordstatus: 0,
    typeStatus: "number",
    password: "",
    againPassword: "",
    passwordtype: true,
    userpasswordtype: true,
    againpasswordtype: true,
    selectStatus: "none",
    roleStatus: "block",
    provinceIndex: 0,
    singleScaleIndex: 0,
    userpassword: "",
    iftrue: null,
    userid: "",
    userrole: "",
    useropenid: "",
    idCardType: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.data.userid = options.userid
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          userid: res.data
        })
        that.data.userid = res.data;
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
              olduserpassword: obj.userpassword,
            })
          }
        });
      }
    })
  },
  //密码显示 隐藏
  eyes: function() {
    if (this.data.status == 0) {
      // console.log("111")
      this.setData({
        tatus: 1,
        src: "../../images/open.png",
        userpasswordtype: !this.data.userpasswordtype
      })
    } else {
      this.setData({
        status: 0,
        src: "../../images/close.png",
        userpasswordtype: !this.data.userpasswordtype
      })
    }
  },
  //修改密码显示 隐藏
  passwordtypeeyes: function() {
    if (this.data.passwordtypestatus == 0) {
      this.setData({
        passwordtypestatus: 1,
        src: "../../images/open.png",
        passwordtype: !this.data.passwordtype
      })
    } else {
      this.setData({
        passwordtypestatus: 0,
        src: "../../images/close.png",
        passwordtype: !this.data.passwordtype
      })
    }
  },
  //确认密码显示 隐藏
  againpasswordeyes: function() {
    if (this.data.againpasswordstatus == 0) {
      this.setData({
        againpasswordstatus: 1,
        src: "../../images/open.png",
        againpasswordtype: !this.data.againpasswordtype
      })
    } else {
      this.setData({
        againpasswordstatus: 0,
        src: "../../images/close.png",
        againpasswordtype: !this.data.againpasswordtype
      })
    }
  },
  //获取密码
  getuserpassword: function(e) {
    var that = this
    // console.log(that.data.olduserpassword)
    var olduserpassword = that.data.olduserpassword
    var userpassword = e.detail.value
    this.setData({
      userpassword: e.detail.value
    })
    if (olduserpassword != userpassword) {
      wx.showModal({
        content: "输入的原密码不正确，请重新输入",
        showCancel: false,
        success: function(res) {
          that.setData({
            oldstatic: false,
            userpassword:""
          })
        }
      });
    } else {
      wx.showModal({
        content: "原密码输入正确,请继续操作",
        showCancel: false,
        success: function (res) {
          that.setData({
            oldstatic: true
          })
        }
      });
    }
  },

  //获取修改密码
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
    if (that.data.password.length < 6) {
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
    that.data.version = app.siteinfo.version;
    that.data.pagenumber = -1;
    that.data.userpassword = that.data.userpassword
    if (that.data.oldstatic) {
      app.util.request({
        url: 'user/updateByUser',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          userpassword: that.data.againPassword,
          userid: that.data.userid,
        },
        success: function(res) {
          console.log(res)
          if (res.data.count == 1) {
            wx.showToast({
              title: "修改成功,请重新登录",
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
    } else {
      wx.showModal({
        content: "输入的原密码不正确，请重新输入",
        showCancel: false,
        success: function(res) {

        }
      });
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