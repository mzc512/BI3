/**
 * Created by Administrator on 2017/3/20.
 */

var async = require('async');
var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var dbhelper = require('../util/mysql');
var sql = require('../sql/productTypeList_sql');
var server =  express();
server.use('/productTypeList', router);

//2017-02-16
//��Ʒ��ά����
/*
 * ��Ʒ��ҵƷ��ͳ���Ż� ���������ݽӿ�
 */

router.get('/method/product/dim/dropdownlist', function(req, res, next) {
    var dim_flg1 = 'I_IND';
    var dim_flg2 = 'D_DIM';

    var sqlParamsEntity= [];
    sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.productManyDim1,[dim_flg1]));
    sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.productManyDim2,[dim_flg2]));

    dbhelper.queryMultiple(sqlParamsEntity,(resp) =>{
        if(resp.result){
            res.send({ result:true,code:0,message:"data success",data:resp});
        }else{
            res.send({result:false,code:-1,message:"data fail"});
        }
    });

});

router.get('/method/product/dim/datalist/startDate/:startDate/endDate/:endDate/distdl/:distdl/distwd/:distwd/distcywd/:distcywd', function(req, res, next) {

    var startDate = req.params.startDate;
    var endDate = req.params.endDate;
    var dim1 =  req.params.distdl;
    var dim2 =  req.params.distwd;
    var dim3 =  req.params.distcywd;
    var src = function (callback) {

        var sqlParamsEntity= [];
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.productGetCol1,[dim1]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.productGetCol2,[dim2]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.productGetCol3,[dim3]));

        dbhelper.queryMultiple(sqlParamsEntity,(resp) =>{
            if(resp.result){
                var dim = '';
                var grp_stat = '';
                var collist = '';
                var tbname = '';
                var sql_stat = '';
                if(resp[1].data[0].Dim_C1 == 'ALL' && resp[2].data[0].Dim_C1 == 'ALL') {
                    if(startDate.length==7||endDate.length==7){
                        dim = "date_format(stat_dt,'%Y-%m-%d') as dim1_nm,";
                        grp_stat = "date_format(stat_dt,'%Y-%m-%d'),";
                    }else{
                        dim = "date_format(stat_dt,'%Y-%m') as dim1_nm,";
                        grp_stat = "date_format(stat_dt,'%Y-%m'),";
                    }
                }

                for(var i=1; i<3;i++) {
                    if(resp[i].data[0].Dim_C1 == 'ALL' || resp[i].data[0].Dim_C1 == undefined) {
                        dim = dim + '';
                        grp_stat = grp_stat + '';
                    } else {
                        if (resp[1].data[0].Dim_C1 == 'ALL') {
                            dim = dim + resp[i].data[0].Dim_C1 + ' as dim1,';
                        } else if (i==1) {
                            dim = dim + resp[i].data[0].Dim_C1 + ' as dim1,';
                        } else {
                            dim = dim + resp[i].data[0].Dim_C1 + ' as dim2,'
                        }
                        grp_stat = grp_stat + resp[i].data[0].Dim_C1 + ',';
                    }
                    if(resp[i].data[0].Dim_C2 == 'ALL'|| resp[i].data[0].Dim_C2 == undefined) {
                        dim = dim + '';
                        grp_stat = grp_stat + '';
                    } else {
                        if (resp[1].data[0].Dim_C2 == 'ALL') {
                            dim = dim + resp[i].data[0].Dim_C2 + ' as dim1_nm,';
                        } else if (i==1) {
                            dim = dim + resp[i].data[0].Dim_C2 + ' as dim1_nm,';
                        } else {
                            dim = dim + resp[i].data[0].Dim_C2 + ' as dim2_nm,'
                        }
                        grp_stat = grp_stat + resp[i].data[0].Dim_C2 + ',';
                    }
                }
                collist = dim + 'SUM(' + resp[0].data[0].Dim_C1 + ') as amt';


                    tbname = resp[0].data[0].Dim_C3;


                if(startDate.length==7){
                    startDate=startDate+'-01';
                }
                if(endDate.length==7){
                    endDate=endDate+'-31';
                }

                sql_stat = "select " + collist + " from " + tbname +
                " where stat_dt between " + mysql.escape(startDate) + " and " + mysql.escape(endDate) +
                " group by " + grp_stat.substring(0,grp_stat.length-1) + ";";
               //console.log(sql_stat,'aaaaaaaa');
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
                message: "ϵ�в�ѯʧ��"
            };
        } else {
            res.send({ result:true,code:0,message:"data success",data:result});
        }
    });
});

//2017-02-21
//��Ʒ��ά����
/*
 * ��Ʒ��ҵƷ��ͳ���Ż� ��ת���ݽӿ�
 */

