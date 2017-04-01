var echartsBox = $('.echartsBox');
$('#toobar').show();
//chart
echartsBox.append("<div id=\"payTool\"></div>");
var payToolDiv = $('#payTool');
payToolDiv.addClass('chart');
payToolDiv.css('height', '400px');
var payToolChart = echarts.init(document.getElementById('payTool'));

//table
echartsBox.append('<div id="grid" class="chart"></div>');


var option = {
    title: {
        text: '订单支付工具占比',
        x: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: '10',
        data: []
    },
    toolbox: {
        show: true,
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {
                show: true,
                type: ['pie', 'funnel']
            },
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    calculable: true,
    series: [
        {
            name: '支付单数',
            type: 'pie',
            color:['#D53A35','#2F4554','#61A0A8','#D48265','#91C7AE'],
            radius: [30, 130],
            center: ['25%', '60%'],
            data: [],
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
        },
        {
            name: '支付金额',
            type: 'pie',
            color:['#D53A35','#2F4554','#61A0A8','#D48265','#91C7AE'],
            radius: [30, 130],
            center: ['75%', '60%'],
            data: [],
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


var startDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY') + '-01-01';
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');


function selectedDate(startDt, endDt) {
    $.get("/router/rest/method/OrderPayType/begin/" + startDt + "/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;

            if (respObj.result == "success") {
                var cntArray = [];
                var amtArray = [];
                var toolNmArray = [];
                var cntTotal = 0;
                var amtTotal = 0;

                for (var i = 0; i < respObj.data.length; i++) {
                    toolNmArray.push(respObj.data[i][0]);
                    cntArray.push({
                        value: respObj.data[i][1],
                        name: respObj.data[i][0]
                    });
                    amtArray.push({
                        value: respObj.data[i][2],
                        name: respObj.data[i][0]
                    });
                    cntTotal += respObj.data[i][1];
                    amtTotal += respObj.data[i][2];
                }

                option.tooltip.formatter = function (params, ticket, callback) {
                    var val = params.value;
                    if (params.seriesIndex == 0) {
                        var valstr = formatMoney(val.toFixed(2), 0);
                        var per = (val * 100 / cntTotal).toFixed(2) + '%';
                    } else {
                        var valstr = formatMoney(val.toFixed(2), 1)
                        var per = (val * 100 / amtTotal).toFixed(2) + '%';
                    }
                    var content = params.seriesName + '<br/>' + params.name +
                        ' : ' + valstr + ' (' + per + ')';

                    callback(ticket, content);
                    return content;
                };
                option.legend.data = toolNmArray;
                option.series[0].data = cntArray;
                option.series[1].data = amtArray;
                payToolChart.setOption(option);


                $('#grid').empty();
                $('#grid').css('height', ((toolNmArray.length+1 )* 40) +40 + 'px'); // 40 is for  laptop to scroll
                $('#grid').append('<table class="table table-striped" id="payToolTable"></table>');
                $('#payToolTable').append(
                    '<thead>' +
                    '<tr>' +
                    '<td>' + "支付工具" + '</td>' +
                    '<td>' + "订单数" + '</td>' +
                    '<td>' + "订单数占比" + '</td>' +
                    '<td>' + "支付金额" + '</td>' +
                    '<td>' + "支付金额占比" + '</td>' +
                    '<td>' + "平均订单金额" + '</td>' +
                    '</tr>' +
                    '</thead>'
                );
                $('#payToolTable').append('<tbody id="payToolTableBody"></tbody>');
                for (var j = 0; j < toolNmArray.length; j++) {
                    $('#payToolTableBody').append(
                        '<tr>' +
                        '<td>' + toolNmArray[j] + '</td>' +
                        '<td>' + formatMoney(cntArray[j].value, 0) + '</td>' +
                        '<td>' + ((cntArray[j].value / cntTotal) * 100).toFixed(2) + "%" + '</td>' +
                        '<td>' + formatMoney((amtArray[j].value).toFixed(2), 1) + '</td>' +
                        '<td>' + ((amtArray[j].value / amtTotal) * 100).toFixed(2) + "%" + '</td>' +
                        '<td>' + formatMoney((amtArray[j].value / cntArray[j].value).toFixed(2), 1) + '</td>' +
                        '</tr>'
                    );
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

selectedDate(startDateInit, endDateInit);

$(document).ready(function () {
    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            "startDate": '01/01/' + (moment(Date.now()).subtract(1, 'd')).format('YYYY'),
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
