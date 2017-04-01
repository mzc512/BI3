/**
 * 单点登录业务操作服务CORES 接口
 * @type {Object|*}
 */

var express = require('express');
var router = express.Router();
var dbhelper = require('../util/mysql');
var sql = require('../sql/selfAnalysis-sql');
var server =  express();
server.use('/selfAnalysis', router);



router.get('/tablelist', function(req, res, next) {

    dbhelper.query(sql.getTableList,function(resp){
        if(resp.result){  //query one item result
            res.send({result:true,code:0,message:"data success",data:resp.data});
        }else{
            res.send({result:false,code:-1,message:"data fail"});
        }
    });
});



router.get('/tableinfo/:tablename', function(req, res, next) {
    var tablename = req.params["tablename"];
    dbhelper.query(sql.getTableInfoByName, [tablename],function(resp) {
        if(resp.result){
            res.send({result:true,code:0,message:"data success",data:resp.data});
        }else{
            res.send({result:false,code:-1,message:"data fail"});
        }
    });
});



module.exports = server;
