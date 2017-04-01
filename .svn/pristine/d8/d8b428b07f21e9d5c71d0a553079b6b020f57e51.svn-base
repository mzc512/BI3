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
    '<li class="active"><a href="#provinces" data-toggle="tab">注册/登录会员省份分布</a></li>' +
    '<li><a href="#city" data-toggle="tab">注册/登录会员城市分布</a></li>';

echartsBox.append(tab);

var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="provinces" class="tab-pane active chart" ><table><tr><td><div id="province" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW/3*2 + 'px;"></div></td><td><div id="showtitle"></div><br/><div id="showtable"></div></td></tr></table></div>');
container.push('<div id="city" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div></div>');
echartsBox.append(container.join(""));

var provinceChart = echarts.init(document.getElementById('province'));
var cityChart = echarts.init(document.getElementById('city'));


var option = {
    backgroundColor: '#fff',
    color: ['red', 'blue'],
    title: {
        text: '注册/登录会员城市分布',
        subtext: '',
        left: 'center',
        textStyle: {
            color: '#404a59'
        }
    },
    tooltip: {
        trigger: 'item'
    },
    toolbox: {
        feature: {
            dataView: {
                readOnly: false
            },
            restore: {},
            saveAsImage: {}
        }
    },
    legend: {
        y: 'bottom',
        x: 'center',
        data: ['注册会员', '登录会员'],
        textStyle: {
            color: '#404a59'
        },
        selectedMode: 'single'
    },
    visualMap: {
        min: 0,
        max: 3000,
        left: 'left',
        top: 'bottom',
        text: ['会员数'],
        calculable: true,
        dimension: 2,
        inRange: { 
           color: ['#33cc00', '#336600'],
            symbolSize: [4, 20]
        }
    },
    geo: {
        map: 'china',
        label: {
            emphasis: {
                show: false
            }
        },
        roam: true,
        itemStyle: {
            normal: {
                areaColor: '#323c48',
                borderColor: '#111'
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    },
    grid: {
        right: 10,
        top: 100,
        bottom: 40,
        width: '20%'
    },
    series: [
        {
            name: '注册会员',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [],
            symbolSize: 6,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            itemStyle: {
                emphasis: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            }
        },
        {
            name: '登录会员',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: [],
            symbolSize: 6,
            label: {
                normal: {
                    show: false
                },
                emphasis: {
                    show: true,
                    position: 'right',
                    formatter: '{b}'
                }
            },
            itemStyle: {
                emphasis: {
                    borderColor: '#fff',
                    borderWidth: 1
                }
            }
        }
    ]
};

var option1 = {
    backgroundColor: '#fff',
    title: {
        text: '注册/活跃会员省份分布',
        subtext: '',
        left: 'center',
        textStyle: {
            color: '#404a59'
        }
    },
    tooltip: {
        trigger: 'item'
    },
    toolbox: {
        feature: {
            dataView: {
                readOnly: false
            },
            restore: {},
            saveAsImage: {}
        }
    },
    legend: {
        y: 'bottom',
        x: 'center',
        data: ['注册会员', '登录会员'],
        textStyle: {
            color: '#404a59'
        }
        , selectedMode: 'single'
    },
    visualMap: {
        min: 0,
        max: 3000,
        left: 'left',
        top: 'bottom',
        text: ['会员数'],
        calculable: true
    },
    series: [
        {
            name: '注册会员',
            type: 'map',
            mapType: 'china',
            roam: true,
            data: [],
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: 'red'
                }
            }
        },
        {
            name: '登录会员',
            type: 'map',
            mapType: 'china',
            roam: true,
            data: [],
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: 'green'
                }
            }
        }
    ]
};


var startDateInit = (moment(Date.now()).subtract(90, 'd')).format('YYYY-MM-DD');
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');
var startDateInits=(moment(Date.now()).subtract(30, 'd')).format('YYYY-MM-DD');
var endDateInits = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');



