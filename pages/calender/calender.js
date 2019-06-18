const { $Toast } = require('../../static/iview/base/index');
Page({
    data: {
         year: 0,
         month: 0,
         date: ['日', '一', '二', '三', '四', '五', '六'],
         dateArr: [],
         isToday: 0,
         isTodayWeek: false,
         todayIndex: 0,
         isNow:0,
         NowYear: '',
         NowMonth: '',
         preDisable: true,

        code1:'',//出发城市三字码
        code2:'',//到达城市三字码
        seats:'',//舱位号
        Rseats:'',//返程舱位号
        startDate: '',//启程日期
        RstartDate:'',//回程日期
        volage: '',//航程 单程、往返

        city1: '',
        city2: '',
        civil: '',


    },
    //********事件*******//
    getDate: function(e){
        var date = e.currentTarget.dataset.date;
        var  str= 'code1='+this.data.code1+
            '&code2='+this.data.code2+
            '&volage='+this.data.volage+
            '&seats='+this.data.seats+
            '&startdate='+date+
            '&Rseats='+this.data.Rseats+
            '&RstartDate='+this.data.RstartDate+
            '&city1='+this.data.city1+
            '&city2='+this.data.city2+
            '&civil='+this.data.civil+
             '&formId='+'';
      if(this.data.isNow<=date){
          wx.redirectTo({
              url:'../search/query?'+str
          });
      }

    },
    // 点击关闭事件
    onMyEvent:function(e) {
        var  str= 'code1='+this.data.code1+
            '&code2='+this.data.code2+
            '&volage='+this.data.volage+
            '&seats='+this.data.seats+
            '&startdate='+this.data.startDate+
            '&Rseats='+this.data.Rseats+
            '&RstartDate='+this.data.RstartDate+
            '&city1='+this.data.city1+
            '&city2='+this.data.city2+
         　　'&civil='+this.data.civil+
        　　 '&formId='+'';
        wx.redirectTo({
            url:'../search/query?'+str
        });
    },


    onLoad: function (options) {
       let now = new Date();
       let year = now.getFullYear();
       let month = now.getMonth() + 1;
       var months = month;
       this.calender(year,month);
        let date = now.getDate();
        if(months<10){
            months='0'+months;
        }
        if(date<10){
            date='0'+date;
        }
       this.setData({
            year: year,
            month: month,
            NowYear: year,
            NowMonth: month,
            isToday: ''+year +month + now.getDate(),
            isNow: year+'-'+months+'-'+date,

           code1: options.code1,
           code2: options.code2,

           city1: options.city1,
           city2: options.city2,


           seats:options.seats,
           Rseats:options.Rseats,

           startDate:options.startdate,
           RstartDate:options.RstartDate,

           volage: options.volage,
           civil: options.civil
      });
     },
    dateInit: function (setYear, setMonth) {

     //全部时间的月份都是按0~11基准，显示月份才+1
      let dateArr = [];                        //需要遍历的日历数组数据
      let arrLen = 0;                            //dateArr的数组长度
      // let now = setYear ? new Date(setYear, setMonth) : new Date();
      // if(setMonth<10){setMonth= '0'+setMonth}
        if(setMonth == 0){setMonth = 12}
      let now = setYear?new Date(setYear+"/"+setMonth): new Date();
      let year = setYear || now.getFullYear();
      let nextYear = 0;

      let month = setMonth || now.getMonth();                    //没有+1方便后面计算当月总天数
      let nextMonth = (month + 1) > 11 ? 1 : (month + 1);

      var months = month+1;
      if(months<10){months='0'+months;}
       // console.log(months);
      let startWeek = new Date(year+"/"+months+"/"+'01').getDay();   ////                         //目标月1号对应的星期
      var nextMonths = nextMonth+1;
      if(nextMonths<10){nextMonths='0'+nextMonths;}
      // let dayNums = new Date(year,nextMonth,0).getDate();     ////           //获取目标月有多少天
      var MinusD = (new Date(year+"/"+(nextMonth+1)+"/"+"01").getTime()-24*60*60*1000);
        // console.log(new Date(MinusD).getDate());
      let dayNums = new Date(MinusD).getDate();
      //   let dayNums = new Date(year+"/"+nextMonths).getDate();     ////           //获取目标月有多少天
      let obj = {};
      let num = 0;
      if (month + 1 > 11) {
             nextYear = year + 1;
            dayNums = new Date(nextYear, nextMonth, 0).getDate();
       }

      var monthStr = month+1;
      if((monthStr)<10){
            monthStr='0'+monthStr;
        }

       arrLen = startWeek + dayNums;
      // console.log(arrLen,startWeek);

      for (let i = 0; i < arrLen; i++) {
           if (i >= startWeek) {
                 num = i - startWeek + 1;
                 var dateStr = num;
                 if(dateStr<10){
                     dateStr='0'+dateStr;
                 }

                obj = {
                      date: year+'-'+monthStr+'-'+dateStr,
                      dateNum: num,
                      weight: 5
                 }
               } else {
                 obj = {};
              }
           dateArr[i] = obj;
        }

        this.setData({
          dateArr: dateArr
       });

        let nowDate = new Date();
        let nowYear = nowDate.getFullYear();
        let nowMonth = nowDate.getMonth() + 1;
        let nowWeek = nowDate.getDay();
        let getYear = setYear || nowYear;
        let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

       if (nowYear == getYear && nowMonth == getMonth) {
            this.setData({
                isTodayWeek: true,
                todayIndex: nowWeek
            })
          }
          else {
            this.setData({
               isTodayWeek: false,
               todayIndex: -1
        })
       }
      },
    lastMonth: function () {
    //全部时间的月份都是按1~12基准，显示月份才+1
        let year = this.data.month - 1 < 1 ? this.data.year - 1 : this.data.year;
        let month = this.data.month - 1 < 1 ? 12 : this.data.month - 1;
        if(year == this.data.NowYear && month<this.data.NowMonth){
             this.setData({
                 preDisable: true
             })
        }else{
            this.setData({
                year: year,
                month: month,
                preDisable: false
            });
            this.calender(year, month);
        }

       },

    nextMonth: function () {
        //全部时间的月份都是按0~11基准，显示月份才+1
       let year = this.data.month == 12 ? this.data.year + 1 : this.data.year;
       let month = this.data.month == 12 ? 1 : this.data.month+1;
         this.setData({
             year: year,
             month: month,
             preDisable: false
       });
        this.calender(year, month);
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
                fullDay: nyear+'-'+buling(nmonth)+'-'+buling(_a)
            });
            _a++
        }
        this.setData({
            dateArr: arr,
        })
    },

 });
