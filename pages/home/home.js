var app = getApp();
const { $Toast } = require('../../static/iview/base/index');
const Request = require('../../utils/request');//导入模块

Page({
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,
        shareId: "",

        airline:'',//航司
        Rairline: '',//返程航司

        city1: app.globalData.leavecity, //出发城市
        city2: app.globalData.arrivecity, //到达城市
        code1: app.globalData.leaveCode,//出发机场三字码
        code2: app.globalData.arriveCode,//到达机场三字码

        airlines: [],//总航司
        airCompanyCode:[],//字母航司
        index: 0, //默认选择航司在数组中的位置

        Rairlines: [],//返程总航司
        RairCompanyCode: [],//字母航司
        Rindex: 0,//默认选择返程航司在数组中的位置

        // ****************座位**************//
        seatArr: [],   //航线包括的航司所在的座位数组 公务、头等
        // seatArrName: [], //航线包括的航司所在的座位数组 O、F、I
        seats: [],    //座位  当前选择的航司所在的座位 公务头等
        seatIndex: 0,
        airlineSeat: [],//航线搜索的舱位


        RseatArr: [],   //返程航线包括的航司所在的座位数组 公务、头等
        // RairArrName: [],//返程航线包括的航司航班号数组 O、F、I
        Rseats: [],    //返程座位  当前选择的航司所在的座位 公务、头等
        RseatIndex: 0,//返程航司座位序号

        // ****************航班号**************//
        flightNumberArr: [], //航线包括的航司航班号数组
        flightNumber: [], //航班号
        flightNumberIndex: 0,

        RflightNumberArr: [], //返程航线包括的航司航班号数组
        RflightNumber: [], //返程航班号
        RflightNumberIndex: 0,


        current: '1',  //标签 1航线2航班号
        startdate: '',//出发时间
        rebackStartdate: '',//返程时间

        nowDate: '',  //当前日期

        volage: 0,
        civil: 0
    },

    //提交表单
    submitClick: function(event){
        var  str='',reg0='',reg1;
        var formId = event.detail.formId;
        var volage = this.data.volage==0?1:2;
        if(this.data.current == 1){//航线查询
            str= 'code1='+this.data.code1+
                '&code2='+this.data.code2+
                '&volage='+volage+
                '&seats='+this.data.seats[this.data.seatIndex]+
                '&startdate='+this.data.startdate+
                '&Rseats='+this.data.Rseats[this.data.RseatIndex]+
                '&RstartDate='+this.data.rebackStartdate+
                '&city1='+this.data.city1+
                '&city2='+this.data.city2+
                 '&formId='+formId+
                 '&civil='+this.data.civil;
            reg0 = this.data.seats[this.data.seatIndex]==''||this.data.startdate=='';
            reg1 = this.data.seats[this.data.seatIndex]==''||this.data.startdate==''||
                this.data.Rseats[this.data.RseatIndex]==''||this.data.rebackStartdate=='';
        }
        else if(this.data.current == 2){//航班号查询
            str='airline='+this.data.airCompanyCode[this.data.index]+
                '&Rairline='+this.data.RairCompanyCode[this.data.Rindex]+
                '&flightNumber='+this.data.flightNumber[this.data.flightNumberIndex]+
                '&seats='+this.data.seats[this.data.seatIndex]+
                '&startdate='+this.data.startdate+
                '&volage='+volage+
                '&RflightNumber='+this.data.RflightNumber[this.data.RflightNumberIndex]+
                '&Rseats='+this.data.Rseats[this.data.RseatIndex]+
                '&RstartDate='+this.data.rebackStartdate+
                '&code1='+this.data.code1+
                '&code2='+this.data.code2+
                '&city1='+this.data.city1+
                '&city2='+this.data.city2+
                '&formId='+formId+
                '&civil='+this.data.civil;
            reg1 = this.data.airCompanyCode[this.data.index]==''||this.data.flightNumber[this.data.flightNumberIndex]==''||this.data.seats[this.data.seatIndex]==''
                || this.data.startdate==''||this.data.RflightNumber[this.data.RflightNumberIndex]==''||this.data.Rseats[this.data.RseatIndex]==''||this.data.rebackStartdate=='';
            reg0 = this.data.airCompanyCode[this.data.index]==''||this.data.flightNumber[this.data.flightNumberIndex]==''||this.data.seats[this.data.seatIndex]==''
                || this.data.startdate=='';
        }

        if(volage==1&&(reg0)){
            $Toast({
                content: '信息不具体！',
                type: 'error'
            });
        }else if(volage==2&&(reg1)){
            $Toast({
                content: '信息不具体！',
                type: 'error'
            });
        }
        else if(volage==2&&(this.data.startdate>this.data.rebackStartdate)){

            $Toast({
                content: '返程时间不能小于去程时间！',
                type: 'error'
            })
        }
        else{
            // console.log(str);

            wx.navigateTo({
                url: this.data.current==2?'../query/query?'+str: '../search/query?'+str,
            });
        }

    },

    jampTo:function(){
      wx.navigateTo({
          url:'../order/order'
      })
    },

    //**************航线选择********************//
    // 国内城市选择
    handleOpen1: function(){
        wx.redirectTo({
            url: '../city/city?id=1&home=1',
            //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        });

    },
    // 国际城市选择
    handleOpen2: function(){
        wx.redirectTo({
            url: '../city/city?id=2&home=1',
            //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        });
    },


    //**************航司选择***************//
    bindPickerAirChange(e) {
        this.setData({
            index: e.detail.value,
            seats:this.data.seatArr[e.detail.value],
            seatIndex: 0,
            flightNumber: this.data.flightNumberArr[e.detail.value],
            flightNumberIndex: 0,
        });

        app.globalData.selectAirlineIndex = e.detail.value;
    },
    // 返程航司的选择
    bindRAirChange(e){
        this.setData({
            Rindex: e.detail.value,
            Rseats:this.data.RseatArr[e.detail.value],
            RseatIndex: 0,
            RflightNumber: this.data.RflightNumberArr[e.detail.value],
            RflightNumberIndex: 0,
        });
        app.globalData.selectRAirlineIndex = e.detail.value;
    },

    //**************座位选择***************//
    //座位选择事件
    bindPickerSeatChange(e) {
        this.setData({
            seatIndex: e.detail.value
        });
        app.globalData.selectSeatIndex = e.detail.value;
    },

    //返程座位选择事件
    bindPickerRSeatChange(e) {
        this.setData({
            RseatIndex: e.detail.value
        });
        app.globalData.selectRSeatIndex = e.detail.value;
    },

    // 查询方式选择，航线 航班号
    handlMethodsChange({ detail = {} }) {
        this.setData({
            current: detail.key
        });
        wx.setStorageSync('current',detail.key);
        this.addSeats();
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
    //返程日期开始时间
    bindrebackStartDateChange(e) {
        this.setData({
            rebackStartdate: e.detail.value
        })
    },
    //返程日期结束时间
    bindrebackEndDateChange(e) {
        this.setData({
            rebackEndDate: e.detail.value
        })
    },
   //****************end******************//

    //******************航班号***************//
    //去程航班号选择
    bindPickerNumChange: function(e){
        this.setData({
            flightNumberIndex: e.detail.value
        });
        app.globalData.selectFlightNumIndex = e.detail.value;
    },

    //返程航班号选择
    bindPickerRNumChange: function(e){
        this.setData({
            RflightNumberIndex: e.detail.value
        });
        app.globalData.selectRFlightNumIndex = e.detail.value;
    },



    //****************其他事件**************//
    //是否选择返程的信息
    exchangeVolage: function(){
        this.setData({
            volage: this.data.volage==0?1:0
        })
    },
    // 切换城市
    exchangeCity: function(){
        var city1 = app.globalData.leavecity;
        var city2 = app.globalData.arrivecity;
        var code1 = app.globalData.leaveCode;
        var code2 = app.globalData.arriveCode;

        app.globalData.leavecity = city2;
        app.globalData.arrivecity = city1;
        app.globalData.leaveCode = code2;
        app.globalData.arriveCode = code1;

        var seatArr = this.data.seatArr;
        var seats = this.data.seats;
        var seatIndex = this.data.seatIndex;

        var RseatArr = this.data.RseatArr;
        var Rseats = this.data.Rseats;
        var RseatIndex = this.data.RseatIndex;

        var flightNumberArr = this.data.flightNumberArr;
        var flightNumber = this.data.flightNumber;
        var flightNumberIndex = this.data.flightNumberIndex;

        var RflightNumberArr = this.data.RflightNumberArr;
        var RflightNumber = this.data.RflightNumber;
        var RflightNumberIndex = this.data.RflightNumberIndex;


        this.setData({
            city1: app.globalData.leavecity,
            city2:  app.globalData.arrivecity,
            code1:  app.globalData.leaveCode,
            code2:  app.globalData.arriveCode,

            seatArr: RseatArr,
            seats: Rseats,
            seatIndex: RseatIndex,

            RseatArr: seatArr,
            Rseats: seats,
            RseatIndex: seatIndex,

            flightNumberArr: RflightNumberArr,
            flightNumber: RflightNumber,
            flightNumberIndex: RflightNumberIndex,

            RflightNumberArr: flightNumberArr,
            RflightNumber: flightNumber,
            RflightNumberIndex: flightNumberIndex
        });
    },

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
        });

    },

    // 获取一周后的日期函数 并赋值
    getSevenDate: function(){
        var date = new Date();
        date.setDate(date.getDate()+7);
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
            rebackStartdate: currentdate,
        });

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



    // 获取航线信息  航司  座位 航班号  --暂时不用
    getAirlineInfo: function(){
        const arr =  wx.getStorageSync('airline');

        var c1 = this.data.code1;
        var c2 = this.data.code2;
        var airCompanyList = [];//航司
        var airCompanyCode = [];//航司代码

        var RairCompanyList = [];//返程航司
        var RairCompanyCode = [];//返程航司代码

        var airArr = [];//航司及对应的座位数组 公务、头等
        var airNumArr = []; //航司对应的航班号数组

        var  RairArr = [];//返程航司及对应的座位
        var RairNumArr = [];//返程对应的航班号

        var flightNum = ''; //航班号
        var SeatNum = ''; //座位号

        var RflightNum = ''; //返程航班号
        var RSeatNum = ''; //返程座位号

        var civil = '';//区分国内航线或者国际航线

        for(var i=0,l=arr.length;i<l;i++){
            // 去程信息
            if(arr[i].departureAirport === c1 && arr[i].arrivalAirport === c2){
                civil = arr[i].civil;
                var NumArr = [];
                for(var j=0,airl = arr[i].airCompanyList.length;j<airl;j++){
                    //航司
                    airCompanyList.push(arr[i].airCompanyList[j].airLineShortName);
                    airCompanyCode.push(arr[i].airCompanyList[j].airline);

                    //航司以及对应的座位
                    airArr.push(getSeat(arr[i].airCompanyList[j].airLineShortName));

                    //航司以及对应的航班号
                    for(var n=0,m = arr[i].airCompanyList[j].airFlightList.length ;n<m;n++){
                        NumArr.push(arr[i].airCompanyList[j].airFlightList[n].flightNo);
                    }
                    airNumArr.push(NumArr);
                    NumArr = [];
                }
            }
            //往返信息
            if(arr[i].departureAirport === c2 && arr[i].arrivalAirport === c1){
                var RNumArr = [];
                for(var jR=0,airlR = arr[i].airCompanyList.length;jR<airlR;jR++){
                    RairCompanyList.push(arr[i].airCompanyList[jR].airLineShortName);
                    RairCompanyCode.push(arr[i].airCompanyList[jR].airline);
                    //航司以及对应的座位
                    RairArr.push(getSeat(arr[i].airCompanyList[jR].airLineShortName));

                    // var j= [];
                    // for(var e in (arr[i].airCompanyList[jR].airFlightList[0].code))
                    // {
                    //     j.push(arr[i].airCompanyList[jR].airFlightList[0].code[e]);
                    // }
                    // RairArr.push(j);

                    for(var nR=0,mR = arr[i].airCompanyList[jR].airFlightList.length ;nR<mR;nR++){
                        RNumArr.push(arr[i].airCompanyList[jR].airFlightList[nR].flightNo);
                    }
                    RairNumArr.push(RNumArr);
                    RNumArr = [];
                }
            }
        }
        //获取航司可兑换的舱位
        function getSeat(name){
            var airlineSeat = wx.getStorageSync('airlineSeats');
            var arr =[];
            for(var i=0,len = airlineSeat.length;i<len;i++){
                if(airlineSeat[i].airLineShortName==name){

                    for(var j=0,l=airlineSeat[i].cabs.length;j<l;j++){
                        arr.push(airlineSeat[i].cabs[j].description);
                    }
                    return arr;
                }

            }
        }

        var data=airArr.join(',').split(','),temp=[];

        for(var ii=0,ll=data.length;ii<ll;ii++){
            if(temp.indexOf(data[ii])==-1){
                temp.push(data[ii]);
            }
        }

        if(airNumArr.length == 0){
            flightNum = '';
            RflightNum = '';
            SeatNum = '';
            RSeatNum = '';
        }
        else {
            flightNum = airNumArr[0];
            RflightNum = RairNumArr[0];

        }
        if(this.data.current == "1"){
            SeatNum = temp;
            RSeatNum = temp;
        }else{
            SeatNum = airArr[0];
            RSeatNum = RairArr[0];
        }


        this.setData({
            airlines: airCompanyList,  //航司
            airCompanyCode: airCompanyCode,

            Rairlines: RairCompanyList,  //航司
            RairCompanyCode: RairCompanyCode,

            seatArr: airArr, //航线包括的航司所在的座位数组

            flightNumberArr: airNumArr,//航线包括的航司航班号数组
            flightNumber: flightNum, //选择航班号
            seats: SeatNum, //选择座位号，
            // seatsName:airNumArr.length == 0?'':airArrName[0], //选择座位号，

            RseatArr: RairArr,

            Rseats: RSeatNum,
            // RseatsName:airNumArr.length == 0?'':RairArrName[0], //选择座位号，

            RflightNumberArr: RairNumArr,
            RflightNumber: RflightNum,

            civil: civil,
            airlineSeat: temp,
        });
    },

    //获取所有航线信息，并保存在本地。
    getInfomation: function(){
        //获取航线信息
        // wx.request({
        //     url: getApp().globalData.apiBase +"/air/getAirInfo",
        //     success: function(res){
        //         if(res.statusCode == 200 && res.data.code == 200) {
        //             wx.setStorageSync('airline', res.data.data);
        //         }
        //     }
        // });
        //获取航司对应的舱位信息

        Request.get('/air/getAllAirCompanyExchangeCab',{})
            .then(res =>{
                wx.setStorageSync('airlineSeats',res.data);
            });
    },

    //根据航线获取航司、航班号、舱位   -
    getAirline: function() {
        var that = this;
        //获取航司可兑换的舱位
        function getSeat(name){
            var airlineSeat = wx.getStorageSync('airlineSeats');
            var arr =[];
            for(var i=0,len = airlineSeat.length;i<len;i++){
                if(airlineSeat[i].airLineShortName==name){

                    for(var j=0,l=airlineSeat[i].cabs.length;j<l;j++){
                        arr.push(airlineSeat[i].cabs[j].description);
                    }
                    return arr;
                }

            }
        }

        function resert(airArr){
            //获取航线搜索的舱位，将舱位数组合并 并去重
            var data=airArr.join(',').split(','),temp=[];
            for(var ii=0,ll=data.length;ii<ll;ii++){
                if(temp.indexOf(data[ii])==-1&&data[ii]!=''){
                    temp.push(data[ii]);
                }
            }
            return temp;
        }

        // 通过航线寻找航司跟航班号 ---去程
        Request.get("/air/getAirInfoByAirline?departureAirport=" +
            getApp().globalData.leaveCode  + "&arrivalAirport=" + getApp().globalData.arriveCode,{})
            .then(res =>{
                if(res.code == 200){
                    var arr = res.data.airCompanyList;


                    var airCompanyList = [];//航司
                    var airCompanyCode = [];//航司代码
                    var airArr = [];//航司及对应的座位数组
                    var airNumArr = []; //航司对应的航班号数组

                    var flightNum = ''; //航班号
                    var SeatNum = ''; //座位号

                    var civil = res.data.civil; //国内国际航线

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
                            airArr.push(getSeat(arr[i].airLineShortName));


                            //航司对应的航班号   一个航司多个航班
                            var NumArr= [];
                            for (var n = 0, m = arr[i].airFlightList.length; n < m; n++) {
                                NumArr.push(arr[i].airFlightList[n].flightNo);
                            }
                            airNumArr.push(NumArr);
                        }


                        var temp = resert(airArr);

                        if (airNumArr.length == 0) {
                            flightNum = '';
                            SeatNum = '';
                        }
                        else {
                            flightNum = airNumArr[0];
                            SeatNum = airArr[0];
                        }
                        var current = that.data.current;
                        if(current == "1"){
                            SeatNum = temp;
                        }else{
                            SeatNum = airArr[0];
                        }
                        that.setData({
                            airlines: airCompanyList,  //航司
                            airCompanyCode: airCompanyCode,
                            seatArr: airArr, //航线包括的航司所在的座位数组
                            seats: SeatNum,//航班号对应的数组

                            flightNumberArr: airNumArr,//航线包括的航司航班号数组
                            flightNumber: flightNum, //选择航班号
                            airlineSeat: temp,

                            civil: civil,//国内国际航线
                        });
                        that.conpareglobalData();
                    }
                }

            });



        // 通过航线寻找航司跟航班号  ----返程
        Request.get("/air/getAirInfoByAirline?departureAirport=" + getApp().globalData.arriveCode
            + "&arrivalAirport=" +getApp().globalData.leaveCode ,{})
            .then(res =>{
                if(res.code == 200){
                    var arr = res.data.airCompanyList;
                    var airCompanyList = [];//航司
                    var airCompanyCode = [];//航司代码
                    var airArr = [];//航司及对应的座位数组
                    var airNumArr = []; //航司对应的航班号数组

                    var flightNum = ''; //航班号
                    var SeatNum = ''; //座位号

                    if(arr){
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
                                airArr.push(getSeat(arr[i].airLineShortName));


                                //航司对应的航班号   一个航司多个航班
                                var NumArr= [];
                                for (var n = 0, m = arr[i].airFlightList.length; n < m; n++) {
                                    NumArr.push(arr[i].airFlightList[n].flightNo);
                                }
                                airNumArr.push(NumArr);
                            }

                            var temp = resert(airArr);

                            if (airNumArr.length == 0) {
                                flightNum = '';
                                SeatNum = '';
                            }
                            else {
                                flightNum = airNumArr[0];
                                SeatNum = airArr[0];
                            }
                            var current = that.data.current;
                            if(current == "1"){
                                SeatNum = temp;
                            }else{
                                SeatNum = airArr[0];
                            }
                            that.setData({
                                Rairlines: airCompanyList,  //航司
                                RairCompanyCode: airCompanyCode,
                                RseatArr: airArr, //航线包括的航司所在的座位数组
                                Rseats: SeatNum,//航班号对应的数组

                                RflightNumberArr: airNumArr,//航线包括的航司航班号数组
                                RflightNumber: flightNum, //选择航班号
                                RairlineSeat: temp
                            });
                            that.conpareglobalData();
                        }
                    }
                }


            });

    },

    //判断当前是航线查询还是航班号查询，切换舱位变量
    addSeats: function(){
        var current = this.data.current,seats = [],rseats =[];

        if(current == "1"){
            seats = this.data.airlineSeat;
            rseats = this.data.airlineSeat;
        }else{
            seats = this.data.seatArr[0];
            rseats = this.data.RseatArr[0];
        }
        this.setData({
            seats: seats,
            Rseats: rseats,
            seatIndex: 0,
            RseatIndex: 0,
        });
    },

    //获取用户的未加密的ID
    getUserId: function(){
        var that = this;
        Request.get("/user/getphoneemail",{})
            .then(res =>{
                that.setData({
                    shareId: res.data.id
                });
            });

    },

