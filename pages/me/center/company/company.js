const app = getApp();
const { $Toast } = require('../../../../static/iview/base/index');
const Request = require('../../../../utils/request');//导入模块
Page({

    /**
     * 页面的初始数据
     */
    data: {
        company: '',//用户提交的公司
        companyId: '',//用户提交的公司ID

        modal: false, //显示弹窗


        list: [],
        showType: false,//false 显示模糊搜索结果，true 五家推荐公司
        showInfo: false, //是否查到信息，true表示没有数据

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

    onBackEvent:function(){
        wx.navigateBack({
            delta: 1
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({

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
        this.getCompany();
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





    //获取五家有名气的公司
    getCompany: function(){
        var that = this;
        // this.setData({
        //     showType:true
        // });

        Request.get('/user/userIfBindingCompany',{})
            .then(res =>{
                if(res.code == 200){
                    that.setData({
                        list: res.data,
                        showType:true,
                        showInfo: false,
                    })
                }
            });

    },

    //模糊搜索获取数据
    getVague:function(event){
        var reg = /^[\u4E00-\u9FA5]{1,}$/;
        var val = event.detail.value;
        if(reg.test(val)){
            var that = this;
            Request.post("/user/getCompanyByName",{companyName: val})
                .then(res =>{
                    if(res.code == 200){
                        if(res.data.length == 0){
                            that.setData({
                                showInfo: true,
                                showType: false,
                                list: []
                            })
                        }else{
                            that.setData({
                                list: res.data,
                                showType:false,
                                showInfo: false,
                            })
                        }
                    }
                });

        }
        else if(val == ''){
            this.getCompany();
        }

    },

    //清空输入框值
    clearValue:function(){
        this.setData({
            company: '',
            showInfo: false,
        });
        this.getCompany();
    },

    //选择值  //******用户选择公司*********//
    selectVal:function(e){
        var id = e.currentTarget.dataset.id;
        var name = e.currentTarget.dataset.name;
        this.setData({
            company: name,
            companyId: id,
            modal: true
        });
    },


    //弹出框事件 关闭
    handleClose:function(){
        this.setData({
            modal: false
        });
    },

    //弹出框事件   提交绑定公司

    // 绑定公司窗口按钮事件
    handleAction ({ detail }) {
        const index = detail.index;

        if (index === 0) {//取消
            this.setData({
                modal: false
            });
        }
        else if (index === 1) {//确认删除
            var id = this.data.companyId;
            var that = this;
            Request.post('/user/userBindingCompany',{id: id})
                .then(res =>{
                    if(res.code == 200){
                        that.setData({
                            modal: false
                        });
                        $Toast({
                            content: '提交成功，等待审核···',
                            type: 'success'
                        });
                        setTimeout(function(){
                            wx.navigateBack({
                                data: 1
                            })
                        },1000);
                    }else{
                        that.setData({
                            modal: false
                        });
                    }
                });
        }
    },
});
