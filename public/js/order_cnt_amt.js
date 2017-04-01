/*时间序列维度*/
var echartsBox = $('.echartsBox');
echartsBox.addClass("timepicker-padding");

var tabarray =[];
tabarray.push('<ul id="group" class="nav nav-tabs">');
tabarray.push('<li class="active"><a href="#summary" data-toggle="tab">订单简报</a></li>');
tabarray.push('<li><a href="#daily" data-toggle="tab">订单日报</a></li>');
tabarray.push('<li><a href="#weekly" data-toggle="tab">订单周报</a></li>');
tabarray.push('<li><a href="#monthly" data-toggle="tab">订单月报</a></li>');
tabarray.push('<li><a href="#quarterly" data-toggle="tab">订单季报</a></li>');
tabarray.push('<li><a href="#yearly" data-toggle="tab">订单年报</a></li>');
tabarray.push('<li><a href="#GMVdisplay" data-toggle="tab">GMV和交易额汇总展示</a></li>');
tabarray.push('</ul>');
echartsBox.append(tabarray.join(""));

var chartSize = getChartSize(true);
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="summary" class="tab-pane active chart"></div>');
container.push('<div id="daily" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="weekly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="monthly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="quarterly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="yearly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="GMVdisplay" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;">');
container.push('</div>');

var tabs = $('<div id="tabs" class="tab-content" ></div>');
echartsBox.append(tabs);
tabs.append(container.join(""));

var dailyChart = echarts.init(document.getElementById('daily'));
var weeklyChart = echarts.init(document.getElementById('weekly'));
var monthlyChart = echarts.init(document.getElementById('monthly'));
var quarterlyChart = echarts.init(document.getElementById('quarterly'));
var yearlyChart = echarts.init(document.getElementById('yearly'));
var GMVdisplayChart = echarts.init(document.getElementById('GMVdisplay'));
var option = {
    title: {
        text: '每周订单数量和总金额',
        x: 'center',
        align: 'right'
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '10%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data: ['GMV', '支付金额', '订单数', '支付订单数'],
        x: 'left'
    },
    toolbox: {
        show: true,
        feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                readOnly: false
            },
            magicType: {
                show: true,
                type: ['line', 'bar']
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
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
            type: 'value',
            name: '金额(元RMB)',
            minInterval: 1000000

        },
        {
            type: 'value',
            name: '订单数(单)',
            inverse: false
        }
    ],
    series: [
        {
            name: 'GMV',
            type: 'bar',
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        },
        {
            name: '支付金额',
            type: 'bar',
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        },
        {
            name: '订单数',
            type: 'bar',
            yAxisIndex: 1,
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        },
        {
            name: '支付订单数',
            type: 'bar',
            yAxisIndex: 1,
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        }
    ]
};


var colors1 = ['#d14a61', '#2F4554', '#61A0A8','#D48265','#8A2BE2','#5793f3'];
     //['#5793f3', '#d14a61', '#675bba',,'#2F4554'];
var options1= {
    color: colors1,
    title: {
        text: '每周订单数量和总金额',
        x: 'center',
        align: 'right'
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params, ticket, callback) {
            var xname = params[0].name + '<br/>';
            var nmval = '';
            for (var i = 0; i < params.length; i++) {
                if(params[i].value==undefined){
                    params[i].value=0;
                }
                if(params[i].seriesName=='GMV同比'|| params[i].seriesName=='GMV环比'){
                    var unit= params[i].value+' %';
                }else if(params[i].seriesName=='订单数'){
                    var unit= formatMoney(params[i].value,0)+' 单';
                }else{
                    var unit= formatMoney(params[i].value,1)+' 元';
                }

                var thisnmval = params[i].seriesName + ' : ' +unit+'<br/>';
                nmval = nmval + thisnmval;
            }
            var content = xname + nmval;
            callback(ticket, content);
            return content;
        }
    },
    grid: {
        right: '20%'
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
        data: ['GMV', '支付金额', '订单数', '支付订单数','GMV环比'],
        x: 'left'
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            data: []
        }
    ],
    yAxis: [{
        type: 'value',
        name: '金额(元RMB)',
        position: 'left',
        axisLine: {
            lineStyle: {
                color: colors1[2]
            }
        },
        axisLabel: {
            formatter: '{value}'
        }
        //minInterval: 1000000
    },{
            type: 'value',
            name: '订单数(单)',
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors1[0]
                }
            },
            axisLabel: {
                formatter: '{value}'
            }
            //inverse: false
    },{
            type: 'value',
            name: '占比',
            position: 'right',
            offset: 80,
            splitLine:{
                show:false
            },
        axisLine: {
                lineStyle: {
                    color: colors1[1]
                }
            },
            axisLabel: {
                formatter: '{value} %'
            }
    }],
    series: [{
            name: 'GMV',
            type: 'bar',
            data: []
        }, {
            name: '支付金额',
            type: 'bar',
            data: []
        }, {
            name: '订单数',
            type: 'bar',
            yAxisIndex: 1,
            data: []
        }, {
            name: '支付订单数',
            type: 'bar',
            yAxisIndex: 1,
            data: []
        }, {
        name:'GMV环比',
        type:'line',
        yAxisIndex: 2,
        data:[]
    }
    ]
};


