// pages/workhome/workhome.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mode: "scaleToFill",
    text: "最新公告：目前平台在试运行阶段，发布的信息真实有效，欢迎维修师傅在线竞标，如有问题请联系平台客服：葛辉：18931222014（微信同号）",
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marquee_margin: 30,
    size: 14,
    textinterval: 20, // 时间间隔
    isShow: false,
    onclick: true,
    imageslist: null,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    WXorderlist: [
      "1"
    ],
    status: null, //安装1  维修0
    AZorderlist: ["1"],
    user: {
      userid: "",
      userrole: "",
      userlatitude: null,
      userlongitude: null

    },
    userService: {
      userservicestate: ""
    },
    orderTable: {
      orderprojecttype: "",
      buildingtypeid: "",
      orderid: "",
      currentuserid: "",
      userrole: ""
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 请求系统公告
    app.util.request({
      url: 'news/selectByNews',
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
        that.setData({
          text: res.data.data[0].newscontent
        })

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
    // 请求轮播图
    app.util.request({
      url: 'image/selectByImage',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        imagestate: "Y",
        imagetype: "SYTP"
      },
      success: function(res) {
        console.log(res)
        var list = [];
        var url = 'https://www.fhmpt.cn';
        var length = res.data.data.length;
        if (length >= 3) {
          length = 3;
        } else {
          length = length;
        }
        for (var i = 0; i < length; i++) {
          list.push(res.data.data[i])
        }
        that.setData({
          imageslist: list,
          url: url
        })
        console.log(that.data.imageslist)
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
    // 查询项目列表信息
    app.util.request({
      url: 'announcement/selectThreeTablesByUnionData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        // orderprojecttype: "AZ",
        currentuserid: that.data.userid
      },
      success: function (res) {
        console.log(res);
        var list = [];
        for (var i = 0; i < 5; i++) {
          list.push(res.data.data[i])
        } 
        that.setData({
          orderlist: list,
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
    // 判断用户身份
    var userrole = wx.getStorageSync("userrole")
    console.log(userrole);
    var userid = wx.getStorageSync("userid")
    that.setData({
      userrole: userrole,
      userid: userid
    })
    if (userrole == "KH,") {
      console.log("我是客户")
      that.setData({
        showsataic: "KH" //客户 
      })
    } else if(userrole==""){
 console.log("我是游客")
      that.setData({
        showsataic: "YK" //游客
      })
    }else{
      console.log("我是维修工")
      //维修工显示页面
      that.setData({
        showsataic: "WX" //维修
      })
      var userservicestate = wx.getStorageSync("userservicestate")
      that.setData({
        userservicestate: userservicestate
      })
      if (that.data.userservicestate == null || that.data.userservicestate == "N") {
        wx.showModal({
          title: '提示',
          content: '是否接单？',
          success: function(rel) {
            if (rel.confirm) {
              var userlongitude = wx.getStorageSync("userlongitude")
              var userlatitude = wx.getStorageSync("userlatitude")
              that.data.user.userlatitude = userlatitude;
              that.data.user.userlongitude = userlongitude;
              that.data.user.userid = that.data.userid;
              that.data.userService.userservicestate = "Y";
              that.data.user.userrole = that.data.userrole;
              app.util.request({
                url: 'user/updateTwoTables',
                header: {
                  "Content-Type": "application/json;charset=UTF-8"
                },
                method: "POST",
                data: {
                  user: JSON.stringify(that.data.user),
                  userService: JSON.stringify(that.data.userService)
                },
                success: function(res) {
                  console.log(res);
                  wx.setStorage({
                    key: "userservicestate",
                    data: res.data.data[0].userservicestate
                  })
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
          }
        })
      }
      // 请求维修任务列表   // 查询数据
      app.util.request({
        url: 'announcement/selectThreeTablesByUnionData',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          pagenumber: -1,
          pagesize: "",
          orderprojecttype: "WX",
          ordertype: "QD",
          currentuserid: that.data.userid
        },
        success: function(res) {
          console.log(res);
          var list = [];
          for (var i = 0; i < 3; i++) {
            list.push(res.data.data[i])
          }
          that.setData({
            WXorderlist: list
          })
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
      // 请求安装任务列表  // 查询数据
      app.util.request({
        url: 'announcement/selectThreeTablesByUnionData',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          pagenumber: -1,
          pagesize: "",
          orderprojecttype: "AZ",
          currentuserid: that.data.userid
        },
        success: function(res) {
          console.log("安装");
          console.log(res);
          var list = [];
          for (var i = 0; i < 3; i++) {
            list.push(res.data.data[i])
          }
          that.setData({
            AZorderlist: list
          })
          console.log(that.data.AZorderlist);
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
      // 请求分享列表   // 查询数据
      app.util.request({
        url: 'shareVideo/selectByShareVideo',
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
          var list = [];
          var t = res.data.data.length
          if (t >= 3) {
            t = 3
          } else {
            t = res.data.data.length
          }
          for (var i = 0; i < t; i++) {
            list.push(res.data.data[i])
          }
          that.setData({
            experiencelist: list
          })
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
  // 图片详情信息
  detail: function(e) {
    console.log(e)
    var imagesid = e.currentTarget.dataset.id
    var detail = e.currentTarget.dataset.detail
    console.log(imagesid)
    wx.navigateTo({
      url: '../advertising/advertising?imagesid=' + imagesid + "&detail=" + detail,
   
    })


  },
  // 展示文字
  showtext: function(e) {
    console.log(e)
    wx.showModal({
      content: this.data.text,
      showCancel: false,
      success: function(res) {}
    });
  },
  // 项目详情
  orderdetails: function (e) {
    console.log(e)
    var userrole = wx.getStorageSync("userrole")
    if (userrole == "" || userrole == null) {
      wx.navigateTo({
        url: '../taskDetails/taskDetails?orderid=' + e.currentTarget.dataset.orderid + "&userrole=" + "YH," + "&ordertype=" + e.currentTarget.dataset.ordertype,
      })
    } else {
      wx.navigateTo({
        url: '../taskDetails/taskDetails?orderid=' + e.currentTarget.dataset.orderid + "&userrole=" + userrole + "&ordertype=" + e.currentTarget.dataset.ordertype,
      })
    }

  },
  // 项目处理信息更多
  moreorder: function (e) {
    var userrole = wx.getStorageSync("userrole")
    if (userrole == "" || userrole == null) {
      wx.showModal({
        content: "您未登陆，请先登陆在进行操作",
        showCancel: false,
        success: function (res) {
          wx.navigateTo({
            url: '../login/login',
            success: function (res) { }
          })
        }
      });
    } else {
      wx.navigateTo({
        url: '../workmore/workmore',
        success: function (res) { }
      })
    }
  },
  // 维修项目更多
  moreorderwx: function(e) {
    wx.navigateTo({
      url: '../workmore/workmore?type=' + "WX",
    })
  },
  // 安装项目更多
  moreorderaz: function(e) {
    wx.navigateTo({
      url: '../workmore/workmore?type=' + "AZ",
    })
  },
  // 经验分享更多
  moreexperience: function(e) {
    wx.navigateTo({
      url: '../experiencemore/experiencemore',
    })
  },
  // 经验分享
  // 跳转视频播放页面
  videoplay: function(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../videoplay/videoplay?id=' + id
    })
  },
  // 客户操作区域
  // 找维修
  findwx: function(e) {
    var userrole = wx.getStorageSync("userrole")
    if (userrole == "" || userrole == null) {
      wx.showModal({
        content: "您未登陆，请先登陆在进行操作",
        showCancel: false,
        success: function(res) {
          wx.navigateTo({
            url: '../login/login',
            success: function(res) {}
          })
        }
      });
    } else if (userrole == "KH,") {
      wx.navigateTo({
        url: '../publishRepair/publishRepair',
        success: function(res) {}
      })
    }
  },
  // 找安装
  findaz: function(e) {
    var userrole = wx.getStorageSync("userrole")
    if (userrole == "" || userrole == null) {
      wx.showModal({
        content: "您未登陆，请先登陆在进行操作",
        showCancel: false,
        success: function(res) {
          wx.navigateTo({
            url: '../login/login',
            success: function(res) {}
          })
        }
      });
    } else if (userrole == "KH,") {
      wx.navigateTo({
        url: '../publishRepair/publishRepair',
        success: function(res) {}
      })
    }
  },
  // 买产品
  findjcp: function(e) {
    wx.showModal({
      content: "系统正在升级，该功能暂不能使用，为您带来的不便还请谅解！",
      showCancel: false,
      success: function(res) {
        return;
      }
    });
  },
  // 其他服务
  findzx: function(e) {
    wx.navigateTo({
      url: '../servicenews/servicenews',
      success: function(res) {}
    })
  },
  // 招募合伙人
  partnernews: function(e) {
    wx.navigateTo({
      url: '../partnernews/partnernews',
    })
    // wx.showModal({
    //   content: "系统正在升级，该功能暂不能使用，为您带来的不便还请谅解！",
    //   showCancel: false,
    //   success: function(res) {
    //     return;
    //   }
    // });
  },
  // 卖产品
  findccp: function(e) {
    wx.showModal({
      content: "系统正在升级，该功能暂不能使用，为您带来的不便还请谅解！",
      showCancel: false,
      success: function(res) {
        return;
      }
    });
  },
  // 更多维修师傅
  morerepairmenwx: function(e) {
    // 跳转到 维修师傅页面
    wx.navigateTo({
      url: '../repairman/repairman?type=WX',
      success: function(res) {}
    })
  },
  // 更多安装师傅
  morerepairmenaz: function(e) {
    // 跳转到 维修师傅页面
    wx.navigateTo({
      url: '../repairman/repairman?type=AZ',
      success: function(res) {}
    })
  },
  // 客户操作区域
  // 项目详情
  orderdetail: function(e) {
    var that = this
    console.log(e)
    var orderprojecttype = e.currentTarget.dataset.orderprojecttype
    if (orderprojecttype == "WX") {
      // 跳转到维修的详情页taskwxDetails
      wx.navigateTo({
        url: '../taskwxDetails/taskwxDetails?orderid=' + e.currentTarget.dataset.id + "&userrole=" + that.data.userrole + "&ordertype=" + e.currentTarget.dataset.ordertype,
      })
    } else {
      // 跳转到安装的详情页
      wx.navigateTo({
        url: '../taskDetails/taskDetails?orderid=' + e.currentTarget.dataset.id + "&userrole=" + that.data.userrole + "&ordertype=" + e.currentTarget.dataset.ordertype,
      })
    }
  },
  // 公告滚动条
  scrolltxt: function() {
    var that = this;
    var length = that.data.length; //滚动文字的宽度
    var windowWidth = that.data.windowWidth; //屏幕宽度
    if (length > windowWidth) {
      var textinterval = setInterval(function() {
        var maxscrollwidth = length + that.data.marquee_margin; //滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) { //判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        } else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(textinterval);
          that.scrolltxt();
        }
      }, that.data.textinterval);
    } else {
      that.setData({
        marquee_margin: "1000"
      }); //只显示一条不滚动右边间距加大，防止重复显示
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
    console.log("页面显示")
    this.onLoad();
    // 公告滚动条
    var that = this;
    var length = that.data.text.length * that.data.size; //文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    // that.scrolltxt();// 第一个字消失后立即从右边出现
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
    this.onLoad();

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },


})