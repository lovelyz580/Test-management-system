// page/home/home.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: " ",
    userrole: " ",
    text: "最新公告：目前平台在试运行阶段，发布的信息真实有效，欢迎维修师傅在线竞标，如有问题请联系平台客服：葛辉     电话：18931222014（微信同号）",
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 20, // 时间间隔
    isShow: false,
    onclick: true,
    tabs: [{
        name: "维修工主页"
      },
      {
        name: "安装队主页"
      }
    ],
    jd: 0,
    wd: 0,
    currentTab: 0,
    wd: null,
    jd: null,
    tabText: "派单模式",
    userStatus: "none",
    oneStatus: "none",
    twoStatus: "none",
    ordertype: "QD",
    user: {
      version: app.siteinfo.version,
      pagenumber: -1,
      userid: "",
      userrole: "",

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

  // 展示文字
  showtext:function (e){
    console.log(e)
    wx.showModal({
      content: this.data.text,
      showCancel: false,
      success: function (res) {
      }
    });
  },

  // 搜索
  searchValueInput: function(e) {

    var value = e.detail.value;
    this.setData({
      searchValue: value,
    })
    console.log(value)
  },
  // 请求后台
  suo: function(e) {
    var that = this
    console.log("执行搜索功能")
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
    var that = this;
    console.log(that.data.searchValue)

    // 要按角色搜索
    app.util.request({
      url: 'announcement/selectThreeTablesBySelectData',
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
        currentuserid: that.data.userid,
        orderprojectname: that.data.searchValue
      },
      success: function(res) {
        console.log(res);
        if (res.data.count == 0) {
          wx.showModal({
            content: "暂无查询结果",
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                that.setData({
                  searchValue: ""
                })
              }
            }
          });
        } else {
          that.setData({
            oneArray: res.data.data,
            userArray:res.data.data
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // var role = wx.getStorageSync('userrole')
    // console.log(role)


    wx.getStorage({
      key: 'userrole',
      success: function(res) {
        that.setData({
          userrole: res.data
        })
      }
    })
    this.setData({
      userrole: options.userrole,
    })
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          userid: res.data
        })
        if (options.userrole == "KH,") {
          //用户
          that.setData({
            userStatus: "block"
          })
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
            },
            success: function(res) {
              console.log(res);
              that.setData({
                userArray: res.data.data
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
        } else if (options.userrole == "WX,") {
          wx.getStorage({
            key: 'userservicestate',
            success: function(res) {
              console.log(res)
              that.setData({
                userservicestate: res.data
              })
              if (that.data.userservicestate == null || that.data.userservicestate == "N") {
                wx.showModal({
                  title: '提示',
                  content: '是否接单？',
                  success: function(rel) {
                    if (rel.confirm) {
                      wx.getStorage({
                        key: 'userlongitude',
                        success: function(res) {
                          that.setData({
                            userlongitude: res.data
                          })
                          wx.getStorage({
                            key: 'userlatitude',
                            success: function(res) {
                              that.setData({
                                userlatitude: res.data
                              })
                              that.data.user.userlatitude = that.data.userlatitude;
                              that.data.user.userlongitude = that.data.userlongitude;
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

                          })
                        }
                      })
                    }
                  }

                })
              }
            }
          })

          that.setData({
            oneStatus: "block"
          })
          // console.log(that.data.userid)
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
              that.setData({
                oneArray: res.data.data
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
        } else if (options.userrole == "AZ,") {
          wx.getStorage({
            key: 'userservicestate',
            success: function(res) {
              console.log(res)
              that.setData({
                userservicestate: res.data
              })
              if (that.data.userservicestate == null || that.data.userservicestate == "N") {
                wx.showModal({
                  title: '提示',
                  content: '是否接单？',
                  success: function(rel) {
                    if (rel.confirm) {
                      wx.getStorage({
                        key: 'userlongitude',
                        success: function(res) {
                          that.setData({
                            userlongitude: res.data
                          })
                          wx.getStorage({
                            key: 'userlatitude',
                            success: function(res) {
                              that.setData({
                                userlatitude: res.data
                              })
                              that.data.user.userlatitude = that.data.userlatitude;
                              that.data.user.userlongitude = that.data.userlongitude;
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

                          })
                        }
                      })
                    }
                  }

                })
              }
              console.log(that.data.userid)
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
                  console.log(res);
                  that.setData({
                    oneArray: res.data.data,
                    oneStatus: "block"
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
          })
        } else if (options.userrole == "WX,AZ," || options.userrole == "AZ,WX,") {
          wx.getStorage({
            key: 'userservicestate',
            success: function(res) {
              console.log(res)
              that.setData({
                userservicestate: res.data,
                // oneStatus: "block",
                twoStatus: "block",
              })
              if (that.data.userservicestate == null || that.data.userservicestate == "N") {
                wx.showModal({
                  title: '提示',
                  content: '是否接单？',
                  success: function(rel) {
                    if (rel.confirm) {
                      wx.getStorage({
                        key: 'userlongitude',
                        success: function(res) {
                          that.setData({
                            userlongitude: res.data
                          })
                          wx.getStorage({
                            key: 'userlatitude',
                            success: function(res) {
                              that.setData({
                                userlatitude: res.data
                              })
                              that.data.user.userlatitude = that.data.userlatitude;
                              that.data.user.userlongitude = that.data.userlongitude;
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
                                      if (res.confirm) {}
                                    }
                                  });
                                }
                              });
                            }

                          })
                        }
                      })
                    }
                  }
                })
              }
              console.log(that.data.userid)
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
                  currentuserid: that.data.userid
                },
                success: function(res) {
                  console.log(res);
                  that.setData({
                    wxArray: res.data.data
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
          })
        }
      }
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          //计算相关宽度
          sliderWidth: res.windowWidth / that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          contentHeight: res.windowHeight - res.windowWidth / 750 * 68 //计算内容区高度，rpx -> px计算
        });
      }
    });

  },

  //事件处理函数

  bindChange: function(e) {
    var current = e.detail.current;
    this.setData({
      activeIndex: current,
      sliderOffset: this.data.sliderWidth * current
    });
    console.log("bindChange:" + current);
  },
  navTabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    console.log("navTabClick:" + e.currentTarget.id);
  },
  //滑动切换
  swiperTab: function(e) {
    console.log(e)
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  onItemClick: function(event) {
    console.log(event)
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    var t = e.target.dataset.current
    console.log(t)
    if (this.data.currentTab == 1) {
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
          currentuserid: that.data.userid
        },
        success: function(res) {
          console.log(res);
          that.setData({
            wxArray: res.data.data
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
      that.setData({
        currentTab: e.target.dataset.current
      })
    } else if (this.data.currentTab == 0) {
      var t = e.target.dataset.current
      console.log(t)
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
          console.log(res);
          that.setData({
            wxArray: res.data.data
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
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  //我要报修
  myRepair: function(e) {
    var that = this
    // 这里是获取fromid
    var formId = e.detail.formId; //formid 
    if (formId == "the formId is a mock one" || formId == null || formId == undefined) {
      formId = null
    } else {
      this.setData({
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
    // 把fromid发送后台

    this.setData({
      onclick: true
    })
    wx.navigateTo({
      url: '../publishRepair/publishRepair',
    })
    var that = this
    setTimeout(function() {
      that.setData({
        onclick: false
      })
    }, 4000)
  },
  //首页列表详情
  userListDetail: function(e) {
    wx.navigateTo({
      url: '../taskDetails/taskDetails?orderid=' + e.currentTarget.dataset.id + "&userrole=" + this.data.userrole + "&ordertype=" + e.currentTarget.dataset.ordertype,
    })
  },
  //模式
  patternTab: function(e) {
    var that = this;
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
    console.log(this.data.ordertype)
    if (this.data.ordertype == "QD") {
      console.log("派单")
      app.util.request({
        url: 'task/selectThreeTablesByUnionData',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          pagenumber: -1,
          pagesize: "",
          orderprojecttype: "WX",
          ordertype: "PD",
          // currentuserid: that.data.userid
        },
        success: function(res) {
          console.log(res);
          that.setData({
            oneArray: res.data.data,
            wxArray:res.data.data,
            ordertype: "PD",
            tabText: "竞标模式"
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
    } else {
      console.log("竞标")
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
          that.setData({
            oneArray: res.data.data,
            wxArray: res.data.data,
            ordertype: "QD",
            tabText: "派单模式"
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

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  scrolltxt: function () {
    var that = this;
    var length = that.data.length;//滚动文字的宽度
    var windowWidth = that.data.windowWidth;//屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
        var crentleft = that.data.marqueeDistance;
        if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
          that.setData({
            marqueeDistance: crentleft + that.data.marqueePace
          })
        }
        else {
          //console.log("替换");
          that.setData({
            marqueeDistance: 0 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
    }
    else {
      that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // // 页面显示

    var that = this;
    var length = that.data.text.length * that.data.size;//文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    // that.scrolltxt();// 第一个字消失后立即从右边出现
    that.setData({
      onclick: false
    })
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
      },
      success: function(res) {
        console.log(res);
        that.setData({
          userArray: res.data.data
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
  onPullDownRefresh: function() {

    var that = this;
    wx.getStorage({
      key: 'userrole',
      success: function(res) {
        that.setData({
          userrole: res.data
        })
      }
    })
    wx.getStorage({
      key: 'userid',
      success: function(res) {
        that.setData({
          userid: res.data
        })
        if (that.data.userrole == "KH,") {
          //用户
          that.setData({
            userStatus: "block"
          })
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
            },
            success: function(res) {
              console.log(res);
              that.setData({
                userArray: res.data.data
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
        } else if (that.data.userrole == "WX,") {
          wx.getStorage({
            key: 'userservicestate',
            success: function(res) {
              console.log(res)
              that.setData({
                userservicestate: res.data
              })
              if (that.data.userservicestate == null || that.data.userservicestate == "N") {
                wx.showModal({
                  title: '提示',
                  content: '是否接单？',
                  success: function(rel) {
                    if (rel.confirm) {
                      wx.getStorage({
                        key: 'userlongitude',
                        success: function(res) {
                          that.setData({
                            userlongitude: res.data
                          })
                          wx.getStorage({
                            key: 'userlatitude',
                            success: function(res) {
                              that.setData({
                                userlatitude: res.data
                              })
                              that.data.user.userlatitude = that.data.userlatitude;
                              that.data.user.userlongitude = that.data.userlongitude;
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

                          })
                        }
                      })
                    }
                  }

                })
              }
            }
          })

          that.setData({
            oneStatus: "block"
          })
          // console.log(that.data.userid)
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
              that.setData({
                oneArray: res.data.data
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
        } else if (that.data.userrole == "AZ,") {
          wx.getStorage({
            key: 'userservicestate',
            success: function(res) {
              console.log(res)
              that.setData({
                userservicestate: res.data
              })
              if (that.data.userservicestate == null || that.data.userservicestate == "N") {
                wx.showModal({
                  title: '提示',
                  content: '是否接单？',
                  success: function(rel) {
                    if (rel.confirm) {
                      wx.getStorage({
                        key: 'userlongitude',
                        success: function(res) {
                          that.setData({
                            userlongitude: res.data
                          })
                          wx.getStorage({
                            key: 'userlatitude',
                            success: function(res) {
                              that.setData({
                                userlatitude: res.data
                              })
                              that.data.user.userlatitude = that.data.userlatitude;
                              that.data.user.userlongitude = that.data.userlongitude;
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

                          })
                        }
                      })
                    }
                  }

                })
              }
              console.log(that.data.userid)
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
                  console.log(res);
                  that.setData({
                    oneArray: res.data.data,
                    oneStatus: "block"
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
          })
        } else if (that.data.userrole == "WX,AZ," || that.data.userrole == "AZ,WX,") {
          wx.getStorage({
            key: 'userservicestate',
            success: function(res) {
              console.log(res)
              that.setData({
                userservicestate: res.data,
                oneStatus: "block",
                twoStatus: "block",
              })
              if (that.data.userservicestate == null || that.data.userservicestate == "N") {
                wx.showModal({
                  title: '提示',
                  content: '是否接单？',
                  success: function(rel) {
                    if (rel.confirm) {
                      wx.getStorage({
                        key: 'userlongitude',
                        success: function(res) {
                          that.setData({
                            userlongitude: res.data
                          })
                          wx.getStorage({
                            key: 'userlatitude',
                            success: function(res) {
                              that.setData({
                                userlatitude: res.data
                              })
                              that.data.user.userlatitude = that.data.userlatitude;
                              that.data.user.userlongitude = that.data.userlongitude;
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
                                      if (res.confirm) {}
                                    }
                                  });
                                }
                              });
                            }

                          })
                        }
                      })
                    }
                  }
                })
              }
              console.log(that.data.userid)
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
                  currentuserid: that.data.userid
                },
                success: function(res) {
                  console.log(res);
                  that.setData({
                    wxArray: res.data.data
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
          })
        }
      }
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          //计算相关宽度
          sliderWidth: res.windowWidth / that.data.tabs.length,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          contentHeight: res.windowHeight - res.windowWidth / 750 * 68 //计算内容区高度，rpx -> px计算
        });
      }
    });


    wx.stopPullDownRefresh();
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
      return {
        title: '首页',
        desc: '最具人气的小程序开发联盟!',
        path: 'pages/home/home'
      }
  
  }
})