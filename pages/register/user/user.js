const app = getApp();
const { $Toast } = require('../../../static/iview/base/index');
const Request = require('../../../utils/request');//导入模块

Page({
    /*** 页面的初始数据****/
    data: {

        user:'',
        pwd:'',
        rpwd: '',

        showType: true,
        showLoading: false,

    },
    //返回键
    onBackEvent:function(){
        wx.switchTab({
            url:'../register'
        })
    },

    /*** 生命周期函数--监听页面加载*/
    onLoad: function (options) {

    },
    //提交用户名密码
    SubmitClick: function(){

       if(this.data.user == ''){
           $Toast({
               content: '用户名不能为空！',
               type: 'warning'
           });
       }
        else if(this.data.pwd == ''){
            $Toast({
                content: '密码不能为空！',
                type: 'warning'
            });
        }
        else if(this.data.rpwd == ''){
            $Toast({
                content: '请再次输入密码！',
                type: 'warning'
            });
        }
        else if(this.data.pwd != this.data.rpwd){
           $Toast({
               content: '两次密码输入不一致！',
               type: 'warning'
           });
       }
       else if(!/^[a-zA-Z][a-zA-Z0-9]+$/.test(this.data.user)){
           $Toast({
               content: '用户名由字母开头，字母加数字组成！',
               type: 'warning'
           });
       }
        else {
            var that = this;
           this.setData({
               showLoading: true,
           });
           Request.post('/user/edit',{
               username: this.data.user,
               password1: this.data.pwd,
               password2: this.data.rpwd
           })
               .then(res =>{
                  if(res.code == 200){
                      $Toast({
                          content: '注册成功，享受会员最高权限15天',
                          type: 'success'
                      });
                      setTimeout(function(){
                          wx.switchTab({
                              url: '../../home/home',
                          })
                      },2000);
                      wx.setStorageSync('firstLogin',true);
                  }else{
                      that.setData({
                          showLoading: false
                      })
                  }
               });

        }

    },

   // 输入用户名
    handleUserChange:function(e){
        this.setData({
            user: e.detail.detail.value
        })
    },
    // 输入密码
    handlePwdChange: function(e) {
        this.setData({
            pwd: e.detail.detail.value
        })
    },
    // 再输入密码
    handleRPwdChange: function(e) {
        this.setData({
            rpwd: e.detail.detail.value
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

});
