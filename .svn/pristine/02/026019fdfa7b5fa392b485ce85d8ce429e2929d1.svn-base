/*
code by vember
 */

var hbase = require('hbase');
var hbconfig = require('../configuration.json');

var hbclient = hbase(hbconfig.hbase);

exports.queryByKey = (tb_name,key,column,option,callback) => {

    hbclient.table(tb_name).row(key).get(column, option,function(error, value) {
        if(error) {
            var resp = {
                result: "error",
                message: "HBASE查询数据库失败"
            };
            callback(resp);
        } else {
            var valArray = [];

            for(var i=0;i<value.length;i++) {
                valArray[value[i].column.toString('utf8')] = value[i].$.toString('utf8');
            }

            var resp = {
                result: "success",
                data: valArray
            };

            try {
                callback(resp);
            } catch(e) {
                console.log('ERROR: HBASE数据库查询结果处理失败\r\n',  e.stack, '\r\n');
                var resp = {
                    result: "error",
                    message: "HBASE数据库查询结果处理失败"
                };
                callback(resp);
            }
        }
    });
};

exports.queryByScan = (tb_name,option,callback) => {
    hbclient.table(tb_name)
        .scan(option, function(error, value) {
            if(error) {
                var resp = {
                    result: "error",
                    message: "HBASE查询数据库失败"
                };
                callback(resp);
            } else {
                var obj={};
                value.forEach(function(item){
                    var key = item.key.toString('utf8');
                    var column = item.column.toString('utf8');
                    var v = item.$.toString('utf8');
                    if(obj[key]){
                        obj[key][column] =v;
                    }else{
                        var oneobj ={};
                        oneobj[column] =v;
                        obj[key]=oneobj;
                    }
                });

                var resultArray =[];
                for(simple in obj){
                    resultArray.push(obj[simple]);
                }

                var resp = {
                    result: "success",
                    data: resultArray
                };
                try {
                    callback(resp);
                } catch(e) {
                    console.log('ERROR: HBASE数据库查询结果处理失败\r\n',  e.stack, '\r\n');
                    var resp = {
                        result: "error",
                        message: "HBASE数据库查询结果处理失败"
                    };
                    callback(resp);
                }
            }
        });
};
