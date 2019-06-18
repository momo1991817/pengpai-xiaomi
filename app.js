App({

   onLaunch(options) {
    this.checkUpdate();
      wx.getSystemInfo({
          success: res => {
              //导航高度
              // this.globalData.statusBarHeight = res.statusBarHeight + 20;
              // console.log(res.statusBarHeight);

              let totalTopHeight = 68;
              if (res.model.indexOf('iPhone X') !== -1) {
                  totalTopHeight = 88;
              } else if (res.model.indexOf('iPhone') !== -1) {
                  totalTopHeight = 64;
              }
              this.globalData.statusBarHeight = res.statusBarHeight;
              this.globalData.titleBarHeight = totalTopHeight - res.statusBarHeight;
              this.globalData.screenW= res.screenWidth;
              this.globalData.screenH = res.screenHeight;

          }, fail(err) {
              console.log(err);
          }
      });
      if(options.shareTicket){//获取分享信息
          wx.getShareInfo({
              shareTicket: options.shareTicket,
              success: (res)=> {
                  console.log(res);
              },
              fail: function (res) { console.log(res) },
              complete: function (res) { console.log(res) }
          });
      }

  },
   onShow(options){
        // console.log(options.shareTicket);
   },
  globalData: {
    userInfo: {},// 用户信息对象 包括头像名称省份···
    // nickName:'',
    // avatarUrl:'',
    // apiBase: "https://mp.pptravel.cn",
    userId: "",//保存用户Id
    statusBarHeight: '',
    titleBarHeight: '',
    screenH: '',
    screenW: '',

    leavecity: '北京首都',
    arrivecity:'洛杉矶',
    leaveCode: 'PEK',
    arriveCode:'LAX',

    leavecity2: '上海浦东',
    arrivecity2:'巴黎',
    leaveCode2: 'PVG',
    arriveCode2:'CDG',


    leavecity3: '北京首都',
    arrivecity3:'洛杉矶',
    leaveCode3: 'PEK',
    arriveCode3:'LAX',
    scheduleDate: '',//日程时间

  },

  checkUpdate() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    });

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      console.log('更新失败！')
    })
  },

   //保存在本地的变量
    //airline 为余票监控的所有航线信息
    //airlineSeats

    //airlineDown   为降舱监控的所有航线信息
    //airlineDownSeats  为降舱监控的所有  航司对应的舱位

    //current  为home/home中定义当前标签 是航线还是航班号查询 传给city
});
