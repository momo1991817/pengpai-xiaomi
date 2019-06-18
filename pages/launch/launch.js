var app = getApp();
const Request = require('../../utils/request');//导入模块
Page({

  data: {
    userInfo: "",
    shareId: '',
  },

  onLoad(options) {
    let that = this;
    // 分享渠道获取分享者信息
    var shareId;
    if(options.userId){
        shareId = options.userId;
    }else{
        shareId = '';
    }

    this.setData({
        shareId: shareId
    });
      // 查看是否授权
      //调用前需要 用户授权 scope.userInfo
      wx.getSetting({
         success:function(res){
             if (res.authSetting['scope.userInfo']) {
                 // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                 wx.getUserInfo({
                   success: function(res) {
                     //*************获取用户信息
                       //不包括敏感信息的原始数据字符串，用于计算签名
                     app.globalData.userInfo = JSON.parse(res.rawData);
                     that.setData({
                       userInfo: app.globalData.userInfo//用户信息对象，不包含 openid 等敏感信息
                     });
                     if (options.share) {//转发、分享？
                        that.login('auth');
                     } else {
                        that.login();
                     }
                   },
                   fail: function(res) {
                     console.log('用户未授权');
                   }
                 });
             }
         }
      })



    // var parentId = options.userId;
    //是否是转发的并获取转发的信息

  },

  bindGetUserInfo: function(e) {
     console.log(e.detail.userInfo)
  },

    // 跳转到首页操作
  direct() {
      let url = "/pages/home/home";
      wx.switchTab({
        url,
      })
  },
  //点击授权窗口，拒绝或者允许的回调
  onGetUserInfo() {
    var that = this;
    wx.getSetting({//获取用户的当前设置
      success: function(res) {
        //允许授权
        if (res.authSetting['scope.userInfo']) {
          //调用前需要 用户授权 scope.userInfo。
          wx.getUserInfo({
            success: function(res) {
              app.globalData.userInfo = res.userInfo;
                that.setData({
                    userInfo: app.globalData.userInfo
                });
                that.login();
            },
            fail: function() {
              console.log('系统错误')
            }
          })
        }
        //拒绝授权
        else {
          wx.showToast({
            title: "授权失败",
            duration: 1000,
            icon: "none"
          })
        }
      },
      fail: function() {
        console.log('获取用户信息失败');
      }
    })
  },
   //登录函数
  login(auth) {

    let that = this;
    //调用微信登录接口 调用接口获取登录凭证
    wx.login({
      success: function(res) {
        //code用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 code2Session，使用 code 换取 openid 和 session_key 等信息
          //传递名称跟头像
          Request.get('/api/wx/login?code=' + res.code + '&nickname=' + app.globalData.userInfo.nickName +
              '&avatar=' + app.globalData.userInfo.avatarUrl+"&shareId=" + that.data.shareId,{})
              .then(res =>{
                  if (res.code == 200) {

                    var data = res.data;
                      wx.setStorageSync('userId', data);
                      app.globalData.userId = data; //获取用户ID
                      // console.log('获取用户信息=' + res.data.data);
                      if (auth == 'auth') {
                          that.direct();
                      }
                      else {
                          let timer = setTimeout(() => {
                              clearTimeout(timer);
                              that.direct() // 跳转到首页
                          }, 100)
                      }
                  }else{
                      $Toast({
                          content: res.msg,
                          type: 'error'
                      });
                  }
              });
      }
    })
  },
});
