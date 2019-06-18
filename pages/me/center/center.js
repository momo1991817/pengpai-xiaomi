const app = getApp();
const Request = require('../../../utils/request');//导入模块
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '我的',
        fromAvatar: '',
        from: '',
        nickName:'',//用户名称
        userId: '',//用户ID
        avatarUrl:'',//用户头像
        userName: '',//用户名
        phone: '',
        email:'',
        company:'',
        visible: false,
        bindCompany: false
    },

    onBackEvent:function(){
        wx.navigateBack({
            delta: 1
        })
    },

    // 点击退出帐号按钮
    handleClick: function(){
      this.setData({
          visible: true
      })
    },
    handleClose: function(){
        this.setData({
            visible: false
        })
    },
    //获取用户信息
    getPhoneEmail:function(){
        var that = this;

        Request.get("/user/getphoneemail",{})
            .then(res =>{
              if(res.code == 200){
                  var phone = '',email = '',company='',bindCompany=false;
                  var data = res.data;

                  if(data.email == ''||data.email == null){
                      email = '绑定';
                  }else{
                      email = data.email;
                  }
                  if(data.telephone == ''||data.telephone == null){
                      phone = '绑定';
                  }else{
                      phone = data.telephone;
                  }

                  if(data.companyName == ''||data.companyName == null||data.companyName == '绑定'){
                      company = '绑定';
                      bindCompany = false;
                  }else if(data.companyName == '审核未通过'){
                      company = data.companyName;
                      bindCompany = false;
                  }
                  else{
                      company = data.companyName;
                      bindCompany = true;
                  }
                  that.setData({
                      phone: phone,
                      email:email,
                      company: company,
                      bindCompany: bindCompany,
                      userId: data.id,
                      userName: data.username
                  })
              }
              else{
                  that.setData({
                      phone: '绑定',
                      email: '绑定',
                      userId: res.data.data.id
                  })
              }
            });
   },

    // //点击修改密码
    bindPwdClick:function(){
        wx.navigateTo({
            url:'password/password'
        })
    },

    //产生formId
    createFormId:function(event){
        var formId = event.detail.formId;
        Request.post("/user/collectWXFormId",
            {formId: formId})
            .then(res =>{
                if(res.code == 200){

                }
                else{

                }
            });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            avatarUrl: app.globalData.userInfo.avatarUrl,
            nickName: app.globalData.userInfo.nickName,
            userId:''
        });
        this.getPhoneEmail();

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
        this.getPhoneEmail();
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
