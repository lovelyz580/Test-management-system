// pages/repairCollect/repairCollect.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: '',
    imgsrc: "",
    applycheckmoney: null,
    applycheckremark: "",
    upload_picture_list: [],
    addImgStatus: "block",
    status: "none",
    addImgStatus: "blcok",
    path_server: "",
    userid: "",
    orderTable: {
      version: "",
      orderid: "",
      currentuserid: ""
    },
    applyCheck: {
      orderid: "1",
      applycheckimage: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 获取全部金额
  allmoney: function(e) {
    var that = this
    that.setData({
      amount: that.data.surplusmoney,
      applycheckmoney: that.data.surplusmoney
    })
  },
  // 获取验收金额
  applycheckmoney: function(e) {
    var that = this
    var applycheckmoney = e.detail.value
    var surplusmoney = that.data.surplusmoney
    if (applycheckmoney > surplusmoney || applycheckmoney == null || applycheckmoney < 0) {
      wx.showModal({
        content: "输入的金额有误，请重新输入",
        showCancel: false,
        success: function(res) {
          that.setData({
            amount: null
          })
          return
        }
      });
    } else {
      that.setData({
        applycheckmoney: applycheckmoney
      })
    }
  },
  // 获取验收金额备注
  getOpinion: function(e) {
    this.setData({
      applycheckremark: e.detail.value
    })
  },
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
    this.setData({
      orderid: options.orderid
    })
    app.util.request({
      url: 'order_table/selectThreeTablestByUnionDataAndCheckPrice',
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
          ordercreatetime: array.orderTableAndBuildingType.ordercreatetime,
          orderprojectname: array.orderTableAndBuildingType.orderprojectname,
          orderprojecttype: array.orderTableAndBuildingType.orderprojecttype,
          ordertraveltotalmoney: array.orderTableAndBuildingType.ordertraveltotalmoney,
          buildingtypename: array.orderTableAndBuildingType.buildingtypename,
          ordertotalmoney: array.orderTableAndBuildingType.ordertotalmoney,
          orderpriceservicetotalmoney: array.orderTableAndBuildingType.orderpriceservicetotalmoney,
          orderintercepttotalmoney: array.orderTableAndBuildingType.orderintercepttotalmoney,
          orderList: res.data.data[0].orderDetailList,
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
    // 查询验收金额
    app.util.request({
      url: 'apply_check/selectThreeTablesByUnionDataByTimeDesc',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        orderid: that.data.orderid,
        pagenumber: -1,
        pagesize: ""
      },
      success: function(res) {
        console.log(res)
        if (res.data.count == 0) {
          var servicesurplusmoney = res.data.data[0].servicesurplusmoney
          that.setData({
            surplusmoney: servicesurplusmoney
          })
        } else {
          var applaylist = res.data.data //历史验收金额列表
          var servicesurplusmoney = res.data.data[0].servicesurplusmoney
          that.setData({
            applaylist: applaylist,
            surplusmoney: servicesurplusmoney
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
  //事件处理函数
  // 选择图片
  uploadpic: function(e) {
    var that = this //获取上下文
    var upload_picture_list = that.data.upload_picture_list
    //选择图片
    wx.chooseImage({
      count: 8,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFiles = res.tempFiles
        //把选择的图片 添加到集合里
        for (var i in tempFiles) {
          tempFiles[i]['upload_percent'] = 0
          tempFiles[i]['path_server'] = ''
          upload_picture_list.push(tempFiles[i])
        }
        //显示
        that.setData({
          upload_picture_list: upload_picture_list,
        });
      }
    })
  },
  // 删除图片
  deleteImg: function(e) {
    let upload_picture_list = this.data.upload_picture_list;
    let index = e.currentTarget.dataset.index;
    upload_picture_list.splice(index, 1);
    this.setData({
      upload_picture_list: upload_picture_list
    });
  },
  updateImg: function(e) {
    var page = this
    console.log("获取formid");
    console.log(e.detail.formId);
    var formId = e.detail.formId; //formid 
    if (formId == "the formId is a mock one" || formId == null || formId == undefined) {
      formId = null
    } else {
      page.setData({
        formId: formId
      })
      console.log(page.data.formId)
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
          formid: page.data.formId
        },
        success: function(res) {
          console.log(res)
        }
      });
    }
    var upload_picture_list = page.data.upload_picture_list
    var url = "https://www.fhmpt.cn/sunweb/upload/uploadImg";
    for (var j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {　　　　　　 //调用函数
        //上传返回值
        var that = this;
        const upload_task = wx.uploadFile({
          // 模拟https
          url: url, //需要用HTTPS，同时在微信公众平台后台添加服务器地址  
          filePath: upload_picture_list[j]['path'], //上传的文件本地地址    
          name: 'file',
          formData: {
            'num': j
          },
          //附近数据，这里为路径     
          success: function(res) {
            wx.showToast({
              title: '图片上传成功',
              icon: "none"
            })
            var jsonStr = res.data;
            jsonStr = jsonStr.replace(" ", "");
            if (typeof jsonStr != 'object') {
              jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
              var jj = JSON.parse(jsonStr);
              res.data = jj;
            }
            var imgsrc = page.data.imgsrc
            imgsrc = imgsrc + res.data.srcImg + ",";
            page.setData({
              imgsrc: imgsrc
            })
            var data = res.data;
          },
          fail: function(err) {
            console.log("上传服务器失败")
          } //请求失败
        })

      }
    }

  },
  //申请验收//上传图片
  applyCollect: function(e) {
    // 申请验收
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
        }
      });
    }
    if (that.data.applycheckmoney == null || that.data.applycheckmoney == "" || that.data.applycheckremark == "") {
      wx.showModal({
        content: "请输入验收金额，验收金额备注！",
        showCancel: false,
        success: function(res) {
          return;
        }
      });
      return;
    }
    that.data.orderTable.version = app.siteinfo.version;
    that.data.orderTable.orderid = that.data.orderid;
    that.data.orderTable.currentuserid = that.data.userid;
    that.data.applyCheck.orderid = that.data.orderid;
    that.data.applyCheck.applycheckimage = that.data.imgsrc;
    that.data.applyCheck.applycheckmoney = that.data.applycheckmoney;
    that.data.applyCheck.applycheckremark = that.data.applycheckremark;
    app.util.request({
      url: 'operation_check/saveOrderAndCheck',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        orderTable: JSON.stringify(that.data.orderTable),
        applyCheck: JSON.stringify(that.data.applyCheck)
      },
      success: function(res) {
        console.log(res)
        wx.showModal({
          content: res.data.msg,
          showCancel: false,
          success: function(res) {
            wx.switchTab({
              url: '../personal/personal',
            })
          }
        });
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