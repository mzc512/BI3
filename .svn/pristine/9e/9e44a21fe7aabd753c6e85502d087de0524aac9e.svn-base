/*时间序列维度*/
var echartsBox = $('.echartsBox');
$('#toobar').show();
var begin = GetQueryString('begin');
var end = GetQueryString('end');
//tabs
echartsBox.append('<ul id="group" class="nav nav-tabs"></ul>');

$("#group").append('<li class="active"><a href="#search" data-toggle="tab">来源统计</a></li>');

//chart
echartsBox.append('<div id="payTool"></div>');
var payToolDiv = $('#payTool');
payToolDiv.addClass('chart');
payToolDiv.css('height', '400px');
var payToolChart = echarts.init(document.getElementById('payTool'));


var chartSize = getChartSize(true);
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="search" class="tab-pane active chart"></div>');
container.push('</div>');

var tabs = $('<div id="tabs" class="tab-content" ></div>');
echartsBox.append(tabs);
tabs.append(container.join(""));

var activeTab = '#search';

var startDateInit = (begin!=null?begin:(moment(Date.now()).subtract(30, 'd')).format('YYYY-MM-DD'));
var endDateInit = (end!=null?getYesDay(end):(moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD'));
var searchStartDay = startDateInit;
var searchEndDay = endDateInit;

$(document).ready(function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch ($(active).attr('href')) {
            case '#search':
                $("#toobar").show();
                echartsBox.css("padding-top", "4px");
                $('#datepicker').data('daterangepicker').setStartDate(moment(searchStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(searchEndDay).format('MM/DD/YYYY'));
                break;
        }
    });

    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(0, 'd')).format('MM/DD/YYYY'),
            "startDate": formatDay(searchStartDay),
            "endDate": formatDay(searchEndDay),
            'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()]
            },
            'opens': 'left'
        },
        function (start, end, label) {
            var yearBeg = '01/01/' + moment(Date.now()).format('YYYY');
            if (moment(start) < yearBeg) {
                $('#datepicker').data('daterangepicker').setStartDate((moment(Date.now()).subtract(7, 'd')).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate((moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'));
                start = moment(startDateInit);
                end = moment(endDateInit);
            }
            switch (activeTab) {
                case '#search':
                    selectedSearchList(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
            }
        }
    );

});

var option = {
    color: ['#f19063', '#53d4ad', '#f07667', '#64b0fb', '#f651a0'],
    title: {
        text: '会话&PV占比',
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
            name: '会话',
            type: 'pie',
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
            name: 'PV',
            type: 'pie',
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
//
function selectedSearchList(startDt, endDt) {
    urlStartDay = startDt;
    urlEndDay = endDt;

    //最后一天需要加多一天，hbase查询特殊
    endDt = getNextDay(endDt);

    $('#search').empty();
    $('#search').append(
        '<table id="searchTable"' +
        'data-toggle="table"' +
        'data-search="true"' +
        'data-show-columns="true"' +
        'data-sort-name="times"'+
        'data-sort-order="desc"'+
        'data-pagination="true"' +
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-height="500"' +
        '></table>');

    $('#searchTable').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="sourceLink" data-sortable="false">Category</th>' +
        '<th data-field="PV" data-sortable="false">PV</th>' +
        '<th data-field="times" data-sortable="false">会话</th>' +
        '<th data-field="durationPC" data-sortable="false">平均会话时长</th>' +
        '<th data-field="bounce" data-sortable="false">跳出率</th>' +
        '</tr>' +
        '</thead>'
    );

    $('#searchTable').bootstrapTable({
        url: '/router/rest/method/TrafficSource?begin=' + startDt + '&end=' + endDt,
        onLoadSuccess: function(data) {  //加载成功时执行
            if (data.length > 0) {
                var legendArray = [];
                var timesArray = [];
                var pvArray = [];
                var timesTotal = 0;
                var pvTotal = 0;
                for (var i = 1; i < data.length; i++) {
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
                    pvTotal    += parseInt(data[i]['PV']);
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
                payToolChart.setOption(option);
            }

        }
    });
}
function getNextDay(date){
    var date = new Date(date);
    date.setDate(date.getDate() + 1);
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
}
function getYesDay(date){
    var date = new Date(new Date(date)-24*60*60*1000);
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
}

function formatDay(date){
    var date = new Date(date);
    return (date.getMonth()+1) + '/' + date.getDate()+'/'+date.getFullYear();
}
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
selectedSearchList(startDateInit, endDateInit);
