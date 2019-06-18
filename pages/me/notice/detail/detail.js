const app = getApp();
const Request = require('../../../../utils/request');//导入模块
const { $Toast } = require('../../../../static/iview/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
      title: '',
      time: '',
      message: '',
      type: 0,
        id: '',
        orderId: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       var id = options.id;
       this.getContent(id);
    },
    onBackEvent:function(){
        wx.navigateBack({
            delta: 1
        })
    },
    bindClick: function(e){
        var type = e.currentTarget.dataset.type;
        Request.get("/monitor/detail/"+this.data.orderId,{})
            .then(res =>{
                if(res.code == 200){
                    wx.navigateTo({
                        url:"../../../detail/detail?id="+this.data.orderId+"&type="+type+"&resource=1"
                    })
                }else if(res.code == -1){
                    $Toast({
                        content: res.data.msg,
                        type: 'error'
                    });
                }
            });


    },
    getContent: function(id){
        var that = this;
        Request.get("/message/detail/"+id,{})
            .then(res =>{
               if(res.code == 200){
                   var data = res.data;

                   that.setData({
                       title: data.title,
                       time: that.timestampDate(data.createTime),
                       message: data.message,
                       type: data.flag,
                       orderId: data.orderId,
                       id: data.id
                   })
               }
            });

    },

    //删除消息
    delectClick:function(){
        $Toast({
            content: '删除中',
            type: 'loading',
            duration: 0,
        });
        var id = this.data.id;
        var arr = [];
        arr.push(id);
        Request.post('/message/delMessge',{
           ids: arr
        })
            .then(res =>{
              if(res.code == 200){
                  $Toast.hide();
                  $Toast({
                      content: '删除成功',
                      type: 'success'
                  });
                  setTimeout(function(){
                      wx.navigateTo({
                          url: '../notice'
                      })
                  },1000);

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
