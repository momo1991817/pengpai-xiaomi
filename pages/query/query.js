const app = getApp();
const { $Message } = require('../../static/iview/base/index');
const { $Toast } = require('../../static/iview/base/index');
const Request = require('../../utils/request');//导入模块

Page({

    /**
     * 页面的初始数据
     */
    data: {
        visible1: false,
        num: 1,
        airline: '',//航司
        flightNumber:'',//航班号
        RflightNumber:'',//返程航班号
        seats:'',//舱位号
        Rseats:'',//返程舱位号
        startDate: '',//启程日期
        RstartDate:'',//回程日期
        volage: '',//航程 单程、往返

        list: [],//航司详情列表
        city1: '',
        city2: '',
        code1: '',
        code2: '',

        single: Number,
        orderId: '',
        orderSeat:'',

        info: false,
        infoMessage: '',//提示信息
        showLoading: false,

        clickId: 0, //用户点击添加监控对应的ID
        formId: 0,
        civil: 0, //国内航线或者国际航线

        realTime: true,//真实的数据
        vipmenber: false,//是否是会员 false为不是 true为会员成员

        ControlVolage: 0, //用户选择查看去程还是返程  0去程，1返程

    },
    //改变人数值设置
    handleNumChange({ detail }){
        this.setData({
            num: detail.value
        })
    },

    onBackEvent:function(){
        wx.navigateTo({
            url:'../home/home'
        })
    },

   // 标签更改事件
    onMyEvent:function(e){
        var c1 = e.detail.city1;
        var c2 = e.detail.city2;
        if(c2 == this.data.city1){
            if(wx.getStorageSync('backAirList').length == 0){
                this.setData({
                    info: true
                });
            }
              this.setData({
                  list: wx.getStorageSync('backAirList'),
                  ControlVolage: 1,
              })
        }
        else if(c1 == this.data.city1){
            if(wx.getStorageSync('goAirList').length == 0){
                this.setData({
                    info: true
                });
            }
            this.setData({
                list: wx.getStorageSync('goAirList'),
                ControlVolage: 0,
            })
        }
        // console.log(c1,c2);
    },

    // 打开添加模版
    OpenModal:function(e){
        this.setData({
            visible1: true,
            orderId: e.currentTarget.dataset.id,
            orderSeat: e.currentTarget.dataset.seat,
            clickId: e.currentTarget.dataset.id,
        });
    },

    // 取消添加
    handleClose () {
        this.setData({
            visible1: false,
            clickId: 0
        });
    },
    //提交监控表单
    submitNum:function(event){
        var id = this.data.orderId;
        var num = this.data.num;
        var seat = this.data.orderSeat;
        var formId = event.detail.formId;
        var civil = this.data.civil;
        var that = this;
        Request.post('/monitor/add',{
            code: seat,
            id: id,
            num: num,
            formId:formId,
            civil: civil
        })
            .then(res =>{
                if(res.code == -1){
                    that.setData({
                        clickId: 0,
                    })
                }
                else if(res.code ==-16){//通知用户前往加购
                    that.setData({
                        clickId: 0,
                    })
                }
                else if(res.code == 200){
                    $Toast({
                        content: '提交成功',
                        type: 'success'
                    });
                    that.getData();
                }else{
                    that.setData({
                        clickId: 0,
                    })
                }
                that.setData({
                    visible1: false,
                    num: 1
                });
            });

    },

    //获取用户信息
    getMenberInfo:function(){
        var that = this;
        Request.get('/user/getphoneemail',{})
            .then(res =>{
                if(res.code == 200){
                    var data = res.data;
                    if(data.flag){ //用户是会员
                        that.setData({
                            vipmenber: true,
                        });
                        that.getData();

                    }else{//用户不是会员
                        that.setData({
                            vipmenber: false,
                        });
                    }
                }
            });

    },


    //获取查询 航空信息
    getData: function(){
        // this.setData({
        //     showLoading: true
        // });
        var that = this;
        Request.post('/air/querySevenAirInfo',{
            airline: this.data.airline,
            flightNo: this.data.flightNumber,
            code: this.data.seats,
            backCode: this.data.Rseats,
            departureFlightDateStart: this.data.startDate,
            backFlightNo: this.data.RflightNumber,
            arrivalFlightDateStart: this.data.RstartDate,
            single: this.data.volage,
            departureAirport: this.data.code1,
            arrivalAirport: this.data.code2,
            formId: this.data.formId,
            civil: this.data.civil
        })
            .then(res =>{

                if(res.code == 200){
                    if(that.data.ControlVolage == 0){
                        that.setData({
                            list: res.data.goAirLineList,
                        });
                    }
                    else{
                        that.setData({
                            list: res.data.backAirLineList,
                        });
                    }
                    that.setData({
                        // list: res.data.backAirLineList,
                        // city1: res.data.goAirLineList[0].depCityName,
                        // city2: res.data.goAirLineList[0].arrCityName,
                        realTime: res.data.real,
                    });
                    wx.setStorageSync('goAirList', res.data.goAirLineList);
                    wx.setStorageSync('backAirList', res.data.backAirLineList);
                }
                else{
                    that.setData({
                        info: true,
                        infoMessage: res.msg
                    });
                }
                that.setData({
                    showLoading: false,
                });
            });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            airline:options.airline,
            flightNumber:options.flightNumber,
            RflightNumber:options.RflightNumber,

            seats:options.seats,
            Rseats:options.Rseats,

            code1: options.code1,
            code2: options.code2,

            city1: options.city1,
            city2: options.city2,

            startDate:options.startdate,
            RstartDate:options.RstartDate,

            volage: options.volage,
            showLoading: true,

            formId: options.formId,
            civil: options.civil,
        });


        if(options.volage == '1'){
          this.setData({
              single: 0
          });
        }
        else{
            this.setData({
                single: 1
            })
        }
        wx.removeStorageSync('goAirList');
        wx.removeStorageSync('backAirList');
        this.getMenberInfo();//获取用户信息  是会员再调用
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

});
