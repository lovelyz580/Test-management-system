// pages/workhome/workhome.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mode: "scaleToFill",
    text: "最新公告：目前平台在试运行阶段，发布的信息真实有效，欢迎维修师傅在线竞标，如有问题请联系平台客服：葛辉     电话：18931222014（微信同号）",
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marquee_margin: 30,
    size: 14,
    textinterval: 20, // 时间间隔
    isShow: false,
    onclick: true,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    pagenumber: 2
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
        pagenumber: 1,
        pagesize: "10",
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
        pagenumber: 1,
        pagesize: "10",
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
    var type = options.type
    that.setData({
      type: type
    })
    var userrole = wx.getStorageSync("userrole")
    that.setData({
      userrole: userrole
    })
    if (that.data.type == "WX") {
      // 请求维修任务列表
      app.util.request({
        url: 'announcement/selectThreeTablesByUnionData',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          pagenumber: 1,
          pagesize: "10",
          orderprojecttype: "WX",
          ordertype: "QD",
          currentuserid: that.data.userid
        },
        success: function(res) {
          console.log(res);
          that.setData({
            WXorderlist: res.data.data,
            status: 0
          })
        },
        fail: function() {
          wx.showModal({
            content: "发送请求失败",
            showCancel: false,
            success: function(res) {}
          });
        }
      });
    } else if (that.data.type == "AZ") {
      // 查询安装
      app.util.request({
        url: 'announcement/selectThreeTablesByUnionData',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          pagenumber: 1,
          pagesize: "10",
          orderprojecttype: "AZ",
          currentuserid: that.data.userid
        },
        success: function(res) {
          console.log(res);
          that.setData({
            AZorderlist: res.data.data,
            status: 1
          })
        },
        fail: function() {
          wx.showModal({
            content: "发送请求失败",
            showCancel: false,
            success: function(res) {

            }
          })
        }
      });
    }
  },
  // 图片详情信息
  detail: function(e) {
    console.log(e)
    var imagesid = e.currentTarget.dataset.id
    console.log(imagesid)
    wx.navigateTo({
      url: '../advertising/advertising?imagesid=' + imagesid,
      success: function(res) {}
    })


  },
  // 项目详情
  orderdetail: function(e) {
    var that = this
    console.log(e)
    var orderprojecttype = e.currentTarget.dataset.orderprojecttype
    console.log(orderprojecttype)

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
  // 加载更多
  workmoreInfo: function() {
    var that = this
    if (that.data.type == "WX") {
      // 请求维修任务列表
      app.util.request({
        url: 'announcement/selectThreeTablesByUnionData',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          pagenumber: that.data.pagenumber,
          pagesize: "10",
          orderprojecttype: "WX",
          ordertype: "QD",
          currentuserid: that.data.userid
        },
        success: function(res) {
          if (res.data.data.length == 0) {
            wx.showModal({
              content: "已加载全部内容",
              showCancel: false,
              success: function(res) {
                return;
              }
            })
          } else {
            that.setData({
              pagenumber: that.data.pagenumber + 1
            })
            var list = that.data.WXorderlist
            var lists = [...list, ...res.data.data]
            that.setData({
              WXorderlist: lists,
              status: 0
            })
          }
        },
        fail: function() {
          wx.showModal({
            content: "发送请求失败",
            showCancel: false,
            success: function(res) {}
          });
        }
      });
    } else if (that.data.type == "AZ") {
      // 查询安装
      app.util.request({
        url: 'announcement/selectThreeTablesByUnionData',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          pagenumber: that.data.pagenumber,
          pagesize: "10",
          orderprojecttype: "AZ",
          currentuserid: that.data.userid
        },
        success: function(res) {
          if (res.data.data.length == 0) {
            wx.showModal({
              content: "已加载全部内容",
              showCancel: false,
              success: function(res) {
                return;
              }
            })
          } else {


            that.setData({
              pagenumber: that.data.pagenumber + 1
            })
            var list = that.data.AZorderlist
            var lists = [...list, ...res.data.data]
            that.setData({
              AZorderlist: lists,
              status: 1
            })
          }
        },
        fail: function() {
          wx.showModal({
            content: "发送请求失败",
            showCancel: false,
            success: function(res) {

            }
          })
        }
      });
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // 下拉刷新
  onReachBottom: function(e) {
    var that = this;
    this.workmoreInfo()

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },


})