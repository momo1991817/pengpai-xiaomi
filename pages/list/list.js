var app = getApp();
const { $Toast } = require('../../static/iview/base/index');
const Request = require('../../utils/request');//导入模块

Page({
    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,

        city1: app.globalData.leavecity3, //出发城市
        city2: app.globalData.arrivecity3, //到达城市
        code1: app.globalData.leaveCode3,  //出发机场三字码
        code2: app.globalData.arriveCode3,//到达机场三字码

        airlines: [], //航司数组
        airCompanyCode: [], //航司代码数组
        index: 0,

        flightNumberArr: [],//航司所对应的航班号数组
        flightNumber: [], //当前航司数组
        flightNumberIndex: 0,  //默认为第一个

        civil: 0, //国内或是国际

        showSearch: false, //控制搜索框
        showLoading: true, //加载


        AirlineData: {}, //搜索出来的航班号下的列表
        airlineList: [], //航线到航班的数组
        selectNum: 0,
        airlineObjList: [],//航线到航班的所有数据
        vipmenber: true,//用户是否为会员，false不是true为会员
        vipmenberInfo: '',//会员内容提示
        info: false, //数据库出错提醒

        showInfo: false,//展示提示文字 不是热门航线
        showPicker: true, //展示余票前10条选择框

        showFirstCabin: true, //展示头等舱
        lastDate: '', //显示的最后一天

    },

    onBackEvent:function(){
        wx.switchTab({
            url: '../me/me'
        });
        // wx.setStorageSync('dailyShowSearch',false);

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // wx.setStorageSync('dailyShowSearch',false);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (options) {
        this.setData({
            // showSearch:  wx.getStorageSync('dailyShowSearch'),
            city1: app.globalData.leavecity3,
            city2: app.globalData.arrivecity3,
            code1: app.globalData.leaveCode3,
            code2: app.globalData.arriveCode3,
        });

    },


    onLoad: function (options) {
         // console.log(options.Resourse);
        if(options.Resourse == 0){
            this.getMenberInfo();
            this.setData({
                showSearch: false
            })
        }else{
            this.getAirline();
            this.setData({
                showSearch: true
            })
        }
        // departureAirport: DXB
        // arrivalAirport: CAN
        // civil: 0
        // flightNo: EK362
        // airline: EK
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



    // 国内城市选择
    handleOpen1: function(){
        wx.redirectTo({
            url: '../city/city?id=1&home=3',
            //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        });

    },

    // 国际城市选择
    handleOpen2: function(){
        wx.redirectTo({
            url: '../city/city?id=2&home=3',
            //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        });
    },

    //**************航司选择***************//
    bindPickerAirChange(e) {
        this.setData({
            index: e.detail.value,
            flightNumber: this.data.flightNumberArr[e.detail.value],
            flightNumberIndex: 0,
        })
    },

    //航班号选择
    bindPickerNumChange: function(e){
        this.setData({
            flightNumberIndex: e.detail.value
        })
    },

    // 切换城市
    exchangeCity: function(){
        var city1 = app.globalData.leavecity3;
        var city2 = app.globalData.arrivecity3;
        var code1 = app.globalData.leaveCode3;
        var code2 = app.globalData.arriveCode3;

        app.globalData.leavecity3 = city2;
        app.globalData.arrivecity3 = city1;
        app.globalData.leaveCode3 = code2;
        app.globalData.arriveCode3 = code1;

        this.getAirline();
    },

    //根据航线获取航司、航班号、舱位   -
    getAirline: function() {
        var that = this;

        // 通过航线寻找航司跟航班号 ---去程
        Request.get("/air/getAirInfoByAirline?departureAirport=" +
            getApp().globalData.leaveCode3 + "&arrivalAirport=" + getApp().globalData.arriveCode3,{})
            .then(res =>{
               if(res.code == 200){
                   var arr = res.data.airCompanyList;

                   var airCompanyList = [];//航司
                   var airCompanyCode = [];//航司代码

                   var airNumArr = []; //航司对应的航班号数组
                   var flightNum = ''; //航班号


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

                           //航司对应的航班号   一个航司多个航班
                           var NumArr= [];
                           for (var n = 0, m = arr[i].airFlightList.length; n < m; n++) {
                               NumArr.push(arr[i].airFlightList[n].flightNo);
                           }
                           airNumArr.push(NumArr);
                       }

                       if (airNumArr.length == 0) {
                           flightNum = '';
                       }
                       else {
                           flightNum = airNumArr[0];
                       }

                       that.setData({
                           airlines: airCompanyList,  //航司
                           airCompanyCode: airCompanyCode,

                           flightNumberArr: airNumArr,//航线包括的航司航班号数组
                           flightNumber: flightNum, //选择航班号


                           civil: civil,//国内国际航线
                       });
                   }

               }

            });

    },

    //打开搜索框
    openSearch: function(){
        this.setData({
            showSearch: true,
            showPicker: false
        });
        // this.getData('PEK','LAX','CA','0','CA987',0);
        // wx.setStorageSync('dailyShowSearch',true);
        this.getAirline();
    },

    //打开下拉搜索框
    openPicker: function(){
       this.setData({
           showPicker: true,
           showSearch: false,
       });
        // wx.setStorageSync('dailyShowSearch',false);
       this.getTenAirline();
    },

    //关闭搜索弹窗
    closeSearchModal:function(){
        this.setData({
            showSearch: false,
            showPicker: true,
        });
        this.getTenAirline();
        // wx.setStorageSync('dailyShowSearch',false);
    },

    //提交表单
    submitClick: function(event){
        var  str='',reg0='',reg1;
        var formId = event.detail.formId;
        var code1 = this.data.code1;
        var code2 = this.data.code2;
        var airline = this.data.airCompanyCode[this.data.index];
        var flightNum = this.data.flightNumber[this.data.flightNumberIndex];
        var civil = this.data.civil;
        Request.post("/user/collectWXFormId",
            {formId: formId})
            .then(res =>{
                if(res.code == 200){}
                else{}
            });

        if(code1 == ''||code2 == ''|| airline == ''|| flightNum == ''|| airline == undefined|| flightNum == undefined){
            $Toast({
                content: '无此航线，请重新选择',
                type: 'error'
            });
        }else{
            if(civil == 1){
                $Toast({
                    content: '目前只支持国际航线！',
                    type: 'error'
                });
            }else{
                // this.setData({
                //     showSearch: false
                // });
                // wx.setStorageSync('dailyShowSearch',false);
                if(airline=='UA'){
                    this.setData({
                        showFirstCabin: false
                    });

                }else{
                    this.setData({
                        showFirstCabin: true
                    })
                }
                this.getData(code1,code2,airline,civil,flightNum,"0");
            }
        }
    },

    //请求后端数据
    getData: function (code1, code2, airline,civil,flightNum,recommend) {
        var that = this;
        this.setData({
            showLoading: true,
        });

        Request.get( '/report/getAirCalendarReportInSomeTime?departureAirport='+code1+
            '&arrivalAirport='+code2+'&civil='+civil+'&flightNo='+flightNum+'&airline='+airline+'&isRecommend='+recommend,{})
            .then(res =>{
                if(res.code == 200){
                    var list = res.data,data = {},json ={},monthArr=[];
                    if(list == null||JSON.stringify(list)=='{}'){
                         that.setData({
                             showInfo: true
                         })
                    }
                    else{
                        // 构造指定的日历
                        for(var flight in list){
                            for(var day in list[flight]){
                                var year = day.split('年')[0];
                                var month = day.split('年')[1].split('月')[0];
                                json[`${day}`]  = that.calender(year,month);
                                monthArr.push(day);
                            }
                        }
                        var lastDate = '';
                        for(var flightNum in list){

                            for(var date in list[flightNum]){
                                var arr = list[flightNum][date];
                                var date_list_arr = json[date];

                                for(var i =0,l = arr.length;i<l;i++){
                                    for(var j=0,len = date_list_arr.length;j<len;j++){
                                        if(arr[i].flightDay == date_list_arr[j].date){
                                            json[`${date}`][j]['firstClass'] = arr[i]['firstClass'];
                                            json[`${date}`][j]['bussinessClass'] = arr[i]['bussinessClass'];
                                           lastDate = date+arr[i]['flightDay'];
                                        }

                                    }
                                }

                            }
                            data =json;
                        }

                        lastDate = lastDate.split('年')[0]+'-'+lastDate.split('年')[1].split('月')[0]+'-'+lastDate.split('年')[1].split('月')[1];

                        that.setData({
                            AirlineData: data,
                            year: monthArr,
                            showInfo: false,
                            lastDate: lastDate
                        });
                        if(this.data.showSearch){
                            this.setData({
                                showPicker: false,
                                showSearch: false
                            });
                            // wx.setStorageSync('dailyShowSearch',false);
                        }
                        else{
                            this.setData({
                                showPicker: true,
                            });
                            // wx.setStorageSync('dailyShowSearch',false);
                        }
                    }

                }
                else if(res.code == -17){
                    this.setData({
                        showPicker: true,
                        showSearch: false,
                        vipmenber: false,
                    });
                    // wx.setStorageSync('dailyShowSearch',false);
                }

                else if(res.code == -1){
                    that.setData({
                        info: true,
                        InfoMsg: res.msg,
                    })
                }

                that.setData({
                    showLoading: false,
                })
            });
    },


    //根据年月  获取当前的日历表
    calender(year,month) {
        var arr = [];
        month = parseInt(month);

        //new data 有三个参数: 1,年 2.月 3.默认是1 如果是0,表示上个月最后一天 - 前两天 3 后天
        var nowMonthLength = new Date(year, month, 0).getDate();
        var nowMonthFirstWeek = new Date(year, month - 1).getDay();
        var lastMonthLength = new Date(year, month - 1, 0).getDate();

        var nowDate = new Date().getDate();
        var nowMonth = new Date().getMonth()+1;

        // this.month = parseInt(this.month);
        //每个月的上一个月是哪一年的那一个月
        var pmonth = month == 1 ? 12 :month - 1;
        //上一年
        var pyear = month == 1 ? year - 1 : year;
        //下一月
        var nmonth = month == 12 ? 1 : month + 1;
        //下一月
        var nyear = month == 12 ? year + 1 : year;
        //补零函数
        function buling(n) {
            return parseInt(n) >=10 ? n : '0' + n;
        }
        //补充上个月日期
        if(nowMonthFirstWeek ==0 ){
            //添加上个月的日期
            for(var m=0;m<7;m++){
                arr.unshift({
                    date: lastMonthLength,
                    cur: true,
                    passDate: false,
                    fullDay: pyear+'-'+buling(pmonth)+'-'+buling(lastMonthLength),
                });
                lastMonthLength--;
            }

        }
        else{
            // 补充上个月的最后几天
            while (nowMonthFirstWeek--) {
                arr.unshift({
                    date: lastMonthLength,
                    cur: true,
                    passDate: false,
                    fullDay: pyear+'-'+buling(pmonth)+'-'+buling(lastMonthLength),
                });
                lastMonthLength--
            }
        }

        //本月天数
        var _a = 1;

        if(month == nowMonth){
            //过去的日期
            while (nowMonthLength--&&_a<nowDate) {
                arr.push({
                    date: _a,
                    cur: false,
                    passDate: true,
                    fullDay: pyear+'-'+buling(month)+'-'+buling(_a)
                });
                _a++
            }
            nowMonthLength++;

            while (nowMonthLength--&&_a>=nowDate) {
                arr.push({
                    date: _a,
                    cur: false,
                    passDate: false,
                    fullDay: pyear+'-'+buling(month)+'-'+buling(_a)
                });
                _a++
            }
        }
        else{
            while (nowMonthLength--) {
                arr.push({
                    date: _a,
                    cur: false,
                    passDate: false,
                    fullDay: pyear+'-'+buling(month)+'-'+buling(_a)
                });
                _a++
            }
        }

        //下个月补全
        var nextLength = arr.length > 35 ? 42 - arr.length : 42 - arr.length;
        _a = 1;
        while (nextLength--) {
            arr.push({
                date: _a,
                cur: true,
                passDate: false,
                fullDay: nyear+'-'+buling(nmonth)+'-'+buling(_a)
            });
            _a++
        }
        return arr;
    },


    //获取10天航线信息并且默认展示第一条
    getTenAirline: function(){
        var that = this;
        Request.get('/report/getTop10AirHotLineFlight',{})
            .then(res =>{
               if(res.code == 200){
                   var airlineList = [],list = [];
                   var data = res.data;

                   for(var i=0,l=data.length;i<l;i++){
                       list.push(data[i].depCityName+'-'+data[i].arrCityName+" "+data[i].airLineShortName+data[i].flightNo);
                       airlineList.push({
                           label:data[i].depCityName+'-'+data[i].arrCityName+" "+data[i].airLineShortName+data[i].flightNo,
                           value:i,
                           code1: data[i].departureAirport,
                           code2: data[i].arrivalAirport,
                           airline: data[i].airline,
                           civil: data[i].isCivil,
                           flightNumber: data[i].flightNo
                       });
                   }

                   that.setData({
                       vipmenber: true,
                       airlineList: list,
                       selectNum: 0,
                       airlineObjList: airlineList,
                       showLoading: false
                   });
                   that.getData(data[0].departureAirport,data[0].arrivalAirport,data[0].airline,data[0].isCivil,data[0].flightNo,"1");

               }
               else if(res.code ==-14||res.code ==-15||res.code == -17){
                   var msg = '';
                   if(res.code==-14){
                       msg = '您还不是会员，点击前往购买！'
                   }
                   else if(res.code==-15){
                       msg = '您的会员已经过期，点击前往续购！'
                   }
                   else if(res.code==-16){
                       msg = '您剩余的条数不够，请前往会员中心加购！'
                   }
                   else if(res.code == -17){
                       msg = '您的会员权限不够！'
                   }
                   that.setData({
                       vipmenber: false,
                       vipmenberInfo: msg,
                       showLoading: false
                   })
               }



               else if(res.code == -1){
                   that.setData({
                       vipmenber: false,
                       info: true,
                       vipmenberInfo: res.msg,
                       showLoading: false,
                   })
               }
            });

    },

    //选择切换时
    bindPickerAirlineChange:function(e){
        var index = e.detail.value;
       this.setData({
           selectNum: index,
           // airlineList: e.detail.value
       });

       var list = this.data.airlineObjList;
       var code1 = list[index].code1;
       var code2 = list[index].code2;
       var airline = list[index].airline;
       var civil = list[index].civil;
       var flightNo = list[index].flightNumber;
        if(airline=='UA'){
            this.setData({
                showFirstCabin: false
            })
        }else{
            this.setData({
                showFirstCabin: true
            })
        }
       this.getData(code1,code2,airline,civil,flightNo,"1");
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
                        // 调用热门推荐航线
                        this.getTenAirline();



                        // that.getData('PEK','LAX','CA','0','CA987');

                    }else{//用户不是会员
                        that.setData({
                            vipmenber: false,
                        });
                    }

                }
            });

    },

});
