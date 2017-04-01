var echartsBox = $('.echartsBox');
$('#toobar').show();

//tabs
echartsBox.append('<ul id="group"></ul>');
var group = $("#group");
group.addClass('nav nav-tabs');
group.append('<li id="" class="active"><a href="#Buyerseller" data-toggle="tab">买卖家数量</a></li>');
group.append('<li><a href="#bsCntARPUTab" data-toggle="tab">买卖家数量和ARPU</a></li>');
group.append('<li><a href="#sellerAmtTab" data-toggle="tab">Top20卖家(按金额)</a></li>');
group.append('<li><a href="#sellerCntTab" data-toggle="tab">Top20卖家(按单数)</a></li>');
group.append('<li><a href="#buyerAmtTab" data-toggle="tab">Top20买家(按金额)</a></li>');
group.append('<li><a href="#buyerCntTab" data-toggle="tab">Top20买家(按单数)</a></li>');
group.append('<li><a href="#sbRelation" data-toggle="tab">买卖家关系</a></li>');

var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;


var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="Buyerseller" class="tab-pane active"><div id="Buyersellers" class="chart" style="height:' + (chartH-40) + 'px;width:' + chartW + 'px;margin-top:40px;"></div></div>');
container.push('<div id="bsCntARPUTab" class="tab-pane"><div id="bsCntARPU" class="chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div></div>');
container.push('<div id="sellerAmtTab" class="tab-pane"><div id="sellerAmt"  class="chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div></div>');
container.push('<div id="sellerCntTab" class="tab-pane"><div id="sellerCnt" class="chart"  style="height:' + chartH + 'px;width:' + chartW + 'px;"></div></div>');
container.push('<div id="buyerAmtTab" class="tab-pane"><div id="buyerAmt"  class="chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div></div>');
container.push('<div id="buyerCntTab" class="tab-pane"><div id="buyerCnt"  class="chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div></div>');
container.push('<div id="sbRelation" class="tab-pane chart" style="height:' +chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('</div>');
echartsBox.append(container.join(""));
//$('#tabs').css("padding-left", "20px");
var bsCntARPUChart = echarts.init(document.getElementById('bsCntARPU'));
var sellerAmtChart = echarts.init(document.getElementById('sellerAmt'));
var sellerCntChart = echarts.init(document.getElementById('sellerCnt'));
var buyerAmtChart = echarts.init(document.getElementById('buyerAmt'));
var buyerCntChart = echarts.init(document.getElementById('buyerCnt'));

var option = {
    title: {
        text: '卖家统计',
        x: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        left: 'left',
        data: []
    },
    toolbox: {
        show: true,
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {
                show: true
            },
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    grid: {
        left: '3%',
        right: '3%',
        bottom: '1%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: []
    },
    series: [
        {
            name: '总金额',
            type: 'bar',
            data: []
        }
    ]
};

//买家
var top20BuyerCntArray = [];
var top20BuyerAmtArray = [];
var top20BuyerNmCntArray = [];
var top20BuyerNmAmtArray = [];

//卖家
var top20SellerCntArray = [];
var top20SellerAmtArray = [];
var top20SellerNmCntArray = [];
var top20SellerNmAmtArray = [];

//ARPU
var dtArray = [];
var bCntArray = [];
var sCntArray = [];
var arpuAmtArray = [];
var atpuAmtArray = [];

var weekday = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");

function maxArrayCell(array) {
    var val = 0;
    for (var x in array) {
        val = Math.max(val, array[x]);
    }
    return val;
}

function showBsCntARPUChart() {
    var optionARPU = {
        title: {
            text: '每日买卖家数量和ARPU统计',
            x: 'center',
            align: 'right'
        },
        grid: {
            left: '3%',
            right: '3%',
            bottom: '1%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        legend: {
            data: ['买家数量', 'ARPU', '卖家数量', '平均营业额'],
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
                data: dtArray
            }
        ],
        yAxis: [
            {
                name: '金额(元RMB)',
                minInterval: 10000,
                type: 'value'
            },
            {
                name: '买卖家数量',
                nameLocation: 'end',
                type: 'value',
                inverse: false
            }
        ],
        series: [
            {
                name: '买家数量',
                type: 'line',
                yAxisIndex: 1,
                hoverAnimation: false,
                lineStyle: {
                    normal: {}
                },
                data: bCntArray
            },
            {
                name: 'ARPU',
                type: 'line',
                yAxisIndex: 0,
                hoverAnimation: false,
                lineStyle: {
                    normal: {}
                },
                data: arpuAmtArray
            },
            {
                name: '卖家数量',
                type: 'line',
                yAxisIndex: 1,
                hoverAnimation: false,
                lineStyle: {
                    normal: {}
                },
                data: sCntArray
            },
            {
                name: '平均营业额',
                type: 'line',
                yAxisIndex: 0,
                hoverAnimation: false,
                lineStyle: {
                    normal: {}
                },
                data: atpuAmtArray
            }
        ]
    }
    optionARPU.legend.left = 80;

    optionARPU.yAxis[0].interval = 5000;
    optionARPU.yAxis[1].interval = 10;

    var maxAmt = Math.max(maxArrayCell(arpuAmtArray), maxArrayCell(atpuAmtArray));
    var maxCnt = Math.max(maxArrayCell(bCntArray), maxArrayCell(sCntArray));
    var part = Math.max(maxAmt / optionARPU.yAxis[0].interval, maxCnt / optionARPU.yAxis[1].interval);
    part = Math.floor(part) + 1;

    optionARPU.yAxis[0].max = optionARPU.yAxis[0].interval * part;
    optionARPU.yAxis[1].max = optionARPU.yAxis[1].interval * part;

    bsCntARPUChart.setOption(optionARPU);
}

//var startDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY') + '-01-01';
var startDateInit = (moment(Date.now()).subtract(60, 'd')).format('YYYY-MM-DD');
var startDayInit = (moment(Date.now()).subtract(30, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');

var startDateSel = startDateInit;
var endDateSel = endDateInit;



function selectedDate(startDt, endDt) {
    $.get("/router/rest/method/OrderSellerBuyer/begin/" + startDt + "/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;

            if (respObj.result == "success") {
                var sellerArray = respObj.data.seller;
                var buyerArray = respObj.data.buyer;
                var arpuArray = respObj.data.arpu;

                //Top20买家
                top20BuyerCntArray = [];
                top20BuyerAmtArray = [];
                top20BuyerNmCntArray = [];
                top20BuyerNmAmtArray = [];

                var buyerAmtSA = buyerArray.sort(function(a, b)  {
                    return a[3] - b[3];
                }).reverse().slice(0, 20);

                buyerAmtSA.forEach(function(item, index)  {
                    top20BuyerNmAmtArray.push(item[1]);
                    top20BuyerAmtArray.push(item[3]);
                });

                top20BuyerNmAmtArray.reverse();
                top20BuyerAmtArray.reverse();

                var buyerCntSA = buyerArray.sort(function(a, b)  {
                    return a[2] - b[2];
                }).reverse().slice(0, 20);

                buyerCntSA.forEach(function(item, index)  {
                    top20BuyerNmCntArray.push(item[1]);
                    top20BuyerCntArray.push(item[2]);
                });

                top20BuyerNmCntArray.reverse();
                top20BuyerCntArray.reverse();

                //Top20卖家
                top20SellerCntArray = [];
                top20SellerAmtArray = [];
                top20SellerNmCntArray = [];
                top20SellerNmAmtArray = [];

                var sellerAmtSA = sellerArray.sort(function(a, b)  {
                    return a[3] - b[3];
                }).reverse().slice(0, 20);

                sellerAmtSA.forEach(function(item, index)  {
                    top20SellerNmAmtArray.push(item[1]);
                    top20SellerAmtArray.push(item[3]);
                });

                top20SellerNmAmtArray.reverse();
                top20SellerAmtArray.reverse();

                var sellerCntSA = sellerArray.sort(function(a, b)  {
                    return a[2] - b[2];
                }).reverse().slice(0, 20);

                sellerCntSA.forEach(function(item, index)  {
                    top20SellerNmCntArray.push(item[1]);
                    top20SellerCntArray.push(item[2]);
                });

                top20SellerNmCntArray.reverse();
                top20SellerCntArray.reverse();

                option.title.text = '卖家订单金额统计';
                option.yAxis.data = top20SellerNmAmtArray;
                option.series[0].name = '支付金额';
                option.series[0].data = top20SellerAmtArray;
                sellerAmtChart.setOption(option);

                //add by zhangwb start
                option.title.text = '卖家订单数量统计';
                option.yAxis.data = top20SellerNmCntArray;
                option.series[0].name = '支付订单数';
                option.series[0].data = top20SellerCntArray;
                sellerCntChart.setOption(option);

                option.title.text = '买家订单金额统计';
                option.yAxis.data = top20BuyerNmAmtArray;
                option.series[0].name = '支付金额';
                option.series[0].data = top20BuyerAmtArray;
                buyerAmtChart.setOption(option);

                option.title.text = '买家订单数量统计';
                option.yAxis.data = top20BuyerNmCntArray;
                option.series[0].name = '支付订单数';
                option.series[0].data = top20BuyerCntArray;
                buyerCntChart.setOption(option);
                //add by zhangwb end

                //summary表格
                var sellerCntArray = sellerArray.map(function(item, index)  {
                    return item[2];
                });
                var top20SellerCntTotal = eval(top20SellerCntArray.join('+'));
                var sellerCntTotal = eval(sellerCntArray.join('+'));

                var sellerAmtArray = sellerArray.map(function(item, index)  {
                    return item[3];
                });
                var top20SellerAmtTotal = eval(top20SellerAmtArray.join('+'));
                var sellerAmtTotal = eval(sellerAmtArray.join('+'));

                var buyerCntArray = buyerArray.map(function(item, index)  {
                    return item[2];
                });
                var top20BuyerCntTotal = eval(top20BuyerCntArray.join('+'));
                var buyerCntTotal = eval(buyerCntArray.join('+'));

                var buyerAmtArray = buyerArray.map(function(item, index)  {
                    return item[3];
                });
                var top20BuyerAmtTotal = eval(top20BuyerAmtArray.join('+'));
                var buyerAmtTotal = eval(buyerAmtArray.join('+'));

                $('#Buyersellers').empty();
                $('#Buyersellers').append('<table class="table" id="sumTable"></table>');
                $('#sumTable').append(
                    '<thead>' +
                    '<tr>' +
                    '<td>' + "分类" + '</td>' +
                    '<td>' + "参与数量" + '</td>' +
                    '<td>' + "Top20订单金额占比" + '</td>' +
                    '<td>' + "Top20订单数量占比" + '</td>' +
                    '<td>' + "平均订单金额" + '</td>' +
                    '<td>' + "平均订单数量" + '</td>' +
                    '<td>' + "平均营业额｜ARPU" + '</td>' +
                    '</tr>' +
                    '</thead>'
                );
                $('#sumTable').append(
                    '<tbody>' +
                    '<tr>' +
                    '<td>' + "卖家" + '</td>' +
                    '<td>' + formatMoney(sellerArray.length, 0) + '</td>' +
                    '<td>' + ((top20SellerAmtTotal / sellerAmtTotal) * 100).toFixed(2) + "%" + '</td>' +
                    '<td>' + ((top20SellerCntTotal / sellerCntTotal) * 100).toFixed(2) + "%" + '</td>' +
                    '<td>' + formatMoney((sellerAmtTotal / sellerCntTotal).toFixed(2), 1) + '</td>' +
                    '<td>' + formatMoney(((sellerCntTotal / sellerArray.length).toFixed(2)),1) + '</td>' +
                    '<td>' + formatMoney((sellerAmtTotal / sellerArray.length).toFixed(2), 1) + '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td>' + "买家" + '</td>' +
                    '<td>' + formatMoney(buyerArray.length, 0) + '</td>' +
                    '<td>' + ((top20BuyerAmtTotal / buyerAmtTotal) * 100).toFixed(2) + "%" + '</td>' +
                    '<td>' + ((top20BuyerCntTotal / buyerCntTotal) * 100).toFixed(2) + "%" + '</td>' +
                    '<td>' + formatMoney((buyerAmtTotal / buyerCntTotal).toFixed(2), 1) + '</td>' +
                    '<td>' + formatMoney((buyerCntTotal / buyerArray.length).toFixed(2),1) + '</td>' +
                    '<td>' + formatMoney((buyerAmtTotal / buyerArray.length).toFixed(2), 1) + '</td>' +
                    '</tr>' +
                    '</tbody>'
                );
       
                //每日买卖家数量和ARPU
                // dtArray = [];
                // bCntArray = [];
                // sCntArray = [];
                // arpuAmtArray = [];
                // atpuAmtArray = [];

                // arpuArray.forEach(function(item, index)  {
                //     dtArray.push(moment(item[0]).format('YYYY年M月D日') + weekday[moment(item[0]).day()]);
                //     sCntArray.push(item[1]);
                //     bCntArray.push(item[2]);
                //     atpuAmtArray.push((item[3] / item[1]).toFixed(2));
                //     arpuAmtArray.push((item[3] / item[2]).toFixed(2));
                // });

               // showBsCntARPUChart();

            } else if (respObj.data && respObj.data.redirect) {

                //console.log("redirect: %s", respObj.data.redirect);
                if (window == top) {
                    location.href = respObj.data.redirect;
                } else {
                    top.location.href = respObj.data.redirect;
                }
            }
        }
    });
}


function selectedDay(startDt, endDt) {
    $.get("/router/rest/method/OrderSellerBuyer/begin/" + startDt + "/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;

            if (respObj.result == "success") {
                 var arpuArray = respObj.data.arpu;

                 //每日买卖家数量和ARPU
                dtArray = [];
                bCntArray = [];
                sCntArray = [];
                arpuAmtArray = [];
                atpuAmtArray = [];

                arpuArray.forEach(function(item, index)  {
                    dtArray.push(moment(item[0]).format('YYYY年M月D日') + weekday[moment(item[0]).day()]);
                    sCntArray.push(item[1]);
                    bCntArray.push(item[2]);
                    atpuAmtArray.push((item[3] / item[1]).toFixed(2));
                    arpuAmtArray.push((item[3] / item[2]).toFixed(2));
                });
                showBsCntARPUChart();
            }else if (respObj.data && respObj.data.redirect) {

                //console.log("redirect: %s", respObj.data.redirect);
                if (window == top) {
                    location.href = respObj.data.redirect;
                } else {
                    top.location.href = respObj.data.redirect;
                }
            }
        }
    });
}


