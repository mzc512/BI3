/*user_order_pariod
*产生购买情况 饼图
**/
var echartsBox = $('.echartsBox');
echartsBox.css({'padding-bottom':'10px'});

$('#toobar').show();

//tabs
echartsBox.append('<ul id="group" class="nav nav-tabs"></ul>');

$("#group").append('<li class="active"><a href="#search" data-toggle="tab">会员购买情况</a></li>');
 $("#group").append('<li><a href="#branchOffice" data-toggle="tab">首次购买会员数量占比</a></li>');
$("#group").append('<li><a href="#industry" data-toggle="tab">首次购买会员金额占比</a></li>');

var containH = $(document).height();
var otherH = $("#group").outerHeight(true);
var toolbarH = 46;
var navtop = $(window.parent.document).find('.nav-top');
if(navtop.length>0){
    otherH+=navtop;
}
otherH+=toolbarH;
var chartSize = getChartSize(true);
var chartH = chartSize.height;
var containW = $(document).width();
var echartboxMargin =2*8;
var verticalscollbarWidth = 26;
var otherW = echartboxMargin+verticalscollbarWidth;

var chartW = containW - otherW;

//chart
echartsBox.append('<div id="payTool"></div><div id="payBranch"></div><div id="moneys"></div>');
var payToolDiv = $('#payTool');
var payBranchDiv = $('#payBranch');
var moneysDiv = $('#moneys');
payToolDiv.addClass('chart');
payToolDiv.css('height', '450px');
payBranchDiv.addClass('chart');
moneysDiv.addClass('chart');
payBranchDiv.css({'width':chartW,'height':'570px','display':'none'});
moneysDiv.css({'width':chartW,'height':'570px','display':'none'});
var payToolChart = echarts.init(document.getElementById('payTool'));
var payBranchChart = echarts.init(document.getElementById('payBranch'));
var moneysChart = echarts.init(document.getElementById('moneys'));

