/*分公司维度*/
var echartsBox = $('.echartsBox');

echartsBox.css({"height": "auto"});
$('#toobar').show();


//tabs
echartsBox.append('<ul id="group" class="nav nav-tabs"></ul>');

$("#group").append('<li><a href="#daily" data-toggle="tab">订单日报</a></li>');
$("#group").append('<li class="active"><a href="#weekly" data-toggle="tab">订单周报</a></li>');
$("#group").append('<li><a href="#monthly" data-toggle="tab">订单月报</a></li>');

$("#group").append('<li><a href="#quarterly" data-toggle="tab">订单季报</a></li>');
$("#group").append('<li><a href="#yearly" data-toggle="tab">订单年报</a></li>');


// 固定顶部导航 nav
$(window).scroll(function () {
    var topscr = $(this).scrollTop();
    (topscr >= 100) ? $("#group").css({
        "position": "fixed",
        "top": 0
    }) : $("#group").css({"position": "static"});
});


var activeTab = '#weekly';
var w = getChartWidth(true);

echartsBox.append('<div id="tabs" class="tab-content" style="height:auto;width:'+w+'px;" ></div>');

//daily
$('#tabs').append('<div id="daily" class="tab-pane" style="width:'+w+'px;" ></div>');


//dailyAmtGmv
$('#daily').append('<div id="dailyAmtGmv" class="chart" style="width:'+w+'px;" ></div>');
var dailyAmtGmvChart = echarts.init(document.getElementById('dailyAmtGmv'));
//dailyAmt
$('#daily').append('<div id="dailyAmt" class="chart" style="width:'+w+'px;" ></div>');
var dailyAmtChart = echarts.init(document.getElementById('dailyAmt'));

//dailyCntGmv
$('#daily').append('<div id="dailyCntGmv" class="chart" style="width:'+w+'px;" ></div>');
var dailyCntGmvChart = echarts.init(document.getElementById('dailyCntGmv'));
//dailyCnt
$('#daily').append('<div id="dailyCnt" class="chart" style="width:'+w+'px;" ></div>');
var dailyCntChart = echarts.init(document.getElementById('dailyCnt'));


//weekly
$('#tabs').append('<div id="weekly" class="tab-pane active" style="width:'+w+'px;" ></div>');

//weeklyGmvAmt
$('#weekly').append('<div id="weeklyGmvAmt" class="chart" style="width:'+w+'px;" ></div>');
var weeklyAmtGmvChart = echarts.init(document.getElementById('weeklyGmvAmt'));
//weeklyAmt
$('#weekly').append('<div id="weeklyAmt" class="chart" style="width:'+w+'px;" ></div>');
var weeklyAmtChart = echarts.init(document.getElementById('weeklyAmt'));
//weeklyGmvCnt
$('#weekly').append('<div id="weeklyGmvCnt" class="chart" style="width:'+w+'px;" ></div>');
var weeklyCntGmvChart = echarts.init(document.getElementById('weeklyGmvCnt'));
//weeklyCnt
$('#weekly').append('<div id="weeklyCnt" class="chart" style="width:'+w+'px;" ></div>');
var weeklyCntChart = echarts.init(document.getElementById('weeklyCnt'));


//monthly
$('#tabs').append('<div id="monthly" class="tab-pane" style="width:'+w+'px;" ></div>');

//monthlyGmvAmt
$('#monthly').append('<div id="monthlyGmvAmt" class="chart" style="width:'+w+'px;" ></div>');
var monthlyAmtGmvChart = echarts.init(document.getElementById('monthlyGmvAmt'));
//monthlyAmt
$('#monthly').append('<div id="monthlyAmt" class="chart" style="width:'+w+'px;" ></div>');
var monthlyAmtChart = echarts.init(document.getElementById('monthlyAmt'));
//monthlyGmvCnt
$('#monthly').append('<div id="monthlyGmvCnt" class="chart" style="width:'+w+'px;" ></div>');
var monthlyCntGmvChart = echarts.init(document.getElementById('monthlyGmvCnt'));
//monthlyCnt
$('#monthly').append('<div id="monthlyCnt" class="chart" style="width:'+w+'px;" ></div>');
var monthlyCntChart = echarts.init(document.getElementById('monthlyCnt'));



//quarterly
$('#tabs').append('<div id="quarterly" class="tab-pane" style="width:'+w+'px;" ></div>');

