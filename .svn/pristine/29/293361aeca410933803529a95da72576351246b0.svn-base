/*user_order_reansfer
*会员转化率 漏斗图
**/


var xData = function() {
    var data = [];
    for (var i = 1; i < 15; i++) {
        data.push(i + "月份");
    }
    return data;
}();

var echartsBox = $('.echartsBox');
$('#toobar').show();

//tabs
echartsBox.append("<ul id=\"group\"></ul>");
$("#group").addClass('nav nav-tabs');
$("#group").append('<li class=\"active\"><a href=\"#daily\" data-toggle=\"tab\">转化率</a></li>');


var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="daily" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('</div>');

var tabs = $('<div id="tabs" class="tab-content" ></div>');
echartsBox.append(tabs);
tabs.append(container.join(""));

var activeTab = '#daily';

var dailyChart = echarts.init(document.getElementById('daily'));

var option = {
    title: {
        text: '会员转化率',
        top:10,
        x:'center'

    },
    tooltip: {
        trigger: 'item'
    },
    toolbox: {
        feature: {
            dataView: {readOnly: false},
            restore: {},
            saveAsImage: {}
        }
    },
    legend: {
        top:40,
        data: ['展现','点击','访问','咨询','订单']
    },
    calculable: true,
    series: [
        {
            name:'会员转化率',
            type:'funnel',
            left: '10%',
            top: 70,
            //x2: 80,
            bottom: 60,
            width: '80%',
            // height: {totalHeight} - y - y2,
            min: 0,
            max: 100,
            minSize: '0',
            maxSize: '600',
            sort: 'descending',
            gap: 2,
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                },
                emphasis: {
                    textStyle: {
                        fontSize: 20
                    }
                }
            },
            labelLine: {
                normal: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            },
            data: [
                {value: 60, name: '访问'},
                {value: 40, name: '咨询'},
                {value: 20, name: '订单'},
                {value: 80, name: '点击'},
                {value: 100, name: '展现'}
            ]
        }
    ]
};


var startDateInit = (moment(Date.now()).subtract(14, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');

var dailyStartDay = startDateInit;
var dailyEndDay = endDateInit;



function selectedDaily(startDt, endDt) {
    $.ajax({
        type: 'GET',
        url: '/router/rest/method/MembershipConversion/begin/' + startDt + '/end/' + endDt,
        success: function (data, status) {
            if (status == "success") {
                dailyStartDay = startDt;
                dailyEndDay = endDt;

                var respObj = data;
                if (respObj.result == true) {
                    var dtArray = [];
                    var dtArrays = [];
                    for (var i = 0; i < respObj.data.length; i++) {
                        var result2=(respObj.data[i]['order_cnt']/respObj.data[i]['reg_total']*100).toFixed(2);
                        var result3=(respObj.data[i]['pay_cnt']/respObj.data[i]['order_cnt']*100).toFixed(2);
                        if(respObj.data[i]['reg_total']!=null||respObj.data[i]['order_cnt']!=null||respObj.data[i]['pay_cnt']!=null){

                        dtArray.push({value: 100, name: '注册总数：'+formatMoney(respObj.data[i]['reg_total'],0)},
                            {value: 60, name: '下单数：'+respObj.data[i]['order_cnt']},
                            {value: 30, name: '支付数：'+respObj.data[i]['pay_cnt']});   
                        }else{
                             dtArray.push({value: 100, name: '注册总数'},
                            {value: 60, name: '下单数'},
                            {value: 30, name: '支付数'}); 
                        }        
                    }

                    option.title.text = '会员转化率';
                    if(!isNaN(result2)||!isNaN(result3)){
                       option.tooltip.formatter="{b}<br/>会员转化率:"+result2+"%<br/>支付率:"+result3+"%";
                    }else{
                       option.tooltip.formatter="{b}";
                    }
                    
                     option.legend.data=['注册总数','下单数','支付数'];
                    option.series[0].data=dtArray;
                    dailyChart.setOption(option);

                } else if (respObj.data && respObj.data.redirect) {

                    if (window == top) {
                        location.href = respObj.data.redirect;
                    } else {
                        top.location.href = respObj.data.redirect;
                    }
                }
            }
        },
        error:function(){
            console.info("AJAX ERROR");
        }
    });
}





selectedDaily(startDateInit, endDateInit);


$(document).ready(function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch ($(active).attr('href')) {
            case '#daily':
                $("#toobar").show();
                echartsBox.removeClass("timepicker-padding");
                $('#datepicker').data('daterangepicker').setStartDate(moment(dailyStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(dailyEndDay).format('MM/DD/YYYY'));
                break;

        }
    });

    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            "startDate": (moment(Date.now()).subtract(14, 'd')).format('MM/DD/YYYY'),
            "endDate": (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()],
                '最近半年': [moment().subtract('days', 183), moment()],
                '最近一年': [moment().subtract('days', 365), moment()],
                '最近二年': [moment().subtract('days', 730), moment()]
            },
            'opens': 'left'
        },
        function (start, end, label) {
            switch (activeTab) {
                case '#daily':
                    selectedDaily(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
            }
        }
    );

});

