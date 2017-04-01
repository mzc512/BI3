var echartsBox = $('.echartsBox');
$('#toobar').show();
var chartH = getChartHeight();
echartsBox.append('<div id="orderPaymentAndDuration" class="chart" style="height:'+chartH+'px;"></div>');

var paymentAndDurationChart = echarts.init(document.getElementById('orderPaymentAndDuration'));

var option = {
    title: {
        text: '订单支付金额和时长'
    },
    grid: {
        left: '0%',
        right: '5%',
        bottom: '10%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        showDelay: 0,
        formatter: function (params) {
            if (params.value.length > 1) {
                return params.seriesName + ' - ' + params.value[2] + '<br/>'
                    + '支付日期 : ' + params.value[3] + '<br/>'
                    + '金额 : ' + params.value[0] + ' 元<br/>'
                    + '支付时长 : ' + params.value[1] + ' 小时';
            } else {
                return '支付时长' + '<br>'
                    + params.name + ' : '
                    + (params.value).toFixed(2) + ' 小时';
            }
        },
        axisPointer: {
            show: true,
            type: 'cross',
            lineStyle: {
                type: 'dashed',
                width: 1
            }
        }
    },
    toolbox: {
        feature: {
            dataZoom: {},
            brush: {
                type: ['rect', 'polygon', 'clear']
            },
            saveAsImage: {
                show: true
            }
        }
    },
    brush: {},
    legend: {
        data: ['订单'],
        left: 'center'
    },
    xAxis: [
        {
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value} 元RMB'
            },
            splitLine: {
                show: false
            }
        }
    ],
    yAxis: [
        {
            type: 'value',
            scale: true,
            axisLabel: {
                formatter: '{value} 小时'
            },
            splitLine: {
                show: false
            }
        }
    ],
    dataZoom: [
        {
            show: true,
            realtime: true,
            xAxisIndex: [0],
            start: 0,
            end: 100
        },
        {
            show: true,
            realtime: true,
            yAxisIndex: [0],
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            realtime: true,
            xAxisIndex: [0],
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            realtime: true,
            yAxisIndex: [0],
            start: 0,
            end: 100
        }
    ],
    series: [
        {
            name: '订单',
            type: 'scatter',
            data: [],
            markArea: {
                silent: true,
                itemStyle: {
                    normal: {
                        color: 'transparent',
                        borderWidth: 1,
                        borderType: 'dashed'
                    }
                },
                data: [[{
                    name: '订单分布区间',
                    xAxis: 'min',
                    yAxis: 'min'
                }, {
                    xAxis: 'max',
                    yAxis: 'max'
                }]]
            },
            markPoint: {
                name: '支付时长',
                symbol: 'pin',
                symbolSize: 50,
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            },
            markLine: {
                lineStyle: {
                    normal: {
                        type: 'dotted'
                    }
                },
                data: [
                    {type: 'average', name: '平均值'},
                    {type: 'average', name: '平均值'}
                ]
            }
        }
    ]
};

var startDateInit = (moment(Date.now()).subtract(7, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');

function selectedDate(startDt, endDt) {
    $.get("/router/rest/method/OrderPaymentAndDuration/begin/" + startDt + "/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;

            if (respObj.result == "success") {
                var pairArray = [];
                var paymentArray = [];
                var durationArray = [];
                for (var i = 0; i < respObj.data.length; i++) {
                    pairArray.push(new Array((respObj.data[i][0]).toFixed(2), (respObj.data[i][1] / 60 / 60).toFixed(2),
                        respObj.data[i][2], respObj.data[i][3]));
                    paymentArray.push(respObj.data[i][0]);
                    durationArray.push(respObj.data[i][1]);
                }
                paymentAndDurationChart.setOption(option);
                paymentAndDurationChart.setOption({
                    series: [{
                        data: pairArray
                    }]
                });

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

selectedDate(startDateInit, endDateInit);

$(document).ready(function () {
    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            "startDate": (moment(Date.now()).subtract(7, 'd')).format('MM/DD/YYYY'),
            "endDate": (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()]
            },
            "opens": 'left'
        },
        function (start, end, label) {
            selectedDate(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        }
    );
});