//quarterlyGmvAmt
$('#quarterly').append('<div id="quarterlyGmvAmt" class="chart" style="width:'+w+'px;" ></div>');
var quarterlyAmtGmvChart = echarts.init(document.getElementById('quarterlyGmvAmt'));
//quarterlyAmt
$('#quarterly').append('<div id="quarterlyAmt" class="chart" style="width:'+w+'px;" ></div>');
var quarterlyAmtChart = echarts.init(document.getElementById('quarterlyAmt'));
//quarterlyGmvCnt
$('#quarterly').append('<div id="quarterlyGmvCnt" class="chart" style="width:'+w+'px;" ></div>');
var quarterlyCntGmvChart = echarts.init(document.getElementById('quarterlyGmvCnt'));
//quarterlyCnt
$('#quarterly').append('<div id="quarterlyCnt" class="chart" style="width:'+w+'px;" ></div>');
var quarterlyCntChart = echarts.init(document.getElementById('quarterlyCnt'));

//yearly
$('#tabs').append('<div id="yearly" class="tab-pane" style="width:'+w+'px;" ></div>');

//quarterlyGmvAmt
$('#yearly').append('<div id="yearlyGmvAmt" class="chart" style="width:'+w+'px;" ></div>');
var yearlyAmtGmvChart = echarts.init(document.getElementById('yearlyGmvAmt'));

$('#yearly').append('<div id="yearlyAmt" class="chart" style="width:'+w+'px;" ></div>');
var yearlyAmtChart = echarts.init(document.getElementById('yearlyAmt'));

$('#yearly').append('<div id="yearlyGmvCnt" class="chart" style="width:'+w+'px;" ></div>');
var yearlyCntGmvChart = echarts.init(document.getElementById('yearlyGmvCnt'));

$('#yearly').append('<div id="yearlyCnt" class="chart" style="width:'+w+'px;" ></div>');
var yearlyCntChart = echarts.init(document.getElementById('yearlyCnt'));



