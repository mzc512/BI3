//var tabindex = 0;

var getTabTarget = function () {
    return $(".current-tabs-wrap").attr("data-target");
};

var getEventAbout = function(){
    var t = new Date().getTime();
    $.get("/dashboard/getEventAbout?"+t,function(res){
        if(res.result){
            window["EventAbout"] = res.data;
        }
    });
};

var labelTop = {
    normal: {
        label: {
            show: true,
            position: 'center',
            formatter: '{c}%',
            textStyle: {
                baseline: 'bottom',
                fontWeight: 'bold',
                color: '#000'
            }
        },
        labelLine: {
            show: false
        }
    }
};
var labelFromatter = {
    normal: {
        label: {
            formatter: function (params) {
                return 100 - params.value + '%'
            },
            textStyle: {
                baseline: 'top'
            }
        },
        labelLine: {
            show: false
        }
    }
};
var labelBottom = {
    normal: {
        color: '#ccc'
    }
};
var disalabelabelLine = {
    normal: {
        show: false
    }
};

var disalabelabel = {normal: {show: false}};


var ybp = {
    dataState: {initTable: false, bar: false, pie: false, pie2: false},
    initTable: function () {
        var self = this;
        $.get('/dashboard/getCurrentYearSummary', function (res) {
            if (res.result) {
                self.dataState.initTable = true;
                var data = res.data;
                var rowNum = $('.order-content .row-num');
                $('.order .caiYear').html(data.caiYear);
                rowNum.eq(0).text(formatMoney(data.order_amt_gmv));
                rowNum.eq(1).text(formatMoney(data.order_cnt_total, 0));
                rowNum.eq(2).text(formatMoney(data.order_amt));
                rowNum.eq(3).text(formatMoney(data.order_cnt, 0));
            }
        });
    },
    bar: function () {
        var option = {
            color: ['#feda84', '#74e0bc', '#ff70b2', '#73d5ee'],
            title: {
                text: '狂奔计划',
                x: 'center',
                top: 8
            },
            grid: {
                left: '1%',
                right: '10',
                bottom: '10',
                top: '80',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                },
                formatter: function (obj, ticket, callback) {
                    var style1 = 'font-size:30px;vertical-align:top;padding-right:5px;';
                    var res = '<div style="line-height:30px;"><span style="' + style1 + 'color:' + obj[0].color + '">&bull;</span>' + obj[0].seriesName + ' ' + formatMoney(obj[0].value) + ' ' + obj[0].data.name + '</div>';
                    res += '<div style="line-height:30px;"><span style="' + style1 + 'color:' + obj[1].color + '">&bull;</span>' + obj[1].seriesName + ' ' + formatMoney(obj[1].value) + ' ' + obj[1].data.name + '</div>';
                    res += '<div style="line-height:30px;"><span style="' + style1 + 'color:' + obj[2].color + '">&bull;</span>' + obj[2].seriesName + ' ' + formatMoney(obj[2].value, 0) + ' ' + obj[2].data.name + '</div>';
                    res += '<div style="line-height:30px;"><span style="' + style1 + 'color:' + obj[3].color + '">&bull;</span>' + obj[3].seriesName + ' ' + formatMoney(obj[3].value, 0) + ' ' + obj[3].data.name + '</div>';
                    callback(ticket, res);
                    return res;
                }
            },
            legend: {
                data: [{name: 'GMV', icon: 'circle'}, {name: '支付金额', icon: 'circle'}, {
                    name: '订单数',
                    icon: 'circle'
                }, {name: '支付订单数', icon: 'circle'}],
                left: 'center',
                top: 40
            },
            xAxis: [
                {
                    type: 'category',
                    data: []
                }
            ],
            yAxis: [
                {
                    name: '金额(元RMB)',
                    minInterval: 100000,
                    type: 'value'
                },
                {
                    name: '订单数(单)',
                    type: 'value',
                    inverse: false
                }
            ],
            series: [
                {
                    name: 'GMV',
                    type: 'bar',
                    data: []
                },
                {
                    name: '支付金额',
                    type: 'bar',
                    data: []
                },
                {
                    name: '订单数',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: []
                },
                {
                    name: '支付订单数',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: []
                }
            ]
        };
        this.barChart = echarts.init(document.getElementById('histogram-chartBox'));
        var self = this;
        $.get('/dashboard/getQuarterDutyData', function (res) {
            if (res.result) {
                self.dataState.bar = true;
                var mthArray = res.data.mthArray;
                var amtArray = res.data.amtArray;
                var gmvAmtArray = res.data.gmvAmtArray;
                var cntArray = res.data.cntArray;
                var gmvCntArray = res.data.gmvCntArray;
                var perAmtArray = res.data.perAmtArray;
                var perGmvAmtArray = res.data.perGmvAmtArray;
                var perCntArray = res.data.perCntArray;
                var perGmvCntArray = res.data.perGmvCntArray;

                perAmtArray = perAmtArray.map(function (e, i) {
                    return {"name": e, value: amtArray[i]};
                });
                perGmvAmtArray = perGmvAmtArray.map(function (e, i) {
                    return {"name": e, value: gmvAmtArray[i]};
                });
                perCntArray = perCntArray.map(function (e, i) {
                    return {"name": e, value: cntArray[i]};
                });
                perGmvCntArray = perGmvCntArray.map(function (e, i) {
                    return {"name": e, value: gmvCntArray[i]};
                });


                option.xAxis[0].data = mthArray;
                option.series[0].data = perGmvAmtArray;
                option.series[1].data = perAmtArray;
                option.series[2].data = perGmvCntArray;
                option.series[3].data = perCntArray;
                option.yAxis[0].interval = 10000000;
                option.yAxis[1].interval = 1000;
                var maxAmt = Math.max(maxArrayCell(amtArray), maxArrayCell(gmvAmtArray));
                var maxCnt = Math.max(maxArrayCell(cntArray), maxArrayCell(gmvCntArray));
                var part = Math.max(maxAmt / option.yAxis[0].interval, maxCnt / option.yAxis[1].interval);
                part = Math.floor(part) + 1;
                option.yAxis[0].max = option.yAxis[0].interval * part;
                option.yAxis[1].max = option.yAxis[1].interval * part;

                self.barChart.setOption(option);
            }
        });
    },
    pie: function () {
        var option = {
            color: ['#f19063', '#53d4ad', '#f07667', '#64b0fb', '#f651a0', '#a786f1', '#f3cd6a'],
            startAngle: 240, //chart bug cannot effected
            legend: {
                x: 'center',
                bottom: 10,
                data: [
                    '深圳', '哈尔滨', '郑州', '西安', '南宁', '合肥', '重庆'
                ],
                itemGap: 10
            },
            title: {
                text: '当前季度分公司GMV达成率',
                x: 'center',
                top: 6
            },
            tooltip: {
                trigger: 'item',
                formatter: function (obj, ticket, callback) {
                    var style1 = 'font-size:30px;vertical-align:top;padding-right:5px;';
                    var res = '<div style="line-height: 30px"><span style="' + style1 + 'color:' + obj.color + '">&bull;</span>目标:' + formatMoney(obj.data.goals) + '</div>';
                    res += '<div style="line-height: 30px"><span style="margin-left: 20px">达成:' + formatMoney(obj.data.reach) + '</span></div>';
                    if (obj.name == 'other') {
                        res = '';
                    }
                    callback(ticket, res);
                    return res;
                }
            },
            series: []
        };
        this.pieChart = echarts.init(document.getElementById("pie-chartBox"));
        var self = this;
        $.get('/dashboard/getQuarterBranchOfficerate', function (res) {
            if (res.result) {
                self.dataState.pie = true;
                var legends = res.data.legends;
                var data = res.data.precent;
                option.legend.data = legends;
                var datalen = legends.length;

                var sideW = 5;  //left right side  occupy
                var roundgapW = 3;  //each gap between two round
                var radiusW = (100 - 2 * sideW - roundgapW * (datalen - 1)) / (2 * datalen);
                //console.log("radiusW="+radiusW);
                var allW = $('#pie-chartBox').width();
                var radius1 = (allW * radiusW) / 100;
                var radius2 = radius1 - 15;
                var radius = [radius2, radius1];

                var radiusArr = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    var item = '';
                    if (i == 0) {
                        item = parseFloat(sideW + radiusW) + '%';
                        radiusArr.push(item);
                    } else {
                        var last = parseFloat(parseInt(radiusArr[i - 1].substring(0, radiusArr[i - 1].length - 1)));
                        item = (last + 2 * radiusW + roundgapW) + '%';
                        radiusArr.push(item);
                    }
                }

                var series = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    series.push({
                        type: 'pie',
                        center: [radiusArr[i], '50%'],
                        radius: radius,
                        itemStyle: labelFromatter,
                        data: [
                            {
                                name: data[i][0]['name'],
                                value: data[i][0]['value'],
                                itemStyle: labelBottom,
                                labelLine: disalabelabelLine,
                                label: disalabelabel
                            },
                            {
                                name: data[i][1]['name'],
                                value: data[i][1]['value'],
                                goals: data[i][1]['goals'],
                                reach: data[i][1]['reach'],
                                itemStyle: labelTop
                            }
                        ]
                    });
                }
                option.series = series;
                self.pieChart.setOption(option);
            }
        });

    },
    pie2: function () {
        var option = {
            color: ['#f19063', '#53d4ad', '#FF4136', '#64b0fb', '#f651a0', '#a786f1', '#f3cd6a', '#B10DC9', '#7FDBFF', '#F012BE'],
            title: {
                text: '行业GMV TOP10',
                left: '0',
                top: 6
            },
            series: [
                {
                    name: '行业',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {"value": 42094763.53, "name": '直接访问'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    lableLine: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    }
                }
            ]
        };

        if (is13metre()) {
            option.series[0].radius = '40%';
        }

        this.pie2Chart = echarts.init(document.getElementById("pie-chartBox2"));
        var self = this;
        $.get('/dashboard/getClassifyGMVData', function (res) {
            if (res.result) {
                self.dataState.pie2 = true;
                //var legends= res.data.legends;
                var data = res.data.data;
                var sum = 0;
                data.forEach(function (x) {
                    sum += x.value;
                });
                var ndata = data.map(function (x, index) {
                    var d = x.name + ':' + toPercent(x.value / sum);
                    x.name = d;
                    return x;
                });
                option.series[0].data = ndata;
                self.pie2Chart.setOption(option);
            }
        });
    },
    init: function () {
        ybp.initTable();
        ybp.bar();//柱状图
        ybp.pie();//饼图
        ybp.pie2();//饼图
    },
    resize: function () {
        ybp.barChart.resize();
        ybp.pieChart.resize();
        ybp.pie2Chart.resize();
    },
    hasDataComplete: function () {
        var dataState = this.dataState;
        for (var state  in dataState) {
            if (!dataState[state]) {
                return false;
            }
        }
        return true;
    }
};

