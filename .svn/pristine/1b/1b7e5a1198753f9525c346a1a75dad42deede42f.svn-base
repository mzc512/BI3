/**
 * Created by Administrator on 2016/12/9.
 */

/*订单区域分布*/
var echartsBox = $('.echartsBox');
echartsBox.css({"height": ($(document).height() - 112) + "px"});
$('#toobar').show();

//tabs
var groupw = $(document).width() - 40;
var tab = '<ul id="group" class="nav nav-tabs" style="padding-left:20px;width:' + groupw + 'px;">' +
    '<li class="active"><a href="#province" data-toggle="tab">会员流失</a></li>' +
    '<li><a href="#city" data-toggle="tab">会员留存</a></li>';

echartsBox.append(tab);

var chartSize = getChartSize(true);
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="province" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="city" class="tab-pane chart" style="margin-bottom: 150px; height:' + chartH + 'px;width:' + chartW + 'px;"></div></div>');
echartsBox.append(container.join(""));

var provinceChart = echarts.init(document.getElementById('province'));
var cityChart = echarts.init(document.getElementById('city'));

var option = {
    title:{
        text:'会员流失率',
        subtext:'',
        x: "center",
            textStyle: {
                color: '#000',
                fontSize: '22'
            }
    },
    legend: {
        data:['会员流失率']
    },
    tooltip: {
        trigger: 'axis',
        formatter: "会员流失率 : <br/>"
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
         data: ['2016-9-14','2016-11-14']
    },
    yAxis: {
        name:"流失率占比%",
        type: 'value',
        max:100,
        min:0,
        nameGap:22,
         splitLine: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0

                    },
                    splitArea: {
                        show: false
                    },
        axisLine: {onZero: false},
        axisLabel: {
            formatter: '{value}'
        },
        boundaryGap: false ,
        data: []
    },
    series: [
        {
            name: '流失用户数',
            type: 'line',
            smooth: true,
            itemStyle: {
                            normal: {
                                shadowColor: "rgba(0,0,0,0.4)",
                                barBorderRadius: 10,
                                shadowBlur: 50,
                                shadowOffsetY: 50,
                                width: 50,
                                label: {
                                    show: true,
                                    formatter: function(p) {
                                        return p.value > 0 ? (p.value)+'%' : '';
                                    }
                                }
                            }
                        },
            data:[]
        },
        {
            name: '流失用户数',
            type: 'line',
            smooth: true,
            itemStyle: {
                            normal: {
                                shadowColor: "rgba(0,0,0,0.4)",
                                barBorderRadius: 10,
                                shadowBlur: 50,
                                shadowOffsetY: 50,
                                width: 50,
                                label: {
                                    show: true,
                                    formatter: function(p) {
                                        return p.value > 0 ? (p.value)+'%' : '';
                                    }
                                }
                            }
                        },
            data:[]
        } ]
};



function days(time1, time2){
var date1=new Date(time1).getTime(),date2=new Date(time2).getTime();
return Math.floor((date1-date2)/(24*3600*1000));
}
 

