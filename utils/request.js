const app = getApp();
const { $Toast } = require('../static/iview/base/index');
const socketHttp = "";

const apiHttp = "https://mp.pptravel.cn";
// const apiHttp = "http://192.168.50.47";
// const apiHttp = "http://192.168.50.103"; //晨琳
// const apiHttp = "http://192.168.50.114:808";  //测试环境
// const apiHttp = "http://192.168.31.108:8088";//小胡192.168.31.108:8088


function fun(url,method,data,header){
    data = data || {};
    header = header || {};
    // header = header?{'Authorization': getApp().globalData.userId}:{};
    let sessionId = wx.getStorageSync("userId");
    // let sessionId = getApp().globalData.userId;
    if (sessionId) {
        if (!header || !header["Authorization"]) {
            header["Authorization"] = sessionId;
        }
    }
    let promise = new Promise(function(resolve, reject) {
        wx.request({
            url: apiHttp + url,
            header: header,
            data: data,
            method: method,
            success: function(res){
                if(res.statusCode == 200){


                    if(res.data.code == -101) {//用户没有绑定手机号码
                        wx.navigateTo({
                            url: '../modal/modal',
                        });
                    }
                    else if(res.data.code == -1){
                        $Toast({
                            content: res.data.msg,
                            type: 'error'
                        });
                    }
                    else if(res.data.code == -7){
                        $Toast({
                            content: '您已经提交过，请误重新提交！',
                            type: 'error'
                        });
                    }
                    else if(res.data.code == -8){
                        $Toast({
                            content: '此手机号已经注册过了！',
                            type: 'error'
                        });
                    }
                    else if(res.data.code == -12){
                        $Toast({
                            content: '您输入的验证码错误，请重新输入！',
                            type: 'error'
                        });
                    }
                    else if(res.data.code == -11){
                        $Toast({
                            content: '验证码过期了！',
                            type: 'error'
                        });
                    }
                    else if(res.data.code == -13){

                        $Toast({
                            content: '您已经申请过试用版，不能重复申请',
                            type: 'error'
                        });
                        // return resolve(res.data.code);
                    }
                    else if(res.data.code == -14){

                        $Toast({
                            content: '您还不是会员！',
                            type: 'error'
                        });
                        // return resolve(res.data.code);
                    }
                    else if(res.data.code == -15){
                        $Toast({
                            content: res.data.msg,
                            type: 'error'
                        });
                        // return resolve(res.data.code);
                    }
                    else if(res.data.code == -16){
                        $Toast({
                            content: '预警监控次数已用完，请前往会员中心加购！',
                            type: 'error'
                        });
                        // return resolve(res.data.code);
                    }
                    else if(res.data.code == -17){
                        $Toast({
                            content: '您的权限不够！',
                            type: 'error'
                        });
                    }
                    else if(res.data.code == -18){
                        $Toast({
                            content: '该套餐已下架！',
                            type: 'error'
                        });
                    }
                    else if(res.data.code == -19){
                        $Toast({
                            content: '您还不是公司会员！',
                            type: 'error'
                        });
                    }
                    else if(res.data.code == -20){
                        $Toast({
                            content: res.data.msg,
                            type: 'error'
                        });
                    }
                    else if(res.data.code == -100){

                        wx.navigateTo({
                            url: '../launch/launch'
                        })
                    }
                    return resolve(res.data);
                }
            },
            fail: function(res){
                wx.showModal({
                    title: '网络请求出错',
                    content: res.errMsg,
                    showCancel:false,
                    success: function(res){
                        if(res.confirm){
                            wx.navigateBack({
                                delta: -1
                            });
                        }
                    }
                })
            },

            complete: function() {
                // wx.hideNavigationBarLoading();
            }
        });
    });

    return promise;
}

module.exports = {
    apiHttp: apiHttp,

    socketHttp: socketHttp,

    "get": function(url, data, header) {
        return fun(url,"GET",data,header);
    },

    "post": function(url,data,header){
        return fun(url,"POST",data, header);
    },

    upload: function(url,name,filePath){
        return upload(url,name,filePath);
    }
};