var option = {
    title: {
        text: '每周订单数量和总金额',
        x: 'center',
        align: 'right'
    },
    grid: {
        left: '2%',
        right: '3%',
        bottom: '13%',
        containLabel: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    legend: {
        data: [],
        x: 'center',
        top: '30'
    },
    toolbox: {
        show: true,
        feature: {
            mark: {
                show: true
            },
            magicType: {
                show: true,
                type: ['tiled', 'line', 'stack', 'bar']
            },
            dataView: {
                show: true,
                readOnly: false
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
        }
    ],
    series: [
        {
            name: '金额',
            type: 'bar',
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
var begintimes=dates2;
var endtiems=dates1;

var weeklyStartDay = startWeekInit;
var weeklyEndDay = endDateInit;


//日报
var weekday = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");

function selectedDateDaily(startDt, endDt) {
    $.get("/router/rest/method/BranchDaily/begin/" + startDt + "/end/" + endDt, function (data, status) {

        if (status == "success") {
            var respObj = data;
            if (respObj.result == "success") {
                dailyStartDay = startDt;
                dailyEndDay = endDt;

                var dailyArray = [];
                var amtGmvArray = [];
                var cntGmvArray = [];
                var amtArray = [];
                var cntArray = [];

                var branchNames = respObj.data.branchNames;
                var branchDaily = respObj.data.branchData;
                var branchGmvDaily = respObj.data.branchGmvData;

                if (branchDaily.length !== 0 && branchGmvDaily.length !== 0) {
                    var startDate = branchDaily[0][0];
                    if (moment(startDate).isAfter(moment(branchGmvDaily[0][0]))) {
                        startDate = branchGmvDaily[0][0];
                    }
                    var endDate = branchDaily[branchDaily.length - 1][0];
                    if (moment(endDate).isBefore(moment(branchGmvDaily[branchGmvDaily.length - 1][0]))) {
                        endDate = branchGmvDaily[branchGmvDaily.length - 1][0];
                    }
                } else {
                    var startDate = startDt;
                    var endDate = endDt;
                }

                var currentMoment = moment(startDate);
                var endMoment = moment(endDate);
                while (!currentMoment.isAfter(endMoment)) {
                    dailyArray.push(currentMoment.format('YYYY年M月D日') + weekday[currentMoment.day()]);
                    currentMoment.add(1, 'd');
                }


                for (x in branchNames) {
                    //GMV和订单数
                    cntGmvArray[x] = [];
                    amtGmvArray[x] = [];

                    var branchGmvArray = branchGmvDaily.filter(function (item) {
                        return item[1] === x;
                    });


                    currentMoment = moment(startDate);

                    for (var i = 0; i < branchGmvArray.length; i++) {
                        while (currentMoment.isBefore(branchGmvArray[i][0])) {
                            cntGmvArray[x].push(0);
                            amtGmvArray[x].push(0);
                            currentMoment.add(1, 'd');
                        }

                        cntGmvArray[x].push(branchGmvArray[i][2]);
                        amtGmvArray[x].push(branchGmvArray[i][3]);
                        currentMoment.add(1, 'd');
                    }

                    while (!currentMoment.isAfter(endMoment)) {
                        cntGmvArray[x].push(0);
                        amtGmvArray[x].push(0);
                        currentMoment.add(1, 'd');
                    }

                    //支付金额和订单数
                    cntArray[x] = [];
                    amtArray[x] = [];

                    var branchArray = branchDaily.filter(function (item) {
                        return item[1] === x;
                    });


                    currentMoment = moment(startDate);

                    for (var i = 0; i < branchArray.length; i++) {
                        while (currentMoment.isBefore(branchArray[i][0])) {
                            cntArray[x].push(0);
                            amtArray[x].push(0);
                            currentMoment.add(1, 'd');
                        }

                        cntArray[x].push(branchArray[i][2]);
                        amtArray[x].push(branchArray[i][3]);
                        currentMoment.add(1, 'd');
                    }

                    while (!currentMoment.isAfter(endMoment)) {
                        cntArray[x].push(0);
                        amtArray[x].push(0);
                        currentMoment.add(1, 'd');
                    }

                }

                option.tooltip.formatter = function (params, ticket, callback) {
                    var xname = params[0].name + '<br/>';
                    var nmval = '';
                    var total = 0;

                    for (var i = 0; i < params.length; i++) {
                        total = total + params[i].value;
                    }
                    if (total === 0) {
                        total = 1;
                    }
                    for (var i = 0; i < params.length; i++) {
                        var thisnmval = params[i].seriesName + ' : ' + formatMoney(params[i].value, 1)
                            + ' 元 (' + (params[i].value * 100 / total).toFixed(2) + '%)<br/>';
                        nmval = nmval + thisnmval;
                    }

                    var content = xname + nmval;
                    callback(ticket, content);
                    return content;
                };

                //GMV
                option.title.text = '每日GMV';
                option.yAxis[0].name = '金额(元RMB)';
                option.xAxis[0].data = dailyArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'line',
                        tiled: 'GMV',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: amtGmvArray[x]
                    });
                }
                dailyAmtGmvChart.setOption(option);

                //订单金额
                option.title.text = '每日订单金额';
                option.yAxis[0].name = '金额(元RMB)';
                //option.yAxis[0].interval = 400000;
                option.xAxis[0].data = dailyArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'line',
                        tiled: '支付金额',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: amtArray[x]
                    });
                }
                dailyAmtChart.setOption(option);

                //订单数量
                option.tooltip.formatter = function (params, ticket, callback) {
                    var xname = params[0].name + '<br/>';
                    var nmval = '';
                    var total = 0;

                    for (var i = 0; i < params.length; i++) {
                        total = total + params[i].value;
                    }
                    if (total === 0) {
                        total = 1;
                    }
                    for (var i = 0; i < params.length; i++) {
                        var thisnmval = params[i].seriesName + ' : ' + formatMoney(params[i].value, 0)
                            + ' 单 (' + (params[i].value * 100 / total).toFixed(2) + '%)<br/>';
                        nmval = nmval + thisnmval;
                    }

                    var content = xname + nmval;
                    callback(ticket, content);
                    return content;
                };

                option.title.text = '每日订单数量';
                option.yAxis[0].name = '订单数(单)';
                option.xAxis[0].data = dailyArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'line',
                        tiled: '订单数',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: cntGmvArray[x]
                    });
                }
                dailyCntGmvChart.setOption(option);

                //支付订单数量
                option.title.text = '每日支付订单数量';
                option.yAxis[0].name = '订单数(单)';
                //option.yAxis[0].interval = 400000;
                option.xAxis[0].data = dailyArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'line',
                        tiled: '支付订单数',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: cntArray[x]
                    });
                }
                dailyCntChart.setOption(option);

            } else if (respObj.data && respObj.data.redirect) {

                //console.log("redirect: %s", respObj.data.redirect);
                if (window == top) {
                    location.href = respObj.data.redirect;
                } else {
                    top.location.href = respObj.data.redirect;
                }
            }
        }
    });
}


