const app = getApp();
const Request = require('../../utils/request');//导入模块

Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '我的',
        menberTile: '加入会员', //会员标题
        fromAvatar: '',
        from: '',
        nickName:'',
        avatarUrl:'',
        noticeNum: 0,
        vipMenber: false,
    },
    handleTabChange({ detail }) {

        if(detail.key == 'trade'){
            wx.navigateTo({
                url: 'trade/trade',
                //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
            })
        }
        else if(detail.key == 'menber'){
            wx.navigateTo({
                url: 'menber/menber',
                //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
            });
        }
        else if(detail.key == 'notice'){
            wx.navigateTo({
                url: 'notice/notice',
            })
        }
        this.setData({
            current: detail.key
        });
    },


    //获取用户信息
    getMenberInfo:function(){
        var that = this;
        Request.get('/user/getphoneemail',{})
            .then(res =>{
                if(res.code == 200){
                    var data = res.data;
                    if(data.flag){
                        that.setData({
                            menberTile: '我的会员',
                            vipMenber: true,
                            remainNum: data.remainValue
                        });

                    }else{
                        that.setData({
                            menberTile: '加入会员',
                            vipMenber: false,
                        });
                    }
                    that.setData({
                        noticeNum: data.unRead,
                        menberName: data.memberName,
                    })

                }
            });

    },


    //链接到个人信息页面
    linkPersonCenter:function(){
        wx.navigateTo({
            url: 'center/center'
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
          avatarUrl: app.globalData.userInfo.avatarUrl,
          nickName: app.globalData.userInfo.nickName
        });

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
        this.getMenberInfo();  //判断用户是否是会员
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

    },

});
