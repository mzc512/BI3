//注册会员渠道

var echartsBox = $('.echartsBox');
echartsBox.css({"height": ($(document).height() - 112) + "px"});
$('#toobar').show();


//tabs
var groupw = $(document).width() - 40;
var tab = '<ul id="group" class="nav nav-tabs" style="padding-left:20px;width:' + groupw + 'px;">' +
    '<li class="active"><a href="#channel" data-toggle="tab">注册会员渠道</a></li>';

echartsBox.append(tab);

var chartSize = getChartSize();
var chartH = chartSize.height;
var chartW = chartSize.width;

var container = [];
container.push('<div id="tabs" class="tab-content" >'+
        '<div id="channel" class="tab-pane active chart" style="height:'
         + chartH + 'px;width:' + chartW + 'px;"></div></div>');
echartsBox.append(container.join(""));

var channelChart = echarts.init(document.getElementById('channel'));

var option = {
    backgroundColor: '#fff',
    title: {
        text: '注册会员渠道',
        subtext: '2016年',
        x: 'center',
        y: 'center',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 16
        }
    },
    tooltip: {
        show: true,
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        bottom: '0%',
        data: []
    },
    series: [{
        type: 'pie',
        selectedMode: 'single',
        radius: ['29.5%', '58%'],
        color: ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67'],

        label: {
            normal: {
                position: 'inner',
                rotate:90,
                formatter: "{d}%",

                textStyle: {
                    color: '#FFF',
                    fontWeight: 'bold',
                    fontSize: 14
                }
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data: []
    }, {
        type: 'pie',
        radius: ['58%', '83%'],
        itemStyle: {
            normal: {
                color: '#F2F2F2'
            },
            emphasis: {
                color: '#ADADAD'
            }
        },
        label: {
            normal: {
                position: 'inner',
                formatter: function(p) {
                                    return p.value > 0 ? formatMoney(p.value,0)+'人' : '';
                                },

                textStyle: {
                    color: '#777777',
                    fontWeight: 'bold',
                    fontSize: 14
                }
            }
        },
        data: []
    }]
};



var startDateInites=(moment(Date.now()).subtract(60, 'd')).format('YYYY-MM-DD');
var endDateInites = (moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');


//注册会员渠道
function selectchannel(startDt, endDt){
     $.get("/router/rest/method/registerMemberChannel/begin/" + startDt + "/end/" + endDt, function (data, status) {
        startDateInites=startDt;
        endDateInites=endDt;
         if (status == "success") {
            var respObj = data;
            if (respObj.result == true) {
                var channelnameArray = [];
                var channelArray = [];
                for (var i = 0; i < respObj.data.length; i++) {
                    channelnameArray.push(respObj.data[i]['loginChannel']);
                    channelArray.push({
                       value : respObj.data[i]['channelcnt'],
                       name : respObj.data[i]['loginChannel']  
                    });
                }
                var subtext=startDateInites+'--'+endDateInites;
                option.title.subtext=subtext;
                option.legend.data=channelnameArray;
                option.series[0].data=channelArray;
                option.series[1].data=channelArray;
                channelChart.setOption(option);

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

selectchannel(startDateInites, endDateInites);

$(document).ready(function () {
    var activeTab;
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        var active = e.target;
        activeTab = $(active).attr('href');
        switch ($(active).attr('href')) {
            case '#channel':
            $('#datepicker').data('daterangepicker').setStartDate(moment(startDateInites).format('MM/DD/YYYY'));
            $('#datepicker').data('daterangepicker').setEndDate(moment(endDateInites).format('MM/DD/YYYY'));
             
        }
    });

    $('#datepicker').daterangepicker(
        {
            'minDate': '01/01/2015',
            'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            "startDate":(moment(Date.now()).subtract(60, 'd')).format('MM/DD/YYYY'),
            "endDate": (moment(Date.now()).subtract(1, 'd')).format('MM/DD/YYYY'),
            'ranges' : {
                '最近1日': [moment().subtract('days', 1), moment()],
                '最近7日': [moment().subtract('days', 7), moment()],
                '最近30日': [moment().subtract('days', 30), moment()],
                '最近半年': [moment().subtract('days', 184), moment()],
                '最近壹年': [moment().subtract('days', 366), moment()]
            },
            'opens': 'left'
        },
        function (start, end, label) {
                     selectchannel(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                 }
        
    );
});

