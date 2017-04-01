/**
 * 用户分析 接口
 * @type {Object|*}
 */

var express = require('express');
var router = express.Router();
var async = require('async');
var dbhelper = require('../util/mysql');
var dbhbase = require('../util/hbase');
var sql = require('../sql/userAnalysis_sql');
var newsql = require('../sql/userNOSBuyer_sql');
var mysql = require('mysql');
var server =  express();
var moment = require('moment');
server.use('/router/rest', router);





router.get('/method/register_menberdist', function(req, res, next) {
    var beginDate = req.query.begin;
    var endDate = req.query.end;
    var province=req.query.province;
    var num=req.query.num;
    var sqlreguster;
    var sqlregusterarray=[];
    if(province=="NA"){
        if(num=='one')
        {
            sqlreguster=sql.reguster_menber_dist1;
            sqlregusterarray[0]=beginDate;
            sqlregusterarray[1]=endDate;
        }else{
            sqlreguster=sql.reguster_menber_dist3;
            sqlregusterarray[0]=beginDate;
            sqlregusterarray[1]=endDate;
        }

    }else{
        if(num=='one'){
            sqlreguster=sql.reguster_menber_dist2;
            sqlregusterarray[0]=beginDate;
            sqlregusterarray[1]=endDate;
            sqlregusterarray[2]=province;
        }else{
            sqlreguster=sql.reguster_menber_dist4;
            sqlregusterarray[0]=beginDate;
            sqlregusterarray[1]=endDate;
            sqlregusterarray[2]=province;
        }

    }
    dbhelper.query(sqlreguster , sqlregusterarray,function(resp) {
        if(resp.result){
            var dailyArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var dailyData = {};
                dailyData.c1 = resp.data[i].c1;
                dailyData.cnt = resp.data[i].cnt;
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


/*
 * 注册用户统计报表接口
 */

router.get('/method/RegUserDaily/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    dbhelper.query(sql.regUserDaily, [beginDate,endDate],function(resp) {
        if(resp.result){
            var dailyArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var dailyData = [];
                dailyData[0] = resp.data[i].Reg_Dt;
                dailyData[1] = resp.data[i].Reg_Num;
                dailyData[2] = resp.data[i].Ent_Reg_Num;
                dailyData[3] = resp.data[i].Nor_Reg_Num;

                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/RegUserWeekly/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    dbhelper.query(sql.regUserWeekly, [beginDate,endDate],function(resp) {
        if(resp.result){
            var weekArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var weekData = [];
                var weeks=resp.data[i].year+''+resp.data[i].Reg_Week;
                if(resp.data[i].Reg_Week<10){
                    weeks=resp.data[i].year+'0'+resp.data[i].Reg_Week;
                }
                weekData[0] = weeks;
                weekData[1] = resp.data[i].Reg_Num;
                weekData[2] = resp.data[i].Ent_Reg_Num;
                weekData[3] = resp.data[i].Nor_Reg_Num;

                weekArray.push(weekData);
            }
            res.json({result:true,code:0,message:"data success",data:weekArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/RegUserMonthly/begintimes/:begintimes/endtimes/:endtimes', function(req, res, next) {
    var begintimes = req.params.begintimes;
    var begins=begintimes.substr(-2,2);
    begintimes= begintimes.substr(0,4)+""+begins;
    var endtimes = req.params.endtimes;
    var ends=endtimes.substr(-2,2);
    endtimes= endtimes.substr(0,4)+""+ends;

    dbhelper.query(sql.regUserMonthly, [begintimes,endtimes],function(resp) {
        if(resp.result){
            var monthArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var monthData = [];

                monthData[0] = resp.data[i].Reg_Month;
                monthData[1] = resp.data[i].Reg_Num;
                monthData[2] = resp.data[i].Ent_Reg_Num;
                monthData[3] = resp.data[i].Nor_Reg_Num;

                monthArray.push(monthData);
            }
            res.json({result:true,code:0,message:"data success",data:monthArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


router.get('/method/RegUserQuarterly/year/:year', function(req, res, next) {
    var year = req.params.year;
    var endyear = year;
    var begyear = req.params.year - 1;

    dbhelper.query(sql.regUserQuarterly, [begyear, endyear],function(resp) {
        if(resp.result){
            var quarterArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var quarterData = [];

                quarterData[0] = resp.data[i].Reg_Quarter;
                quarterData[1] = resp.data[i].Reg_Num;
                quarterData[2] = resp.data[i].Ent_Reg_Num;
                quarterData[3] = resp.data[i].Nor_Reg_Num;

                quarterArray.push(quarterData);
            }
            res.json({result:true,code:0,message:"data success",data:quarterArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/RegUserYearly/year/:year', function(req, res, next) {
    var year = req.params.year;
    var endyear = year;
    var begyear = req.params.year - 2;

    dbhelper.query(sql.regUserYearly, [begyear, endyear],function(resp) {
        if(resp.result){
            var yearArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var yearData = [];

                yearData[0] = resp.data[i].Reg_Year;
                yearData[1] = resp.data[i].Reg_Num;
                yearData[2] = resp.data[i].Ent_Reg_Num;
                yearData[3] = resp.data[i].Nor_Reg_Num;

                yearArray.push(yearData);
            }
            res.json({result:true,code:0,message:"data success",data:yearArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


/*
 * 登录用户统计报表接口
 */
router.get('/method/LoginUserDaily/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    dbhelper.query(sql.loginUserDaily, [beginDate,endDate],function(resp) {
        if(resp.result){
            var dailyArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var dailyData = [];

                dailyData[0] = resp.data[i].Login_Dt;
                dailyData[1] = resp.data[i].Usr_Cnt;
                dailyData[2] = resp.data[i].Ent_Usr_Cnt;

                dailyArray.push(dailyData);
            }

            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/LoginUserWeekly/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    var type = 'Y';

    dbhelper.query(sql.loginUserWeekly, [beginDate,endDate,beginDate,endDate,type],function(resp) {
        if(resp.result){
            var weekArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var weekData = [];
                var weekes=resp.data[i].year+''+resp.data[i].Login_Week;
                if(resp.data[i].Login_Week<10){
                    weekes=resp.data[i].year+'0'+resp.data[i].Login_Week;
                }
                weekData[0] = weekes;
                weekData[1] = resp.data[i].Usr_Cnt;
                weekData[2] = resp.data[i].Ent_Usr_Cnt;

                weekArray.push(weekData);
            }
            res.json({result:true,code:0,message:"data success",data:weekArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


router.get('/method/LoginUserMonthly/begintimes/:begintimes/endtimes/:endtimes', function(req, res, next) {
    var begintimes = req.params.begintimes;
    var begins=begintimes.substr(-2,2);
    begintimes= (begintimes.substr(0,4).toString()+begins).toString();
    var endtimes = req.params.endtimes;
    var ends=endtimes.substr(-2,2);
    endtimes= (endtimes.substr(0,4).toString()+ends).toString();
    var type = 'Y';

    dbhelper.query(sql.loginUserMonthly, [begintimes, endtimes,begintimes, endtimes, type],function(resp) {
        if(resp.result){
            var monthArray = [];
            for(var i=0;i<resp.data.length;i++ ) {
                var monthData = [];
                monthData[0] = resp.data[i].Login_Month;
                monthData[1] = resp.data[i].Usr_Cnt;
                monthData[2] = resp.data[i].Ent_Usr_Cnt;
                monthArray.push(monthData);
            }
            res.json({result:true,code:0,message:"data success",data:monthArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


router.get('/method/LoginUserQuarterly/year/:year', function(req, res, next) {
    var year = req.params.year;
    var endyear = year;
    var begyear = req.params.year - 1;
    var type = 'Y';

    dbhelper.query(sql.loginUserQuarterly, [begyear, endyear,begyear, endyear, type],function(resp) {
        if(resp.result){
            var quarterArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var quarterData = [];

                quarterData[0] = resp.data[i].Login_Quarter;
                quarterData[1] = resp.data[i].Usr_Cnt;
                quarterData[2] = resp.data[i].Ent_Usr_Cnt;

                quarterArray.push(quarterData);
            }
            res.json({result:true,code:0,message:"data success",data:quarterArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/LoginUserYearly/year/:year', function(req, res, next) {
    var year = req.params.year;
    var endyear = year;
    var begyear = req.params.year - 2;
    var type = 'Y';

    dbhelper.query(sql.loginUserYearly, [begyear, endyear,begyear, endyear, type],function(resp) {
        if(resp.result){
            var yearArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var yearData = [];

                yearData[0] = resp.data[i].Login_Year;
                yearData[1] = resp.data[i].Usr_Cnt;
                yearData[2] = resp.data[i].Ent_Usr_Cnt;

                yearArray.push(yearData);
            }
            res.json({result:true,code:0,message:"data success",data:yearArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

//活跃用户
router.get('/method/ActiveUserList', (req, res) => {
    var beginDate = mysql.escape(req.query.begin);
    var endDate = mysql.escape(req.query.end);
    var oprCnt = req.query.opr;

    var activeUserListSQL = "SELECT distinct usr_id AS UserId, usr_nm AS UserName, " +
                            "CASE WHEN TYPE='Y' THEN '企业会员' ELSE '普通会员' END Type, " +
                            "Phone AS Phone, ip AS IP " +
                            "FROM loginuser_cnt_day " +
                            "WHERE logon_dt BETWEEN " +  beginDate + " AND " + endDate +
                            " AND logon_cnt " + oprCnt;

    dbhelper.query(activeUserListSQL,function(resp) {
        if(resp.result){
            var activeUserListArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                activeUserListArray.push({
                    UserId:resp.data[i].UserId,
                    UserName:resp.data[i].UserName,
                    Type:resp.data[i].Type,
                    Phone:resp.data[i].Phone,
                    IP:resp.data[i].IP
                })
            }
            res.json(activeUserListArray);
        }
    });
});

router.get('/method/ActiveUserDaily/begin/:begin/end/:end/opr/:opr', (req, res) => {
    var beginDate = mysql.escape(req.params.begin);
    var endDate = mysql.escape(req.params.end);
    var oprCnt = req.params.opr;

    var activeUserDailySQL = "SELECT logon_dt AS Login_Dt, COUNT(usr_id) AS Usr_Cnt " +
                                "FROM (SELECT logon_dt, usr_id, sum(logon_cnt) logon_cnt FROM loginuser_cnt_day " +
                                        "WHERE logon_dt BETWEEN " + beginDate + " AND " + endDate +
                                        " GROUP BY logon_dt, usr_id) t " +
                                " WHERE logon_cnt " + oprCnt +
                                " GROUP BY Login_Dt ORDER BY Login_Dt";

    dbhelper.query(activeUserDailySQL,function(resp) {
        if(resp.result){
            var activeDailyArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var activeDailyData = [];

                activeDailyData[0] = resp.data[i].Login_Dt;
                activeDailyData[1] = resp.data[i].Usr_Cnt;

                activeDailyArray.push(activeDailyData);
            }
            res.json({result:true,code:0,message:"data success",data:activeDailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/ActiveUserWeekly/begin/:begin/end/:end/opr/:opr', (req, res) => {
    var beginDate = mysql.escape(req.params.begin);
    var endDate = mysql.escape(req.params.end);
    var oprCnt = req.params.opr;

    var activeUserWeeklySQL = "SELECT year AS year, logon_week AS Login_Week, COUNT(usr_id) AS Usr_Cnt " +
                                "FROM (SELECT YEAR(logon_dt) AS year, CASE WHEN DAYOFWEEK(CONCAT(SUBSTR(logon_dt,1,4),'-01-01'))=1 THEN WEEK(logon_dt) ELSE  WEEK(logon_dt)+1 END" +
        " As logon_week, usr_id,SUM(logon_cnt) logon_cnt " +
                                        "FROM loginuser_cnt_day " +
                                        "WHERE logon_dt BETWEEN " + beginDate + " AND " + endDate +
                                        " GROUP BY year,logon_week,usr_id) t " +
                                "WHERE logon_cnt " + oprCnt + " GROUP BY year, Login_Week ORDER BY year, Login_Week";

    dbhelper.query(activeUserWeeklySQL,function(resp) {
        if(resp.result){
            var activeWeeklyArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var activeWeeklyData = [];
                var  weeklys=resp.data[i].year+''+resp.data[i].Login_Week;
                if(resp.data[i].Login_Week<10){
                    weeklys=resp.data[i].year+'0'+resp.data[i].Login_Week;
                }
                activeWeeklyData[0] = weeklys;
                activeWeeklyData[1] = resp.data[i].Usr_Cnt;

                activeWeeklyArray.push(activeWeeklyData);
            }
            res.json({result:true,code:0,message:"data success",data:activeWeeklyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


router.get('/method/ActiveUserMonthly/begintimes/:begintimes/endtimes/:endtimes/opr/:opr', (req, res) => {
    var begintimes = req.params.begintimes;
    var begins=begintimes.substr(-2,2);
    begintimes= begintimes.substr(0,4)+""+begins;
    var endtimes = req.params.endtimes;
    var ends=endtimes.substr(-2,2);
    endtimes= endtimes.substr(0,4)+""+ends;
    var oprCnt = req.params.opr;

    var activeUserMonthlySQL = "SELECT logon_month AS Login_Month, COUNT(usr_id) AS Usr_Cnt " +
            "FROM (SELECT DATE_FORMAT(logon_dt,'%Y%m') AS logon_month, "+
                    "usr_id,SUM(logon_cnt) logon_cnt " +
                    "FROM loginuser_cnt_day " +
                    "WHERE DATE_FORMAT(logon_dt,'%Y%m') BETWEEN " + begintimes + " AND " + endtimes +
                    " GROUP BY logon_month,usr_id) t " +
            "WHERE logon_cnt " + oprCnt + " GROUP BY Login_Month " +
            "ORDER BY logon_month";

    dbhelper.query(activeUserMonthlySQL,function(resp) {
        if(resp.result){
            var activeMonthlyArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var activeMonthlyData = [];
                activeMonthlyData[0] = resp.data[i].Login_Month;
                activeMonthlyData[1] = resp.data[i].Usr_Cnt;

                activeMonthlyArray.push(activeMonthlyData);
            }

            res.json({result:true,code:0,message:"data success",data:activeMonthlyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/ActiveUserQuarterly/year/:year/opr/:opr', (req, res) => {
    var endYear = req.params.year;
    var begyear = req.params.year - 1;
    var oprCnt = req.params.opr;

    var activeUserQuarterlySQL = "SELECT logon_quarter AS Login_Quarter, COUNT(usr_id) AS Usr_Cnt " +
                                "FROM (SELECT CONCAT(CONVERT(YEAR(logon_dt),CHAR),QUARTER(logon_dt)) AS logon_quarter, "+
                                    "usr_id,SUM(logon_cnt) logon_cnt " +
                                    "FROM loginuser_cnt_day " +
                                    "WHERE YEAR(logon_dt) BETWEEN " + begyear + " AND " + endYear +
                                    " GROUP BY logon_quarter,usr_id) t " +
                                "WHERE logon_cnt " + oprCnt + " GROUP BY Login_Quarter ORDER BY Login_Quarter";

    dbhelper.query(activeUserQuarterlySQL,function(resp) {
        if(resp.result){
            var activeQuarterlyArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var activeQuarterlyData = [];

                activeQuarterlyData[0] = resp.data[i].Login_Quarter;
                activeQuarterlyData[1] = resp.data[i].Usr_Cnt;

                activeQuarterlyArray.push(activeQuarterlyData);
            }
            res.json({result:true,code:0,message:"data success",data:activeQuarterlyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/ActiveUserYearly/year/:year/opr/:opr', (req, res) => {
    var endYear = req.params.year;
    var begyear = req.params.year - 2;
    var oprCnt = req.params.opr;

    var activeUserYearlySQL = "SELECT logon_year AS Login_Year, COUNT(usr_id) AS Usr_Cnt " +
                                "FROM (SELECT YEAR(logon_dt) AS logon_year, "+
                                        "usr_id,SUM(logon_cnt) logon_cnt " +
                                        "FROM loginuser_cnt_day " +
                                        "WHERE YEAR(logon_dt) BETWEEN " + begyear + " AND " + endYear +
                                        " GROUP BY logon_year,usr_id) t " +
                                "WHERE logon_cnt " + oprCnt + " GROUP BY Login_Year ORDER BY Login_Year";

    dbhelper.query(activeUserYearlySQL,function(resp) {
        if(resp.result){
            var activeYearlyArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var activeYearlyData = [];

                activeYearlyData[0] = resp.data[i].Login_Year;
                activeYearlyData[1] = resp.data[i].Usr_Cnt;

                activeYearlyArray.push(activeYearlyData);
            }
            res.json({result:true,code:0,message:"data success",data:activeYearlyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

/*
 * 用户基本信息接口
 */
router.get('/method/UserMessage/userId/:userId', function(req, res, next) {
    var userId = req.params.userId;
    dbhbase.queryByKey("rst_ns:user_info",userId,[],[],function(resp) {
        if(resp.result=="success"){
            var rstArray = new Array(
            resp.data['info:user_nm'],resp.data['info:sex'],resp.data['info:birth_dt']
            ,resp.data['info:pro_nm'],resp.data['info:city_nm'],resp.data['info:area_cd']
            ,resp.data['info:tel_no'],resp.data['info:phone'],resp.data['info:email']
            ,resp.data['info:auth_Ind'],resp.data['info:ent_mem_Ind'],resp.data['info:register_tm']
            ,resp.data['info:register_ip'],resp.data['info:register_source'],resp.data['info:auth_method']
            ,resp.data['info:auth_account']
            );
            res.send({result:true,code:0,message:"data success",data:rstArray});
        }else {
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

/*
 * 企业会员信息接口
 */
router.get('/method/CorporateMember/userId/:userId', function(req, res, next) {
    var userId = req.params.userId;
    dbhbase.queryByKey("rst_ns:user_info_enterprise",userId,[],[],function(resp) {
    
        if(resp.result){
            var memArray = new Array(
            resp.data['info:enterprise_nm'],resp.data['info:ent_crt_tm']
            ,resp.data['info:pro_nm'],resp.data['info:city_nm'],resp.data['info:area_nm']
            ,resp.data['info:addr_dtl'],resp.data['info:website']
            );
            res.send({result:true,code:0,message:"data success",data:memArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


/*
 * 会员登录信息和下单记录接口
 */
router.get('/method/MemberLoad/userId/:userId/t/:t', function(req, res, next) {
    var userId = req.params.userId;
    var t=req.params.t;
    var surface;
    if(t==1){
       surface="rst_ns:user_login"; //会员登录
    }else{
       surface="rst_ns:user_order";  //下单记录
    }

    var grepUser = userId + ".*";
    var option = {
         filter:{"op":"EQUAL",
         "type":"RowFilter",
         "comparator":{"value":grepUser,"type":"RegexStringComparator"}
         }
    };

    dbhbase.queryByScan(surface,option,function(resp) {

        if(resp.result){
            var rstArray = [];
            function chkUnfined (value){
            if(typeof(value) == 'undefined'){
                    return "";}
                    return value;}
          if(t==1){  //会员登录信息
              for(key in resp.data) {
                  var rstData = [];
                      rstData[0] =chkUnfined(resp.data[key]['info:log_ip']);
                      rstData[1] = chkUnfined(resp.data[key]['info:log_cnt']);
                      rstData[2] = chkUnfined(resp.data[key]['info:log_tm_first']);
                      rstData[3] = chkUnfined(resp.data[key]['info:log_tm_last']);
                      rstArray.push(rstData);

              }
          } else{  //下单记录信息
                 for(key in resp.data) {
                  var rstData = [];
                      rstData[0] =chkUnfined(resp.data[key]['info:order_id']);
                      rstData[1] = chkUnfined(resp.data[key]['info:order_tm']);
                      rstData[2] = chkUnfined(resp.data[key]['info:pay_sts']);
                      rstData[3] = chkUnfined(resp.data[key]['info:pay_tm']);
                      rstData[4] = chkUnfined(resp.data[key]['info:order_sts']);
                      rstData[5] = chkUnfined(resp.data[key]['info:total_amt']);
                      rstData[6] = chkUnfined(resp.data[key]['info:fav_amt']);
                      rstData[7] = chkUnfined(resp.data[key]['info:real_amt']);
                      rstArray.push(rstData);
              }
          }         

            rstArray.reverse();
             res.send({result:true,code:0,message:"data success",data:rstArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

/*
 * 用户轨迹信息接口
 */
router.get('/method/userLookCorder/userId/:userId/t/:t', function(req, res, next) {
    var userId = req.params.userId;
    var t = req.params.t;
    var surface;
     if(t==1){// web_ns:session_all
        surface="rst_ns:user_session";
        var grepUser = userId+'.*';
     }else{
        surface="web_ns:pv_all";
        var grepUser = userId+'.*';
     } 
    var option = {
         filter:{"op":"EQUAL",
         "type":"RowFilter",
         "comparator":{"value":grepUser,"type":"RegexStringComparator"}
         }
    };

    dbhbase.queryByScan(surface,option,function(resp) {

        if(resp.result){
            var rstArray = [];
            function chkUnfined (value){
            if(typeof(value) == 'undefined'){
                    return "";}
                    return value;}
                if(t==1){
                 for(key in resp.data) {
                  var rstData = [];
                  // info:user_id,info:webuserid,info:sessionid
                      rstData[0] =chkUnfined(resp.data[key]['info:sessionid']);
                      rstData[1] = chkUnfined(resp.data[key]['info:pageview']);//Pv
                      rstData[2] = chkUnfined(resp.data[key]['info:landingpage']);//LandingPage
                      rstData[3] = chkUnfined(resp.data[key]['info:starttime ']);//StartTime
                      rstData[4] = chkUnfined(resp.data[key]['info:exitpage']);//ExitPage
                      rstData[5] = chkUnfined(resp.data[key]['info:endtime']);//EndTime
                      rstData[6] = ((resp.data[key]['info:starttime']).substring(0,10)).split("-").join('');
                      rstArray.push(rstData);
                    }      
                }else{
                     var rstData1 = [];
                  for(key in resp.data){
                    rstData1.push({
                      Id: chkUnfined(resp.data[key]['info:ip']),
                      Name: chkUnfined(resp.data[key]['info:url']),
                      Amt: chkUnfined(resp.data[key]['info:visitTime']),
                      Cnt: chkUnfined(resp.data[key]['info:sid'])
                      });
                    } 
                }
                if(rstData1 && rstData1.length){
                  res.json(rstData1);
                }else{
                  //rstArray.reverse();
                  res.send({result:true,code:0,message:"data success",data:rstArray});
                }      
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

/*
*每日新老用户占比接口
**/
router.get('/method/newOlderProportion/begin/:begin/end/:end', function(req, res){
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    dbhelper.query(newsql.newolduser, [beginDate,endDate], function(resp){
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;
            for(var i=0;i<resp.data.length;i++ ) {
                 touserNums=resp.data[i].new_cnt+ resp.data[i].old_cnt;
                 newer=resp.data[i].new_cnt;
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2),
                    'newuser':resp.data[i].new_cnt,
                    'olduser'  :resp.data[i].old_cnt,
                    'login_time':resp.data[i].login_dt
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
            });
        });
/*
 *周新老用户占比接口
 **/
router.get('/method/newOlderweek/begin/:begin/end/:end', function(req, res){
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    dbhelper.query(newsql.newolduserweekly, [beginDate,endDate], function(resp){
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;
            for(var i=0;i<resp.data.length;i++ ) {
                touserNums=resp.data[i].new_cnt+ resp.data[i].old_cnt;
                newer=resp.data[i].new_cnt;
                var weekes=resp.data[i].year+''+resp.data[i].Reg_Week;
                if(resp.data[i].Reg_Week<10){
                    weekes=resp.data[i].year+'0'+resp.data[i].Reg_Week;
                }
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2) ,
                    'newuser':resp.data[i].new_cnt,
                    'olduser'  :resp.data[i].old_cnt,
                    'login_time':weekes
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
/*
*月度新老用户占比
**/
router.get('/method/newOlderMonthly/begintimes/:begintimes/endtimes/:endtimes', function(req, res, next) {
    var begintimes = req.params.begintimes;
    var begins=begintimes.substr(-2,2);
    begintimes= begintimes.substr(0,4)+""+begins;
    var endtimes = req.params.endtimes;
    var ends=endtimes.substr(-2,2);
    endtimes= endtimes.substr(0,4)+""+ends;
    dbhelper.query(newsql.newoldusermothly, [begintimes,endtimes],function(resp) {
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;
            for(var i=0;i<resp.data.length;i++ ) {
                touserNums=resp.data[i].new_cnt+ resp.data[i].old_cnt;
                newer=resp.data[i].new_cnt;
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2) ,
                    'newuser':resp.data[i].new_cnt,
                    'olduser'  :resp.data[i].old_cnt,
                    'login_time':resp.data[i].Reg_Month
                };
                dailyArray.push(dailyData);

            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
/*
*季度新老用户占比
** newolduseryearly
 */
router.get('/method/newOlderQuarterly/year/:year', function(req, res, next) {
    var year = req.params.year;
    var endyear = year;
    var begyear = req.params.year - 1;

    dbhelper.query(newsql.newolduserjidu, [begyear, endyear],function(resp) {
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;

            for(var i=0;i<resp.data.length;i++ ) {
                touserNums=resp.data[i].new_cnt+ resp.data[i].old_cnt;
                newer=resp.data[i].new_cnt;
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2) ,
                    'newuser':resp.data[i].new_cnt,
                    'olduser'  :resp.data[i].old_cnt,
                    'login_time':resp.data[i].Reg_Quarter
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
/*
 *年度新老用户占比
 **
 */
router.get('/method/newOlderyears/year/:year', function(req, res, next) {
    var year = req.params.year;
    var endyear = year;
    var begyear = req.params.year - 2;

    dbhelper.query(newsql.newolduseryearly, [begyear, endyear],function(resp) {
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;
            for(var i=0;i<resp.data.length;i++ ) {
                touserNums=resp.data[i].new_cnt+ resp.data[i].old_cnt;
                newer=resp.data[i].new_cnt;
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2) ,
                    'newuser':resp.data[i].new_cnt,
                    'olduser'  :resp.data[i].old_cnt,
                    'login_time':resp.data[i].Reg_Year
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});



/*
 *每日供应采购商占比
 **/
router.get('/method/supplierbuyer/begin/:begin/end/:end', function(req, res){
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    dbhelper.query(newsql.supplierbuyer, [beginDate,endDate], function(resp){
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;
            for(var i=0;i<resp.data.length;i++ ) {
                touserNums=resp.data[i].nor_cnt+ resp.data[i].ent_cnt;
                newer=resp.data[i].nor_cnt;
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2) ,
                    'newuser':resp.data[i].nor_cnt,
                    'olduser'  :resp.data[i].ent_cnt,
                    'login_time':resp.data[i].login_dt
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
/*
 *周供应采购商占比
 **/
router.get('/method/supplierbuyerweekly/begin/:begin/end/:end', function(req, res){
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    dbhelper.query(newsql.supplierbuyerweekly, [beginDate,endDate], function(resp){
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;
            for(var i=0;i<resp.data.length;i++ ) {
                touserNums=resp.data[i].nor_cnt+ resp.data[i].ent_cnt;
                newer=resp.data[i].nor_cnt;
                var weeklyes=resp.data[i].year+''+resp.data[i].Reg_Week;
                if(resp.data[i].Reg_Week<10){
                    weeklyes=resp.data[i].year+'0'+resp.data[i].Reg_Week;
                }
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2) ,
                    'newuser':resp.data[i].nor_cnt,
                    'olduser'  :resp.data[i].ent_cnt,
                    'login_time':weeklyes
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
/*
 *月度供应采购商占比
 **/
router.get('/method/supplierbuyermothly/begintimes/:begintimes/endtimes/:endtimes', function(req, res, next) {
    var begintimes = req.params.begintimes;
    var begins=begintimes.substr(-2,2);
    begintimes= begintimes.substr(0,4)+""+begins;
    var endtimes = req.params.endtimes;
    var ends=endtimes.substr(-2,2);
    endtimes= endtimes.substr(0,4)+""+ends;
    dbhelper.query(newsql.supplierbuyermothly, [begintimes,endtimes],function(resp) {
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;
            for(var i=0;i<resp.data.length;i++ ) {
                touserNums=resp.data[i].nor_cnt+ resp.data[i].ent_cnt;
                newer=resp.data[i].nor_cnt;
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2) ,
                    'newuser':resp.data[i].nor_cnt,
                    'olduser'  :resp.data[i].ent_cnt,
                    'login_time':resp.data[i].Reg_Month
                };
                dailyArray.push(dailyData);

            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
/*
 *季度供应采购商占比
 ** newolduseryearly
 */
router.get('/method/supplierbuyerjidu/year/:year', function(req, res, next) {
    var year = req.params.year;
    var endyear = year;
    var begyear = req.params.year - 1;

    dbhelper.query(newsql.supplierbuyerjidu, [begyear, endyear],function(resp) {
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;

            for(var i=0;i<resp.data.length;i++ ) {
                touserNums=resp.data[i].nor_cnt + resp.data[i].ent_cnt;
                newer=resp.data[i].nor_cnt;
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2) ,
                    'newuser':resp.data[i].nor_cnt,
                    'olduser'  :resp.data[i].ent_cnt,
                    'login_time':resp.data[i].Reg_Quarter
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
/*
 *年度供应采购商占比
 **
 */
router.get('/method/supplierbuyeryearly/year/:year', function(req, res, next) {
    var year = req.params.year;
    var endyear = year;
    var begyear = req.params.year - 2;

    dbhelper.query(newsql.supplierbuyeryearly, [begyear, endyear],function(resp) {
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;
            for(var i=0;i<resp.data.length;i++ ) {
                touserNums=resp.data[i].nor_cnt+ resp.data[i].ent_cnt;
                newer=resp.data[i].nor_cnt;
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2) ,
                    'newuser':resp.data[i].nor_cnt,
                    'olduser'  :resp.data[i].ent_cnt,
                    'login_time':resp.data[i].Reg_Year
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});




/*
 * 新增/活跃用户数接口
 */

router.get('/method/UserNewActiveDaily/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    dbhelper.query(sql.userNewActiveDaily, [beginDate,endDate],function(resp) {
        if(resp.result){
            var dailyArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var dailyData = [];

                dailyData[0] = resp.data[i].Reg_Dt;
                dailyData[1] = resp.data[i].Reg_Num;
                dailyData[2] = resp.data[i].Ent_Reg_Num;
                dailyData[3] = resp.data[i].Nor_Reg_Num;

                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/UserNewActiveWeekly/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    dbhelper.query(sql.userNewActiveWeekly, [beginDate,endDate],function(resp) {
        if(resp.result){
            var weekArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var weekData = [];

                weekData[0] = resp.data[i].Reg_Week;
                weekData[1] = resp.data[i].Reg_Num;
                weekData[2] = resp.data[i].Ent_Reg_Num;
                weekData[3] = resp.data[i].Nor_Reg_Num;

                weekArray.push(weekData);
            }
            res.json({result:true,code:0,message:"data success",data:weekArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

router.get('/method/UserNewActiveMonthly/year/:year', function(req, res, next) {
    var year = req.params.year;
    var endyear = year;
    var begyear = req.params.year - 1;

    dbhelper.query(sql.userNewActiveMonthly, [endyear,endyear],function(resp) {
        if(resp.result){
            var monthArray = [];

            for(var i=0;i<resp.data.length;i++ ) {
                var monthData = [];

                monthData[0] = resp.data[i].Reg_Month;
                monthData[1] = resp.data[i].Reg_Num;
                monthData[2] = resp.data[i].Ent_Reg_Num;
                monthData[3] = resp.data[i].Nor_Reg_Num;

                monthArray.push(monthData);
            }
            res.json({result:true,code:0,message:"data success",data:monthArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


/*
* 注册会员分布省图
**/
router.get('/method/registerNumberChinaPri/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    var registersqls= "SELECT register.Province AS RegPro, SUM(register.Cnt) AS RegCnt FROM csc_anasys.user_register_area_src AS register"+
    " inner join csc_anasys.city_lng_lat t2 on register.Province = t2.pro_name and register.city = t2.city_name" +
    "  WHERE register.Reg_Dt BETWEEN" + beginDate + " AND " + endDate +
    "  AND register.Province!='NA' GROUP BY RegPro ORDER BY RegPro;"+
   " SELECT login.Province AS LoginPro, SUM(login.Cnt) AS LoginCnt FROM csc_anasys.user_login_area AS login"+
        " inner join csc_anasys.city_lng_lat t2 on login.Province = t2.pro_name and login.city = t2.city_name" +
        " WHERE login.Login_Dt BETWEEN " + beginDate + " AND " + endDate +
        " AND login.Province!='NA' GROUP BY LoginPro ORDER BY LoginPro";
        dbhelper.query(registersqls,function(resp) {
        if(resp.result){
            var proArray=[];
            var registerArray=[];
            var loginArray=[];
            for(var i=0;i<resp.data[0].length;i++ ) {

                 var registerData={
                     'registerpro':resp.data[0][i].RegPro,
                     'registercnt': resp.data[0][i].RegCnt
                 };
           
                registerArray.push(registerData);
            };

            for(var i=0;i<resp.data[1].length;i++ ) {
                 var loginData={
                         'loginpro':resp.data[1][i].LoginPro,
                         'logincnt': resp.data[1][i].LoginCnt
                     };
                     loginArray.push(loginData);
                }
                proArray=[registerArray,loginArray];
            res.json({result:true,code:0,message:"data success",data:proArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


/*
* 注册会员分布城市图
**/
router.get('/method/registerNumberChinaCity/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    var registersqls= "SELECT O.Province AS RegPro,O.City AS RegCity,sum(O.Cnt) AS RegCnt,"+
        "C.lng AS Lng,C.lat AS Lat from csc_anasys.user_register_area_src AS O "+
       " LEFT JOIN csc_anasys.city_lng_lat AS C ON O.Province=C.pro_name AND O.City=C.city_name"+
       " WHERE O.Reg_Dt BETWEEN "+beginDate+" AND "+endDate+" AND O.Province!='NA' AND O.City!='NA'"+
        "GROUP BY O.Province,O.City ORDER BY O.Province,O.City;"+
"SELECT I.Province AS LgoinPro,I.City AS LgoinCity,sum(I.Cnt) AS LoginCnt,"+
      "  C.lng AS Lng,C.lat AS Lat from csc_anasys.user_login_area AS I"+
       " LEFT JOIN csc_anasys.city_lng_lat AS C ON I.Province=C.pro_name AND I.City=C.city_name"+
       " WHERE I.Login_Dt BETWEEN "+beginDate+" AND "+endDate+" AND I.Province!='NA' AND I.City!='NA'"+
       " GROUP BY I.Province,I.City ORDER BY I.Province,I.City;"
    
     
    dbhelper.query(registersqls,function(resp) {
        if(resp.result){
            var proArray=[];
            var registerArray=[];
            var loginArray=[];
            for(var i=0;i<resp.data[0].length;i++ ) {

                 var registerData={
                     'registerpro':resp.data[0][i].RegPro,
                     'registercity':resp.data[0][i].RegCity,
                     'registercnt': resp.data[0][i].RegCnt,
                     'Lng': resp.data[0][i].Lng,
                     'Lat': resp.data[0][i].Lat
                 };
           
                registerArray.push(registerData);
            };

            for(var i=0;i<resp.data[1].length;i++ ) {
                 var loginData={
                         'loginpro':resp.data[1][i].LoginPro,
                         'logincity':resp.data[1][i].LgoinCity,
                         'logincnt': resp.data[1][i].LoginCnt,
                          'Lng': resp.data[1][i].Lng,
                          'Lat': resp.data[1][i].Lat
                     };
                     loginArray.push(loginData);
                }
                proArray=[registerArray,loginArray];
            res.json({result:true,code:0,message:"data success",data:proArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

/*
 * 注册会员渠道
 **/
router.get('/method/registerMemberChannel/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    var registersqls= "SELECT reg_src, SUM(cnt) AS src_cnt FROM csc_anasys.user_register_area_src"+
    " WHERE reg_dt BETWEEN  "+beginDate+" AND "+endDate+" GROUP BY reg_src;";
    dbhelper.query(registersqls,function(resp) {
        if(resp.result) {
            var loginArray = [];
            for (var i = 0; i < resp.data.length; i++) {
                var loginData={
                    'loginChannel':resp.data[i].reg_src,
                    'channelcnt': resp.data[i].src_cnt
                };
                loginArray.push(loginData);
            }
            res.json({result:true,code:0,message:"data success",data:loginArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
        });
});

/*
 * 会员留存
 **/
router.get('/method/memberRetention/begin/:begin', function(req, res, next) {
    var beginDate = req.params.begin;
    beginDate = mysql.escape(beginDate);
    var registersqls= "SELECT Run_Dt, Stat_Dt,Rtion_Cnt  FROM csc_anasys.user_retention"+
    " WHERE Run_Dt = "+beginDate+";";
    dbhelper.query(registersqls,function(resp) {
        if(resp.result) {
            var loginArray = [];
            for (var i = 0; i < resp.data.length; i++) {
                var loginData={
                    'xdatas':resp.data[i].Stat_Dt,
                    'totals':resp.data[0].Rtion_Cnt,
                    'plv':(resp.data[i].Rtion_Cnt/resp.data[0].Rtion_Cnt*100).toFixed(2),
                    'ycnt': resp.data[i].Rtion_Cnt
                };
                loginArray.push(loginData);
            }
            res.json({result:true,code:0,message:"data success",data:loginArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
        });
});


/*
 * 会员流失率
 **/
router.get('/method/memberDrain/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    var registersqls=" SELECT  Run_Dt AS TMDate , SUM(Total_Cnt) AS TotalUser , SUM(Loss_Cnt) AS LostUser ,SUM(Total_New_Cnt) total_new_cnt, SUM(loss_new_cnt) loss_new_cnt "+
 " FROM user_turnover AS old WHERE old.Run_Dt BETWEEN "+ beginDate +" AND "+endDate+" GROUP BY Run_Dt;"; 
    dbhelper.query(registersqls,function(resp) {
        if(resp.result) {
            var loginArray = [];
            for (var i = 0; i < resp.data.length; i++) {
                var loginData={
                    'TMDate': resp.data[i].TMDate,
                    'TotalUser':resp.data[i].TotalUser,
                    'LostUser': resp.data[i].LostUser,
                    'totalnew':resp.data[i].total_new_cnt,
                    'loster': resp.data[i].loss_new_cnt
                };
                loginArray.push(loginData);
            }

            res.json({result:true,code:0,message:"data success", data:loginArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
        });
});


/*
 * 会员流失率表格
 **/
router.get('/method/memberDrainTable/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    var registersqls=" SELECT  Run_Dt, sum(Total_Cnt) AS Total_Cnt, sum(Loss_Cnt) AS Loss_Cnt, sum(Total_New_Cnt) AS Total_New_Cnt ,sum(Loss_New_Cnt) AS Loss_New_Cnt "+
 " FROM user_turnover  WHERE Run_Dt BETWEEN "+ beginDate + " AND "+ endDate +" GROUP BY Run_Dt ORDER BY Run_Dt;";
    dbhelper.query(registersqls,function(resp) {
        if(resp.result) {
            var loginArray = [];
            for (var i = 0; i < resp.data.length; i++) {
                var timer= moment(resp.data[i].Run_Dt).format("YYYY-MM-DD");
                var loginData={
                    'Stat_Date':timer,
                    'TotalUser':resp.data[i].Total_Cnt,
                    'LostUser': resp.data[i].Loss_Cnt,
                    'TotalNewUser':resp.data[i].Total_New_Cnt,
                    'LostNewUser': resp.data[i].Loss_New_Cnt,
                    'LostRate': (resp.data[i].Loss_Cnt/resp.data[i].Total_Cnt*100).toFixed(2)+'%',
                    'LostNewRate': (resp.data[i].Loss_New_Cnt/resp.data[i].Total_New_Cnt*100).toFixed(2)+'%'
                };
                loginArray.push(loginData);
            }
            res.json({result:true,code:0,message:"data success", data:loginArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
        });
});



/*
 * 会员转化率
 **/
router.get('/method/MembershipConversion/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    var registersqls="SELECT SUM(t1.reg_num) AS reg_total,SUM(COALESCE(t2.member_cnt,0)) AS order_cnt," +
    " SUM(COALESCE(t2.member_pay_cnt,0)) AS pay_cnt FROM (SELECT reg_dt, SUM(reg_num) reg_num "+
   " FROM csc_anasys.reg_usr_cnt_day  WHERE Reg_Dt BETWEEN " + beginDate + " AND " + endDate +
   " GROUP BY reg_dt )t1 LEFT OUTER JOIN csc_anasys.user_order_transfer t2 ON t1.Reg_Dt = t2.Reg_Dt;";

    dbhelper.query(registersqls,function(resp) {
        if(resp.result) {
            var loginArray = [];
            for (var i = 0; i < resp.data.length; i++) {
                var loginData={
                    'reg_total': resp.data[i].reg_total,
                    'order_cnt':resp.data[i].order_cnt,
                    'pay_cnt': resp.data[i].pay_cnt
                };
                loginArray.push(loginData);
            }
            res.json({result:true,code:0,message:"data success", data:loginArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
        });
});

/*
 * 核心会员
 **/
router.get('/method/memberCores/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    var registersqls="SELECT member_id, pay_cnt, Pay_Amt FROM csc_anasys.user_core WHERE dat_src = 'CORE';";
    dbhelper.query(registersqls,function(resp) {
        if(resp.result) {
            var loginArray = [];
            for (var i = 0; i < resp.data.length; i++) {
                var loginData={ 
                    'core_id': '<a href="/anaweb/report/userInfo.html?userides='+resp.data[i].member_id+'">'+resp.data[i].member_id+'</a>',
                    'moneys': resp.data[i].Pay_Amt,
                    'core_cnt': resp.data[i].pay_cnt
                };
                loginArray.push(loginData);
            }
            res.json({result:true,code:0,message:"data success", data:loginArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
        });
});


/*
 * 忠诚会员
 **/
router.get('/method/memberLoyales/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    var registersqls="SELECT member_id, pay_cnt, Pay_Amt FROM csc_anasys.user_core WHERE dat_src = 'LOYALTY';";
    dbhelper.query(registersqls,function(resp) {
        if(resp.result) {
            var loginArray = [];
            for (var i = 0; i < resp.data.length; i++) {
                var loginData={
                    'loyal_id': '<a href="/anaweb/report/userInfo.html?userides='+resp.data[i].member_id+'">'+resp.data[i].member_id+'</a>',
                    'moneys1': resp.data[i].Pay_Amt,
                    'loyal_cnt': resp.data[i].pay_cnt
                };
                loginArray.push(loginData);
            }
            res.json({result:true,code:0,message:"data success", data:loginArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
        });
});

/*
 * 购买情况
 **/
router.get('/method/purchaseSituation/begin/:begin/end/:end', function(req, res, next) {
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    var registersqls="SELECT SUM(CASE WHEN (UNIX_TIMESTAMP(First_Order) - UNIX_TIMESTAMP(Reg_Dt)) <= 24*60*60 THEN 1 ELSE 0 END) AS first_day_cnt"+
    ", SUM(CASE WHEN (UNIX_TIMESTAMP(First_Order) - UNIX_TIMESTAMP(Reg_Dt)) > 24*60*60 AND (UNIX_TIMESTAMP(First_Order) - UNIX_TIMESTAMP(Reg_Dt)) <= 14*24*60*60 THEN 1 ELSE 0 END) AS two_week_cnt "+
    ",SUM(CASE WHEN (UNIX_TIMESTAMP(First_Order) - UNIX_TIMESTAMP(Reg_Dt)) > 14*24*60*60 AND (UNIX_TIMESTAMP(First_Order) - UNIX_TIMESTAMP(Reg_Dt)) <= 30*24*60*60 THEN 1 ELSE 0 END) AS one_month_cnt "+
    ",SUM(CASE  WHEN (UNIX_TIMESTAMP(First_Order) - UNIX_TIMESTAMP(Reg_Dt)) > 30*24*60*60 THEN 1 ELSE 0 END) AS gt_month_cnt, COUNT(1) AS Total FROM csc_anasys.user_order_period WHERE reg_dt BETWEEN "+
    beginDate+" AND "+endDate+";"+
    "SELECT SUM(CASE WHEN order_cnt = 1 THEN 1 ELSE 0 END) one_cnt ,SUM(CASE WHEN order_cnt = 2 THEN 1 ELSE 0 END) two_cnt,SUM(CASE WHEN order_cnt >= 3 AND order_cnt < 10 THEN 1 ELSE 0 END) three_ten_cnt "+
    ",SUM(CASE WHEN order_cnt >= 10 THEN 1 ELSE 0 END) ten_cnt, COUNT(1)  AS Totals FROM csc_anasys.user_order_period WHERE reg_dt BETWEEN "+beginDate+" AND "+endDate+";";

    dbhelper.query(registersqls,function(resp) {
        if(resp.result) {
                        var loginArray = [];
            var login1Array = [];
            var login2Array = [];
            for (var i = 0; i < resp.data[0].length; i++) {
                var total=resp.data[0][i].Total;
                var loginData={
                    'firstDay': resp.data[0][i].first_day_cnt,
                    'twoFourteenDay':resp.data[0][i].two_week_cnt,
                    'fourteenThirtyDay': resp.data[0][i].one_month_cnt,
                    'thirtyMoreDay': resp.data[0][i].gt_month_cnt,
                    'TotalCnt': total
                };
                login1Array.push(loginData);
            }
            for (var i = 0; i < resp.data[1].length; i++) {
                var totals=resp.data[1][i].Totals;
                var loginData1={
                    'firstCnt': resp.data[1][i].one_cnt,
                    'twoCnt':resp.data[1][i].two_cnt,
                    'threeTenCnt':resp.data[1][i].three_ten_cnt,
                    'tenMoreCnt':resp.data[1][i].ten_cnt,
                    'TotalsCnt': totals
                };
                login2Array.push(loginData1);
            }
            loginArray.push(login1Array);
            loginArray.push(login2Array);
            res.json({result:true,code:0,message:"data success", data:loginArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
        });
});


/*
 *首次购买会员占比
 **/
router.get('/method/beginsMembership/begin/:begin/end/:end', function(req, res){
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    var registersqls=" SELECT Order_Dt,First_Cnt,Multi_Cnt FROM user_order_cnt WHERE Order_Dt  BETWEEN " +beginDate+ " AND "+ endDate +";";

    dbhelper.query(registersqls,function(resp) {
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;
            for(var i=0;i<resp.data.length;i++ ) {
                touserNums=resp.data[i].First_Cnt+ resp.data[i].Multi_Cnt;
                newer=resp.data[i].First_Cnt;
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2),
                    'newuser':resp.data[i].First_Cnt,
                    'olduser'  :resp.data[i].Multi_Cnt,
                    'login_time':resp.data[i].Order_Dt
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

/*
 *首次购买金额占比 first purchase amount
 **/
router.get('/method/firstPurchaseAmount/begin/:begin/end/:end', function(req, res){
    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    var registersqls=" SELECT Order_Dt,First_Amt,Multi_Amt FROM user_order_cnt WHERE Order_Dt  BETWEEN " +beginDate+ " AND "+ endDate +";";

    dbhelper.query(registersqls,function(resp) {
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;
            for(var i=0;i<resp.data.length;i++ ) {
                touserNums=resp.data[i].First_Amt+ resp.data[i].Multi_Amt;
                newer=resp.data[i].First_Amt;
                var dailyData = {
                    'newolder':(newer/touserNums*100).toFixed(2),
                    'newuser':resp.data[i].First_Amt,
                    'olduser'  :resp.data[i].Multi_Amt,
                    'login_time':resp.data[i].Order_Dt
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

/*
 *
 **/
router.get('/method/couponStatistics/begin/:begin/end/:end', function(req, res){
    var beginDate = (req.params.begin).replace('-','');
    var endDate1 =req.params.end;
    if(endDate1 == "undefined"){
        endDate1 =req.params.end;
    }else{
        endDate1 = (req.params.end).replace('-','');
    }

    beginDate = mysql.escape(beginDate);
    var endDate = mysql.escape(endDate1);
    if(endDate1 == "undefined" ){
        var times1=" t1.C_DATE MONTH ,COALESCE(t2.Coupon_Amt,0) Coupon_Amt,COALESCE(t2.Order_Amt,0) Order_Amt, COALESCE(t3.f_use_cnt,0) f_use_cnt, COALESCE(t3.m_use_cnt,0) m_use_cnt";
        var wheres=" = " +beginDate;
        var greops=" ";
    }else{
        var times1="  DATE_FORMAT(t1.C_DATE,'%Y%m') MONTH ,SUM(COALESCE(t2.Coupon_Amt,0)) Coupon_Amt,SUM(COALESCE(t2.Order_Amt,0)) Order_Amt,SUM(COALESCE(t3.f_use_cnt,0)) f_use_cnt,SUM(COALESCE(t3.m_use_cnt,0)) m_use_cnt";
        var wheres="  BETWEEN "+beginDate+" AND "+ endDate;
        var greops=" GROUP BY DATE_FORMAT(t1.C_DATE,'%Y%m') ";
    }
    var registersqls=" SELECT "+times1+ " FROM csc_anasys.csc_calendar t1 LEFT OUTER JOIN `coupon_cnt_amt` t2 " +
        "ON t1.C_DATE = t2.Use_Dt LEFT OUTER JOIN coupon_order_cnt t3 ON t1.C_DATE = t3.Use_Dt WHERE DATE_FORMAT(t1.C_DATE,'%Y%m')" + wheres +greops+ " ;";
    dbhelper.query(registersqls,function(resp) {
        if(resp.result){
            var dailyArray = [];
            var touserNums=0;
            var newer=0;
            for(var i=0;i<resp.data.length;i++ ) {  ///newer/touserNums*100).toFixed(2),
                var dailyData = {
                    'dateTimes':resp.data[i].MONTH,
                    'faceValue':resp.data[i].Coupon_Amt,
                    'promoteProcurement': resp.data[i].Order_Amt,
                    'f_use_cnt': resp.data[i].f_use_cnt,
                    'm_use_cnt': resp.data[i].m_use_cnt
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


router.get('/method/member/industry/dropdownlist', function(req, res, next) {

    var dim_flg1 = 'I_IND';
    var dim_flg2 = 'D_DIM';

    var sqlParamsEntity= [];
    sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.memberDim1,[dim_flg1]));
    sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.memberDim2,[dim_flg2]));

    dbhelper.queryMultiple(sqlParamsEntity,(resp) =>{
        if(resp.result){
            res.send({ result:true,code:0,message:"data success",data:resp});
        }else{
            res.send({result:false,code:-1,message:"data fail"});
        }
    });

});


router.get('/method/member/dim/datalist/startDate/:startDate/endDate/:endDate/distdl/:distdl/distwd/:distwd/distcywd/:distcywd', function(req, res, next) {

    var startDate = req.params.startDate;
    var endDate = req.params.endDate;
    var dim1 =  req.params.distdl;
    var dim2 =  req.params.distwd;
    var dim3 =  req.params.distcywd;

    var src = function (callback) {
        var sqlParamsEntity= [];
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.memberGetCol1,[dim1]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.memberGetCol2,[dim2]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.memberGetCol3,[dim3]));

        dbhelper.queryMultiple(sqlParamsEntity,(resp) =>{
            if(resp.result){
                var dim = '';
                var grp_stat = '';
                var collist = '';
                var tbname = '';
                var sql_stat = '';

                if(resp[1].data[0].dim_1 == 'ALL' && resp[2].data[0].dim_1 == 'ALL') {
                    dim = "date_format(reg_dt,'%Y-%m-%d') as dim1_nm,";
                    grp_stat = "date_format(reg_dt,'%Y-%m-%d'),";
                }

                for(var i=1; i<3;i++) {
                    if(resp[i].data[0].dim_1 == 'ALL' || resp[i].data[0].dim_1 == undefined) {
                        dim = dim + '';
                        grp_stat = grp_stat + '';
                    } else {
                        if (resp[1].data[0].dim_1 == 'ALL') {
                            dim = dim + resp[i].data[0].dim_1 + ' as dim1,';
                        } else if (i==1) {
                            dim = dim + resp[i].data[0].dim_1 + ' as dim1,';
                        } else {
                            dim = dim + resp[i].data[0].dim_1 + ' as dim2,'
                        }
                        grp_stat = grp_stat + resp[i].data[0].dim_1 + ',';
                    }

                    if(resp[i].data[0].dim_2 == 'ALL'|| resp[i].data[0].dim_2 == undefined) {
                        dim = dim + '';
                        grp_stat = grp_stat + '';
                    } else {
                        if (resp[1].data[0].dim_2 == 'ALL') {
                            dim = dim + resp[i].data[0].dim_2 + ' as dim1_nm,';
                        } else if (i==1) {
                            dim = dim + resp[i].data[0].dim_2 + ' as dim1_nm,';
                        } else {
                            dim = dim + resp[i].data[0].dim_2 + ' as dim2_nm,'
                        }
                        grp_stat = grp_stat + resp[i].data[0].dim_2 + ',';
                    }
                }

                collist = dim + 'COUNT(*) AS mem_cnt';

                //if(dim1 == 'D_I01') {
                    tbname = "csc_anasys.user_area_cat";
                //}


                sql_stat = "select " + collist + " from " + tbname +
                " where reg_dt between " + mysql.escape(startDate) + " and " + mysql.escape(endDate) +
                " group by " + grp_stat.substring(0,grp_stat.length-1) + ";";

                callback(null, sql_stat);
            }else{
                callback(null, "");
            }
        });
    };

    var rst = function (dysql,callback) {
        dbhelper.query(dysql,function(resp) {
            if (resp.result) {
                callback(null, resp.data);
            } else {
                callback(null, "");
            }
        })
    };
    async.waterfall([src,rst], function (err, result) {
        if (err) {
            var resp = {
                result: "error",
                message: "系列查询失败"
            };
        } else {
            res.send({ result:true,code:0,message:"data success",data:result});
        }
    });
});


router.get('/method/member/dim/clickdata/startDate/:startDate/endDate/:endDate/distdl/:distdl/distwd/:distwd/distcywd/:distcywd/val1/:val1/val2/:val2', function(req, res, next) {

    var startDate = req.params.startDate;
    var endDate = req.params.endDate;
    var dim1 =  req.params.distdl;
    var dim2 =  req.params.distwd;
    var dim3 =  req.params.distcywd;
    var dim4 =  req.params.val1;
    var dim5 =  req.params.val2;

    var src = function (callback) {

        var sqlParamsEntity= [];
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.memberGetCol1,[dim1]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.memberGetCol2,[dim2]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.memberGetCol3,[dim3]));

        dbhelper.queryMultiple(sqlParamsEntity,(resp) =>{
            if(resp.result){
                var dim = '';
                var grp_stat = '';
                var collist = '';
                var tbname = '';
                var sql_stat = '';
                var andes='';

                for(var i=1; i<3;i++) {
                    if(resp[i].data[0].dim_1 == 'ALL' || resp[i].data[0].dim_1 == undefined) {
                        dim = dim + '';
                        grp_stat = grp_stat + '';
                        andes=andes+ '';
                    } else {
                        if (resp[1].data[0].dim_1 == 'ALL') {
                            dim = dim + resp[i].data[0].dim_1 + ' as dim1,';
                            andes=andes+ '';
                            if(dim5=='ALL'|| dim5 == undefined){
                                andes=andes+ '';
                            }else{
                                andes=andes+ '  AND '+resp[i].data[0].dim_1 + '= "'+dim5+'" ';
                            }

                        } else if (i==1) {
                            dim = dim + resp[i].data[0].dim_1 + ' as dim1,';
                            if(dim4=='ALL'|| dim4 == undefined){
                                andes=andes+ '';
                            }else{
                                andes=andes+ '  AND '+resp[i].data[0].dim_1 + '= "'+dim4+'" ';
                            }
                        } else {
                            dim = dim + resp[i].data[0].dim_1 + ' as dim2,';
                            if(dim5=='ALL'|| dim5 == undefined){
                                andes=andes+ '';
                            }else{
                                andes=andes+ '  AND '+resp[i].data[0].dim_1 + '= "'+dim5+'" ';
                            }
                        }
                        if(dim2=='D_D00'|| dim3=='D_D00'){
                            grp_stat = resp[i].data[0].dim_1+',';
                        }else{
                            grp_stat = grp_stat + resp[i].data[0].dim_1 + ',';
                        }
                    }
                    if(resp[i].data[0].dim_2 == 'ALL'|| resp[i].data[0].dim_2 == undefined) {
                        dim = dim + '';
                        grp_stat = grp_stat + '';
                    } else {
                        if (resp[1].data[0].dim_2 == 'ALL') {
                            dim = dim + resp[i].data[0].dim_2 + ' as dim1_nm,';
                        } else if (i==1) {
                            dim = dim + resp[i].data[0].dim_2 + ' as dim1_nm,';
                        } else {
                            dim = dim + resp[i].data[0].dim_2 + ' as dim2_nm,'
                        }
                        if(dim2=='D_D00'|| dim3=='D_D00'){
                            grp_stat ="date_format(Reg_Dt,'%Y-%m-%d'),"+grp_stat+ resp[i].data[0].dim_2  +',' ;
                        }else{
                            grp_stat = grp_stat + resp[i].data[0].dim_2 + ',';
                        }

                    }
                }

                if(dim2=='D_D00'|| dim3=='D_D00'){
                    collist = dim + " date_format(Reg_Dt,'%Y-%m-%d') as stat_dt, SUM(Cnt) as amt";
                }else{
                    if(dim4=='ALL'|| dim5=='ALL'){
                        grp_stat = grp_stat + '';
                    }else{
                        dim = dim +" date_format(Reg_Dt,'%Y-%m-%d') as stat_dt, ";
                        grp_stat ="date_format(Reg_Dt,'%Y-%m-%d'),"+grp_stat ;
                    }
                    collist = dim + 'SUM(Cnt) as amt';
                }

                tbname = "csc_anasys.user_area_cat";
                //if(dim1 == 'D_M01') {  ' + resp[0].data[0].Cnt + '
                //    tbname = "csc_anasys.orders_area_classify";
                //}
                //if(dim1 == 'D_M02') {
                //    tbname = "csc_anasys.orders_area_classify_paid";
                //
                //}
                sql_stat = "select " + collist + " from " + tbname +
                " where Reg_Dt between " + mysql.escape(startDate) + " and " + mysql.escape(endDate) + andes +
                " group by " + grp_stat.substring(0,grp_stat.length-1) + ";";

                callback(null, sql_stat);
            }else{
                callback(null, "");
            }
        });
    };

    var rst = function (dysql,callback) {
        dbhelper.query(dysql,function(resp) {
            if (resp.result) {
                callback(null, resp.data);
            } else {
                callback(null, "");
            }
        })
    };
    async.waterfall([src,rst], function (err, result) {
        if (err) {
            var resp = {
                result: "error",
                message: "系列查询失败"
            };
        } else {
            res.send({ result:true,code:0,message:"data success",data:result});
        }
    });
});

module.exports = server;
