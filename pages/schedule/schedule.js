var app = getApp();
const Request = require('../../utils/request');//导入模块
const { $Toast } = require('../../static/iview/base/index');
Page({
    /**
     * 页面的初始数据
     */
    data: {

        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,
        list: [],  //日程列表
        passenger: {}, //乘客列表

        scheduleDate:'',//搜索日期
        nowDate: '', //当前时间
        showNoSchedule: false, //是否显示提醒

        firstLogin: false, //今天时间

        visible: false,
        actions: [
            {
                name: '确定',
                color: '#2d8cf0',
            },
            {
                name: '取消',
                color: '#495060'
            }
        ],

        delectPnrNum: '',
        delectDate: '',
        delectFlightNum: ''
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
        this.getTodayDate();//获取当前日期
        if(app.globalData.scheduleDate == ''){
            this.setData({
                scheduleDate: this.data.nowDate
             });
        }else{
            this.setData({
                scheduleDate: app.globalData.scheduleDate
            });
        }
        this.getDetailAccordingDate(this.data.scheduleDate);
        this.setData({
           firstLogin: wx.getStorageSync('firstLogin')
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


    //获取今天的日期  2019-04-23
    getTodayDate:function(){
        var now = new Date();
        var y = now.getFullYear();
        var m = now.getMonth()+1;
        var d = now.getDate();
        if(m<10){m = '0'+m;}
        if(d<10){d='0'+d;}
        this.setData({
            nowDate: y+'-'+m+'-'+d
        });
        return '今天'+y+'-'+m+'-'+d;
    },


    // 通过时间获取日期详情
    getDetailAccordingDate: function(date){
        var that = this;
        Request.post('/schedule/list',{
            departureFlightDateStart: date,
            departureFlightDateEnd: date
        })
            .then(res =>{
                if(res.code == 200){

                    var obj = res.data;
                    if(JSON.stringify(obj) == "{}"){
                        that.setData({
                            showNoSchedule: true,
                            list: obj
                        })
                    }
                    else{
                        var PNRpassenger = [], list = [],data = {};
                        for(var key in obj){
                            data = obj[key][0];
                            var arr = obj[key];
                            // 同一个订单合并
                            for (var i = 0, l = arr.length; i < l; i++) {
                                PNRpassenger.push(arr[i].passengerFirstName + '/' + arr[i].passengerLastName);
                            }
                            data['passengers'] =PNRpassenger;
                            list.push(data);
                            data = [];
                            PNRpassenger = [];
                        }

                        that.setData({
                            showNoSchedule: false,
                            list: list,
                        })
                    }
                }
            });

    },

    // 删除窗口按钮事件
    handleAction ({ detail }) {
        const index = detail.index;

        if (index === 0) {//确认删除
            var that = this;

            Request.post("/schedule/delete",{
                flightDate: this.data.delectDate,
                flightNo: this.data.delectFlightNum,
                pnrNo: this.data.delectPnrNum
            })
                .then(res =>{
                    if(res.code == 200){

                        $Toast({
                            content: '删除成功！',
                            type: 'success'
                        });

                        that.getDetailAccordingDate(this.data.scheduleDate);
                    }
                    that.setData({
                        visible: false
                    });

                });
        }
        else if (index === 1) {//取消
            this.setData({
                visible: false
            })
        }

    },


    //删除行程
    delectSchedule: function(e){
        var pnrNo = e.currentTarget.dataset.id;
        var date = e.currentTarget.dataset.date;
        var flightNo = e.currentTarget.dataset.flightno;
        this.setData({
            visible: true,
            delectPnrNum: pnrNo,
            delectDate: date,
            delectFlightNum:flightNo
        });


    }
});
