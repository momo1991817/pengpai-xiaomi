var app = getApp();
const { $Toast } = require('../../../static/iview/base/index');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,

        code: '',//预定号
        surname: '',//姓氏
        name: '',//名字

        codeError: false,
        surnameError: false,
        nameError: false
    },

    onBackEvent:function(){
        wx.navigateBack({
            data:'1'
        })
    },

    //用户输入预定编码
    bindCodeInput(e){
        this.setData({
            code: e.detail.value
        })
    },
    //用户输入姓氏
    bindSurnameInput(e){
        this.setData({
            surname: e.detail.value
        })
    },

    //用户输入名字
    bindNameInput(e){
        this.setData({
            name: e.detail.value
        })
    },


    //绑定提交
    handleSubmit: function(){
       var code = this.data.code;
       var surname = this.data.surname;
       var name = this.data.name;
       if(code == ''){
           this.setData({
               codeError: true
           });
           $Toast({
               content: '预定号不能为空！',
               type: 'error'
           });
       }
        if(surname == ''){
            this.setData({
                surnameError: true
            });
            $Toast({
                content: '姓氏不能为空！',
                type: 'error'
            });
        }
        if(name == ''){
            this.setData({
                nameError: true
            });
            $Toast({
                content: '名字不能为空！',
                type: 'error'
            });
        }
        if(code!=''&&surname!=''&&name!=''){
            this.setData({
                codeError:false,
                nameError: false,
                surnameError: false
            });
            console.log(code,surname,name)
        }

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