var colors = ['#d14a61', '#2F4554', '#61A0A8','#D48265','#5793f3','#8A2BE2'];
var optiones= {
    color: colors,
    title: {
        text: '每周订单数量和总金额',
        x: 'center',
        align: 'right'
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params, ticket, callback) {
            var xname = params[0].name + '<br/>';
            var nmval = '';
            for (var i = 0; i < params.length; i++) {
                if(params[i].value==undefined){
                    params[i].value=0;
                }
                if(params[i].seriesName=='GMV同比'|| params[i].seriesName=='GMV环比'){
                    var unit= params[i].value+' %';
                }else if(params[i].seriesName=='订单数'){
                    var unit= formatMoney(params[i].value,0)+' 单';
                }else{
                    var unit= formatMoney(params[i].value,1)+' 元';
                }

                var thisnmval = params[i].seriesName + ' : ' +unit+'<br/>';
                nmval = nmval + thisnmval;
            }
            var content = xname + nmval;
            callback(ticket, content);
            return content;
        }
    },
    grid: {
        right: '20%'
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
        data: ['GMV', '支付金额', '订单数', '支付订单数', 'GMV同比','GMV环比'],
        left: 'center',
        top: '30'
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            data: []
        }
    ],
    yAxis: [{
        type: 'value',
        name: '金额(元RMB)',
        position: 'left',
        axisLine: {
            lineStyle: {
                color: colors[2]
            }
        },
        axisLabel: {
            formatter: '{value}'
        }
        //minInterval: 1000000
    },{
        type: 'value',
        name: '订单数(单)',
        position: 'right',
        axisLine: {
            lineStyle: {
                color: colors[0]
            }
        },
        axisLabel: {
            formatter: '{value}'
        }
        //inverse: false
    },{
        type: 'value',
        name: '占比',
        position: 'right',
        offset: 80,
        splitLine:{
            show:false
        },
        axisLine: {
            lineStyle: {
                color: colors[1]
            }
        },
        axisLabel: {
            formatter: '{value} %'
        }
    }],
    series: [{
        name: 'GMV',
        type: 'bar',
        data: []
    }, {
        name: '支付金额',
        type: 'bar',
        data: []
    }, {
        name: '订单数',
        type: 'bar',
        yAxisIndex: 1,
        data: []
    }, {
        name: '支付订单数',
        type: 'bar',
        yAxisIndex: 1,
        data: []
    }, {
        name:'GMV同比',
        type:'line',
        yAxisIndex: 2,
        data:[]
    }, {
        name:'GMV环比',
        type:'line',
        yAxisIndex: 2,
        data:[]
    }
    ]
};







