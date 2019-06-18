const app = getApp();
const {  $Toast } = require('../../static/iview/base/index');
const Request = require('../../utils/request');//导入模块

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        showInfo: false,
        showLoading: true, //页面全局加载loading
        showLoadmore: false, //页面下拉刷新样式
        page: 1,//全部订单
        succPage: 1,//监控成功
        errorPage: 1,//监控失败
        hasdata: true,
        current: 1,
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,


        delectId:'', //删除的Id,
        visible: false,
        actions: [
            {
                name: '删除',
                color: '#ed3f14'
            }
        ],
    },
     //******************事件
    onBackEvent:function(){
       wx.navigateBack({
           data:1
       })
    },
    //切换订单类型
    handleChange ({ detail }) {
        this.setData({
            current: detail.key,
            showLoading: true
        });
        this.getDataList(1,detail.key);
    },
     //取消删除选项
    handleCancel () {
        this.setData({
            visible: false,
            toggle : this.data.toggle ? false : true
        });
        // console.log( this.data.toggle,111111111 )
    },
    //用户确认取消订单
    handleClickItem () {
        const action = [...this.data.actions];
        action[0].loading = true;

        this.setData({
            actions: action
        });
        var that = this;
        Request.get('/monitor/delete/'+this.data.delectId,{})
            .then(res =>{
              if(res.code == 200){
                  action[0].loading = false;
                  that.setData({
                      visible: false,
                      actions: action,
                      toggle: that.data.toggle ? false : true
                  });
                  that.getDataList(1,that.data.current);
                  $Toast({
                      content: '删除成功！',
                      type: 'success'
                  });
              }
            });


        // setTimeout(() => {
        //     action[0].loading = false;
        //     this.setData({
        //         visible: false,
        //         actions: action,
        //         toggle: this.data.toggle ? false : true
        //     });
        //
        // }, 2000);
    },
    // 打开actionsheet
    OpenActionsTap(e){
        var id = e.currentTarget.dataset.id;

        this.setData({
            visible: true,
            delectId: id,
        });
    },
    // 关闭actionsheet
    CloseActionsTap(){
        this.setData({
            visible: false
        });
    },

    /*** 生命周期函数--监听页面加载*/
    onLoad: function (options) {
        this.getDataList(1,1);
        this.data.page = 1;
    },

    /*** 生命周期函数--监听页面初次渲染完成*/
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // this.getDataList(1,1);
        // this.data.page = 1;
    },
     // 获取数据
    getDataList: function(page,type){//type 1,全部订单，2监控成功，3监控失败
        var that = this,data;

        if(page ==1){
            this.setData({
                list: [],
                page: 1,
                succPage: 1,//监控成功
                errorPage: 1,//监控失败
            })
        }
        if(type== 1){
            data = {
                userId:getApp().globalData.userId,
                status: 1,
                limit: 10,
                page: page
            }
        }
        else if (type == 2){//成功
            data = {
                userId:getApp().globalData.userId,
                status: 1,
                limit: 10,
                page: page,
                success: 4
            }
        }
        else if (type == 3){//失败
            data = {
                userId:getApp().globalData.userId,
                status: 1,
                limit: 10,
                page: page,
                success: 3
            }
        }

        Request.post('/monitor/list',data)
            .then(res =>{
               if(res.code == 200){
                   var list = [];
                   var data = res.data;
                   var len = that.data.list.length;
                   if(data.length == 0&&len==0){//当用户没有任何订单时
                       that.setData({
                           hasdata: false,
                           showLoading: false,
                           showLoadmore: false
                       });
                   }
                   else if(data.length == 0&&len!=0){//当再次请求时，提醒没有更多数据
                       that.setData({
                           showInfo: true,
                           hasdata: true,
                           showLoading: false,
                           showLoadmore: false
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
                               ticket: data[i].type==0?'需求人数'+data[i].count+'人':data[i].remark,
                               seat: data[i].level=='升舱'?data[i].code+data[i].level:data[i].type==0?data[i].level:data[i].code+'舱',
                               orderId: data[i].id,
                               type: data[i].type
                           });
                       }
                       var lists = that.data.list,arr=[];
                       if(len==0){
                           arr = list;
                       }
                       else{
                           arr = lists.concat(list);
                       }

                       that.setData({
                           hasdata: true,
                           showInfo: false,
                           showLoading: false,
                           showLoadmore: false,
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
        var current = this.data.current;
        if( current ==1) {
             var i = parseInt(this.data.page);
            i++;
            this.setData({
                page: i
            });
            // 显示加载图标
            this.setData({
                showLoadmore: true
            });
            this.getDataList(i,1);
        }else if(current == 2){
            var i = parseInt(this.data.succPage);
            i++;
            this.setData({
                succPage: i,
                showLoadmore: true// 显示加载图标
            });

            this.getDataList(i,2);
        }
        else if(current ==3){
            var i = parseInt(this.data.errorPage);
            i++;
            this.setData({
                errorPage: i,
                showLoadmore: true// 显示加载图标
            });

            this.getDataList(i,3);
        }

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
});
