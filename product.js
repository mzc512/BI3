/***
 * router.js
 */

var express = require('express');
var mysql = require('mysql');
var moment = require('moment');
var mysqlapi = require('./mysql');

var mysqlConfig = {
	host:'nn',
    user:'logana',
    password:'123',
    database:'csc_anasys'
};

var router = express.Router();

router.use(function timeLog(req, res, next) {
	next();
});


/**********************************************************************************************************************
 * 商品统计分析
 *
 */

/***每日产品发布数量*/
router.get('/method/ProductPublishDaily/begin/:begin/end/:end', function(req, res) {

	//var resp = {};

	var beginDate = req.params.begin;
	var endDate = req.params.end;

	//console.log("method=%s,beginDate=%s,endDate=%s", "ProductPublishDaily", beginDate, endDate);

	var conn = mysql.createConnection(mysqlConfig);

	conn.connect(function(err) {
	
		if (err) {
			console.log('ERROR: [connect] - ' + err);
			var resp = {
				result: "error",
				message: "Could not connect database: " + err
			};
			res.send(JSON.stringify(resp));
			return;        
		}
	
		console.log('connected successfully!');
	});

	conn.query('SELECT Crt_Dt,SUM(Prd_Num) AS Num FROM prd_num_day WHERE Crt_Dt BETWEEN "' + beginDate + '" AND "' + endDate + '" GROUP BY Crt_Dt ORDER BY Crt_Dt ASC', 
		function(err, rows, fields) {

		if (err) {
			console.log('ERROR: [select] - ' + err);
			var resp = {
				result: "error",
				message: "Fail to query database: " + err
			};
			res.send(JSON.stringify(resp));
			return; 
		}

		try {
			var d1 = new Date();
			d1.setTime(Date.parse(beginDate));
			var d2 = new Date();
			d2.setTime(Date.parse(endDate));

			var prdArray = new Array();
			for (r in rows) {
				console.log('[' + r + '] ' + rows[r].Crt_Dt + ' - ' + rows[r].Num);
				var d = new Date();
				d.setTime(Date.parse(rows[r].Crt_Dt));
				//var d = rows[r].Crt_Dt;
				while(d1.getTime() < d.getTime()) {
					prdArray.push(new Array(moment(d1).format('YYYY-MM-DD'), 0));
					d1.setTime(d1.getTime() + 24*60*60*1000);
				}

				d1 = d;
				prdArray.push(new Array(moment(d1).format('YYYY-MM-DD'), rows[r].Num));
				d1.setTime(d1.getTime() + 24*60*60*1000);	
			}

			while (d1.getTime() <= d2.getTime()) {
				prdArray.push(new Array(moment(d1).format('YYYY-MM-DD'), 0));
				d1.setTime(d1.getTime() + 24*60*60*1000);
			}

			resp = {
				result: "success",
				data: prdArray
			};

			console.log(JSON.stringify(resp));
			res.json(resp);
		
		} catch (e) {
			console.log('\r\n',  e.stack, '\r\n');
		}
	});
	
	conn.end(function(err) {

		if (err) {
			console.log('ERROR: [disconnect] - ' + err);
			return;
		}
	
		console.log('disconnected successfully!');
	});
		
});

module.exports = router;
