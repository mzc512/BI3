/*时间序列维度*/
var echartsBox = $('.echartsBox');

$('#toobar').show();
//tabs
echartsBox.append('<ul id="group" class="nav nav-tabs"></ul>');
$("#group").append('<li class="active"><a href="#daily" data-toggle="tab">登录会员日报</a></li>');
$("#group").append('<li><a href="#weekly" data-toggle="tab">登录会员周报</a></li>');
$("#group").append('<li><a href="#monthly" data-toggle="tab">登录会员月报</a></li>');
$("#group").append('<li><a href="#quarterly" data-toggle="tab">登录会员季报</a></li>');
$("#group").append('<li><a href="#yearly" data-toggle="tab">登录会员年报</a></li>');


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
var begintimes=dates2;
var endtimes=dates1;

var option = {
    title: {
        text: '每周登录会员数量',
        //subtext: '',
        x: 'center',
        align: 'right'
    },
    grid: {
        left: '2%',
        right: '5%',
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
        data: ['登录会员数量','企业会员数量'],
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
            name: '会员数量',
            minInterval: 5,
            type: 'value'
        }
    ],
    series: [
        {
            name: '登录会员数量',
            type: 'line',
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        },
        {
            name: '企业会员数量',
            type: 'line',
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        }
    ]
};

