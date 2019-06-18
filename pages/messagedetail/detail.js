const app = getApp();
const { $Toast } = require('../../static/iview/base/index');
const Request = require('../../utils/request');//导入模块

Page({

    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,
        airline:'',
        airlineNum:'',
        city1: '',
        city2:'',

        startdate: '',
        orderDate: '', //下单时间
        finishDate: '', //结束时间
        monitorNum: '',//监控次数
        orderId: '', //订单号
        orderType: '',//订单状态
        orderStatus:'',//订单类型

        ticketNum:'', //余票数

        orderDone: false, //订单 是预定中  还是已完成
        orderControlType: '',//订单监控状态
        orderControlTypeName: '',//订单监控状态名称

        arrivalTime: '',
        leaveDate:'',
        leaveTime:'',

        space:'', //舱位
        personNum: '',//人数

        visible1:false,
        ShowArrow: true,//是否显示返回箭头

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

    /*****事件函数******/
    OpenModal: function(){
        this.setData({
            visible1: true
        })
    },
    handleClose: function(){
        this.setData({
            visible1: false
        })
    },
    RenewSubmit: function(event){
        var formId = event.detail.formId;
        var id = this.data.orderId;
        var that = this;
        this.setData({
            visible1: false
        });

        Request.post('/monitor/updateFormId',{
            userId: wx.getStorageSync('userId'),
            formId:  formId,
            id: id,
        })
            .then(res =>{
              if(res.code == 200){
                  $Toast({
                      content: '继续监控成功',
                      type: 'success'
                  });
              }
            });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var source;
        if(options.resource){
           source = false;
        }else{
            source = true;
        }
        this.setData({
            orderId: options.id,
            ShowArrow: source
        });
        // console.log(options.id,options.type);

        this.getData(options.id);
        var type = '';
        var bool = Boolean;

        if(options.type == 0) {
            type = '监控成功';
            bool = false;
        }
        else if(options.type ==1){
            type = '监控即将过期';
            bool = true;
            this.setData({
               visible1: true
            });
        }
        else if(options.type == 2){
            type = '航班即将起飞预警!';
            bool = true;
            this.setData({
                visible1: true
            });
        }
        else if(options.type == 3) {
            type = '监控失败';
            bool = false;
        }
        else if(options.type == 4) {
            type = '降舱监控成功';
            bool = false;
        }
        this.setData({
            orderControlType: bool,
            orderControlTypeName: type,
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

    getData:function(id){
        var that = this;
        Request.get("/monitor/detail/"+id,{})
            .then(res =>{
                if(res.code == 200){
                    var data = res.data;
                    var startDate= that.timestampDate(data.departureFlightDate);

                    var orderDate = that.timestampDate(data.createTime);
                    var finishDate = that.timestampDate(data.updateTime);
                    var type;
                    data.type==0?type='余票订单':type='降舱订单';
                    if(data.status == 0){
                        that.setData({
                            orderType: '监控中',
                            orderDone: false
                        });
                    }
                    else if(data.status == 1){
                        that.setData({
                            orderType: '已完成',
                            orderDone: true
                        })
                    }
                    that.setData({
                        airline: data.airLineShortName,
                        airlineNum: data.flightNo,
                        city1: data.depCityName,
                        city2: data.arrCityName,
                        space:  data.level=='升舱'? data.code+data.level:data.type==0?data.level:data.code+'舱',
                        personNum: data.type==0?'需求人数'+data.count+'人':data.remark,
                        startdate: startDate,
                        orderDate:orderDate,
                        orderId: data.id,
                        ticketNum: data.remain,

                        finishDate: finishDate,
                        monitorNum: data.monitorNum,

                        arrivalTime:data.arrivalTime,
                        leaveDate: startDate.split(' ')[0],
                        leaveTime: startDate.split(' ')[1],
                        orderStatus: type
                    });
                }
            });

    },

    onBackEvent:function(){
        wx.navigateBack({
            data:1
        })
    },


    // 删除窗口按钮事件
    handleAction ({ detail }) {
        const index = detail.index;

        if (index === 0) {//取消继续监控
            this.setData({
                visible1: false
            })
        }
        else if (index === 1) {//确定继续监控

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
        this.getData(this.data.orderId);
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

    /*** 页面相关事件处理函数--监听用户下拉动作*/
    onPullDownRefresh: function () {

    },
    /*** 页面上拉触底事件的处理函数*/
});