var startDateInit = (moment(Date.now()).subtract(90, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');
var startDateInits=(moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');



//留存率
function selectedDateDaily(start) {
     startDateInits=start;
    $.get("/router/rest/method/memberRetention/begin/" + start, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var shipArray = [];
                var dtArray  = [];
                $("#city").append("<table border=\"2\"  width=\"93%\" height=\"20%\" fontSize=\"30\"><tr style=\"background:#5F9BDA\">"+
                    "<td>日期</td></tr><tr style=\"background:#DEEAF8\"><td>用户数</td></tr><tr><td>第N日留存</td></tr><tr style=\"background:#DEEAF8\"><td>留存率</td></tr>");
                for (var i = 0; i < respObj.data.length; i++){
                        var date = new Date(respObj.data[i]['xdatas']);
                        var dayes=Math.abs(days(respObj.data[respObj.data.length-1]['xdatas'],respObj.data[i]['xdatas'])-30);
                        if(dayes==0){
                            dayes="首日新增";
                        }else if(dayes==1){
                            dayes="次日留存率";
                        }else{
                            dayes=dayes+"日留存率";
                        }

                    var tr='<td>'+date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + '日</td>';
                   var tr1='<td>'+  dayes+'</td>';
                   var tr2='<td>'+ (respObj.data[i]['ycnt']/respObj.data[0]['ycnt']*100).toFixed(2)+'% </td>';
                   var tr3='<td>'+respObj.data[i]['ycnt']+'</td>';
                   $("#city tr:eq(0)").append(tr);  
                   $("#city tr:eq(1)").append(tr3);
                   $("#city tr:eq(2)").append(tr1);
                   $("#city tr:eq(3)").append(tr2);    
                     dtArray.push(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" +
                        "\n" +  dayes);
                    shipArray.push((respObj.data[i]['ycnt']/respObj.data[0]['ycnt']*100).toFixed(2));
                }

                $("#city").append("</table>");
                option.series[0].data = shipArray;
                option.yAxis.name="会员留存占比%";
                option.series[1].data = [];
                option.title.text='会员留存率';
                option.title.subtext='您查看的是'+(moment(start).subtract('days', 30).format('YYYY-MM-DD'))+'首日新增留存率';
                option.tooltip.formatter="会员留存率: <br/>{b}:{c}%";
                option.xAxis.data = dtArray;
                cityChart.setOption(option);
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


//流失率
function selectedProvince(startDt,endDt) {
    startDateInit=startDt;
    endDateInit=endDt;
    $.get("/router/rest/method/memberDrain/begin/" + startDt+"/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var shipArray = [];
                var deliveryArray = [];
                var shipPro = respObj.data;                
                var deliveryPro = respObj.data[1];
                var lostnewdtArray=[];
                var lostdtArray=[];
                for (var i = 0; i < shipPro.length; i++) {
                    var date = new Date(shipPro[i]['TMDate']);
                    lostdtArray.push(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日");
                    shipArray.push((shipPro[i]['LostUser']/shipPro[i]['TotalUser']*100).toFixed(2));
                    deliveryArray.push((shipPro[i]['loster']/shipPro[i]['totalnew']*100).toFixed(2));
                }
                option.title.text='会员流失率';
                option.tooltip.formatter="会员流失率: <br/>{b}用户流失率 : {c}%<br/>{b1}新增用户流失率 : {c1}%";
                option.title.subtext='';
                option.yAxis.name="会员流失占比%";
                option.xAxis.data=lostdtArray;
                option.series[0].data = shipArray;
                option.series[1].data = deliveryArray;

                provinceChart.setOption(option);
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
   
//流失率
function selectedProTables(startDt,endDt) {
    $('#province').append(
        '<table id="table"' +
        'data-toggle="table"' +
        'data-search="true"' +
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-page-size="8"' +
        'data-page-list="[]"' +
        'data-height="470"' +
        '></table>');

    $('#table').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="Stat_Date" data-sortable="true">日期</th>' +
        '<th data-field="TotalUser" data-sortable="true">总用户数</th>' +
        '<th data-field="LostUser" data-sortable="true">流失用户数</th>' +
        '<th data-field="LostNewUser" data-sortable="true">新增流失用户数</th>' +
        '<th data-field="LostRate" data-sortable="true">用户流失率</th>' +
        '<th data-field="LostNewRate" data-sortable="true">新增用户流失率</th>' +
        '</tr>' +
        '</thead>'
    );
    $('#table').bootstrapTable({
        url: '/router/rest/method/memberDrainTable/begin/' + startDt + '/end/' + endDt 
    });

}
    selectedProvince(startDateInit, endDateInit);
    selectedProTables(startDateInit, endDateInit);
    selectedDateDaily(startDateInits);
var activeTab="#province";
$(document).ready(function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch ($(active).attr('href')) {
            case '#province':
                $('#datepicker').daterangepicker({'singleDatePicker': false,'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()]
            }, 'opens': 'left'},function (start, end, label) {
                selectedProvince(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                selectedProTables(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
            });
                $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInit).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInit).format('MM/DD/YYYY'));
                
                break;
            case '#city':
                $('#datepicker').daterangepicker({ "startDate": (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),'singleDatePicker': true,'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()]
            }, 'opens': 'left'},function (start, end, label) {
                    $('#city table').empty();
                    selectedDateDaily(end.format('YYYY-MM-DD'));
                });
            $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInits).format('MM/DD/YYYY'));  
                break;
        }
    });

    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            "startDate": (moment(Date.now()).subtract(90, 'd')).format('MM/DD/YYYY'),
            "endDate": (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()]
            },
            'opens': 'left'
        },
        function (start, end, label) {
            switch (activeTab) {
                case '#province':
                    $('.bootstrap-table').empty();
                    selectedProvince(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    selectedProTables(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
                 }
        }
    );
});
