const app = getApp();
const { $Toast } = require('../../static/iview/base/index');
const Request = require('../../utils/request');//导入模块

Page({

    /**
     * 页面的初始数据
     */
    data: {
        airline:'',
        airlineNum:'',
        city1: '',
        city2:'',

        startdate: '',
        orderDate: '', //下单时间 年月日

        orderDateStamp:'',//下单时间时间戳
        finishDate: '', //结束时间
        monitorNum: '',//监控次数
        orderStatus: '',//订单状态
        orderType: '',//订单类型
        orderDone: true,

        orderId: '', //订单号

        space:'', //舱位
        ticketNum:'',//票数
        personNum: '',//人数


        // 取消确认窗口
        visible: false,


        arrivalTime: '',
        leaveDate:'',
        leaveTime:'',

        solution: '',
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

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var id = options.id;
        var that = this;

        Request.get("/monitor/detail/"+id,{})
            .then(res =>{
              if(res.code == 200){
                  var data = res.data;
                  var startDate= that.timestampDate(data.departureFlightDate);
                  var orderDate = that.timestampDate(data.createTime);
                  var finishDate = that.timestampDate(data.updateTime);
                  var typeName = '',type='';
                  data.type==0?type='余票订单':type='降舱订单';
                  if(data.status == 0){
                      that.setData({
                          orderStatus: '监控中',
                          orderDone: false
                      });
                  }
                  else if(data.status == 1){
                      that.setData({
                          orderStatus: '已完成',
                          orderDone: true
                      })
                  }

                  that.setData({
                      airline: data.airLineShortName,
                      airlineNum:data.flightNo,
                      city1: data.depCityName,
                      city2: data.arrCityName,
                      space: data.level=='升舱'? data.code+data.level:data.type==0?data.level:data.code+'舱',
                      ticketNum: data.remain,
                      personNum: data.type==0?'需求人数'+data.count+'人':data.remark,

                      type: data.type,  //0为免票1为降舱

                      startdate: startDate,
                      orderDate:orderDate,
                      orderDateStamp: data.createTime,
                      finishDate: finishDate,
                      orderId:data.id,
                      monitorNum: data.monitorNum,

                      arrivalTime:data.arrivalTime,
                      leaveDate: startDate.split(' ')[0],
                      leaveTime: startDate.split(' ')[1],
                      orderType: type,
                      solution: data.solution
                  });
              }
            });

    },

    // 时间戳转时间函数
    timestampDate: function(timestamp){
        var now = new Date(timestamp);
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        var hour=now.getHours();
        var minute=now.getMinutes();

        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (date >= 0 && date <= 9) {
            date = "0" + date;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (minute >= 0 && minute <= 9) {
            minute = "0" + minute;
        }
        return year + "-" + month + "-" + date+" "+hour+":"+minute;
    },

    //计算当前时间是否超过下单30分钟
    NowCompareCreate: function(time){
      var nowStamp = new Date().getTime();
      var createStamp = this.data.orderDateStamp;
      var addTimeStamp = createStamp + 30*60*1000;
      return nowStamp<addTimeStamp;
    },

    //点击取消订单按钮
    handleCancel:function(e){
        this.setData({
            visible: true
        });
    },



    onBackEvent:function(){
        wx.navigateBack({
            delta: 1
        })
    },


    // 删除窗口按钮事件
    handleAction ({ detail }) {
        const index = detail.index;

        if (index === 0) {//取消

            this.setData({
                visible: false
            })

        }
        else if (index === 1) {//确认删除
            var that = this;
            var id = this.data.orderId;

            if(!this.NowCompareCreate()){
                this.setData({
                    visible: false
                });
                $Toast({
                    content: '订单已提交超过30分钟，不能取消！',
                    type: 'warning'
                });
            }
            else{
                Request.get("/monitor/cancel/"+id,{})
                    .then(res =>{
                        that.setData({
                            visible: false
                        });
                        if(res.code == 200){
                            $Toast({
                                content: '删除成功！',
                                type: 'success'
                            });
                            setTimeout(function(){
                                wx.switchTab({
                                    url: '../ticket/ticket',
                                });
                            },1000);
                        }

                    });
            }
        }
        //
        // this.setData({
        //     visible3: false
        // });
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


});