var liuliang = {
    dataState: {line: false, pie3: false, font: false, area: false, system: false},
    line: function () {
        var option = {
            color: ['#73d5ee', '#feda84', '#64b0fb', '#ff70b2'],
            title: {
                text: '时间维度'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top: 5,
                data: ['PV', 'UV', 'IP', '会话']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: []
                }
            ],
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: 'PV',
                    animation: false,
                    type: 'line',
                    data: []
                },
                {
                    name: 'UV',
                    animation: false,
                    type: 'line',
                    data: []
                },
                {
                    name: 'IP',
                    animation: false,
                    type: 'line',
                    data: []
                },
                {
                    name: '会话',
                    animation: false,
                    type: 'line',
                    data: []
                }
            ]
        };
        if (is13metre()) {
            option.grid.right = '6%';
        }
        var startDateInit = (moment(Date.now()).subtract(1, 'w')).format('YYYY-MM-DD');
        var endDateInit = moment(Date.now()).format('YYYY-MM-DD');
        this.lineChart = echarts.init(document.getElementById("line-chartBox"));
        var self = this;
        $.get('/router/rest/method/TrafficDailyNow/begin/' + startDateInit + '/end/' + endDateInit, function (res) {
            if (res.result) {
                self.dataState.line = true;
                var data = res.data;
                var dtArray = [];
                var cntArray = [];
                var cntArrayEnt = [];
                var cntArrayNor = [];
                var cntArraySes = [];

                for (var i = 0; i < data.length; i++) {
                    var date = new Date(data[i][0]);
                    dtArray.push(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日");
                    cntArray.push(data[i][1]);
                    cntArrayEnt.push(data[i][2]);
                    cntArrayNor.push(data[i][3]);
                    cntArraySes.push(data[i][4]);
                }
                option.xAxis[0].data = dtArray;
                option.series[0].data = cntArray;
                option.series[1].data = cntArrayEnt;
                option.series[2].data = cntArrayNor;
                option.series[3].data = cntArraySes;

                self.lineChart.setOption(option);
            }
        });
    },
    pie3: function () {
        var option = {
            color: ['#f19063', '#53d4ad', '#f07667', '#64b0fb', '#f651a0'],
            title: {
                text: '来源维度(会话&PV)',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                left: 'center',
                bottom: 10,
                data: [{name: '广告流量', icon: 'circle'}, {name: '自然流量', icon: 'circle'}, {
                    name: '推介流量',
                    icon: 'circle'
                }, {name: '其它', icon: 'circle'}, {name: '自然搜索', icon: 'circle'}]
            },
            calculable: true,
            series: [
                {
                    name: '会话',
                    animation: false,
                    type: 'pie',
                    radius: [0, '35%'],
                    center: ['30%', '45%'],
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    lableLine: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: []
                },
                {
                    name: 'PV',
                    animation: false,
                    type: 'pie',
                    radius: [0, '45%'],
                    center: ['80%', '45%'],
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data: []
                }
            ]
        };
        var startDateInit = moment(Date.now()).format('YYYY-MM-DD');//(moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');
        var endDateInit = moment(Date.now()).format('YYYY-MM-DD');
        this.pie3Chart = echarts.init(document.getElementById("pie-chartBox3"));
        var self = this;
        $.get('/router/rest/method/TrafficSourceNow?begin=' + startDateInit + '&end=' + endDateInit + '&order=asc&offset=0&limit=10', function (res) {
            if (res) {
                self.dataState.pie3 = true;
                var data = res;
                var legendArray = [];
                var timesArray = [];
                var pvArray = [];
                var timesTotal = 0;
                var pvTotal = 0;
                for (var i = 0; i < data.length; i++) {
                    legendArray.push(data[i]['source']);
                    timesArray.push({
                        value: data[i]['times'],
                        name: data[i]['source']
                    });
                    pvArray.push({
                        value: data[i]['PV'],
                        name: data[i]['source']
                    });
                    timesTotal += parseInt(data[i]['times']);
                    pvTotal += parseInt(data[i]['PV']);
                }
                option.tooltip.formatter = function (params, ticket, callback) {
                    var val = params.value;
                    if (params.seriesIndex == 0) {
                        var per = (val * 100 / timesTotal).toFixed(2) + '%';
                    } else {
                        var per = (val * 100 / pvTotal).toFixed(2) + '%';
                    }
                    var content = params.seriesName + '<br/>' + params.name +
                        ' : ' + val + ' (' + per + ')';

                    callback(ticket, content);
                    return content;
                };
                option.legend.data = legendArray;
                option.series[0].data = timesArray;
                option.series[1].data = pvArray;

                self.pie3Chart.setOption(option);
            }
        });
    },
    font: function () {
        var option = {
            color: ['#f19063', '#53d4ad', '#FF4136', '#64b0fb', '#f651a0', '#a786f1', '#f3cd6a', '#B10DC9', '#7FDBFF', '#F012BE', '#2A00FF', '#FF8C1C'],
            title: {
                text: '关键字TOP100',
                link: 'http://www.google.com/trends/hottrends'
            },
            tooltip: {
                show: true
            },
            series: [{
                name: '关键字 TOP100',
                type: 'wordCloud',
                shape: 'circle',
                left: 'center',
                top: 'center',
                width: '70%',
                height: '80%',
                right: null,
                bottom: null,
                animation: false,
                sizeRange: [12, 40],
                rotationRange: [-90, 90],
                rotationStep: 45,
                gridSize: 8,
                textStyle: {
                    normal: {
                        fontFamily: 'Microsoft YaHei',
                        fontWeight: 'bold',
                        // Color can be a callback function or a color string
                        color: function () {
                            // Random color
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
        var startDateInit = moment(Date.now()).format('YYYY-MM-DD');
        var endDateInit = moment(Date.now()).format('YYYY-MM-DD');
        this.fontChart = echarts.init(document.getElementById("font-chartBox"));
        var self = this;
        $.get('/router/rest/method/trafficSearchTop?top=100&begin=' + startDateInit + '&end=' + endDateInit, function (res) {
            self.dataState.font = true;
            var data = [];
            res.forEach(function (e) {
                data.push({
                    name: e.Name,
                    value: e.Time
                });
            });
            option.series[0].data = data;
            self.fontChart.setOption(option);
        });

    },
    area: function () {

        var option = {
            title: {
                text: '地域流量(会话)',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },

            visualMap: {
                min: 0,
                max: 2500,
                left: 'left',
                top: 'bottom',
                text: ['高', '低'],           // 文本，默认为数值文本
                calculable: true
            },

            series: [
                {
                    name: "省份或直辖市",
                    type: 'map',
                    animation: false,
                    mapType: 'china',
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    data: []
                }
            ]
        };
        var startDateInit = moment(Date.now()).format('YYYY-MM-DD');
        var endDateInit = moment(Date.now()).format('YYYY-MM-DD');
        this.areaChart = echarts.init(document.getElementById("area-chartBox"));
        self = this;
        $.get('/router/rest/method/SelectedProvinceNow?begin=' + startDateInit + '&end=' + endDateInit, function (res) {
            self.dataState.area = true;
            var data = [];
            var max = 0;
            res.forEach(function (e) {
                data.push({
                    name: e.Province,
                    value: e.Ssn
                });
                if (e.Ssn > max) {
                    max = e.Ssn;
                }
            });
            option.visualMap.max = max;
            option.series[0].data = data;
            self.areaChart.setOption(option);
        });
    },
    system: function () {
        var option = {
            color: ['#f19063', '#53d4ad', '#FF4136', '#64b0fb', '#f651a0', '#a786f1', '#f3cd6a', '#B10DC9', '#7FDBFF', '#F012BE'],
            title: {
                text: '操作系统和浏览器型号最新占比(会话)',
                left: 0
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable: true,
            series: [
                {
                    animation: false,
                    name: '操作系统',
                    type: 'pie',
                    radius: [40, 90],
                    center: ['25%', '60%'],
                    data: []
                },
                {
                    animation: false,
                    name: '浏览器',
                    type: 'pie',
                    radius: [40, 90],
                    center: ['75%', '60%'],
                    data: []
                }
            ]
        };
        var startDateInit = moment(Date.now()).format('YYYY-MM-DD');
        var endDateInit = moment(Date.now()).format('YYYY-MM-DD');
        this.systemChart = echarts.init(document.getElementById("system-chartBox"));
        var self = this;
        $.get('/router/rest/method/TrafficSystemOSAPP?top=20&begin=' + startDateInit + '&end=' + endDateInit, function (res) {
            self.dataState.system = true;
            var data1 = [], data2 = [];
            res[0].OS.forEach(function (e) {
                data1.push({
                    name: e.Name,
                    value: e.Ssn
                });
            });
            res[0].APP.forEach(function (e) {
                data2.push({
                    name: e.Name,
                    value: e.Ssn
                });
            });
            option.series[0].data = data1;
            option.series[1].data = data2;
            self.systemChart.setOption(option);
        });

    },
    streamStats: function () {
        //获取配置文件
        $.get('/getWebsocket', function (rs) {
            if (rs.result == true) {
                //监听websocket消息
                var ws = new ReconnectingWebSocket("ws://" + rs.data.hostname + ":" + rs.data.port);
                ws.onmessage = function (e) {
                    if (e != null && getTabTarget() == 'liuliang') {
                        var re = JSON.parse(e.data);
                        if (re.page == 'anaweb' && re.chart == 'traffictime') {
                            liuliang.line();//时间维度
                        } else if (re.page == 'anaweb' && re.chart == 'trafficsource') {
                            liuliang.pie3();//来源维度(会话&PV)
                        } else if (re.page == 'anaweb' && re.chart == 'trafficsearchtop') {
                            liuliang.font();//关键字TOP100
                        } else if (re.page == 'anaweb' && re.chart == 'selectedprovince') {
                            liuliang.area();//地域流量(会话)
                        } else if (re.page == 'anaweb' && re.chart == 'trafficsystemapp') {
                            liuliang.system();//操作系统和浏览器型号最新占比(会话)
                        }
                    }
                };
            }
        }, 'json');
    },
    init: function () {
        liuliang.line();
        liuliang.pie3();
        liuliang.area();
        liuliang.system();
        liuliang.font();
        liuliang.streamStats();//监听web socket通知
    },
    resize: function () {
        liuliang.lineChart.resize();
        liuliang.pie3Chart.resize();
        liuliang.areaChart.resize();
        liuliang.systemChart.resize();
        liuliang.fontChart.resize();
    },
    hasDataComplete: function () {
        var dataState = this.dataState;
        for (var state  in dataState) {
            if (!dataState[state]) {
                return false;
            }
        }
        return true;
    }

};

//实时用户访问轨迹
var accesspath = {
    dataState: {initTable: false},
    initTable: function () {
        var self = this;
        //实时用户访问轨迹
        var ucolor = ['#FF4136', '#53d4ad', '#64b0fb', '#f651a0', '#a786f1', '#3F7F5F', '#B10DC9', '#f19063', '#7FDBFF', '#115F28', '#1810C3', '#A26B6F', '#6BA271'];
        var ucolorhave = new Array();
        var eventcolor = new Array();
        eventcolor["pageview"] = "#343DB6";
        eventcolor["event"] = "#FF4136";
        eventcolor["detail"] = "#53d4ad";
        eventcolor["click"] = "#64b0fb";
        eventcolor["add"] = "#f651a0";
        eventcolor["remove"] = "#a786f1";
        eventcolor["checkout"] = "#3F7F5F";
        eventcolor["checkout_option"] = "#B10DC9";
        eventcolor["purchase"] = "#f19063";
        eventcolor["refund"] = "#7FDBFF";
        //获取配置文件
        $.get('/getWebsocket', function (rs) {
            if (rs.result == true) {
                self.dataState.initTable = true;
                //监听websocket消息
                var accesspathws = new ReconnectingWebSocket("ws://" + rs.data.hostname + ":" + rs.data.port);
                accesspathws.onmessage = function (e) {
                    if (e != null && getTabTarget() == 'accesspath') {
                        var re = JSON.parse(e.data);
                        if (re.page == 'anaweb' && re.chart == 'accesspath' && re.data != null) {
                            //console.log(re);
                            //显示颜色
                            var showcolor = "";//默认
                            //处理颜色
                            //alert(ucolorhave.length);
                            for (var i = 0; i < ucolor.length; i++) {
                                if (ucolorhave.length == 0) {
                                    showcolor = ucolor[i];
                                    ucolorhave[0] = new Array(re.data.uid, ucolor[i]);
                                    break;
                                } else {
                                    for (ukey in ucolorhave) {
                                        if (re.data.uid == ucolorhave[ukey][0]) {
                                            showcolor = ucolorhave[ukey][1];
                                            break;
                                        } else {
                                            if (!self.inarray(ucolor[i], ucolorhave)) {
                                                showcolor = ucolor[i];
                                                ucolorhave[ucolorhave.length] = new Array(re.data.uid, ucolor[i]);
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (showcolor != "") {
                                    break;
                                }
                            }
                            var ul = $("#accesspath ul");


                            var param = '';
                            if (re.data.ea) {
                                var ea = re.data.ea;
                                if(ea!='pageview' && ea!='-'){
                                    var paramsSet= window["EventAbout"];
                                    var paramsObj =paramsSet[ea];
                                    paramsObj.forEach(function(o){
                                        param += ' '+o.paramLabel+':' + re.data["log."+o.paramName];
                                    });
                                }

                            }

                            //添加新li
                            var msg = '<li style="display: none"><h4>' +
                                '<span style="color:' + showcolor + '">' + (re.data.uid ? re.data.uid : '') + '</span>' +
                                '<span style="color:' + (re.data.event ? eventcolor[re.data.event] : '') + '">' + (re.data.event ? re.data.event : '') + '</span>' +
                                '<em>' + (re.data.ts ? re.data.ts : '') + '</em>' +
                                '<span>' + (re.data.prv ? '省份:' + re.data.prv : '') + '</span>' +
                                '<span>' + (re.data.ct ? '城市:' + re.data.ct : '') + '</span>' +
                                '<span>' + param + '</span>' +
                                '</h4>' +
                                '<p>' + (re.data.url ? re.data.url : '') + '</p>' +
                                '<p>' + (re.data.dt ? re.data.dt : '') + '</p>' +
                                '</li>';
                            ul.append(msg);
                            //滚动
                            var liHeight = ul.find("li:last").height();
                            ul.animate({marginTop: liHeight + 40 + "px"}, 500, function () {
                                ul.find("li:last").prependTo(ul)
                                ul.find("li:first").hide();
                                ul.css({marginTop: 0});
                                ul.find("li:first").fadeIn(500);
                            });
                            //删除旧li
                            var ulli = $("#accesspath ul li");
                            if (ulli.length > 12) {
                                ulli[ulli.length - 2].remove();
                            }
                            if (ucolorhave.length > 12) {
                                ucolorhave.shift();
                            }
                        }
                    }
                };
            }
        }, 'json');

    },
    init: function () {
        var startTimer = setInterval(function(){
            if(window["EventAbout"]){
                clearInterval(startTimer);
                accesspath.initTable();
            }
        },1000*20);
    },
    resize: function () {
    },
    inarray: function (search, array) {
        for (var i in array) {
            if (array[i][1] == search) {
                return true;
            }
        }
        return false;
    },
    hasDataComplete: function () {
        var dataState = this.dataState;
        for (var state  in dataState) {
            if (!dataState[state]) {
                return false;
            }
        }
        return true;
    }
};
var latestBoard = {
    dataState: {initGmvAbout: false, initMemberAbout: false,initMemberOnline:false},
    init: function () {
        latestBoard.initGmvAbout();
        latestBoard.initMemberAbout();
        latestBoard.initMemberOnline();
        latestBoard.streamStats();
    },
    initGmvAbout: function () {
        var self = this;
        $.get('/dashboard/initGmvAbout', function (res) {
            if (res.result) {
                self.dataState.initGmvAbout = true;
                var data = res.data;
                $('#gmvAll .wrapper').html(formatMoney(parseFloat(data.sum / 10000),0));
                $('#todayGmv .wrapper').html(formatMoney(parseInt(data.add),0));
            }
        });
    },
    initMemberAbout: function () {
        var self = this;
        $.get('/dashboard/initMemberAbout', function (res){
            if (res.result) {
                self.dataState.initMemberAbout = true;
                var data = res.data;
                $('#memberCount .wrapper').html(formatMoney(data.sum,0));
                $('#memberUpToday .wrapper').html(formatMoney(data.add,0));
            }
        });
    },
    initMemberOnline:function(){
        var self = this;
        $.get("/dashboard/onlineLogin", function (res) {
            if (res.result) {
                self.dataState.initMemberOnline = true;
                var data = res.data;
                $('#memberOnline .wrapper').html(formatMoney(data,0));
            }
        });
    },
    streamStats: function () {
        var self = this;
        //获取配置文件
        $.get('/getWebsocket', function (rs) {
            if (rs.result == true) {
                //监听websocket消息
                var ws = new ReconnectingWebSocket("ws://" + rs.data.hostname + ":" + rs.data.port);
                ws.onmessage = function (e) {
                    if (e != null && getTabTarget() == "latestBoard") {
                        var re = JSON.parse(e.data);
                        if (re.page == 'gmvvip' && re.chart == 'gmv') {  //重置GMV总量数据和今日GMV数据
                            self.initGmvAbout();
                        } else if (re.page == 'gmvvip' && re.chart == 'vip') { //重置总会员数和今日新增会员
                            self.initMemberAbout();
                        } else if (re.page == 'gmvvip' && re.chart == 'login') {  //在线会员
                            self.initMemberOnline();
                        }
                    }
                };
            }
        }, 'json');
    },
    resize: function () {
    },
    hasDataComplete: function () {
        var dataState = this.dataState;
        for (var state  in dataState) {
            if (!dataState[state]) {
                return false;
            }
        }
        return true;
    }
};


var fullScreen = function () {
    var elem = window.parent.document.body;
    if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.requestFullScreen) {
        elem.requestFullscreen();
    } else {
        //浏览器不支持全屏API或已被禁用(IE)
    }
};
var exitFullscreen = function () {
    var elem = window.parent.document;
    if (elem.webkitCancelFullScreen) {
        elem.webkitCancelFullScreen();
    } else if (elem.mozCancelFullScreen) {
        elem.mozCancelFullScreen();
    } else if (elem.cancelFullScreen) {
        elem.cancelFullScreen();
    } else if (elem.exitFullscreen) {
        elem.exitFullscreen();
    } else {
        //浏览器不支持全屏API或已被禁用(IE)
    }
};


$(function () {
    //5分钟刷新下事件参数的缓存
    getEventAbout();
    setInterval(function(){
        getEventAbout();
    },1*60*1000);




    var setContentHeight = function () {
        var ratio = [0.5, 0.5];
        var height = $(window.parent.document).find('.main').height();
        var tabHeight = $(".tab-btn-wrap").height();
        var gapHeight = 2 * 12;
        var chartallH = height - tabHeight - gapHeight;
        $(".row1-chartBox").height(parseInt(chartallH * ratio[0]));
        $(".row2-chartBox").height(parseInt(chartallH * ratio[1]));
        $(".row3-chartBox").height(parseInt(chartallH * ratio[0]) * 2);
        $("#accesspath").height(parseInt(chartallH * ratio[0]) * 2 - 100);


        var radio2 = 1 / 3;
        var gapHeight2 = 4 * 12;
        var chartallH2 = height - tabHeight - gapHeight2;
        $(".row4-chartBox").height(parseInt(chartallH2 * radio2));
        $(".row5-chartBox").height(parseInt(chartallH2 * radio2 * 2) + 12);
    };


    var isHeightChange = function (el) {
        var firstChart = el.find(".row1-chartBox").eq(0);
        var h1 = firstChart.height();
        var h2 = firstChart.children().height();
        if (h1 != h2) {
            return true;
        } else {
            return false;
        }
    };

    var setTab = function (index) {
        var allTab = $(".tabs li");
        var allTabContent = $(".tabs-wrap");
        allTab.removeClass("current");
        allTabContent.removeClass("current-tabs-wrap");
        var currentTab = allTab.eq(index);
        var currentContent = allTabContent.eq(index);
        currentTab.addClass("current");
        currentContent.addClass("current-tabs-wrap");
        var dataTarget = currentContent.attr("data-target");
        if (dataTarget == 'ybp') {
            if (!ybp.hasDataComplete()) {
                ybp.init();
            } else {
                if (isHeightChange(currentContent)) {
                    ybp.resize();
                }
            }
        } else if (dataTarget == 'liuliang') {
            if (!liuliang.hasDataComplete()) {
                liuliang.init();
            } else {
                if (isHeightChange(currentContent)) {
                    liuliang.resize();
                }
            }
        } else if (dataTarget == 'accesspath') {
            if (!accesspath.hasDataComplete()) {
                accesspath.init();
            }
        } else {
            if (!latestBoard.hasDataComplete()) {
                latestBoard.init();
            }else{
                setContentHeight();
            }
        }
    };


    var resizeChart = function () {
        var dataTarget = $(".current-tabs-wrap").attr("data-target");
        if (dataTarget == 'ybp') {
            ybp.resize();
        } else if(dataTarget == 'liuliang') {
            liuliang.resize();
        } else if(dataTarget == 'latestBoard'){
            var timer1 = setTimeout(function () {
                setContentHeight();
                clearTimeout(timer1);
            }, 200);

        }
    };

    var $fullscreen = $('.screen-wrap');
    var $parentWindow = $(window.parent.document).find('.main');
    var isInIframe = $parentWindow.length > 0;

    $fullscreen.on('click', function () {
        var $this = $(this);
        if ($this.hasClass("fullscreen-status")) {
            exitFullscreen();
            if (isInIframe) {
                $this.removeClass("fullscreen-status");
                $parentWindow.removeClass("main-fullscreen-status");
                $(window.parent.document).find('.nav-top').show();
            }

        } else {
            fullScreen();
            if (isInIframe) {
                $this.addClass("fullscreen-status");
                $parentWindow.addClass("main-fullscreen-status");
                $(window.parent.document).find('.nav-top').hide();
            }

        }
        var timer = setTimeout(function () {
            setContentHeight();
            resizeChart();
            clearTimeout(timer);
        }, 100);

        return false;
    });


    $(".tabs").delegate( 'li',"click", function () {
        if ($(this).hasClass("current")) {
            return;
        }
        var index = $(this).index();
        setTab(index);
    });

    $(".ybp-setting").on("click", function () {
        $(".ybp-setting-wrap").show();
    });
    $(".ybp-setting-wrap .closeBtn").on("click", function () {
        $(".ybp-setting-wrap").hide();
    });


    $(".ybp-setting-wrap button").on("click", function () {
        var oldSetting = window["dashboardDisplay"];
        var setting = {"ybp":{"display":true},"liuliang":{"display":true},"accesspath":{"display":true},"latestBoard":{"display":true}};
        if(!$("[name='ybp']").prop("checked")){
            setting.ybp.display = false;
        }
        if(!$("[name='liuliang']").prop("checked")){
            setting.liuliang.display = false;
        }
        if(!$("[name='accesspath']").prop("checked")){
            setting.accesspath.display = false;
        }
        if(!$("[name='latestBoard']").prop("checked")){
            setting.latestBoard.display = false;
        }

        var isChange = ((oldSetting.ybp.display!=setting.ybp.display) || (oldSetting.liuliang.display!=setting.liuliang.display)
        || (oldSetting.accesspath.display!=setting.accesspath.display) || (oldSetting.latestBoard.display!=setting.latestBoard.display));

        if(isChange){
            $.post("/refreshUserSetting/pathKey/dashboardDisplay",{settingContent:JSON.stringify(setting)},function(r){
                if(r.result){
                    $(window.parent.document).find('#mainIframe').get(0).contentWindow.location.reload(true);
                }
            });

        }else{
            $(".ybp-setting-wrap").hide();
        }

    });

    $.get("/getUserSetting/pathKey/dashboardDisplay",function(res){
        if(res.result){
            window["dashboardDisplay"] = res.data;
            var d = res.data;
            var tablen =0;
            var data = [];
            if(d.ybp.display){
                tablen++;
                $("[name='ybp']").prop("checked",'true');
                var obj = {ybp:true};
                if(tablen==1){
                    obj['isfirst'] = true;
                }
                data.push(obj);
            }
            if(d.liuliang.display){
                tablen++;
                $("[name='liuliang']").prop("checked",'true');
                var obj = {liuliang:true};
                if(tablen==1){
                    obj['isfirst'] = true;
                }
                data.push(obj);
            }
            if(d.accesspath.display){
                tablen++;
                $("[name='accesspath']").prop("checked",'true');
                var obj = {accesspath:true};
                if(tablen==1){
                    obj['isfirst'] = true;
                }
                data.push(obj);
            }
            if(d.latestBoard.display){
                tablen++;
                $("[name='latestBoard']").prop("checked",'true');
                var obj = {latestBoard:true};
                if(tablen==1){
                    obj['isfirst'] = true;
                }
                data.push(obj);
            }

            var source = $("#tabs-li-template").html();
            var template = Handlebars.compile(source);
            var html = template(data);
            $('#tabs').html(html);
            source = $("#tabs-wrap-template").html();
            var template = Handlebars.compile(source);
            var html = template(data);
            $('.all-tabs-wrap').html(html);
            setContentHeight();
            if(data.length>0){
                setTab(0);
            }

        }
    });
});