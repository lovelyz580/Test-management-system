// pages/repairman/repairman.js

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
    interval: 20, // 时间间隔
    isShow: false,
    onclick: true,
    pagenumber: 2,
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    repairmanlist: [
      "1"
    ],
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
          list.push(url + res.data.data[i].imageurl)
        }
        that.setData({
          imageslist: list
        })
        // console.log(that.data.imageslist)
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
    if (type == "WX") {
      app.util.request({
        url: 'user/selectThreeTablesByUnionDataOrderBySort',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          pagenumber: 1,
          pagesize: 10,
          userrole: "WX"
        },
        success: function(res) {
          console.log(res)
          that.setData({
            repairmanlists: res.data.data
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
      app.util.request({
        url: 'user/selectThreeTablesByUnionDataOrderBySort',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          version: app.siteinfo.version,
          pagenumber: 1,
          pagesize: 10,
          userrole: "AZ"
        },
        success: function(res) {
          console.log(res)
          that.setData({
            repairmanlists: res.data.data
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
  // 加载更多
  getMoreInfo: function(e) {
    var that = this
    app.util.request({
      url: 'user/selectThreeTablesByUnionDataOrderBySort',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: that.data.pagenumber,
        pagesize: "10",
        userrole: that.data.type
      },
      success: function(res) {
        console.log(res)
        if (res.data.data.length == 0) {
          wx.showModal({
            content: "已加载全部内容",
            showCancel: false,
            success: function(res) {
              if (res.confirm) {}
            }
          });
        } else {
          that.setData({
            pagenumber: that.data.pagenumber + 1
          })
          var list = that.data.repairmanlists
          var lists = [...list, ...res.data.data]
          that.setData({
            repairmanlists: lists
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
  scrolltxt: function() {
    var that = this;
    var length = that.data.length; //滚动文字的宽度
    var windowWidth = that.data.windowWidth; //屏幕宽度
    if (length > windowWidth) {
      var interval = setInterval(function() {
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
          clearInterval(interval);
          that.scrolltxt();
        }
      }, that.data.interval);
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
    var that = this;
    that.setData({
      pagenumber: 1
    })
    var length = that.data.text.length * that.data.size; //文字长度
    var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    //console.log(length,windowWidth);
    that.setData({
      length: length,
      windowWidth: windowWidth
    });
    // that.scrolltxt();// 第一个字消失后立即从右边出现
    that.setData({
      onclick: false
    })
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
  onReachBottom: function(e) {
    this.getMoreInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },


})