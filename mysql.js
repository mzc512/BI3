/***
 * mysql.js
 */
var express = require('express');
var mysql = require('mysql');

//配置文件
var config = require('./configuration.json');


var pool = mysql.createPool(config.mysql);

exports.queryHandler = (req, res, srvId, sql, callback) => {
	
	pool.getConnection((err, conn) => {
		if (err) {
			console.error('ERROR: ' + srvId + '02001##获取数据库连接失败. [connect] - ' + err);
			var resp = {
				result: "error",
				message: srvId + "02001##获取数据库连接失败."
			};
			res.send(JSON.stringify(resp));
			return;
		}

		//console.log('Database server is connected successfully!');
		console.log('Statement: [%s]', sql);

		conn.query(sql, (err, rows, fields) => {
			
			do {
				if (err) {
					console.log('ERROR: ' + srvId + '02003##查询数据库失败. [select] - ' + err);
					var resp = {
						result: "error",
						message: srvId + "02003##查询数据库失败."
					};
					res.send(JSON.stringify(resp));
					break; 
				}
				
				try {		
					callback(rows, fields);
				} catch (e) {
					console.log('ERROR: ' + srvId + '03001##数据库查询结果处理失败.\r\n',  e.stack, '\r\n');
					var resp = {
						result: "error",
						message: srvId + "03001##数据库查询结果处理失败."
					};
					res.send(JSON.stringify(resp));
					break; 
				}

			} while (false);

			conn.release();
			//console.error('ERROR: ' + srvId + '02002##断开数据库服务器连接失败. [disconnect] - ' + err);
			//console.log('Database connection is released successfully!');
		});

	});
}


exports.queryHandlers = (req, res, srvId, options, callbacks) => {
	
	pool.getConnection((err, conn) => {
		if (err) {
			console.error('ERROR: ' + srvId + '02001##获取数据库连接失败. [connect] - ' + err);
			var resp = {
				result: "error",
				message: srvId + "02001##获取数据库连接失败."
			};
			res.send(JSON.stringify(resp));
			return;
		}

		//console.log('Database server is connected successfully!');
		console.log('Statement: [%s]', options.sql);
		conn.query(options, (err, tables, fields) => {

			do {
				if (err) {
					console.error('ERROR: ' + srvId + '02003##查询数据库失败. [select] - ' + err);
					var resp = {
						result: "error",
						message: srvId + "02003##查询数据库失败."
					};
					res.send(JSON.stringify(resp));
					break; 
				}

				//console.log('result: %s', JSON.stringify(tables));
		
				try {
					for (var t in tables) {	
						callbacks[t](tables[t], fields);
					}
				} catch (e) {
					console.error('ERROR: ' + srvId + '03001##数据库查询结果处理失败.\r\n',  e.stack, '\r\n');
					var resp = {
						result: "error",
						message: srvId + "03001##数据库查询结果处理失败."
					};
					res.send(JSON.stringify(resp));
					break; 
				}

			} while (false);

			conn.release();
			//console.error('ERROR: ' + srvId + '02002##断开数据库服务器连接失败. [disconnect] - ' + err);
			//console.log('Database connection is released successfully!');
		});
	});
}
