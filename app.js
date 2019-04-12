//app.js
App({
  util: require("utils/util.js"),
  siteinfo: {
    'version': '1.1',
     'siteroot': 'https://www.fhmpt.cn/'
    //'siteroot': 'http://192.168.10.215:8080/'
    // 'siteroot': 'http://192.168.10.142:8085/'
    //'siteroot': 'http://127.0.0.1:8080/'
  },



         
  globalData: {
    userInfo: null,
    appId: 'wx81746dd800812c92',
    key: '96acbe4e29e0b0bd6a30469e83e3b43d' //AppSecret
  },
  onLaunch: function() {
    console.log('onLaunch');
    console.log("检查更新")
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调

      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function() {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
  },
})