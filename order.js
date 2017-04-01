/***
 * order.js
 */

var express = require('express');
var moment = require('moment');
var mysql = require('mysql');
var mysqlapi = require('./mysql');

var orderApp = express();
var router = express.Router();
orderApp.use('/router/rest', router);

/**********************************************************************************************************************
 * 订单统计分析
 *
 */

/***
 * 每日订单数据
 * 5801001
 */
router.get('/method/OrderDaily/begin/:begin/end/:end', (req, res) => {

    var beginDate = req.params.begin;
    var endDate = req.params.end;

    //console.log("method=%s,beginDate=%s,endDate=%s", "OrderDaily", beginDate, endDate);

    var q = "SELECT Order_Dt AS OrderDt,sum(order_cnt) AS PayCnt,sum(order_amt) AS PayAmt FROM orders_cnt_amt " +
        "WHERE Order_Dt BETWEEN " + mysql.escape(beginDate) + " AND " + mysql.escape(endDate) + " " +
        "GROUP BY OrderDt ORDER BY OrderDt ASC;" +
        "SELECT Order_Dt AS OrderDt,sum(order_cnt) AS GmvCnt,sum(order_amt) AS GmvAmt FROM orders_cnt_amt_gmv " +
        "WHERE Order_Dt BETWEEN " + mysql.escape(beginDate) + " AND " + mysql.escape(endDate) + " " +
        "GROUP BY OrderDt ORDER BY OrderDt ASC";


    var d1 = moment(beginDate);
    //console.log("d1=%s", d1.format('YYYY-MM-DD'));

    var d2 = moment(endDate);
    //console.log("d2=%s", d2.format('YYYY-MM-DD'));

    var payArray = [];

    var d = null;

    mysqlapi.queryHandlers(
        req,
        res,
        "5801001",
        {
            sql: q
        },
        [
            (rows, fields) => {
                payArray = rows;
                //console.log("payArray.length=%d", payArray.length);
            },
            (rows, fields) => {
                var gmvArray = rows;
                //console.log("gmvArray.length=%d", gmvArray.length);

                if (payArray.length > 0) {


                    d = moment(Date.parse(payArray[0].OrderDt));
                    //console.log("d=%s", d.format('YYYY-MM-DD'));
                    if (d1.isBefore(d)) {
                        d1 = moment(d);
                    }
                }

                if (gmvArray.length > 0) {


                    d = moment(Date.parse(gmvArray[0].OrderDt));
                    //console.log("d=%s", d.format('YYYY-MM-DD'));
                    if (d1.isAfter(d)) {
                        d1 = moment(d);
                    }
                }

                var orderArray = new Array();
                var i = 0;
                var j = 0;
                while (i < payArray.length || j < gmvArray.length) {

                    var d1Text = d1.format('YYYY-MM-DD');
                    ////console.log("d1: " + d1Text);
                    var dailyData = [d1Text, 0, 0, 0, 0];
                    ////console.log(JSON.stringify(dailyData));

                    if (i < payArray.length) {
                        var d = moment(Date.parse(payArray[i].OrderDt));
                        var dText = d.format('YYYY-MM-DD');
                        //console.log("d1: %s, d: %s", d1Text, dText);
                        if (d1Text === dText) {
                            dailyData[1] = payArray[i].PayCnt;
                            dailyData[2] = payArray[i].PayAmt;
                            i++;
                        }
                    }

                    if (j < gmvArray.length) {
                        var d = moment(Date.parse(gmvArray[j].OrderDt));
                        var dText = d.format('YYYY-MM-DD');
                        //console.log("d1: %s, d: %s", d1Text, dText);
                        if (d1Text === dText) {
                            dailyData[3] = gmvArray[j].GmvCnt;
                            dailyData[4] = gmvArray[j].GmvAmt;
                            j++;
                        }
                    }

                    //console.log(JSON.stringify(dailyData));
                    orderArray.push(dailyData);

                    d1.add(1, 'd');
                }

                resp = {
                    result: "success",
                    data: orderArray
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);

            }
        ]
    );
});


/***
 * 时段订单数据
 * 5801002
 */
router.get('/method/OrderHourly/begin/:begin/end/:end', (req, res) => {

    var beginDate = req.params.begin;
    var endDate = req.params.end;

    //console.log("method=%s,beginDate=%s,endDate=%s", "OrderHourly", beginDate, endDate);

    beginDate = mysql.escape(beginDate);
    //console.log("begin date after escape: %s", beginDate);
    endDate = mysql.escape(endDate);
    //console.log("end date after escape: %s", endDate);

    var q = "SELECT Order_Hr AS OrderHr,sum(order_cnt) AS Cnt,sum(order_amt) AS Amt FROM orders_cnt_amt " +
        "WHERE Order_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY OrderHr ORDER BY OrderHr ASC;" +
        "SELECT Order_Hr AS OrderHr,sum(order_cnt) AS Cnt,sum(order_amt) AS Amt FROM orders_cnt_amt_gmv " +
        "WHERE Order_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY OrderHr ORDER BY OrderHr ASC";

    var payArray = [];

    mysqlapi.queryHandlers(
        req,
        res,
        "5801002",
        {
            sql: q
        },
        [
            (rows, fields) => {
                payArray = rows;
                //console.log("payArray.length=%d", payArray.length);
            },
            (rows, fields) => {

                gmvArray = rows;
                //console.log("gmvArray.length=%d", gmvArray.length);

                var orderArray = [];
                var i = 0;
                var j = 0;
                var h = 0;

                while (i < payArray.length || j < gmvArray.length) {

                    //console.log("hour: %d", h);

                    var hourlyData = [h / 10 < 1 ? '0' + h : '' + h, 0, 0, 0, 0];
                    //console.log(JSON.stringify(hourlyData));
                    if (i < payArray.length) {
                        //console.log("hour: %d, Pay hour: %d", h, payArray[i].OrderHr);
                        if (h == payArray[i].OrderHr) {
                            //console.log("Pay[" + i + "]" + "-" + payArray[i].OrderHr + "-" + payArray[i].Cnt + "-" + payArray[i].Amt);
                            hourlyData[1] = payArray[i].Cnt;
                            hourlyData[2] = payArray[i].Amt;
                            i++;
                        }
                    }

                    if (j < gmvArray.length) {
                        //console.log("hour: %d, GMV hour: %d", h, gmvArray[j].OrderHr);
                        if (h == gmvArray[j].OrderHr) {
                            //console.log("Gmv[" + j + "]" + "-" + gmvArray[j].OrderHr + "-" + gmvArray[j].Cnt + "-" + gmvArray[j].Amt);
                            hourlyData[3] = gmvArray[j].Cnt;
                            hourlyData[4] = gmvArray[j].Amt;
                            j++;
                        }
                    }

                    //console.log(JSON.stringify(hourlyData));
                    orderArray.push(hourlyData);
                    h++;
                }

                while (h < 24) {
                    orderArray.push([h / 10 < 1 ? '0' + h : '' + h, 0, 0, 0, 0]);
                    h++;
                }

                resp = {
                    result: "success",
                    data: orderArray
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);
            }
        ]
    );
});


/***
 * 每周订单数据
 * 5801003
 */
