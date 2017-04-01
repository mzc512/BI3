/**
 * Created by Administrator on 2016/12/2.
 */

var async = require('async');
var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var dbhelper = require('../util/mysql');
var sql = require('../sql/orderTypeList_sql');
var server =  express();
server.use('/orderTypeList', router);

//订单分类->品类饼图
router.get('/method/payCategory/begin/:begin/end/:end',function(req,res,next){
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    dbhelper.query(sql.payType, [beginDate,endDate],function(resp) {
        if(resp.result){
            var dailyArrays = [];
            for(var i=0;i<resp.data.length;i++ ) {
                var dailyData = {
                    'cat_brn_nm':resp.data[i].cat_nm,
                    'orderNum'  :resp.data[i].orderNum,
                    'orderPay'  :resp.data[i].orderPay
                }
                dailyArrays.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArrays});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


//订单分类->品类表格
router.get('/method/payOrderTypeList/begin/:begin/end/:end',function(req,res,next){
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    dbhelper.query(sql.payorderTypeList, [beginDate,endDate],function(resp) {
        if(resp.result){
            var dailyArrays = [];
            var bounces=0;
            var goldRatios=0;
            for(var s=0;s<resp.data.length;s++){
                bounces += resp.data[s].orderNum;
                goldRatios += resp.data[s].orderPay;
            }

            for(var i=0;i<resp.data.length;i++ ) {
                var dailyData = {
                    'bounce':(resp.data[i].orderNum/bounces*100).toFixed(2)+'%' ,
                    'goldRatio':(resp.data[i].orderPay/goldRatios*100).toFixed(2)+'%',
                    'Indry_Nm'  :resp.data[i].Indry_Nm,
                    'cat_brn_nm':resp.data[i].cat_nm,
                    'orderNum'  :resp.data[i].orderNum,
                    'orderPay'  :resp.data[i].orderPay
                }
                dailyArrays.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArrays});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

//订单分类->分公司饼图
router.get('/method/branchPay/begin/:begin/end/:end',function(req,res,next){
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    dbhelper.query(sql.payCompany, [beginDate,endDate],function(resp) {
        if(resp.result){
            var dailyArray = [];
            for(var i=0;i<resp.data.length;i++ ) {
                var dailyData = {
                    'branchName':resp.data[i].brn_nm,
                    'orderNums'  :resp.data[i].orderNum,
                    'orderPays'  :resp.data[i].orderPay
                }
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

//订单分类->分公司表格
router.get('/method/payOrderCompanyList/begin/:begin/end/:end',function(req,res,next){
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    dbhelper.query(sql.payCompanyList, [beginDate,endDate],function(resp) {
        if(resp.result){
            var dailyArray = [];
            var bounces=0;
            var goldRatios=0;
            for(var s=0;s<resp.data.length;s++){
                bounces += resp.data[s].orderNum;
                goldRatios += resp.data[s].orderPay;
            };
            for(var i=0;i<resp.data.length;i++ ) {
                var dailyData = {
                    'orderRatio':(resp.data[i].orderNum/bounces*100).toFixed(2)+'%' ,
                    'goldRatio' :(resp.data[i].orderPay/goldRatios*100).toFixed(2)+'%',
                    'Indry_Nm'  :resp.data[i].indry_nm,
                    'branchName':resp.data[i].brn_nm,
                    'orderNums' :resp.data[i].orderNum,
                    'orderPays' :resp.data[i].orderPay
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


//订单分类->行业表格
router.get('/method/paymentIndustry/begin/:begin/end/:end',function(req,res,next){
    var beginDate = req.params.begin;
    var endDate = req.params.end;

    dbhelper.query(sql.paymentIndustry, [beginDate,endDate],function(resp) {
        if(resp.result){
            var dailyArray = [];
            var bounces=0;
            var goldRatios=0;
            for(var s=0;s<resp.data.length;s++){
                bounces += resp.data[s].orderNum;
                goldRatios += resp.data[s].orderPay;
            }
            for(var i=0;i<resp.data.length;i++ ) {
                var dailyData = {
                    'orderRatio':(resp.data[i].orderNum/bounces*100).toFixed(2)+'%' ,
                    'goldRatio':(resp.data[i].orderPay/goldRatios*100).toFixed(2)+'%',
                    'tradeName':resp.data[i].indry_nm,
                    'orderNums'  :resp.data[i].orderNum,
                    'orderPays'  :resp.data[i].orderPay
                };
                dailyArray.push(dailyData);
            }
            res.json({result:true,code:0,message:"data success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

//2017-02-16
//订单多维分析
/*
 * 订单行业品类统计优化 下拉框数据接口
 */

router.get('/method/order/dim/dropdownlist', function(req, res, next) {

    var dim_flg1 = 'D_METRI';
    var dim_flg2 = 'D_DIM';

    var sqlParamsEntity= [];
    sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.orderManyDim1,[dim_flg1]));
    sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.orderManyDim2,[dim_flg2]));

    dbhelper.queryMultiple(sqlParamsEntity,(resp) =>{
        if(resp.result){
            res.send({ result:true,code:0,message:"data success",data:resp});
        }else{
            res.send({result:false,code:-1,message:"data fail"});
        }
    });

});

router.get('/method/order/dim/datalist/startDate/:startDate/endDate/:endDate/distdl/:distdl/distwd/:distwd/distcywd/:distcywd', function(req, res, next) {

    var startDate = req.params.startDate;
    var endDate = req.params.endDate;
    var dim1 =  req.params.distdl;
    var dim2 =  req.params.distwd;
    var dim3 =  req.params.distcywd;

    var src = function (callback) {

        var sqlParamsEntity= [];
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.orderGetCol1,[dim1]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.orderGetCol2,[dim2]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.orderGetCol3,[dim3]));

        dbhelper.queryMultiple(sqlParamsEntity,(resp) =>{
            if(resp.result){
                var dim = '';
                var grp_stat = '';
                var collist = '';
                var tbname = '';
                var sql_stat = '';

                if(resp[1].data[0].dim_1 == 'ALL' && resp[2].data[0].dim_1 == 'ALL') {
                    dim = "date_format(stat_dt,'%Y-%m-%d') as dim1_nm,";
                    grp_stat = "date_format(stat_dt,'%Y-%m-%d'),";
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
                collist = dim + 'SUM(' + resp[0].data[0].dim_1 + ') as amt';

                if(dim1 == 'D_M01') {
                    tbname = "csc_anasys.orders_area_classify";
                }
                if(dim1 == 'D_M02') {
                    tbname = "csc_anasys.orders_area_classify_paid";
                }

                sql_stat = "select " + collist + " from " + tbname +
                        " where stat_dt between " + mysql.escape(startDate) + " and " + mysql.escape(endDate) +
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

//2017-02-21
//订单多维分析
/*
 * 订单行业品类统计优化 下转数据接口
 */

router.get('/method/order/dim/clickdata/startDate/:startDate/endDate/:endDate/distdl/:distdl/distwd/:distwd/distcywd/:distcywd/val1/:val1/val2/:val2', function(req, res, next) {

    var startDate = req.params.startDate;
    var endDate = req.params.endDate;
    var dim1 =  req.params.distdl;
    var dim2 =  req.params.distwd;
    var dim3 =  req.params.distcywd;
    var dim4 =  req.params.val1;
    var dim5 =  req.params.val2;

    var src = function (callback) {

        var sqlParamsEntity= [];
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.orderGetCol1,[dim1]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.orderGetCol2,[dim2]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.orderGetCol3,[dim3]));

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
                            grp_stat ="date_format(stat_dt,'%Y-%m-%d'),"+grp_stat+ resp[i].data[0].dim_2  +',' ;
                        }else{
                                grp_stat = grp_stat + resp[i].data[0].dim_2 + ',';
                        }

                    }
                }

                if(dim2=='D_D00'|| dim3=='D_D00'){
                    collist = dim + " date_format(stat_dt,'%Y-%m-%d') as stat_dt, SUM(" + resp[0].data[0].dim_1 + ") as amt";
                }else{
                    if(dim4=='ALL'|| dim5=='ALL'){
                        grp_stat = grp_stat + '';
                    }else{
                        dim = dim +" date_format(stat_dt,'%Y-%m-%d') as stat_dt, ";
                        grp_stat ="date_format(stat_dt,'%Y-%m-%d'),"+grp_stat ;
                    }
                    collist = dim + 'SUM(' + resp[0].data[0].dim_1 + ') as amt';
                }


                if(dim1 == 'D_M01') {
                    tbname = "csc_anasys.orders_area_classify";
                }
                if(dim1 == 'D_M02') {
                    tbname = "csc_anasys.orders_area_classify_paid";

                }
                sql_stat = "select " + collist + " from " + tbname +
                " where stat_dt between " + mysql.escape(startDate) + " and " + mysql.escape(endDate) + andes +
                " group by " + grp_stat.substring(0,grp_stat.length-1) + ";";
                //console.log(sql_stat+'qqqqqqqqqqqq');
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


//2017-03-02
//已取消订单详情

router.get('/method/OrderDetailsCancelled/orderid/:orderid',function(req,res,next){
    var orderid = req.params.orderid;
    var sqlParamsEntitys= [];
    sqlParamsEntitys.push(dbhelper._getNewSqlParamEntity(sql.orderDetailsCancelled,[orderid]));
    sqlParamsEntitys.push(dbhelper._getNewSqlParamEntity(sql.orderDetailsCancelled1,[orderid]));
    dbhelper.queryMultiple(sqlParamsEntitys,(resp) =>{
        if(resp.result){
            var orderArray = [];
            var productData=[];
            var dailyArray=[];
            for(var s=0;s< resp[0].data.length;s++){
                orderArray.push({
                name : resp[0].data[s].name,
                num : resp[0].data[s].num,
                RMB : resp[0].data[s].RMB
            });
            }
            for(var i=0;i<resp[1].data.length;i++ ) {
                productData.push({
                    1:'订单金额：',
                    2: resp[1].data[i].totalMoney,//总金额
                    3:'优惠券和金额：',
                    4: resp[1].data[i].favourMoney,  //优惠金额
                    5:'订单提交时间：',
                    6: resp[1].data[i].createTime ,   //订单创建时间
                    7:'订单来源：',
                    8: resp[1].data[i].source,     //订单来源
                    9:'支付状态：',
                    10: resp[1].data[i].payStatus,//支付状态
                    11:'支付金额：',
                    12: resp[1].data[i].payMoney,  //支付金额
                    13:'支付方式：',
                    14: resp[1].data[i].paytool,     //支付方式
                    15:'支付时间：',
                    16: resp[1].data[i].paytime ,   //支付时间
                    17:'交易流水号：',
                    18:resp[1].data[i].transactionNo,     //交易流水号
                    //19:'第三方交易流水号：',
                    //20:'',
                    //21:'订单状态：',
                    //22: resp[1].data[i].payStatus,    //支付状态
                    19:'商家名称：',
                    20:resp[1].data[i].enterprise,     //商家名称
                    21:'收货人：',
                    22:  resp[1].data[i].receiverName,     //收货人
                    23:'卖家账户：',
                    24:resp[1].data[i].membername ,   //商家账户
                    25:'收货人手机：',
                    26: resp[1].data[i].receiverMobile ,     //收货人手机
                    27:'商家电话：',
                    28: resp[1].data[i].phone,//商家手机
                    29:'收货人电话：',
                    30:resp[1].data[i].receiverTel,     //收货人电话
                    31:'商家邮箱：',
                    32:resp[1].data[i].email  //商家email
                    //totalRMB: resp[1].data[i].totalMoney,//总金额
                    //Amt: resp[1].data[i].favourMoney,  //优惠金额
                    //ctime: resp[1].data[i].createTime ,   //订单创建时间
                    //source: resp[1].data[i].source,     //订单来源
                    //paySt: resp[1].data[i].payStatus,//支付状态
                    //payRMB: resp[1].data[i].payMoney,  //支付金额
                    //ptime: resp[1].data[i].paytime ,   //支付时间
                    //tNo: resp[1].data[i].transactionNo,     //交易流水号
                    //payt:resp[1].data[i].paytool,     //支付方式
                    //enname: resp[1].data[i].enterprise,     //商家名称
                    //tel: resp[1].data[i].phone,//商家手机
                    //emails:resp[1].data[i].email,  //商家email
                    //mNO: resp[1].data[i].membername ,   //商家账户
                    //rname: resp[1].data[i].receiverName,     //收货人
                    //rtel: resp[1].data[i].receiverTel,     //收货人手机
                    //rmtel: resp[1].data[i].receiverMobile     //收货人电话
                });
            }
            dailyArray[0]=orderArray;
            dailyArray[1]=productData;
            console.log(dailyArray);
            res.json({result:true,code:0,message:"success",data:dailyArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

module.exports = server;