//周报
function selectedDateWeekly(startDt, endDt) {
    $.get("/router/rest/method/BranchWeekly/begin/" + startDt + "/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == "success") {
                weeklyStartDay = startDt;
                weeklyEndDay = endDt;

                var wkArray = [];
                var amtGmvArray = [];
                var cntGmvArray = [];
                var amtArray = [];
                var cntArray = [];

                var branchNames = respObj.data.branchNames;
                var branchWeekly = respObj.data.branchData;
                var branchGmvWeekly = respObj.data.branchGmvData;
                if(branchGmvWeekly.length==0 || branchWeekly.length ==0){
                    option.tooltip.show=false;
                    option.series.forEach(function(obj){
                        obj.data=[];
                    });
                    option.xAxis[0].data=[startDt+'至'+endDt];
                    option.title.text = '每周订单GMV';
                    option.yAxis[0].name = '金额(元RMB)';
                    weeklyAmtGmvChart.setOption(option);
                    option.title.text = '每周订单支付金额';
                    option.yAxis[0].name = '金额(元RMB)';
                    weeklyAmtChart.setOption(option);
                    option.title.text = '每周订单数';
                    option.yAxis[0].name = '数量(单)';
                    weeklyCntGmvChart.setOption(option);
                    option.title.text = '每周支付订单数';
                    option.yAxis[0].name = '数量(单)';
                    weeklyCntChart.setOption(option);
                    return;
                }else{
                    option.tooltip.show=true;
                }

            if(branchWeekly.length>0){
                var arrs=[];
                for(c=0;c<branchWeekly.length;c++){
                    arrs.push(branchWeekly[c][0]);
                }
                var temp ={},tempArr=[]; // 去重
                for(var a =0; a < arrs.length; a++){
                    if(!temp[arrs[a]]){
                        temp[arrs[a]] =true;
                        tempArr.push(arrs[a]);
                    }
                }
                for (var w = 0; w < tempArr.length; w++) {
                    var daysofweek = getStartEndDt(tempArr[w].substring(0,4),tempArr[w].substring(4,6));
                    if (Date.parse(startDt) > Date.parse(daysofweek[0])) {
                        daysofweek[0] = startDt;
                    }
                    if (Date.parse(endDt) < Date.parse(daysofweek[6])) {
                        daysofweek[6] = endDt;
                    }
                    wkArray.push(tempArr[w].substring(0,4)+"年第" + tempArr[w].substring(4,6) + "周" + "\n(" + daysofweek[0] + "至" + daysofweek[6] + ")");
                }
            }

                for (x in branchNames) {

                    cntGmvArray[x] = [];
                    amtGmvArray[x] = [];

                    var branchGmvArray = branchGmvWeekly.filter(function (item) {
                        return item[1] === x;
                    });

                    for (var i = 0; i < branchGmvArray.length; i++) {
                        //while (week < branchGmvArray[i][0]) {
                        //    cntGmvArray[x].push(0);
                        //    amtGmvArray[x].push(0);
                        //    week++;
                        //}

                        cntGmvArray[x].push(branchGmvArray[i][2]);
                        amtGmvArray[x].push(branchGmvArray[i][3]);

                    }



                    cntArray[x] = [];
                    amtArray[x] = [];

                    var branchArray = branchWeekly.filter(function (item) {
                        return item[1] === x;
                    });



                    for (var i = 0; i < branchArray.length; i++) {
                        //while (week < branchArray[i][0]) {
                        //    cntArray[x].push(0);
                        //    amtArray[x].push(0);
                        //    week++;
                        //}

                        cntArray[x].push(branchArray[i][2]);
                        amtArray[x].push(branchArray[i][3]);
                        //week++;
                    }

                    //while (week <= endWeek) {
                    //    cntArray[x].push(0);
                    //    amtArray[x].push(0);
                    //    week++;
                    //}
                }

                option.tooltip.formatter = function (params, ticket, callback) {
                    var xname = params[0].name + '<br/>';
                    var nmval = '';
                    var total = 0;

                    for (var i = 0; i < params.length; i++) {
                        total = total + params[i].value;
                    }
                    if (total === 0) {
                        total = 1;
                    }
                    for (var i = 0; i < params.length; i++) {
                        var thisnmval = params[i].seriesName + ' : ' + formatMoney(params[i].value, 1)
                            + ' 元 (' + (params[i].value * 100 / total).toFixed(2) + '%)<br/>';
                        nmval = nmval + thisnmval;
                    }

                    var content = xname + nmval;
                    callback(ticket, content);
                    return content;
                };

                option.title.text = '每周订单GMV';
                option.yAxis[0].name = '金额(元RMB)';
                option.xAxis[0].data = wkArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'line',
                        tiled: 'GMV',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: amtGmvArray[x]
                    });
                }
                weeklyAmtGmvChart.setOption(option);

                option.title.text = '每周订单支付金额';
                option.yAxis[0].name = '金额(元RMB)';
                option.xAxis[0].data = wkArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'line',
                        tiled: '支付金额',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: amtArray[x]
                    });
                }
                weeklyAmtChart.setOption(option);

                option.tooltip.formatter = function (params, ticket, callback) {
                    var xname = params[0].name + '<br/>';
                    var nmval = '';
                    var total = 0;

                    for (var i = 0; i < params.length; i++) {
                        if(params[i].value==undefined){
                            params[i].value=0;
                        }
                        total = total + params[i].value;
                    }
                    if (total === 0 || total==NaN) {
                        total = 1;
                    }
                    for (var i = 0; i < params.length; i++) {
                        if(params[i].value==undefined){
                            params[i].value=0;
                        }
                        var thisnmval = params[i].seriesName + ' : ' + formatMoney(params[i].value, 0)
                            + ' 单 (' + (params[i].value * 100 / total).toFixed(2) + '%)<br/>';
                        nmval = nmval + thisnmval;
                    }

                    var content = xname + nmval;
                    callback(ticket, content);
                    return content;
                };
                option.title.text = '每周订单数';
                option.yAxis[0].name = '数量(单)';
                option.xAxis[0].data = wkArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'line',
                        tiled: '订单数',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: cntGmvArray[x]
                    });
                }
                weeklyCntGmvChart.setOption(option);

                option.title.text = '每周支付订单数';
                option.yAxis[0].name = '数量(单)';
                option.xAxis[0].data = wkArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'line',
                        tiled: '支付订单数',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: cntArray[x]
                    });
                }
                weeklyCntChart.setOption(option);

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