router.get('/method/OrderWeekly/begin/:begin/end/:end', (req, res) => {

    var beginDate = req.params.begin;
    var endDate = req.params.end;


    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
var  q = "SELECT YEAR(Order_Dt) AS year, CASE WHEN DAYOFWEEK(CONCAT(SUBSTR(Order_Dt,1,4),'-01-01'))=1 THEN WEEK(Order_Dt) ELSE  WEEK(Order_Dt)+1"+
    " END AS week,SUM(order_cnt) AS Cnt,SUM(order_amt) AS Amt FROM orders_cnt_amt WHERE Order_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY "+
    " year,week ORDER BY year,week ASC;SELECT YEAR(Order_Dt) AS year, CASE WHEN DAYOFWEEK(CONCAT(SUBSTR(Order_Dt,1,4),'-01-01'))=1 THEN WEEK(Order_Dt)"+
    " ELSE  WEEK(Order_Dt)+1 END AS week,SUM(order_cnt) AS Cnt,SUM(order_amt) AS Amt FROM orders_cnt_amt_gmv "+
    " WHERE Order_Dt BETWEEN  " + beginDate + " AND " + endDate + " GROUP BY year,week ORDER BY year,week ASC; ";



var payArray = [];

    mysqlapi.queryHandlers(
        req,
        res,
        "5801003",
        {
            sql: q
        },
        [
            (rows, fields) => {
                payArray = rows;
            },
            (rows, fields) => {
                gmvArray = rows;
                var gmvweek=[]; var playweek=[]; var weeks=[];
                var arr1 ={}; var arr2={};
                for(var a=0;a<gmvArray.length;a++){
                    var nums=0;
                    nums=gmvArray[a].year +''+gmvArray[a].week;
                    if(gmvArray[a].week<10){
                        nums=gmvArray[a].year+'0'+gmvArray[a].week;
                    }
                    arr1[nums]=gmvArray[a];
                    gmvweek.push(nums);
                }


                for(var a=0;a<payArray.length;a++){
                    var nums1=0;
                    nums1=payArray[a].year +''+payArray[a].week;
                    if(payArray[a].week<10){
                        nums1=payArray[a].year+'0'+payArray[a].week;
                    }
                    arr2[nums1]=payArray[a];
                    playweek.push(nums1);
                }
                gmvweek=gmvweek.concat(playweek);  //合并

                var temp ={},tempArr=[]; // 去重
                for(var i =0; i < gmvweek.length; i++){
                    if(!temp[gmvweek[i]]){
                        temp[gmvweek[i]] =true;
                        tempArr.push(gmvweek[i]);
                    }
                }

                gmvweek= tempArr;
                gmvweek=gmvweek.sort();       //排序

                var weekArray =[];
                for(var i= 0 ;i<gmvweek.length;i++){
                    var arr=[];
                    arr[0]=gmvweek[i]?gmvweek[i]:1;
                    arr[1]=arr2[gmvweek[i]]?arr2[gmvweek[i]].Cnt:0;
                    arr[2]=arr2[gmvweek[i]]?arr2[gmvweek[i]].Amt:0;
                    arr[3]=arr1[gmvweek[i]]?arr1[gmvweek[i]].Cnt:0;
                    arr[4]=arr1[gmvweek[i]]?arr1[gmvweek[i]].Amt:0;
                    weekArray.push(arr);
                }

                resp = {
                    result: "success",
                    data: weekArray
                };

                console.log(JSON.stringify(resp));
                res.json(resp);

            }
        ]
    );
});


/***
 * 每月订单数据
 * 5801004
 */
router.get('/method/OrderMonthly/begin/:begin/end/:end', (req, res) => {
    var begin = req.params.begin;
    var begins=begin.substr(-2,2);
   var begins= begin.substr(0,4)-1+""+begins;
    var end=req.params.end;
    var ends=end.substr(-2,2);
    end= end.substr(0,4)+""+ends;
    begin = mysql.escape(begins);
    end=mysql.escape(end);
    var q ="SELECT DATE_FORMAT(t1.C_DATE,'%Y%m') Order_Mth,SUM(COALESCE(order_cnt,0)) AS Cnt,SUM(COALESCE(order_amt,0)) AS Amt "+
        " FROM csc_anasys.csc_calendar t1 LEFT OUTER JOIN csc_anasys.orders_cnt_amt t2 ON t1.C_DATE = t2.Order_Dt WHERE DATE_FORMAT(t1.C_DATE,'%Y%m') BETWEEN " + begin + " AND " + end + "  GROUP BY DATE_FORMAT(t1.C_DATE,'%Y%m'); "+
        "SELECT DATE_FORMAT(t1.C_DATE,'%Y%m') Order_Mth,SUM(COALESCE(order_cnt,0)) AS Cnt,SUM(COALESCE(order_amt,0)) AS Amt "+
        "FROM csc_anasys.csc_calendar t1 LEFT OUTER JOIN csc_anasys.orders_cnt_amt_gmv t2 ON t1.C_DATE = t2.Order_Dt "+
        "WHERE DATE_FORMAT(t1.C_DATE,'%Y%m') BETWEEN " + begin + " AND " + end + " GROUP BY DATE_FORMAT(t1.C_DATE,'%Y%m')";

    var payArray = [];

    mysqlapi.queryHandlers(
        req,
        res,
        "5801004",
        {
            sql: q
        },
        [
            (rows, fields) => {
                payArray = rows;
                //console.log("payArray.length=%d", payArray.length);
            },

            (rows, fields) => {
                 gmvArray = rows;
                //console.log("gmvArray.length=%d", gmvArray.length);

                var monthArray = [];
                var i = 0;
                var j = 0;
                var s = 0;
                var month = 1;

                while (i < payArray.length || j < gmvArray.length) {

                    //console.log("month: %d", month);

                    var monthlyData = [month, 0, 0, 0, 0];
                    monthlyData[6] = begins;
                    //console.log(JSON.stringify(monthlyData));
                    if (i < payArray.length) {
                        //console.log("month: %d, Pay Month: %d", month, payArray[i].Month);
                        //  if (month === payArray[i].Month) {
                            //console.log("Pay[" + i + "]" + "-" + payArray[i].Month + "-" + payArray[i].Cnt + "-" + payArray[i].Amt);
                            monthlyData[5] = payArray[i].Order_Mth;
                            monthlyData[1] = payArray[i].Cnt;
                            monthlyData[2] = payArray[i].Amt;
                            i++;
                            //  }
                    }

                    if (j < gmvArray.length) {
                        //console.log("month: %d, GMV Month: %d", month, gmvArray[j].Month);
                        //if (month === gmvArray[j].Month) {
                            //console.log("Gmv[" + j + "]" + "-" + gmvArray[j].Month + "-" + gmvArray[j].Cnt + "-" + gmvArray[j].Amt);
                            monthlyData[3] = gmvArray[j].Cnt;
                            monthlyData[4] = gmvArray[j].Amt;
                            j++;
                        // }
                    }

                    //console.log(JSON.stringify(monthlyData));
                    monthArray.push(monthlyData);
                    month++;
                }

                while (month <= 12) {
                    monthArray.push([month, 0, 0, 0, 0]);
                    month++;
                }

                resp = {
                    result: "success",
                    data: monthArray
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);

            }
        ]
    );
});


/***
 * 每季度订单数据
 * 5801017
 */


//输入的是否为数组或空数组  
var nullArray = function (arr) {
    if (Array.isArray(arr)) {
        if (arr.length === 0) return false
        return true
    }
    return false;
}
//去掉重复项  
var arrayUnique = function (arr) {
    var result = [];
    var l = arr.length;
    if (nullArray(arr)) {
        for (var i = 0; i < l; i++) {
            var temp = arr.slice(i + 1, l)
            if (temp.indexOf(arr[i]) == -1) {
                result.push(arr[i]);
            } else {
                continue;
            }
        }
    }
    return result;
}
//数组排序按数字 ，也可以降序  
//flag不存在默认升序  
//flag存在降序  
var arraySortByNum = function (arr, flag) {
    if (flag) {
        return arr.sort(function (x, y) {
            return y - x
        })
    } else {
        return arr.sort(function (x, y) {
            return x - y
        })
    }
}

