/*时间序列维度*/
var echartsBox = $('.echartsBox');
$('#toobar').show();
var categoryTitle = new Array();
categoryTitle['os']="操作系统";
categoryTitle['hwc']="终端设备";
categoryTitle['app']="浏览器型号";
categoryTitle['network']="网络运营商";
var category = GetQueryString('category');
if(category==null){
    category = 'os';
}
var begin = GetQueryString('begin');
var end = GetQueryString('end');
var startDateInit = (begin!=null?begin:(moment(Date.now()).subtract(30, 'd')).format('YYYY-MM-DD'));
var endDateInit = (end!=null?getYesDay(end):(moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD'));
var searchStartDay = startDateInit;
var searchEndDay = getNextDay(endDateInit);
//tabs

echartsBox.append("<ul id=\"group\"></ul>");
$("#group").addClass('nav nav-tabs');
$("#group").append('<li '+('os'==category?'class=\"active\"':'')+'><a href=\"javascript:;\" data-toggle=\"tab\" onclick="window.location.href=\'/report/traffic_system.html?category=os&begin='+startDateInit+'&end='+getNextDay(endDateInit)+'\';">操作系统</a></li>');
$("#group").append('<li '+('hwc'==category?'class=\"active\"':'')+'><a href=\"javascript:;\" data-toggle=\"tab\" onclick="window.location.href=\'/report/traffic_system.html?category=hwc&begin='+startDateInit+'&end='+getNextDay(endDateInit)+'\';">终端设备</a></li>');
$("#group").append('<li '+('app'==category?'class=\"active\"':'')+'><a href=\"javascript:;\" data-toggle=\"tab\" onclick="window.location.href=\'/report/traffic_system.html?category=app&begin='+startDateInit+'&end='+getNextDay(endDateInit)+'\';">浏览器型号</a></li>');
$("#group").append('<li '+('network'==category?'class=\"active\"':'')+'><a href=\"javascript:;\" data-toggle=\"tab\" onclick="window.location.href=\'/report/traffic_system.html?category=network&begin='+startDateInit+'&end='+getNextDay(endDateInit)+'\';">网络运营商</a></li>');

//chart
echartsBox.append("<div id=\"payTool\"></div>");
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

var activeTab = '#os';


$(document).ready(function () {


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
            //selectedSearchList(category,start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
            window.location.href='/report/traffic_system.html?category='+category+'&begin='+start.format('YYYY-MM-DD')+'&end='+end.format('YYYY-MM-DD');
        }
    );

});

var option = {
    title: {
        text: '',
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
            center: ['50%','60%'],
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
        'data-sort-name="Ssn"'+
        'data-sort-order="desc"'+
        'data-pagination="true"' +
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-height="500"' +
        '></table>');

    $('#searchTable').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="Link" data-sortable="false">Category</th>' +
        '<th data-field="Ssn" data-sortable="false">会话</th>' +
        '<th data-field="SsnPC" data-sortable="false">会话百分比</th>' +
        '</tr>' +
        '</thead>'
    );
    $('#searchTable').bootstrapTable({
        url: '/router/rest/method/TrafficSystem?category='+category+'&begin=' + startDt + '&end=' + endDt,
        onLoadSuccess: function(data) {  //加载成功时执行

            if (data.length > 0) {
                var legendArray = [];
                var ssnArray = [];
                var ssnTotal = 0;
                for (var i = 1; i < data.length; i++) {
                    if(data[i]['Name'] != '其它'){
                        legendArray.push(data[i]['Name']);
                        ssnArray.push({
                            value: data[i]['Ssn'],
                            name: data[i]['Name']
                        });
                        ssnTotal += parseInt(data[i]['Ssn']);
                    }
                }
                //option.title.text = categoryTitle[category];
                option.tooltip.formatter = function (params, ticket, callback) {
                    var val = params.value;
                    if (params.seriesIndex == 0) {
                        var per = (val * 100 / ssnTotal).toFixed(2) + '%';
                    }
                    var content = params.seriesName + '<br/>' + params.name +
                        ' : ' + val + ' (' + per + ')';

                    callback(ticket, content);
                    return content;
                };
                option.color = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#F4871A','#8B8BE3','#6A6582','#A095D4','#c4ccd3'];
                option.legend.data = legendArray;
                option.series[0].data = ssnArray;
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
selectedSearchList(category,startDateInit, endDateInit);
