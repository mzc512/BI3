/*订单分类*/

var echartsBox = $('.echartsBox');
echartsBox.css({'padding-bottom':'10px'});

$('#toobar').show();

//tabs
echartsBox.append('<ul id="group" class="nav nav-tabs"></ul>');

$("#group").append('<li class="active"><a href="#search" data-toggle="tab">品　类</a></li>');
$("#group").append('<li><a href="#branchOffice" data-toggle="tab">分公司</a></li>');
$("#group").append('<li><a href="#industry" data-toggle="tab">行　业</a></li>');

var chartSize = getChartSize(true);
var chartH = chartSize.height;
var chartW = chartSize.width;


//chart
echartsBox.append('<div id="payTool"></div><div id="payBranch"></div>');
var payToolDiv = $('#payTool');
var payBranchDiv = $('#payBranch');
payToolDiv.addClass('chart');
payToolDiv.css('height', '450px');
payBranchDiv.addClass('chart');
payBranchDiv.css({'width':chartW,'height':'500px','display':'none'});
var payToolChart = echarts.init(document.getElementById('payTool'));
var payBranchChart = echarts.init(document.getElementById('payBranch'));


var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="search" class="tab-pane active chart" ></div>');
container.push('<div id="branchOffice" class="tab-pane chart" ></div>');
container.push('<div id="industry" class="tab-pane chart "></div>');
container.push('</div>');

var tabs = $('<div id="tabs" class="tab-content" ></div>');
echartsBox.append(tabs);
tabs.append(container.join(""));