router.get('/method/OrderQuarterly/year/:year', (req, res) => {

    var year = req.params.year;

    //console.log("%s00000##method=%s,year=%s", "5801017", "OrderQuarterly", year);

    endyear = mysql.escape(year);
    //console.log("year after escape: %s", endyear);

    var begyear = req.params.year - 2;
    begyear = mysql.escape(begyear);
    //console.log("begin year: %s", begyear);

    var q = "SELECT CONCAT(YEAR(Order_Dt),QUARTER(Order_Dt)) AS Quarter,SUM(order_cnt) AS Cnt,SUM(order_amt) AS Amt " +
        "FROM orders_cnt_amt " +
        "WHERE YEAR(Order_Dt) BETWEEN " + begyear + " AND " + endyear +
        " GROUP BY CONCAT(YEAR(Order_Dt),QUARTER(Order_Dt)) ORDER BY CONCAT(YEAR(Order_Dt),QUARTER(Order_Dt)) ASC; " +
        "SELECT CONCAT(YEAR(Order_Dt),QUARTER(Order_Dt)) AS Quarter,SUM(order_cnt) AS Cnt,SUM(order_amt) AS Amt " +
        "FROM orders_cnt_amt_gmv " +
        "WHERE YEAR(Order_Dt) BETWEEN " + begyear + " AND " + endyear +
        " GROUP BY CONCAT(YEAR(Order_Dt),QUARTER(Order_Dt)) ORDER BY CONCAT(YEAR(Order_Dt),QUARTER(Order_Dt)) ASC";

    var payArray = [];

    mysqlapi.queryHandlers(
        req,
        res,
        "5801017",
        {
            sql: q
        },
        [
            (rows, fields) => {
                payArray = rows;
                //console.log("payArray.length=%d", payArray.length);
            },
            (rows, fields) => {
                gmvArray = rows;
                //console.log("gmvArray.length=%d", gmvArray.length);


                //取两年内有数据的季度
                var qrtArray = [];
                var qrtSortArray = [];
                for (var i = 0; i < payArray.length; i++) {
                    qrtArray.push(payArray[i].Quarter.toString());
                }
                for (var i = 0; i < gmvArray.length; i++) {
                    qrtArray.push(gmvArray[i].Quarter.toString());
                }

                qrtSortArray = arrayUnique(qrtArray).sort();
                //console.log("qrtSortArray.length: %s", qrtSortArray.length);

                var quarterArray = [];
                var i = 0;

                while (i < qrtSortArray.length) {
                    //console.log("quarter: %s", qrtSortArray[i]);
                    var quarterData = [qrtSortArray[i], 0, 0, 0, 0];

                    for (var j = 0; j < payArray.length; j++) {
                        if (qrtSortArray[i] === payArray[j].Quarter.toString()) {
                            //console.log("QuarterData:" + qrtSortArray[i] + "-" + payArray[j].Cnt + "-" + payArray[j].Amt);
                            quarterData[1] = payArray[j].Cnt;
                            quarterData[2] = payArray[j].Amt;
                        }
                    }

                    for (var j = 0; j < gmvArray.length; j++) {
                        if (qrtSortArray[i] === gmvArray[j].Quarter.toString()) {
                            //console.log("QuarterData:" + qrtSortArray[i] + "-" + gmvArray[j].Cnt + "-" + gmvArray[j].Amt);
                            quarterData[3] = gmvArray[j].Cnt;
                            quarterData[4] = gmvArray[j].Amt;
                        }
                    }
                    i++;

                    //console.log(JSON.stringify(quarterData));
                    quarterArray.push(quarterData);
                }

                resp = {
                    result: "success",
                    data: quarterArray
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);

            }
        ]
    );
});


/***
 * 每年订单数据
 * 5801018
 */
router.get('/method/OrderYearly/year/:year', (req, res) => {

    var year = req.params.year;

    //console.log("%s00000##method=%s,year=%s", "5801018", "OrderYearly", year);

    endyear = mysql.escape(year);
    //console.log("year after escape: %s", endyear);

    var begyear = req.params.year - 2;
    begyear = mysql.escape(begyear);
    //console.log("begin year: %s", begyear);

    var q = "SELECT YEAR(Order_Dt) AS Year,SUM(order_cnt) AS Cnt,SUM(order_amt) AS Amt " +
        "FROM orders_cnt_amt " +
        "WHERE YEAR(Order_Dt) BETWEEN " + begyear + " AND " + endyear +
        " GROUP BY YEAR(Order_Dt) ORDER BY YEAR(Order_Dt) ASC; " +
        "SELECT YEAR(Order_Dt) AS Year,SUM(order_cnt) AS Cnt,SUM(order_amt) AS Amt " +
        "FROM orders_cnt_amt_gmv " +
        "WHERE YEAR(Order_Dt) BETWEEN " + begyear + " AND " + endyear +
        " GROUP BY YEAR(Order_Dt) ORDER BY YEAR(Order_Dt) ASC";

    var payArray = [];

    mysqlapi.queryHandlers(
        req,
        res,
        "5801018",
        {
            sql: q
        },
        [
            (rows, fields) => {
                payArray = rows;
                //console.log("payArray.length=%d", payArray.length);
            },
            (rows, fields) => {
                gmvArray = rows;
                //console.log("gmvArray.length=%d", gmvArray.length);


                //统计3年
                var yrArray = [];

                for (var i = 0; i < 3; i++) {
                    yrArray.push((parseInt(begyear) + i).toString());
                }

                var yearlyArray = [];
                var i = 0;

                while (i < yrArray.length) {
                    //console.log("year: %s", yrArray[i]);
                    var yearlyData = [yrArray[i], 0, 0, 0, 0];

                    for (var j = 0; j < payArray.length; j++) {
                        if (yrArray[i] === payArray[j].Year.toString()) {
                            //console.log("yearlyData:" + yrArray[i] + "-" + payArray[j].Cnt + "-" + payArray[j].Amt);
                            yearlyData[1] = payArray[j].Cnt;
                            yearlyData[2] = payArray[j].Amt;
                        }
                    }

                    for (var j = 0; j < gmvArray.length; j++) {
                        if (yrArray[i] === gmvArray[j].Year.toString()) {
                            //console.log("yearlyData:" + yrArray[i] + "-" + gmvArray[j].Cnt + "-" + gmvArray[j].Amt);
                            yearlyData[3] = gmvArray[j].Cnt;
                            yearlyData[4] = gmvArray[j].Amt;
                        }
                    }
                    i++;

                    //console.log(JSON.stringify(yearlyData));
                    yearlyArray.push(yearlyData);
                }

                resp = {
                    result: "success",
                    data: yearlyArray
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);

            }
        ]
    );
});


/***
 * 支付类型统计
 * 5801005
 */
router.get('/method/OrderPayType/begin/:begin/end/:end', (req, res) => {

    var beginDate = req.params.begin;
    var endDate = req.params.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801005", "PayType", beginDate, endDate);

    beginDate = mysql.escape(beginDate);
    //console.log("begin date after escape: %s", beginDate);
    endDate = mysql.escape(endDate);
    //console.log("end date after escape: %s", endDate);

    mysqlapi.queryHandler(
        req,
        res,
        "5801005",
        "SELECT Pay_Type AS PayType,sum(Orders_Cnt) AS Cnt,sum(Orders_Amt) AS Amt FROM orders_pay_amt " +
        "WHERE Pay_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY Pay_Type ORDER BY Pay_Type ASC",
        (rows, fields) => {

            var PayType = new Array('微信', '财付通', '支付宝', 'e卡通', '银行卡', '钱包', '优惠券');
            var typeArray = new Array();

            for (r in rows) {
                //console.log('[' + r + '] ' + rows[r].PayType + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                typeArray.push(new Array(PayType[rows[r].PayType - 1], rows[r].Cnt, rows[r].Amt));
            }

            resp = {
                result: "success",
                data: typeArray
            };

            //console.log(JSON.stringify(resp));
            res.json(resp);
        }
    );
});


/***
 * 订单城市维度统计
 * 5801006
 */