router.get('/method/product/dim/clickdata/startDate/:startDate/endDate/:endDate/distdl/:distdl/distwd/:distwd/distcywd/:distcywd/val1/:val1/val2/:val2', function(req, res, next) {

    var startDate = req.params.startDate;
    var endDate = req.params.endDate;
    var dim1 =  req.params.distdl;
    var dim2 =  req.params.distwd;
    var dim3 =  req.params.distcywd;
    var dim4 =  req.params.val1;
    var dim5 =  req.params.val2;

    var src = function (callback) {

        var sqlParamsEntity= [];
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.productGetCol1,[dim1]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.productGetCol2,[dim2]));
        sqlParamsEntity.push(dbhelper._getNewSqlParamEntity(sql.productGetCol3,[dim3]));

        dbhelper.queryMultiple(sqlParamsEntity,(resp) =>{
            if(resp.result){
                var dim = '';
                var grp_stat = '';
                var collist = '';
                var tbname = '';
                var sql_stat = '';
                var andes='';

                for(var i=1; i<3;i++) {
                    if(resp[i].data[0].Dim_C1 == 'ALL' || resp[i].data[0].Dim_C1 == undefined) {
                        dim = dim + '';
                        grp_stat = grp_stat + '';
                        andes=andes+ '';
                    } else {
                        if (resp[1].data[0].Dim_C1 == 'ALL') {
                            dim = dim + resp[i].data[0].Dim_C1 + ' as dim1,';
                            andes=andes+ '';
                            if(dim5=='ALL'|| dim5 == undefined){
                                andes=andes+ '';
                            }else{
                                andes=andes+ '  AND '+resp[i].data[0].Dim_C1 + '= "'+dim5+'" ';
                            }

                        } else if (i==1) {
                            dim = dim + resp[i].data[0].Dim_C1 + ' as dim1,';
                            if(dim4=='ALL'|| dim4 == undefined){
                                andes=andes+ '';
                            }else{
                                andes=andes+ '  AND '+resp[i].data[0].Dim_C1 + '= "'+dim4+'" ';
                            }
                        } else {
                            dim = dim + resp[i].data[0].Dim_C1 + ' as dim2,';
                            if(dim5=='ALL'|| dim5 == undefined){
                                andes=andes+ '';
                            }else{
                                andes=andes+ '  AND '+resp[i].data[0].Dim_C1 + '= "'+dim5+'" ';
                            }
                        }
                        if(dim2=='D_D00'|| dim3=='D_D00'){
                            grp_stat = resp[i].data[0].Dim_C1+',';
                        }else{
                            grp_stat = grp_stat + resp[i].data[0].Dim_C1 + ',';
                        }
                    }
                    if(resp[i].data[0].Dim_C2 == 'ALL'|| resp[i].data[0].Dim_C2 == undefined) {
                        dim = dim + '';
                        grp_stat = grp_stat + '';
                    } else {
                        if (resp[1].data[0].Dim_C2 == 'ALL') {
                            dim = dim + resp[i].data[0].Dim_C2 + ' as dim1_nm,';
                        } else if (i==1) {
                            dim = dim + resp[i].data[0].Dim_C2 + ' as dim1_nm,';
                        } else {
                            dim = dim + resp[i].data[0].Dim_C2 + ' as dim2_nm,'
                        }
                        if(dim2=='D_D00'|| dim3=='D_D00'){
                            grp_stat ="date_format(stat_dt,'%Y-%m-%d'),"+grp_stat+ resp[i].data[0].Dim_C2  +',' ;
                        }else{
                            grp_stat = grp_stat + resp[i].data[0].Dim_C2 + ',';
                        }

                    }
                }

                if(dim2=='D_D00'|| dim3=='D_D00'){
                    collist = dim + " date_format(stat_dt,'%Y-%m-%d') as stat_dt, SUM(" + resp[0].data[0].Dim_C1 + ") as amt";
                }else{
                    if(dim4=='ALL'|| dim5=='ALL'){
                        grp_stat = grp_stat + '';
                    }else{
                        dim = dim +" date_format(stat_dt,'%Y-%m-%d') as stat_dt, ";
                        grp_stat ="date_format(stat_dt,'%Y-%m-%d'),"+grp_stat ;
                    }
                    collist = dim + 'SUM(' + resp[0].data[0].Dim_C1 + ') as amt';
                }

                    tbname =  resp[0].data[0].Dim_C3;

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
                message: "ϵ�в�ѯʧ��"
            };
        } else {
            res.send({ result:true,code:0,message:"data success",data:result});
        }
    });
});

module.exports = server;
