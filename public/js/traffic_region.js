/*订单区域分布*/
var echartsBox = $('.echartsBox');
echartsBox.css({"height": ($(document).height() - 112) + "px"});
$('#toobar').show();

var category = GetQueryString('category');
if(category==null){
    category = 'province';
}
//tabs
var groupw = $(document).width() - 40;
var tab = '<ul id="group" class="nav nav-tabs" style="padding-left:20px;width:' + groupw + 'px;">' +
    '<li '+('province'==category?'class=\"active\"':'')+'><a href="javascript:;" data-toggle="tab" onclick="window.location.href=\'/report/traffic_region.html?category=province\';">流量省份分布</a></li>' +
    '<!--<li '+('city'==category?'class=\"active\"':'')+'><a href="javascript:;" data-toggle="tab" onclick="window.location.href=\'/report/traffic_region.html?category=city\';">流量城市分布</a></li>--></ul>';

echartsBox.append(tab);

var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<table><tr><td><div id="province" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW/3*2 + 'px;"></div></td><td><div id="showtitle"></div><br/><div id="showtable"></div></td></tr></table>');
container.push('</div>');
echartsBox.append(container.join(""));

var provinceChart = echarts.init(document.getElementById('province'));

var option1 = {
    backgroundColor: '#fff',
    title: {
        text: '流量省份分布',
        subtext: '',
        left: 'center',
        textStyle: {
            color: '#404a59'
        }
    },
    tooltip: {
        trigger: 'item'
    },
    toolbox: {
        feature: {
            dataView: {
                readOnly: false
            },
            restore: {},
            saveAsImage: {}
        }
    },
    visualMap: {
        orient: 'horizontal',
        min: 0,
        max: 5000,
        left: 10,
        top: 10,
        text: ['流量'],
        calculable: true,
        dimension: 0
    },
    series: [
        {
            name: '省份流量',
            type: 'map',
            mapType: 'china',
            roam: true,
            data: [],
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: 'red'
                }
            }
        }
    ]
};


var startDateInit = (moment(Date.now()).subtract(7, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');


//订单省份统计
function selectedProvince(startDt, endDt) {
    //最后一天需要加多一天，hbase查询特殊
    endDt = getNextDay(endDt);
    $.get("/router/rest/method/SelectedProvince?begin=" + startDt + "&end=" + endDt, function (data, status) {
        if (data.length > 0) {
                var legendArray = [];
                var ssnArray = [];
                for (var i = 0; i < data.length; i++) {
                    legendArray.push(data[i]['Province']);
                    ssnArray.push({
                        name: data[i]['Province'],
                        value: data[i]['Ssn']
                    });
                }
                option1.series[0].data = ssnArray;
                option1.tooltip.formatter = function(params, ticket, callback)  {
                    var content = params.seriesName + ': ' + params.name + '<br/>会话数 :' + params.value ;
                    callback(ticket, content);
                    return content;
                };
                provinceChart.on("click", function (param){
                    var province = param.name;
                    selectCity(province,startDt,endDt)
                });
                selectCity('广东',startDt,endDt)
                provinceChart.setOption(option1);

        }else{

            provinceChart.setOption(option1);
        }
    });
}
//显示城市
function selectCity(province,begin,end){
    $('#searchTable').empty();
    $('#showtable').empty();
    $('#showtitle').html(province+'城市流量');
    $('#showtable').append(
        '<table width="300px" id="searchTable"' +
        'data-toggle="table"' +
        'data-search="false"' +
        'data-show-columns="false"' +
        'data-sort-name="Ssn"'+
        'data-sort-order="desc"'+
        'data-pagination="true"' +
        'data-page-size="50"' +
        'data-page-list="[10,50,100]"' +
        'data-height="500"' +
        '></table>');
    $('#searchTable').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="City" data-sortable="false">城市</th>' +
        '<th data-field="Ssn" data-sortable="false">会话</th>'+
        '<th data-field="SsnPC" data-sortable="false">会话百分比</th>'+
        '</tr>' +
        '</thead>'
    );
    $('#searchTable').bootstrapTable({
        url: '/router/rest/method/SelectedCity?province='+province+'&begin=' + begin + '&end=' + end
    });
}
$.get('/anaweb/js/echarts/v3.2.2/map/json/china.json', function (chinaJson) {
    echarts.registerMap('china', chinaJson);
    selectedProvince(startDateInit, endDateInit);
});


$(document).ready(function () {
    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            "startDate": formatDay(startDateInit),
            "endDate": formatDay(endDateInit),
            'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()]
            },
            'opens': 'left'
        },
        function (start, end, label) {
            selectedProvince(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        }
    );
});

function getNextDay(date){
    var date = new Date(date);
    date.setDate(date.getDate() + 1);
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