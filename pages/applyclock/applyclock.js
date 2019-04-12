// pages/applyclock/applyclock.js
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
    orderTable: {
      version: app.siteinfo.version,
      pagenumber: -1
    }
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
      // orderid: options.orderid
      orderid: "D20181128090719405705"
    })
    app.util.request({
      url: 'order_table/selectThreeTablestByUnionData',
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
        })

        // 待确认得维修人
        //查询抢标人信息
        if (that.data.orderstate == "PDQR") {
          app.util.request({
            url: 'distributeConfirm/selectByDistributeConfirm',
            header: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            data: {
              version: app.siteinfo.version,
              pagenumber: -1,
              pagesize: "",
              orderid: that.data.orderid
            },
            success: function(res) {
              var userserver = res.data.data[0].distributeconfirmserviceuserid
              //查询维修人员详情信息
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
                  userid: userserver
                },
                success: function(res) {
                  console.log(res);
                  // console.log(res.data.data[0].userrealname);
                  that.setData({
                    userrealname: res.data.data[0].userrealname,
                    userphone: res.data.data[0].userphone,
                    usercredit: res.data.data[0].usercredit,
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
        // 查询维修人员
        if (that.data.orderserviceuserid != null) {
          //查询维修人员详情信息
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
              userid: that.data.orderserviceuserid
            },
            success: function(res) {
              console.log(res);
              // console.log(res.data.data[0].userrealname);
              that.setData({
                userrealname: res.data.data[0].userrealname,
                userphone: res.data.data[0].userphone,
                usercredit: res.data.data[0].usercredit,
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
          //查询抢标人信息
          app.util.request({
            url: 'snatch/selectThreeTablesBySnatchPeople',
            header: {
              "Content-Type": "application/json;charset=UTF-8"
            },
            method: "POST",
            data: {
              version: app.siteinfo.version,
              pagenumber: -1,
              pagesize: "",
              orderid: that.data.orderid
            },
            success: function(res) {
              console.log(res);
              // console.log(res.data.data[0].userrealname);
              that.setData({
                userlist: res.data.data
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
        if (that.data.orderstate == "DDJS") {
          console.log(that.data.userrole)
          if (that.data.userrole == "KH,") {
            app.util.request({
              url: "evaluate_customer/selectThreeTablesByUnionData",
              header: {
                "Content-Type": "application/json;charset=UTF-8"
              },
              method: "POST",
              data: {
                version: app.siteinfo.version,
                pagenumber: -1,
                pagesize: "",
                orderid: that.data.orderid
              },
              success: function(res) {
                console.log(res);
                that.setData({
                  evaluateserviceopinion: res.data.data[0].evaluatecustomeropinion,
                  evaluateservicesetupname: res.data.data[0].evaluatecustomersetupname,
                  evaluatecustomeropinion: res.data.data[0].evaluatecustomeropinion,

                  evaluateservicesetupscore: res.data.data[0].evaluatecustomersetupscore
                })
                var listone = []
                var listtwo = []

                listone = that.data.evaluateservicesetupname.split(",");
                listtwo = that.data.evaluateservicesetupscore.split(","); //字符分割 
                var lists = []
                for (var i = 0; i < listone.length - 1; i++) {
                  lists.push({
                    "name": "",
                    "score": null
                  })
                }
                for (var i = 0; i < listone.length - 1; i++) {
                  lists[i].name = listone[i]
                  lists[i].score = Number(listtwo[i])
                }
                that.setData({
                  lists: lists
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
            app.util.request({
              url: "evaluate_service/selectThreeTablesByUnionData",
              header: {
                "Content-Type": "application/json;charset=UTF-8"
              },
              method: "POST",
              data: {
                version: app.siteinfo.version,
                pagenumber: -1,
                pagesize: "",
                orderid: that.data.orderid
              },
              success: function(res) {
                console.log(res);
                that.setData({
                  evaluateserviceopinion: res.data.data[0].evaluateserviceopinion,
                  evaluateservicesetupname: res.data.data[0].evaluateservicesetupname,
                  evaluateservicesetupscore: res.data.data[0].evaluateservicesetupscore
                })
                var listone = []
                var listtwo = []
                listone = that.data.evaluateservicesetupname.split(",");
                listtwo = that.data.evaluateservicesetupscore.split(","); //字符分割 
                var lists = []
                for (var i = 0; i < listone.length - 1; i++) {
                  lists.push({
                    "name": "",
                    "score": null
                  })
                }
                console.log(lists)
                for (var i = 0; i < listone.length - 1; i++) {
                  lists[i].name = listone[i]
                  lists[i].score = Number(listtwo[i])
                }
                console.log(lists)
                that.setData({
                  lists: lists
                })
                console.log(that.data.lists)
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
        }
        //查询维修人员详情信息
      }
    });
  },
  //事件处理函数
  // 打开地图
  chooseLocation: function(e) {
    var that = this
    console.log(that.data.orderlongitude)
    console.log(that.data.orderlatitude)
    wx.openLocation({
      longitude: that.data.orderlongitude,
      latitude: that.data.orderlatitude
    })
  },
  // 点击打卡
  signClick: function() {
    var that = this     //第1步:创建动画实例
    var animation = wx.createAnimation({
      duration: 1000, //动画时长   
      timingFunction: "ease", //线性 
      delay: 0  //0则不延迟 
    })     //第2步:将创建的动画实例赋值给当前的动画
    this.animation = animation;     //第3步:执行动画，Z轴旋转360度
    animation.opacity(1).rotateZ(360).step();     //第4步:导出动画对象赋值给数据对象
    this.setData({
      animationData: animation.export(),
    })     //设置指定时间后进行页面跳转
    setTimeout(function() {
      var animation = wx.createAnimation({
        duration: 10,
        timingFunction: "ease", //线性 
        delay: 0, //0则不延迟 
      })
      this.animation = animation;     //重置动画为原始状态,将原始状态赋值给数据对象进行
      animation.opacity(1).rotateZ(0).step();
      this.setData({
        animationData: animation.export(),
      })
    }.bind(this), 800)
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