router.get('/method/OrderCity/begin/:begin/end/:end', (req, res) => {

    var beginDate = req.params.begin;
    var endDate = req.params.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801006", "OrderCity", beginDate, endDate);

    beginDate = mysql.escape(beginDate);
    //console.log("begin date after escape: %s", beginDate);
    endDate = mysql.escape(endDate);
    //console.log("end date after escape: %s", endDate);

    var sellerArray = new Array();
    var q = "SELECT O.Ship_Adr_Pro AS ShipPro,O.Ship_Adr_City AS ShipCity,sum(O.Orders_Cnt) AS Cnt," +
        "sum(O.Orders_Amt) AS Amt,C.lng AS Lng,C.lat AS Lat from orders_address_amt AS O " +
        "LEFT JOIN city_lng_lat AS C ON O.Ship_Adr_Pro=C.pro_name AND O.Ship_Adr_City=C.city_name " +
        "WHERE O.Pay_Dt BETWEEN " + beginDate + " AND " + endDate + " " +
        "GROUP BY O.Ship_Adr_Pro,O.Ship_Adr_City ORDER BY O.Ship_Adr_Pro,O.Ship_Adr_City;" +
        "SELECT O.Devy_Adr_Pro AS DeliveryPro,O.Devy_Adr_City AS DeliveryCity,sum(O.Orders_Cnt) AS Cnt," +
        "sum(O.Orders_Amt) AS Amt,C.lng AS Lng,C.lat AS Lat from orders_address_amt AS O " +
        "LEFT JOIN city_lng_lat AS C ON O.Devy_Adr_Pro=C.pro_name AND O.Devy_Adr_City=C.city_name " +
        "WHERE O.Pay_Dt BETWEEN " + beginDate + " AND " + endDate + " " +
        "GROUP BY O.Devy_Adr_Pro,O.Devy_Adr_City ORDER BY O.Devy_Adr_Pro,O.Devy_Adr_City";

    mysqlapi.queryHandlers(
        req,
        res,
        "5801006",
        {
            sql: q
        },
        new Array(
            (rows, fields) => {
                for (r in rows) {
                    //console.log('[' + r + '] ' + rows[r].ShipPro + ' - ' + rows[r].ShipCity + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    sellerArray.push(new Array(rows[r].ShipPro, rows[r].ShipCity, rows[r].Cnt, rows[r].Amt, rows[r].Lng, rows[r].Lat));
                }
            },
            (rows, fields) => {
                var buyerArray = new Array();
                for (r in rows) {
                    //console.log('[' + r + '] ' + rows[r].DeliveryPro + ' - ' + rows[r].DeliveryCity + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    buyerArray.push(new Array(rows[r].DeliveryPro, rows[r].DeliveryCity, rows[r].Cnt, rows[r].Amt, rows[r].Lng, rows[r].Lat));
                }

                resp = {
                    result: "success",
                    data: {
                        shipCities: sellerArray,
                        deliveryCities: buyerArray
                    }
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);
            }
        )
    );
});


/***
 * 订单省份维度统计
 * 5801019
 */
router.get('/method/OrderProvince/begin/:begin/end/:end', (req, res) => {

    var beginDate = req.params.begin;
    var endDate = req.params.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801019", "OrderProvince", beginDate, endDate);

    beginDate = mysql.escape(beginDate);
    //console.log("begin date after escape: %s", beginDate);
    endDate = mysql.escape(endDate);
    //console.log("end date after escape: %s", endDate);

    var sellerArray = new Array();
    var q = "SELECT Ship_Adr_Pro AS ShipPro, SUM(Orders_Cnt) AS Cnt, SUM(Orders_Amt) AS Amt " +
        "FROM orders_address_amt " +
        "WHERE Pay_Dt BETWEEN " + beginDate + " AND " + endDate +
        " GROUP BY Ship_Adr_Pro ORDER BY Ship_Adr_Pro;" +
        "SELECT Devy_Adr_Pro AS DeliveryPro, SUM(Orders_Cnt) AS Cnt, SUM(Orders_Amt) AS Amt " +
        "FROM orders_address_amt " +
        "WHERE Pay_Dt BETWEEN " + beginDate + " AND " + endDate +
        " GROUP BY Devy_Adr_Pro ORDER BY Devy_Adr_Pro";

    mysqlapi.queryHandlers(
        req,
        res,
        "5801019",
        {
            sql: q
        },
        new Array(
            (rows, fields) => {
                for (r in rows) {
                    //console.log('[' + r + '] ' + rows[r].ShipPro + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    sellerArray.push(new Array(rows[r].ShipPro, rows[r].Cnt, rows[r].Amt));
                }
            },
            (rows, fields) => {
                var buyerArray = new Array();
                for (r in rows) {
                    //console.log('[' + r + '] ' + rows[r].DeliveryPro + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    buyerArray.push(new Array(rows[r].DeliveryPro, rows[r].Cnt, rows[r].Amt));
                }

                resp = {
                    result: "success",
                    data: {
                        shipPro: sellerArray,
                        deliveryPro: buyerArray
                    }
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);
            }
        )
    );
});


/***
 * 订单支付时长统计
 * 5801007
 */
router.get('/method/OrderTakenTime/begin/:begin/end/:end', (req, res) => {

    var beginDate = req.params.begin;
    var endDate = req.params.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801007", "OrderTakenTime", beginDate, endDate);

    queryHandler(
        req,
        res,
        "5801007",
        "SELECT Pay_Tm_Range AS Rng,sum(Orders_Cnt) AS Cnt,sum(Orders_Amt) AS Amt FROM orders_paytm_range WHERE Pay_Dt BETWEEN '" + beginDate + "' AND '" + endDate + "' GROUP BY Pay_Tm_Range ORDER BY Pay_Tm_Range ASC",
        (rows, fields) => {
            var rangeArray = new Array();

            for (r in rows) {
                //console.log('[' + r + '] ' + rows[r].Rng + ' - ' + rows[r].Cnt + '-' + rows[r].Amt);
                rangeArray.push(new Array(rows[r].Rng, rows[r].Cnt, rows[r].Amt));
            }

            resp = {
                result: "success",
                data: rangeArray
            };

            //console.log(JSON.stringify(resp));
            res.json(resp);
        }
    );
});


/***
 * 订单金额分布统计
 * 5801008
 */
router.get('/method/OrderAmoutRange/begin/:begin/end/:end', (req, res) => {

    var beginDate = req.params.begin;
    var endDate = req.params.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801008", "OrderAmoutRange", beginDate, endDate);

    queryHandler(
        req,
        res,
        "5801008",
        "SELECT Amt_Range AS Rng,sum(Orders_Cnt) AS Cnt,sum(Orders_Amt) AS Amt FROM orders_amt_range " +
        "WHERE Pay_Dt BETWEEN '" + beginDate + "' AND '" + endDate + "' GROUP BY Amt_Range ORDER BY Amt_Range ASC",
        (rows, fields) => {
            var rangeArray = new Array();

            for (r in rows) {
                //console.log('[' + r + '] ' + rows[r].Rng + ' - ' + rows[r].Cnt + '-' + rows[r].Amt);
                rangeArray.push(new Array(rows[r].Rng, rows[r].Cnt, rows[r].Amt));
            }

            resp = {
                result: "success",
                data: rangeArray
            };

            //console.log(JSON.stringify(resp));
            res.json(resp);
        }
    );
});


/***
 * 订单金额和支付时长数据
 * 5801009
 */
