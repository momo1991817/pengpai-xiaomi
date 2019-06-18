const Request = require('../../../utils/request');//导入模块
const { $Toast } = require('../../../static/iview/base/index');

Page({

    /**
     * 页面的初始数据
     */
    data: {
       date: '',
       years:'2019',
       months: '01',

       page: 1,
       list: [],
       hasData: true, //用户是否有消息

       showInfo: false,//没有信息提示
       showLoading: false,//显示刷新

        visible: false, //提醒用户是否删除
        delectId: '',//删除Id
        actions: [
            {
                name: '删除',
                color: '#ed3f14'
            }
        ],
    },

    onBackEvent:function(){
        wx.navigateBack({
            delta: 1
        })
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
       // this.getNotice(1);
    },
    //获取数据
     getNotice: function(page,limit){
        var arr;
        if(page == 1){
            arr = [];
        }else{
            arr = this.data.list;
        }
        this.setData({
            showLoading: true,
            list: arr
        });
        var that = this;
         Request.post('/message/list',{
             userId:getApp().globalData.userId,
             limit: limit,
             page:page
         })
             .then(res =>{
                if(res.code == 200){
                    var arr = [];
                    var data = res.data;

                     //用户下拉刷新没有更多信息
                    if(data.length==0&&that.data.list.length!=0){
                        that.setData({
                            showInfo: true,
                            showLoading: false,
                            hasData: true
                        })
                    }
                    //用户还未有任何信息
                    else if(data.length==0&&that.data.list.length==0){
                        that.setData({
                            hasData:false
                        })
                    }
                    else if(data.length!=0){
                        for(var i=0,l=data.length;i<l;i++){
                            arr.push({
                                title: data[i].title,
                                message: data[i].message,
                                time: that.timestampDate(data[i].createTime),
                                status: data[i].status,
                                id: data[i].id,
                            });
                        }
                        if(that.data.list.length!=0){
                            arr= that.data.list.concat(arr);
                        }else{
                            arr = arr;
                        }

                        that.setData({
                            list: arr,
                            showInfo: false,
                            showLoading: false,
                            hasData: true
                        });

                    }


                }
             });

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

    //取消删除选项
    handleCancel () {
        this.setData({
            visible: false,
            toggle : this.data.toggle ? false : true
        });
        // console.log( this.data.toggle,111111111 )
    },
    //用户确认删除订单
    handleClickItem () {
        const action = [...this.data.actions];
        action[0].loading = true;

        this.setData({
            actions: action
        });
        var that = this;
        var arr = [];
       arr.push(this.data.delectId);
        var that = this;
        Request.post('/message/delMessge',{
            ids:arr
        })
            .then(res =>{
                if(res.code == 200){
                    $Toast.hide();
                    $Toast({
                        content: '删除成功',
                        type: 'success'
                    });
                    that.getNotice(1,10);
                    that.setData({
                        visible: false
                    })
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
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

        if(parseInt(this.data.page)>1){
            this.getNotice(1,this.data.page*10);
        }else{
            this.getNotice(this.data.page,10);
        }

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
        if(!this.data.showInfo){
            i++;
        }

        this.setData({
            page: i
        });
        // 显示加载图标
        this.setData({
            showLoading: true
        });


        this.getNotice(i,10);
    }
});
