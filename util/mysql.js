/***
 * mysql.js
 * //code by rain.xia xiashan17@163.com
 */

var mysql = require('mysql');
var async = require('async');

//配置文件
var config = require('../configuration.json');

var pool = mysql.createPool(config.mysql);

const codeMap = {};

codeMap.transactionSuccess = {result: true, code: 0, message: "事物处理成功."};
codeMap.deleteSuccess = {result: true, code: 0, message: "查询成功."};
codeMap.updateSuccess = {result: true, code: 0, message: "修改成功."};
codeMap.insertSuccess = {result: true, code: 0, message: "查询成功."};
codeMap.selectSuccess = {result: true, code: 0, message: "查询成功."};

codeMap.deleteError = {result: false, code: -1, message: "删除异常."};
codeMap.updateError = {result: false, code: -1, message: "修改异常."};
codeMap.insertError = {result: false, code: -1, message: "添加异常."};
codeMap.selectError = {result: false, code: -1, message: "查询异常."};
codeMap.dbConError = {result: false, code: -1, message: "获取数据库连接失败."};
codeMap.transactionError = {result: false, code: -1, message: "事物处理失败."};
codeMap.callbackError = {result: false, code: -1, message: "参数或者回调异常."};


const getCallbackParamsWithKey = (key, extendsJson)=> {
    let resp = codeMap[key];
    if (extendsJson) {
        resp = Object.assign(resp, extendsJson);
    }
    return resp;
};

const getType = (sql) => {
    var str = sql.replace(/(^\s*)|(\s*$)/g, "");
    if (/^(select|SELECT)/.test(str)) {
        return "select";
    } else if (/^(insert|INSERT)/.test(str)) {
        return "insert";
    } else if (/^(update|UPDATE)/.test(str)) {
        return "select";
    } else {
        return "delete";
    }
};

const getCallbackParamsWithSql = (sql, issuccess, extendsJson) => {
    let resp = issuccess ? codeMap[getType(sql) + "Success"] : codeMap[getType(sql) + "Error"];
    if (extendsJson) {
        resp = Object.assign(resp, extendsJson);
    }
    return resp;
};

const isFunction = (obj) => {
    return toString.call(obj) === '[object Function]';
};

/**
 * var sqlParamsEntity = [];
 var sql1 = "insert table set a=?, b=? where 1=1";
 var param1 = {a:1, b:2};
 sqlParamsEntity.push(_getNewSqlParamEntity(sql1, param1));

 var sql2 = "update ...";
 sqlParamsEntity.push(_getNewSqlParamEntity(sql1, []));
 * @param sql
 * @param params
 * @param callback
 * @returns {*}
 * @private
 */
exports._getNewSqlParamEntity = (sql, params, callback) => {
    if (callback) {
        return callback(null, {
            sql: sql,
            params: params
        });
    }
    return {
        sql: sql,
        params: params
    };
};


exports.execTrans = (sqlparamsEntities, callback) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error('ERROR:02001##获取数据库连接失败. [connect] - ' + err);
            return callback(getCallbackParamsWithKey("dbConError"));
        }
        connection.beginTransaction(function (err) {
            if (err) {
                return callback(getCallbackParamsWithKey("transactionError"));
            }
            console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
            var funcAry = [];
            sqlparamsEntities.forEach(function (sql_param) {
                var temp = function (cb) {
                    var sql = sql_param.sql;
                    var param = sql_param.params;
                    console.log("sql=" + sql);
                    console.log("param=" + JSON.stringify(param));
                    connection.query(sql, param, function (tErr) {
                        if (tErr) {
                            connection.rollback(function () {
                                console.log("单条sql事务失败，" + sql_param + "，ERROR：" + tErr);
                                //throw tErr;
                                return callback(getCallbackParamsWithKey("transactionError"));
                            });
                        } else {
                            return cb(null, 'ok');
                        }
                    })
                };
                funcAry.push(temp);
            });

            async.series(funcAry, function (err) {
                console.log("transaction error: " + err);
                if (err) {
                    connection.rollback(function (err) {
                        console.log("transaction error: " + err);
                        connection.release();
                        return callback(getCallbackParamsWithKey("transactionError"));

                    });
                } else {
                    connection.commit(function (err, info) {
                        console.log("transaction info: " + JSON.stringify(info));
                        if (err) {
                            console.log("执行事务失败，" + err);
                            connection.rollback(function (err) {
                                console.log("transaction error: " + err);
                                connection.release();
                                return callback(getCallbackParamsWithKey("transactionError"));
                            });
                        } else {
                            connection.release();
                            try {
                                return callback(getCallbackParamsWithKey("transactionSuccess"));
                            } catch (e) {
                                return callback(getCallbackParamsWithKey("callbackError", {message: e.message}));
                            }
                        }
                    })
                }
            })
        });
    });
};


exports.query = (sql, params,callback) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.error('ERROR:02001##获取数据库连接失败. [connect] - ' + err);
            return callback(getCallbackParamsWithKey("dbConError"));
        }
        //console.log('Database server is connected successfully!');

        var hasNoParams = isFunction(params);
        callback = hasNoParams ? params : callback;
        params = hasNoParams ? null : params;
        console.log('Statement: [%s]', sql);
        console.log('params: [%s]', params);
        var type = getType(sql);
        if (type == 'select') {
            conn.query(sql, params, (err, rows, fields) => {
                conn.release();
                if (err) {
                    return callback(getCallbackParamsWithSql(sql, false));
                } else {
                    return callback(getCallbackParamsWithSql(sql, true, {data: rows, fields: fields}));
                }
            });
        } else {
            conn.query(sql, params, (err, result) => {
                conn.release();
                if (err) {
                    console.log('sql false');
                    return callback(getCallbackParamsWithSql(sql, false));
                } else {
                    console.log('sql success');
                    var extendsJson = null;
                    if (type == 'update') {
                        extendsJson = result.changedRows;
                    } else if (type == 'update') {
                        extendsJson = result.affectedRows;
                    } else {
                        extendsJson = result.insertId;
                    }
                    try {
                        return callback(getCallbackParamsWithSql(sql, true, {data: extendsJson}));
                    } catch (e) {
                        return callback(getCallbackParamsWithKey("callbackError", {message: e.message}));
                    }
                }
            });
        }
    });
};


exports.queryMultiple = (sqlparamsEntities, callback) => {
    pool.getConnection((err, conn) => {
        if (err) {
            console.error('ERROR:02001##获取数据库连接失败. [connect] - ' + err);
            return callback(getCallbackParamsWithKey("dbConError"));
        }

        var funcAry = [];
        sqlparamsEntities.forEach(function (sql_param) {
            if(! /^(select|SELECT)/.test(sql_param.sql)){
                return callback(getCallbackParamsWithKey("callbackError"));
            }
            var temp = function (cb) {
                var sql = sql_param.sql;
                var param = sql_param.params;
                console.log("sql=" + sql);
                console.log("param=" + JSON.stringify(param));
                conn.query(sql, param, function (err, rows, fields) {
                    if (err) {
                        //throw err;
                        return callback(getCallbackParamsWithKey("selectError"));
                    }else {
                        return cb(null, {data:rows,fields:fields});
                    }
                });
            };
            funcAry.push(temp);
        });

        async.parallel(funcAry, function(err, results) {
            conn.release();
            if(err){
                return callback(getCallbackParamsWithKey("selectError"));
            }else{
                try {
                    return callback(getCallbackParamsWithKey("selectSuccess", results));
                } catch (e) {
                    return callback(getCallbackParamsWithKey("callbackError", {message: e.message}));
                }
            }
        });

    });
};





