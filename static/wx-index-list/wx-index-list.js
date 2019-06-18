// component/wx-main_past-list/wx-main_past-list.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        /*** 城市数据 传入*/
        data: {
            type: Object,
            value: {},
            observer: function(newVal, oldVal) {
                this.resetRight(newVal);
            }
        },
        /**
         * 配置项
         */
        config: {
            type: Object,
            value: {
                horizontal: true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
                animation: true, // 过渡动画是否开启
                search: true, // 是否开启搜索
                searchHeight: 48, // 搜索条高度
                suctionTop: true // 是否开启标题吸顶
            }
        },
        /**
         * 是否定位我的位置
         */
        myCity: {
            type: Boolean,
            value: false,
        },
        // 用于外部组件搜索使用
        search: {
            type: String,
            value: "",
            observer: function(newVal, oldVal) {
                console.log(newVal);
                this.value = newVal;
                this.searchMt();
            }
        }
    },

    data: {
        list: [],
        rightArr: [], // 右侧字母展示
        jumpNum: '', //跳转到那个字母
        myCityName: '请选择', // 默认我的城市
        topGroup: [], // 内容高度数据
        pos: {
            isTop: false,
            y: 0,
            oldIndex: -1
        },
        listIndex: 0,
        moveDistance: 0,
        showList: true
    },
    ready() {
        // let data = this.data.data;
        // this.resetRight(data);
        // if (this.data.myCity) {
        //   this.getCity()
        // }

    },
    methods: {
        /*** 城市页面数据渲染*****/
        resetRight(data) {
            let rightArr = [];
            for (let i in data) {
                rightArr.push(data[i].title.substr(0, 1));
            }
            this.setData({
                list: data,
                rightArr
            }, () => {
                // if (data.length != 0) {
                //     this.queryMultipleNodes();
                // }
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
            let jumpNum =e.currentTarget.dataset.id;
            this.setData({
                jumpNum: jumpNum,
                listIndex: parseInt(e.currentTarget.dataset.id)
            });
        },

        /*** 列表点击事件*/
        detailMt(e) {
            let detail = e.currentTarget.dataset.detail;
            let myEventOption = {
                bubbles: false, //事件是否冒泡
                composed: false, //事件是否可以穿越组件边界
                capturePhase: false //事件是否拥有捕获阶段
            }; // 触发事件的选项
            this.triggerEvent('detail', detail, myEventOption);
        },

        // 获取搜索输入内容
        input(e) {
            this.value = e.detail.value;
            var reg =/^[\u4e00-\u9fa5]{1,}$/;
            if(reg.test(this.value)||/^[a-zA-Z]$/.test(this.value)){
                this._search();
            }else if(this.value == ''){
                this.resetRight(this.properties.data);
                this.setData({
                    showList: true
                })
            }
            else {
                this.setData({
                   list: []
                });
                // this.data.list = [];
            }
        },
        //获取焦点时的事件
        inputFocus(){
            // this.setData({
                // list: []
                // showList: false,
            // });
            this.triggerEvent('suctionTopEvent', { suctionTop: false});
        },


        /*** 搜索相关逻辑实现*/
        _search() {
            let data = this.data.data;
            let newData = [];
            for (let i = 0; i < data.length; i++) {
                let itemArr = [];
                for (let j = 0; j < data[i].item.length; j++) {
                    if (data[i].item[j].name.indexOf(this.value) > -1) {
                        let itemJson = {};
                        for (let k in data[i].item[j]) {
                            itemJson[k] = data[i].item[j][k];
                        }
                        itemArr.push(itemJson);
                    }
                }
                if (itemArr.length === 0) {
                    continue;
                }
                // console.log(itemArr);
                // newData.push({
                //     title: data[i].title,
                //     // type: data[i].type ? data[i].type : "",
                //     item: itemArr
                // })
                newData = itemArr;
            }
            if(newData.length>0){
                this.resetReload(newData);
                this.setData({
                    showList: false
                })
            }

            // this.resetReload(newData);
        },
        // 城市定位
        locationMt() {
            // TODO 暂时没有实现 定位自己的城市，需要引入第三方api
        },
        /**
         * 监听滚动
         */
        scroll(e) {
            let top = e.detail.scrollTop;
            let index = this.currentIndex(top);
            let list = this.data.topGroup;
            let distance = top - list[this.data.listIndex];
            let num = -(list[this.data.listIndex + 1] - top - 40);

            // 渲染滚动索引
            if (index !== this.data.listIndex) {
                // console.log(main_past)
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
            let listHeight = this.data.topGroup
            for (let i = 0; i < listHeight.length; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (!height2 || (y >= height1 && y < height2)) {
                    return i
                }
            }
            return 0
        },
        /**
         * 获取节点信息
         */
        queryMultipleNodes() {
          let self = this
            const query = wx.createSelectorQuery().in(this);
            query.selectAll('.fixed-title-hock').boundingClientRect((res) => {
                res.forEach(function(rect) {
                    rect.top // 节点的上边界坐标
                })
            }).exec((e) => {
                let arr = []
                e[0].forEach((rect) => {
                    let num = 0
                    if (rect.top !== 0) {
                      num = rect.top - (self.data.config.search ? self.data.config.searchHeight : 0)
                    }
                    arr.push(num)
                })
                this.setData({
                    topGroup: arr
                })
            })
        }

    }
});
