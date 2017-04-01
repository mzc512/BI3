/*订单类型统计*/
var echartsBox = $('.echartsBox');
$('#toobar').show();

echartsBox.append(
    '<div>' +
    '<div class="well distall">' +
    '<form class="form-horizontal">' +
    '<fieldset>' +
    '<div class="control-group">' +
    '<div class="controls">' +
    '<div class="input-prepend input-group">' +
    '<div class="distdvone">' +
    '指标：<select class="distselect" id="dist_dl"></select>' +
    '</div>'+
    '<div class="distdvtwo">' +
    '维度：<select class="distselect" id="dist_wd"></select>' +
    '</div>' +
    '<div class="distthere">次要维度：'+
    '<select class="distselect" id="dist_cywd">'+
    '</select>'+
    '</div>'+
    '<div  style="float:left;  margin-left: 20px;margin-top: 20px; font-size: 14px;  color:#555; height: 34px;line-height: 34px;;">'+
    '<button type="button" class="btn btn-primary" id="order_seledatadistbtn">搜索</button>'+
    '</div>'+
    '</div>' +
    '</div>' +
    '</div>' +
    '</fieldset>' +
    '</form>' +
    '</div>' +
    '<div id="distecharts" style="margin: 20px; height:350px;">' +

    '</div>' +
    '<div style="margin: 20px;" id="searchdivtable">' +

    '</div>' +
    '</div>'
)

var distecharts = echarts.init(document.getElementById('distecharts'));
var startDateSel=(moment(Date.now()).subtract(1, 'd')).format('YYYY-01-01');
var endDateSel=(moment(Date.now()).subtract(1, 'd')).format('YYYY-MM-DD');

var option = {
    title: {
        text: '会员行业分布统计',
        x: 'center',
        align: 'right'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        },
        formatter:'{b}<br>数量:{c0}'
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
            name: 'asdfasdf',
            type: 'value'
        }
    ],
    series: [
        {
            name: '',
            type:'line',
            lineStyle: {
                normal: {}
            },
            itemStyle: {
                normal: {
                    label: {
                        show: false
                    }
                }
            },
            data: []
        }
    ]
};

