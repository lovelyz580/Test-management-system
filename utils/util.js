var util = {};
util.url = function(action) {
  var app = getApp();
   var url = app.siteinfo.siteroot + "sunweb/" + action;
  return url;
}
util.request = function(option) {
  var app = getApp();
  var option = option ? option : {};
  var url = option.url;
  url = util.url(url);
  console.log(url);
  option.showLoading = typeof option.showLoading != 'undefined' ? option.showLoading : true;
  wx.showNavigationBarLoading();
  if (option.showLoading) {
    util.showLoading();
  }
  wx.request({
    'url': url,
    'data': option.data ? option.data : {},
    'header': option.header ? option.header : {},
    'method': option.method ? option.method : 'GET',
    'success': function(response) {
      wx.hideNavigationBarLoading();
      wx.hideLoading();
      if (option.success && typeof option.success == 'function') {
        option.success(response);
      }
    },
    'fail': function(response) {
      wx.hideNavigationBarLoading();
      wx.hideLoading();
      if (option.fail && typeof option.fail == 'function') {
        option.fail(response);
      }
    },
    'complete': function(response) {
      if (option.complete && typeof option.complete == 'function') {
        option.complete(response);
      }
    }
  })
}

/*
 * 获取用户信息
 */
util.getUserInfo = function(cb) {
  var userInfo = {};
  wx.login({
    success: res => {
      console.log(res);
      var app = getApp();
      var url = app.siteinfo.siteroot + "sunweb/" + 'api/common/authWxapp';

      wx.getUserInfo({
        success: info => {
          wx.request({
            data: {
              code: res.code,
              encrypted_data: info.encryptedData,
              iv: info.iv,
              raw_data: info.rawData,
              signature: info.signature
            },
            url: url,
            method: 'POST',
            success: res => {
              if (!res.data.errno) {
                userInfo = res.data.data;
                wx.setStorageSync('userInfo', userInfo);
              }
              typeof cb == "function" && cb(userInfo);
            }
          })
        },
        fail: info => {
          console.log(info)
        }
      })
    }
  })
}
//封装微信等待提示，防止ajax过多时，show多次
util.showLoading = function() {
  var isShowLoading = wx.getStorageSync('isShowLoading');
  if (isShowLoading) {
    wx.hideLoading();
    wx.setStorageSync('isShowLoading', false);
  }
  wx.showLoading({
    title: '加载中',
    complete: function() {
      wx.setStorageSync('isShowLoading', true);
    },
    fail: function() {
      wx.setStorageSync('isShowLoading', false);
    }
  });
}

// 上传
util.upload = function(url, that, upload_picture_list, j) {
  //上传返回值
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
      var data = res.data;
      // console.log(res)
      // //字符串转化为JSON  
      if (data.Success == true) {

        var filename = data //存储地址 显示

        upload_picture_list[j]['path_server'] = filename
      } else {
        upload_picture_list[j]['path_server'] = filename
      }
      that.setData({
        upload_picture_list: upload_picture_list
      });

      wx.setStorageSync('imgs', upload_picture_list);
      console.log("上传服务器成功");
    },
    fail: function(err) {
      console.log("上传服务器失败")
    }, //请求失败
  })
  //上传 进度方法
  upload_task.onProgressUpdate((res) => {
    upload_picture_list[j]['upload_percent'] = res.progress
    that.setData({
      upload_picture_list: upload_picture_list
    });
  });
}

// 保存formid
util.dealFormIds = function(formId) {
    let formIds = app.globalData.gloabalFomIds; //获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      formId: formId,
      expire: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
    }
    formIds.push(data); //将data添加到数组的末尾
    app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
    console.log(formIds)
  },


// 格式化时间
  util.formatTime = function(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(util.formatNumber).join('-')
    //  + ' ' + [hour, minute, second].map(util.formatNumber).join(':')
  }
// 转码
util.formatNumber = function(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 判断数组中是否存在某值
util.findobj = function (array, obj) {
  var value = obj;
  for (var i = 0; i < array.length; i++) {
    if (obj) {
      if (array[i]) {
        var value1 = array[i];
        if (value === value1) {
          return 1;
        }
      }
    }
  }
  return 0;
}

module.exports = util;