var startDateInit = (moment(Date.now()).subtract(30, 'd')).format('YYYY-MM-DD');
var startWeekInit = (moment(Date.now()).subtract(60, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');
var endYear = (moment(Date.now()).subtract(1, 'd')).format('YYYY');

var dailyStartDay = startDateInit;
var dailyEndDay = endDateInit;

var weeklyStartDay = startWeekInit;
var weeklyEndDay = endDateInit;

var dSumShow = 'Y';
var wSumShow = 'Y';


var dateObj = Date.now() - 24 * 60 * 60 * 1000;

//日报
var weekday = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");

function selectedDaily(startDt, endDt) {
    $.ajax({
        type: 'GET',
        url: '/router/rest/method/LoginUserDaily/begin/' + startDt + '/end/' + endDt,
        success: function (data, status) {
            if (status == "success") {
                dailyStartDay = startDt;
                dailyEndDay = endDt;

                var respObj = data;
                if (respObj.result == true) {
                    var dtArray = [];
                    var cntArray = [];
                    var cntArrayEnt = [];

                    for (var i = 0; i < respObj.data.length; i++) {
                        var date = new Date(respObj.data[i][0]);
                        dtArray.push(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" +
                        "\n" + weekday[date.getDay()]);
                        cntArray.push(respObj.data[i][1]);
                        cntArrayEnt.push(respObj.data[i][2]);
                    }

                    option.title.text = '每日登录会员数量';
                    option.legend.x = 'left';
                    option.legend.y = 'top';

                    option.xAxis[0].data = dtArray;

                    option.series[0].data = cntArray;
                    option.series[0].type = 'line';
                    option.series[1].data = cntArrayEnt;
                    option.series[1].type = 'line';

                    dailyChart.setOption(option);

                } else if (respObj.data && respObj.data.redirect) {

                    //console.log("redirect: %s", respObj.data.redirect);
                    if (window == top) {
                        location.href = respObj.data.redirect;
                    } else {
                        top.location.href = respObj.data.redirect;
                    }
                }
            }
        }
    });
}


//周报
function selectedWeekly(startDt, endDt) {
    $.get("/router/rest/method/LoginUserWeekly/begin/" + startDt + "/end/" + endDt, function (data, status) {

        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                weeklyStartDay = startDt;
                weeklyEndDay = endDt;

                var wkArray = [];
                var cntArray = [];
                var cntArrayEnt = [];

               // var lastDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);

                for (var i = 0; i < respObj.data.length; i++) {
                    var daysofweek = getStartEndDt( respObj.data[i][0].substring(0,4), respObj.data[i][0].substring(4,6));

                    if (Date.parse(startDt) > Date.parse(daysofweek[0])) {
                        daysofweek[0] = startDt;
                    }
                    if (Date.parse(endDt) < Date.parse(daysofweek[6])) {
                        daysofweek[6] = endDt;
                    }
                    wkArray.push( respObj.data[i][0].substring(0,4)+"年第" + respObj.data[i][0].substring(4,6) + "周" + "\n(" + daysofweek[0] + "至" + daysofweek[6] + ")");
                    cntArray.push(respObj.data[i][1]);
                    cntArrayEnt.push(respObj.data[i][2]);
                }

                option.title.text = '每周登录会员数量';
                option.dataZoom = [];
                option.legend.x = 'left';
                option.legend.y = 'top';

                option.xAxis[0].data = wkArray;

                option.series[0].data = cntArray;
                option.series[0].type = 'line';
                option.series[1].data = cntArrayEnt;
                option.series[1].type = 'line';

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
function selectedMonthly(begintimes,endtimes) {
    $.get("/router/rest/method/LoginUserMonthly/begintimes/" + begintimes+"/endtimes/"+ endtimes, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var mthArray = [];
                var cntArray = [];
                var cntArrayEnt = [];

                for (var i = 0; i < respObj.data.length; i++) {
                    var mthComment = respObj.data[i][0].toString().substr(0, 4) + '年'
                        + respObj.data[i][0].toString().substr(4) + '月';
                    mthArray.push(mthComment);
                    cntArray.push(respObj.data[i][1]);
                    cntArrayEnt.push(respObj.data[i][2]);
                }

                option.title.text = '每月登录会员数量';
                option.dataZoom = [];
                option.legend.x = 'left';
                option.legend.y = 'top';

                option.xAxis[0].data = mthArray;

                option.series[0].data = cntArray;
                option.series[0].type = 'line';
                option.series[1].data = cntArrayEnt;
                option.series[1].type = 'line';

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
    $.get("/router/rest/method/LoginUserQuarterly/year/" + year, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var qrtArray = [];
                var cntArray = [];
                var cntArrayEnt = [];

                for (var i = 0; i < respObj.data.length; i++) {
                    var xComment = respObj.data[i][0].toString().substr(0, 4) + '年第'
                        + respObj.data[i][0].toString().substr(4, 1) + '季度';
                    qrtArray.push(xComment);
                    cntArray.push(respObj.data[i][1]);
                    cntArrayEnt.push(respObj.data[i][2]);
                }

                option.title.text = '季度登录会员数量';
                option.dataZoom = [];
                option.legend.x = 'left';
                option.legend.y = 'top';

                option.xAxis[0].data = qrtArray;

                option.series[0].data = cntArray;
                option.series[0].type = 'bar';
                option.series[1].data = cntArrayEnt;
                option.series[1].type = 'bar';

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
    $.get("/router/rest/method/LoginUserYearly/year/" + year, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var yearArray = [];
                var cntArray = [];
                var cntArrayEnt = [];

                for (var i = 0; i < respObj.data.length; i++) {
                    yearArray.push(respObj.data[i][0] + '年');
                    cntArray.push(respObj.data[i][1]);
                    cntArrayEnt.push(respObj.data[i][2]);
                }

                option.title.text = '每年登录会员数量';
                option.dataZoom = [];
                option.legend.x = 'left';
                option.legend.y = 'top';

                option.xAxis[0].data = yearArray;

                option.series[0].data = cntArray;
                option.series[0].type = 'bar';
                option.series[1].data = cntArrayEnt;
                option.series[1].type = 'bar';

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
            //'startDate': '01/01/' + moment(Date.now()).format('YYYY'),
            'startDate': (moment(Date.now()).subtract(30, 'd')).format('MM/DD/YYYY'),
            'endDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
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
                    //if (moment(start) < moment(startDateInit)) {
                    //    $('#datepicker').data('daterangepicker').setStartDate('01/01/' + moment(Date.now()).format('YYYY'));
                    //    $('#datepicker').data('daterangepicker').setEndDate((moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'));
                    //    start = moment(startDateInit);
                    //    end = moment(endDateInit);
                    //}

                    selectedWeekly(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
            }
        }
    );

});