var startDateInit = (moment(Date.now()).subtract(30, 'd')).format('YYYY-MM-DD');
var startDate = (moment(Date.now()).subtract(7, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');
var searchStartDay = startDateInit;
var searchEndDay = endDateInit;

var startbranchPayDay=startDate;
var endbranchPayDay=endDateInit;
var startpaymentIndustryDay=startDate;
var endpaymentIndustryDay=endDateInit;

var xData = function() {
    var data = [];
    for (var i = 1; i < 15; i++) {
        data.push(i + "月份");
    }
    return data;
};
var option1={
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
        showDelay : 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        formatter: function (obj, ticket, callback) {
            var style1 = 'font-size:30px;vertical-align:top;padding-right:5px;';
            var res= '<div style="line-height:20px;"><span style="'+style1+'color:#fff">&bull;</span>' + obj[0].name+'&nbsp;&nbsp;&nbsp;'+obj[1].data.dd+' </div>';
            if(obj[0].seriesName=="非首次购买会员"||obj[1].seriesName=="首次购买会员"){
                res += '<div style="line-height:20px;"><span style="'+style1+'color:#fff">&bull;</span>' + obj[0].seriesName + ' ' + formatMoney(obj[0].value,0) + ' </div>';
                res += '<div style="line-height:20px;"><span style="'+style1+'color:#fff">&bull;</span>' + obj[1].seriesName + ' ' + formatMoney(obj[1].value,0) + ' </div>';
            }else{
                res += '<div style="line-height:20px;"><span style="'+style1+'color:#fff">&bull;</span>' + obj[0].seriesName + ' ' + formatMoney(obj[0].value,1) + ' </div>';
                res += '<div style="line-height:20px;"><span style="'+style1+'color:#fff">&bull;</span>' + obj[1].seriesName + ' ' + formatMoney(obj[1].value,1) + ' </div>';
            }

            res += '<div style="line-height:20px;"><span style="'+style1+'color:#fff">&bull;</span>' + obj[2].seriesName + ' ' + obj[2].value + '% </div>';
            callback(ticket, res);
            return res;
        },
        axisPointer: {
            "type": "shadow",
            textStyle: {
                color: "#000"
            }
        }
    },
    legend: {
        x: 'center',
        top: '11%',
        textStyle: {
            color: '#000'//90979c
        },
        data:['新会员','老会员','新会员占比']
    },
    xAxis : [
        {
            type : 'category',
            axisLabel:{
                interval:0,
                rotate:0,
                margin:10,
                textStyle:{
                    color:"#222"
                }
            },
            data : xData
        }
    ],
    grid: { // 控制图的大小，调整下面这些值就可以
        "borderWidth": 0,
        "top": 110,
        x:80,
        x2:100,
        y2:150,
        //"bottom": 95,
        textStyle: {
            color: "#000"
        }
    },
    yAxis : [
        {
            name:"会员人数",
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
            name:"新会员占比%",
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
        name:'新会员',
        type:'bar',
        stack: '总量',
        barMaxWidth: 65,
        hoverAnimation: false,
        itemStyle: {
            normal: {
                color: "rgba(255,144,128,1)",
                label: {
                    show: true,
                    textStyle: {
                        "color": "#FFF"
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
            name:'老会员',
            type:'bar',
            stack: '总量',
            barMaxWidth: 65,
            hoverAnimation: false,
            itemStyle: {
                normal: {
                    color: "rgba(0,191,183,1)",
                    barBorderRadius: 0,
                    label: {
                        textStyle:{color:"blue"},
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
            name:'新会员占比',
            type:'line',
            yAxisIndex: 1,
            label:{
                normal:{
                    formatter:'{c}%'
                }

            },
            itemStyle: {
                normal: {
                    color: "#FF359A",
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



var option = {
    title: {
        text: '\u54c1\u7c7b',
        x: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: []
    },
    toolbox: {
        show: true,
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {
                show: true,
                type: ['pie', 'funnel']
            },
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    calculable: true,
    series: [
        {
            name: '\u54c1\u7c7b',
            type: 'pie',
            radius: [30, 130],
            center: ['28%', '66%'],
            data: [],
            label: {
                normal: {
                    show: true,
                    formatter:'{b}:{d}%'
                },
                emphasis: {
                    posotion:'inner',
                    show: true
                }
            },
            lableLine: {
                normal: {
                    show: true
                },
                emphasis: {
                    posotion:'inner',
                    show: true
                }
            }
        },
        {
            name: 'PV',
            type: 'pie',
            radius: [30, 130],
            center: ['75%', '66%'],
            data: [],
            label: {
                normal: {
                    show: true,
                    formatter:'{b}:{d}%'
                },
                emphasis: {
                    show: true
                }
            },
            lableLine: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            }
        }
    ]
};
//品类
function selectedSearchList(startDt, endDt) {
    searchStartDay=startDt;
    searchEndDay=endDt;
    $.get("/router/rest/method/purchaseSituation/begin/" + startDt + "/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;  
            if (respObj.result == true) {
                if (respObj.data.length > 0) {
                var legendArray = [];
                var timesArray = [];
                var pvArray = [];
                var timesTotal = 0;
                var pvTotal = 0;
                for (var i = 0; i < respObj.data[0].length; i++) {
                    timesTotal = parseInt(respObj.data[0][i]['TotalCnt']);
                    var firstDaysbi=(respObj.data[0][i]['firstDay']/timesTotal*100).toFixed(2)+'%';
                   timesArray.push({
                        value: respObj.data[0][i]['firstDay'],
                        name: '注册首日购买占比'
                    },{
                        value: respObj.data[0][i]['twoFourteenDay'],
                        name: '注册次日至14日购买占比'
                    }
                    ,{
                        value: respObj.data[0][i]['fourteenThirtyDay'],
                        name: '注册14日至30日购买占比'
                    },{
                        value: respObj.data[0][i]['thirtyMoreDay'],
                        name: '注册30日以上购买占比'
                    });
                    
                    
                    
                }

  
                for (var i = 0; i < respObj.data[1].length; i++) {
                    pvArray.push({
                        value: respObj.data[1][i]['firstCnt'],
                        name: '购买1次占比'
                    },{
                        value: respObj.data[1][i]['twoCnt'],
                        name: '购买2次占比'
                    },{
                        value: respObj.data[1][i]['threeTenCnt'],
                        name: '购买3至10次占比'
                    },{
                        value: respObj.data[1][i]['tenMoreCnt'],
                        name: '购买10次以上占比'
                    });
                    
                     pvTotal  = parseInt(respObj.data[1][i]['TotalsCnt']);
                    
                }
        // legendArray.push(respObj.data[0][0]['firstDays']);
                option.tooltip.formatter = function (params, ticket, callback) {
                    var val = params.value;
                    if (params.seriesIndex == 0) {
                        var per = (val * 100 / timesTotal).toFixed(2) + '%';
                    } else {
                        var per = (val * 100 / pvTotal).toFixed(2) + '%';
                    }
                    var content = params.seriesName + '<br/>' + params.name+': '+per+
                        '<br/>数量 : ' + val;

                    callback(ticket, content);
                    return content;
                };
                 option.title.text="会员购买情况";
                  //option.legend.data = legendArray;
                 option.series[0].data = timesArray;
                 option.series[0].name = "购买时间占比";
                 option.series[1].name = "购买次数占比";
                 option.series[1].data = pvArray;
                 payToolChart.setOption(option);
            }
            }
        }        
    });
}
selectedSearchList(searchStartDay, searchEndDay);

var weekday = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
//首次购买会员数量占比
function selectedBranchOfficeList(startDt, endDt) {
    startbranchPayDay = startDt;
    endbranchPayDay = endDt;
    $.ajax({
        type: 'GET',
        url: '/router/rest/method/beginsMembership/begin/' + startDt + '/end/' + endDt,
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

                    option1.title.text = '首次购买会员数量占比';
                    option1.xAxis[0].data = dtArray;
                    option1.series[0].data = cntArrayEnt;
                    option1.series[1].data =  cntArray;
                    option1.series[2].data = cntArrayNor;
                    option1.xAxis[0].axisLabel.rotate=330;
                    option1.series[1].name='首次购买会员';
                    option1.series[0].name='非首次购买会员';
                    option1.series[2].name='首次购买会员占比';
                    option1.legend.data=['非首次购买会员','首次购买会员','首次购买会员占比'];
                    option1.xAxis[0].data = dtArray;
                    option1.yAxis[0].name='会员数';
                    option1.yAxis[1].name='首次购买会员占比';
                    option1.series[2].itemStyle.normal.color='blue';
                    payBranchChart.setOption(option1);

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
//首次偶买会员金额占比
function selectedIndustryList(startDt, endDt){
    startpaymentIndustryDay=startDt;
    endpaymentIndustryDay=endDt;
    $.ajax({
        type: 'GET',
        url: '/router/rest/method/firstPurchaseAmount/begin/' + startDt + '/end/' + endDt,
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

                    option1.title.text = '首次购买会员金额占比';
                    option1.series[1].name='首次购买金额';
                    option1.series[0].name='非首次购买金额';
                    option1.series[2].name='首次购买金额占比';
                    option1.legend.data=['首次购买金额','非首次购买金额','首次购买金额占比'];
                    option1.xAxis[0].data = dtArray;
                    option1.yAxis[0].name='金额';
                    option1.yAxis[1].name='首次购买金额占比';
                    option1.series[0].data = cntArrayEnt;
                    option1.series[1].data = cntArray ;
                    option1.series[2].data = cntArrayNor;
                    option1.xAxis[0].axisLabel.rotate=330;
                    option1.series[2].itemStyle.normal.color='red';
                    moneysChart.setOption(option1);

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


$(document).ready(function () { 
          var activeTab='';
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch (activeTab) {
            case '#search':
                $("#toobar").show();  $("#payTool").show(); $("#payBranch").hide(); $("#moneys").hide();
                echartsBox.css("padding-top", "4px");
                $('#datepicker').data('daterangepicker').setStartDate(moment(searchStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(searchEndDay).format('MM/DD/YYYY'));
                selectedSearchList(searchStartDay, searchEndDay);
                break;
            case '#branchOffice':
                $("#toobar").show();  $("#payTool").hide(); $("#payBranch").show(); $("#moneys").hide();
                echartsBox.css("padding-top", "4px");
                $('#datepicker').data('daterangepicker').setStartDate(moment(startbranchPayDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endbranchPayDay).format('MM/DD/YYYY'));
                selectedBranchOfficeList(moment(startbranchPayDay).format('YYYY-MM-DD'), moment(endbranchPayDay).format('YYYY-MM-DD'));
                break;
            case '#industry':
                $("#toobar").show();     $("#payTool").hide(); $("#payBranch").hide();$("#moneys").show();
                echartsBox.css("padding-top", "4px");
                $('#datepicker').data('daterangepicker').setStartDate(moment(startpaymentIndustryDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endpaymentIndustryDay).format('MM/DD/YYYY'));
                selectedIndustryList(startpaymentIndustryDay, endpaymentIndustryDay);
                break;
        }

    });

    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(0, 'd')).format('MM/DD/YYYY'),
            "startDate": formatDay(searchStartDay),
            "endDate": formatDay(searchEndDay),
            'ranges' : {
                '最近7日': [moment().subtract('days', 6), moment()],
                '最近30日': [moment().subtract('days', 29), moment()],
                '最近90日': [moment().subtract('days', 89), moment()],
                '最近180日': [moment().subtract('days', 179), moment()],
                '最近一年': [moment().subtract('days', 365), moment()]
            },
            'opens': 'left'
        },
        function (start, end, label) {
            var yearBeg = '01/01/' + moment(Date.now()).format('YYYY');
            if (moment(start) < yearBeg) {
                $('#datepicker').data('daterangepicker').setStartDate((moment(Date.now()).subtract(7, 'd')).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate((moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'));
                start = moment(startDateInit);
                end = moment(endDateInit);
            }
            switch (activeTab) {
                case '#search':
                    selectedSearchList(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
                case '#branchOffice':
                    selectedBranchOfficeList(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
                case '#industry':
                    selectedIndustryList(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
                case '':
                    selectedSearchList(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
            }
        }
    );

});
