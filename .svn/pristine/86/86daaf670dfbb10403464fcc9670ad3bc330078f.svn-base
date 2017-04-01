/*已取消订单*/
var echartsBox = $('.echartsBox');
$('#toobar').show();

$("#group").append('<li><a href="#celOrdMonthly" data-toggle="tab">月取消订单统计</a></li>');
var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;

var begintimes=dates2;
var endtimes=dates1;



$('#tabs').append('<div id="celOrdMonthly" class="tab-pane chart" style="width:'+chartW+'px; height:'+chartH+'px;"></div>');
var celOrdMonthlyChart = echarts.init(document.getElementById('celOrdMonthly'));


var option = {
    title: {
        text: '每月取消订单统计',
        x: 'center'
    },
    grid: {
        left: '0%',
        right: '3%',
        bottom: '10%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data: ['取消金额', '取消订单数'],
        x: 'left'
    },
    toolbox: {
        show: true,
        feature: {
            mark: {
                show: true
            },
            dataView: {
                show: true,
                readOnly: false
            },
            magicType: {
                show: true,
                type: ['line', 'bar']
            },
            restore: {
                show: true
            },
            saveAsImage: {
                show: true
            }
        }
    },
    xAxis: [
        {
            type: 'category',
            data: []
        }
    ],
    yAxis: [
        {
            name: '金额(元RMB)',
            type: 'value'
        },
        {
            name: '订单数(单)',
            nameLocation: 'end',
            type: 'value',
            inverse: false
        }
    ],
    series: [
        {
            name: '取消金额',
            type: 'bar',
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        },
        {
            name: '取消订单数',
            type: 'bar',
            yAxisIndex: 1,
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        }
    ]
};

var startDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY') + '-01-01';
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');
var endYear = (moment(Date.now()).subtract(1, 'd')).format('YYYY');

function queryParams() {
    return {
        sort: 'Amt',
        direction: 'desc',
        pageSize: 5,
        page: 1
    }
}


var orderData = [];

function selectedDateDaily(startDt, endDt) {
    //console.log("start date: %s, end date: %s.", startDt, endDt);

    $('#tableTab').empty();
    //$('#tableTab').append('<table id="table" data-toggle="table" data-pagination="true" data-page-size="8" data-page-list="[]" data-height="415"></table>');
    $('#tableTab').append(
        '<table id="table" data-toggle="table"' +
        'data-search="true"' +
            //'data-show-refresh="true"' +
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-page-size="8"' +
        'data-page-list="[]"' +
        'data-height="470">' +
        '</table>');

    $('#table').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="OrderId" id="pupup-target" data-sortable="true">订单ID</th>' +
        '<th data-field="OrderTm" data-sortable="true">下单时间</th>' +
        '<th data-field="PayTm" data-sortable="true">支付时间</th>' +
        '<th data-field="Amt" data-sortable="true" data-searchable="false"' +
        'data-align="right"' +
        'data-formatter="amtFormatter"' +
        '>订单金额</th>' +
        '<th data-field="CancelTm" data-sortable="true">取消时间</th>' +
        '</tr>' +
        '</thead>'
    );

    $('#table').bootstrapTable({
        url: '/router/rest/method/OrderCancel?begin=' + startDt + '&end=' + endDt
    });

}

