var echartsBox = $('.echartsBox');

$('#toobar').show();
//tabs
echartsBox.append('<ul id="group" class="nav nav-tabs"></ul>');

$("#group").append('<li class="active"><a href="#userList" data-toggle="tab">活跃会员列表</a></li>');
$("#group").append('<li><a href="#daily" data-toggle="tab">活跃会员日报</a></li>');
$("#group").append('<li><a href="#weekly" data-toggle="tab">活跃会员周报</a></li>');
$("#group").append('<li><a href="#monthly" data-toggle="tab">活跃会员月报</a></li>');
$("#group").append('<li><a href="#quarterly" data-toggle="tab">活跃会员季报</a></li>');
$("#group").append('<li><a href="#yearly" data-toggle="tab">活跃会员年报</a></li>');


var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="userList" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="daily" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="weekly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="monthly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="quarterly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="yearly" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;">');
container.push('</div>');

var tabs = $('<div id="tabs" class="tab-content" ></div>');
echartsBox.append(tabs);
tabs.append(container.join(""));

var activeTab = '#userList';

var dailyChart = echarts.init(document.getElementById('daily'));
var weeklyChart = echarts.init(document.getElementById('weekly'));
var monthlyChart = echarts.init(document.getElementById('monthly'));
var quarterlyChart = echarts.init(document.getElementById('quarterly'));
var yearlyChart = echarts.init(document.getElementById('yearly'));
var begintimes=dates2;
var endtimes=dates1;

var option = {
    title: {
        text: '每周活跃会员数量',
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
        data: ['活跃会员数量'],
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
            name: '活跃会员数量',
            type: 'line',
            hoverAnimation: false,
            lineStyle: {
                normal: {}
            },
            data: []
        }
    ]
};

var startDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY') + '-01-01';
var startWeekInit = (moment(Date.now()).subtract(60, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');
var endYear = (moment(Date.now()).subtract(1, 'd')).format('YYYY');
var oprcntInit = ">1";

var userListStartDay = endDateInit;
var userListEndDay = endDateInit;
var userListOprCnt = oprcntInit;
var dailyStartDay = startDateInit;
var dailyEndDay = endDateInit;
var dailyOprCnt = oprcntInit;
var weeklyStartDay = startDateInit;
var weeklyEndDay = endDateInit;
var weeklyOprCnt = oprcntInit;
var monthlyOprCnt = oprcntInit;
var quarterlyOprCnt = oprcntInit;
var yearlyOprCnt = oprcntInit;


//判断正整数,如果不是整数，返回数字1
function returnInt(input)
{
    var re = /^[0-9]+[0-9]*]*$/;
    if (!re.test(input)) {
        return 1;
    }else {
        return input;
    }
}

var dateObj = Date.now() - 24 * 60 * 60 * 1000;

//活跃会员列表
function selectedUserList(startDt, endDt, oprcnt) {
    userListStartDay = startDt;
    userListEndDay = endDt;
    userListOprCnt = oprcnt;

    $('#userList').empty();
    $('#userList').append(
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
        '<th data-field="UserId" data-sortable="true">会员ID</th>' +
        '<th data-field="UserName" data-sortable="true">会员名称</th>' +
        '<th data-field="Type" data-sortable="true">企业/普通会员</th>' +
        '<th data-field="Phone" data-sortable="true">手机号码</th>' +
        '<th data-field="IP" data-sortable="true">登录IP</th>' +
        '</tr>' +
        '</thead>'
    );

    $('#table').bootstrapTable({
        url: '/router/rest/method/ActiveUserList?begin=' + startDt + '&end=' + endDt + '&opr=' + oprcnt
    });
}

//日报
var weekday = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");

function selectedDaily(startDt, endDt,oprcnt) {
    $.ajax({
        type: 'GET',
        url: '/router/rest/method/ActiveUserDaily/begin/' + startDt + '/end/' + endDt + '/opr/' + oprcnt,
        success: function (data, status) {
            if (status == "success") {
                dailyStartDay = startDt;
                dailyEndDay = endDt;
                dailyOprCnt = oprcnt;

                var respObj = data;
                if (respObj.result == true) {
                    var dtArray = [];
                    var cntArray = [];

                    for (var i = 0; i < respObj.data.length; i++) {
                        var date = new Date(respObj.data[i][0]);
                        dtArray.push(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" +
                        "\n" + weekday[date.getDay()]);
                        cntArray.push(respObj.data[i][1]);
                    }

                    option.title.text = '每日活跃会员数量';
                    option.legend.x = 'left';
                    option.legend.y = 'top';

                    option.xAxis[0].data = dtArray;

                    option.series[0].data = cntArray;
                    option.series[0].type = 'line';

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
function selectedWeekly(startDt, endDt, oprcnt) {
    $.get('/router/rest/method/ActiveUserWeekly/begin/' + startDt + '/end/' + endDt + '/opr/' + oprcnt,
    function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                weeklyStartDay = startDt;
                weeklyEndDay = endDt;
                weeklyOprCnt = oprcnt;

                var wkArray = [];
                var cntArray = [];
                for (var i = 0; i < respObj.data.length; i++) {
                    var daysofweek = getStartEndDt( respObj.data[i][0].substring(0,4), respObj.data[i][0].substring(4,6));

                    if (Date.parse(startDt) > Date.parse(daysofweek[0])) {
                        daysofweek[0] = startDt;
                    }
                    if (Date.parse(endDt) < Date.parse(daysofweek[6])) {
                        daysofweek[6] = endDt;
                    }
                    wkArray.push( respObj.data[i][0].substring(0,4) +"年第" + respObj.data[i][0].substring(4,6) + "周" + "\n(" + daysofweek[0] + "至" + daysofweek[6] + ")");
                    cntArray.push(respObj.data[i][1]);
                }

                option.title.text = '每周活跃会员数量';
                option.dataZoom = [];
                option.legend.x = 'left';
                option.legend.y = 'top';

                option.xAxis[0].data = wkArray;

                option.series[0].data = cntArray;
                option.series[0].type = 'line';

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
function selectedMonthly(begintimes,endtimes,oprcnt) {
    //console.log("year: %s.", year);
    $.get("/router/rest/method/ActiveUserMonthly/begintimes/" + begintimes+"/endtimes/"+ endtimes + '/opr/' + oprcnt,
    function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var mthArray = [];
                var cntArray = [];
                monthlyOprCnt = oprcnt;

                    for (var i = 0; i < respObj.data.length; i++) {
                        var mthComment = respObj.data[i][0].toString().substr(0, 4) + '年'
                            + respObj.data[i][0].toString().substr(4) + '月';
                        mthArray.push(mthComment);
                        cntArray.push(respObj.data[i][1]);
                    }


                option.title.text = '每月活跃会员数量';
                option.dataZoom = [];
                option.legend.x = 'left';
                option.legend.y = 'top';

                option.xAxis[0].data = mthArray;

                option.series[0].data = cntArray;
                option.series[0].type = 'line';

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
function selectedQuarterly(year,oprcnt) {
    $.get("/router/rest/method/ActiveUserQuarterly/year/" + year + '/opr/' + oprcnt, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                quarterlyOprCnt = oprcnt;
                var qrtArray = [];
                var cntArray = [];

                for (var i = 0; i < respObj.data.length; i++) {
                    var xComment = respObj.data[i][0].toString().substr(0, 4) + '年第'
                        + respObj.data[i][0].toString().substr(4, 1) + '季度';
                    qrtArray.push(xComment);
                    cntArray.push(respObj.data[i][1]);
                }

                option.title.text = '季度活跃会员数量';
                option.dataZoom = [];
                option.legend.x = 'left';
                option.legend.y = 'top';

                option.xAxis[0].data = qrtArray;

                option.series[0].data = cntArray;
                option.series[0].type = 'bar';

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
function selectedYearly(year,oprcnt) {
    $.get("/router/rest/method/ActiveUserYearly/year/" + year + '/opr/' + oprcnt, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                yearlyOprCnt = oprcnt;
                var yearArray = [];
                var cntArray = [];

                for (var i = 0; i < respObj.data.length; i++) {
                    yearArray.push(respObj.data[i][0] + '年');
                    cntArray.push(respObj.data[i][1]);
                }

                option.title.text = '每年活跃会员数量';
                option.dataZoom = [];
                option.legend.x = 'left';
                option.legend.y = 'top';

                option.xAxis[0].data = yearArray;

                option.series[0].data = cntArray;
                option.series[0].type = 'bar';

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

selectedUserList(endDateInit,endDateInit,oprcntInit);

$(document).ready(function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch ($(active).attr('href')) {
            case '#userList':
                $(".toobars").hide();$("#toobar").show();
                $('#datepicker').data('daterangepicker').setStartDate(moment(userListStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(userListEndDay).format('MM/DD/YYYY'));
                $("#cmpoperator").val(userListOprCnt.substr(0,1));
                $("#logincnt").val(userListOprCnt.substr(1,1));
                break;
            case '#daily':
                $(".toobars").hide();$("#toobar").show();
                $('#datepicker').data('daterangepicker').setStartDate(moment(dailyStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(dailyEndDay).format('MM/DD/YYYY'));
                $("#cmpoperator").val(dailyOprCnt.substr(0,1));
                $("#logincnt").val(dailyOprCnt.substr(1,1));
                selectedDaily(dailyStartDay,dailyEndDay,dailyOprCnt);
                break;
            case '#weekly':
                $(".toobars").hide(); $("#toobar").show();
                $('#datepicker').data('daterangepicker').setStartDate(moment(weeklyStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(weeklyEndDay).format('MM/DD/YYYY'));
                $("#cmpoperator").val(weeklyOprCnt.substr(0,1));
                $("#logincnt").val(weeklyOprCnt.substr(1,1));
                selectedWeekly(weeklyStartDay,weeklyEndDay,weeklyOprCnt);
                break;
            case '#monthly':
                $("#toobar").hide();$(".toobars").show();;$(".login-num").show();
                $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInit).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInit).format('MM/DD/YYYY'));
                $("#cmpoperator").val(monthlyOprCnt.substr(0,1));
                $("#logincnt").val(monthlyOprCnt.substr(1,1));
                selectedMonthly(begintimes,endtimes,monthlyOprCnt);
                break;
            case '#quarterly':
                $(".toobars").hide();$("#toobar").show();
                $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInit).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInit).format('MM/DD/YYYY'));
                $("#cmpoperator").val(quarterlyOprCnt.substr(0,1));
                $("#logincnt").val(quarterlyOprCnt.substr(1,1));
                selectedQuarterly(endYear,quarterlyOprCnt);
                break;
            case '#yearly':
                $(".toobars").hide();$("#toobar").show();
                $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInit).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInit).format('MM/DD/YYYY'));
                $("#cmpoperator").val(yearlyOprCnt.substr(0,1));
                $("#logincnt").val(yearlyOprCnt.substr(1,1));
                selectedYearly(endYear,yearlyOprCnt);
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
        startDate:'2016-01',
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
        var oprtins= $("#cmpoperator").val()+$("#logincnts").val();
        if(dataes&&typeof(dataes)!="undefined"&&dataes!=0){
            selectedMonthly(dates2,$('#datas').val(),oprtins);
        }
    });




    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'startDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'endDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()]
            },
            'opens': 'left'
        }
    );

    $('#datepicker').on('apply.daterangepicker',function(ev, picker) {
        var start = picker.startDate.format('YYYY-MM-DD');
        var end = picker.endDate.format('YYYY-MM-DD');
        var operator = $("#cmpoperator option:selected").val();
        var getCnt = $("#logincnt").val();

        var cnt = returnInt(getCnt);
        $("#logincnt").val(cnt);
        var operator_cnt = operator + cnt;
        switch (activeTab) {
            case '#userList':
                selectedUserList(start,end,operator_cnt);
                break;
            case '#daily':
                selectedDaily(start,end,operator_cnt);
                break;
            case '#weekly':
                //if (moment(start) < moment(startDateInit)) {
                //    $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInit).format('MM/DD/YYYY'));
                //    $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInit).format('MM/DD/YYYY'));
                //    start = moment(startDateInit);
                //    end = moment(endDateInit);
                //}
                selectedWeekly(start, end, operator_cnt);
                break;
            case '#monthly':
                $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInit).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInit).format('MM/DD/YYYY'));
                var year = moment(endDateInit).format('YYYY');
                selectedMonthly(year,operator_cnt);
                break;
            case '#quarterly':
                $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInit).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInit).format('MM/DD/YYYY'));
                var year = moment(endDateInit).format('YYYY');
                selectedQuarterly(year,operator_cnt);
                break;
            case '#yearly':
                $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInit).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInit).format('MM/DD/YYYY'));
                var year = moment(endDateInit).format('YYYY');
                selectedYearly(year,operator_cnt);
                break;
        }
    });
});

