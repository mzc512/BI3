/**
 * 浏览分析 接口
 * @type {Object|*}
 */

var express = require('express');
var router = express.Router();
var hbhelper = require('../util/hbase');
var dbhelper = require('../util/mysql');
var sql = require('../sql/traffic_sql');
var mysql = require('mysql');
var server =  express();
server.use('/router/rest', router);
var mysqlapi = require('../mysql');
var tools= require("../util/tools");
/*
 * 流量日、周、月接口
 */
router.get('/method/TrafficDaily/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    //var date1=new Date().getTime();  //开始时间
    dbhelper.query(sql.trafficDaily, [beginDate,endDate],function(resp) {
        if(resp.result){
            var dailyArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var dailyData = [];

                dailyData[0] = resp.data[i].visit_dt;
                dailyData[1] = resp.data[i].pv_num;
                dailyData[2] = resp.data[i].uv_num;
                dailyData[3] = resp.data[i].ip_num;
                dailyData[4] = resp.data[i].ssn_num;

                dailyArray.push(dailyData);
            }
            //var date2=new Date().getTime();console.log((date2-date1));
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
/*
 * 实时流量日、周、月接口
 */
router.get('/method/TrafficDailyNow/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    //加多一天
    endDate = tools.getNextDay(endDate);
    //格式化日期
    var beginDateFormat = tools.formatDay(beginDate);
    var endDateFormat = tools.formatDay(endDate);
    var option;
    option = {
        startRow:  beginDateFormat+'.*',
        endRow: endDateFormat+'.*',
        maxVersions:1
    };
    var osAllArray = new Array();
    var osAll = new Array();
    var appAllArray = new Array();
    var appAll = new Array();
    var reData = new Array();
    //var date1=new Date().getTime();
    //console.log(option);
    hbhelper.queryByScan('web_rt_ns:daily_time',option,function(resp) {
        if(resp.result == 'success') {
            //console.log(resp.data);
            var dailyArray = [];
            for(var j=0;j<resp.data.length;j++ ) {
                var dailyData = [];

                dailyData[0] = resp.data[j]["d:d"];
                dailyData[1] = resp.data[j]["d:pv"];
                dailyData[2] = resp.data[j]["d:uv"];
                dailyData[3] = resp.data[j]["d:ip"];
                dailyData[4] = resp.data[j]["d:vv"];

                dailyArray.push(dailyData);
            }
            //var date2=new Date().getTime();console.log((date2-date1));
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else {
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
router.get('/method/TrafficWeekly/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    //var date1=new Date().getTime();
    var weekArray = [];
    var reData = [];
    dbhelper.query(sql.trafficWeekly, [beginDate,endDate],function(resp) {
        if(resp.result){
            if(resp.result){
                for(var i=0;i<resp.data.length;i++ ) {
                    var weekdate = tools.getYearWeek(resp.data[i].visit_dt);
                    var keyneme = 'key'+weekdate[1];
                    if(undefined == weekArray[keyneme]){
                        weekArray[keyneme] = [];
                        weekArray[keyneme]['pv_num'] = parseInt(resp.data[i].visit_pv);
                        weekArray[keyneme]['uv_num'] = parseInt(resp.data[i].visit_uv);
                        weekArray[keyneme]['ip_num'] = parseInt(resp.data[i].visit_ip);
                        weekArray[keyneme]['ssn_num'] = parseInt(resp.data[i].visit_ssn);
                        weekArray[keyneme]['week'] = weekdate;
                        weekArray[keyneme]['date'] = [];
                        weekArray[keyneme]['date'].push(tools.stringDay(resp.data[i].visit_dt));
                    }else{
                        weekArray[keyneme]['pv_num'] += parseInt(resp.data[i].visit_pv);
                        weekArray[keyneme]['uv_num'] += parseInt(resp.data[i].visit_uv);
                        weekArray[keyneme]['ip_num'] += parseInt(resp.data[i].visit_ip);
                        weekArray[keyneme]['ssn_num'] += parseInt(resp.data[i].visit_ssn);
                        weekArray[keyneme]['date'].push(tools.stringDay(resp.data[i].visit_dt));
                    }
                }
                console.log(weekArray);
                for(var key in weekArray) {
                    var dailyData = [];
                    dailyData[0] = weekArray[key]['week'][1];
                    dailyData[1] = weekArray[key].pv_num;
                    dailyData[2] = weekArray[key].uv_num;
                    dailyData[3] = weekArray[key].ip_num;
                    dailyData[4] = weekArray[key].ssn_num;
                    dailyData[5] = weekArray[key]['week'][0];
                    dailyData[6] = weekArray[key]['week'][1];
                    reData.push(dailyData);
                }
                //console.log(reData);
                res.json({result:true,code:0,message:"data success",data:reData});
            }else{
                res.json({result:false,code:-1,message:"data fail"});
            }
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/TrafficMonthly/year/:year', function(req, res, next) {
    var year = req.params.year;
    var endyear = year;
    var begyear = req.params.year - 1;
    //var date1=new Date().getTime();
    dbhelper.query(sql.trafficMonthly, [endyear,endyear],function(resp) {
        if(resp.result){
            var monthArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var monthData = [];

                monthData[0] = resp.data[i].visit_month;
                monthData[1] = resp.data[i].pv_num;
                monthData[2] = resp.data[i].uv_num;
                monthData[3] = resp.data[i].ip_num;
                monthData[4] = resp.data[i].ssn_num;

                monthArray.push(monthData);
            }
            //var date2=new Date().getTime();console.log((date2-date1));
            res.json({result:true,code:0,message:"data success",data:monthArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

/***
 * URL访问列表统计
 */
router.get('/method/TrafficUrl', (req, res) => {
    var category = req.query.category;
    var beginDate = req.query.begin;
    var endDate = req.query.end;

    var allArray = [];
    var reData = [];
    var allSsn=0;//会话次数
    var allPV=0; //PV
    var allUV=0; // UV
    //格式化日期
    beginDate = tools.formatDay(beginDate);
    endDate = tools.formatDay(endDate);
    //var date1=new Date().getTime();
    var option;
    option = {
        batch: 5000,
        startRow:  beginDate+'*',
        endRow: endDate+'*',
        maxVersions:1
    };
    //console.log(option);
    hbhelper.queryByScan('web_ns:url_all',option,function(resp) {
        //console.log(resp);
        if(resp.result == 'success') {
            for(var j=0;j<resp.data.length;j++ ) {
                if(undefined != resp.data[j]['info:Ssn']) {
                    allSsn += parseInt(resp.data[j]['info:Ssn']);
                }
                if(undefined != resp.data[j]['info:PV']) {
                    allPV += parseInt(resp.data[j]['info:PV']);
                }
                if(undefined != resp.data[j]['info:UV']) {
                    allUV += parseInt(resp.data[j]['info:UV']);
                }
            }
            for(var j=0;j<resp.data.length;j++ ) {

                var SsnPC = 0 ;
                if (allSsn > 0){
                    SsnPC = (parseInt(resp.data[j]['info:Ssn']) / allSsn * 100).toFixed(2);
                }
                var PVPC = 0;
                if(allPV>0){
                    PVPC = (parseInt(resp.data[j]['info:PV']) / allPV * 100).toFixed(2);
                }
                var UVPC = 0;
                if(allUV>0){
                    UVPC = (parseInt(resp.data[j]['info:UV']) / allPV * 100).toFixed(2);
                }
                var ExitPC = 0;
                if(parseInt(resp.data[j]['info:PV'])>0){
                    ExitPC = (parseInt(resp.data[j]['info:Exit']) / parseInt(resp.data[j]['info:PV']) * 100).toFixed(2);
                }
                var BouncePC = 0;
                if(parseInt(resp.data[j]['info:Ssn'])>0){
                    BouncePC = (parseInt(resp.data[j]['info:Bounce']) / parseInt(resp.data[j]['info:Ssn']) * 100).toFixed(2);
                }
                var DurationPC = '-';
                if(parseInt(resp.data[j]['info:DurationCount'])>0){
                    DurationPC = tools.timeStamp(parseInt(resp.data[j]['info:Duration']) / parseInt(resp.data[j]['info:DurationCount']));
                }
                reData.push({
                    Url: resp.data[j]['info:Url'],
                    Ssn: resp.data[j]['info:Ssn'],
                    SsnPC: SsnPC + '%',
                    PV: resp.data[j]['info:PV'],
                    PVPC: resp.data[j]['info:PV']+'('+PVPC + '%)',
                    UV:resp.data[j]['info:UV'],
                    UVPC: UVPC + '%',
                    ExitPC: ExitPC + '%',
                    BouncePC: BouncePC + '%',
                    DurationPC: DurationPC
                });
            }
            //处理活动页和频道页
            if(category!='url') {
                var type = 0;
                if(category=='activity'){
                    type = 1;
                }else if(category=='channel'){
                    type = 2;
                }
                dbhelper.query(sql.trafficPage, [type],function(dbresp) {

                    if(dbresp.result){
                        if(dbresp.data.length==0){
                            res.json([]);
                        }
                        var newreData = [];
                        for(var i=0;i<dbresp.data.length;i++ ) {
                            var url  = dbresp.data[i].url;
                            var name = dbresp.data[i].name;
                            for(var k=0;k<reData.length;k++ ) {
                                if( reData[k]['Url'].indexOf(url) >= 0){
                                    newreData.push({
                                        Name : name,
                                        Url: reData[k]['Url'],
                                        Ssn: reData[k]['Ssn'],
                                        SsnPC: reData[k]['SsnPC'],
                                        PV: reData[k]['PV'],
                                        PVPC: reData[k]['PVPC'],
                                        UV: reData[k]['UV'],
                                        UVPC: reData[k]['UVPC'],
                                        ExitPC: reData[k]['ExitPC'],
                                        BouncePC: reData[k]['BouncePC'],
                                        DurationPC: reData[k]['DurationPC']
                                    });
                                }else{
                                    allSsn   = allSsn - reData[k]['Ssn'];
                                    allPV    = allPV - reData[k]['PV'];
                                    allUV    = allUV - reData[k]['UV'];
                                }
                            }
                        }
                        //var date2=new Date().getTime();console.log((date2-date1));
                        //console.log(newreData);
                        res.json(newreData);
                    }else{
                        res.json([]);
                    }
                });
            }else{
                //console.log(JSON.stringify(re));
                res.json(reData);
            }
        }else {
        }

    });
});

/***
 *来源维度统计
 */
router.get('/method/TrafficSource', (req, res) => {

    var beginDate = req.query.begin;
    var endDate = req.query.end;

    var allArray = [];
    allArray['ads'] = [];
    allArray['direct'] = [];
    allArray['link'] = [];
    allArray['other'] = [];
    allArray['se'] = [];
    var source = [];
    source['ads'] = '广告流量';
    source['direct'] = '直接访问';
    source['link'] = '推介流量';
    source['other'] = '其它';
    source['se'] = '自然搜索';
    for(var key in source) {
        allArray[key]['Times'] = 0;
        allArray[key]['PV'] = 0;
        allArray[key]['Duration'] = 0;
        allArray[key]['Bounce'] = 0;
    }
    var sourceLink = [];
    sourceLink['ads'] = '<a title="查看明细" href="/report/traffic_source_detail.html?category=ads&begin='+beginDate+'&end='+endDate+'">广告流量</a>';
    //sourceLink['direct'] = '<a title="查看明细" href="/report/traffic_source_detail.html?category=direct&begin='+beginDate+'&end='+endDate+'"">直接访问</a>';
    sourceLink['direct'] = '直接访问';
    sourceLink['link'] = '<a title="查看明细" href="/report/traffic_source_detail.html?category=link&begin='+beginDate+'&end='+endDate+'"">推介流量</a>';
    //sourceLink['other'] = '<a title="查看明细" href="/report/traffic_source_detail.html?category=other&begin='+beginDate+'&end='+endDate+'"">其它</a>';
    sourceLink['other'] = '其它';
    sourceLink['se'] = '<a title="查看明细" href="/report/traffic_source_detail.html?category=se&begin='+beginDate+'&end='+endDate+'"">自然搜索</a>';

    var reData = [];
    var allTimes=0;//访问次数
    var allTimesNoOther=0;
    var allPV=0; //PV
    var allDuration=0; //訪問時長 單位 毫秒
    var allDurationNoOther=0;
    var allBounce=0; //跳出次數
    var allBounceNoOther=0;
    //格式化日期
    beginDate = tools.formatDay(beginDate);
    endDate = tools.formatDay(endDate);
    var option;
    option = {
        //filter:{"op":"EQUAL",
        //    "type":"RowFilter",
        //    "comparator":{"value":'*.'+differDate[i]+'.-',"type":"RegexStringComparator"}
        //}
        startRow:  '-.'+beginDate+'.*',
        endRow: '-.'+endDate+'.*',
        maxVersions:1
    };
    //var date1=new Date().getTime();
    //console.log(option);
    hbhelper.queryByScan('web_ns:src_all',option,function(resp) {
        //console.log(resp);
        if(resp.result == 'success') {
            for(var j=0;j<resp.data.length;j++ ) {
                if(undefined != resp.data[j]['info:Times']) {
                    allTimes += parseInt(resp.data[j]['info:Times']);
                }
                if(undefined != resp.data[j]['info:PV']) {
                    allPV += parseInt(resp.data[j]['info:PV']);
                }
                if(undefined != resp.data[j]['info:Duration']) {
                    allDuration += parseInt(resp.data[j]['info:Duration']);
                }
                if(undefined != resp.data[j]['info:Bounce']) {
                    allBounce += parseInt(resp.data[j]['info:Bounce']);
                }
                if(resp.data[j]['info:Category']=='ads'){
                    allArray['ads']['Times'] += parseInt(resp.data[j]['info:Times']);
                    allArray['ads']['PV'] += parseInt(resp.data[j]['info:PV']);
                    allArray['ads']['Duration'] += parseInt(resp.data[j]['info:Duration']);
                    allArray['ads']['Bounce'] += parseInt(resp.data[j]['info:Bounce']);
                    allTimesNoOther +=parseInt(resp.data[j]['info:Times']);
                    allDurationNoOther += parseInt(resp.data[j]['info:Duration']);
                    allBounceNoOther +=parseInt(resp.data[j]['info:Bounce']);
                }else if(resp.data[j]['info:Category']=='direct'){
                    allArray['direct']['Times'] += parseInt(resp.data[j]['info:Times']);
                    allArray['direct']['PV'] += parseInt(resp.data[j]['info:PV']);
                    allArray['direct']['Duration'] += parseInt(resp.data[j]['info:Duration']);
                    allArray['direct']['Bounce'] += parseInt(resp.data[j]['info:Bounce']);
                    allTimesNoOther +=parseInt(resp.data[j]['info:Times']);
                    allDurationNoOther += parseInt(resp.data[j]['info:Duration']);
                    allBounceNoOther +=parseInt(resp.data[j]['info:Bounce']);
                }else if(resp.data[j]['info:Category']=='link'){
                    allArray['link']['Times'] += parseInt(resp.data[j]['info:Times']);
                    allArray['link']['PV'] += parseInt(resp.data[j]['info:PV']);
                    allArray['link']['Duration'] += parseInt(resp.data[j]['info:Duration']);
                    allArray['link']['Bounce'] += parseInt(resp.data[j]['info:Bounce']);
                    allTimesNoOther +=parseInt(resp.data[j]['info:Times']);
                    allDurationNoOther += parseInt(resp.data[j]['info:Duration']);
                    allBounceNoOther +=parseInt(resp.data[j]['info:Bounce']);
                }else if(resp.data[j]['info:Category']=='other'){
                    allArray['other']['Times'] += parseInt(resp.data[j]['info:Times']);
                    allArray['other']['PV'] += parseInt(resp.data[j]['info:PV']);
                    allArray['other']['Duration'] += parseInt(resp.data[j]['info:Duration']);
                    allArray['other']['Bounce'] += parseInt(resp.data[j]['info:Bounce']);
                }else if(resp.data[j]['info:Category']=='se'){
                    allArray['se']['Times'] += parseInt(resp.data[j]['info:Times']);
                    allArray['se']['PV'] += parseInt(resp.data[j]['info:PV']);
                    allArray['se']['Duration'] += parseInt(resp.data[j]['info:Duration']);
                    allArray['se']['Bounce'] += parseInt(resp.data[j]['info:Bounce']);
                    allTimesNoOther +=parseInt(resp.data[j]['info:Times']);
                    allDurationNoOther += parseInt(resp.data[j]['info:Duration']);
                    allBounceNoOther +=parseInt(resp.data[j]['info:Bounce']);
                }
            }

            for(var key in allArray) {
                var timesPC = 0 ;
                if (allTimes > 0){
                    timesPC = (allArray[key]['Times'] / allTimes * 100).toFixed(2);
                }
                var PVPC = 0;
                if(allPV>0){
                    PVPC = (allArray[key]['PV'] / allPV * 100).toFixed(2);
                }
                var durationPC = '-';
                if(allArray[key]['Times']>0 && key!='other'){
                    durationPC = tools.timeStamp(allArray[key]['Duration'] / allArray[key]['Times']);
                }
                var bounce = '-';
                if(allArray[key]['Times'] >0 && key!='other'){
                    bounce =  (allArray[key]['Bounce'] / allArray[key]['Times'] * 100).toFixed(2) + '%';
                }
                reData.push({
                    source: source[key],
                    sourceLink: sourceLink[key],
                    times: allArray[key]['Times'],
                    timesPC: allArray[key]['Times'] + ' (' + timesPC + '%)',
                    PV: allArray[key]['PV'],
                    PVPC: allArray[key]['PV'] + ' (' + PVPC + '%)',
                    duration:allArray[key]['Duration'],
                    durationPC: durationPC,
                    bounce:bounce
                });
            }
            var durationPCAll = '-';
            if(allTimesNoOther>0){
                durationPCAll = tools.timeStamp(allDurationNoOther / allTimesNoOther);
            }
            var bounceAll = '-';
            if(allTimesNoOther >0){
                bounceAll =  (allBounceNoOther / allTimesNoOther * 100).toFixed(2) + '%';
            }
            reData.push({
                source: '总计',
                sourceLink: '总计',
                times: allTimes,
                timesPC: allTimes,
                PV: allPV,
                PVPC: allPV,
                duration:allDurationNoOther,
                durationPC: durationPCAll,
                bounce: bounceAll
            });
            //var date2=new Date().getTime();console.log((date2-date1));
            res.json(reData);

        }else {
        }
    });
});
/***
 *实时来源维度统计
 */
router.get('/method/TrafficSourceNow', (req, res) => {
    var beginDate = req.query.begin;
    var endDate = req.query.end;
    //加多一天
    endDate = tools.getNextDay(endDate);
    //格式化日期
    var beginDateFormat = tools.formatDay(beginDate);
    var endDateFormat = tools.formatDay(endDate);
    var option;
    option = {
        startRow:  beginDateFormat+'.*',
        endRow: endDateFormat+'.*',
        maxVersions:1
    };
    var allArray = [];
    allArray['ads'] = [];
    allArray['direct'] = [];
    allArray['link'] = [];
    allArray['other'] = [];
    allArray['se'] = [];
    var source = [];
    source['ads'] = '广告流量';
    source['direct'] = '直接访问';
    source['link'] = '推介流量';
    source['other'] = '其它';
    source['se'] = '自然搜索';
    for(var key in source) {
        allArray[key]['Times'] = 0;
        allArray[key]['PV'] = 0;
        allArray[key]['Duration'] = 0;
        allArray[key]['Bounce'] = 0;
    }
    var reData = [];

    //console.log(option);
    hbhelper.queryByScan('web_rt_ns:daily_src',option,function(resp) {
        if(resp.result == 'success') {
            //console.log(resp.data);
            for(var j=0;j<resp.data.length;j++ ) {
                if(resp.data[j]['d:v']=='ads'){
                    allArray['ads']['Times'] += parseInt(resp.data[j]['d:vv']);
                    allArray['ads']['PV'] += parseInt(resp.data[j]['d:pv']);
                }else if(resp.data[j]['d:v']=='direct'){
                    allArray['direct']['Times'] += parseInt(resp.data[j]['d:vv']);
                    allArray['direct']['PV'] += parseInt(resp.data[j]['d:pv']);
                }else if(resp.data[j]['d:v']=='link'){
                    allArray['link']['Times'] += parseInt(resp.data[j]['d:vv']);
                    allArray['link']['PV'] += parseInt(resp.data[j]['d:pv']);
                }else if(resp.data[j]['d:v']=='other'){
                    allArray['other']['Times'] += parseInt(resp.data[j]['d:vv']);
                    allArray['other']['PV'] += parseInt(resp.data[j]['d:pv']);
                }else if(resp.data[j]['d:v']=='se'){
                    allArray['se']['Times'] += parseInt(resp.data[j]['d:vv']);
                    allArray['se']['PV'] += parseInt(resp.data[j]['d:pv']);
                }
            }

            for(var key in allArray) {
                reData.push({
                    source: source[key],
                    times: allArray[key]['Times'],
                    PV: allArray[key]['PV']
                });
            }
            //var date2=new Date().getTime();console.log((date2-date1));
            res.json(reData);
        }else {
            //console.log(resp.result + " : " + resp.message);
        }
    });
});
/*
*来源维度明细统计
*/
router.get('/method/TrafficSourceDetail', (req, res) => {

    var beginDate = req.query.begin;
    var endDate   = req.query.end;
    var category  = req.query.category;
    //var date1=new Date().getTime();
    var allArray = [];
    var reData = [];
    var allTimes=0;//访问次数
    var allPV=0; //PV
    var allDuration=0; //訪問時長 單位 毫秒
    var allBounce=0; //跳出次數
    //格式化日期
    beginDate = tools.formatDay(beginDate);
    endDate = tools.formatDay(endDate);
        var option;
        option = {
            batch: -1,
            startRow:  category+'.'+beginDate+'.*',
            endRow: category+'.'+endDate+'.*',
            maxVersions:1
        };
        //console.log(option);
        hbhelper.queryByScan('web_ns:src_all',option,function(resp) {

        	//console.log(resp);
            if(resp.result == 'success') {
                for(var j=0;j<resp.data.length;j++ ) {
                    if(resp.data[j]['info:SubCategory']!='-' && resp.data[j]['info:SubCategory']!=' ' && undefined!=resp.data[j]['info:SubCategory']){

                        if(undefined != resp.data[j]['info:Times']) {
                            allTimes += parseInt(resp.data[j]['info:Times']);
                        }
                        if(undefined != resp.data[j]['info:PV']) {
                            allPV += parseInt(resp.data[j]['info:PV']);
                        }
                        if(undefined != resp.data[j]['info:Duration']) {
                            allDuration += parseInt(resp.data[j]['info:Duration']);
                        }
                        if(undefined != resp.data[j]['info:Bounce']) {
                            allBounce += parseInt(resp.data[j]['info:Bounce']);
                        }
                        if(category=='link'){
                            var key = '"'+resp.data[j]['info:SubCategory']+'"';
                        }else{
                            var key = '"'+resp.data[j]['info:SubCategory'].trim()+'"';
                        }
                        if(undefined == allArray[key]){
                            allArray[key] = [];
                            allArray[key]['SubCategory'] = resp.data[j]['info:SubCategory'];
                            allArray[key]['Times'] = parseInt(resp.data[j]['info:Times']);
                            allArray[key]['PV'] = parseInt(resp.data[j]['info:PV']);
                            allArray[key]['Duration'] = parseInt(resp.data[j]['info:Duration']);
                            allArray[key]['Bounce'] = parseInt(resp.data[j]['info:Bounce']);
                        }else{
                            allArray[key]['Times'] += parseInt(resp.data[j]['info:Times']);
                            allArray[key]['PV'] += parseInt(resp.data[j]['info:PV']);
                            allArray[key]['Duration'] += parseInt(resp.data[j]['info:Duration']);
                            allArray[key]['Bounce'] += parseInt(resp.data[j]['info:Bounce']);
                        }
                    }
                }

                    //console.log(allArray);
                    for(var key in allArray) {
                        var timesPC = 0 ;
                        if (allTimes > 0){
                            timesPC = (allArray[key]['Times'] / allTimes * 100).toFixed(2);
                        }
                        var PVPC = 0;
                        if(allPV>0){
                            PVPC = (allArray[key]['PV'] / allPV * 100).toFixed(2);
                        }
                        var durationPC = '-';
                        if(allArray[key]['Times']>0 && key!='other'){
                            durationPC = tools.timeStamp(allArray[key]['Duration'] / allArray[key]['Times']);
                        }
                        var bounce = '-';
                        if(allArray[key]['Times'] >0 && key!='other'){
                            bounce =  (allArray[key]['Bounce'] / allArray[key]['Times'] * 100).toFixed(2) + '%';
                        }
                        reData.push({
                            SubCategory: allArray[key]['SubCategory'],
                            times: allArray[key]['Times'],
                            timesPC: allArray[key]['Times'] + ' (' + timesPC + '%)',
                            PV: allArray[key]['PV'],
                            PVPC: allArray[key]['PV'] + ' (' + PVPC + '%)',
                            duration:allArray[key]['Duration'],
                            durationPC: durationPC,
                            bounce:bounce
                        });
                    }
                //var date2=new Date().getTime();console.log((date2-date1));
                    //console.log(JSON.stringify(re));
                    res.json(reData);

            }else {
            }

        });

});

/***
 *系统维度统计
 */
router.get('/method/TrafficSystem', (req, res) => {

    var beginDate = req.query.begin;
    var endDate = req.query.end;
    var category = req.query.category;
    var namekey = '';
    if(category=='os'){
        namekey = 'info:OS';
    }else if(category=='hwc'){
        namekey = 'info:HwCategory';
    }else if(category=='app'){
        namekey = 'info:APP';
    }else if(category=='network'){
        namekey = 'info:NetWork';
    }
    //格式化日期
    var beginDateFormat = tools.formatDay(beginDate);
    var endDateFormat = tools.formatDay(endDate);
    var option;
    option = {
        startRow:  category+'.'+beginDateFormat+'.*',
        endRow: category+'.'+endDateFormat+'.*',
        maxVersions:1
    };
    var allArray = new Array();
    var reData = new Array();
    var allSsn = 0;
    //var date1=new Date().getTime();
    //console.log(option);
    hbhelper.queryByScan('web_ns:system_all',option,function(resp) {
        if(resp.result == 'success') {

            for(var j=0;j<resp.data.length;j++ ) {
                if(undefined != resp.data[j]['info:Ssn']) {
                    allSsn += parseInt(resp.data[j]['info:Ssn']);
                }
                var key = resp.data[j][namekey];
                if(undefined == allArray[key]){
                    allArray[key] = [];
                    allArray[key]['Name'] = resp.data[j][namekey];
                    allArray[key]['Ssn'] = parseInt(resp.data[j]['info:Ssn']);
                }else{
                    allArray[key]['Ssn'] += parseInt(resp.data[j]['info:Ssn']);
                }

            }
            //console.log(allArray);
            for(var key in allArray) {
                var ssnPC = 0 ;
                if (allSsn > 0){
                    ssnPC = (allArray[key]['Ssn'] / allSsn * 100).toFixed(2);
                }
                var Link = '其它';
                if(allArray[key]['Name']!='-'){
                    if(category=='os'){//操作系统有明细
                        if(allArray[key]['Name']=='iOS' || allArray[key]['Name']=='Android'|| allArray[key]['Name']=='Mac OS X'|| allArray[key]['Name']=='Windows'){
                            Link = '<a title="查看明细" href="/report/traffic_system_detail.html?name='+escape(allArray[key]['Name'])+'&category='+category+'&begin='+beginDate+'&end='+endDate+'"">'+allArray[key]['Name']+'</a>';
                        }else{
                            Link = allArray[key]['Name'];
                        }
                    }else if(category=='app') {//浏览器
                        Link = '<a title="查看明细" href="/report/traffic_system_detail.html?name='+escape(allArray[key]['Name'])+'&category='+category+'&begin='+beginDate+'&end='+endDate+'"">'+allArray[key]['Name']+'</a>';
                    }else{
                        Link = allArray[key]['Name'];
                    }
                }
                reData.push({
                    Name: allArray[key]['Name']=='-'?'其它':allArray[key]['Name'],
                    Link: Link,
                    Ssn: allArray[key]['Ssn'],
                    SsnPC: ssnPC + '%'
                });
            }
            reData.push({
                Name: '总计',
                Link: '总计',
                Ssn: allSsn,
                SsnPC: '-'
            });
            //var date2=new Date().getTime();console.log((date2-date1));
            //console.log(reData);
            res.json(reData);

        }else {
        }
    });
});
/***
 *系统维度明细统计
 */
router.get('/method/TrafficSystemDetail', (req, res) => {

    var beginDate = req.query.begin;
    var endDate = req.query.end;
    var category = req.query.category;
    var name  = req.query.name;
    var namekey = '';
    if(category=='os'){
        namekey = 'info:OsVersion';
    }else if(category=='hwc'){
        namekey = 'info:HwCategory';
    }else if(category=='app'){
        namekey = 'info:AppVersion';
    }else if(category=='network'){
        namekey = 'info:NetWork';
    }
    //格式化日期
    var beginDateFormat = tools.formatDay(beginDate);
    var endDateFormat = tools.formatDay(endDate);
    var option;
    option = {
        startRow:  name+'.'+category+'.'+beginDateFormat+'.*',
        endRow: name+'.'+category+'.'+endDateFormat+'.*',
        maxVersions:1
    };
    var allArray = new Array();
    var reData = new Array();
    var allSsn = 0;
    //var date1=new Date().getTime();
    //console.log(option);
    hbhelper.queryByScan('web_ns:system_all',option,function(resp) {
        //console.log(resp);
        if(resp.result == 'success') {
            for(var j=0;j<resp.data.length;j++ ) {
                if(undefined != resp.data[j]['info:Ssn']) {
                    allSsn += parseInt(resp.data[j]['info:Ssn']);
                }
                var key = resp.data[j][namekey];
                if(undefined == allArray[key]){
                    allArray[key] = [];
                    allArray[key]['Name'] = resp.data[j][namekey];
                    allArray[key]['Ssn'] = parseInt(resp.data[j]['info:Ssn']);
                }else{
                    allArray[key]['Ssn'] += parseInt(resp.data[j]['info:Ssn']);
                }
            }
            //console.log(allArray);
            for(var key in allArray) {
                var ssnPC = 0 ;
                if (allSsn > 0){
                    ssnPC = (allArray[key]['Ssn'] / allSsn * 100).toFixed(2);
                }
                reData.push({
                    Name: allArray[key]['Name']=='-'?'其它':allArray[key]['Name'],
                    Ssn: allArray[key]['Ssn'],
                    SsnPC: ssnPC + '%'
                });
            }
            //var date2=new Date().getTime();console.log((date2-date1));
            //console.log(reData);
            res.json(reData);

        }else {
        }
    });
});
/**
 * 浏览器和系统统计接口，提供给看板
 */
router.get('/method/TrafficSystemOSAPP', (req, res) => {

    var beginDate = req.query.begin;
    var endDate = req.query.end;
    //加多一天
    endDate = tools.getNextDay(endDate);
    //格式化日期
    var beginDateFormat = tools.formatDay(beginDate);
    var endDateFormat = tools.formatDay(endDate);
    var option;
    option = {
        startRow:  beginDateFormat+'.*',
        endRow: endDateFormat+'.*',
        maxVersions:1
    };
    var osAllArray = new Array();
    var osAll = new Array();
    var appAllArray = new Array();
    var appAll = new Array();
    var reData = new Array();
    //var date1=new Date().getTime();
    //console.log(option);
    hbhelper.queryByScan('web_rt_ns:daily_sys',option,function(resp) {
        if(resp.result == 'success') {
            //console.log(resp.data);
            for(var j=0;j<resp.data.length;j++ ) {
                var p = resp.data[j]["d:p"];
                var key = resp.data[j]["d:v"];
                if(p=='os'){
                    if(undefined == osAllArray[key]){
                        osAllArray[key] = [];
                        osAllArray[key]['Name'] = resp.data[j]["d:v"];
                        osAllArray[key]['Ssn'] = parseInt(resp.data[j]['d:pv']);
                    }else{
                        osAllArray[key]['Ssn'] += parseInt(resp.data[j]['d:pv']);
                    }
                }else if(p=='app'){
                    if(undefined == appAllArray[key]){
                        appAllArray[key] = [];
                        appAllArray[key]['Name'] = resp.data[j]["d:v"];
                        appAllArray[key]['Ssn'] = parseInt(resp.data[j]['d:pv']);
                    }else{
                        appAllArray[key]['Ssn'] += parseInt(resp.data[j]['d:pv']);
                    }
                }
            }
            for(var key in osAllArray) {
                if(osAllArray[key]['Name']!=''){
                    osAll.push({
                        Name: osAllArray[key]['Name']=='-'?'其它':osAllArray[key]['Name'],
                        Ssn: osAllArray[key]['Ssn'],
                    });
                }
            }
            for(var key in appAllArray) {
                if(appAllArray[key]['Name']!=''){
                    appAll.push({
                        Name: appAllArray[key]['Name']=='-'?'其它':appAllArray[key]['Name'],
                        Ssn: appAllArray[key]['Ssn'],
                    });
                }
            }
            reData.push({
                OS: osAll,
                APP: appAll
            });
            //var date2=new Date().getTime();console.log((date2-date1));
            //console.log(reData);
            res.json(reData);
        }else {

            //console.log(resp.result + " : " + resp.message);
        }
    });
});
/***
 * 关键词搜索
 */
router.get('/method/TrafficSearch', (req, res) => {

    var beginDate = req.query.begin;
    var endDate = req.query.end;
    var top = req.query.top;
    //格式化日期
    var beginDateFormat = tools.formatDay(beginDate);
    var endDateFormat = tools.formatDay(endDate);
    var option;
    option = {
        batch: 5000,
        startRow:  'external.keyword.'+beginDateFormat,
        endRow:    'external.keyword.'+endDateFormat,
        maxVersions:1
    };
    var allArray = new Array();
    var reData = new Array();
    var allTime = 0;
    //var date1=new Date().getTime();
    //console.log(option);
    hbhelper.queryByScan('web_ns:keyword_all',option,function(resp) {
        //console.log(resp.data.length);
        if(resp.result == 'success') {
            for(var i=0;i<resp.data.length;i++ ) {
                if(undefined != resp.data[i]['info:Times']) {
                    allTime += parseInt(resp.data[i]['info:Times']);
                }
                var keyneme = 'k'+escape(resp.data[i]['info:Keyword']);
                if(undefined == allArray[keyneme]){
                    allArray[keyneme] = [];
                    allArray[keyneme]['Times'] = parseInt(resp.data[i]['info:Times']);
                    allArray[keyneme]['Name'] = resp.data[i]['info:Keyword'];
                }else{
                    allArray[keyneme]['Times'] += parseInt(resp.data[i]['info:Times']);
                }
            }
            for(var key in allArray) {
                var timePC = 0 ;
                if (allTime > 0){
                    timePC = (allArray[key]['Times'] / allTime * 100).toFixed(2);
                }
                reData.push({
                    Name: allArray[key]['Name']=='-'?'其它':allArray[key]['Name'],
                    Time: allArray[key]['Times'],
                    TimePC: timePC + '%'
                });
            }
            //排序
            reData.sort(function(a,b){
                return b.Time-a.Time});
            //var date2=new Date().getTime();console.log((date2-date1));
            if(top>0){
                var item = 0;
                var topreData = new Array();
                for(var key in reData) {
                    item++;
                    if(top>=item){
                        topreData.push({
                            Name: reData[key].Name,
                            Time: reData[key].Time,
                            TimePC: reData[key].TimePC
                        });
                    }
                }
                res.json(topreData);
            }else{
                res.json(reData);
            }

        }else {
        }
    });
});
router.get('/method/trafficSearchTop', (req, res) => {

    var beginDate = req.query.begin;
    var endDate = req.query.end;
    //格式化日期
    beginDate = tools.formatDay(beginDate);
    endDate = tools.formatDay(endDate);
    var top = req.query.top?req.query.top:20;
    var reData = new Array();
    dbhelper.query(sql.trafficSearchTop, [beginDate,endDate],function(resp) {
        //console.log(resp);
        if(resp.result){
            console.log(resp.data);
            top = resp.data.length<top?resp.data.length:top;
            for(var i=0;i<top;i++ ) {
                reData.push({
                    Name: resp.data[i].keyword,
                    Time: resp.data[i].cnt_num
                });
            }
            res.json(reData);
        }else{
            res.json(reData);
        }
    });
});
/*
 * 搜索关键字top
 */
//router.get('/method/trafficSearchTop', (req, res) => {
//    var beginDate = req.query.begin;
//    var endDate = req.query.end;
//    var top = req.query.top;
//    //var date1=new Date().getTime();  //开始时间
//    dbhelper.query(sql.trafficDaily, [beginDate,endDate],function(resp) {
//        if(resp.result){
//            var dailyArray = [];
//            console.log(resp.data);
//            for(var i=0;i<resp.data.length;i++ ) {
//                var dailyData = [];
//
//                dailyData[0] = resp.data[i].visit_dt;
//                dailyData[1] = resp.data[i].pv_num;
//                dailyData[2] = resp.data[i].uv_num;
//                dailyData[3] = resp.data[i].ip_num;
//                dailyData[4] = resp.data[i].ssn_num;
//
//                dailyArray.push(dailyData);
//            }
//            //var date2=new Date().getTime();console.log((date2-date1));
//            res.json({result:true,code:0,message:"data success",data:dailyArray});
//        }else{
//            res.json({result:false,code:-1,message:"data fail"});
//        }
//    });
//});
/***
 *流量省份分布
 */
router.get('/method/SelectedProvince', (req, res) => {

    var beginDate = req.query.begin;
    var endDate = req.query.end;

    //格式化日期
    var beginDateFormat = tools.formatDay(beginDate);
    var endDateFormat = tools.formatDay(endDate);
    var option;
    option = {
        startRow:  '-.geo.'+beginDateFormat+'.*',
        endRow: '-.geo.'+endDateFormat+'.*',
        maxVersions:1
    };
    //var date1=new Date().getTime();
    var allArray = new Array();
    var reData = new Array();
    var province = new Array();
    province['甘肃省'] = '甘肃';
    province['福建省'] = '福建';
    province['上海市'] = '上海';
province['云南省'] = '云南';
province['台湾省'] = '台湾';
province['内蒙古自治区'] = '内蒙古';
province['北京市'] = '北京';
province['吉林省'] = '吉林';
province['四川省'] = '四川';
province['宁夏回族自治区'] = '宁夏';
province['安徽省'] = '安徽';
province['天津市'] = '天津';
province['山东省'] = '山东';
province['山西省'] = '山西';
province['广东省'] = '广东';
province['广西壮族自治区'] = '广西';
province['新疆维吾尔自治区'] = '新疆';
province['江苏省'] = '江苏';
province['江西省'] = '江西';
province['河南省'] = '河南';
province['河北省'] = '河北';
province['海南省'] = '海南';
province['浙江省'] = '浙江';
province['湖南省'] = '湖南';
province['湖北省'] = '湖北';
province['辽宁省'] = '辽宁';
province['贵州省'] = '贵州';
province['重庆市'] = '重庆';
province['陕西省'] = '陕西';
province['香港特别行政区'] = '香港';
province['黑龙江省'] = '黑龙江';
province['西藏自治区'] = '西藏';
province['青海省'] = '青海';
province['澳门特别行政区'] = '澳门';
    hbhelper.queryByScan('web_ns:geo_all',option,function(resp) {
        if(resp.result == 'success') {
            for(var i=0;i<resp.data.length;i++ ) {
                var keyneme = escape(resp.data[i]['info:Province']);
                if(undefined == allArray[keyneme]){
                    allArray[keyneme] = [];
                    allArray[keyneme]['Province'] = resp.data[i]['info:Province'];
                    allArray[keyneme]['Ssn'] = parseInt(resp.data[i]['info:Ssn']);
                }else{
                    allArray[keyneme]['Ssn'] += parseInt(resp.data[i]['info:Ssn']);
                }
            }
            for(var key in allArray) {
                if(allArray[key]['Province']!='-'){
                    reData.push({
                        Province: province[allArray[key]['Province']],
                        Ssn: allArray[key]['Ssn']
                    });
                }
            }
            //var date2=new Date().getTime();console.log((date2-date1));
            //console.log(reData);
            res.json(reData);
        }else {
        }
    });
});
/***
 *实时流量省份分布
 */
router.get('/method/SelectedProvinceNow', (req, res) => {

    var beginDate = req.query.begin;
    var endDate = req.query.end;
    //加多一天
    endDate = tools.getNextDay(endDate);
    //格式化日期
    var beginDateFormat = tools.formatDay(beginDate);
    var endDateFormat = tools.formatDay(endDate);
    var allArray = new Array();
    var reData = new Array();
    var province = new Array();
    province['甘肃省'] = '甘肃';
    province['福建省'] = '福建';
    province['上海市'] = '上海';
    province['云南省'] = '云南';
    province['台湾省'] = '台湾';
    province['内蒙古自治区'] = '内蒙古';
    province['北京市'] = '北京';
    province['吉林省'] = '吉林';
    province['四川省'] = '四川';
    province['宁夏回族自治区'] = '宁夏';
    province['安徽省'] = '安徽';
    province['天津市'] = '天津';
    province['山东省'] = '山东';
    province['山西省'] = '山西';
    province['广东省'] = '广东';
    province['广西壮族自治区'] = '广西';
    province['新疆维吾尔自治区'] = '新疆';
    province['江苏省'] = '江苏';
    province['江西省'] = '江西';
    province['河南省'] = '河南';
    province['河北省'] = '河北';
    province['海南省'] = '海南';
    province['浙江省'] = '浙江';
    province['湖南省'] = '湖南';
    province['湖北省'] = '湖北';
    province['辽宁省'] = '辽宁';
    province['贵州省'] = '贵州';
    province['重庆市'] = '重庆';
    province['陕西省'] = '陕西';
    province['香港特别行政区'] = '香港';
    province['黑龙江省'] = '黑龙江';
    province['西藏自治区'] = '西藏';
    province['青海省'] = '青海';
    province['澳门特别行政区'] = '澳门';
    province['-'] = '其它';
    var option;
    option = {
        startRow:  beginDateFormat+'.*',
        endRow: endDateFormat+'.*',
        maxVersions:1
    };
    //console.log(option);
    hbhelper.queryByScan('web_rt_ns:daily_geo',option,function(resp) {
        if(resp.result == 'success') {
            //console.log(resp.data);
            for(var i=0;i<resp.data.length;i++ ) {
                var keyneme = escape(resp.data[i]['d:v']);
                if(undefined == allArray[keyneme]){
                    allArray[keyneme] = [];
                    allArray[keyneme]['Province'] = resp.data[i]['d:v'];
                    allArray[keyneme]['Ssn'] = parseInt(resp.data[i]['d:vv']);
                }else{
                    allArray[keyneme]['Ssn'] += parseInt(resp.data[i]['d:vv']);
                }
            }
            for(var key in allArray) {
                if(allArray[key]['Province']!='-'){
                    reData.push({
                        Province: province[allArray[key]['Province']],
                        Ssn: allArray[key]['Ssn']
                    });
                }
            }
            //var date2=new Date().getTime();console.log((date2-date1));
            //console.log(reData);
            res.json(reData);
        }else {
        }
    });
});
/***
 *流量城市分布
 */
router.get('/method/SelectedCity', (req, res) => {
    var province = new Array();
    province['甘肃'] = '甘肃省';
    province['福建'] = '福建省';
    province['上海'] = '上海市';
    province['云南'] = '云南省';
    province['台湾'] = '台湾省';
    province['内蒙古'] = '内蒙古自治区';
    province['北京'] = '北京市';
    province['吉林'] = '吉林省';
    province['四川'] = '四川省';
    province['宁夏'] = '宁夏回族自治区';
    province['安徽'] = '安徽省';
    province['天津'] = '天津市';
    province['山东'] = '山东省';
    province['山西'] = '山西省';
    province['广东'] = '广东省';
    province['广西'] = '广西壮族自治区';
    province['新疆'] = '新疆维吾尔自治区';
    province['江苏'] = '江苏省';
    province['江西'] = '江西省';
    province['河南'] = '河南省';
    province['河北'] = '河北省';
    province['海南'] = '海南省';
    province['浙江'] = '浙江省';
    province['湖南'] = '湖南省';
    province['湖北'] = '湖北省';
    province['辽宁'] = '辽宁省';
    province['贵州'] = '贵州省';
    province['重庆'] = '重庆市';
    province['陕西'] = '陕西省';
    province['香港'] = '香港特别行政区';
    province['黑龙江'] = '黑龙江省';
    province['西藏'] = '西藏自治区';
    province['青海'] = '青海省';
    province['澳门'] = '澳门特别行政区';
    var beginDate = req.query.begin;
    var endDate = req.query.end;
    var pv = req.query.province;
    var rowKey = new Buffer(province[pv]).toString("base64");
    var allSsn = 0;
    //格式化日期
    var beginDateFormat = tools.formatDay(beginDate);
    var endDateFormat = tools.formatDay(endDate);
    var option;
    option = {
        startRow:  rowKey+'.geo.'+beginDateFormat+'',
        endRow: rowKey+'.geo.'+endDateFormat+'',
        maxVersions:1
    };
    var allArray = new Array();
    var reData = new Array();
    //console.log(option);
    hbhelper.queryByScan('web_ns:geo_all',option,function(resp) {
        //console.log(resp);
        if(resp.result == 'success') {
            for(var i=0;i<resp.data.length;i++ ) {
                if(undefined != resp.data[i]['info:Ssn']) {
                    allSsn +=  parseInt(resp.data[i]['info:Ssn']);
                }
                var keyneme = escape(resp.data[i]['info:City']);
                if(undefined == allArray[keyneme]){
                    allArray[keyneme] = [];
                    allArray[keyneme]['City'] = resp.data[i]['info:City'];
                    allArray[keyneme]['Ssn'] = parseInt(resp.data[i]['info:Ssn']);
                }else{
                    if(undefined != resp.data[i]['info:Ssn']) {
                        allArray[keyneme]['Ssn'] += parseInt(resp.data[i]['info:Ssn']);
                    }
                }
            }
            for(var key in allArray) {
                if(allArray[key]['City']!='-'){
                    var ssnPC = 0 ;
                    if (allSsn > 0){
                        ssnPC = (allArray[key]['Ssn'] / allSsn * 100).toFixed(2);
                    }
                    reData.push({
                        City: allArray[key]['City'],
                        Ssn: allArray[key]['Ssn'],
                        SsnPC:ssnPC+'%'
                    });
                }
            }
            //console.log(reData);
            res.json(reData);
        }else {
        }
    });
});
/*
 * 新增/活跃用户
 */
router.get('/method/NewActiveDaily/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    dbhelper.query(sql.newActiveDaily, [beginDate,endDate],function(resp) {
        if(resp.result){
            var dailyArray = [];
            for(var i=0;i<resp.data.length;i++ ) {
                var dailyData = [];

                dailyData[0] = resp.data[i].visit_dt;
                dailyData[1] = resp.data[i].nuv_num;
                dailyData[2] = resp.data[i].mau_num;

                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
router.get('/method/NewActiveWeekly/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    var weekArray = [];
    var reData = new Array();
    dbhelper.query(sql.newActiveWeekly, [beginDate,endDate],function(resp) {
        if(resp.result){
            for(var i=0;i<resp.data.length;i++ ) {
                var weekdate = tools.getYearWeek(resp.data[i].visit_dt);
                var keyneme = 'key'+weekdate[1];
                if(undefined == weekArray[keyneme]){
                    weekArray[keyneme] = [];
                    weekArray[keyneme]['nuv'] = parseInt(resp.data[i].visit_nuv);
                    weekArray[keyneme]['mau'] = parseInt(resp.data[i].visit_mau);
                    weekArray[keyneme]['week'] = weekdate;
                    weekArray[keyneme]['date'] = [];
                    weekArray[keyneme]['date'].push(tools.stringDay(resp.data[i].visit_dt));
                }else{
                    weekArray[keyneme]['nuv'] += parseInt(resp.data[i].visit_nuv);
                    weekArray[keyneme]['mau'] += parseInt(resp.data[i].visit_mau);
                    weekArray[keyneme]['date'].push(tools.stringDay(resp.data[i].visit_dt));
                }
            }
            console.log(weekArray);
            for(var key in weekArray) {
                var dailyData = [];
                dailyData[0] = weekArray[key]['week'][1];
                dailyData[1] =  weekArray[key].nuv;
                dailyData[2] = weekArray[key].mau;
                dailyData[3] = weekArray[key]['week'][0];//weekArray[key].date[0];
                dailyData[4] = weekArray[key]['week'][1];//weekArray[key].date[weekArray[key].date.length-1];
                reData.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:reData});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/NewActiveMonthly/begintimes/:begintimes/endtimes/:endtimes', function(req, res, next) {
    var begintimes = req.params.begintimes;
    var begins=begintimes.substr(-2,2);
    begintimes= begintimes.substr(0,4)+""+begins;
    var endtimes = req.params.endtimes;
    var ends=endtimes.substr(-2,2);
    endtimes= endtimes.substr(0,4)+""+ends;

    dbhelper.query(sql.newActiveMonthly, [begintimes,endtimes],function(resp) {
        if(resp.result){
            var monthArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var monthData = [];

                monthData[0] = resp.data[i].visit_month;
                monthData[1] = resp.data[i].nuv_num;
                monthData[2] = resp.data[i].mau_num;

                monthArray.push(monthData);
            }
            res.json({result:true,code:0,message:"data success",data:monthArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

module.exports = server;
