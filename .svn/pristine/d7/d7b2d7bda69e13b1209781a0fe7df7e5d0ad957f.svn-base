/*时间序列维度*/
var echartsBox = $('.echartsBox');
$('#toobar').show();

var category = GetQueryString('category');
var begin = GetQueryString('begin');
var end = GetQueryString('end');
var name = GetQueryString('name');
var source = [];
source['os'] = '操作系统';
source['hwc'] = '终端设备';
source['app'] = '浏览器型号';
source['network'] = '网络运营商';
//tabs
echartsBox.append("<ul id=\"group\"></ul>");
$("#group").addClass('nav nav-tabs');
$("#group").css("padding-left", "20px");
$('#group').css("width", $(document).width() - 40 + "px");
$("#group").append('<li class=\"active\"><a href=\"javascript:;\" data-toggle=\"tab\">'+source[category]+'('+name+')明细：</a></li>');

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
        '<a onclick="window.location.href=\'/report/traffic_system.html?category='+category+'&begin='+begin+'&end='+end+'\';" href=\"javascript:;\"  data-toggle=\"tab\"><<返回</a>' +
        '</li></ul></div>' +
        '<br/>' +
        '<table id="searchTable"' +
        'data-toggle="table"' +
        'data-search="true"' +
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-sort-name="Ssn"'+
        'data-sort-order="desc"'+
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-height="500"' +
        '></table>');

    $('#searchTable').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="Name" data-sortable="false">Category</th>' +
        '<th data-field="Ssn" data-sortable="false">会话</th>' +
        '<th data-field="SsnPC" data-sortable="false">会话百分比</th>' +
        '</tr>' +
        '</thead>'
    );

    $('#searchTable').bootstrapTable({
        url: '/router/rest/method/TrafficSystemDetail?name='+name+'&category='+category+'&begin=' + startDt + '&end=' + endDt
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