/*点击搜索调用方法*/
function order_dataurlstatis(startdatas,endDates,distdls,distwds,distcywds){
    var startDate=startdatas;
    var endDate  =endDates;
    var distdl   =distdls;
    var distwd   =distwds;
    var distcywd =distcywds;
    //console.log(startDate+'==='+endDate+'==='+distdl+'==='+distwd+'==='+distcywd);
    $('#searchdivtable').empty();
    $('#searchdivtable').append(
        '<table id="searchTable"' +
        'data-toggle="table"' +
        'data-search="true"' +
            //'data-show-refresh="true"' +
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-page-list="[]"' +
        'data-height="470"' +
        '></table>');

    console.log(123);
    $.get("/router/rest/method/member/dim/datalist/startDate/" + startDate + "/endDate/" + endDate+"/distdl/"+distdl+"/distwd/"+distwd+"/distcywd/"+distcywd, function (data, status) {
        //console.log(data);
        if(data.result) {
            if ($("#dist_wd option:selected").val() != "全部" && $("#dist_cywd option:selected").val() != "全部") {

                $('#searchTable').append(
                    '<thead>' +
                    '<tr>' +
                    '<th data-field="dim1_nm" data-sortable="true" class="dim3ID" >主要维度</th>' +
                    '<th data-field="dim1" data-sortable="true" data-visible="false" >主要维度ID</th>' +
                    '<th data-field="dim2_nm" data-sortable="true" class="dim2ID">次要维度</th>' +
                    '<th data-field="dim2" data-sortable="true" data-visible="false" >次要维度ID</th>' +
                    '<th data-field="mem_cnt" data-sortable="true" >指标</th>' +
                    '</tr>' +
                    '</thead>'
                )
                $('#searchTable').bootstrapTable({
                    data: data.data,
                    showExport: true,                     //是否显示导出
                    exportDataType: "all"              //basic', 'all', 'selected

                });
                $('#distecharts').hide();

            } else if ($("#dist_wd option:selected").val() != "全部" || $("#dist_cywd option:selected").val() != "全部") {

                $('#searchTable').append(
                    '<thead>' +
                    '<tr data-field="dim1">' +
                    '<th data-field="dim1_nm" data-sortable="true" data-lis="dim1" class="dim1ID">维度</th>' +
                    '<th data-field="dim1" data-sortable="true" data-visible="false" >ID</th>' +
                    '<th data-field="mem_cnt" data-sortable="true">指标</th>' +
                    '</tr>' +
                    '</thead>'
                );

                $('#searchTable').bootstrapTable({
                    data: data.data,
                    showExport: true,                     //是否显示导出
                    exportDataType: "all"
                });

                var dldata = [];
                var dltime = [];
                for (var i = 0; i < data.data.length; i++) {
                    dldata[i] = data.data[i].mem_cnt;
                    dltime[i] = data.data[i].dim1_nm;
                }
                option.series[0].data = dldata;
                option.yAxis[0].name = "指标";
                option.series[0].type = "bar";
                option.xAxis[0].data = dltime;
                option.xAxis[0].axisLabel = {interval: 0, rotate: -30};
                //if (dltime.length > 10) {
                //    option.xAxis[0].axisLabel = {interval: 0, rotate: -30};
                //} else {
                //    option.xAxis[0].axisLabel = {interval: 'auto', rotate: 0};
                //}

                distecharts.setOption(option);
                $('#distecharts').show();
            } else {

                $('#searchTable').append(
                    '<thead>' +
                    '<tr>' +
                    '<th data-field="dim1_nm" data-sortable="true">时间</th>' +
                    '<th data-field="mem_cnt" data-sortable="true">指标</th>' +
                    '</tr>' +
                    '</thead>'
                );

                $('#searchTable').bootstrapTable({
                    data: data.data,
                    showExport: true,                     //是否显示导出
                    exportDataType: "all"
                });
                var dldata = [];
                var dltime = [];
                for (var i = 0; i < data.data.length; i++) {
                    dldata[i] = data.data[i].mem_cnt;
                    dltime[i] = data.data[i].dim1_nm;
                }
                option.series[0].data = dldata;
                option.yAxis[0].name = "指标";
                option.xAxis[0].data = dltime;
                option.xAxis[0].axisLabel = {interval: 'auto', rotate: 0};
                distecharts.setOption(option);
                $('#distecharts').show();
            }


            $('#searchTable').on('click-cell.bs.table', function (e,field, value, row, $element) {
                var len =0;
                for(item in row){
                    len++;
                }
                if(len==5){  //如果是5个属性的
                    if($element.hasClass("dim3ID")){
                        var dim1 = row.dim1;
                        var dim2 = "ALL"
                        var clk3 = "clk3";
                        order_click_dataall(startDate, endDate, endDate, distdl, distwd, distcywd, dim1, dim2, clk3);
                    }else if($element.hasClass("dim2ID")){
                        var dim2 = row.dim2;
                        var dim1 = row.dim1;
                        var clk2 = "clk2";
                        order_click_dataall(startDate, endDate, endDate, distdl, distwd, distcywd, dim1, dim2, clk2);
                    }

                }else if(len ==3){ //如果是3个属性的
                    if($element.hasClass("dim1ID")) {
                        var dim1 = row.dim1;
                        var dim2 = row.dim1;
                        var clk1 = "clk1";
                        if (distwd == "D_D00") {
                            dim1 = "ALL";
                        } else if (distcywd == "D_D00") {
                            dim2 = "ALL";
                        }
                        order_click_dataall(startDate, endDate, endDate, distdl, distwd, distcywd, dim1, dim2, clk1);
                    }
                }

            });

        }else{
            if(data.message='NoSession'){
                location.href=data.data.redirect;
            }
        }
    });
}