router.get('/method/OrderPaymentAndDuration/begin/:begin/end/:end', (req, res) => {

    var beginDate = req.params.begin;
    var endDate = req.params.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801009", "OrderPaymentAndDuration", beginDate, endDate);

    beginDate = mysql.escape(beginDate);
    //console.log("begin date after escape: %s", beginDate);
    endDate = mysql.escape(endDate);
    //console.log("end date after escape: %s", endDate);

    var q = "SELECT Pay_Dur AS Dur, Pay_Amt AS Amt,Order_ID AS OrderId,Pay_Dt AS PayDt  FROM orders_pay_dur_amt " +
        "WHERE Pay_Dt BETWEEN " + beginDate + " AND " + endDate +
        " ORDER BY Pay_Dt ASC";

    mysqlapi.queryHandler(
        req,
        res,
        "5801009",
        q,
        (rows, fields) => {
            var started = false;
            var amtAndDurArray = [];
            for (r in rows) {
                //console.log('[' + r + '] ' + rows[r].Dur + ' - ' + rows[r].Amt);
                amtAndDurArray.push(new Array(rows[r].Amt, rows[r].Dur, rows[r].OrderId, moment(rows[r].PayDt).format('YYYY-MM-DD')));
            }

            resp = {
                result: "success",
                data: amtAndDurArray
            };

            //console.log(JSON.stringify(resp));
            res.json(resp);

        }
    );
});


/***
 * 订单卖家、买家分布
 * 5801010
 */
router.get('/method/OrderSellerBuyer/begin/:begin/end/:end', (req, res) => {

    var beginDate = req.params.begin;
    var endDate = req.params.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801010", "OrderSellerBuyer", beginDate, endDate);

    beginDate = mysql.escape(beginDate);
    //console.log("begin date after escape: %s", beginDate);
    endDate = mysql.escape(endDate);
    //console.log("end date after escape: %s", endDate);

    var sellerArray = new Array();
    var buyerArray = new Array();
    var q = "SELECT Sel_Id AS SId,Sel_Nm AS SNm,sum(Orders_Cnt) AS Cnt,sum(Orders_Amt) AS Amt FROM orders_seler_cst_amt " +
        "WHERE Pay_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY SId,SNm;" +
        "SELECT Cust_Id AS CId,Cust_Nm AS CNm,sum(Orders_Cnt) AS Cnt,sum(Orders_Amt) AS Amt FROM orders_seler_cst_amt " +
        "WHERE Pay_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY CId,CNm;" +
        "SELECT Pay_Dt, COUNT(DISTINCT Sel_Id) AS Sel_Cnt, COUNT(DISTINCT Cust_Id) AS Cust_Cnt, SUM(Orders_Amt) AS Amt " +
        "FROM orders_seler_cst_amt " +
        "WHERE Pay_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY Pay_Dt;"

    mysqlapi.queryHandlers(
        req,
        res,
        "5801010",
        {
            sql: q
        },
        new Array(
            (rows, fields) => {
                for (r in rows) {
                    //console.log('[' + r + '] ' + rows[r].SId + ' - ' + rows[r].SNm + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    sellerArray.push(new Array(rows[r].SId, rows[r].SNm, rows[r].Cnt, rows[r].Amt));
                }
            },
            (rows, fields) => {
                //var buyerArray = new Array();
                for (r in rows) {
                    //console.log('[' + r + '] ' + rows[r].CId + ' - ' + rows[r].CNm + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    buyerArray.push(new Array(rows[r].CId, rows[r].CNm, rows[r].Cnt, rows[r].Amt));
                }
            },
            (rows, fields) => {
                var arpuArray = new Array();
                for (r in rows) {
                    arpuArray.push(new Array(moment(rows[r].Pay_Dt).format('YYYY-MM-DD'), rows[r].Sel_Cnt, rows[r].Cust_Cnt, rows[r].Amt));
                }
                resp = {
                    result: "success",
                    data: {
                        seller: sellerArray,
                        buyer: buyerArray,
                        arpu: arpuArray
                    }
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);
            }
        )
    );

});


/***
 * 分公司日报统计
 * 5801011
 */
function itemToId(item, array) {

    var index = -1;
    for (a in array) {
        if (item === array[a]) {
            index = a;
            break;
        }
    }

    return index;
}

router.get('/method/BranchDaily/begin/:begin/end/:end', (req, res) => {
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801011", "BranchDaily", beginDate, endDate);

    beginDate = mysql.escape(beginDate);
    //console.log("begin date after escape: %s", beginDate);
    endDate = mysql.escape(endDate);
    //console.log("end date after escape: %s", endDate);

    var d1 = new Date();
    d1.setTime(Date.parse(beginDate));

    var d = new Date();
//	if (d1.getFullYear() < d.getFullYear()) {
//		beginDate = '{}-01-01'.format(d.getFullYear);
//		endDate = moment(d).format('YYYY-MM-DD');
//	}

    var branchNames = [];
    var branchArray = [];
    var branchGmvArray = [];
    var q = "SELECT DISTINCT Brn_Nm AS Branch FROM csc_anasys.classify_cnt_amt_gmv ORDER BY Brn_Nm;" +
        "SELECT Pay_Dt AS PayDt,Brn_Nm AS Branch,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM csc_anasys.classify_cnt_amt WHERE Pay_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY PayDt,Branch " +
        "ORDER BY PayDt, Branch;" +
        "SELECT Order_Dt AS OrderDt,Brn_Nm AS Branch,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM csc_anasys.classify_cnt_amt_gmv WHERE Order_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY OrderDt,Branch " +
        "ORDER BY Order_Dt, Branch";

    mysqlapi.queryHandlers(
        req,
        res,
        "5801011",
        {
            sql: q
        },
        new Array(
            (rows, fields) => {
                for (r in rows) {
                    //console.log('[' + r + '] ' + rows[r].Branch);
                    branchNames.push(rows[r].Branch);
                }
            },
            (rows, fields) => {

                for (r in rows) {
                    //console.log('[' + r + '] ' + ' - ' + moment(rows[r].PayDt).format('YYYY-MM-DD') + rows[r].Branch + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    branchArray.push(new Array(moment(rows[r].PayDt).format('YYYY-MM-DD'), itemToId(rows[r].Branch, branchNames), rows[r].Cnt, rows[r].Amt));
                }

            },
            (rows, fields) => {
                for (r in rows) {
                    //console.log('[' + r + '] ' + ' - ' + moment(rows[r].OrderDt).format('YYYY-MM-DD') + rows[r].Branch + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    branchGmvArray.push(new Array(moment(rows[r].OrderDt).format('YYYY-MM-DD'), itemToId(rows[r].Branch, branchNames), rows[r].Cnt, rows[r].Amt));
                }

                resp = {
                    result: "success",
                    data: {
                        branchNames: branchNames,
                        branchData: branchArray,
                        branchGmvData: branchGmvArray
                    }
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);
            }
        )
    );

});


/***
 * 分公司周报统计
 * 5801012
 */
