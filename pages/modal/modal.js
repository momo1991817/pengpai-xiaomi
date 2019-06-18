const app = getApp();
const { $Message } = require('../../static/iview/base/index');
const { $Toast } = require('../../static/iview/base/index');
const Request = require('../../utils/request');//导入模块


Page({

    /**
     * 页面的初始数据
     */
    data: {
        visible: true, //用户提交监控
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
    //*****************事件********************///



    onBackEvent:function(){
        wx.switchTab({
            url:'../home/home'
        })
    },



    // 窗口按钮事件
    handleAction ({ detail }) {
        const index = detail.index;

        if (index === 0) {//取消前往
            wx.switchTab({
                url:'../home/home'
            })
        }
        else if (index === 1) {//确定前往注册页面
            wx.navigateTo({
                url: '../register/register',
            });
        }
        //
        // this.setData({
        //     visible3: false
        // });
    },



   //**************************end***************//

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

    },

});
