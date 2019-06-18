const app = getApp();
const Request = require('../../../utils/request');//导入模块
const { $Toast } = require('../../../static/iview/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: '',
        nickName: '',
        submitType: '',
        submitNum: 0,
        toview: 'vip0',
        viplist: [], //vip产品列表
        menberDay: 0,//试用天数
        menberName: '您还不是会员',//用户会员名称
        vipMenber: false, //用户是否是会员
        vipMenberlist: [],//用户的会员特权
        remainNum:0,//剩余条数

        visible: false,//用户重新购买会员提醒框

        powerList: {},  //权限对应的权利列表
        powerTitle: [],  //vip会员所有的等级  试用版、入门版、基础版
        powerVip: [],   //vip会员对应的产品列表  余票查询、日程管理

        actions: [
            {
                name: '取消',
                color: '#495060'
            },
            {
                name: '确定',
                color: '#2d8cf0',
            }
        ],

        endTime: '',//会员到期时间
    },

    onBackEvent:function(){
        wx.navigateBack({
            delta: 1
        })
    },
   //用户提交支付
    handlePay:function(){
         var that = this;
        if(this.data.submitType == 'A'){
            Request.get('/WXPay/wxPayOrder?memberRank='+this.data.submitType,{})
                .then(res =>{
                    if(res.code == 200){

                        $Toast({
                            content: '试用版申请成功，您可以体验'+that.data.menberDay+'天！',
                            type: 'success'
                        });
                        that.getMenberInfo();
                    }

                });
        }else{
            if(this.data.menberName != '您还不是会员'){
               this.setData({
                   visible: true
               })
            }else{
                this.submitPay();
            }


        }


    },

    //获取用户信息
    getUserInfo:function(){
        var that = this;
        Request.get('/user/getphoneemail',{})
            .then(res =>{
                if(res.code == 200){
                    var data = res.data;
                    if(data.flag){
                        that.setData({
                            vipMenber: true,
                            remainNum: data.remainValue
                        });
                       that.getMenberInfo();
                    }else{
                        that.setData({
                            vipMenber: false,
                        });
                    }
                    that.setData({
                        menberName: data.memberName,
                    })

                }
            });

    },

    //获取用户会员特权
    getMenberInfo:function(){
        var that = this;
       Request.get('/user/listByUserId',{})
           .then(res =>{
               if(res.code == 200){
                   var data = res.data.userMemberPermissionsVOS,ramainNum=0;
                   if(data.length!=0){
                       var arr =[];
                       if(data[0].permissionsSign != 'ticket_query_seven'){
                           arr.push({query_one: true,url:'ticket.png',info:''});
                       }
                       for(var i=0,l=data.length;i<l;i++){
                           if(data[i].permissionsSign == 'ticket_query_seven'){
                               arr.push({query_one: true,url:'ticket.png',info:'&前后7天'});
                           }
                           else if(data[i].permissionsSign == 'monitoring_50'){
                               arr.push({query_one: false,url:'jiankong.png',info:data[i].name});
                           }
                           else if(data[i].permissionsSign == 'monitoring_150'){
                               arr.push({query_one: false,url:'jiankong.png',info:data[i].name});
                           }
                           else if(data[i].permissionsSign == 'monitoring_300'){
                               arr.push({query_one: false,url:'jiankong.png',info:data[i].name});
                           }
                           else if(data[i].permissionsSign == 'monitoring_-1'){
                               arr.push({query_one: false,url:'jiankong.png',info:data[i].name});
                           }
                           else if(data[i].permissionsSign == 'ua_cabin_3'){
                               arr.push({query_one: false,url:'seat.png',info:data[i].name});
                           }
                           else if(data[i].permissionsSign == 'day_manage'){
                               arr.push({query_one: false,url:'schedule.png',info:data[i].name});
                           }
                           else if(data[i].permissionsSign == 'airline_push_30'){
                               arr.push({query_one: false,url:'hotaline.png',info:data[i].name});
                           }
                           else if(data[i].permissionsSign == 'airline_push_60'){
                               arr.push({query_one: false,url:'hotaline.png',info:data[i].name});
                           }
                           else if(data[i].permissionsSign == 'airline_push_90'){
                               arr.push({query_one: false,url:'hotaline.png',info:data[i].name});
                           }


                       }
                       that.setData({
                           vipMenberlist: arr,
                           endTime: res.data.expireTime
                       });
                   }

               }

           });
   },

    //绑定用户选择套餐事件
    bindSelectVip:function(e){
        var n = e.currentTarget.dataset.num;
        var t = e.currentTarget.dataset.type;
        this.setData({
            submitNum: n,
            submitType: t,
            toview: "vip"+n,
        })
    },

    //获取vip信息内容
    getVipContent: function(){
        // vip产品内容
        var that = this;
        Request.get( '/user/memberList',{})
            .then(res =>{
               if(res.code == 200){
                   var data = res.data;
                   that.setData({
                       viplist: data,
                       menberDay: data[0].valid
                   });
               }
            });




    },

    //调用支付接口
    submitPay: function(){
        Request.get('/WXPay/wxPayOrder?memberRank='+this.data.submitType,{})
            .then(res =>{

                if(res.code == 200){
                    var that = this;
                    var data = res.data;
                    //支付接口
                    wx.requestPayment({
                        timeStamp: data.timeStamp,
                        nonceStr: data.nonceStr,
                        package: data.package,
                        signType: data.signType,
                        paySign:data.paySign,
                        success: function (res) {
                            // success
                            if(res.code == 200){
                                // $Toast({
                                //     content: res.msg,
                                //     type: 'success'
                                // });
                                that.getMenberInfo();
                            }
                            console.log(res);
                        },
                        fail: function (res) {
                            // fail
                            console.log(res);
                        },
                        complete: function (res) {
                            // complete
                            console.log(res);
                        }
                    });

                }
            });
    },

    //关闭弹窗
    handleClose: function(){
        this.setData({
            visible: false
        })
    },

    //弹窗确定事件  用户确定重新购买产品
    handleOk: function(){
        this.setData({
            visible: false
        });
        this.submitPay();
    },

    // 用户是否重新购买窗口按钮事件
    handleAction ({ detail }) {
        const index = detail.index;

        if (index === 1) {//确认
            this.setData({
                visible: false
            });
            this.submitPay();
        }
        else if (index === 0) {//取消
            this.setData({
                visible: false
            })
        }
    },


    //获取会员版本
    // getMenberName: function(){
    //     var data = this.data.powerList,
    //         arr=[],
    //         powerVip =[], //会员产品数组
    //         name,
    //         powerTitle=[]; //会员等级数组
    //     for(var index in data){
    //         arr = data[index];
    //         powerVip.push(index);
    //     }
    //     for(var i=0,l=arr.length;i<l;i++){
    //         powerTitle.push(arr[i].name);
    //     }
    //     this.setData({
    //         powerTitle: powerTitle,
    //         powerVip:powerVip
    //     });
    //
    // },



    //用户点击服务条款并查看
    linkProvision: function(){
        wx.navigateTo({
            url:'provision/provision'
        })
    },

    /*** 生命周期函数--监听页面加载******/
    onLoad: function (options) {
        this.setData({
            avatarUrl: app.globalData.userInfo.avatarUrl,
            nickName: app.globalData.userInfo.nickName,
        });

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
        this.getVipContent();//获取会员产品
        this.getUserInfo();//获取用户会员特权
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

    }
});
