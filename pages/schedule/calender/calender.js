var app = getApp();
const Request = require('../../../utils/request');//导入模块
Page({
    /**
     * 页面的初始数据
     */
    data: {


        week: ['日', '一', '二', '三', '四', '五', '六'],
        year: [],

        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,
        datelist:{},

        nowDate: '',

    },

    onBackEvent:function(){
        wx.navigateBack({
            data:'1'
        })
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
        this.getYearMonth();//渲染日历
        this.getSchedule(); //渲染用户的日程数
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

    onLoad: function (options) {

    },
    getDateSchedule:function(e){
        app.globalData.scheduleDate = e.currentTarget.dataset.date;
        wx.switchTab({
            url: '../schedule',
        });
    },
    // 构造一年内的数据
    getYearMonth: function () {
        var now = new Date();
        var year = now.getFullYear();
        var Nmonth = now.getMonth() + 1,month,str,json = {},arr=[];
        // var str = year+"年"+month+"月";
        var fullYear = [];
        for(var i=0;i<(13-Nmonth);i++){
            month = Nmonth+i;
            str = year+"年"+month+"月";
            arr = this.calender(year,month);
            json[`${str}`] = arr;
            fullYear.push(str);
        }
        year = fullYear.length==12?year:(year+1);
        for(var j = 1;j<Nmonth;j++){
            month=j;
            str = year+"年"+month+"月";
            arr = this.calender(year,month);
            json[`${str}`] = arr;
            fullYear.push(str);
        }

        this.setData({
            datelist: json,
            year: fullYear,
            nowDate: new Date().getFullYear()+'-'+(Nmonth<10?'0'+Nmonth:Nmonth)+'-'+(new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate())
        })

    },

    //根据年月  获取当前的日历表
    calender(year,month) {
        var arr = [];

        //new data 有三个参数: 1,年 2.月 3.默认是1 如果是0,表示上个月最后一天 - 前两天 3 后天
        var nowMonthLength = new Date(year, month, 0).getDate();
        var nowMonthFirstWeek = new Date(year, month - 1).getDay();
        var lastMonthLength = new Date(year, month - 1, 0).getDate();

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
                    day: lastMonthLength,
                    cur: true,
                    num: 0,
                    fullDay: pyear+'-'+buling(pmonth)+'-'+buling(lastMonthLength),
                });
                lastMonthLength--;
            }

        }else{
            // 补充上个月的最后几天
            while (nowMonthFirstWeek--) {
                arr.unshift({
                    day: lastMonthLength,
                    cur: true,
                    num: 0,
                    fullDay: pyear+'-'+buling(pmonth)+'-'+buling(lastMonthLength),
                });
                lastMonthLength--
            }
        }



        //本月天数
        var _a = 1;
        while (nowMonthLength--) {
            arr.push({
                day: _a,
                cur: false,
                num: 0,
                fullDay: pyear+'-'+buling(month)+'-'+buling(_a)
            });
            _a++
        }

        //下个月补全
        var nextLength = arr.length > 35 ? 42 - arr.length : 42 - arr.length;
        _a = 1;
        while (nextLength--) {
            arr.push({
                day: _a,
                cur: true,
                num: 0,
                fullDay: nyear+'-'+buling(nmonth)+'-'+buling(_a)
            });
            _a++
        }

        return arr;
    },

    //获取用户的日程信息
    getSchedule: function(){
        var that = this;
        Request.post('/schedule/statistics',{})
            .then(res =>{
               if(res.code == 200){
                   var json = res.data;
                   var list = that.data.datelist;
                   for(var i=0;i<json.length;i++){
                       for(var key in json[i]){
                           var day = key;
                           var str = day.split('-')[0]+"年"+parseInt(day.split('-')[1])+"月";
                           if(list[`${str}`] == ''||list[`${str}`] == null ||list[`${str}`] == undefined){ //返回的日程有些是过去的

                           }
                           else{
                               for(var j=0,l=list[`${str}`].length;j<l;j++){
                                   if(list[str][j].day == parseInt(day.split('-')[2])){
                                       list[str][j].num = json[i][day];
                                   }
                               }
                           }
                       }
                   }
                   that.setData({
                       datelist: list
                   });
                   if(json.length != 0){
                       wx.setStorageSync('firstLogin',false);
                   }
               }
            });



    },

});
