const app = getApp();
const { $Toast } = require('../../../../static/iview/base/index');
const Request = require('../../../../utils/request');//导入模块
Page({
    /*** 页面的初始数据****/
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,

        phone:'',
        userPhone: '',
        code: '',
        content: '获取验证码',

        showType: true,

        timer:'',//定时器名称
        minus: 100,//定时器初始值
    },
    onBackEvent:function(){
        wx.navigateBack({
            delta: 1
        })
    },

    //提交修改或者提交手机号
    SubmitClick: function(){
        var PhoneReg= /^[1][3,4,5,7,8][0-9]{9}$/;

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
        else {
            Request.post('/user/updatephone',{
                telephone: this.data.phone,
                code: this.data.code
            })
                .then(res =>{
                   if(res.code == 200){
                       $Toast({
                           content: '修改成功',
                           type: 'success'
                       });
                       setTimeout(function(){
                           wx.navigateTo({
                               url: '../center',
                           })
                       },1000);
                   }
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
        }
        else if( this.data.phone == this.data.userPhone){
            $Toast({
                content: '手机号码一致无需修改',
                type: 'warning'
            });
        }
        else {
            this.setData({
                showType: false
            });
            this.countDown();

            Request.get("/user/send/"+this.data.phone,{})
                .then(res =>{
                });

        }

    },

    handlePhoneChange:function(e){
        this.setData({
            phone: e.detail.detail.value
        })
    },
    handleCodeChange: function(e) {
        this.setData({
            code: e.detail.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /*** 生命周期函数--监听页面加载*/
     onLoad: function(options){
         var userPhone = '', phone='';
         if(options.phone.length == 11){
             userPhone =  options.phone;
             var myphone = userPhone.substr(3,4);
             phone = userPhone.replace(myphone,'****');
         }
        this.setData({
            userPhone: userPhone,
            phone: phone
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
