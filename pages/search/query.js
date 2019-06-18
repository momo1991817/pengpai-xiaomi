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

        code1:'',//出发城市三字码
        code2:'',//到达城市三字码
        seats:'',//舱位号
        Rseats:'',//返程舱位号
        startDate: '',//启程日期
        RstartDate:'',//回程日期
        volage: '',//航程 单程、往返

        city1: '',
        city2: '',


        list: [],//航司详情列表

        single: Number, //单程或往返
        orderId: '',
        orderSeat:'',

        info: false, //
        infoMessage: '',//提示信息
        dateList: [],//日期列表
        current: 0,//当前搜索的日期
        toview: 'current1',


        currentDate:'',//当前时间
        currentCode1:'',
        currentCode2:'',
        endTimeStamp: '',//当前最右边的日期时间戳
        // showLoading: true,//是否显示加载
        showLoading: true,//是否显示加载

        clickId:0,
        clickCode: 'A',
        formId: 0,
        civil: 0,//国内或者国际

        realTime: true, //是否是真实的数据

        ControlVolage: 0, //用户选择查看去程还是返程  0去程，1返程
    },
    //*****************事件********************///
    //改变人数值设置
    handleNumChange({ detail }){
        this.setData({
            num: detail.value
        })
    },
    tapCalender: function(){
        var  str= 'code1='+this.data.code1+
            '&code2='+this.data.code2+
            '&volage='+this.data.volage+
            '&seats='+this.data.seats+
            '&startdate='+this.data.startDate+
            '&Rseats='+this.data.Rseats+
            '&RstartDate='+this.data.RstartDate+
            '&city1='+this.data.city1+
            '&city2='+this.data.city2+
            '&civil='+this.data.civil;
        wx.redirectTo({
            url:'../calender/calender?'+str
        });
    },

   //切换日期tab
    changeTab:function(event){
        var date = event.currentTarget.dataset.date;
        this.setData({
            current:event.currentTarget.dataset.id,
            showLoading1: true,
            currentDate: date,
            list:[],
            showLoading: true,
            formId: '',
            info: false,
            realTime: true
        });
        this.getData(this.data.currentCode1,this.data.currentCode2,date);
    },

    // 标签更改事件 切换城市  从去程-返程
    onMyEvent:function(e){
        var c1 = e.detail.city1;
        var c2 = e.detail.city2;
        this.setData({
            list: [],
            // showLoading: true,
            info: false,
            // realTime: true
        });
        if(c2 == this.data.city1){
            this.getTimeTenTimeStamp(this.data.RstartDate);
            this.setData({
               currentDate: this.data.RstartDate,
               currentCode1:this.data.code2,
               currentCode2:this.data.code1,
               toview: 'current'+(((this.data.current)-2)<0?0:((this.data.current)-2)),
                list: wx.getStorageSync('backAirList'),
                ControlVolage: 1,
            });
            // var code1 = this.data.code2;
            // var code2= this.data.code1;
            //
            // this.getData(code1,code2,this.data.RstartDate);

        }
        else if(c1 == this.data.city1){
            this.getTimeTenTimeStamp(this.data.startDate);
            this.setData({
                currentDate: this.data.startDate,
                toview: 'current'+(((this.data.current)-2)<0?0:((this.data.current)-2)),
                list: wx.getStorageSync('goAirList'),
                ControlVolage: 0,
            });

            // this.getData(this.data.code1,this.data.code2,this.data.startDate);
        }
    },

    onBackEvent:function(){
        wx.switchTab({
            url:'../home/home'
        })
    },

    // 打开添加模版
    OpenModal:function(e){
        this.setData({
            visible1: true,
            orderId: e.currentTarget.dataset.id,
            orderSeat: e.currentTarget.dataset.seat,
            clickId: e.currentTarget.dataset.id,
            clickCode: e.currentTarget.dataset.seat,
        });
    },

    // 取消添加
    handleClose () {
        this.setData({
            visible1: false,
            clickId: 0,
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
                    that.getData(that.data.code1,that.data.code2,that.data.currentDate);
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

    //绑定日期滑动到最右端触发
    bindscroll: function(e){
       if(e.detail.direction == 'right'){
         this.getMoreTimeStamp();
       }
    },


    //获取航线数据
    getData: function(code1,code2,time){
        // this.setData({
        //     showLoading: true,
        // });
        var that = this;
        Request.post('/air/queryAirInfo',{
            departureAirport: code1,
            arrivalAirport: code2,
            cabLevel: this.data.seats,
            backCabLevel: this.data.Rseats,

            flightDate: time,
            backFlightDate: this.data.RstartDate,
            single: this.data.volage,
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
                        // list: res.data.goAirLineList,
                        info: false,
                        realTime: res.data.real
                    });
                    wx.setStorageSync('goAirList', res.data.goAirLineList);
                    wx.setStorageSync('backAirList', res.data.backAirLineList);
                }else{
                    that.setData({
                        info: true,
                        infoMessage: res.msg,
                    });
                }

                that.setData({
                    showLoading: false,
                });

            });

    },


    /*********获取10天内时间********/
    getTimeTenTimeStamp: function(time){
        var list = [];
        this.setData({
            dateList: []
        });
        var y = new Date().getFullYear();
        var m = new Date().getMonth()+1;
        var date = new Date().getDate();
        m=m<10?"0"+m:m;
        date = date<10?"0"+date:date;
        var now = new Date(y+'-'+m+'-'+date).getTime();
        var search = new Date(time).getTime(),d;

        d = parseInt((search - now)/(24*60*60*1000));

        // console.log(d);
        /****添加当前日期到搜索日期的时间段****/
        var stamp;
        if(d>0){
            this.setData({
                current: d
            });
            for(var i=0;i<d;i++){
                stamp = now + 24*60*60*1000*i;
                list.push({date:this.ToDate(stamp),week:this.ToWeek(stamp),year:this.ToDateYear(stamp)});
            }
        }
        else{
            this.setData({
                current: 0
            });
        }

        /****未来10天的日期*****/
        for(var j=0;j<11;j++){
            stamp = search + 24*60*60*1000*j;
            list.push({date:this.ToDate(stamp),week:this.ToWeek(stamp),year:this.ToDateYear(stamp)});
        }
         // console.log(list);
        this.setData({
            endTimeStamp: search + 24*60*60*1000*10,
            dateList: list
        });

    },

    /***********右滑动 出现更多时间 每次增加15天************/
    getMoreTimeStamp: function(){
        var time = this.data.endTimeStamp;
        var list = this.data.dateList;
        var stamp;
        for(var j=1;j<16;j++){
            stamp = time + 24*60*60*1000*j;
            list.push({date:this.ToDate(stamp),week:this.ToWeek(stamp),year:this.ToDateYear(stamp)});
        }
        this.setData({
            endTimeStamp: time + 24*60*60*1000*15,
            dateList: list
        });
    },


    //***************************start*************//
    //******** 时间戳转换为时间（2019-2-01）*******//
    ToDateYear: function(time){
        var now=new Date(time);
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        if (month >= 0 && month <= 9) {
            month = "0" + month;
        }
        if (date >= 0 && date <= 9) {
            date = "0" + date;
        }
        return year+"-"+month+"-"+date;

    },

    //******** 时间戳转换为时间（2-01）*******//
    ToDate: function(time){
        var now=new Date(time);
        // var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        if (date >= 0 && date <= 9) {
            date = "0" + date;
        }
        // var hour=now.getHours();
        // var minute=now.getMinutes();
        // var second=now.getSeconds();
        return month+"-"+date;
       //2017/7/22 下午6:12:30
    },

    //******** 时间戳转换为星期（周）*******//
    ToWeek: function(time){
        var now=new Date(time);
        var search = this.ToDateYear(time);
        var nowDate = this.ToDateYear(new Date().getTime());


        var n = now.getDay();
        if(search == nowDate){ n = 7}
        switch(n)
        {
            case 0:
                return '周日'
                break;
            case 1:
                return '周一'
                break;
            case 2:
                return '周二'
                break;
            case 3:
                return '周三'
                break;
            case 4:
                return '周四'
                break;
            case 5:
                return '周五'
                break;
            case 6:
                return '周六'
                break;
            case 7:
                return '今天'
                break;
        }
    },

   //**************************end***************//

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            code1: options.code1,
            code2: options.code2,

            currentCode1: options.code1,
            currentCode2: options.code2,

            city1: options.city1,
            city2: options.city2,


            seats:options.seats,
            Rseats:options.Rseats,

            startDate:options.startdate,
            RstartDate:options.RstartDate,
            currentDate: options.startdate,

            volage: options.volage,
            formId: options.formId,
            showLoading: true,

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
        this.getTimeTenTimeStamp(options.startdate);
        this.getData(options.code1,options.code2,this.data.startDate);
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
        this.setData({
            toview: 'current'+(((this.data.current)-2)<0?0:((this.data.current)-2))
        });
    },

});
