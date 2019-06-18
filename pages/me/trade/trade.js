const app = getApp();
const Request = require('../../../utils/request');//导入模块
const { $Toast } = require('../../../static/iview/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],//交易记录表
        hasData: true, //是否有数据
    },

    onBackEvent:function(){
        wx.navigateBack({
            delta: 1
        })
    },
    //获取交易记录
    getTradeInfo: function(){
        var that = this;
        Request.get('/user/wxPayLogByUserOpenId',{})
            .then(res =>{
                if(res.code == 200){
                    if(res.data.length!=0){
                        var list = [],data = res.data;
                        for(var i=0,l=data.length;i<l;i++){
                            list.push({
                                name: '购买'+data[i].remark,
                                money: data[i].account,
                                date: data[i].callbackTime
                            })
                        }
                        that.setData({
                            list: list,
                            hasData: true
                        })
                    }
                    else{
                        that.setData({
                            hasData: false
                        })
                    }
                }
            });
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

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getTradeInfo();
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

    }
})
