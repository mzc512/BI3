/*时间序列维度*/
var echartsBox = $('.echartsBox');
$('#toobar').show();

var category = GetQueryString('category');
var begin = GetQueryString('begin');
var end = GetQueryString('end');

var source = [];
source['ads'] = '广告流量';
source['direct'] = '直接访问';
source['link'] = '推介流量';
source['other'] = '其它';
source['se'] = '自然搜索';
//tabs
echartsBox.append("<ul id=\"group\"></ul>");
$("#group").addClass('nav nav-tabs');
$("#group").css("padding-left", "20px");
$('#group').css("width", $(document).width() - 40 + "px");
$("#group").append('<li class=\"active\"><a href=\"javascript:;\" data-toggle=\"tab\">'+source[category]+'明细：</a></li>');

if(category=='ads' || category=='se'){
    //chart
    echartsBox.append("<div id=\"payTool\"></div>");
    var payToolDiv = $('#payTool');
    payToolDiv.addClass('chart');
    payToolDiv.css('height', '400px');
    var payToolChart = echarts.init(document.getElementById('payTool'));
}

var containH = $(document).height();
var otherH = 50 + $("#group").outerHeight(true);
var justifyH = 70;  //for no vertical scrollbar;

var chartSize = getChartSize(true);
var chartH = chartSize.height;
var chartW = chartSize.width;

var containW = $(document).width();
var otherW = 36 + 4;
var justifyW = 0;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="search" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('</div>');

var tabs = $('<div id="tabs" class="tab-content" ></div>');
echartsBox.append(tabs);
tabs.append(container.join(""));

var activeTab = '#search';

var startDateInit = begin;
var endDateInit = getYesDay(end);

var searchStartDay = startDateInit;
var searchEndDay = endDateInit;
var option = {
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

$(document).ready(function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch ($(active).attr('href')) {
            case '#search':
                $("#toobar").show();
                $("#hardpart").show();
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
            "startDate":formatDay(searchStartDay),
            "endDate": formatDay(searchEndDay),
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

//
function selectedSearchList(startDt, endDt) {
    urlStartDay = startDt;
    urlEndDay = endDt;
    //最后一天需要加多一天，hbase查询特殊
    endDt = getNextDay(endDt);

    $('#search').empty();
    $('#search').append(
        '<div class="pull-right pagination" style="margin:0;">' +
        '<ul class="pagination" style="margin-right:0px;margin-top: 25px;padding-left: 10px;"><li class="page-number">' +
        '<a onclick="window.location.href=\'/report/traffic_source.html?begin='+begin+'&end='+end+'\';" href=\"javascript:;\"  data-toggle=\"tab\"><<返回</a>' +
        '</li></ul></div>' +
        '<br/>' +
        '<table id="searchTable"' +
        'data-toggle="table"' +
        'data-search="true"' +
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-sort-name="times"'+
        'data-sort-order="desc"'+
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-height="500"' +
        '></table>');

    $('#searchTable').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="SubCategory" data-sortable="false">Category</th>' +
        '<th data-field="PVPC" data-sortable="false">PV</th>' +
        '<th data-field="times" data-sortable="false">会话</th>' +
        '<th data-field="durationPC" data-sortable="false">平均会话时长</th>' +
        '<th data-field="bounce" data-sortable="false">跳出率</th>' +
        '</tr>' +
        '</thead>'
    );

    $('#searchTable').bootstrapTable({
        url: '/router/rest/method/TrafficSourceDetail?category='+category+'&begin=' + startDt + '&end=' + endDt,
        onLoadSuccess: function(data) {  //加载成功时执行
            if (data.length > 0 && (category=='ads' || category=='se')) {
                var legendArray = [];
                var timesArray = [];
                var pvArray = [];
                var timesTotal = 0;
                var pvTotal = 0;
                for (var i = 0; i < data.length; i++) {
                    legendArray.push(data[i]['SubCategory']);
                    timesArray.push({
                        value: data[i]['times'],
                        name: data[i]['SubCategory']
                    });
                    pvArray.push({
                        value: data[i]['PV'],
                        name: data[i]['SubCategory']
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
