/*产品维度*/
var echartsBox = $('.echartsBox');
//echartsBox.css({"height": "auto"});
$('#toobar').show();


//tabs
echartsBox.append('<ul id="group" class="nav nav-tabs"></ul>');

$("#group").append('<li class="active"><a href="#tableTab" data-toggle="tab">商品销售订单金额/数量</a></li>');
$("#group").append('<li><a href="#productAmtTab" data-toggle="tab">Top20商品销量(按金额)</a></li>');
$("#group").append('<li><a href="#productCntTab" data-toggle="tab">Top20商品销量(按单数)</a></li>');

var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;

echartsBox.append('<div id="tabs" class="tab-content"></div>');

$('#tabs').append('<div id="tableTab" class="tab-pane chart active"></div>');


$('#tabs').append('<div id="productAmtTab" class="tab-pane chart" style="width: '+chartW+'px;height:'+chartH+'px;"></div>');

var productAmtChart = echarts.init(document.getElementById('productAmtTab'));

$('#tabs').append('<div id="productCntTab" class="tab-pane chart" style="width: '+chartW+'px;height:'+chartH+'px;"></div>');

var productCntChart = echarts.init(document.getElementById('productCntTab'));

var option = {
    title: {
        text: '卖家统计',
        x: 'center'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        left: 'left',
        data: []
    },
    toolbox: {
        show: true,
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {
                show: true
            },
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    grid: {
        left: '0%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: []
    },
    series: [
        {
            name: '总金额',
            type: 'bar',
            data: []
        }
    ]
};

var startDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY') + '-01-01';
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');

function queryParams() {
    return {
        sort: 'Amt',
        direction: 'desc',
        pageSize: 5,
        page: 1
    }
}





//var productData = [];

function selectedDateDaily(startDt, endDt) {

    $('#tableTab').empty();
    $('#tableTab').append(
        '<table id="table"' +
        'data-toggle="table"' +
        'data-search="true"' +
            //'data-show-refresh="true"' +
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-page-size="8"' +
        'data-page-list="[]"' +
        'data-height="470"' +
        '></table>');

    $('#table').append(
        '<thead>' +
        '<tr>' +
        //'<th data-field="Id" data-sortable="true">ID</th>' +
        '<th data-field="Name" data-sortable="true">商品名称</th>' +
        '<th data-field="Amt" data-sortable="true" data-searchable="false"' +
        'data-align="right"' +
        'data-formatter="amtFormatter"' +
        '>订购单金额</th>' +
        '<th data-field="Cnt" data-sortable="true" data-searchable="false"' +
        'data-align="right"' +
        'data-formatter="cntFormatter"' +
        '>订单数量</th>' +
        '</tr>' +
        '</thead>'
    );

    $('#table').bootstrapTable({
        url: '/router/rest/method/OrderProduct?begin=' + startDt + '&end=' + endDt,
        method: 'get',
        showExport: true,                     //是否显示导出
        exportDataType: "all"              //basic', 'all', 'selected
    });

    $.get("/router/rest/method/OrderProduct/begin/" + startDt + "/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;

            if (respObj.result == "success") {

                var top20ProductCntArray = [];
                var top20ProductAmtArray = [];
                var top20ProductNmCntArray = [];
                var top20ProductNmAmtArray = [];

                var productData = respObj.data;


                var productAmt = productData.sort(function(a, b)  {
                    return (a.Amt - b.Amt);
                }).reverse().slice(0, 20);

                for (x in productAmt) {
                    top20ProductAmtArray.push(productAmt[x].Amt);
                    top20ProductNmAmtArray.push(productAmt[x].Name);
                }

                var productCnt = productData.sort(function(a, b)  {
                    return (a.Cnt - b.Cnt);
                }).reverse().slice(0, 20);

                for (x in productCnt) {
                    top20ProductCntArray.push(productCnt[x].Cnt);
                    top20ProductNmCntArray.push(productCnt[x].Name);
                }

                option.title.text = '商品支付订单金额Top20';
                option.yAxis.data = top20ProductNmAmtArray.reverse();
                option.series[0].name = '总金额';
                option.series[0].data = top20ProductAmtArray.reverse();
                productAmtChart.setOption(option);

                option.title.text = '商品支付订单数量Top20';
                option.yAxis.data = top20ProductNmCntArray.reverse();
                option.series[0].name = '总单数';
                option.series[0].data = top20ProductCntArray.reverse();
                productCntChart.setOption(option);

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

selectedDateDaily(startDateInit, endDateInit);

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
            selectedDateDaily(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        }
    );
});