selectedDateWeekly(weeklyStartDay, endDateInit);
selectedDateDaily(startDateInit, endDateInit);

//月报
function selectedYear(begintimes,endtimes) {
    $.get("/router/rest/method/BranchMonthly/begintimes/" + begintimes + "/endtimes/" + endtimes,  function (data, status) {
        if (status == "success") {
            var respObj = data;
            if (respObj.result == "success") {
                var mnArray = [];
                var amtGmvArray = [];
                var cntGmvArray = [];
                var amtArray = [];
                var cntArray = [];

                var branchNames = respObj.data.branchNames;
                var branchMonthly = respObj.data.branchData;
                var branchGmvMonthly = respObj.data.branchGmvData;

               var  mnArray= [];

                for (var j = 0; j < branchGmvMonthly.length; j++) {
                    mnArray.push(branchGmvMonthly[j][0]+'月');
                }
                var temp ={},tempArr=[]; // 去重
                for(var i =0; i < mnArray.length; i++){
                    if(!temp[mnArray[i]]){
                        temp[mnArray[i]] =true;
                        tempArr.push(mnArray[i]);
                    }
                }
                mnArray=tempArr;

                for (x in branchNames) {
                    //GMV金额和订单数
                    cntGmvArray[x] = [];
                    amtGmvArray[x] = [];

                    var branchGmvArray = branchGmvMonthly.filter(function (item) {
                        return item[1] === x;
                    });


                    for (var i = 0; i < branchGmvArray.length; i++) {
                        cntGmvArray[x].push(branchGmvArray[i][2]);
                        amtGmvArray[x].push(branchGmvArray[i][3]);
                    }

                    //支付金额和订单数
                    cntArray[x] = [];
                    amtArray[x] = [];

                    var branchArray = branchMonthly.filter(function (item) {
                        return item[1] === x;
                    });

                    for (var i = 0; i < branchArray.length; i++) {
                        cntArray[x].push(branchArray[i][2]);
                        amtArray[x].push(branchArray[i][3]);
                    }

                }

                option.tooltip.formatter = function (params, ticket, callback) {
                    var xname = params[0].name + '<br/>';
                    var nmval = '';
                    var total = 0;

                    for (var i = 0; i < params.length; i++) {
                        if(params[i].value==undefined){
                            params[i].value=0;
                        }
                        total = total + params[i].value;
                    }

                    if (total === 0 || total===NaN) {
                        total = 1;
                    }

                    for (var i = 0; i < params.length; i++) {
                        if(params[i].value==undefined){
                            params[i].value=0;
                        }
                        var thisnmval = params[i].seriesName + ' : ' + formatMoney(params[i].value, 1)
                            + ' 元 (' + (params[i].value * 100 / total).toFixed(2) + '%)<br/>';
                        nmval = nmval + thisnmval;
                    }
                    var content = xname + nmval;
                    callback(ticket, content);
                    return content;
                };
                option.title.text = '每月订单GMV';
                option.yAxis[0].name = '金额(元RMB)';
                option.xAxis[0].data = mnArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        stack: 'GMV',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: amtGmvArray[x]
                    });
                }
                monthlyAmtGmvChart.setOption(option);

                option.title.text = '每月订单支付金额';
                option.yAxis[0].name = '金额(元RMB)';
                option.xAxis[0].data = mnArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        stack: '支付金额',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: amtArray[x]
                    });
                }

                monthlyAmtChart.setOption(option);

                option.tooltip.formatter = function (params, ticket, callback) {
                    var xname = params[0].name + '<br/>';
                    var nmval = '';
                    var total = 0;
                    if (total === 0) {
                        total = 1;
                    }
                    for (var i = 0; i < params.length; i++) {
                        if(params[i].value==undefined){
                            params[i].value=0;
                        }
                        total = total + params[i].value;
                    }

                    for (var i = 0; i < params.length; i++) {
                        if(params[i].value==undefined){
                            params[i].value=0;
                        }
                        var thisnmval = params[i].seriesName + ' : ' + formatMoney(params[i].value, 0)
                            + ' 单 (' + (params[i].value * 100 / total).toFixed(2) + '%)<br/>';
                        nmval = nmval + thisnmval;
                    }

                    var content = xname + nmval;
                    callback(ticket, content);
                    return content;
                };
                option.title.text = '每月订单数';
                option.yAxis[0].name = '数量(单)';
                option.xAxis[0].data = mnArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        stack: '订单数',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: cntGmvArray[x]
                    });
                }

                monthlyCntGmvChart.setOption(option);

                option.title.text = '每月支付订单数';
                option.yAxis[0].name = '数量(单)';
                option.xAxis[0].data = mnArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        stack: '支付订单数',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: cntArray[x]
                    });
                }
                monthlyCntChart.setOption(option);

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


