// pages/videoplay/videoplay.js
var app = getApp();

function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  inputValue: '',
  data: {
    paly: false,
    src: '',
    url: 'https://www.fhmpt.cn'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var id = options.id
    console.log(id)
    // 查询视频详情
    app.util.request({
      url: 'shareVideo/selectBySelectData',
      header: {
        "Content-Type": "application/json;charset=UTF-8"
      },
      method: "POST",
      data: {
        version: app.siteinfo.version,
        pagenumber: -1,
        pagesize: "",
        sharevideoid: id

      },
      success: function(res) {
        console.log(res);
        that.setData({
          sharevideocreatetime: res.data.data[0].sharevideocreatetime,  //发布时间
          sharevideoname: res.data.data[0].sharevideoname,   //名称
          sharevideoremark: res.data.data[0].sharevideoremark,//  内容
          sharevideoskipurl: res.data.data[0].sharevideoskipurl,// 跳转url
          sharevideostate: res.data.data[0].sharevideostate,// 状态
          sharevideotype: res.data.data[0].sharevideotype,//类型
          sharevideourl: res.data.data[0].sharevideourl,//url
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

  // 开始播放
  bindplay: function(e) { //开始播放按钮或者继续播放函数
    var that = this
    var paly = that.data.paly
    if (paly) {
      that.setData({
        paly: !that.data.paly
      })
    } else {
      that.setData({
        paly: !that.data.paly
      })
    }
  },
  // 暂停播放
  bindpause: function() { //暂停播放按钮函数
    console.log("停止播放")
  },
  // 播放结束
  bindend: function() { //播放结束按钮函数
    console.log("播放结束")
  },
  // 播放时间
  // bindtimeupdate: function (res) {//播放中函数，查看当前播放时间等
  //   console.log(res)//查看正在播放相关变量
  //   console.log("播放到第" + res.detail.currentTime + "秒")//查看正在播放时间，以秒为单位
  // },

  // 视频报错
  videoErrorCallback: function(e) {
    console.log('视频错误信息:');
    console.log(e.detail.errMsg);
  }
})