router.get('/method/BranchWeekly/begin/:begin/end/:end', (req, res) => {

    var beginDate = req.params.begin;
    var endDate = req.params.end;
    beginDate = mysql.escape(beginDate);
    endDate = mysql.escape(endDate);
    console.log(beginDate+'qqqqqqwq'+endDate);

    var branchNames = [];
    var branchArray = [];
    var branchGmvArray = [];
    var q = "SELECT DISTINCT Brn_Nm AS Branch FROM csc_anasys.classify_cnt_amt_gmv ORDER BY Brn_Nm;" +
        "SELECT YEAR(Pay_Dt) AS year,CASE WHEN DAYOFWEEK(CONCAT(SUBSTR(Pay_Dt,1,4),'-01-01'))=1 THEN WEEK(Pay_Dt) ELSE WEEK(Pay_Dt)+1 END AS Week,Brn_Nm AS Branch,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM csc_anasys.classify_cnt_amt WHERE Pay_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY year,Week,Branch " +
        "ORDER BY Week,Branch ASC;" +
        "SELECT YEAR(Order_Dt) AS year,CASE WHEN DAYOFWEEK(CONCAT(SUBSTR(Order_Dt,1,4),'-01-01'))=1 THEN WEEK(Order_Dt) ELSE  WEEK(Order_Dt)+1 END AS Week,Brn_Nm AS Branch,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM csc_anasys.classify_cnt_amt_gmv WHERE Order_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY year, Week,Branch " +
        "ORDER BY Week,Branch ASC";

    mysqlapi.queryHandlers(
        req,
        res,
        "5801012",
        {
            sql: q
        },
        new Array(
            (rows, fields) => {
                for (r in rows) {
                    branchNames.push(rows[r].Branch);
                }
            },
            (rows, fields) => {

                for (r in rows) {
                    var weekes=rows[r].year+''+rows[r].Week;
                    if(rows[r].Week<10){
                        weekes=rows[r].year+'0'+rows[r].Week;
                    }
                    branchArray.push(new Array(weekes, itemToId(rows[r].Branch, branchNames), rows[r].Cnt, rows[r].Amt));
                }
                branchArray.sort();
            console.log(branchArray);
            },
            (rows, fields) => {

                for (r in rows) {
                    var weekes1=rows[r].year+''+rows[r].Week;
                    if(rows[r].Week<10){
                        weekes1=rows[r].year+'0'+rows[r].Week;
                    }
                    branchGmvArray.push(new Array(weekes1, itemToId(rows[r].Branch, branchNames), rows[r].Cnt, rows[r].Amt));
                }
                branchGmvArray.sort();
                resp = {
                    result: "success",
                    data: {
                        branchNames: branchNames,
                        branchData: branchArray,
                        branchGmvData: branchGmvArray
                    }
                };
                //console.log(JSON.stringify(resp));
                res.json(resp);
            }
        )
    );

});


/***
 * 分公司月报统计
 * 5801013
 */
router.get('/method/BranchMonthly/begintimes/:begintimes/endtimes/:endtimes', (req, res) => {

    var begintimes = req.params.begintimes;
    var begins=begintimes.substr(-2,2);
    begintimes= begintimes.substr(0,4)+""+begins;
    var endtimes = req.params.endtimes;
    var ends=endtimes.substr(-2,2);
    endtimes= endtimes.substr(0,4)+""+ends;
    begintimes = mysql.escape(begintimes);
    endtimes = mysql.escape(endtimes);

    var branchNames = [];
    var branchArray = [];
    var branchGmvArray = [];

    var q="SELECT DISTINCT Brn_Nm AS Branch FROM csc_anasys.classify_cnt_amt_gmv ORDER BY Brn_Nm; "+
        " SELECT DATE_FORMAT(t1.c_date,'%Y%m') MONTH,t1.brn_nm,SUM(COALESCE(t2.order_cnt,0)) as cnt,SUM(COALESCE(t2.order_amt,0)) as amt FROM " +
    " (SELECT DISTINCT C_DATE, t2.brn_nm FROM csc_calendar t1 INNER JOIN (SELECT DISTINCT brn_nm FROM classify_cnt_amt_gmv) t2 ON 1 = 1 ) t1 "+
    " LEFT OUTER JOIN classify_cnt_amt t2 ON t1.C_DATE = t2.pay_dt AND t1.brn_nm = t2.Brn_nm WHERE DATE_FORMAT(t1.c_date,'%Y%m') BETWEEN " + begintimes + " AND "+endtimes +
    " GROUP BY DATE_FORMAT(t1.c_date,'%Y%m'),t1.brn_nm ORDER BY DATE_FORMAT(t1.c_date,'%Y%m'),t1.brn_nm;"+
    " SELECT DATE_FORMAT(t1.c_date,'%Y%m') MONTH,t1.brn_nm,SUM(COALESCE(t2.Order_Cnt,0)) cnt,SUM(COALESCE(t2.order_Amt,0)) amt FROM (SELECT DISTINCT C_DATE, t2.brn_nm FROM csc_calendar"+
    " t1 INNER JOIN (SELECT DISTINCT brn_nm FROM classify_cnt_amt_gmv) t2 ON 1 = 1) t1 LEFT OUTER JOIN classify_cnt_amt_gmv t2 ON t1.C_DATE = t2.Order_Dt AND t1.brn_nm =t2.Brn_nm"+
    " WHERE DATE_FORMAT(t1.c_date,'%Y%m') BETWEEN " + begintimes + " AND "+endtimes +" GROUP BY DATE_FORMAT(t1.c_date,'%Y%m') ,t1.brn_nm ORDER BY DATE_FORMAT(t1.c_date,'%Y%m'),t1.brn_nm;";
    //var q = "SELECT DISTINCT Brn_Nm AS Branch FROM csc_anasys.classify_cnt_amt_gmv ORDER BY Brn_Nm; "+
    //" SELECT DATE_FORMAT(t1.C_DATE,'%Y%m') AS Month,  COALESCE(t2.Brn_Nm,'其他分公司') AS Branch, "+
    //" SUM(COALESCE(t2.Order_Cnt,0)) AS Cnt,SUM(COALESCE(t2.Order_Amt,0)) AS Amt FROM csc_anasys.csc_calendar t1"+
    //" LEFT OUTER JOIN csc_anasys.classify_cnt_amt t2 ON t1.C_DATE = t2.`Pay_Dt`  WHERE DATE_FORMAT(t1.C_DATE,'%Y%m') BETWEEN "+begintimes +" AND "+endtimes +
    //" GROUP BY Month, Branch ORDER BY Month,Branch ASC;"+
    //" SELECT DATE_FORMAT(t1.C_DATE,'%Y%m') AS Month, COALESCE(t2.Brn_Nm,'其他分公司') AS Branch,SUM(COALESCE(t2.Order_Cnt,0)) AS Cnt,"+
    //" SUM(COALESCE(t2.Order_Amt,0)) AS Amt  FROM csc_anasys.csc_calendar t1 LEFT OUTER JOIN csc_anasys.classify_cnt_amt_gmv t2"+
    //" ON t1.C_DATE = t2.`Order_Dt` WHERE DATE_FORMAT(t1.C_DATE,'%Y%m') BETWEEN "+ begintimes +" AND "+endtimes +"  GROUP BY Month, Branch ORDER BY Month,Branch ASC;";
    //var q = "SELECT DISTINCT Brn_Nm AS Branch FROM csc_anasys.classify_cnt_amt_gmv ORDER BY Brn_Nm;" +
    //    "SELECT MONTH(Pay_Dt) AS Month,Brn_Nm AS Branch,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
    //    "FROM csc_anasys.classify_cnt_amt WHERE YEAR(Pay_Dt)=" + year + " GROUP BY Month,Branch ORDER BY Month,Branch ASC;" +
    //    "SELECT MONTH(Order_Dt) AS Month,Brn_Nm AS Branch,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
    //    "FROM csc_anasys.classify_cnt_amt_gmv WHERE YEAR(Order_Dt)=" + year + " GROUP BY Month,Branch ORDER BY Month,Branch ASC";
    mysqlapi.queryHandlers(
        req,
        res,
        "5801013",
        {
            sql: q
        },
        new Array(
            (rows, fields) => {
                for (r in rows) {
                    //console.log('[' + r + '] ' + rows[r].Branch);
                    branchNames.push(rows[r].Branch);
                }
            },
            (rows, fields) => {

                for (r in rows) {
                    //console.log('[' + r + '] ' + ' - ' + rows[r].Month + rows[r].Branch + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    branchArray.push(new Array(rows[r].MONTH, itemToId(rows[r].brn_nm, branchNames), rows[r].cnt, rows[r].amt));
                }

            },
            (rows, fields) => {

                for (r in rows) {
                    //console.log('[' + r + '] ' + ' - ' + rows[r].Month + rows[r].Branch + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    branchGmvArray.push(new Array(rows[r].MONTH, itemToId(rows[r].brn_nm, branchNames), rows[r].cnt, rows[r].amt));
                }

                resp = {
                    result: "success",
                    data: {
                        branchNames: branchNames,
                        branchData: branchArray,
                        branchGmvData: branchGmvArray
                    }
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);
            }
        )
    );
});