//季报
function selectedQuarterRpt(year) {
    $.get("/router/rest/method/BranchQuarterly/year/" + year, function (data, status) {
        if (status == "success") {
            var respObj = data;

            if (respObj.result == "success") {
                var qrtArray = [];
                var amtGmvArray = [];
                var cntGmvArray = [];
                var amtArray = [];
                var cntArray = [];

                var branchNames = respObj.data.branchNames;
                var branchQuarterly = respObj.data.branchData;
                var branchGmvQuarterly = respObj.data.branchGmvData;

                var strYear = year - 1;
                var qrtArrayTmp = [];

                for (var y = strYear; y <= year; y++) {
                    for (var i = 1; i < 5; i++) {
                        qrtArrayTmp.push(y.toString() + i);
                        qrtArray.push(y.toString() + "年第" + i + "季度");
                    }
                }

                for (x in branchNames) {

                    //GMV金额和订单数
                    cntGmvArray[x] = [];
                    amtGmvArray[x] = [];

                    var branchGmvArray = branchGmvQuarterly.filter(function (item) {
                        return item[1] === x;
                    });

                    var qrtFoundGMV = 'N';
                    var qrtGmv = qrtArrayTmp[0];
                    for (var j = 0; j < qrtArrayTmp.length; j++) {
                        qrtGmv = qrtArrayTmp[j];
                        qrtFoundGMV = 'N';
                        for (var i = 0; i < branchGmvArray.length; i++) {
                            if (branchGmvArray[i][0] === qrtGmv) {
                                cntGmvArray[x].push(branchGmvArray[i][2]);
                                amtGmvArray[x].push(branchGmvArray[i][3]);
                                qrtFoundGMV = 'Y';
                            }
                        }
                        if (qrtFoundGMV === 'N') {
                            cntGmvArray[x].push(0);
                            amtGmvArray[x].push(0);
                        }
                    }

                    //支付金额和订单数
                    cntArray[x] = [];
                    amtArray[x] = [];

                    var branchArray = branchQuarterly.filter(function (item) {
                        return item[1] === x;
                    });


                    var qrtFound = 'N';
                    var qrt = qrtArrayTmp[0];
                    for (var j = 0; j < qrtArrayTmp.length; j++) {
                        qrt = qrtArrayTmp[j];
                        qrtFound = 'N';
                        for (var i = 0; i < branchArray.length; i++) {
                            if (branchArray[i][0] === qrt) {
                                cntArray[x].push(branchArray[i][2]);
                                amtArray[x].push(branchArray[i][3]);
                                qrtFound = 'Y';
                            }
                        }
                        if (qrtFound === 'N') {
                            cntArray[x].push(0);
                            amtArray[x].push(0);
                        }
                    }
                }

                option.tooltip.formatter = function (params, ticket, callback) {
                    var xname = params[0].name + '<br/>';
                    var nmval = '';
                    var total = 0;

                    for (var i = 0; i < params.length; i++) {
                        total = total + params[i].value;
                    }

                    if (total === 0) {
                        total = 1;
                    }

                    for (var i = 0; i < params.length; i++) {
                        var thisnmval = params[i].seriesName + ' : ' + formatMoney(params[i].value, 1)
                            + ' 元 (' + (params[i].value * 100 / total).toFixed(2) + '%)<br/>';
                        nmval = nmval + thisnmval;
                    }

                    var content = xname + nmval;
                    callback(ticket, content);
                    return content;
                };
                option.title.text = '季度订单GMV';
                option.yAxis[0].name = '金额(元RMB)';
                option.xAxis[0].data = qrtArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        stack: 'GMV',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: amtGmvArray[x]
                    });
                }
                quarterlyAmtGmvChart.setOption(option);

                option.title.text = '季度订单支付金额';
                option.yAxis[0].name = '金额(元RMB)';
                option.xAxis[0].data = qrtArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        stack: '支付金额',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: amtArray[x]
                    });
                }
                quarterlyAmtChart.setOption(option);

                option.tooltip.formatter = function (params, ticket, callback) {
                    var xname = params[0].name + '<br/>';
                    var nmval = '';
                    var total = 0;

                    for (var i = 0; i < params.length; i++) {
                        total = total + params[i].value;
                    }
                    if (total === 0) {
                        total = 1;
                    }
                    for (var i = 0; i < params.length; i++) {
                        var thisnmval = params[i].seriesName + ' : ' + formatMoney(params[i].value, 0)
                            + ' 单 (' + (params[i].value * 100 / total).toFixed(2) + '%)<br/>';
                        nmval = nmval + thisnmval;
                    }

                    var content = xname + nmval;
                    callback(ticket, content);
                    return content;
                };
                option.title.text = '季度订单数';
                option.yAxis[0].name = '数量(单)';
                option.xAxis[0].data = qrtArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        stack: '订单数',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: cntGmvArray[x]
                    });
                }
                quarterlyCntGmvChart.setOption(option);

                option.title.text = '季度支付订单数';
                option.yAxis[0].name = '数量(单)';
                option.xAxis[0].data = qrtArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        stack: '支付订单数',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: cntArray[x]
                    });
                }
                quarterlyCntChart.setOption(option);

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


