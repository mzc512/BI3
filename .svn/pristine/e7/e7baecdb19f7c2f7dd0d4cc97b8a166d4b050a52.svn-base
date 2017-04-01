/*订单区域分布*/
var echartsBox = $('.echartsBox');
$('#toobar').show();


//tabs
var tab = '<ul id="group" class="nav nav-tabs">' +
    '<li class="active"><a href="#province" data-toggle="tab">订单省份分布</a></li>' +
    '<li><a href="#city" data-toggle="tab">订单城市分布</a></li></ul>';

echartsBox.append(tab);

var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="province" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="city" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('</div>');
echartsBox.append(container.join(""));

var provinceChart = echarts.init(document.getElementById('province'));
var cityChart = echarts.init(document.getElementById('city'));


var option = {
    backgroundColor: '#fff',
    color: ['red', 'green'],
    title: {
        text: '已支付订单城市分布',
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
        data: ['发货城市', '收货城市'],
        textStyle: {
            color: '#404a59'
        },
        selectedMode: 'single'
    },
    visualMap: {
        orient: 'horizontal',
        min: 0,
        max: 3000,
        left: 10,
        top: 10,
        text: ['订单数'],
        calculable: true,
        dimension: 2,
        inRange: {
            //color: ['#50a3ba', '#eac736', '#d94e5d']
            color: ['#99ff99', '#33cc00', '#336600'],
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
    series: [
        {
            name: '发货城市',
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
            name: '收货城市',
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
        text: '已支付订单省份分布',
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
        data: ['发货省份', '收货省份'],
        textStyle: {
            color: '#404a59'
        }
        , selectedMode: 'single'
    },
    visualMap: {
        orient: 'horizontal',
        min: 0,
        max: 3000,
        left: 10,
        top: 10,
        text: ['订单数'],
        calculable: true,
        dimension: 0
    },
    series: [
        {
            name: '发货省份',
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
            name: '收货省份',
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


var startDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY') + '-01-01';
var endDateInit = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');




function selectedDateDaily(startDt, endDt) {
    //console.log("start date: %s, end date: %s.", startDt, endDt);
    $.get("/router/rest/method/OrderCity/begin/" + startDt + "/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;

            if (respObj.result == "success") {
                var shipArray = [];
                var deliveryArray = [];

                var shipCities = respObj.data.shipCities;
                var deliveryCities = respObj.data.deliveryCities;


                shipCities = shipCities.filter(function(e)  {
                        return e[4] != null && e[5] != null;
                    }
                );

                deliveryCities = deliveryCities.filter(function(e)  {
                        return e[4] != null && e[5] != null;
                    }
                );

                for (var i = 0; i < shipCities.length; i++) {
                    shipArray.push({
                        name: shipCities[i][1],
                        value: [shipCities[i][4], shipCities[i][5], shipCities[i][2], shipCities[i][3]]
                    });
                }

                for (var i = 0; i < deliveryCities.length; i++) {
                    deliveryArray.push({
                        name: deliveryCities[i][1],
                        value: [deliveryCities[i][4], deliveryCities[i][5], deliveryCities[i][2], deliveryCities[i][3]]
                    });
                }

                var maxCntShip = shipArray.reduce(function(prev, curr)  {
                    if (prev.value[2] > curr.value[2]) {
                        return prev;
                    } else {
                        return curr;
                    }
                });

                var maxCntDelivery = deliveryArray.reduce(function(prev, curr)  {
                    if (prev.value[2] > curr.value[2]) {
                        return prev;
                    } else {
                        return curr;
                    }
                });

                option.tooltip.formatter =function (params, ticket, callback)  {
                    var content = params.seriesName + ': ' + params.name +
                        '<br/>订单数: ' + formatMoney(params.value[2], 0) + ' 单' +
                        '<br/>金额: ' + formatMoney((params.value[3]).toFixed(2), 1) + ' 元';
                    callback(ticket, content);
                    return content;
                };

                option.series[0].data = shipArray;

                option.series[1].data = deliveryArray;
                option.visualMap.max = (maxCntShip.value[2] > maxCntDelivery.value[2] ? maxCntShip.value[2] * 2 : maxCntDelivery.value[2] * 2);

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


//订单省份统计
function selectedProvince(startDt, endDt) {
    //console.log("start date: %s, end date: %s.", startDt, endDt);
    $.get("/router/rest/method/OrderProvince/begin/" + startDt + "/end/" + endDt, function (data, status) {
        if (status == "success") {
            var respObj = data;

            if (respObj.result == "success") {
                var shipArray = [];
                var deliveryArray = [];

                var shipPro = respObj.data.shipPro;
                var deliveryPro = respObj.data.deliveryPro;

                //console.log("shipPro.length=%d", shipPro.length);
                //console.log("deliveryPro.length=%d", deliveryPro.length);

                for (var i = 0; i < shipPro.length; i++) {
                    shipArray.push({
                        name: shipPro[i][0],
                        value: [shipPro[i][1], shipPro[i][2]]
                    });
                }

                for (var i = 0; i < deliveryPro.length; i++) {
                    deliveryArray.push({
                        name: deliveryPro[i][0],
                        value: [deliveryPro[i][1], deliveryPro[i][2]]
                    });
                }

                var maxCntShip = shipArray.reduce(function(prev, curr)  {
                    if (prev.value[0] > curr.value[0]) {
                        return prev;
                    } else {
                        return curr;
                    }
                });

                var maxCntDelivery = deliveryArray.reduce(function(prev, curr)  {
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
                    var content = params.seriesName + ': ' + params.name + '<br/>订单数 :' +
                        d1 + ' 单' + '<br/>金额 : ' +
                        d2 + ' 元';
                    callback(ticket, content);
                    return content;
                };

                option1.visualMap.max = (maxCntShip.value[0] > maxCntDelivery.value[0] ? maxCntShip.value[0] * 2 : maxCntDelivery.value[0] * 2);

                provinceChart.setOption(option1);
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
    selectedProvince(startDateInit, endDateInit);
    selectedDateDaily(startDateInit, endDateInit);
});


$(document).ready(function () {
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
            selectedProvince(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
            selectedDateDaily(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        }
    );
});
