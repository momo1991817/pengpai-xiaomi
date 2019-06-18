const app = getApp();
const { $Toast } = require('../../static/iview/base/index');
const Request = require('../../utils/request');//导入模块

Page({
    /*** 页面的初始数据****/
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,

        phone:'',
        code: '',
        content: '获取验证码',

        // name: 'name1',
        selected: false,

        showType: true,
        showLoading: false,

        timer:'',//定时器名称
        minus: 100,//定时器初始值
    },
    //返回键
    onBackEvent:function(){
        wx.switchTab({
            url:'../home/home'
        })
    },

    /*** 生命周期函数--监听页面加载*/
    onLoad: function (options) {
        // this.setData({
        //     avatarUrl: app.globalData.userInfo.avatarUrl,
        //     nickName: app.globalData.userInfo.nickName
        // })
    },
    //提交注册
    SubmitClick: function(){
        var PhoneReg=/^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;


       if(this.data.phone == ''){
           $Toast({
               content: '手机号码不能为空！',
               type: 'warning'
           });
       }
        else if (!PhoneReg.test(this.data.phone)) {
            $Toast({
                content: '请填写正确的手机号码',
                type: 'warning'
            });
        }
        else if(this.data.code == ''){
            $Toast({
                content: '短信验证码不能为空！',
                type: 'warning'
            });
        }
        // else if(this.data.selected == false){
        //     $Toast({
        //         content: '请选择同意条款！',
        //         type: 'warning'
        //     });
        // }

        else {
            var that = this;
           this.setData({
               showLoading: true,
           });
           Request.post('/user/update',{
               telephone: this.data.phone,
               code: this.data.code
           })
               .then(res =>{
                   if(res.code == 200){
                       $Toast({
                           content: '手机绑定成功!',
                           type: 'success'
                       });
                       setTimeout(function(){
                           wx.navigateTo({
                               url: 'user/user',
                           })
                       },1000);
                       wx.setStorageSync('firstLogin',true);
                   }
                   that.setData({
                       showLoading: false
                   });

               });

        }

    },

    // 倒计时函数
    countDown:function(){
        this.setData({
            minus: 100
        });
        var num = this.data.minus;
        var that = this;
        this.setData({
            timer: setInterval(function(){
                num--;
                that.setData({
                   minus: num
                });
                if(num == 0){
                    clearInterval(that.data.timer);
                    that.setData({
                        showType: true,
                        content: '重新获取'
                    });
                }
            },1000)
        });
    },


    //获取验证码
    getCode: function(){
        var reg= /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!reg.test(this.data.phone)) {
            $Toast({
                content: '请填写正确的手机号码',
                type: 'warning'
            });
        } else {
            this.setData({
                showType: false
            });
            this.countDown();

            Request.get("/user/send/"+this.data.phone,{})
                .then(res =>{});

        }

    },
    handleEmailChange:function(e){
        this.setData({
            email: e.detail.detail.value
        })
    },
    handlePhoneChange:function(e){
        this.setData({
            phone: e.detail.detail.value
        });

    },
    handleCodeChange: function(e) {
        this.setData({
            code: e.detail.detail.value
        })
    },
    // checkboxChange(e) {
    //     if(e.detail.value == 'name1'){
    //         this.setData({
    //             selected: true
    //         })
    //     }else{
    //         this.setData({
    //             selected: false
    //         })
    //     }
    // },



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