//年报
function selectedYearRpt(year) {

    $.get("/router/rest/method/BranchYearly/year/" + year, function (data, status) {

        if (status == "success") {
            var respObj = data;

            if (respObj.result == "success") {
                var yrArray = [];
                var amtGmvArray = [];
                var cntGmvArray = [];
                var amtArray = [];
                var cntArray = [];

                var branchNames = respObj.data.branchNames;
                var branchYearly = respObj.data.branchData;
                var branchGmvYearly = respObj.data.branchGmvData;

                var strYear = year - 2;

                for (var y = strYear; y <= year; y++) {
                    yrArray.push(y + "年");
                }

                for (x in branchNames) {

                    //GMV金额和订单数
                    cntGmvArray[x] = [];
                    amtGmvArray[x] = [];

                    var branchGmvArray = branchGmvYearly.filter(function (item) {
                        return item[1] === x;
                    });

                    var yearFoundGMV = 'N';
                    for (var y = strYear; y <= year; y++) {
                        yearFoundGMV = 'N';
                        for (var i = 0; i < branchGmvArray.length; i++) {
                            if (branchGmvArray[i][0] === y) {
                                cntGmvArray[x].push(branchGmvArray[i][2]);
                                amtGmvArray[x].push(branchGmvArray[i][3]);
                                yearFoundGMV = 'Y';
                            }
                        }
                        if (yearFoundGMV === 'N') {
                            cntGmvArray[x].push(0);
                            amtGmvArray[x].push(0);
                        }
                    }

                    //支付金额和订单数
                    cntArray[x] = [];
                    amtArray[x] = [];

                    var branchArray = branchYearly.filter(function (item) {
                        return item[1] === x;
                    });

                    var yearFound = 'N';
                    for (var y = strYear; y <= year; y++) {
                        yearFound = 'N';
                        for (var i = 0; i < branchArray.length; i++) {
                            if (branchArray[i][0] === y) {
                                cntArray[x].push(branchArray[i][2]);
                                amtArray[x].push(branchArray[i][3]);
                                yearFound = 'Y';
                            }
                        }
                        if (yearFound === 'N') {
                            cntArray[x].push(0);
                            amtArray[x].push(0);
                        }
                    }
                }

                option.tooltip.formatter = function (params, ticket, callback) {
                    var xname = params[0].name + '<br/>';
                    var nmval = '';
                    var total = 0;

                    for (var i = 0; i < params.length; i++) {
                        total = total + params[i].value;
                    }
                    if (total === 0) {
                        total = 1;
                    }
                    for (var i = 0; i < params.length; i++) {
                        var thisnmval = params[i].seriesName + ' : ' + formatMoney(params[i].value, 1)
                            + ' 元 (' + (params[i].value * 100 / total).toFixed(2) + '%)<br/>';
                        nmval = nmval + thisnmval;
                    }

                    var content = xname + nmval;
                    callback(ticket, content);
                    return content;
                };
                option.title.text = '每年订单GMV';
                option.yAxis[0].name = '金额(元RMB)';
                option.xAxis[0].data = yrArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        tiled: 'GMV',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: amtGmvArray[x]
                    });
                }
                yearlyAmtGmvChart.setOption(option);

                option.title.text = '每年订单支付金额';
                option.yAxis[0].name = '金额(元RMB)';
                option.xAxis[0].data = yrArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        tiled: '支付金额',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: amtArray[x]
                    });
                }
                yearlyAmtChart.setOption(option);

                option.tooltip.formatter = function (params, ticket, callback) {
                    var xname = params[0].name + '<br/>';
                    var nmval = '';
                    var total = 0;

                    for (var i = 0; i < params.length; i++) {
                        total = total + params[i].value;
                    }
                    if (total === 0) {
                        total = 1;
                    }
                    for (var i = 0; i < params.length; i++) {
                        var thisnmval = params[i].seriesName + ' : ' + formatMoney(params[i].value, 0)
                            + ' 单 (' + (params[i].value * 100 / total).toFixed(2) + '%)<br/>';
                        nmval = nmval + thisnmval;
                    }

                    var content = xname + nmval;
                    callback(ticket, content);
                    return content;
                };
                option.title.text = '每年订单数';
                option.yAxis[0].name = '数量(单)';
                option.xAxis[0].data = yrArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        tiled: '订单数',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: cntGmvArray[x]
                    });
                }
                yearlyCntGmvChart.setOption(option);

                option.title.text = '每年支付订单数';
                option.yAxis[0].name = '数量(单)';
                option.xAxis[0].data = yrArray;
                option.dataZoom = [];
                option.legend.data = branchNames;
                option.series = [];
                for (x in branchNames) {
                    option.series.push({
                        name: branchNames[x],
                        type: 'bar',
                        tiled: '支付订单数',
                        hoverAnimation: false,
                        lineStyle: {
                            normal: {}
                        },
                        data: cntArray[x]
                    });
                }
                yearlyCntChart.setOption(option);

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

