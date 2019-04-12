const app = getApp()
var checkedId = [];
Page({

  data: {
    userService: {
      areacode: "",
    },
    user: {
      userid: ""
    },
    areacitycode: []
  },

  // 选择区域
  itemSelected: function(e) {
    //总地区
    var list = this.data.citys;
    //当前选中的所有复选框值
    var pagelist = e.detail.value;
    for (var a = 0; a < list.length; a++) {
      //先是新增复选  当前选择循环>已选择省份循环
      for (var b = 0; b < pagelist.length; b++) {
        if (list[a].areaprovincecode == pagelist[b]) {
          if (checkedId.length == 0) {
            checkedId.push(pagelist[b]);
            if (list[a].areaCityList != null) {
              for (var h = 0; h < list[a].areaCityList.length; h++) {
                this.setData({
                  ["citys[" + a + "].checked"]: true,
                  ["citys[" + a + "].areaCityList[" + h + "].checked"]: true
                })
              }
            }
          } else {
            var xz = true;
            for (var z = 0; z < checkedId.length; z++) {
              if (pagelist[b] == checkedId[z]) {
                xz = false;
              }
            }
            if (xz) {
              checkedId.push(pagelist[b]);
              if (list[a].areaCityList != null) {
                for (var h = 0; h < list[a].areaCityList.length; h++) {
                  this.setData({
                    ["citys[" + a + "].checked"]: true,
                    ["citys[" + a + "].areaCityList[" + h + "].checked"]: true
                  })
                }
              }
            }
          }
        }
      }
      //后是删除省复选  已选择省份循环>当前选择省份循环
      for (var c = 0; c < checkedId.length; c++) {
        if (checkedId.length != 0) {
          var qx = true;
          for (var i = 0; i < pagelist.length; i++) {
            if (checkedId[c] == pagelist[i]) {
              qx = false;
            }
          }
          if (qx) {
            if (checkedId[c] == list[a].areaprovincecode) {
              checkedId.splice(c, 1);
              if (list[a].areaCityList != null) {
                for (var h = 0; h < list[a].areaCityList.length; h++) {
                  this.setData({
                    ["citys[" + a + "].checked"]: false,
                    ["citys[" + a + "].areaCityList[" + h + "].checked"]: false
                  })
                }
              }
            }
          }
        }
      }
    }
  },
  // 提交
  formSubmit: function(e) {
    console.log(e)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var cityscode = e.detail.value.city;
    console.log(cityscode)
    var codes = ""
    for (var i = 0; i < cityscode.length; i++) {
      codes = codes + cityscode[i] + ","
    }
    var that = this
    that.data.userService.areacode = codes

    console.log(that.data.userService.areacode)
    if (that.data.userService.areacode == null || that.data.userService.areacode == "") {
      wx.showModal({
        content: "请选择接单区域",
        showCancel: false,
        success: function(res) {
          that.setData({
            citystatic: false
          })
        }
      });
    } else {
      that.setData({
        citystatic: true
      })
    }
    that.setData({
      userService: that.data.userService
    })
    var userid = wx.getStorageSync("userid");
    that.data.user.userid = userid
    if (that.data.citystatic) {
      app.util.request({
        url: 'user/updateTwoTablesAreaCode',
        header: {
          "Content-Type": "application/json;charset=UTF-8"
        },
        method: "POST",
        data: {
          user: JSON.stringify(that.data.user),
          userService: JSON.stringify(that.data.userService),
        },
        success: function(res) {
          console.log(res)
          if (res.data.count == 1) {
            wx.showToast({
              title: "更新成功",
              icon: "none"
            })
            var setInterval = setTimeout(function() {
              wx.redirectTo({
                url: '../editInfo/editInfo'
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


        }
      });
    }
  },
  formReset: function() {
    console.log('form发生了reset事件')
    wx.redirectTo({
      url: '../editInfo/editInfo'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      areacode: options.areacode
    })

    //从数据库读取
    //获取接单区域
    app.util.request({
      url: 'area/selectByAreaCascade',
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
          citys: res.data.data
        })
        var citys = res.data.data
        var goodsids = that.data.areacode;
        console.log(goodsids)
        var goodsidList = goodsids.split(",");
        for (var i = 0; i < citys.length; i++) {

          if (citys[i].areaCityList != null) {
            for (var k = 0; k < citys[i].areaCityList.length; k++) {
              for (var j = 0; j < goodsidList.length; j++) {
                if (goodsidList[j] == citys[i].areaprovincecode) {
                  citys[i].checked = true;
                }
                if (goodsidList[j] == citys[i].areaCityList[k].areaprovincecode) {
                  citys[i].areaCityList[k].checked = true;
                }
              }
            }
          } else {

            for (var j = 0; j < goodsidList.length; j++) {
              if (goodsidList[j] == citys[i].areaprovincecode) {
                citys[i].checked = true;
              }
            }
          }
        }
        console.log(citys)
        that.setData({
          citys: citys
        })
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
    setTimeout(function() {
      wx.stopPullDownRefresh();
    }, 1000)

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
   * 页面的初始数据
   */

})