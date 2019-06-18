var app = getApp();
// const { $Message } = require('../../static/iview/base/index');
const { $Toast } = require('../../static/iview/base/index');
const Request = require('../../utils/request');//导入模块

Page({
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,

        airline:'',//航司
        city1: app.globalData.leavecity2, //出发城市
        city2: app.globalData.arrivecity2, //到达城市
        code1: app.globalData.leaveCode2,//出发机场三字码
        code2: app.globalData.arriveCode2,//到达机场三字码

        airlines: [],//总航司
        airCompanyCode:[],//字母航司
        index: 0, //默认选择航司国航

        // ****************座位**************//
        seatArr: [],   //航线包括的航司所在的座位数组 O、F、I
        seats: [],    //座位  当前选择的航班号所在的座位  O、F、I

        seatIndex: 0,//航司座位序号

        place: '',

        // ****************航班号**************//
        flightNumberArr: [], //航线包括的航司航班号数组
        flightNumber: [], //航班号
        flightNumberIndex: 0,

        // current: '1',  //标签 单程或者往返
        startdate: '',//出发时间

        nowDate: '',  //当前日期
        endDate: '',  //只能查询三个月内的信息


        Num: 1,  //选择人数
        title: '首页', //导航栏 中间的标题

        submitLoading: false,//订单提交响应 提示
    },

    //提交表单
    submitClick: function(event){

        if(this.data.airCompanyCode[this.data.index]==''||this.data.flightNumber[this.data.flightNumberIndex]==''
            ||this.data.seats[this.data.seatIndex]=='' || this.data.startdate==''|| this.data.code1==''||this.data.code2==''){
            $Toast({
                content: '信息不具体！',
                type: 'error'
            });
        }
        else{
            var date = this.data.startdate;
            var formId = event.detail.formId;
            this.setData({
                submitLoading: true
            });
            var that = this;

            Request.post('/monitor/addDownCab',{
                airLine: this.data.airCompanyCode[this.data.index],
                flightNo: this.data.flightNumber[this.data.flightNumberIndex],
                departureAirport: this.data.code1,
                arrivalAirport: this.data.code2,
                code: this.data.seats[this.data.seatIndex],
                formId: formId,
                flightDate: date,
            })
                .then(res =>{
                    that.setData({
                        submitLoading:false
                    });
                    if(res.code == 200){
                        $Toast({
                            content: '监控提交成功！',
                            type: 'success'
                        });

                    }else if(res.code == -1){
                        $Toast({
                            content: res.msg,
                            type: 'error'
                        });
                    }

                });

        }

    },


    //**************航线选择********************//
    // 国内城市选择
    handleOpen1: function(){
        wx.redirectTo({
            url: '../city/city?id=1&home=2',
            //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        })
    },
    // 国际城市选择
    handleOpen2: function(){
        wx.redirectTo({
            url: '../city/city?id=2&home=2',
            //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        })
    },


    //**************航司选择***************//
    bindPickerAirChange(e) {
        var seats = this.data.seatArr[e.detail.value];
        this.setData({
            index: e.detail.value,
            seats:this.data.seatArr[e.detail.value],
            seatIndex: 0,
            flightNumber: this.data.flightNumberArr[e.detail.value],
            flightNumberIndex: 0,
        })
    },

    //**************座位选择***************//
    //座位选择事件
    bindPickerSeatChange(e) {
        this.setData({
            seatIndex: e.detail.value
        })
    },

    // 航程选择事件 单程、往返
    handleVolageChange({ detail = {} }) {
        this.setData({
            current: detail.key
        });
    },

    //******************日期****************//
    //出发日期开始时间
    bindStartDateChange(e) {
        this.setData({
            startdate: e.detail.value
        })
    },
    //出发日期开始时间
    bindEndDateChange(e) {
        this.setData({
            enddate: e.detail.value
        })
    },


    //******************航班号***************//
    //去程航班号选择
    bindPickerNumChange: function(e){
        this.setData({
            flightNumberIndex: e.detail.value
        })
    },



    //****************其他事件**************//


    // 获取当前日期函数 并赋值
    getDate: function(){
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;

        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }

        var endMonth = parseInt(month)+3;

        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;


        var that = this;
        this.setData({
            nowDate: currentdate,
            startdate: currentdate,
            rebackStartdate: currentdate,
        });

    },
    //获取三个月后的日期 实现的函数
    getMonth: function(){
        var date = new Date();
        var num = 3;
        var sDate = this.dateToDate(date);

        var sYear = sDate.getFullYear();
        var sMonth = sDate.getMonth() + 1;
        var sDay = sDate.getDate();

        var eYear = sYear;
        var eMonth = sMonth + num;
        var eDay = sDay;
        while (eMonth > 12) {
            eYear++;
            eMonth -= 12;
        }

        var eDate = new Date(eYear, eMonth - 1, eDay);

        while (eDate.getMonth() != eMonth - 1) {
            eDay--;
            eDate = new Date(eYear, eMonth - 1, eDay);
        }

        return eDate;
    },
    dateToDate: function(date){
        var sDate = new Date();
        if (typeof date == 'object'
            && typeof new Date().getMonth == "function"
        ) {
            sDate = date;
        }
        else if (typeof date == "string") {
            var arr = date.split('-');
            if (arr.length == 3) {
                sDate = new Date(arr[0] + '-' + arr[1] + '-' + arr[2]);
            }
        }

        return sDate;
    },
    ToDate: function(now){
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (date >= 0 && date <= 9) {
            date = "0" + date;
        }
        return year + "-" + month + "-" + date;
    },
    //*****end********//



    // 获取航线信息  航司  座位 航班号
    getAirlineInfo: function(){
        // const arr =  wx.getStorageSync('airlineDown');
        var arr = this.getAirline();
        var airlineSeat = wx.getStorageSync('airlineDownSeats');
        var c1 = this.data.code1;
        var c2 = this.data.code2;
        var airCompanyList = [];//航司
        var airCompanyCode = [];//航司代码
        var airArr = [];//航司及对应的座位数组 公务、头等

        var airNumArr = []; //航司对应的航班号数组

        var flightNum = ''; //航班号
        var SeatNum = ''; //座位号

        for(var i=0,l=arr.length;i<l;i++){
            if(arr[i].departureAirport === c1 && arr[i].arrivalAirport === c2){
                var NumArr = [];
                if(arr[i].airCompanyList.length==0){
                    $Toast({
                        content: '没有该航线信息！',
                        type: 'error'
                    });
                }else{
                    for(var j=0,airl = arr[i].airCompanyList.length;j<airl;j++){
                        //航司
                        airCompanyList.push(arr[i].airCompanyList[j].airLineShortName);
                        airCompanyCode.push(arr[i].airCompanyList[j].airline);

                        //航司以及对应的座位
                        airArr.push(getSeat(arr[i].airCompanyList[j].airLineShortName));


                        for(var n=0,m = arr[i].airCompanyList[j].airFlightList.length ;n<m;n++){
                            NumArr.push(arr[i].airCompanyList[j].airFlightList[n].flightNo);
                        }
                        airNumArr.push(NumArr);
                        NumArr = [];
                    }
                }

            }
        }

        //获取航司可兑换的舱位
        function getSeat(name){
            var arr =[];
            for(var i=0,len = airlineSeat.length;i<len;i++){
                if(airlineSeat[i].airLineShortName==name){
                    for(var j=0,l=airlineSeat[i].cabs.length;j<l;j++){
                        arr.push(airlineSeat[i].cabs[j].code);
                    }
                    return arr;
                }

            }
        }

        if(airNumArr.length == 0){
            flightNum = '';
            SeatNum = '';
        }
        else {
            flightNum = airNumArr[0];
            SeatNum = airArr[0];

        }
        this.setData({
            airlines: airCompanyList,  //航司
            airCompanyCode: airCompanyCode,
            seatArr: airArr, //航线包括的航司所在的座位数组

            flightNumberArr: airNumArr,//航线包括的航司航班号数组
            flightNumber: flightNum, //选择航班号
            seats: SeatNum, //选择座位号，
        });
    },

    //获取所有航线信息，并保存在本地。
    getInfomation: function(){
        // 航线
        Request.get('/air/getAirLineDownCab',{})
            .then(res =>{
                if(res.code == 200){
                    wx.setStorageSync('airlineDown', res.data.data);
                }
            });


        // 可兑换舱位
        Request.get('/air/getAllAirCompanyCab',{})
            .then(res =>{
                if(res.code == 200){
                    wx.setStorageSync('airlineDownSeats', res.data.data);
                }
            });

       this.getAirline();
    },


    getAirline: function() {
        var that = this;
        // 通过航线寻找航司跟航班号
        Request.get("/air/getDownCabAirLineByLine?departureAirport=" +
            getApp().globalData.leaveCode2 + "&arrivalAirport=" + getApp().globalData.arriveCode2,{})
            .then(res =>{
                if(res.code == 200){
                    var arr = res.data[0].airCompanyList;
                    var airCompanyList = [];//航司
                    var airCompanyCode = [];//航司代码
                    var airArr = [];//航司及对应的座位数组 A、F、O、I
                    var airNumArr = []; //航司对应的航班号数组

                    var flightNum = ''; //航班号
                    var SeatNum = ''; //座位号

                    if(arr.length==0){
                        $Toast({
                            content: '没有该航线信息！',
                            type: 'error'
                        });
                    }
                    else{
                        for (var i = 0, l = arr.length; i < l; i++) {
                            //航司
                            airCompanyList.push(arr[i].airLineShortName);
                            airCompanyCode.push(arr[i].airline);

                            //航司以及对应的座位   一个函数一个舱位数组

                            var cabs = [],cabsData = arr[i].airFlightList[0].cabs;
                            for(var a=0,b = cabsData.length;a<b;a++){
                                cabs.push(cabsData[a].code);
                            }
                            airArr.push(cabs);
                            //航司对应的航班号   一个航司多个航班
                            var NumArr= [];
                            for (var n = 0, m = arr[i].airFlightList.length; n < m; n++) {
                                NumArr.push(arr[i].airFlightList[n].flightNo);
                            }
                            airNumArr.push(NumArr);
                        }
                        if (airNumArr.length == 0) {
                            flightNum = '';
                            SeatNum = '';
                        }
                        else {
                            flightNum = airNumArr[0];
                            SeatNum = airArr[0];
                        }
                        that.setData({
                            airlines: airCompanyList,  //航司
                            airCompanyCode: airCompanyCode,
                            seatArr: airArr, //航线包括的航司所在的座位数组
                            seats: SeatNum,//航班号对应的数组

                            flightNumberArr: airNumArr,//航线包括的航司航班号数组
                            flightNumber: flightNum, //选择航班号
                        });
                    }
                }
            });

    },


    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true
        });
        var that = this;
        this.getAirline();
        var time=  setInterval(function(){
            var data = that.data.airlines.length;
            if(data !=0){
                clearInterval(time);
                that.getAirline();
            }
        },1000);
    },
    onReady: function(){
        var ThreeMonth = this.ToDate(this.getMonth());
        this.setData({
            endDate: ThreeMonth
        });
        this.getDate();//日期渲染
    },
    //页面显示时事件
    onShow: function(){
        this.setData({
            city1: app.globalData.leavecity2,
            city2: app.globalData.arrivecity2,
            code1: app.globalData.leaveCode2,
            code2: app.globalData.arriveCode2,
            index: 0,
            seatIndex: 0,
            flightNumberIndex: 0
        });
        // this.getAirlineInfo();
        this.getAirline();
    },
    //转发分享
    onShareAppMessage(res) {
        return {
            title: '澎湃旅行',
            path: '/pages/launch/launch?userId='+app.globalData.userId,
        }
    }

});