var startDateInit = (moment(Date.now()).subtract(30, 'd')).format('YYYY-MM-DD');
var startWeekInit = (moment(Date.now()).subtract(60, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');
var endYear = (moment(Date.now()).subtract(1, 'd')).format('YYYY');

var begin=dates2;
var end=dates1;
var dailyStartDay = startDateInit;
var dailyEndDay = endDateInit;

var weeklyStartDay = startWeekInit;
var weeklyEndDay = endDateInit;

var totalStartDay = startWeekInit;
var totalEndDay = endDateInit;

var dSumShow = 'Y';
var wSumShow = 'Y';





var dateObj = Date.now() - 24 * 60 * 60 * 1000;
var summaryArray = [
    {
        title: "",
        gmv: 0,
        payTotal: 0,
        order: 0,
        payOrder: 0,
        gmvCR: "-",
        orderCR: "-",
        UPGMV: "-",
        UPPay: "-"
    },
    {
        title: "第" + moment(dateObj).week() + "周",
        gmv: 0,
        payTotal: 0,
        order: 0,
        payOrder: 0,
        gmvCR: "-",
        orderCR: "-",
        UPGMV: "-",
        UPPay: "-"
    },
    {
        title: moment(dateObj).format('M') + "月",
        gmv: 0,
        payTotal: 0,
        order: 0,
        payOrder: 0,
        gmvCR: "-",
        orderCR: "-",
        UPGMV: "-",
        UPPay: "-"
    },
    {
        title: moment(dateObj).format('YYYY') + "年",
        gmv: 0,
        payTotal: 0,
        order: 0,
        payOrder: 0,
        gmvCR: "-",
        orderCR: "-",
        UPGMV: "-",
        UPPay: "-"
    },
    {
        title: "第" + Math.ceil(moment(dateObj).format('M') / 3) + "季度",
        gmv: 0,
        payTotal: 0,
        order: 0,
        payOrder: 0,
        gmvCR: "-",
        orderCR: "-",
        UPGMV: "-",
        UPPay: "-"
    }
];

function showSummaryTable() {

    $('#summary').empty();
    $('#summary').append('<table class="table table-striped" id="sumTable"></table>');
    $('#sumTable').append(
        '<thead>' +
        '<tr>' +
        '<td>' + "时间" + '</td>' +
        '<td>' + "GMV" + '</td>' +
        '<td>' + "支付金额" + '</td>' +
        '<td>' + "付款率" + '</td>' +
        '<td>' + "订单数量" + '</td>' +
        '<td>' + "支付订单数量" + '</td>' +
        '<td>' + "支付订单占比" + '</td>' +
        '<td>' + "GMV笔单价" + '</td>' +
        '<td>' + "支付金额笔单价" + '</td>' +
        '</tr>' +
        '</thead>'
    );
    $('#sumTable').append(
        '<tbody>' +
        '<tr>' +
        '<td>' + summaryArray[0].title + '</td>' +
        '<td>' + formatMoney(summaryArray[0].gmv, 1) + '</td>' +
        '<td>' + formatMoney(summaryArray[0].payTotal, 1) + '</td>' +
        '<td>' + summaryArray[0].gmvCR + '</td>' +
        '<td>' + formatMoney(summaryArray[0].order, 0) + '</td>' +
        '<td>' + formatMoney(summaryArray[0].payOrder, 0) + '</td>' +
        '<td>' + summaryArray[0].orderCR + '</td>' +
        '<td>' + formatMoney(summaryArray[0].UPGMV, 1) + '</td>' +
        '<td>' + formatMoney(summaryArray[0].UPPay, 1) + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' + summaryArray[1].title + '</td>' +
        '<td>' + formatMoney(summaryArray[1].gmv, 1) + '</td>' +
        '<td>' + formatMoney(summaryArray[1].payTotal, 1) + '</td>' +
        '<td>' + summaryArray[1].gmvCR + '</td>' +
        '<td>' + formatMoney(summaryArray[1].order, 0) + '</td>' +
        '<td>' + formatMoney(summaryArray[1].payOrder, 0) + '</td>' +
        '<td>' + summaryArray[1].orderCR + '</td>' +
        '<td>' + formatMoney(summaryArray[1].UPGMV, 1) + '</td>' +
        '<td>' + formatMoney(summaryArray[1].UPPay, 1) + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' + summaryArray[2].title + '</td>' +
        '<td>' + formatMoney(summaryArray[2].gmv, 1) + '</td>' +
        '<td>' + formatMoney(summaryArray[2].payTotal, 1) + '</td>' +
        '<td>' + summaryArray[2].gmvCR + '</td>' +
        '<td>' + formatMoney(summaryArray[2].order, 0) + '</td>' +
        '<td>' + formatMoney(summaryArray[2].payOrder, 0) + '</td>' +
        '<td>' + summaryArray[2].orderCR + '</td>' +
        '<td>' + formatMoney(summaryArray[2].UPGMV, 1) + '</td>' +
        '<td>' + formatMoney(summaryArray[2].UPPay, 1) + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' + summaryArray[4].title + '</td>' +
        '<td>' + formatMoney(summaryArray[4].gmv, 1) + '</td>' +
        '<td>' + formatMoney(summaryArray[4].payTotal, 1) + '</td>' +
        '<td>' + summaryArray[4].gmvCR + '</td>' +
        '<td>' + formatMoney(summaryArray[4].order, 0) + '</td>' +
        '<td>' + formatMoney(summaryArray[4].payOrder, 0) + '</td>' +
        '<td>' + summaryArray[4].orderCR + '</td>' +
        '<td>' + formatMoney(summaryArray[4].UPGMV, 1) + '</td>' +
        '<td>' + formatMoney(summaryArray[4].UPPay, 1) + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>' + summaryArray[3].title + '</td>' +
        '<td>' + formatMoney(summaryArray[3].gmv, 1) + '</td>' +
        '<td>' + formatMoney(summaryArray[3].payTotal, 1) + '</td>' +
        '<td>' + summaryArray[3].gmvCR + '</td>' +
        '<td>' + formatMoney(summaryArray[3].order, 0) + '</td>' +
        '<td>' + formatMoney(summaryArray[3].payOrder, 0) + '</td>' +
        '<td>' + summaryArray[3].orderCR + '</td>' +
        '<td>' + formatMoney(summaryArray[3].UPGMV, 1) + '</td>' +
        '<td>' + formatMoney(summaryArray[3].UPPay, 1) + '</td>' +
        '</tr>' +
        '</tbody>'
    );
}

//日报
var weekday = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");

function selectedDate(startDt, endDt) {
    $.ajax({
        type: 'GET',
        url: '/router/rest/method/OrderDaily/begin/' + startDt + '/end/' + endDt,
        success: function (data, status) {
            if (status == "success") {
                dailyStartDay = startDt;
                dailyEndDay = endDt;

                var respObj = data;
                if (respObj.result == "success") {
                    var dtArray = [];
                    var amtArray = [];
                    var cntArray = [];
                    var gmvAmtArray = [];
                    var gmvCntArray = [];
                    for (var i = 0; i < respObj.data.length; i++) {
                        var date = new Date(respObj.data[i][0]);
                        dtArray.push(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" +
                        weekday[date.getDay()]);
                        cntArray.push(respObj.data[i][1]);
                        amtArray.push(respObj.data[i][2]);
                        gmvCntArray.push(respObj.data[i][3]);
                        gmvAmtArray.push(respObj.data[i][4]);
                    }

                    option.title.text = '每日订单数量和总金额';
                    option.dataZoom = [
                        {
                            show: false,
                            realtime: true,
                            start: 0,
                            end: 100
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            start: 0,
                            end: 100
                        }
                    ];
                    option.legend.x = 'left';
                    option.legend.y = 'top';

                    option.xAxis[0].data = dtArray;

                    option.series[0].data = gmvAmtArray;
                    option.series[0].type = 'line';
                    option.series[1].data = amtArray;
                    option.series[1].type = 'line';
                    option.series[2].data = gmvCntArray;
                    option.series[2].type = 'line';
                    option.series[3].data = cntArray;
                    option.series[3].type = 'line';

                    option.yAxis[0].interval = 200000;
                    option.yAxis[1].interval = 40;
                    var maxAmt = Math.max(maxArrayCell(amtArray), maxArrayCell(gmvAmtArray));
                    var maxCnt = Math.max(maxArrayCell(cntArray), maxArrayCell(gmvCntArray));
                    var part = Math.max(maxAmt / option.yAxis[0].interval, maxCnt / option.yAxis[1].interval);
                    part = Math.floor(part) + 1;
                    option.yAxis[0].max = option.yAxis[0].interval * part;
                    option.yAxis[1].max = option.yAxis[1].interval * part;
                    dailyChart.setOption(option);

                    if (dSumShow == 'Y') {
                        summaryArray[0].title = moment(new Date(respObj.data[respObj.data.length - 1][0])).format('YYYY-MM-DD');
                        summaryArray[0].payTotal = (respObj.data[respObj.data.length - 1][2]).toFixed(2);
                        summaryArray[0].payOrder = respObj.data[respObj.data.length - 1][1];
                        summaryArray[0].gmv = (respObj.data[respObj.data.length - 1][4]).toFixed(2);
                        summaryArray[0].order = respObj.data[respObj.data.length - 1][3];
                        summaryArray[0].gmvCR = summaryArray[0].gmv == 0 ? '-' : ((summaryArray[0].payTotal / summaryArray[0].gmv) * 100).toFixed(2) + "%";
                        summaryArray[0].orderCR = summaryArray[0].order == 0 ? '-' : ((summaryArray[0].payOrder / summaryArray[0].order) * 100).toFixed(2) + "%";
                        summaryArray[0].UPGMV = (summaryArray[0].gmv / summaryArray[0].order).toFixed(2);
                        summaryArray[0].UPPay = (summaryArray[0].payTotal / summaryArray[0].payOrder).toFixed(2);
                        showSummaryTable();

                        dSumShow = 'N';
                    }

                } else if (respObj.data && respObj.data.redirect) {

                    //console.log("redirect: %s", respObj.data.redirect);
                    if (window == top) {
                        location.href = respObj.data.redirect;
                    } else {
                        top.location.href = respObj.data.redirect;
                    }
                }
            }
        }
    });
}

selectedDate(dailyStartDay, dailyEndDay);


//周报
function selectedWeek(startDt, endDt) {
    $.get("/router/rest/method/OrderWeekly/begin/" + startDt + "/end/" + endDt, function(data, status){
        if (status == "success") {
            var respObj = data;
            if (respObj.result == "success") {
                weeklyStartDay = startDt;
                weeklyEndDay = endDt;
                var wkArray = [];
                var amtArray = [];
                var cntArray = [];
                var gmvAmtArray = [];
                var gmvCntArray = [];
                var lastDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
                for (var i = 0; i < respObj.data.length; i++) {

                    var daysofweek = getStartEndDt((respObj.data[i][0]).substring(0,4),(respObj.data[i][0]).substring(4,6));

                    if (Date.parse(startDt) > Date.parse(daysofweek[0])) {
                        daysofweek[0] = startDt;
                    }
                    if (Date.parse(endDt) < Date.parse(daysofweek[6])) {
                        daysofweek[6] = endDt;
                    }
                    wkArray.push( (respObj.data[i][0]).substring(0,4)+"年第" + (respObj.data[i][0]).substring(4,6) + "周" + "\n(" + daysofweek[0] + "至" + daysofweek[6] + ")");
                    cntArray.push(respObj.data[i][1]);
                    amtArray.push(respObj.data[i][2]);
                    gmvCntArray.push(respObj.data[i][3]);
                    gmvAmtArray.push(respObj.data[i][4]);
                }

                option.title.text = '每周订单数量和总金额';
                option.dataZoom = [];
                option.legend.x = 'left';
                option.legend.y = 'top';

                option.xAxis[0].data = wkArray;

                option.series[0].data = gmvAmtArray;
                option.series[0].type = 'bar';
                option.series[1].data = amtArray;
                option.series[1].type = 'bar';
                option.series[2].data = gmvCntArray;
                option.series[2].type = 'bar';
                option.series[3].data = cntArray;
                option.series[3].type = 'bar';
      

                option.yAxis[0].interval = 400000;
                option.yAxis[1].interval = 80;
                var maxAmt = Math.max(maxArrayCell(amtArray), maxArrayCell(gmvAmtArray));
                var maxCnt = Math.max(maxArrayCell(cntArray), maxArrayCell(gmvCntArray));
                var part = Math.max(maxAmt / option.yAxis[0].interval, maxCnt / option.yAxis[1].interval);
                part = Math.floor(part) + 1;
                option.yAxis[0].max = option.yAxis[0].interval * part;
                option.yAxis[1].max = option.yAxis[1].interval * part;

                weeklyChart.setOption(option);

                if (wSumShow == 'Y') {
                    summaryArray[1].title = "第" + respObj.data[respObj.data.length - 1][0].substring(4,6) + "周";
                    summaryArray[1].payTotal = (respObj.data[respObj.data.length - 1][2]).toFixed(2);
                    summaryArray[1].payOrder = respObj.data[respObj.data.length - 1][1];
                    summaryArray[1].gmv = (respObj.data[respObj.data.length - 1][4]).toFixed(2);
                    summaryArray[1].order = respObj.data[respObj.data.length - 1][3];
                    summaryArray[1].gmvCR = summaryArray[1].gmv == 0 ? '-' : ((summaryArray[1].payTotal / summaryArray[1].gmv) * 100).toFixed(2) + "%";
                    summaryArray[1].orderCR = summaryArray[1].order == 0 ? '-' : ((summaryArray[1].payOrder / summaryArray[1].order) * 100).toFixed(2) + "%";
                    summaryArray[1].UPGMV = (summaryArray[1].gmv / summaryArray[1].order).toFixed(2);
                    summaryArray[1].UPPay = (summaryArray[1].payTotal / summaryArray[1].payOrder).toFixed(2);
                    showSummaryTable();

                    wSumShow = 'N';
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
}

selectedWeek(weeklyStartDay, endDateInit);

//月报 options
function selectedYear(begin,end) {
    //console.log("year: %s.", year);
    $.get("/router/rest/method/OrderMonthly/begin/" + begin+"/end/"+end, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == "success") {
                var mthArray = [];
                var amtArray = [];
                var cntArray = [];
                var gmvAmtArray = [];
                var gmvCntArray = [];
                var gmvsAmtArray=[];
                var huanbisAmtArray=[];
                if(respObj.data.length>12){
                    for (var i = 12; i < respObj.data.length; i++) {
                        if(Number(respObj.data[0][6])>=201501){
                        mthArray.push(respObj.data[i][5] + "月");
                        cntArray.push(respObj.data[i][1]);
                        amtArray.push(respObj.data[i][2]);
                        gmvCntArray.push(respObj.data[i][3]);
                        gmvAmtArray.push(respObj.data[i][4]);
                            if(i-11>0){
                                var datas2=respObj.data[i-1][4];
                                if(datas2!=0){
                                    if(respObj.data[i][4]!=0){
                                        var adss2=(respObj.data[i][4]-datas2)/datas2*100;
                                    }else{
                                        var adss2=0;
                                    }
                                }else{
                                    if(respObj.data[i][4]!=0){
                                        adss2=100;
                                    }else{
                                        var adss2=0;
                                    }

                                }
                                huanbisAmtArray.push(adss2.toFixed(2));
                            }
                            if(i-12>=0){
                                var datas1=respObj.data[i-12][4];
                                if(datas1!=0){
                                    if(respObj.data[i][4]!=0){
                                        var adss1=(respObj.data[i][4]-datas1)/datas1;
                                    }else{
                                        var adss1=0;
                                    }
                                }else{
                                    if(respObj.data[i][4]!=0){
                                        adss1=100;
                                    }else{
                                        var adss1=0;
                                    }

                                }
                                gmvsAmtArray.push(adss1.toFixed(0));
                            }
                        }else{
                           var j =respObj.data[0][6].substr(-2,2)-1;
                            for (var i = j; i < respObj.data.length; i++) {
                                mthArray.push(respObj.data[i][5] + "月");
                                cntArray.push(respObj.data[i][1]);
                                amtArray.push(respObj.data[i][2]);
                                gmvCntArray.push(respObj.data[i][3]);
                                gmvAmtArray.push(respObj.data[i][4]);

                            }
                        }
                        }

                    for (var i =j; i < respObj.data.length; i++) {
                        if(i-1>=0){
                            var datas2=respObj.data[i-1][4];
                            if(datas2!=0){
                                if(respObj.data[i][4]!=0){
                                    var adss2=(respObj.data[i][4]-datas2)/datas2*100;
                                }else{
                                    var adss2=0;
                                }
                            }else{
                                if(respObj.data[i][4]!=0){
                                    adss2=100;
                                }else{
                                    var adss2=0;
                                }

                            }
                            huanbisAmtArray.push(adss2.toFixed(2));
                        }
                    }
                    for (var i = j; i < respObj.data.length; i++) {
                        if(i-12>=0){
                            var datas1=respObj.data[i-12][4];
                            if(datas1!=0){
                                if(respObj.data[i][4]!=0){
                                    var adss=(respObj.data[i][4]-datas1)/datas1;
                                }else{
                                    var adss=0;
                                }

                            }else{
                                if(respObj.data[i][4]!=0){
                                    var adss=100;
                                }else{
                                    var adss=0;
                                }
                            }
                        }else{
                            if(respObj.data[i][4]!=0){
                                var adss=100;
                            }else{
                                var adss=0;
                            }
                        }
                        gmvsAmtArray.push(adss.toFixed(0));
                    }

                }else{
                    for (var i = 0; i < respObj.data.length; i++) {
                        mthArray.push(respObj.data[i][5] + "月");
                        gmvCntArray.push(respObj.data[i][3]);
                        gmvAmtArray.push(respObj.data[i][4]);

                    }
                    for (var i =0; i < respObj.data.length; i++) {
                        if(i>0){
                            var datas2=respObj.data[i-1][4];
                        }else{
                            var datas2=0;
                        }
                            if(datas2!=0){
                                if(respObj.data[i][4]!=0){
                                    var adss2=(respObj.data[i][4]-datas2)/datas2*100;
                                }else{
                                    var adss2=0;
                                }
                            }else{
                                if(respObj.data[i][4]!=0){
                                    var adss2=100;
                                }else{
                                    var adss2=0;
                                }

                            }

                            huanbisAmtArray.push(adss2.toFixed(2));
                        }
                    for (var i = 0; i < respObj.data.length; i++) {
                                if(respObj.data[i][4]!=0){
                                    var adss=100;
                                }else{
                                    var adss=0;
                                }
                            gmvsAmtArray.push(adss.toFixed(0));
                    }
                    }

                optiones.title.text = '每月订单数量和总金额';
                optiones.xAxis[0].data = mthArray;
                optiones.series[0].data = gmvAmtArray;
                optiones.series[1].data = amtArray;
                optiones.series[2].data = gmvCntArray;
                optiones.series[3].data = cntArray;
                optiones.series[4].data = gmvsAmtArray;
                optiones.series[5].data = huanbisAmtArray;
                optiones.yAxis[0].interval = 2000000;
                optiones.yAxis[1].interval = 400;
                var maxAmt = Math.max(maxArrayCell(amtArray), maxArrayCell(gmvAmtArray));
                var maxCnt = Math.max(maxArrayCell(cntArray), maxArrayCell(gmvCntArray));
                var part = Math.max(maxAmt / optiones.yAxis[0].interval, maxCnt / optiones.yAxis[1].interval);
                part = Math.floor(part) + 1;
                optiones.yAxis[0].max = optiones.yAxis[0].interval * part;
                optiones.yAxis[1].max = optiones.yAxis[1].interval * part;
                monthlyChart.setOption(optiones);

                //本月小结
                var monthlyData = respObj.data;
                var currentMonth = moment().subtract(1, 'd').month() + 1;

                if(monthlyData.length/12>=1){
                    monthlyData=monthlyData.filter(function (item) {
                        return item[0] === currentMonth+12*(parseInt(monthlyData.length/12));
                    });
                }else{
                    monthlyData=monthlyData.filter(function (item) {
                        return item[0] === currentMonth;
                    });
                }

                summaryArray[2].title = currentMonth + "月";
                summaryArray[2].payTotal = (monthlyData[0][2]).toFixed(2);
                summaryArray[2].payOrder = monthlyData[0][1];
                summaryArray[2].gmv = (monthlyData[0][4]).toFixed(2);
                summaryArray[2].order = monthlyData[0][3];
                summaryArray[2].gmvCR = summaryArray[2].gmv == 0 ? '-' : ((summaryArray[2].payTotal / summaryArray[2].gmv) * 100).toFixed(2) + "%";
                summaryArray[2].orderCR = summaryArray[2].order == 0 ? '-' : ((summaryArray[2].payOrder / summaryArray[2].order) * 100).toFixed(2) + "%";
                summaryArray[2].UPGMV = (summaryArray[2].gmv / summaryArray[2].order).toFixed(2);
                summaryArray[2].UPPay = (summaryArray[2].payTotal / summaryArray[2].payOrder).toFixed(2);

                //本季度小结
                var quarterlyData = respObj.data;
                var currentQuarter = Math.ceil(currentMonth / 3);
                var qrtPayTotal = [];
                var qrtPayOrder = [];
                var qrtGmv = [];
                var qrtOrder = [];

                if(quarterlyData.length/12>=1){
                    quarterlyData = quarterlyData.filter(function (item) {
                        return Math.ceil(item[0] / 3) === currentQuarter+Math.ceil(quarterlyData.length/3-currentQuarter);
                    });
                }else{
                    quarterlyData = quarterlyData.filter(function (item) {
                        return Math.ceil(item[0] / 3) === currentQuarter;
                    });
                }
                quarterlyData.forEach(function (item, index) {
                    qrtPayTotal.push(item[2]);
                    qrtPayOrder.push(item[1]);
                    qrtGmv.push(item[4]);
                    qrtOrder.push(item[3]);
                });

                summaryArray[4].title = "第" + currentQuarter + "季度";
                summaryArray[4].payTotal = (eval(qrtPayTotal.join('+'))).toFixed(2);
                summaryArray[4].payOrder = eval(qrtPayOrder.join('+'));
                summaryArray[4].gmv = (eval(qrtGmv.join('+'))).toFixed(2);
                summaryArray[4].order = eval(qrtOrder.join('+'));
                summaryArray[4].gmvCR = summaryArray[4].gmv == 0 ? '-' : ((summaryArray[4].payTotal / summaryArray[4].gmv) * 100).toFixed(2) + "%";
                summaryArray[4].orderCR = summaryArray[4].order == 0 ? '-' : ((summaryArray[4].payOrder / summaryArray[4].order) * 100).toFixed(2) + "%";
                summaryArray[4].UPGMV = (summaryArray[4].gmv / summaryArray[4].order).toFixed(2);
                summaryArray[4].UPPay = (summaryArray[4].payTotal / summaryArray[4].payOrder).toFixed(2);

                //本年小结
                summaryArray[3].title = (new Date()).getFullYear() + "年";
                summaryArray[3].payTotal = (eval(amtArray.join('+'))).toFixed(2);
                summaryArray[3].payOrder = eval(cntArray.join('+'));
                if(gmvAmtArray.length!=0){
                    summaryArray[3].gmv = (eval(gmvAmtArray.join('+'))).toFixed(2);
                }else{
                    summaryArray[3].gmv = 0;
                }

                summaryArray[3].order = eval(gmvCntArray.join('+'));
                summaryArray[3].gmvCR = summaryArray[3].gmv == 0 ? '-' : ((summaryArray[3].payTotal / summaryArray[3].gmv) * 100).toFixed(2) + "%";
                summaryArray[3].orderCR = summaryArray[3].order == 0 ? '-' : ((summaryArray[3].payOrder / summaryArray[3].order) * 100).toFixed(2) + "%";
                summaryArray[3].UPGMV = (summaryArray[3].gmv / summaryArray[3].order).toFixed(2);
                summaryArray[3].UPPay = (summaryArray[3].payTotal / summaryArray[3].payOrder).toFixed(2);
                showSummaryTable();

            } else if (respObj.data && respObj.data.redirect) {
                if (window == top) {
                    location.href = respObj.data.redirect;
                } else {
                    top.location.href = respObj.data.redirect;
                }
            }
        }
    });
}
selectedYear(begin,end);


//订单季报
function selectedQuarter(year) {   var dates = new Date();
    dates=dates.getFullYear()-1;
    $.get("/router/rest/method/OrderQuarterly/year/" + year, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == "success") {
                var qrtArray = [];
                var amtArray = [];
                var cntArray = [];
                var gmvAmtArray = [];
                var gmvCntArray = [];
                var tongbiArray=[];
                var huanbiArray=[];

                for (var i = 0; i < respObj.data.length; i++) {
                    var quarterNum= respObj.data[i][0].toString().substr(4, 1);
                    if( respObj.data[i][0].toString().substr(0, 4)>=dates){
                        var xComment = respObj.data[i][0].toString().substr(0, 4) + '年第'
                            + respObj.data[i][0].toString().substr(4, 1) + '季度';
                        qrtArray.push(xComment);
                        cntArray.push(respObj.data[i][1]);
                        amtArray.push(respObj.data[i][2]);
                        gmvCntArray.push(respObj.data[i][3]);
                        gmvAmtArray.push(respObj.data[i][4]);
                    }
                }

                for (var i = respObj.data.length-1; i >0; i--) {
                    var quarterNums= parseInt(quarterNum)+4;var nums=respObj.data.length-quarterNums-1;
                    if( respObj.data.length>quarterNums){
                        if(i>nums){
                        var data1=respObj.data[i-1][4];
                        if(data1!=0){
                            if(respObj.data[i][4]!=0){
                                var datas1=(respObj.data[i][4]-data1)/data1*100;
                            }
                        }else{
                            if(respObj.data[i][4]!=0){
                                 var datas1=100;
                            }else{
                                var datas1=0;
                            }
                        }
                        }
                    }
                    huanbiArray.push(datas1.toFixed(2));

                    if(respObj.data.length>4){
                        if(respObj.data[i-4]){
                            var data2  =respObj.data[i-4][4];
                        }else{
                            var data2  =0;
                        }

                        if(data2!=0){
                            if(respObj.data[i][4]!=0){
                                var datas2=(respObj.data[i][4]-data2)/data2;
                            }else{
                                var datas2=0;
                            }
                        }else{
                            if(respObj.data[i][4]!=0){
                                var datas2=100;
                            }else{
                                var datas2=0;
                            }
                        }
                        tongbiArray.push(datas2.toFixed(2));
                    }
                }
                huanbiArray= huanbiArray.slice(0,quarterNums);tongbiArray= tongbiArray.slice(0,quarterNums);
                huanbiArray.reverse();tongbiArray.reverse();
                optiones.title.text = '季度订单数量和总金额';
                optiones.dataZoom = [];
                optiones.legend.x = 'left';
                optiones.legend.y = 'top';
                optiones.xAxis[0].data = qrtArray;
                optiones.series[0].data = gmvAmtArray;
                optiones.series[0].type = 'bar';
                optiones.series[1].data = amtArray;
                optiones.series[1].type = 'bar';
                optiones.series[2].data = gmvCntArray;
                optiones.series[2].type = 'bar';
                optiones.series[3].data = cntArray;
                optiones.series[3].type = 'bar';
                optiones.series[4].data = tongbiArray;
                optiones.series[5].data = huanbiArray;
                optiones.yAxis[0].interval = 4000000;
                optiones.yAxis[1].interval = 600;
                var maxAmt = Math.max(maxArrayCell(amtArray), maxArrayCell(gmvAmtArray));

                var maxCnt = Math.max(maxArrayCell(cntArray), maxArrayCell(gmvCntArray));

                var part = Math.max(maxAmt / optiones.yAxis[0].interval, maxCnt / optiones.yAxis[1].interval);
                part = Math.floor(part) + 1;

                optiones.yAxis[0].max = optiones.yAxis[0].interval * part;

                optiones.yAxis[1].max = optiones.yAxis[1].interval * part;
                quarterlyChart.setOption(optiones);
            } else if (respObj.data && respObj.data.redirect) {

                if (window == top) {
                    location.href = respObj.data.redirect;
                } else {
                    top.location.href = respObj.data.redirect;
                }
            }
        }
    });
}


//订单年报
function selectedYearRpt(year) {
    $.get("/router/rest/method/OrderYearly/year/" + year, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == "success") {
                var yearArray = [];
                var amtArray = [];
                var cntArray = [];
                var gmvAmtArray = [];
                var gmvCntArray = [];
                var huanCntArray = [];

                for (var i = 0; i < respObj.data.length; i++) {
                    yearArray.push(respObj.data[i][0] + '年');
                    cntArray.push(respObj.data[i][1]);
                    amtArray.push(respObj.data[i][2]);
                    gmvCntArray.push(respObj.data[i][3]);
                    gmvAmtArray.push(respObj.data[i][4]);
                }

                for (var i = 0; i < respObj.data.length; i++) {
                  if(respObj.data[i-1]){
                      var data3=respObj.data[i-1][4];
                  }else{
                      var data3=0;
                  }

                      if(data3!=0){
                          if(respObj.data[i][4]!=0){
                              var datas3=(respObj.data[i][4]-data3)/data3*100;
                          }
                      }else{
                          if(respObj.data[i][4]!=0){
                              var datas3=100;
                          }else{
                              var datas3=0;
                          }
                      }
                    huanCntArray.push(datas3.toFixed(2));
                }
                options1.title.text = '每年订单数量和总金额';
                options1.dataZoom = [];
                options1.legend.x = 'left';
                options1.legend.y = 'top';

                options1.xAxis[0].data = yearArray;
                options1.series[0].data = gmvAmtArray;
                options1.series[1].data = amtArray;
                options1.series[2].data = gmvCntArray;
                options1.series[3].data = cntArray;
                options1.series[4].data = huanCntArray;

                options1.yAxis[0].interval =8000000;
                options1.yAxis[1].interval = 600;
                var maxAmt = Math.max(maxArrayCell(amtArray), maxArrayCell(gmvAmtArray));

                var maxCnt = Math.max(maxArrayCell(cntArray), maxArrayCell(gmvCntArray));

                var part = Math.max(maxAmt / options1.yAxis[0].interval, maxCnt / options1.yAxis[1].interval);
                part = Math.floor(part) + 1;


                options1.yAxis[0].max = options1.yAxis[0].interval * part;

                options1.yAxis[1].max = options1.yAxis[1].interval * part;
                yearlyChart.setOption(options1);

            } else if (respObj.data && respObj.data.redirect) {
                if (window == top) {
                    location.href = respObj.data.redirect;
                } else {
                    top.location.href = respObj.data.redirect;
                }
            }
        }
    });
}

