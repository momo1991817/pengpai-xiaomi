var app = getApp();

Component({

    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,
        currentTab: 0
    },
    methods: {
        goBack: function () {// 返回事件
            this.triggerEvent('myBackevent');
            // wx.navigateBack({
            //     data:1
            // })
        },
        //点击切换
        clickTab: function (e) {
            var that = this;
            if (this.data.currentTab === e.target.dataset.current) {
                return false;
            } else {
                that.setData({
                    currentTab: e.target.dataset.current,
                })
            }
            var volage = '';
            if(this.data.currentTab == 0){
                volage = '国内';
            }else {
                volage = '国际';
            }
            this.triggerEvent('myevent', { volage: volage});
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    onshow: function(){


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