var startDateInit = (moment(Date.now()).subtract(30, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');

var startbranchPayDay=startDateInit;
var endbranchPayDay=endDateInit;
var startpaymentIndustryDay=startDateInit;
var endpaymentIndustryDay=endDateInit;
var searchStartDay = startDateInit;
var searchEndDay = endDateInit;



var option = {
    title: {
        text: '\u54c1\u7c7b',
        x: 'center'
    },
    color:[],
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'horizontal',
        left:350,
        data: [],
        bottom:0
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
            name: '',
            type: 'pie',
            radius: [30, 130],
            center: ['25%','50%'],
            data: [],
            label: {
                normal: {
                    show: true,
                    formatter:'{b}\n单数：{c} ({d}%)'
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
        },
        {
            name: 'PV',
            type: 'pie',
            radius: [30, 130],
            center: ['70%', '50%'],
            data: [],
            label: {
                normal: {
                    show: true,
                    formatter:'{b}\n金额：{c}({d}%)'
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
    $.get("/orderTypeList/method/payCategory/begin/" + startDt + "/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;  
            if (respObj.result == true) {
                if (respObj.data.length > 0) {
                var legendArray = [];
                var timesArray = [];
                var pvArray = [];
                var timesTotal = 0;
                var pvTotal = 0;
                for (var i = 0; i < respObj.data.length; i++) {
                     legendArray.push(respObj.data[i]['cat_brn_nm']);
                    timesArray.push({
                        value: respObj.data[i]['orderNum'],
                        name: respObj.data[i]['cat_brn_nm']
                    });
                    pvArray.push({
                        value: respObj.data[i]['orderPay'],
                        name: respObj.data[i]['cat_brn_nm']
                    });
                    timesTotal += parseInt(respObj.data[i]['orderNum']);
                    pvTotal    += parseInt(respObj.data[i]['orderPay']);
                }
                option.tooltip.formatter = function (params, ticket, callback) {
                    var val = params.value;
                    if (params.seriesIndex == 0) {
                        var per = (val * 100 / timesTotal).toFixed(2) + '%';
                    } else {
                        var per = (val * 100 / pvTotal).toFixed(2) + '%';
                    }
                    console.log(params.seriesName);
                    if(params.seriesName=="品类订单"){
                        var content = params.seriesName + '<br/>' + params.name +
                            ' : ' + formatMoney( val,0) + ' (' + per + ')';
                    }else{
                        var content = params.seriesName + '<br/>' + params.name +
                            ' : ' + formatMoney( val,1) + ' (' + per + ')';
                    }


                    callback(ticket, content);
                    return content;
                };
                 option.title.text="品　类";
                 option.series[0].color=['#D53A35','#2F4554','#61A0A8','#D48265','#91C7AE'];
                 option.series[1].color=['#D53A35','#2F4554','#61A0A8','#D48265','#91C7AE'];
                 option.legend.left=350;
                 option.legend.data = legendArray;
                 option.series[0].data = timesArray;
                 option.series[0].name = "品类订单";
                 option.series[1].name = "品类金额";
                 option.series[1].data = pvArray;
                 payToolChart.setOption(option);
            }
            }
        }        
    });


    $('#search').empty();
    $('#search').append(
        '<table id="searchTable"' +
        'data-toggle="table"' +
        'data-search="true"' +
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-height="500"' +
        '></table>');

    $('#searchTable').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="cat_brn_nm"  data-sortable="true">品类</th>' +
        '<th data-field="Indry_Nm" data-sortable="true">行业</th>' +
        '<th data-field="orderNum"  data-sortable="true" >订单数</th>' +
        '<th data-field="orderPay" data-sortable="true" data-align="right"  data-formatter="amtFormatter" >金额</th>' +
        '<th data-field="bounce"  data-sortable="false" >订单占比</th>' +
         '<th data-field="goldRatio"  data-sortable="false" >金额占比</th>' +
        '</tr>' +
        '</thead>'
    );

    $('#searchTable').bootstrapTable({
        url: '/orderTypeList/method/payOrderTypeList/begin/' + startDt + '/end/' + endDt
    });
}
selectedSearchList(searchStartDay, searchEndDay);
//分公司
function selectedBranchOfficeList(startDt, endDt) {
    startbranchPayDay=startDt;
    endbranchPayDay=endDt;
 $.get("/orderTypeList/method/branchPay/begin/" + startDt + "/end/" + endDt, function (data, status) {
    if (status == "success") {
        var respObj = data;  
        if (respObj.result == true) {
            if(respObj.data.length > 0){
                 var legendArrays = [];
                var timesArrays = [];
                var pvArrays = [];
                var timesTotal = 0;
                var pvTotal = 0;
                for (var i = 0; i < respObj.data.length; i++) {
                    timesTotal += parseInt(respObj.data[i]['orderNums']);
                    pvTotal += parseInt(respObj.data[i]['orderPays']);
                    legendArrays.push(respObj.data[i]['branchName']);
                    timesArrays.push({
                        value: respObj.data[i]['orderNums'],
                        name: respObj.data[i]['branchName']
                    });
                    pvArrays.push({
                        value: respObj.data[i]['orderPays'],
                        name: respObj.data[i]['branchName']
                    });
                   
                }
                option.tooltip.formatter = function (params, ticket, callback) {
                    var val = params.value;
                    if (params.seriesIndex == 0) {
                        var per = (val * 100 / timesTotal).toFixed(2) + '%';
                    } else {
                        var per = (val * 100 / pvTotal).toFixed(2) + '%';
                    }
                    var content = params.seriesName + '<br/>' + params.name +
                        ' : ' + val + ' (' + per + ')';

                    callback(ticket, content);
                    return content;
                };
                option.title.text = "分公司";
                option.series[0].color=['#D53A35','#2F4554','#61A0A8','#D48265','#91C7AE','#CA8622','#BDA29A'];
                option.series[1].color=['#D53A35','#2F4554','#61A0A8','#D48265','#91C7AE','#CA8622','#BDA29A'];
                option.legend.left=250;
                option.legend.data = legendArrays;
                option.series[0].data = timesArrays;
                option.series[0].name = '分公司订单';
                option.series[1].name = '分公司金额';
                option.series[1].data = pvArrays;
                payBranchChart.setOption(option);
            }
        }
    }
});
    $('#branchOffice').empty();
    $('#branchOffice').append(
        '<table id="branchOfficeTable"' +
        'data-toggle="table"' +
        'data-search="true"' +
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-height="500"' +
        '></table>');

    $('#branchOfficeTable').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="branchName" data-sortable="true">分公司</th>' +
         '<th data-field="Indry_Nm" data-sortable="true">行业</th>' +
        '<th data-field="orderNums" data-sortable="true">订单数</th>' +
        '<th data-field="orderPays" data-sortable="true" data-align="right" data-formatter="amtFormatter">金额</th>' +
        '<th data-field="orderRatio" data-sortable="false">订单占比</th>' +
        '<th data-field="goldRatio" data-sortable="false">金额占比</th>' +
        '</tr>' +
        '</thead>'
    );
    $('#branchOfficeTable').bootstrapTable({
        url: '/orderTypeList/method/payOrderCompanyList/begin/' + startDt + '/end/' + endDt
    });
}

//行业
function selectedIndustryList(startDt, endDt) {
    startpaymentIndustryDay=startDt;
    endpaymentIndustryDay=endDt;
    $('#industry').empty();
    $('#industry').append(
        '<table id="industryTable"' +
        'data-toggle="table"' +
        'data-search="true"' +
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-height="500"' +
        '></table>');

    $('#industryTable').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="tradeName" data-sortable="true">行业</th>' +
        '<th data-field="orderNums" data-sortable="true">订单数</th>' +
        '<th data-field="orderPays" data-sortable="true" data-align="right" data-formatter="amtFormatter">金额</th>' +
        '<th data-field="orderRatio" data-sortable="false">订单占比</th>' +
        '<th data-field="goldRatio" data-sortable="false">金额比</th>' +
        '</tr>' +
        '</thead>'
    );

    $('#industryTable').bootstrapTable({
        url: '/orderTypeList/method/paymentIndustry/begin/' + startDt + '/end/' + endDt
    });
}
$(document).ready(function () { 
          var activeTab='';
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch (activeTab) {
            case '#search':
                $("#toobar").show();  $("#payTool").show(); $("#payBranch").hide();
                echartsBox.css("padding-top", "4px");
                $('#datepicker').data('daterangepicker').setStartDate(moment(searchStartDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(searchEndDay).format('MM/DD/YYYY'));
                selectedSearchList(searchStartDay, searchEndDay);
                break;
            case '#branchOffice':
                $("#toobar").show();  $("#payTool").hide(); $("#payBranch").show();
                echartsBox.css("padding-top", "4px");
                $('#datepicker').data('daterangepicker').setStartDate(moment(startbranchPayDay).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endbranchPayDay).format('MM/DD/YYYY'));
                selectedBranchOfficeList(moment(startbranchPayDay).format('YYYY-MM-DD'), moment(endbranchPayDay).format('YYYY-MM-DD'));
                break;
            case '#industry':
                $("#toobar").show();     $("#payTool").hide(); $("#payBranch").hide();
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
                '最近90日': [moment().subtract('days', 89), moment()]
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
function formatDay(date){
    var date = new Date(date);
    return (date.getMonth()+1) + '/' + date.getDate()+'/'+date.getFullYear();
}

$('.fixed-table-pagination').css({'height':'100px'});