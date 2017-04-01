var http = require('http');
var qs = require('querystring');


const isFunction = (obj) => {
    return toString.call(obj) === '[object Function]';
};

//http get Cores
module.exports.httpget = (serverconf,url,data,callback) =>{

    if(isFunction(data)){
        callback = data;
    }else{
        url= url+'?'+qs.stringify(data);
    }

    var options = {
        hostname: serverconf.hostname,
        port: serverconf.port,
        path: url,
        method: 'GET',
        headers: {
            'Referer':serverconf.client['Referer'],
            'User-Agent':serverconf.client['User-Agent'],
            'Cache-Control':'no-cache'
        }
    };

    var req = http.request(options, function (res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            callback(JSON.parse(chunk));
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback({result:false,code:-2,message:'server error!'});
    });

    req.end();
};

//http post Cors
module.exports.httppost = (serverconf,url,data,callback) =>{
    var content = qs.stringify(data);

    var options = {
        hostname: serverconf.hostname,
        port: serverconf.port,
        path: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer':serverconf.client['Referer'],
            'User-Agent':serverconf.client['User-Agent'],
            'Cache-Control':'no-cache'
        }
    };

    var req = http.request(options, function (res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            callback(JSON.parse(chunk));
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        callback({result:false,code:-2,message:'server error!'});
    });

// write data to request body
    req.write(content);

    req.end();
};