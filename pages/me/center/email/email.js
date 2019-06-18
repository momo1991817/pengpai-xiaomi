const app = getApp();
const { $Toast } = require('../../../../static/iview/base/index');
const Request = require('../../../../utils/request');//导入模块
Page({
    /*** 页面的初始数据****/
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,

        email:'',
        userEmail: '',
        title: '',
    },

    onBackEvent:function(){
        wx.navigateBack({
            delta: 1
        })
    },


    //提交注册
    SubmitClick: function(){
        var EmailReg= /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;


        if(this.data.email == ''){
            $Toast({
                content: '邮箱不能为空！',
                type: 'warning'
            });
        }
        else if (!EmailReg.test(this.data.email)) {
            $Toast({
                content: '请填写正确的邮箱',
                type: 'warning'
            });
        }
        else {
            if(this.data.userEmail == ''){
                Request.post('/user/binding',{
                    email: this.data.email
                })
                    .then(res =>{
                       if(res.code == 200){
                           $Toast({
                               content: '绑定邮箱成功',
                               type: 'success'
                           });
                           setTimeout(function(){
                               wx.navigateTo({
                                   url:'../center'
                               })
                           },1500);
                       }
                    });


            }
            else{
                Request.post('/user/updateemail',{
                    email: this.data.email
                })
                    .then(res =>{
                        if(res.code == 200){
                            $Toast({
                                content: '更新邮箱成功',
                                type: 'success'
                            });
                            setTimeout(function(){
                                wx.navigateTo({
                                    url:'../center'
                                })
                            },1500);
                        }
                    });

            }

        }

    },

    handleEmailChange:function(e){
        this.setData({
            email: e.detail.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /*** 生命周期函数--监听页面加载*/
     onLoad: function(options){
        var userEmail = '', title='';
        if(options.email!='绑定'){
            userEmail =  options.email;
            title = '修改邮箱';
        }else{
            userEmail = '';
            title ='绑定邮箱';
        }
        this.setData({
            userEmail: userEmail,
            email: userEmail,
            title: title
        });
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
