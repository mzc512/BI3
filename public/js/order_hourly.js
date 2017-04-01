var echartsBox = $('.echartsBox');
$('#toobar').show();

var chartH = getChartHeight();
echartsBox.append('<div id="hourly" class="chart" style="height:'+chartH+'px;"></div>');
var hourlyChart = echarts.init(document.getElementById('hourly'));

option = {
    title: {
        text: '每周订单数量和总金额',
        x: 'center',
        align: 'right'
    },
    grid: {
        left: '2%',
        right: '2%',
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
        x: 'center',
        y: 'bottom'
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
            nameLocation: 'end',
            type: 'value',
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

var startDateInit = (moment(Date.now()).subtract(30, 'd')).format('YYYY');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');


function maxArrayCell(array) {
    var val = 0;
    for (var x in array) {
        val = Math.max(val, array[x]);
    }
    return val;
}

function selectedHourly(startDt, endDt) {
    $.get("/router/rest/method/OrderHourly/begin/" + startDt + "/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;

            if (respObj.result == "success") {
                var hrArray = [];
                var amtArray = [];
                var cntArray = [];
                var gmvAmtArray = [];
                var gmvCntArray = [];
                for (var i = 0; i < respObj.data.length; i++) {
                    hrArray.push(respObj.data[i][0]);
                    cntArray.push(respObj.data[i][1]);
                    amtArray.push(respObj.data[i][2]);
                    gmvCntArray.push(respObj.data[i][3]);
                    gmvAmtArray.push(respObj.data[i][4]);
                }

                option.title.text = '订单总数量/金额时段分布';
                option.dataZoom = [];

                option.xAxis[0].data = hrArray;

                option.series[0].data = gmvAmtArray;
                option.series[0].type = 'line';
                option.series[1].data = amtArray;
                option.series[1].type = 'line';
                option.series[2].data = gmvCntArray;
                option.series[2].type = 'line';
                option.series[3].data = cntArray;
                option.series[3].type = 'line';

                option.yAxis[0].interval = 1000000;
                option.yAxis[1].interval = 100;
                var maxAmt = Math.max(maxArrayCell(amtArray), maxArrayCell(gmvAmtArray));
                var maxCnt = Math.max(maxArrayCell(cntArray), maxArrayCell(gmvCntArray));
                var part = Math.max(maxAmt / option.yAxis[0].interval, maxCnt / option.yAxis[1].interval);
                part = Math.floor(part) + 1;
                option.yAxis[0].max = option.yAxis[0].interval * part;
                option.yAxis[1].max = option.yAxis[1].interval * part;

                hourlyChart.setOption(option);

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

selectedHourly(startDateInit, endDateInit);

$(document).ready(function () {
    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            "startDate":(moment(Date.now()).subtract(30, 'd')).format('MM/DD/YYYY'),
            "endDate": (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()]
            },
            "opens": 'left'
        },
        function (start, end, label) {
            selectedHourly(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        }
    );
});