//注册/活跃会员城市统计
function selectedDateDaily(startDt, endDt) {
    $.get("/router/rest/method/registerNumberChinaCity/begin/" + startDt + "/end/" + endDt, function (data, status) {
        startDateInits=startDt;
            endDateInits=endDt;
        if (status == "success"){
            var respObj = data;
            if (respObj.result == true) {
                var shipArray = [];
                var deliveryArray = [];

                var shipCities = respObj.data[0];
                var deliveryCities = respObj.data[1];

                shipCities = shipCities.filter(function(e){
                        return e['Lng'] != null && e['Lat'] != null;
                    }
                );

                deliveryCities = deliveryCities.filter(function(e){
                        return e['Lng'] != null && e['Lat'] != null;
                    }
                );

                for (var i = 0; i < shipCities.length; i++){
                    shipArray.push({
                        name: shipCities[i]['registercity'],
                        value: [shipCities[i]['Lng'], shipCities[i]['Lat'], shipCities[i]['registercnt']]
                    });
                }

                for (var i = 0; i < deliveryCities.length; i++){
                    deliveryArray.push({
                        name: deliveryCities[i]['logincity'],
                        value: [deliveryCities[i]['Lng'], deliveryCities[i]['Lat'], deliveryCities[i]['logincnt']]
                    });
                }

                var maxCntShip = shipArray.reduce(function(prev, curr)  {
                    if (prev.value[2] > curr.value[2]){
                        return prev;
                    } else {
                        return curr;
                    }
                });

                var maxCntDelivery = deliveryArray.reduce(function(prev, curr){
                    if (prev.value[2] > curr.value[2]) {
                        return prev;
                    } else {
                        return curr;
                    }
                });

                option.tooltip.formatter =function (params, ticket, callback){
                    var content = params.seriesName + ': <br/>城市：' + params.name +
                        '<br/>会员数: ' + formatMoney(params.value[2], 0) + ' 人';
                    callback(ticket, content);
                    return content;
                };

                option.series[0].data = shipArray;

                option.series[1].data = deliveryArray;

                option.visualMap.max = (maxCntShip.value[2] > maxCntDelivery.value[2] ? maxCntShip.value[2] : maxCntDelivery.value[2]);

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


//注册/活跃会员省份统计
function selectedProvince(startDt, endDt) {
    var legendname;
    $.get("/router/rest/method/registerNumberChinaPri/begin/" + startDt + "/end/" + endDt, function (data, status) {
        startDateInit=startDt;
            endDateInit=endDt;
        if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var shipArray = [];
                var deliveryArray = [];
                var shipPro = respObj.data[0];
                var deliveryPro = respObj.data[1];

                for (var i = 0; i < shipPro.length; i++) {
                    shipArray.push({
                        name: shipPro[i]['registerpro'],
                        value: [shipPro[i]['registercnt']]
                    });
                }

                for (var i = 0; i < deliveryPro.length; i++){
                    deliveryArray.push({
                        name: deliveryPro[i]['loginpro'],
                        value: [deliveryPro[i]['logincnt']]
                    });
                }
    
                var maxCntShip = shipArray.reduce(function(prev, curr){
                    if (prev.value[0] > curr.value[0]) {
                        return prev;
                    } else {
                        return curr;
                    }
                });

                var maxCntDelivery = deliveryArray.reduce(function(prev, curr){
                    if (prev.value[0] > curr.value[0]) {
                        return prev;
                    } else {
                        return curr;
                    }
                });

                option1.series[0].data = shipArray;
                option1.series[1].data = deliveryArray;

                option1.tooltip.formatter = function(params, ticket, callback)  {
                    var d1 = (params.data.value && params.data.value[0]) ? formatMoney(params.data.value[0], 0) : 0;
                    var d2 = (params.data.value && params.data.value[1]) ? formatMoney((params.data.value[1]).toFixed(2), 1) : 0;
                    var content = params.seriesName + ':<br/>省份： ' + params.name + '<br/>会员数 :' +
                        d1 + ' 人' ;
                    callback(ticket, content);
                    return content;
                };

                option1.visualMap.max = (maxCntShip.value[0] > maxCntDelivery.value[0] ? maxCntShip.value[0] * 2 : maxCntDelivery.value[0] * 2);


                provinceChart.on('legendselectchanged', function (params) {
                    legendname= params.name;
                   if(legendname=="注册会员")
                   {
                       selectCity('NA',startDt,endDt,'one');
                   }else{
                       selectCity('NA',startDt,endDt,'two');
                   }
                });


                provinceChart.setOption(option1);

                provinceChart.on("click", function (param){
                    var province = param.name;
                    if(legendname=="登录会员")
                    {
                        console.log(2);
                        selectCity(province,startDateInit,endDateInit,'two');
                    }else{
                        console.log(1);
                        selectCity(province,startDateInit,endDateInit,'one');
                    }
                });

                selectCity('NA',startDt,endDt,'one');

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


$.get('/anaweb/js/echarts/v3.2.2/map/json/china.json', function (chinaJson) {
    echarts.registerMap('china', chinaJson);
    $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInit).format('MM/DD/YYYY'));
    $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInit).format('MM/DD/YYYY'));
    selectedProvince(startDateInit, endDateInit);
    selectedDateDaily(startDateInits, endDateInits);
});

var activeTab="#province";

$(document).ready(function () {
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch ($(active).attr('href')) {
            case '#province':
                $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInit).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInit).format('MM/DD/YYYY'));
                break;
            case '#city':
                $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInits).format('MM/DD/YYYY'));
                $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInits).format('MM/DD/YYYY'));
                break;
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
            'opens': 'left'
        },
        function (start, end, label) {
            switch (activeTab) {
                case '#province':
                    selectedProvince(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
                case  '#city':
                    selectedDateDaily(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                    break;
                 }
        }
    );
});

//显示城市
function selectCity(province,begin,end,num){

    var province=province;
    var citys;
    var provinces;
    if(province=="NA"){
        provinces="所有";
        citys="省份";
    }else{
        provinces=province;
        citys="城市";
    }
    $('#searchTable').empty();
    $('#showtable').empty();
    $('#showtitle').html(provinces+'省份');
    $('#showtable').append(
        '<table width="300px" id="searchTable"' +
        'data-toggle="table"' +
        'data-search="false"' +
        'data-show-columns="false"' +
        'data-sort-name="Ssn"'+
        'data-sort-order="desc"'+
        'data-pagination="true"' +
        'data-page-size="50"' +
        'data-page-list="[10,50,100]"' +
        'data-height="500"' +
        '></table>');
    $('#searchTable').append(
        '<thead>' +
        '<tr>' +
        '<th data-field="c1" data-sortable="true">'+citys+'</th>' +
        '<th data-field="cnt" data-sortable="true">数量</th>'+
        '</tr>' +
        '</thead>'
    );

    $('#searchTable').bootstrapTable({
        url: '/router/rest/method/register_menberdist?begin=' + begin + '&end=' + end+ '&province=' + province+ '&num=' + num
    });
}

