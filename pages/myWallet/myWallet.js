// pages/myWallet/myWallet.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:0,
    money:"",
    userid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getStorage({
      key: 'userid',
      success: function (res) {
        that.setData({
          userid: res.data
        })
        //获取余额
        app.util.request({
          url: 'user/selectThreeTablesByUnionData',
          header: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          method: "POST",
          data: {
            version: app.siteinfo.version,
            userid: that.data.userid, //提现人员ID
            pagenumber: -1,
            pagesize: ""
          },
          success: function (res) {
            console.log(res)
            that.setData({
              userrole: res.data.data[0].userrole
            })
            if (res.data.data[0].usermoney==null){
              that.setData({
                money: 0
              })
            }else{
              that.setData({
                money: res.data.data[0].usermoney
              })
            }
          }
        });

        //获取我的钱包金额明细（用户）
        app.util.request({
          url: 'user/wechatSelectCustomerMoneyListByUnionData',
          header: {
            "Content-Type": "application/json;charset=UTF-8"
          },
          method: "POST",
          data: {
            version: app.siteinfo.version,
            userid: that.data.userid, //提现人员ID
            pagenumber: -1,
            pagesize: ""
          },
          success: function (res) {
            console.log(res)

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
      }
    })
    //提现历史
    app.util.request({
      url: 'user_extract_money/selectTwoTablesByUnionData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        userextractmoneyuserid: that.data.userid, //提现人员ID
        pagenumber: -1,
        pagesize: 7
      },
      success: function (res) {
        console.log(res)
        
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

  //事件处理函数
  // 充值
  topForwardBtn:function (e){
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
  wx.redirectTo({
    url: '../charge/index',
  })
  },
  
  //提现
  putForwardBtn:function(e){
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
    wx.navigateTo({
      url: '../putForward/putForward?money='+that.data.money,
    })
  },
  //线下交易记录
  offlinetransaction:function(e){
    console.log(e)
     var role = e.currentTarget.dataset.role;
     var url =""
     if(role =="KH,"){
       url = '../transaction/transaction'
     }else{
       url = '../worktransaction/worktransaction'
     }
    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})