selectedQuarterRpt(endYear);
selectedYearRpt(endYear);
selectedYear(begintimes,endtiems);

$(document).ready(function () {

    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch ($(active).attr('href')) {
            case '#daily':
                $("#toobar").show();$(".toobars").hide();
                echartsBox.removeClass("timepicker-padding");


                $('#datepicker').data('daterangepicker').setStartDate(moment(dailyStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(dailyEndDay).format('MM/DD/YYYY'));
                break;
            case '#weekly':
                $("#toobar").show();$(".toobars").hide();
                echartsBox.removeClass("timepicker-padding");

                $('#datepicker').data('daterangepicker').setStartDate(moment(weeklyStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(weeklyEndDay).format('MM/DD/YYYY'));
                break;
            case '#monthly':
                $("#toobar").hide();
                $(".toobars").show();
                echartsBox.removeClass("timepicker-padding");
                break;
            case '#quarterly':
                $(".toobars").hide();
                $("#toobar").hide();
                echartsBox.addClass("timepicker-padding");
                break;
            case '#yearly':
                $("#toobar").hide();$(".toobars").hide();
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

            selectedYear(dates2,$('#datas').val());
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
                    selectedDateDaily(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
                case '#weekly':
                    selectedDateWeekly(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
            }
        }
    );
});