function selectSBRelation(startDt, endDt) {
    //console.log("start date: %s, end date: %s.", startDt, endDt);

    $('#sbRelation').empty();
    $('#sbRelation').append(
        '<table id="table"' +
        'data-toggle="table"' +
        'data-search="true"' +
            //'data-show-refresh="true"' +
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-page-size="8"' +
        'data-page-list="[]"' +
        'data-height="465"' +
        '></table>');

    $('#table').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="seller" data-sortable="true">卖家</th>' +
        '<th data-field="buyer" data-sortable="true">买家</th>' +
        '<th data-field="amt" data-sortable="true" data-searchable="false"' +
        'data-align="right"' +
        'data-formatter="amtFormatter"' +
        '>交易金额</th>' +
        '<th data-field="cnt" data-sortable="true" data-searchable="false"' +
        'data-align="right"' +
        'data-formatter="cntFormatter"' +
        '>交易数量</th>' +
        '</tr>' +
        '</thead>'
    );

    $('#table').bootstrapTable({
        url: '/router/rest/method/sellerbuyerRelation?begin=' + startDt + '&end=' + endDt,
        onLoadSuccess:function(){
        }
    });
}


selectedDate(startDateInit, endDateInit);
selectedDay(startDayInit, endDateInit);


$(document).ready(function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        //console.log($(active).attr('href'));
        switch ($(active).attr('href')) {
            case '#sellerAmtTab':
                option.title.text = '卖家订单金额统计';
                option.yAxis.data = top20SellerNmAmtArray;
                option.series[0].name = '支付总金额';
                option.series[0].data = top20SellerAmtArray;
                sellerAmtChart.setOption(option);
                break;
            case '#sellerCntTab':
                option.title.text = '卖家订单数量统计';
                option.yAxis.data = top20SellerNmCntArray;
                option.series[0].name = '支付订单数';
                option.series[0].data = top20SellerCntArray;
                sellerCntChart.setOption(option);
                break;
            case '#buyerAmtTab':
                option.title.text = '买家订单金额统计';
                option.yAxis.data = top20BuyerNmAmtArray;
                option.series[0].name = '支付金额';
                option.series[0].data = top20BuyerAmtArray;
                buyerAmtChart.setOption(option);
                break;
            case '#buyerCntTab':
                option.title.text = '买家订单数量统计';
                option.yAxis.data = top20BuyerNmCntArray;
                option.series[0].name = '支付订单数';
                option.series[0].data = top20BuyerCntArray;
                buyerCntChart.setOption(option);
                break;
            case '#sbRelation':
                selectSBRelation(startDateSel, endDateSel);
                break;
        }
    });


    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            "startDate": (moment(Date.now()).subtract(90, 'd')).format('MM/DD/YYYY'),
            "endDate": (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()]
            },
            "opens": 'left'
        },
        function (start, end, label) {
            startDateSel = start.format('YYYY-MM-DD');
            endDateSel = end.format('YYYY-MM-DD');

            selectedDate(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
            selectedDay(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
            selectSBRelation(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        }
    );


});
