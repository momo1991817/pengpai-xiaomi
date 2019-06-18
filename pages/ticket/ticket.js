const app = getApp();
const Request = require('../../utils/request');//导入模块
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        showLoading: true,  //加载，进入时的加载
        showInfo: false,  //用户下拉刷新时如果没有更多信息时显示
        page: 1,
        hasdata: false  //当用户没有订单时显示
    },

    // 时间戳转时间函数
    toDate: function(timestamp){
        var now = new Date(timestamp);
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

    changTime: function(time){
        var now = new Date(time);
        var hour=now.getHours();
        var minute=now.getMinutes();

        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (minute >= 0 && minute <= 9) {
            minute = "0" + minute;
        }

        return hour+':'+minute;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // this.getDataList(1);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getDataList(1);
        this.data.page = 1;
    },
    // 获取数据
    getDataList: function(page){
        if(page ==1){
            this.setData({
                list: []
            })
        }
        var that = this;
        Request.post('/monitor/list',{
            userId:getApp().globalData.userId,
            status: 0,
            limit: 10,
            page: page
        })
            .then(res =>{
               if(res.code == 200){
                   var list = [];
                   var data = res.data;
                   var len = that.data.list.length;
                   if(data.length == 0&&len==0){//当用户没有任何订单时
                       that.setData({
                           hasdata: false,
                           showLoading: false
                       });
                   }
                   else if(data.length == 0&&len!=0){//当再次请求时，提醒没有更多数据
                       that.setData({
                           showInfo: true,
                           hasdata: true,
                           showLoading: false
                       });
                   }
                   else{
                       for(var i=0,l=data.length;i<l;i++){
                           var d = that.toDate(data[i].departureFlightDate);
                           var t = that.changTime(data[i].departureFlightDate);
                           list.push({
                               airLineShortName: data[i].airLineShortName,
                               flightNo:  data[i].flightNo,
                               depCityName: data[i].depCityName,
                               arrCityName: data[i].arrCityName,
                               depTime: t,
                               arrTime:data[i].arrivalTime,
                               date: d,
                               ticket: data[i].type==0?'余票'+data[i].remain+'张':'监控中',
                               seat: data[i].level=='升舱'?data[i].code+data[i].level:data[i].type==0?data[i].level:data[i].code+'舱',
                               orderId: data[i].id,
                               type: data[i].type
                           });
                       }
                       var lists = that.data.list,arr=[];
                       if(len==0){
                           arr = list;
                       }else{
                           arr = lists.concat(list);
                       }
                       that.setData({
                           hasdata: true,
                           showInfo: false,
                           showLoading: false,
                           list: arr
                       });

                   }
               }
            });


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
        var i = parseInt(this.data.page);
        i++;
        this.setData({
            page: i
        });
        // 显示加载图标
        this.setData({
            showLoading: true
        });
        this.getDataList(i);
    },

});

