/*时间序列维度*/
var echartsBox = $('.echartsBox');
$('#toobar').show();

//tabs
echartsBox.append('<ul id="group"  class="nav nav-tabs"></ul>');

$("#group").append('<li class="active"><a href="#daily" data-toggle="tab">流量日报</a></li>');
$("#group").append('<li><a href="#weekly" data-toggle="tab">流量周报</a></li>');
$("#group").append('<li><a href="#monthly" data-toggle="tab">流量月报</a></li>');


var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="daily" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="weekly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="monthly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('</div>');

var tabs = $('<div id="tabs" class="tab-content" ></div>');
echartsBox.append(tabs);
tabs.append(container.join(""));

var activeTab = '#daily';

var dailyChart = echarts.init(document.getElementById('daily'));
var weeklyChart = echarts.init(document.getElementById('weekly'));
var monthlyChart = echarts.init(document.getElementById('monthly'));

var option = {
    title: {
        text: '每日流量',
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
        data: ['PV','UV','IP','会话'],
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
            name: '流量',
            minInterval: 5,
            type: 'value'
        }
    ],
    series: [
        {
            name: 'PV',
            type: 'line',
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        },
        {
            name: 'UV',
            type: 'line',
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        },
        {
            name: 'IP',
            type: 'line',
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        },
        {
            name: '会话',
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
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');
var endYear = (moment(Date.now()).subtract(1, 'd')).format('YYYY');

var dailyStartDay = startDateInit;
var dailyEndDay = endDateInit;

var weeklyStartDay = startDateInit;
var weeklyEndDay = endDateInit;

function maxArrayCell(array) {
    var val = 0;
    for (var x in array) {
        val = Math.max(val, array[x]);
    }
    return val;
}


var dateObj = Date.now() - 24 * 60 * 60 * 1000;

//日报
var weekday = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");

function selectedDaily(startDt, endDt) {
    $.ajax({
        type: 'GET',
        url: '/router/rest/method/TrafficDaily/begin/' + startDt + '/end/' + endDt,
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
                    var cntArraySes = [];

                    for (var i = 0; i < respObj.data.length; i++) {
                        var date = new Date(respObj.data[i][0]);
                        dtArray.push(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" +
                        "\n" + weekday[date.getDay()]);
                        cntArray.push(respObj.data[i][1]);
                        cntArrayEnt.push(respObj.data[i][2]);
                        cntArrayNor.push(respObj.data[i][3]);
                        cntArraySes.push(respObj.data[i][4]);
                    }

                    option.title.text = '流量日报';
                    option.legend.x = 'left';
                    option.legend.y = 'top';

                    option.xAxis[0].data = dtArray;

                    option.series[0].data = cntArray;
                    option.series[0].type = 'line';
                    option.series[1].data = cntArrayEnt;
                    option.series[1].type = 'line';
                    option.series[2].data = cntArrayNor;
                    option.series[2].type = 'line';
                    option.series[3].data = cntArraySes;
                    option.series[3].type = 'line';

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
        },
        error:function(){
            console.info("AJAX ERROR");
        }
    });
}


//周报
function selectedWeekly(startDt, endDt) {
    $.get("/router/rest/method/TrafficWeekly/begin/" + startDt + "/end/" + endDt, function (data, status) {

        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                weeklyStartDay = startDt;
                weeklyEndDay = endDt;

                var wkArray = [];
                var cntArray = [];
                var cntArrayEnt = [];
                var cntArrayNor = [];
                var cntArraySes = [];
                for (var i = 0; i < respObj.data.length; i++) {
                    var daysofweek = getStartEndDt(respObj.data[i][5], respObj.data[i][6]);
                    if (Date.parse(startDt) > Date.parse(daysofweek[0])) {
                        daysofweek[0] = startDt;
                    }
                    if (Date.parse(endDt) < Date.parse(daysofweek[6])) {
                        daysofweek[6] = endDt;
                    }
                    wkArray.push(respObj.data[i][5]+"年第" + respObj.data[i][6] + "周" + "\n(" + daysofweek[0] + "至" + daysofweek[6] + ")");
                    cntArray.push(respObj.data[i][1]);
                    cntArrayEnt.push(respObj.data[i][2]);
                    cntArrayNor.push(respObj.data[i][3]);
                    cntArraySes.push(respObj.data[i][4]);
                }

                option.title.text = '流量周报';
                option.dataZoom = [];
                option.legend.x = 'left';
                option.legend.y = 'top';

                option.xAxis[0].data = wkArray;

                option.series[0].data = cntArray;
                option.series[0].type = 'line';
                option.series[1].data = cntArrayEnt;
                option.series[1].type = 'line';
                option.series[2].data = cntArrayNor;
                option.series[2].type = 'line';
                option.series[3].data = cntArraySes;
                option.series[3].type = 'line';

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
function selectedMonthly(year) {
    //console.log("year: %s.", year);
    $.get("/router/rest/method/TrafficMonthly/year/" + year, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var mthArray = [];
                var cntArray = [];
                var cntArrayEnt = [];
                var cntArrayNor = [];
                var cntArraySes = [];

                for (var i = 0; i < respObj.data.length; i++) {
                    var mthComment = respObj.data[i][0].toString().substr(0, 4) + '年'
                        + respObj.data[i][0].toString().substr(4) + '月';
                    mthArray.push(mthComment);
                    //mthArray.push(respObj.data[i][0] + "月");
                    cntArray.push(respObj.data[i][1]);
                    cntArrayEnt.push(respObj.data[i][2]);
                    cntArrayNor.push(respObj.data[i][3]);
                    cntArraySes.push(respObj.data[i][4]);
                }

                option.title.text = '流量月报';
                option.dataZoom = [];
                option.legend.x = 'left';
                option.legend.y = 'top';

                option.xAxis[0].data = mthArray;

                option.series[0].data = cntArray;
                option.series[0].type = 'line';
                option.series[1].data = cntArrayEnt;
                option.series[1].type = 'line';
                option.series[2].data = cntArrayNor;
                option.series[2].type = 'line';
                option.series[3].data = cntArraySes;
                option.series[3].type = 'line';

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

selectedDaily(startDateInit, endDateInit);
selectedWeekly((moment(Date.now()).subtract(60, 'd')).format('YYYY-MM-DD'), endDateInit);
selectedMonthly(endYear);

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
            case '#weekly':
                $("#toobar").show();
                echartsBox.removeClass("timepicker-padding");
                $('#datepicker').data('daterangepicker').setStartDate(moment(weeklyStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(weeklyEndDay).format('MM/DD/YYYY'));
                break;
            case '#monthly':
                $("#toobar").hide();
                echartsBox.addClass("timepicker-padding");
                break;
            case '#quarterly':
                $("#toobar").hide();
                echartsBox.addClass("timepicker-padding");
                break;
            case '#yearly':
                $("#toobar").hide();
                echartsBox.addClass("timepicker-padding");
                break;
        }
    });

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
            switch (activeTab) {
                case '#daily':
                    selectedDaily(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
                case '#weekly':
                    if (moment(start) < yearBeg) {
                        $('#datepicker').data('daterangepicker').setStartDate((moment(Date.now()).subtract(30, 'd')).format('MM/DD/YYYY'));
                        $('#datepicker').data('daterangepicker').setEndDate((moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'));
                        start = moment(startDateInit);
                        end = moment(endDateInit);
                    }
                    selectedWeekly(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
            }
        }
    );

});
