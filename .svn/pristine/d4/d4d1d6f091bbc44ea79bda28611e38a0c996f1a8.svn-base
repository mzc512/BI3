/**
 * Created by Administrator on 2016/12/7.
 */

var xData = function() {
    var data = [];
    for (var i = 1; i < 15; i++) {
        data.push(i + "月份");
    }
    return data;
};



/*新老客户占比*/
var echartsBox = $('.echartsBox');
$('#toobar').show();

//tabs
echartsBox.append("<ul id=\"group\" class=\"nav nav-tabs\"></ul>");

$("#group").append('<li class=\"active\"><a href=\"#search\" data-toggle=\"tab\">月占比</a></li>' );

echartsBox.append('<div id="monthly" class="chart"></div>');
$('#payTool').css('height', '400px');
var monthlyChart = echarts.init(document.getElementById('monthly'));

var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content">');
container.push('<div id="search" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('</div>');

var tabs = $('<div id="tabs" class="tab-content" ></div>');
echartsBox.append(tabs);
tabs.append(container.join(""));

var activeTab = '#search';


//var yearlyChart = echarts.init(document.getElementById('yearly'));
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
        showDelay : 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        formatter: function (params, ticket, callback) {
            var xname = params[0].name + '<br/>';
            var nmval = '';
            for (var i = 0; i < params.length; i++) {
                if(params[i].value==undefined){
                    params[i].value=0;
                }
                if( params[i].seriesName=='新开发单数'|| params[i].seriesName=='返单单数'){
                    var unit= formatMoney((params[i].value),0)+'单';
                }else{
                    var unit=formatMoney((params[i].value).toFixed(2), 1)+'元';
                }

                var thisnmval = params[i].seriesName + ' : '  +unit+'<br/>';
                nmval = nmval + thisnmval;
            }
            var content = xname + nmval;
            callback(ticket, content);
            return content;

        },
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
        data:['新开发单数','返单单数','优惠券面值','促进线上采购']
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
            data : xData
        }
    ],
    grid: { // 控制图的大小，调整下面这些值就可以
        "borderWidth": 0,
        "top": 110,
        textStyle: {
            color: "#fff"
        }
    },
    yAxis : [
        {
            name:"单数",
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
            name:"金额",
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
            color:"#d3dee5"

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
        name:'新开发单数',
        type:'bar',
        stack: '总量',
        barMaxWidth: 65,
        hoverAnimation: false,
        itemStyle: {
            normal: {
                color: "#99CDFF",
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
            name:'返单单数',
            type:'bar',
            stack: '总量',
            barMaxWidth: 65,
            hoverAnimation: false,
            itemStyle: {
                normal: {
                    color: "#548FD5",
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
            name:'优惠券面值',
            type:'line',
            yAxisIndex: 1,
            label:{
                normal:{
                    formatter:'{c}'
                }
            },
            itemStyle: {
                normal: {
                    color: "#A26970",
                    barBorderRadius: 0,
                    label:{
                        show: true,
                        textStyle: {
                              "color": "#1C4559"
                            },
                        formatter: function(p) {
                            return p.value > 0 ? (p.value) : '';
                        }
                    }
                }
            },
            data:[]
        },
        {
            name:'促进线上采购',
            type:'line',
            yAxisIndex: 1,
            label:{
                normal:{
                    formatter:'{c}'
                }
            },
            itemStyle: {
                normal: {
                    color: "#A8ABAE",
                    barBorderRadius: 0,
                    label: {
                        show: true,
                        textStyle: {
                            "color": "#AD0209"
                        },
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

//月报
function selectedMonthly(begin,end){
    $('#search').empty();
    $('#search').append(
        '<table id="searchTable"' +
        'data-toggle="table"' +
        'data-search="true"' +
        'data-show-columns="true"' +
        'data-sort-name="times"'+
        'data-sort-order="desc"'+
        'data-pagination="true"' +
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-height="350"' +
        '></table>');

    $('#searchTable').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="dateTimes" data-sortable="true">时间</th>' +
        '<th data-field="f_use_cnt" data-sortable="true" data-formatter="cntFormatter">新开发单数</th>' +
        '<th data-field="m_use_cnt" data-sortable="true" data-formatter="cntFormatter">返单单数</th>' +
        '<th data-field="faceValue" data-sortable="true" data-formatter="amtFormatter">优惠券面值</th>' +
        '<th data-field="promoteProcurement" data-sortable="true" data-formatter="amtFormatter">促进线上采购</th>' +
        '</tr>' +
        '</thead>'
    );

    $('#searchTable').bootstrapTable({
        showExport: true,                     //是否显示导出
        exportDataType: "all",
        url: '/router/rest/method/couponStatistics/begin/' + begin+'/end/'+ end,
        onLoadSuccess: function(data) {
            var respObj = data;
            if (respObj.result == true) {
                var mthArray = [];
                var cntArray = [];
                var cntArrayEnt = [];
                var cntArrayNor = [];
                var cntArrayNor1 = [];
                for (var i = 0; i < respObj.data.length; i++) {
                    if((respObj.data[i]['dateTimes']).length> 6){
                       var mthComment= respObj.data[i]['dateTimes'].toString().substr(0, 4) +respObj.data[i]['dateTimes'].toString().substr(4);
                    }else{
                        var mthComment= respObj.data[i]['dateTimes'].toString().substr(0, 4) + '年'+respObj.data[i]['dateTimes'].toString().substr(4) + '月';
                    }
                    mthArray.push(mthComment);
                    cntArray.push({dd:'', name:mthComment,value:respObj.data[i]['f_use_cnt']});
                    cntArrayEnt.push(respObj.data[i]['m_use_cnt']);
                    cntArrayNor.push(respObj.data[i]['faceValue']);
                    cntArrayNor1.push(respObj.data[i]['promoteProcurement']);
                }

                option.title.text = '月采购商优惠券活动汇总分析表';
                option.xAxis[0].data = mthArray;
                option.series[0].data = cntArray;
                option.series[0].barMaxWidth = 75;
                option.series[1].data = cntArrayEnt;
                option.series[1].barMaxWidth = 75;
                option.series[2].data = cntArrayNor;
                option.series[3].data = cntArrayNor1;
                monthlyChart.setOption(option);
                    monthlyChart.on('click', function (params) {
                        if(params.name.indexOf("年")>0){
                            var dates1=(params.name).replace("年",'-');
                            dates1=dates1.replace("月",'');
                            selectedMonthly(dates1);
                        }
                    });


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


selectedMonthly(begintimes,endtimes);


$(document).ready(function () {
    $("#toobar").hide();$(".toobars").show();
    echartsBox.removeClass("timepicker-padding");
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
       var active = e.target;
        activeTab = $(active).attr('href');
       switch ($(active).attr('href')) {
           case '#monthly':
              $("#toobar").hide();$(".toobars").show();
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
            "startDate": (moment(Date.now()).subtract(14, 'd')).format('MM/DD/YYYY'),
            "endDate": (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()]
            },
            'opens': 'left'
        }
        //function (start, end, label) {
        //    switch (activeTab) {
        //        case '#monthly':
        //            selectedDaily(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        //            break;
        //        case '#weekly':
        //            selectedWeekly(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        //            break;
        //    }
        //}
    );

});
