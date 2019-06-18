// let inlandCity = require('./inlandcity.js');
// let foreign = require('./foreigncity.js');
var app = getApp();
const Request = require('../../utils/request');//导入模块

Page({
    data : {
        current: '1',
        // inlandCity: inlandCity,
        // foreignCity: foreign,
        inlandCity: [],
        foreignCity: [],

        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight,
        config: {
            horizontal: true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
            animation: true, // 过渡动画是否开启
            search: true, // 是否开启搜索
            searchHeight: 45, // 搜索条高度
            suctionTop: true // 是否开启标题吸顶
        },


        list: [],  //城市列表

        rightArr: [], // 右侧字母展示
        ForeignRightArr: [], //国外右侧字母
        jumpNum: '', //跳转到那个字母

        topGroup: [], // 内容高度数据
        foregintopGroup: [],//国外内容高度数据

        pos: {
            isTop: false,
            y: 0,
            oldIndex: -1
        },
        listIndex: 0,     //国内
        foreginIndex: 0, //国外

        moveDistance: 0,

        showList: true,
        showLoading: true,
        whichType: 1,

        whichCity: '', //接收传递过来的是出发城市（1）还是到达城市（2）
        whichHome:0,   //表示从哪个页面来请求的，1为home,2为dowmgrade,3为推荐表筛选框
        inland: true,

        inputVal: '',//用来监控输入框状态
    },
    // 切换国内或者国际港澳台城市
    handleChange ({ detail }) {
        this.setData({
            current: detail.key,
            showLoading: true,
        });
        this.onMyEvent(detail.key);
    },

    onLoad(options) {
        this.setData({
            whichCity:options.id,
            showLoading: true,
            whichHome: options.home
        });
        this.getCitys();
        var that = this;
        var time = setInterval(function(){
            var inlandCity = wx.getStorageSync('inlandCity');
            if(inlandCity.length!=0){
                that.resetRight(inlandCity);
                clearInterval(time);
            }
        },1000);
    },

    onShow(){
        var inlandCity = wx.getStorageSync('inlandCity');
        this.resetRight(inlandCity);
    },

    //用户选择国内 国际城市的动作
    onMyEvent:function(e){
        this.setData({
            list: [],
            rightArr: [],
            showLoading: true,
            whichType: e
        });
        if(this.data.inputVal!=''){
            this._search();
            this.setData({
                showLoading: false
            });
        }else{
            if(e == '2') {
                var foreign = wx.getStorageSync('foreignCity');
                this.resetRight(foreign);
            }
            else if(e == '1') {
                var inland = wx.getStorageSync('inlandCity');
                this.resetRight(inland);
            }
        }


        this.data.showList = false

    },

    //返回的页面判断执行
    onBackEvent: function(){
        var home = this.data.whichHome;

        if(home == 1){
            wx.switchTab({
                url:'../home/home'
            })
        }
        else if(home == 2){
            wx.switchTab({
                url: '../downgrade/downgrade'
            })
        }
        else if(home == 3){
            wx.navigateTo({
                url: '../list/list?Resourse=1'
            })
        }
    },

    // 获取国内外城市信息并保存在本地
    getCitys: function(){
        var that = this;
        Request.get('/city/findcity',{})
            .then(res =>{
             if(res.code == 200){
                 var data = res.data;
                 that.setData({
                     inlandCity: data.inlandCity,
                     foreignCity:data.foreign
                 });
                 wx.setStorageSync('inlandCity', data.inlandCity);
                 wx.setStorageSync('foreignCity', data.foreign);
             }
            });

    },
    // 城市列表函数

    /*** 城市页面数据渲染*****/
    resetRight(data) {
        let rightArr = [];
        for (let i in data) {
            rightArr.push(data[i].title.substr(0, 1));
        }
        this.setData({
            list: data,
            rightArr,
            showLoading: false
        }, () => {
            this.queryMultipleNodes();
        });
    },

    ForeignresetRight(data) {
        let rightArr = [];
        for (let i in data) {
            rightArr.push(data[i].title.substr(0, 1));
        }
        this.setData({
            foreginlist: data,
            ForeignRightArr: rightArr,
            showLoading: false
        }, () => {
            this.queryMultipleNodes();
        });
    },

    resetReload(data){
        this.setData({
            list: data,
        }, () => {
            if (data.length != 0) {
                this.queryMultipleNodes();
            }
        });
    },


    /*** 右侧字母点击事件*/
    jumpMt(e) {
        let jumpNum = e.currentTarget.dataset.id;
        this.setData({
            jumpNum: jumpNum
        });
    },


    /*** 列表点击事件*/
    detailMt(e) {
       let detail = e.currentTarget.dataset.detail;

        var name = detail.name.split("(")[0];
        var code = detail.code;
        if(this.data.whichHome == "1") {//免票
            if(this.data.whichCity === "1") {
                getApp().globalData.leavecity = name;
                getApp().globalData.leaveCode = code;
            }
            else if(this.data.whichCity === "2"){
                getApp().globalData.arrivecity = name;
                getApp().globalData.arriveCode = code;
            }
            var that = this;
            wx.switchTab({
                url: '../home/home',
                success:function(){},        //成功后的回调；
                fail:function(error){console.log('失败'+error)},         //失败后的回调；
                complete:function(){}
            });
        } //免票
        else if(this.data.whichHome == "2"){
            if(this.data.whichCity === "1") {
                getApp().globalData.leavecity2 = name;
                getApp().globalData.leaveCode2 = code;
            }
            else if(this.data.whichCity === "2"){
                getApp().globalData.arrivecity2 = name;
                getApp().globalData.arriveCode2 = code;
            }
            wx.switchTab({
                url: '../downgrade/downgrade',
                success:function(){},        //成功后的回调；
                fail:function(error){console.log('失败'+error)},         //失败后的回调；
                complete:function(){}
            });
        } //降舱
        else if(this.data.whichHome == "3"){ //热门航线推送
            if(this.data.whichCity === "1") {
                getApp().globalData.leavecity3 = name;
                getApp().globalData.leaveCode3 = code;
            }
            else if(this.data.whichCity === "2"){
                getApp().globalData.arrivecity3 = name;
                getApp().globalData.arriveCode3 = code;
            }
            wx.navigateTo({
                url: '../list/list?Resourse=1',
                success:function(){},        //成功后的回调；
                fail:function(error){console.log('失败'+error)},         //失败后的回调；
                complete:function(){}
            });
        } //推送表

    },

    // 获取搜索输入内容
    input(e) {
        this.value = e.detail.value;
        this.setData({
            inputVal: e.detail.value
        });
        var reg =/^[\u4e00-\u9fa5]{1,}$/;
        if(reg.test(this.value)|| /^[a-zA-Z]{2,}$/.test(this.value)){//中文
            this.value = this.value.toUpperCase();
            this._search();
        }
        else if(this.value == ''){
            var type = this.data.whichType;
            var arr = [];
            if(type=='1') {
                arr = this.data.inlandCity;
            }
            else{
                arr = this.data.foreignCity;
            }

            this.setData({
                showList: true,
                showLoading: true,
            });
            this.resetRight(arr);
        }
        else {
            this.setData({
                list: []
            });
        }
    },
    //获取焦点时的事件
    inputFocus(){
        var suction = 'config.suctionTop';
        this.setData({
            [suction]: false
        });
    },


    /*** 搜索相关逻辑实现*/
    _search() {
        var type = this.data.whichType;
        var arr = [];
        let itemArr = [];
        if(type== '1') {
            arr = this.data.inlandCity;
            for (let i = 1; i < arr.length; i++) {
                for (let j = 0; j < arr[i].item.length; j++) {
                    if( arr[i].item[j].code.indexOf(this.value) > -1 || arr[i].item[j].name.indexOf(this.value) > -1){
                        itemArr.push(arr[i].item[j]);
                    }
                }
                if (itemArr.length === 0) {
                    continue;
                }
            }

        }
        else if(type == '2') {
            arr = this.data.foreignCity;
            for (let i = 1; i < arr.length; i++) {
                for (let j = 0; j < arr[i].item.length; j++) {
                    if( arr[i].item[j].code.indexOf(this.value) > -1 || arr[i].item[j].name.indexOf(this.value) > -1){
                        itemArr.push(arr[i].item[j]);
                    }
                }
                if (itemArr.length === 0) {
                    continue;
                }
            }

        }

        if(itemArr.length>0){
            this.resetReload(itemArr);
            this.setData({
                showList: false
            })
        }
    },


    /**
     * 监听滚动
     */
    scroll(e) {
        let top = e.detail.scrollTop;//页面滚动高度
        let index = this.currentIndex(top); //获取是第几个字母

        let list = this.data.topGroup;//获取所有字母距离
        let distance = top - list[this.data.listIndex];
        let num = -(list[this.data.listIndex + 1] - top - 40);

        // 渲染滚动索引
        if (index !== this.data.listIndex) {
            this.setData({
                // 'pos.oldIndex': main_past,
                listIndex: index,
                moveDistance: 40,
            });
            // 如果监听到 main_past 的变化 ，一定要return ，否则吸顶会先变化文字后运动，会闪烁
            return
        }
        if (num < 0) num = 0;
        if (num !== this.data.moveDistance) {
            this.setData({
                moveDistance: num,
            })
        }
    },
    /**
     * 获取当前滚动索引
     */
    currentIndex(y) {
        let listHeight = this.data.topGroup;//获取内容高度数据

        for (let i = 0; i < listHeight.length; i++) {
            let height1 = listHeight[i];
            let height2 = listHeight[i + 1];
            if (y >= height1 && y < height2) {
                // console.log(i,y);
                return i
            }
            if(y<=listHeight[0]){
                return 0
            }
        }
    },
    /**
     * 获取节点信息
     */
    queryMultipleNodes() {
        let self = this;
        const query = wx.createSelectorQuery().in(this);
        query.selectAll('.fixed-title-hock').boundingClientRect((res) => {
            res.forEach(function(rect) {
                rect.top; // 节点的上边界坐标
            })
        }).exec((e) => {
            let arr = [];
            e[0].forEach((rect) => {
                let num = 0;
                if (rect.top !== 0) {
                    // num = rect.top - (self.data.config.search ? self.data.config.searchHeight : 0);
                    //每个字母之间的距离 - 标题栏  - 搜索框 - tab
                    num = rect.top - (self.data.config.search ? self.data.config.searchHeight : 0)-
                        this.data.statusBarHeight-this.data.titleBarHeight-87;
                }

                arr.push(num)
            });
            this.setData({
                topGroup: arr
            })
        })
    }
});