/*点击ID调用方法*/
function order_click_dataall(startDate,endDate,endDate,distdl,distwd,distcywd,dim1,dim2,clinum){

    $('#searchdivtable').empty();
    $('#searchdivtable').append(
        '<table id="searchTable"' +
        'data-toggle="table"' +
        'data-search="true"' +

            //'data-show-refresh="true"' +
        'data-show-columns="true"' +
        'data-pagination="true"' +
        'data-page-size="10"' +
        'data-page-list="[10,50,100]"' +
        'data-page-list="[]"' +
        'data-height="470"' +
        '></table>');
    console.log("/router/rest/method/member/dim/clickdata/startDate/" + startDate + "/endDate/" + endDate+"/distdl/"+distdl+"/distwd/"+distwd+"/distcywd/"+distcywd+"/val1/"+dim1+"/val2/"+dim2);
    $.get("/router/rest/method/member/dim/clickdata/startDate/" + startDate + "/endDate/" + endDate+"/distdl/"+distdl+"/distwd/"+distwd+"/distcywd/"+distcywd+"/val1/"+dim1+"/val2/"+dim2, function (data, status) {
        if(data.result){
            if(clinum=="clk1"){
                $('#searchTable').append(
                    '<thead>' +
                    '<tr>'+
                    '<th data-field="stat_dt" data-sortable="true">日期</th>' +
                    '<th data-field="dim1_nm" data-sortable="true">维度</th>' +
                    '<th data-field="dim1" data-sortable="true" data-visible="false">ID</th>' +
                    '<th data-field="amt" data-sortable="true" class="dim4ID">指标</th>' +
                    '</tr>' +
                    '</thead>'
                )

                $('#searchTable').bootstrapTable({
                    data:data.data,
                    showExport: true,                     //是否显示导出
                    exportDataType: "all"
                });

                var dldata=[];
                var dltime=[];
                for(var i=0;i<data.data.length;i++)
                {
                    dldata[i]= data.data[i].amt;
                    dltime[i]= data.data[i].stat_dt;
                }
                option.series[0].data=dldata;
                option.yAxis[0].name="指标";
                option.series[0].type="line";
                option.xAxis[0].data=dltime;
                //console.log(dltime);
                option.xAxis[0].axisLabel = {interval: 'auto', rotate: 0};
                distecharts.setOption(option);
                $('#distecharts').show();
            }else if(clinum=="clk2")
            {
                $('#searchTable').append(
                    '<thead>' +
                    '<tr>'+
                    '<th data-field="stat_dt" data-sortable="true">日期</th>' +
                    '<th data-field="dim1_nm" data-sortable="true" >主要维度</th>' +
                    '<th data-field="dim2_nm" data-sortable="true" >次要维度</th>' +
                    '<th data-field="amt" data-sortable="true" >指标</th>' +
                    '<th data-field="dim1" data-sortable="true" data-visible="false">主要维度ID</th>' +
                    '<th data-field="dim2" data-sortable="true" data-visible="false">次要维度ID</th>' +
                    '</tr>' +
                    '</thead>'
                )
                $('#searchTable').bootstrapTable({
                    data:data.data,
                    showExport: true,                     //是否显示导出
                    exportDataType: "all"
                });
                var dldata=[];
                var dltime=[];
                for(var i=0;i<data.data.length;i++)
                {
                    dldata[i]= data.data[i].amt;
                    dltime[i]= data.data[i].stat_dt;
                }
                option.series[0].data=dldata;
                option.series[0].type="line";
                option.yAxis[0].name="指标";
                option.xAxis[0].data=dltime;
                option.xAxis[0].axisLabel = {interval: 'auto', rotate: 0};
                distecharts.setOption(option);

                $('#distecharts').show();
            }else if(clinum=="clk3"){
                $('#searchTable').append(
                    '<thead>' +
                    '<tr>'+
                    '<th data-field="dim1_nm" data-sortable="true">主要维度</th>' +
                    '<th data-field="dim2_nm" data-sortable="true" >次要维度</th>' +
                    '<th data-field="amt" data-sortable="true" >指标</th>' +
                    '<th data-field="dim1" data-sortable="true" data-visible="false">主要维度ID</th>' +
                    '<th data-field="dim2" data-sortable="true" data-visible="false">次要维度ID</th>' +
                    '</tr>' +
                    '</thead>'
                )
                $('#searchTable').bootstrapTable({
                    data:data.data,
                    showExport: true,                     //是否显示导出
                    exportDataType: "all"
                });
                $('#distecharts').hide();
            }
        }else{
            if(data.message='NoSession'){
                location.href=data.data.redirect;
            }
        }
    });

}