/***
 * 分公司季报统计
 * 5801020
 */
router.get('/method/BranchQuarterly/year/:year', (req, res) => {

    var year = req.params.year;
    //console.log("%s00000##method=%s,year=%s", "5801020", "BranchQuarterly", year);

    endyear = mysql.escape(year);
    //console.log("year after escape: %s", endyear);

    var begyear = req.params.year - 1;
    begyear = mysql.escape(begyear);
    //console.log("begin year: %s", begyear);

    var branchNames = [];
    var branchArray = [];
    var branchGmvArray = [];
    var q = "SELECT DISTINCT Brn_Nm AS Branch FROM csc_anasys.classify_cnt_amt_gmv ORDER BY Brn_Nm;" +
        "SELECT CONCAT(YEAR(Pay_Dt),QUARTER(Pay_Dt)) AS Quarter,Brn_Nm AS Branch,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM csc_anasys.classify_cnt_amt WHERE YEAR(Pay_Dt) BETWEEN " + begyear + " AND " + endyear +
        " GROUP BY CONCAT(YEAR(Pay_Dt),QUARTER(Pay_Dt)),Branch ORDER BY CONCAT(YEAR(Pay_Dt),QUARTER(Pay_Dt)),Branch ASC;" +
        "SELECT CONCAT(YEAR(Order_Dt),QUARTER(Order_Dt)) AS Quarter,Brn_Nm AS Branch,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM csc_anasys.classify_cnt_amt_gmv WHERE YEAR(Order_Dt) BETWEEN " + begyear + " AND " + endyear +
        " GROUP BY CONCAT(YEAR(Order_Dt),QUARTER(Order_Dt)),Branch ORDER BY CONCAT(YEAR(Order_Dt),QUARTER(Order_Dt)),Branch ASC";

    mysqlapi.queryHandlers(
        req,
        res,
        "5801020",
        {
            sql: q
        },
        new Array(
            (rows, fields) => {
                for (r in rows) {
                    //console.log('[' + r + '] ' + rows[r].Branch);
                    branchNames.push(rows[r].Branch);
                }
            },
            (rows, fields) => {

                for (r in rows) {
                    branchArray.push(new Array(rows[r].Quarter.toString(), itemToId(rows[r].Branch, branchNames), rows[r].Cnt, rows[r].Amt));
                }

            },
            (rows, fields) => {

                for (r in rows) {
                    branchGmvArray.push(new Array(rows[r].Quarter.toString(), itemToId(rows[r].Branch, branchNames), rows[r].Cnt, rows[r].Amt));
                }

                resp = {
                    result: "success",
                    data: {
                        branchNames: branchNames,
                        branchData: branchArray,
                        branchGmvData: branchGmvArray
                    }
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);
            }
        )
    );
});

/***
 * 分公司年报统计
 * 5801021
 */
router.get('/method/BranchYearly/year/:year', (req, res) => {

    var year = req.params.year;
    //console.log("%s00000##method=%s,year=%s", "5801021", "BranchQuarterly", year);

    endyear = mysql.escape(year);
    //console.log("year after escape: %s", endyear);

    var begyear = req.params.year - 2;
    begyear = mysql.escape(begyear);
    //console.log("begin year: %s", begyear);

    var branchNames = [];
    var branchArray = [];
    var branchGmvArray = [];
    var q = "SELECT DISTINCT Brn_Nm AS Branch FROM csc_anasys.classify_cnt_amt_gmv ORDER BY Brn_Nm;" +
        "SELECT YEAR(Pay_Dt) AS Year,Brn_Nm AS Branch,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM csc_anasys.classify_cnt_amt WHERE YEAR(Pay_Dt) BETWEEN " + begyear + " AND " + endyear +
        " GROUP BY YEAR(Pay_Dt),Branch ORDER BY YEAR(Pay_Dt),Branch ASC;" +
        "SELECT YEAR(Order_Dt) AS Year,Brn_Nm AS Branch,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM csc_anasys.classify_cnt_amt_gmv WHERE YEAR(Order_Dt) BETWEEN " + begyear + " AND " + endyear +
        " GROUP BY YEAR(Order_Dt),Branch ORDER BY YEAR(Order_Dt),Branch ASC";

    mysqlapi.queryHandlers(
        req,
        res,
        "5801021",
        {
            sql: q
        },
        new Array(
            (rows, fields) => {
                for (r in rows) {
                    //console.log('[' + r + '] ' + rows[r].Branch);
                    branchNames.push(rows[r].Branch);
                }
            },
            (rows, fields) => {

                for (r in rows) {
                    //console.log('[' + r + '] ' + ' - ' + rows[r].Year + rows[r].Branch + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    branchArray.push(new Array(rows[r].Year, itemToId(rows[r].Branch, branchNames), rows[r].Cnt, rows[r].Amt));
                }

            },
            (rows, fields) => {

                for (r in rows) {
                    //console.log('[' + r + '] ' + ' - ' + rows[r].Year + rows[r].Branch + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    branchGmvArray.push(new Array(rows[r].Year, itemToId(rows[r].Branch, branchNames), rows[r].Cnt, rows[r].Amt));
                }

                resp = {
                    result: "success",
                    data: {
                        branchNames: branchNames,
                        branchData: branchArray,
                        branchGmvData: branchGmvArray
                    }
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);
            }
        )
    );
});


/***
 * 订单产品维度统计
 * 5801014
 */
router.get('/method/OrderProduct', (req, res) => {

    var beginDate = req.query.begin;
    var endDate = req.query.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801014", "OrderProduct", beginDate, endDate);

    beginDate = mysql.escape(beginDate);
    //console.log("begin date after escape: %s", beginDate);
    endDate = mysql.escape(endDate);
    //console.log("end date after escape: %s", endDate);

    var productArray = [];
    var productGmvArray = [];
    var q = "SELECT Prd_Id AS Id,Prd_Nm AS PrdNm,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM orders_products_cnt_amt WHERE Pay_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY Prd_Id,Prd_Nm;" +
        "SELECT Prd_Id AS Id,Prd_Nm AS PrdNm,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM orders_products_cnt_amt_gmv WHERE Order_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY Prd_Id,Prd_Nm";

    mysqlapi.queryHandlers(
        req,
        res,
        "5801014",
        {
            sql: q
        },
        new Array(
            (rows, fields) => {

                for (r in rows) {
                    //console.log('[' + r + '] ' + ' - ' + rows[r].Id + '-' + rows[r].PrdNm + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    productArray.push(new Array(rows[r].Id, rows[r].PrdNm, rows[r].Cnt, rows[r].Amt));
                }

            },
            (rows, fields) => {

                for (r in rows) {
                    //console.log('[' + r + '] ' + ' - ' + rows[r].Id + '-' + rows[r].PrdNm + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    productGmvArray.push(new Array(rows[r].Id, rows[r].PrdNm, rows[r].Cnt, rows[r].Amt));
                }

                /*
                 resp = {
                 result: "success",
                 data: {
                 productData: productArray,
                 productGmvData: productGmvArray
                 }
                 };
                 */

                var resp = [];
                for (p in productArray) {
                    resp.push({
                        Id: productArray[p][0],
                        Name: productArray[p][1],
                        Amt: productArray[p][3],
                        Cnt: productArray[p][2]
                    });
                }

                //console.log(JSON.stringify(resp));
                res.json(resp);
            }
        )
    );

});

/***
 * 订单产品维度统计
 * 5801015
 */
