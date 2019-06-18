var app = getApp();

Component({

    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,
        totalH: app.globalData.statusBarHeight+app.globalData.titleBarHeight,
        currentTab: 0,
        maskTop: app.globalData.statusBarHeight+app.globalData.titleBarHeight+92,
        showView: false,
        // someWay: this.properties.volage&&this.showView
        visible: false,
        actions: [
            {
                name: '选项1',
            },
            {
                name: '选项2'
            }
        ],
    },
    properties: {
        city1: String,
        city2: String,
        startCity: String,
        endCity: String,
        volage: Number
    },
    methods: {
        //点击切换往返信息
        changeVolage: function(){
            this.setData({
                showView: !this.data.showView
            });
        },
        bindmaskClick: function(){
            this.setData({
                showView: !this.data.showView
            });
        },
        airlineChange: function(e){
            var c1 = e.currentTarget.dataset.city1;
            var c2 = e.currentTarget.dataset.city2;
            this.setData({
                city1: c1,
                city2: c2,
                showView: !this.data.showView
            });
            //向上传参数
            this.triggerEvent('myevent', { city1: c1, city2:c2});
        },
        goBack: function(){
            wx.switchTab({
                url:'../home/home'
            })
            // this.triggerEvent('myBackevent');
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


});
