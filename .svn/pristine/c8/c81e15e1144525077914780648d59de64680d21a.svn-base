/*时间序列维度*/
var echartsBox = $('.echartsBox');
$('#toobar').show();
var categoryTitle = new Array();
categoryTitle['device']="搜索次数";
categoryTitle['browser']="搜索关键词热度";

var category = GetQueryString('category');
if(category==null){
    category = 'device';
}
//tabs
echartsBox.append("<ul id=\"group\"></ul>");
$("#group").addClass('nav nav-tabs');
$("#group").append('<li '+('device'==category?'class=\"active\"':'')+'><a href=\"javascript:;\" data-toggle=\"tab\" onclick="window.location.href=\'/report/traffic_search.html?category=device\';">搜索次数</a></li>');
//$("#group").append('<li '+('browser'==category?'class=\"active\"':'')+'><a href=\"javascript:;\" data-toggle=\"tab\" onclick="window.location.href=\'/report/traffic_search.html?category=browser\';">搜索关键词热度</a></li>');



var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="search" class="tab-pane active chart" ></div>');
container.push('</div>');

var tabs = $('<div id="tabs" class="tab-content" ></div>');
echartsBox.append(tabs);
tabs.append(container.join(""));

var activeTab = '#device';

var startDateInit =(moment(Date.now()).subtract(30, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');
var searchStartDay = startDateInit;
var searchEndDay = endDateInit;

$(document).ready(function () {
    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            "startDate": (moment(Date.now()).subtract(30, 'd')).format('MM/DD/YYYY'),
            "endDate": (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
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
            selectedSearchList(category,start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));

        }
    );
});
function selectedSearchList(category,startDt, endDt) {
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
        'data-sort-name="Time"'+
        'data-sort-order="desc"'+
        'data-pagination="true"' +
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-height="500"' +
        '></table>');

    $('#searchTable').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="Name" data-sortable="false">关键词</th>' +
        '<th data-field="Time" data-sortable="false">搜索次数</th>' +
        '<th data-field="TimePC" data-sortable="false">搜索占百分比</th>' +
        '</tr>' +
        '</thead>'
    );
    $('#searchTable').bootstrapTable({
        url: '/router/rest/method/TrafficSearch?begin=' + startDt + '&end=' + endDt
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
selectedSearchList(category,startDateInit, endDateInit);