$(document).ready(function () {

    $('#datepicker').daterangepicker({
        format: 'yyyy-mm-dd',
        'minDate': '01/01/2015',
        'maxDate': (moment(Date.now()).subtract(1, 'd')).format('MM-DD-YYYY'),
        "startDate": '01/01/' + (moment(Date.now()).subtract(1, 'd')).format('YYYY'),
        "endDate": (moment(Date.now()).subtract(1, 'd')).format('MM-DD-YYYY'),
        'ranges' : {
            '最近1日': [moment().subtract('days', 1), moment()],
            '最近7日': [moment().subtract('days', 7), moment()],
            '最近30日': [moment().subtract('days', 30), moment()]
        },
        "opens": 'left'
    },function (start, end, label) {
        startDateSel = start.format('YYYY-MM-DD');
        endDateSel = end.format('YYYY-MM-DD');

    });

    $.get("/router/rest/method/member/industry/dropdownlist", function (data, status) {
        if(data.result)
        {
            var dist_dllen=data.data[0].data.length;
            var dist_wdlen=data.data[1].data.length;
            var ss=[];
            var dd=[];
            for(var i=0;i<dist_dllen;i++)
            {
                $('#dist_dl').append("<option data-dimcode='"+data.data[0].data[i].dim_cd+"'value='" +data.data[0].data[i].dim_nm+ "'>" +data.data[0].data[i].dim_nm+ "</option>");
            }
            for(var i=0;i<dist_wdlen;i++)
            {
                ss[i]=data.data[1].data[i].dim_nm;
                dd[i]=data.data[1].data[i].dim_cd;
                $('#dist_wd').append("<option data-dimcode='"+data.data[1].data[i].dim_cd+"'value='" +data.data[1].data[i].dim_nm+ "'>" +data.data[1].data[i].dim_nm+ "</option>");
                $('#dist_cywd').append("<option data-dimcode='"+data.data[1].data[i].dim_cd+"'value='" +data.data[1].data[i].dim_nm+ "'>" +data.data[1].data[i].dim_nm+ "</option>");
            }

            var startDate=startDateSel;
            var endDate=endDateSel;

            var distdl=$("#dist_dl option:selected").attr('data-dimcode');
            var distwd=$("#dist_wd option:selected").attr('data-dimcode');
            var distcywd=$("#dist_cywd option:selected").attr('data-dimcode');

            $("#dist_wd").change(function(){
                var vals=$("#dist_wd option:selected").val();
                var valscywd=$("#dist_cywd option:selected").val();
                $("#dist_cywd").empty();
                for(var i=0;i<ss.length;i++)
                {
                    if(vals==ss[i])
                    {
                        if(vals=="全部")
                        {
                            $('#dist_cywd').append("<option data-dimcode='"+dd[i]+"'value='" +ss[i]+ "'>" +ss[i]+ "</option>");
                        }
                    }else{
                        $('#dist_cywd').append("<option data-dimcode='"+dd[i]+"'value='" +ss[i]+ "'>" +ss[i]+ "</option>");
                    }
                }
                $('#dist_cywd option[value='+valscywd+']').attr('selected',true);
            })

            $("#dist_cywd").change(function(){
                var vals=$("#dist_cywd option:selected").val();
                var valswd=$("#dist_wd option:selected").val();

                $("#dist_wd").empty();
                for(var i=0;i<ss.length;i++)
                {
                    if(vals==ss[i])
                    {
                        if(vals=="全部")
                        {
                            $('#dist_wd').append("<option data-dimcode='"+dd[i]+"'value='" +ss[i]+ "'>" +ss[i]+ "</option>");
                        }
                    }else{
                        $('#dist_wd').append("<option data-dimcode='"+dd[i]+"'value='" +ss[i]+ "'>" +ss[i]+ "</option>");
                    }
                }
                $('#dist_wd option[value='+valswd+']').attr('selected',true);
            })

            $('#order_seledatadistbtn').on('click',function(){
                var startDate=startDateSel;
                var endDate  =endDateSel;
                var distdl   =$("#dist_dl option:selected").attr('data-dimcode');
                var distwd   =$("#dist_wd option:selected").attr('data-dimcode');
                var distcywd =$("#dist_cywd option:selected").attr('data-dimcode');
                order_dataurlstatis(startDate,endDate,distdl,distwd,distcywd);
            })

            order_dataurlstatis(startDate,endDate,distdl,distwd,distcywd);

        }else{
            console.log("后台数据返回错误");
        }
    })

});