router.get('/method/OrderProduct/begin/:begin/end/:end', (req, res) => {
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801015", "OrderProduct", beginDate, endDate);

    beginDate = mysql.escape(beginDate);
    //console.log("begin date after escape: %s", beginDate);
    endDate = mysql.escape(endDate);
    //console.log("end date after escape: %s", endDate);

    var productArray = [];
    var productGmvArray = [];
    var q = "SELECT Prd_Id AS Id,Prd_Nm AS PrdNm,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM orders_products_cnt_amt WHERE Pay_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY Prd_Id,PrdNm;" +
        "SELECT Prd_Id AS Id,Prd_Nm AS PrdNm,sum(Order_Cnt) AS Cnt,sum(Order_Amt) AS Amt " +
        "FROM orders_products_cnt_amt_gmv WHERE Order_Dt BETWEEN " + beginDate + " AND " + endDate + " GROUP BY Prd_Id,PrdNm";

    mysqlapi.queryHandlers(
        req,
        res,
        "5801015",
        {
            sql: q
        },
        new Array(
            (rows, fields) => {

                for (r in rows) {
                    //console.log('[' + r + '] ' + ' - ' + rows[r].Id + '-' + rows[r].PrdNm + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    productArray.push(new Array(rows[r].Id, rows[r].PrdNm, rows[r].Cnt, rows[r].Amt));
                }

            },
            (rows, fields) => {

                for (r in rows) {
                    //console.log('[' + r + '] ' + ' - ' + rows[r].Id + '-' + rows[r].PrdNm + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                    productGmvArray.push(new Array(rows[r].Id, rows[r].PrdNm, rows[r].Cnt, rows[r].Amt));
                }

                var productData = [];
                for (x in productArray) {
                    productData.push({
                        Id: productArray[x][0],
                        Name: productArray[x][1],
                        Amt: productArray[x][3],
                        Cnt: productArray[x][2]
                    });
                }

                var resp = {
                    result: "success",
                    data: productData
                };

                //console.log(JSON.stringify(resp));
                res.json(resp);
            }
        )
    );

});

/***
 * 已取消订单
 * 5801016
 */
router.get('/method/OrderCancel', (req, res) => {

    var beginDate = req.query.begin;
    var endDate = req.query.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801016", "OrderCancel", beginDate, endDate);

    beginDate = mysql.escape(beginDate);
    //console.log("begin date after escape: %s", beginDate);
    endDate = mysql.escape(endDate);
    //console.log("end date after escape: %s", endDate);

    var orderArray = [];
    var q = "SELECT Order_Id AS OrderId," +
        "date_format(Order_Tm,'%Y-%m-%d %T') AS OrderTm," +
        "date_format(Pay_Tm,'%Y-%m-%d %T') AS PayTm," +
        "Order_Amt AS Amt," +
        "date_format(Cancel_Tm,'%Y-%m-%d %T') AS CancelTm " +
        "FROM orders_cancel WHERE Cancel_Tm BETWEEN " + beginDate + " AND " + endDate + " ORDER BY CancelTm DESC";

    mysqlapi.queryHandler(
        req,
        res,
        "5801016",
        q,
        (rows, fields) => {

            for (r in rows) {
                //console.log('[' + r + ']' + ' - ' + rows[r].OrderId + '-' + rows[r].OrderTm + ' - ' + rows[r].PayTm + ' - ' + rows[r].Amt + ' - ' + rows[r].CancelTm);
              var orders=(rows[r].OrderId).substr(1,12);
                orderArray.push({
                    OrderId: '<a href="javascript:void(0)" onClick="selects('+orders+')" >'+rows[r].OrderId+'</a>',
                    OrderTm: rows[r].OrderTm,
                    PayTm: rows[r].PayTm,
                    Amt: rows[r].Amt,
                    CancelTm: rows[r].CancelTm
                });
            }

            var resp = orderArray;

            //console.log(JSON.stringify(resp));
            res.json(resp);
        }
    );

});

/***
 * 每月取消订单统计
 * 5801022
 */
router.get('/method/OrderCancelMonthly/begintimes/:begintimes/endtimes/:endtimes', (req, res) => {

    var begintimes = req.params.begintimes;
    var begins=begintimes.substr(-2,2);
    begintimes= begintimes.substr(0,4)+""+begins;
    var endtimes = req.params.endtimes;
    var ends=endtimes.substr(-2,2);
    endtimes= endtimes.substr(0,4)+""+ends;

    begintimes = mysql.escape(begintimes);
    endtimes = mysql.escape(endtimes);
    //console.log("year after escape: %s", year);

    var cancelArray = [];
    var q = "SELECT DATE_FORMAT(t1.C_DATE,'%Y%m') AS Month,  sum(case when t2.Order_Id is null then 0 else 1 end) AS Cnt, "+
        " SUM(COALESCE(t2.Order_Amt,0)) AS Amt FROM csc_anasys.csc_calendar t1 LEFT OUTER JOIN orders_cancel  t2 "+
       " ON t1.C_DATE = date(t2.Cancel_Tm) WHERE DATE_FORMAT(t1.C_DATE,'%Y%m') BETWEEN "+begintimes+" AND "+endtimes+" GROUP BY DATE_FORMAT(t1.C_DATE,'%Y%m');";

    //var q = "SELECT MONTH(Cancel_Tm) AS Month,COUNT(1) AS Cnt,SUM(Order_Amt) AS Amt " +
    //    "FROM orders_cancel " +
    //    "WHERE YEAR(Cancel_Tm) = " + year +
    //    " GROUP BY MONTH(Cancel_Tm) ORDER BY MONTH(Cancel_Tm) ASC";


    mysqlapi.queryHandler(
        req,
        res,
        "5801022",
        q,
        (rows, fields) => {
            for (r in rows) {
                //console.log('[' + r + '] ' + rows[r].Month + ' - ' + rows[r].Cnt + ' - ' + rows[r].Amt);
                cancelArray.push(new Array(rows[r].Month, rows[r].Cnt, rows[r].Amt));
            }

            resp = {
                result: "success",
                data: cancelArray
            };

            //console.log(JSON.stringify(resp));
            res.json(resp);
        }
    );
});


/***
 * 买卖家关联分析
 * 5801023
 */
router.get('/method/sellerbuyerRelation', (req, res) => {

    var beginDate = req.query.begin;
    var endDate = req.query.end;

    //console.log("%s00000##method=%s,beginDate=%s,endDate=%s", "5801023", "sellerbuyerRelation", beginDate, endDate);

    beginDate = mysql.escape(beginDate);
    //console.log("begin date after escape: %s", beginDate);
    endDate = mysql.escape(endDate);
    //console.log("end date after escape: %s", endDate);

    var sellerbuyerArray = [];

    var q = "SELECT sel_id, sel_nm, cust_id, cust_nm, SUM(orders_cnt) as cnt, SUM(orders_amt) as amt " +
        "FROM orders_seler_cst_amt " +
        "WHERE pay_dt BETWEEN " + beginDate + " AND " + endDate +
        " GROUP BY sel_id, sel_nm, cust_id, cust_nm ORDER BY sel_nm ,cust_nm ASC";

    mysqlapi.queryHandler(
        req,
        res,
        "5801023",
        q,
        (rows, fields) => {

            for (r in rows) {
                //console.log('[' + r + '] ' + ' - ' + rows[r].sel_nm + '-' + rows[r].cust_nm + ' - ' + rows[r].cnt + ' - ' + rows[r].amt);
                sellerbuyerArray.push(new Array(rows[r].sel_nm, rows[r].cust_nm, rows[r].cnt, rows[r].amt));
            }

            var resp = [];
            for (p in sellerbuyerArray) {
                resp.push({
                    seller: sellerbuyerArray[p][0],
                    buyer: sellerbuyerArray[p][1],
                    amt: sellerbuyerArray[p][3],
                    cnt: sellerbuyerArray[p][2]
                });
            }
            res.json(resp);
        }
    );

});


module.exports = orderApp;