selectedQuarter(endYear);
selectedYearRpt(endYear);

//GMV和交易额汇总展示 echarts
var options ={
     title: {
        text: 'GMV和交易额汇总展示',
        subtext: '',
        x: 'center',
        align: 'right'
    },
    grid: {
        left: '6%',
        right: '12%',
        bottom: '10%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type : 'shadow'
        }
    },
    legend: {
        data: [],
        x: 'left'
    },
    label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
    toolbox: {
        show: true,
        feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                readOnly: false
            },
            magicType: {
                show: false,
                type: ['bar']
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    xAxis: [
        {
            type: 'category',
            splitLine:{show:false},
            data: []
        }
    ],
    yAxis: [
        {
            name: '金额(万元RMB)',
            splitLine:{show:false},
            type: 'value',
            boundaryGap: ['0%', '20%']
        }
    
    ],
    series: [
        {
            type: 'bar',
            barWidth:'80',
            data: []
        }]
}

function selectedGMVdisplay(startDt, endDt) {
    $.ajax({
        type: 'GET',
        url: '/router/rest/method/OrderDaily/begin/' + startDt + '/end/' + endDt,
        success: function (data, status) {
            if (status == "success") {
                totalStartDay = startDt;
                totalEndDay = endDt;
                var respObj = data;
                if (respObj.result == "success") {
                     var amtArray = [];
                     var cntArray = [];
                     var gmvAmtArray = [];
                     var gmvCntArray = [];
                    for (var i = 0; i < respObj.data.length; i++) {
                  
                        cntArray.push(respObj.data[i][1]);
                        amtArray.push(respObj.data[i][2]);
                        gmvCntArray.push(respObj.data[i][3]);
                        gmvAmtArray.push(respObj.data[i][4]);
                    }

                   gmvAmtArray  //gmv
                   amtArray     //支付金额
                   gmvCntArray  //订单数量
                    cntArray    //支付订单数
                    var gmvAmtArrays =0;
                    for (var i = 0; i < gmvAmtArray.length; i++) {
                        gmvAmtArrays += gmvAmtArray[i];
                    }
                    gmvAmtArrays=Math.floor(gmvAmtArrays/10000*100)/100 ; 

                     var amtArrays =0;
                    for (var i = 0; i < amtArray.length; i++) {
                        amtArrays += amtArray[i];
                    }

                    amtArrays=Math.floor(amtArrays/10000*100)/100;
                     var gmvCntArrays =0;
                    for (var i = 0; i < gmvCntArray.length; i++) {
                        gmvCntArrays += gmvCntArray[i];
                    }
                     var cntArrays =0;
                    for (var i = 0; i < cntArray.length; i++) {
                        cntArrays += cntArray[i];
                    }
                options.title.subtext = totalStartDay+"至"+totalEndDay;
                options.xAxis[0].data=["GMV","支付金额","订单数","支付订单数"];
                
                options.toolbox.feature.magicType.type = ['bar'];
                //options.series[0].data = [gmvAmtArrays,amtArrays,gmvCntArrays,cntArrays];
                options.series[0].data = [
                    {
                        value: gmvAmtArrays,
                        itemStyle:{
                            normal:{
                                color:'#E8B4B2'
                            }
                        }
                    },
                    {
                        value: amtArrays,
                        itemStyle:{
                            normal:{
                                color:'#2F4554'
                            }
                        }
                    },
                    {
                        value: gmvCntArrays,
                        itemStyle:{
                            normal:{
                                color:'#61A0A8'
                            }
                        }},
                    { 
                      value: cntArrays,
                        itemStyle:{
                            normal:{
                                color:'#D48265'
                            }
                        }  
                    }
                ];
            
                GMVdisplayChart.setOption(options); 
                }else if (respObj.data && respObj.data.redirect) {
                if (window == top) {
                    location.href = respObj.data.redirect;
                } else {
                    top.location.href = respObj.data.redirect;
                }
            }
         }
        }
     });
}
selectedGMVdisplay(startWeekInit,endDateInit);



