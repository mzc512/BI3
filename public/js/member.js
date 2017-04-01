var member={
    init:function(userId){
        this.bar();
        this.line();
        this.order();
        this.types();
        this.worlds();
        this.radar();
        this.mapes();

    },
    getUserInfo:function(userId){
        var self = this;
        $.get("/userDashboard/baseInfo/userid/" + userId, function (res) {
            if(res.result){
                self.userId = userId;
                self.baseData = res.data;

                    $.get("/userDashboard/UserMessage/userId/" + userId, function (res) {
                        if(res.result){
                            self.baseDatas = res.data;
                            if(res.data['ent_mem_Ind1']=='企业会员'){
                                $.get("/userDashboard/CorporateMember/userId/" + userId, function (res) {
                                    if(res.result){
                                        var baseDatas1 = res.data;
                                        self.baseDatas.filed1=baseDatas1;
                                    }
                                });
                            }
                        }
                    });

                self.initTable(res.data);
                self.bindTableEnlarge();
                self.init();
                $('body').scrollTop(0);
            }else{
                $("#keyes").attr("value", "");
                $("#keyes").addClass("bluesinput");
                $("#keyes").val("您搜索的用户ID不存在,请重新搜索");
                return false;
            }
        });
    },
    getPopInfo:function(){
        var isInIframe =$(window.parent.document).find(".nav-down").length>0;
        var headerDom=isInIframe?$(window.parent.parent.document):$(window.document);
        return {isInIframe:isInIframe,headerDom:headerDom};
    },
    popUp:function(){
        var popInfo = this.getPopInfo();
        var headerDom = popInfo.headerDom;
        var isInIframe = popInfo.isInIframe;
        if(headerDom.find(".pop-chart-wrap").length ==0){
            headerDom.find("body").append('<div class="black-screen-shade"></div>' +
            '<div class="pop-chart-wrap">' +
            '<div class="modal-header"><span class="title"></span><div class="close-btn">&times;</div>' +
            '</div>' +
            '<div class="pop-chart"></div>' +
            '</div>');
        }
        var popChartWrap = headerDom.find(".pop-chart-wrap");
        var backWrap = headerDom.find(".black-screen-shade");
        var domheight = isInIframe?headerDom.height():$(window).height();
        var gapHradio = 0.1;
        var h = domheight*(1-gapHradio*2);

        popChartWrap.height(h);
        var headerH = 52;
        popChartWrap.find(".pop-chart").height(h-headerH);
        backWrap.show();
        popChartWrap.show();
        headerDom.find(".close-btn").off('click').on('click',function(){
            backWrap.hide();
            popChartWrap.hide();
        });
    },
    setPopTitle:function(title){
        var popInfo = this.getPopInfo();
        var headerDom = popInfo.headerDom;
        headerDom.find(".modal-header .title").text(title);
    },
    bar:function(ispop){
        var userid= this.userId;
        var self = this;
        var title = '最近12月登录趋势';
        var option = {
            title : {
                text: title,
                x: 'center',
                top: 8
            },
            tooltip : {
                trigger: 'axis'
            },
            grid: {
                left: '20',
                right: '50',
                bottom: '20',
                top:'80',
                containLabel: true
            },
            toolbox: {
                right:15,
                feature: {
                    myTool1: {
                        show: true,
                        title: '月登录趋势下载',
                        icon: 'image:// /anaweb/images/echart/export.png',
                        onclick: function (){
                            var url = "/userDashboard/loginInfo/userid/" + userid + "/type/excel";
                            window.location = url;//这里不能使用get方法跳转，否则下载不成功
                        }
                    },
                    myTool2: {
                        show: true,
                        title: '放大',
                        icon: 'image:// /anaweb/images/echart/enlarge.png',
                        onclick: function (){
                            self.popUp();
                            self.setPopTitle(title);
                            self.bar(true);

                        }
                    },
                    saveAsImage: {}

                }

            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                }
            ],
            yAxis: [
                {
                    name: '月登录天数',
                    type: 'value'
                }
            ],
            series : [
                {
                    name:'时间,登录天数',
                    type:'bar',
                    data:[],
                    barWidth:35,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最多次'},
                            {type : 'min', name: '最小次'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        };

        var content = document.getElementById("memberloginbar");
        if(ispop){
            delete option.toolbox.feature.myTool2;
            delete option.title;
            option.toolbox.right='20';
            var popInfo = this.getPopInfo();
            var headerDom = popInfo.headerDom;
            content =headerDom.find(".pop-chart").get(0);
        }
        var barChart= echarts.init(content);
        //dailyChart.setOption(option);
        $.get("/userDashboard/loginInfo/userid/" + userid + "/type/chart", function (res) {
            if (res.result) {
//          $('#jsonData').html(JSON.stringify(res.data));
                option.xAxis[0].data= res.xAxis;
                option.series[0].data= res.data;
                barChart.setOption(option);
            }
        });
    },
    line:function(ispop){
        var userid =this.userId;
        var  self=this;
        var title = '最近12月PV数量';
        //var rigleft;
        var option = {
            title: {
                text: title,
                x: 'center',
                top: 8
            },
            grid: {
                left: '20',
                right: '50',
                bottom: '20',
                top:'80',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                right:15,
                feature: {
                    myTool1: {
                        show: true,
                        title: '月PV数量下载',
                        icon: 'image:// /anaweb/images/echart/export.png',
                        onclick: function (){
                            //var url = "/userDashboard/loginInfo/userid/" + userid + "/type/excel";
                            var url = "/userDashboard/usermemberline/userid/" + userid + "/type/excel";

                            window.location = url;//这里不能使用get方法跳转，否则下载不成功
                        }
                    },
                    myTool2: {
                        show: true,
                        title: '放大',
                        icon: 'image:// /anaweb/images/echart/enlarge.png',
                        onclick: function (){
                            self.popUp();
                            self.setPopTitle(title);
                            self.line(true);
                        }
                    },
                    saveAsImage: {}
                }

            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [
                {
                    name: 'PV',
                    type: 'line',
                    hoverAnimation: true,
                    data:[],
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                }

            ]
        };
       var content= document.getElementById("memberacctrack")
        if(ispop){
            delete option.toolbox.feature.myTool2;
            delete option.title;
            option.toolbox.right='20';
            var popInfo = this.getPopInfo();
            var headerDom = popInfo.headerDom;
            content =headerDom.find(".pop-chart").get(0);
        }
        var lineChart=echarts.init(content);
        $.get("/userDashboard/usermemberline/userid/" + userid + "/type/chart", function (res) {

            if (res.result) {
                option.xAxis.data= res.xAxis;
                option.series[0].data= res.data;
                lineChart.setOption(option);
            }
        });


    },
    order:function(ispop){
        var userId=this.userId;
        var self = this;
        var title = '每月订单数和金额';
        var optionOrder = {
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            title: {
                text: title,
                x: 'center',
                align: 'right'
            },
            grid: {
                left: '30',
                right: '20',
                bottom: '20',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                },
                formatter:'订单金额:{c0}万<br/>订单:{c1}单'
            },
            legend: {
                data: ['订单金额', '订单数'],
                x: 'left'
            },
            toolbox: {

                right:15,
                feature: {
                    myTool1: {
                        show: true,
                        title: '每月订单数和金额下载',
                        icon: 'image:// /anaweb/images/echart/export.png',
                        onclick: function () {
                            var url = "/userDashboard/method/MemberOrderMonthly/userId/" + userId + "/type/excel";
                            window.location = url;//这里不能使用get方法跳转，否则下载不成功
                        }
                    },
                    myTool2: {
                        show: true,
                        title: '放大',
                        icon: 'image:// /anaweb/images/echart/enlarge.png',
                        onclick: function (){
                            self.popUp();
                            self.setPopTitle(title);
                            self.order(true);
                        }
                    },
                    saveAsImage: {}
                }
            },
            xAxis: [
                {
                    type: 'category',
                    splitLine: {show: false},
                    data: []
                }
            ],
            yAxis: [
                {
                    name: '金额(万元RMB)',
                    minInterval: 0,
                    type: 'value'
                },
                {
                    name: '订单数(单)',
                    splitLine:{show: false},
                    nameLocation: 'end',
                    type: 'value',
                    inverse: false
                }
            ],
            series: [
                {
                    name: '订单金额',
                    type: 'bar',
                    barWidth: 0,
                    hoverAnimation: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    lineStyle: {
                        normal: {}
                    },
                    data: []
                },

                {
                    name: '订单数',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    yAxisIndex: 1,
                    barWidth: 0,
                    hoverAnimation: false,
                    lineStyle: {
                        normal: {}
                    },
                    data: []
                }
            ]
        };
        var content = document.getElementById("monthly");
        if(ispop){
            delete optionOrder.toolbox.feature.myTool2;
            delete optionOrder.title;
            optionOrder.toolbox.right='20';
            var popInfo = this.getPopInfo();
            var headerDom = popInfo.headerDom;
            content =headerDom.find(".pop-chart").get(0);
        }
        var monthlyChart = echarts.init(content);

            $('#excelData').on('click', function () {
                var url = "/userDashboard/method/MemberOrderMonthly/userId/" + userId + "/type/excel";
                window.location = url;//这里不能使用get方法跳转，否则下载不成功
            });

            $.get("/userDashboard/method/MemberOrderMonthly/userId/" + userId + "/type/echart", function (data, status) {

                if (status == "success") {
                    var respObj = data;
                    if (respObj.result == true) {
                        var mthArray = [];
                        var amtArray = [];
                        var cntArray = [];
                        var gmvAmtArray = [];
                        var gmvCntArray = [];
                        if (respObj.data.length > 0) {
                            for (var i = (respObj.data.length - 1); i >= 0; i--){
                                mthArray.push(respObj.data[i][0]);
                                gmvCntArray.push(respObj.data[i][1]);
                                gmvAmtArray.push(parseFloat(respObj.data[i][2]/10000).toFixed(2));
                            }
                        }

                        optionOrder.dataZoom = [];
                        optionOrder.legend.x = 'left';
                        optionOrder.legend.y = 'top';
                        if(respObj.data.length<6){
                            optionOrder.series[0].barWidth=35;
                            optionOrder.series[1].barWidth=35;
                        }

                        optionOrder.xAxis[0].data = mthArray;
                        optionOrder.series[0].data = gmvAmtArray;
                        optionOrder.series[0].type = 'bar';
                        optionOrder.series[1].data = gmvCntArray;
                        optionOrder.series[1].type = 'bar';

                        monthlyChart.setOption(optionOrder);
                        //monthlyChart.on('click', function (params) {
                        //    // 控制台打印数据的名称
                        //
                        //});
                    } else if (respObj.data && respObj.data.redirect) {
                        if (window == top) {
                            location.href = respObj.data.redirect;
                        } else {
                            top.location.href = respObj.data.redirect;
                        }
                    }
                }
            });
        },
    worlds:function(ispop){
        var userId=this.userId;
        var self = this;
        var title = '用户标签';
        var optionworlds = {
            title: {
                text: title,
                x: 'center'
            },
            backgroundColor: '#F7F7F7',
            toolbox: {
                right:15,
                feature: {
                    myTool1: {
                        show: true,
                        title: '用户标签下载',
                        icon: 'image:// /anaweb/images/echart/export.png',
                        onclick: function () {
                            var url = "/userDashboard/method/hotSpotAnalysis/userId/" + userId + "/type/excel";
                            window.location = url;//这里不能使用get方法跳转，否则下载不成功
                        }
                    },
                    myTool2: {
                        show: true,
                        title: '放大',
                        icon: 'image:// /anaweb/images/echart/enlarge.png',
                        onclick: function (){
                            self.popUp();
                            self.setPopTitle(title);
                            self.worlds(true);
                        }
                    },
                    saveAsImage: {}
                }
            },
            series: [{
                name: '用户标签',
                type: 'wordCloud',
                //size: ['9%', '99%'],
                sizeRange: [6, 66],
                //textRotation: [0, 45, 90, -45],
                rotationRange: [-45, 90],
                //shape: 'circle',
                textPadding: 0,
                autoSize: {
                    enable: true,
                    minSize: 6
                },
                textStyle: {
                    normal: {
                        color: function() {
                            return 'rgb(' + [
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160),
                                    Math.round(Math.random() * 160)
                                ].join(',') + ')';
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                data: []
            }]
        };

        var content = document.getElementById("worlds");
        if(ispop){
            delete optionworlds.toolbox.feature.myTool2;
            delete optionworlds.title;
            optionworlds.toolbox.right=25;

            var popInfo = this.getPopInfo();
            var headerDom = popInfo.headerDom;
            content =headerDom.find(".pop-chart").get(0);
        }
        var worldsChart = echarts.init(content);
        $('#excelData').on('click', function () {
            var url = "/userDashboard/method/hotSpotAnalysis/userId/" + userId + "/type/excel";
            window.location = url;//这里不能使用get方法跳转，否则下载不成功
        });

        $.get("/userDashboard/method/hotSpotAnalysis/userId/" + userId + "/type/echarts", function (data, status) {
            if (status == "success") {
                var respObj = data;
                if (respObj.result == true) {
                    var gmvCntArray = [];
                    if (respObj.data.length > 0) {
                        for (var i = (respObj.data.length - 1); i >= 0; i--){
                            gmvCntArray.push({name :respObj.data[i][0],value :respObj.data[i][1]});
                        }
                    }

                    optionworlds.series[0].data = gmvCntArray;
                    worldsChart.on('click', function (params) {
                    });
                    worldsChart.setOption(optionworlds);


                } else if (respObj.data && respObj.data.redirect) {
                    if (window == top) {
                        location.href = respObj.data.redirect;
                    } else {
                        top.location.href = respObj.data.redirect;
                    }
                }
            }
        });
    },
    types:function(ispop){
        var userId=this.userId;
        var self = this;
        var title = '商品种类';
    var optiontypes = {
        title : {
            text: title,
            subtext: '数据纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: []
        },
        toolbox: {
            right:15,
            feature: {
                myTool1: {
                    show: true,
                    title: '商品种类下载',
                    icon: 'image:// /anaweb/images/echart/export.png',
                    onclick: function () {
                        var url = "/userDashboard/method/commodityType/userId/" + userId + "/type/excel";
                        window.location = url;//这里不能使用get方法跳转，否则下载不成功
                    }
                },
                myTool2: {
                    show: true,
                    title: '放大',
                    icon: 'image:// /anaweb/images/echart/enlarge.png',
                    onclick: function (){
                        self.popUp();
                        self.setPopTitle(title);
                        self.types(true);
                    }
                },
                saveAsImage: {}
            }
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '65%',
                center: ['50%', '60%'],
                data:[],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
        var content = document.getElementById("types");
        if(ispop){
            delete optiontypes.toolbox.feature.myTool2;
            delete optiontypes.title;
            optiontypes.series[0].center=['50%', '45%'];
            optiontypes.toolbox.right=25;

            var popInfo = this.getPopInfo();
            var headerDom = popInfo.headerDom;
            content =headerDom.find(".pop-chart").get(0);
        }
        var typesChart = echarts.init(content);
        $('#excelData').on('click', function () {
            var url = "/userDashboard/method/commodityType/userId/" + userId + "/type/excel";
            window.location = url;//这里不能使用get方法跳转，否则下载不成功
        });

        $.get("/userDashboard/method/commodityType/userId/" + userId + "/type/echarts", function (data, status) {
            if (status == "success") {
                var respObj = data;
                if (respObj.result == true) {
                    var mthArray = [];
                    var amtArray = [];
                    var cntArray = [];
                    var gmvAmtArray = [];
                    var gmvCntArray = [];
                    if (respObj.data.length > 0) {
                        for (var i = (respObj.data.length - 1); i >= 0; i--){
                            mthArray.push(respObj.data[i][0]);
                            gmvAmtArray.push({name :respObj.data[i][0],value :respObj.data[i][2]});
                        }
                    }

                    optiontypes.legend.data = mthArray;
                    optiontypes.series[0].data = gmvAmtArray;
                    typesChart.setOption(optiontypes);

                } else if (respObj.data && respObj.data.redirect) {
                    if (window == top) {
                        location.href = respObj.data.redirect;
                    } else {
                        top.location.href = respObj.data.redirect;
                    }
                }
            }
        });
    },
    radar:function(ispop){
        var userId=$("#keyes").val();
        var self = this;
        var title = '会员综合评分';
        indicatorData = [
            {name: '最新购买时间', max: 10},
            {name: '购买频率', max: 10},
            {name: '平均每次交易额', max: 10},
            {name: '单次最高交易额', max: 10},
            {name: '购买商品种类', max: 10}
        ];

        var optionradar  = {
            title: {
                text: '会员综合评分',
                left: 'center'
            },
            color:["red","#ffc90e","orange"],
            tooltip: {},
            toolbox: {
                right:15,
                feature: {
                    myTool1: {
                        show: true,
                        title: '会员综合评分下载',
                        icon: 'image:// /anaweb/images/echart/export.png',
                        onclick: function () {
                            var url = "/userDashboard/method/memberRadar/userId/" + userId + "/type/excel";
                            window.location = url;//这里不能使用get方法跳转，否则下载不成功
                        }
                    },
                    myTool2: {
                        show: true,
                        title: '放大',
                        icon: 'image:// /anaweb/images/echart/enlarge.png',
                        onclick: function (){
                            self.popUp();
                            self.setPopTitle(title);
                            self.radar(true);
                        }
                    },
                    saveAsImage: {}
                }
            },
            radar: {
                center:['50%','58%'],
                indicator: indicatorData,
                radius: '80%',
                splitNumber: 1,
                name: {
                    textStyle: {
                        color: 'blue',
                        fontSize: 12
                    }
                },
                splitLine: {

                    lineStyle: {
                        color:'#ccc',
                        opacity:0.5
                    }
                },
                splitArea: {
                    show: true,
                    areaStyle:{
                        color:'transparent',
                        opacity:0.1
                    }
                },
                axisLine: {
                    show:true,
                    lineStyle: {
                        color:'#ccc',
                        opacity:0.5
                    }
                }
            },
            series: [
                {
                    name: '雷达线ALL',
                    type: 'radar',
                    silent:true,
                    lineStyle: {
                        normal: {
                            type:'solid',
                            color:"#ccc",
                            width: 2,
                            opacity: 1

                        }
                    },
                    data:  [[10,10,10,10,10]],

                    itemStyle: {
                        normal: {
                            opacity:0

                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'transparent',
                            opacity: 0.1
                        }
                    }
                },
                {
                    name: '雷达线2',
                    type: 'radar',
                    silent:true,
                    lineStyle: {
                        normal: {
                            type:'solid',
                            color:"#ccc",
                            width: 2,
                            opacity: 0.8

                        }
                    },
                    data: [[8,8,8,8,8]],

                    itemStyle: {
                        normal: {
                            opacity:0

                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'transparent',
                            opacity: 0.1
                        }
                    }
                },
                {
                    name: '雷达线3',
                    type: 'radar',
                    silent:true,
                    lineStyle: {
                        normal: {
                            type:'solid',
                            color:"#ccc",
                            width: 2,
                            opacity: 0.6

                        }
                    },
                    data: [[6,6,6,6,6]],

                    itemStyle: {
                        normal: {
                            opacity:0

                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'transparent',
                            opacity: 0.1
                        }
                    }
                },
                {
                    name: '雷达线4',
                    type: 'radar',
                    silent:true,
                    lineStyle: {
                        normal: {
                            type:'solid',
                            color:"#ccc",
                            width: 2,
                            opacity: 0.4

                        }
                    },
                    data: [[4,4,4,4,4]],

                    itemStyle: {
                        normal: {
                            opacity:0

                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'transparent',
                            opacity: 0.1
                        }
                    }
                },
                {
                    name: '雷达线5',
                    type: 'radar',
                    silent:true,
                    lineStyle: {
                        normal: {
                            type:'solid',
                            color:"#ccc",
                            width: 2,
                            opacity: 0.2

                        }
                    },
                    data: [[2,2,2,2,2]],

                    itemStyle: {
                        normal: {
                            opacity:0

                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'transparent',
                            opacity: 0.1
                        }
                    }
                },
                {
                    name: '',
                    type: 'radar',
                    lineStyle:{color:'red'},
                    data: [[0,0,0,0,0]],
                    symbolSize:3,
                    itemStyle: {
                        normal: {
                            borderColor: 'red',
                            borderWidth:5

                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'transparent',
                            opacity: 0.1
                        }
                    },
                    axisLine:{
                        lineStyle: {
                            color: 'red',
                            width:10
                        }
                    }
                }

            ]
        };

        var content = document.getElementById("radar");
        if(ispop){
            delete optionradar.toolbox.feature.myTool2;
            //delete optiontypes.title;
            optionradar.toolbox.right=25;

            var popInfo = this.getPopInfo();
            var headerDom = popInfo.headerDom;
            content =headerDom.find(".pop-chart").get(0);
        }
        var radarChart = echarts.init(content);
        $('#excelData').on('click', function () {
            var url = "/userDashboard/method/memberRadar/userId/" + userId + "/type/excel";
            window.location = url;//这里不能使用get方法跳转，否则下载不成功
        });

        $.get("/userDashboard/method/memberRadar/userId/" + userId + "/type/echarts", function (data, status) {
            if (status == "success") {
                var respObj = data;
                if (respObj.result == true) {
                    var gmvAmtArray = [];  //formatMoney(
                    if (respObj.data.length > 0) {
                        var b_inter = ((respObj.data[0]-respObj.data[5])*10/(respObj.data[6]-respObj.data[5])).toFixed(2);
                        if (respObj.data[1] > 20) {
                            var b_freq = 10
                        } else {
                            var b_freq = ((respObj.data[1]-respObj.data[8])*10/(20 - respObj.data[8])).toFixed(2);
                        }
                        var b_catcnt  = ((respObj.data[4]-respObj.data[14])*10/(respObj.data[13]-respObj.data[14])).toFixed(2);

                        //var b_avgamt = ((respObj.data[2]-respObj.data[10])*10/(respObj.data[9]-respObj.data[10])).toFixed(2);
                        if (respObj.data[2] < 100) {
                            var b_avgamt = 0;
                        } else if (respObj.data[2] > 30000) {
                            var b_avgamt = 10;
                        } else {
                            var b_avgamt = ((respObj.data[2]-100)*10/(30000-100)).toFixed(2);
                        }

                       //var b_singleamt = ((respObj.data[3]-respObj.data[12])*10/(respObj.data[11]-respObj.data[12])).toFixed(2);
                        if (respObj.data[3] < 100) {
                            var b_singleamt = 0;
                        } else if (respObj.data[3] > 30000) {
                            var b_singleamt = 10;
                        } else {
                            var b_singleamt = ((respObj.data[3]-100)*10/(30000-100)).toFixed(2);
                        }

                        gmvAmtArray.push(
                            b_inter,b_freq,b_avgamt,b_singleamt,b_catcnt
                        );

                    }
                    optionradar.series[5].data =[gmvAmtArray] ;
                    radarChart.setOption(optionradar);

                } else if (respObj.data && respObj.data.redirect) {
                    if (window == top) {
                        location.href = respObj.data.redirect;
                    } else {
                        top.location.href = respObj.data.redirect;
                    }
                }
                //等于空数组
                radarChart.setOption(optionradar);
            }
        });

    },
    mapes:function(ispop){
        var userId=$("#keyes").val();
        var self = this;
        var title = '会员采购地址';
        var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
        $.get("/userDashboard/method/purchasingAddress/userId/" + userId + "/type/echarts", function (data, status) {
            if (status == "success") {
                var respObj = data;
                if (respObj.result == true) {
                    var series = [];
                    var content = document.getElementById("mapes");
                    if (respObj.data.length > 0) {
                        var BJData=respObj.data;
                        var len = BJData.length;
                        var data1=[],yAxis=[];
                        BJData.forEach(function (item, i) {
                            series.push({
                                    name: item[0] ,
                                    type: 'lines',
                                    zlevel: 1,
                                    effect: {
                                        show: true,
                                        period: 6,
                                        trailLength: 0.7,
                                        color: '#fff',
                                        symbolSize: 3
                                    },
                                    lineStyle: {
                                        normal: {
                                            color: item[8],
                                            width: 0,
                                            curveness: 0.2
                                        }
                                    },
                                    data: [{fromName:item[3],toName :item[0],coords :[[item[4],item[5]],[item[1],item[2]]]}]
                                },
                                {
                                    name: item[0],
                                    type: 'lines',
                                    zlevel: 3,
                                    symbol: ['none', 'arrow'],
                                    symbolSize: 10,
                                    effect: {
                                        show: true,
                                        period: 6,
                                        trailLength: 0,
                                        //symbol: planePath,
                                        symbolSize: 6
                                    },
                                    lineStyle: {
                                        normal: {
                                            color: item[8],
                                            width: 1,
                                            opacity: 0.6,
                                            curveness: 0.2
                                        }
                                    },
                                    data:  [{fromName:item[3],toName :item[0],coords :[[item[4],item[5]],[item[1],item[2]]]}]
                                },
                                {
                                    name: item[0],
                                    type: 'effectScatter',
                                    coordinateSystem: 'geo',
                                    zlevel: 2,
                                    rippleEffect: {
                                        brushType: 'stroke'
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'right',
                                            formatter: '{b}'
                                        }
                                    },
                                    symbolSize: function (val) {
                                        return val[2] / 8;
                                    },
                                    itemStyle: {
                                        normal: {
                                            color: item[8]
                                        }
                                    },
                                    data: [{ name:item[3],
                                        value:[item[4],item[5]].concat('<br/>会员地址：'+item[0]+'<br/>金额：'+item[7]+'<br/>订单数：'+item[7])
                                    }]
                                });

                            data1.push({name:item[3]+'->'+item[0], value: item[6]});
                            yAxis.push(item[3]+'->'+item[0]);
                            if(i ==len-1){
                                // for bar mack mock data set bar beautiful
                                var dlen =data1.length;
                                while(6-dlen>0){
                                    data1.unshift({name:'', value: 0});
                                    yAxis.unshift('');
                                    dlen++;
                                }
                            series.push(
                                {
                                    name: '会员采购地址单数及金额',
                                    type: 'bar',
                                    tooltip: {
                                        trigger: 'item',
                                        formatter: "{a} <br/>{b} : {c}单<br/>金额:"+parseFloat(item[7]).toFixed(2)
                                    },
                                    barWidth:24,
                                    data: data1
                                });
                            }
                            optionmapes = {
                                grid: {
                                    left: '700',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                },  xAxis: {
                                    name:'单位(单)',
                                    type: 'value',
                                    position:'top',
                                    nameGap:3
                                    //interval:20000
                                },
                                yAxis:{
                                    type: 'category',
                                    data: yAxis
                                    },
                                title: {
                                    text:title,
                                    left: 'left'
                                },
                                toolbox: {
                                    right:15,
                                    feature: {
                                        myTool1: {
                                            show: true,
                                            title: '会员采购地址下载',
                                            icon: 'image:// /anaweb/images/echart/export.png',
                                            onclick: function () {
                                                var url = "/userDashboard/method/purchasingAddress/userId/" + userId + "/type/excel";
                                                window.location = url;//这里不能使用get方法跳转，否则下载不成功
                                            }
                                        },
                                        myTool2: {
                                            show: true,
                                            title: '放大',
                                            icon: 'image:// /anaweb/images/echart/enlarge.png',
                                            onclick: function (){
                                                self.popUp();
                                                self.setPopTitle(title);
                                                self.mapes(true);
                                            }
                                        },
                                        saveAsImage: {}
                                    }
                                },
                                tooltip: {
                                    trigger: 'item'
                                },
                                legend: {
                                    orient: 'vertical',
                                    top: 'bottom',
                                    left: 'right',
                                    data: [],
                                    textStyle: {
                                        color: '#fff'
                                    },
                                    selectedMode: 'single'
                                },
                                geo: {
                                    left:'9%',
                                    top:'15%',
                                    map: 'china',
                                    label: {
                                        emphasis: {
                                            show: false
                                        }
                                    },
                                    roam: true,
                                    itemStyle: {
                                        normal: {
                                            areaColor: '#323c48',
                                            borderColor: 'green'
                                        },
                                        emphasis: {
                                            areaColor: '#2a333d'
                                        }
                                    }
                                },
                                series: series
                            };



                            if(ispop){
                                delete optionmapes.toolbox.feature.myTool2;
                                delete optionmapes.title;
                                optionmapes.toolbox.right=25;
                                var popInfo = self.getPopInfo();
                                var headerDom = popInfo.headerDom;
                                content =headerDom.find(".pop-chart").get(0);
                            }
                            var mapesChart = echarts.init(content);
                            $('#excelData').on('click', function () {
                                var url = "/userDashboard/method/purchasingAddress/userId/" + userId + "/type/excel";
                                window.location = url;//这里不能使用get方法跳转，否则下载不成功
                            });

                            mapesChart.setOption(optionmapes);
                        });
                    }else{
                        //等于空数组
                        optionmapes = {
                            title: {
                                text:title,
                                left: 'left',
                                textStyle: {
                                    color: '#ccc'
                                }
                            },
                            toolbox: {
                                right:15,
                                feature: {
                                    myTool1: {
                                        show: true,
                                        title: '采购地址下载',
                                        icon: 'image:// /anaweb/images/echart/export.png',
                                        onclick: function () {
                                            var url = "/userDashboard/method/purchasingAddress/userId/" + userId + "/type/excel";
                                            window.location = url;//这里不能使用get方法跳转，否则下载不成功
                                        }
                                    },
                                    myTool2: {
                                        show: true,
                                        title: '放大',
                                        icon: 'image:// /anaweb/images/echart/enlarge.png',
                                        onclick: function (){
                                            self.popUp();
                                            self.setPopTitle(title);
                                            self.mapes(true);
                                        }
                                    },
                                    saveAsImage: {}
                                }
                            },
                            tooltip: {
                                trigger: 'item'
                            },
                            legend: {
                                orient: 'vertical',
                                top: 'bottom',
                                left: 'right',
                                data: [],
                                textStyle: {
                                    color: '#fff'
                                },
                                selectedMode: 'single'
                            },
                            geo: {
                                top:'15%',
                                map: 'china',
                                label: {
                                    emphasis: {
                                        show: false
                                    }
                                },
                                roam: true,
                                itemStyle: {
                                    normal: {
                                        areaColor: '#323c48',
                                        borderColor: 'green'
                                    },
                                    emphasis: {
                                        areaColor: '#2a333d'
                                    }
                                }
                            },
                            series:[]
                        };
                        if(ispop){
                            delete optionmapes.toolbox.feature.myTool2;
                            delete optionmapes.title;
                            optionmapes.toolbox.right=25;
                            var popInfo = self.getPopInfo();
                            var headerDom = popInfo.headerDom;
                            content =headerDom.find(".pop-chart").get(0);
                        }
                        var mapesChart = echarts.init(content);
                        $('#excelData').on('click', function () {
                            var url = "/userDashboard/method/purchasingAddress/userId/" + userId + "/type/excel";
                            window.location = url;//这里不能使用get方法跳转，否则下载不成功
                        });

                        mapesChart.setOption(optionmapes);
                    }
                } else if (respObj.data && respObj.data.redirect) {
                    if (window == top) {
                        location.href = respObj.data.redirect;
                    } else {
                        top.location.href = respObj.data.redirect;
                    }
                }
            }
        });

    },
    initTable:function(data){
        var source = $("#baseInfo-template").html();
        var template = Handlebars.compile(source);
        var html = template(data);
        $('#baseInfo-content').html(html);
        var enlarge =$('.member_padding0 .enlarge-btn');
        enlarge.show();
    },
    bindTableEnlarge:function(){
        var self = this;
        var enlarge =$('.member_padding0 .enlarge-btn');
        enlarge.off("click").on("click",function(){
            self.popUp();
            self.setPopTitle('用户详细信息');
            self.initPopupTable();
        });
    },
    initPopupTable:function(){
        var data = this.baseDatas;
        if(data.ent_mem_Ind1=='企业会员'){
            $('#memberInfo').remove() ;
            $("#detailInfo-template").append(
                '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="common_box resume_div_wrap" id="memberInfo">'+
                '<tbody>'+
                ' <tr>'+
                '<td class="gap_between_tit"></td>'+
                '</tr>'+
                '<tr>'+
                '<td class="common_tit">企业会员信息</td>'+
                '</tr>'+
                '<tr>'+
                '<td class="common_con">'+
                '<table width="100%" border="0" cellspacing="0" cellpadding="0">'+
                '<tbody>'+
                '<tr>'+
                '<td class="common_left">企业名称：</td>'+
                ' <td class="common_right_l">{{filed1.enterprise_nm2}}</td>'+
                '<td class="common_left">企业会员注册时间：</td>'+
                '<td class="common_right_r">{{filed1.ent_crt_tm2}}</td>'+
                '</tr>'+
                '<tr>'+
                '<td class="common_left">省份：</td>'+
                '<td class="common_right_l">{{filed1.pro_nm2}}</td>'+
                '<td class="common_left">城市：</td>'+
                '<td class="common_right_r">{{filed1.city_nm2}}</td>'+
                '</tr>'+
                '<tr>'+
                '<td class="common_left">区：</td>'+
                '<td class="common_right_l">{{filed1.area_nm2}}</td>'+
                '<td class="common_left">详细地址：</td>'+
                '<td class="common_right_r">{{filed1.addr_dtl2}}</td>'+
                '</tr>'+
                '<tr>'+
                '<td class="common_left">企业网址：</td>'+
                '<td class="common_right" colspan="3">{{filed1.website2}}</td>'+
                '</tr>'+
                '</tbody>'+
                '</table>'+
                '</td>'+
                '</tr>'+
                '</tbody>'+
                '</table>'
            );
        }
        var source = $("#detailInfo-template").html();
        var template = Handlebars.compile(source);
        var html = template(data);

        var popInfo = this.getPopInfo();
        var headerDom = popInfo.headerDom;
        var content = headerDom.find(".pop-chart");
        content.html(html);
    }

};




$(".f-blue-btn").click(function(){
    var  keys=$("#keyes").val();
    if(keys==""){
        $("#keyes").attr("value","");
        $("#keyes").addClass("redsinput");
        $("#keyes").val("您还没有填写用户ID,请重新填写!!!");
    }else{
        member.getUserInfo(keys);
    }
});

$("#keyes").focus(function(){
    $("#keyes").val("");
    $("#keyes").removeClass("redsinput");
    $("#keyes").removeClass("bluesinput");
});