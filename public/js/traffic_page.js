/*时间序列维度*/
var echartsBox = $('.echartsBox');
$('#toobar').show();

var category = GetQueryString('category');
if(category==null){
    category = 'url';
}
var begin = GetQueryString('begin');
var end = GetQueryString('end');
var startDateInit = (begin==null?(moment(Date.now()).subtract(30, 'd')).format('YYYY-MM-DD'):begin);
var endDateInit = (end==null?(moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD'):end);
var searchStartDay = startDateInit;
var searchEndDay = endDateInit;

var source = [];
source['url'] = 'URL访问列表';
source['activity'] = '活动页面列表';
source['channel'] = '频道页面列表';

//tabs
echartsBox.append("<ul id=\"group\"></ul>");
$("#group").addClass('nav nav-tabs');
$("#group").css("padding-left", "20px");
$('#group').css("width", $(document).width() - 40 + "px");
for(var key in source) {
    $("#group").append('<li '+(key==category?'class=\"active\"':'')+'>' +
        '<a onclick="window.location.href=\'/report/traffic_page.html?category='+key+'&begin='+startDateInit+'&end='+endDateInit+'\';" href=\"javascript:;\"' +
        'data-toggle=\"tab\">' + source[key] + '</a></li>');
}

var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;
var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="search" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('</div>');

var tabs = $('<div id="tabs" class="tab-content" ></div>');
echartsBox.append(tabs);
tabs.append(container.join(""));

var activeTab = '#search';

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
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
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
                    window.location.href='/report/traffic_page.html?category='+category+'&begin='+start.format('YYYY-MM-DD')+'&end='+end.format('YYYY-MM-DD');
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
        '<table style="table-layout:fixed;word-wrap:break-word;" id="searchTable"' +
        'data-toggle="table"' +
        'data-search="true"' +
        'data-sort-name="Ssn"'+
        'data-sort-order="desc"'+
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-height="500"' +
        '></table>');

    $('#searchTable').append(
        '<colgroup>'+
        (category!='url'?'<col style="width:10%">':'')+
        '<col style="width:30%">'+
        '<col style="width:10%">'+
        '<col style="width:10%">'+
        '<col style="width:10%">'+
        '</colgroup>'+
        '<thead>' +
        '<tr>' +(category!='url'?'<th data-field="Name" data-sortable="true">名称</th>':'')+
        '<th data-field="Url" data-sortable="true" style="width:400px">URL地址</th>' +
        '<th data-field="PVPC" data-sortable="true">PV</th>' +
        '<th data-field="Ssn" data-sortable="true">会话</th>' +
        '<th data-field="UV" data-sortable="true">UV</th>' +
        '<th data-field="ExitPC" data-sortable="true">退出率</th>' +
        '<th data-field="BouncePC" data-sortable="true">跳出率</th>' +
        '<th data-field="DurationPC" data-sortable="true">平均停留时间</th>' +
        '</tr>' +
        '</thead>'
    );
        $('#searchTable').bootstrapTable({
            url: '/router/rest/method/TrafficUrl?category='+category+'&begin=' + startDt + '&end=' + endDt
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
