/**
 * Created by Administrator on 2016/12/7.
 */

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
$("#group").append('<li class=\"active\"><a href=\"#daily\" data-toggle=\"tab\">日占比</a></li>' +
'<li><a href=\"#weekly\" data-toggle=\"tab\">周占比</a></li>'+
'<li><a href=\"#monthly\" data-toggle=\"tab\">月占比</a></li>'+
'<li><a href=\"#quarterly\" data-toggle=\"tab\">季度占比</a></li>'+
'<li><a href=\"#yearly\" data-toggle=\"tab\">年度占比</a></li>');


var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="daily" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="weekly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="monthly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="quarterly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="yearly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;">');
container.push('</div>');

var tabs = $('<div id="tabs" class="tab-content" ></div>');
echartsBox.append(tabs);
tabs.append(container.join(""));

var activeTab = '#daily';

var dailyChart = echarts.init(document.getElementById('daily'));
var weeklyChart = echarts.init(document.getElementById('weekly'));
var monthlyChart = echarts.init(document.getElementById('monthly'));
var quarterlyChart = echarts.init(document.getElementById('quarterly'));
var yearlyChart = echarts.init(document.getElementById('yearly'));
var weekday = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
var begintimes=dates2;
var endtimes=dates1;
var option={
        title : {
            "text": "本年商场顾客男女人数统计",
            x: "center",

            textStyle: {
                color: '#000',
                fontSize: '22'
            }
        },
        tooltip : {
            trigger : 'axis',
            type:'value',
            showDelay : 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
             formatter: function (obj, ticket, callback) {
                    var style1 = 'font-size:30px;vertical-align:top;padding-right:5px;';
                    var res= '<div style="line-height:20px;"><span style="'+style1+'color:#fff">&bull;</span>' + obj[0].name+'&nbsp;&nbsp;&nbsp;'+obj[0].data.dd+' </div>';
                    res += '<div style="line-height:20px;"><span style="'+style1+'color:#fff">&bull;</span>' + obj[0].seriesName + ' ' + formatMoney(obj[0].value,0) + ' </div>';
                    res += '<div style="line-height:20px;"><span style="'+style1+'color:#fff">&bull;</span>' + obj[1].seriesName + ' ' + formatMoney(obj[1].value,0) + ' </div>';
                    res += '<div style="line-height:20px;"><span style="'+style1+'color:#fff">&bull;</span>' + obj[2].seriesName + ' ' + obj[2].value + '% </div>';
                    callback(ticket, res);
                    return res;
                },
            //formatter:'采购商：{c}<br/>供应商：{c1}<br/>采购商占比：{c2}%',
            axisPointer: {
                "type": "shadow",
                textStyle: {
                    color: "#fff"
                }
            }
        },
        legend: {
            x: 'center',
            top: '11%',
            textStyle: {
                color: '#90979c'
            },
            data:['采购商','供应商','采购商占比']
        },
        xAxis : [
                 {
                     type : 'category',
                     axisLabel:{
                         margin:10,
                         textStyle:{
                             color:"#222"
                         }
                     },
                     data :[]
                 }
             ],
         grid: { // 控制图的大小，调整下面这些值就可以xData
             "borderWidth": 0,
                "top": 110,
                x:80,
                x2:100,
                y2:150,
                textStyle: {
                    color: "#fff"
                }
         },
        yAxis : [
                 {
                      name:"商家数",
                      type: "value",
                      nameGap:22,
                      margin:10,
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
                     axisLabel : {
                         formatter: '{value}'
                     }
                 },
                {   type: "value",
                    name:"采购商占比%",
                    "splitLine": {
                        "show": false
                    },
                    "axisLine": {
                        lineStyle: {
                            color: '#90979c'
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    "axisLabel": {
                        "interval": 0

                    },
                    "splitArea": {
                        "show": false
                    },
                     axisLabel : {
                                    formatter: '{value}'
                                 }
                 }],
        "dataZoom": [{
                            "show": false,
                            "height": 30,
                            "xAxisIndex": [
                                0
                            ],
                            bottom: 30,
                            "start": 0,
                            "end": 100,
                            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                            handleSize: '110%',
                            handleStyle:{
                                color:"#d3dee5",
                                
                            },
                               textStyle:{
                                color:"#fff"},
                               borderColor:"#90979c"
                            
                            
                        }, {
                            "type": "inside",
                            "show": true,
                            "height": 15,
                            "start": 1,
                            "end": 35
                        }],
        series : [{
                    name:'采购商',
                    type:'bar',
                    stack: '总量',
                    barMaxWidth: 65,
                    itemStyle: {
                    normal: {
                        color: "rgba(255,144,128,1)",
                        label: {
                            show: true,
                            textStyle: {
                                "color": "#fff"
                            },
                          
                            formatter: function(p) {
                                return p.value > 0 ? formatMoney(p.value,0) : '';
                            }
                        }
                      }
                    },
                    data:[]
                  },
                  {
                      name:'供应商',
                      type:'bar',
                      stack: '总量',
                      barMaxWidth: 65,
                      itemStyle: {
                        normal: {
                            color: "rgba(0,191,183,1)",
                            barBorderRadius: 0,
                            label: {
                                show: true,
                                formatter: function(p) {
                                    return p.value > 0 ? formatMoney(p.value,0) : '';
                                }
                            }
                        }
                    },
                      data:[]
                  },
                  {
                      name:'采购商占比',
                      type:'line',
                      yAxisIndex: 1,
                      label:{
                            normal:{
                                formatter:'{c}%'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: "rgba(252,123,48,110)",
                                barBorderRadius: 0,
                                label: {
                                    show: true,
                                    formatter: function(p) {
                                        return p.value > 0 ? (p.value) : '';
                                    }
                                }
                            }
                        },
                      data:[]
                   }
                 
              ]
    };



var startDateInit = (moment(Date.now()).subtract(14, 'd')).format('YYYY-MM-DD');
var startMothesInit = (moment(Date.now()).subtract(30, 'd')).format('YYYY-MM-DD');
var startWeekInit = (moment(Date.now()).subtract(60, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');
var endYear = (moment(Date.now()).subtract(1, 'd')).format('YYYY');

var dailyStartDay = startDateInit;
var dailyEndDay = endDateInit;

var weeklyStartDay = startWeekInit;
var weeklyEndDay = endDateInit;



var dateObj = Date.now() - 24 * 60 * 60 * 1000;

//日报

function selectedDaily(startDt, endDt) {
    $.ajax({
        type: 'GET',
        url: '/router/rest/method/supplierbuyer/begin/' + startDt + '/end/' + endDt,
        success: function (data, status) {
            if (status == "success") {
                dailyStartDay = startDt;
                dailyEndDay = endDt;

                var respObj = data;
                if (respObj.result == true) {
                    var dtArray = [];
                    var cntArray = [];
                    var cntArrayEnt = [];
                    var cntArrayNor = [];

                    for (var i = 0; i < respObj.data.length; i++) {
                        var date = new Date(respObj.data[i]['login_time']);
                        dtArray.push((moment(date)).format('YYYY年MM月DD日'));
                        cntArray.push({dd:weekday[date.getDay()],name:(moment(date)).format('YYYY年MM月DD日'),value:respObj.data[i]['newuser']});
                        cntArrayEnt.push(respObj.data[i]['olduser']);
                        cntArrayNor.push(respObj.data[i]['newolder']);
                    }
                    option.title.text = '每日供应采购商占比';
                     option.xAxis[0].data = dtArray;
                    option.series[0].data = cntArray;
                    option.series[1].data = cntArrayEnt;
                    option.series[2].data = cntArrayNor;
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


//周报
function selectedWeekly(startDt, endDt) {
    $.get("/router/rest/method/supplierbuyerweekly/begin/" + startDt + "/end/" + endDt, function (data, status) {

        if (status = "success") {
            var respObj = data;
            if (respObj.result == true) {
                weeklyStartDay = startDt;
                weeklyEndDay = endDt;
                var wkArray = [];
                var cntArray = [];
                var cntArrayEnt = [];
                var cntArrayNor = [];

                for (var i = 0; i < respObj.data.length; i++) {
                    var daysofweek = getStartEndDt(respObj.data[i]['login_time'].substring(0,4), respObj.data[i]['login_time'].substring(4,6));

                    if (Date.parse(startDt) > Date.parse(daysofweek[0])) {
                        daysofweek[0] = startDt;
                    }
                    if (Date.parse(endDt) < Date.parse(daysofweek[6])) {
                        daysofweek[6] = endDt;
                    }
                    wkArray.push(respObj.data[i]['login_time'].substring(0,4)+"年第" + respObj.data[i]['login_time'].substring(4,6) + "周");
                    cntArray.push({dd:daysofweek[0] + "至" + daysofweek[6],name:respObj.data[i]['login_time'].substring(0,4)+"年第" + respObj.data[i]['login_time'].substring(4,6) + "周",value:respObj.data[i]['newuser']});
                    cntArrayEnt.push(respObj.data[i]['olduser']);
                    cntArrayNor.push(respObj.data[i]['newolder']);
                }
                option.title.text = '每周供应采购商占比';
                option.xAxis[0].data = wkArray;
                option.series[0].data = cntArray;
                option.series[1].data = cntArrayEnt;
                option.series[2].data = cntArrayNor;

                weeklyChart.setOption(option);

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

//月报
function selectedMonthly(begintimes,endtimes){
    $.get("/router/rest/method/supplierbuyermothly/begintimes/" + begintimes+"/endtimes/"+ endtimes, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var mthArray = [];
                var cntArray = [];
                var cntArrayEnt = [];
                var cntArrayNor = [];

                for (var i = 0; i < respObj.data.length; i++) {
                    var mthComment = respObj.data[i]['login_time'].toString().substr(0, 4) + '年'
                        + respObj.data[i]['login_time'].toString().substr(4) + '月';
                    mthArray.push(mthComment);
                    cntArray.push({dd:'', name:mthComment,value:respObj.data[i]['newuser']});
                    cntArrayEnt.push(respObj.data[i]['olduser']);
                    cntArrayNor.push(respObj.data[i]['newolder']);
                }
                option.title.text = '月度供应采购商占比';
                option.xAxis[0].data = mthArray;
                option.series[0].barMaxWidth = 75;
                option.series[0].data = cntArray;
                option.series[1].data = cntArrayEnt;
                option.series[1].barMaxWidth = 75;
                option.series[2].data = cntArrayNor;
                monthlyChart.setOption(option);

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

//订单季报
function selectedQuarterly(year) {
    $.get("/router/rest/method/supplierbuyerjidu/year/" + year, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var qrtArray = [];
                var cntArray = [];
                var cntArrayEnt = [];
                var cntArrayNor = [];

                for (var i = 0; i < respObj.data.length; i++) {
                    var xComment = respObj.data[i]['login_time'].toString().substr(0, 4) + '年第'
                        + respObj.data[i]['login_time'].toString().substr(4, 1) + '季度';
                    qrtArray.push(xComment);
                    cntArray.push({dd:'',name:xComment,value:respObj.data[i]['newuser']});
                    cntArrayEnt.push(respObj.data[i]['olduser']);
                    cntArrayNor.push(respObj.data[i]['newolder']);
                }
                option.title.text = '季度供应采购商占比';
                option.xAxis[0].data = qrtArray;
                option.series[0].barMaxWidth = 75;
                option.series[1].barMaxWidth = 75;
                option.series[0].data = cntArray;
                option.series[1].data = cntArrayEnt;
                option.series[2].data = cntArrayNor;
               
                quarterlyChart.setOption(option);
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


//订单年报
function selectedYearly(year) {
    $.get("/router/rest/method/supplierbuyeryearly/year/" + year, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var yearArray = [];
                var cntArray = [];
                var cntArrayEnt = [];
                var cntArrayNor = [];

                for (var i = 0; i < respObj.data.length; i++) {
                    yearArray.push(respObj.data[i]['login_time'] + '年');
                    cntArray.push({dd:'',name:respObj.data[i]['login_time'] + '年',value:respObj.data[i]['newuser']});
                    cntArrayEnt.push(respObj.data[i]['olduser']);
                    cntArrayNor.push(respObj.data[i]['newolder']);
                }
                option.title.text = '年度供应采购商占比';
                option.xAxis[0].data = yearArray;
                option.series[0].barMaxWidth = 85;
                option.series[1].barMaxWidth = 85;
                option.series[0].data = cntArray;
                option.series[1].data = cntArrayEnt;
                option.series[2].data = cntArrayNor;
                yearlyChart.setOption(option);

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

selectedDaily(startDateInit, endDateInit);
selectedWeekly(startWeekInit, endDateInit);
selectedMonthly(begintimes,endtimes);
selectedQuarterly(endYear);
selectedYearly(endYear);

$(document).ready(function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch ($(active).attr('href')) {
            case '#daily':
                $("#toobar").show(); $(".toobars").hide();
                echartsBox.removeClass("timepicker-padding");
                $('#datepicker').data('daterangepicker').setStartDate(moment(dailyStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(dailyEndDay).format('MM/DD/YYYY'));
                break;
            case '#weekly':
                $("#toobar").show(); $(".toobars").hide();
                echartsBox.removeClass("timepicker-padding");
                $('#datepicker').data('daterangepicker').setStartDate(moment(weeklyStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(weeklyEndDay).format('MM/DD/YYYY'));
                break;
            case '#monthly':
                $("#toobar").hide(); $(".toobars").show();
                echartsBox.removeClass("timepicker-padding");
                break;
            case '#quarterly':
                $("#toobar").hide(); $(".toobars").hide();
                echartsBox.addClass("timepicker-padding");
                break;
            case '#yearly':
                $("#toobar").hide(); $(".toobars").hide();
                echartsBox.addClass("timepicker-padding");
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
            "startDate": (moment(Date.now()).subtract(14, 'd')).format('MM/DD/YYYY'),
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
                case '#daily':
                    selectedDaily(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
                case '#weekly':
                    selectedWeekly(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
            }
        }
    );

});
