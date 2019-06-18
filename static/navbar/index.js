var app = getApp();

Component({

    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,
    },
    properties: {
        navbarTitle: String,   //navbarData   由父页面传递的数据，变量名字自命名
        navbarIcon: Boolean
    },
    methods: {
        goBack: function () {// 返回事件
            // wx.navigateBack({
            //     delta: 1,
            // })
            this.triggerEvent('myBackevent');
        }
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


})