$(document).ready(function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch ($(active).attr('href')) {
            case '#summary':
                $(".toobars").hide();
                $("#toobar").hide();
                echartsBox.addClass("timepicker-padding");
                break;
            case '#daily':
                $(".toobars").hide();
                $("#toobar").show();
                echartsBox.removeClass("timepicker-padding");
                $('#datepicker').data('daterangepicker').setStartDate(moment(dailyStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(dailyEndDay).format('MM/DD/YYYY'));
                break;
            case '#weekly':
                $(".toobars").hide();
                $("#toobar").show();
                echartsBox.removeClass("timepicker-padding");
                $('#datepicker').data('daterangepicker').setStartDate(moment(weeklyStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(weeklyEndDay).format('MM/DD/YYYY'));
                break;
            case '#monthly':
                $(".toobars").show();
                echartsBox.removeClass("timepicker-padding");
                $("#toobar").hide();
                break;
            case '#quarterly':
                echartsBox.addClass("timepicker-padding");
                $("#toobar").hide(); $(".toobars").hide();
                break;
            case '#yearly':
                 echartsBox.addClass("timepicker-padding");
                 $("#toobar").hide();$(".toobars").hide();
                break;
            case '#GMVdisplay':
                 $("#toobar").show(); $(".toobars").hide();
                 echartsBox.removeClass("timepicker-padding");
                $('#datepicker').data('daterangepicker').setStartDate(moment(totalStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(totalEndDay).format('MM/DD/YYYY'));
                break;
        }
    });

    var myDate = new Date();
    var year=myDate.getFullYear();
    var month=myDate.getMonth()+1;
    year=(year.toString()+'-'+month.toString());
    $('.form_datetimes').datetimepicker({
        language:  'zh-CN',
        format: 'yyyy-mm',
        startDate:'2015-01',
        endDate:year,
        weekStart: 1,
        todayBtn:  1,
        autoclose: true,
        todayHighlight: true,
        startView: 3, //这里就设置了默认视图为年视图
        minView: 3, //设置最小视图为年视图
        forceParse: 0,
        showMeridian: 1
    });
    $('.form_datetime').datetimepicker({
        language:  'zh-CN',
        format: 'yyyy-mm',
        startDate:'2015-01',
        endDate:year,
        weekStart: 1,
        todayBtn:  1,
        autoclose: true,
        todayHighlight: true,
        startView: 3, //这里就设置了默认视图为年视图
        minView: 3, //设置最小视图为年视图
        forceParse: 0,
        showMeridian: 1
    }).on('changeDate',function(ev){
       var dataes= $("#dtp_input2").val();
        var dates2=$("#dataes").val();
        if(dataes&&typeof(dataes)!="undefined"&&dataes!=0){

            selectedYear(dates2,$('#datas').val());
        }
    });

    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'startDate': '01/01/' + moment(Date.now()).format('YYYY'),
            'endDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()]
            },
            'opens': 'left'
        },
        function (start, end, label) {
            var yearBeg = (moment(Date.now()).subtract(1, 'd')).format('YYYY') + '-01-01';
            switch (activeTab) {
                case '#daily':
                    selectedDate(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
                case '#GMVdisplay':
                    selectedGMVdisplay(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
                case '#weekly':
                    //                  if (moment(start) < moment(yearBeg)) {
                    //    $('#datepicker').data('daterangepicker').setStartDate((moment(Date.now()).subtract(30, 'd')).format('MM/DD/YYYY'));
                    //    $('#datepicker').data('daterangepicker').setEndDate((moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'));
                    //    start = moment(startDateInit);
                    //    end = moment(endDateInit);
                    //}

                    selectedWeek(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
            }
        }
    );
});