// 判断用户是否是从搜索界面过来的，则保留之前选择的数据
    conpareglobalData:function(){
        if(app.globalData.selectAirlineIndex != undefined){
            var num = app.globalData.selectAirlineIndex;
            this.setData({
                index: num,
                seats:this.data.seatArr[num],
                flightNumber: this.data.flightNumberArr[num],
            });
        }
        if(app.globalData.selectRAirlineIndex != undefined){
            var Rnum = app.globalData.selectRAirlineIndex;
            this.setData({
                Rindex: Rnum,
                Rseats:this.data.RseatArr[Rnum],
                RflightNumber: this.data.RflightNumberArr[Rnum],
            });
        }
        if(app.globalData.selectSeatIndex != undefined){
            this.setData({
                seatIndex: app.globalData.selectSeatIndex
            });
        }
        if(app.globalData.selectRSeatIndex != undefined){
            this.setData({
                RseatIndex: app.globalData.selectRAirlineIndex
            });
        }
        if(app.globalData.selectFlightNumIndex != undefined){
            this.setData({
                flightNumberIndex: app.globalData.selectFlightNumIndex
            });
            console.log(this.data.flightNumberIndex);
        }
        if(app.globalData.selectRFlightNumIndex != undefined){
            this.setData({
                RflightNumberIndex: app.globalData.selectRFlightNumIndex
            });
        }
    },

    onReady: function(){
        // this.getAirlineInfo();
        this.getDate();//日期渲染
        this.getSevenDate(); //返程日期渲染
    },
    //页面显示时事件
    onShow: function(options){
        var current;
        if(wx.getStorageSync('current')){
            current = wx.getStorageSync('current');
        }
        else{
            current = this.data.current;
        }
        this.setData({
            city1: app.globalData.leavecity,
            city2: app.globalData.arrivecity,
            code1: app.globalData.leaveCode,
            code2: app.globalData.arriveCode,
            current: current ,
            index: 0,
            seatIndex: 0,
            RseatIndex: 0,//返程航司座位序号
            flightNumberIndex: 0,
            RflightNumberIndex: 0,
        });
        // this.getAirlineInfo();
        this.getAirline();
        this.getUserId();//获取用户ID

    },



    onLoad: function (options) {
        wx.showShareMenu({
            withShareTicket: true
        });
        this.setData({
           current: 1
        });
        var that = this;
        this.getInfomation();
        var time=  setInterval(function(){
            var data = that.airlines;
            if(data !=''){
                clearInterval(time);
                that.getAirline();
            }
        },1000);
    },


    //转发分享
    onShareAppMessage(res) {
        var that = this;
        return {
            title: '澎湃旅行',
            path: '/pages/launch/launch?userId='+that.data.shareId,
        }
    }

});