//Order Cancel Monthly
function selectedMonthly(begintimes,endtimes) {
    //console.log("year: %s.", year);
    $.get("/router/rest/method/OrderCancelMonthly/begintimes/" + begintimes+"/endtimes/"+ endtimes, (data, status) => {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == "success") {
                var mthArray = [];
                var xmthArray = [];
                var cntArray = [];
                var amtArray = [];


                    for (var i = 0; i<  respObj.data.length; i++) {
                             if(respObj.data[i]){
                                 mthArray[i]=respObj.data[i][0]
                                 cntArray[i] =respObj.data[i][1];
                                 amtArray[i] =respObj.data[i][2];
                             }else{
                                 mthArray[i]=0;
                                 cntArray[i] =0;
                                 amtArray[i] =0;
                             }
                    }

                option.legend.x = 'center';
                option.legend.y = 'bottom';

                option.xAxis[0].data = mthArray;
                option.series[0].data = amtArray;
                option.series[1].data = cntArray;

                option.yAxis[0].interval = 3000;
                option.yAxis[1].interval = 5;

                var maxAmt = maxArrayCell(amtArray);
                var maxCnt = maxArrayCell(cntArray);
                var part = Math.max(maxAmt / option.yAxis[0].interval, maxCnt / option.yAxis[1].interval);

                part = Math.floor(part) + 1;
                option.yAxis[0].max = option.yAxis[0].interval * part;
                option.yAxis[1].max = option.yAxis[1].interval * part;

                celOrdMonthlyChart.setOption(option);

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
selectedMonthly(begintimes,endtimes);
function selects(res1){
    res1='B'+res1;
    $.get("/orderTypeList/method/OrderDetailsCancelled/orderid/" +  res1, (data, status) => {

        if (status == "success") {
            var respObj = data;
            if (respObj.result){
                var tabes='<div class="resume_div_wrap resume_div_wraphidx"><table width="100%" border="0" cellspacing="0" align="center" cellpadding="0" class="common_box" id="baseInfo"><tbody>'+
                       '<tr><td class="gap_between_tit"></td></tr><tr><td class="common_tit common_titty">订单号码：'+ res1+'</td></tr>';

                tabes+= '<tr><td><table width="80%"  border="1" align="center" cellspacing="1"  class="common_tab"><tbody>';
                tabes+= '<tr align="center" style="background: lightgrey;"><td>商品</td><td>数量</td><td>单价（元）</td></tr>';

                for(var c=0; c<4; c++){
                    if(respObj.data[0][c]==undefined){}else{
                        if(respObj.data[0][c].name==undefined){var names="";}else{var names=respObj.data[0][c].name;}
                        if(respObj.data[0][c].num==undefined){var num="";}else{var num=respObj.data[0][c].num;}
                        if(respObj.data[0][c].RMB==undefined){var RMB="";}else{var RMB=respObj.data[0][c].RMB;}
                    tabes+= '<tr align="center" ><td>'+names+'</td><td>'+num+'</td><td>'+RMB+'</td></tr>';}}

                tabes+= '</tbody></table></td></tr>';
                tabes+= '<tr><td class="common_con1"><table width="80%" border="0"  align="center" cellspacing="0" cellpadding="0" class="common_tab1" ><tbody>';

                    for(var i=1; i<33;i++){
                        if(i%4 ==1){
                            tabes+='<tr><td class="common_left">'+respObj.data[1][0][i]+'</td>';
                        }
                        if(i%4 ==2){
                            if(respObj.data[1][0][i]==null){
                                respObj.data[1][0][i]="";
                            }
                            tabes+='<td class="common_right_l">'+respObj.data[1][0][i]+'</td>';
                        }
                        if(i%4 ==3){
                            tabes+= '<td class="common_left">'+respObj.data[1][0][i]+'</td>';
                        }
                        if(i%4 ==0){
                            if(respObj.data[1][0][i]==null){
                                respObj.data[1][0][i]="";
                            }
                            tabes+='<td class="common_right_r">'+respObj.data[1][0][i]+'</td></tr>';
                        }
                    }
                csc_popuop.setContent(tabes+'</tbody></table></td></tr></tbody></table></div>');
            }
        }
    });
    csc_popuop.popUp();
    csc_popuop.setPopTitle('取消订单详情');



}

$(document).ready(function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch ($(active).attr('href')) {
            case '#tableTab':
                $("#toobar").show();  $(".toobars").hide();
                echartsBox.removeClass("timepicker-padding");
                break;
            case '#celOrdMonthly':
                $("#toobar").hide(); $(".toobars").show();
                echartsBox.removeClass("timepicker-padding");
                break;
        }
    });
    var myDate = new Date();
    var year=myDate.getFullYear();
    var month=myDate.getMonth()+1;
    year=(year.toString()+'-'+month.toString());
    $('.form_datetimes').datetimepicker({
        language:  'zh-CN',
        format: 'yyyy-mm',
        startDate:'2015-01',
        endDate:year,
        weekStart: 1,
        todayBtn:  1,
        autoclose: true,
        todayHighlight: true,
        startView: 3, //这里就设置了默认视图为年视图
        minView: 3, //设置最小视图为年视图
        forceParse: 0,
        showMeridian: 1
    });
    $('.form_datetime').datetimepicker({
        language:  'zh-CN',
        format: 'yyyy-mm',
        startDate:'2015-01',
        endDate:year,
        weekStart: 1,
        todayBtn:  1,
        autoclose: true,
        todayHighlight: true,
        startView: 3, //这里就设置了默认视图为年视图
        minView: 3, //设置最小视图为年视图
        forceParse: 0,
        showMeridian: 1
    }).on('changeDate',function(ev){
        var dataes= $("#dtp_input2").val();
        var dates2=$("#dataes").val();
        if(dataes&&typeof(dataes)!="undefined"&&dataes!=0){

            selectedMonthly(dates2,$('#datas').val());
        }
    });
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
