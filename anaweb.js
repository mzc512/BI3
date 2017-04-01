/***
 * anaweb.js
 */

var express = require('express');
var favicon = require('serve-favicon');
var compression = require('compression');
var log4js = require('log4js');
var redis = require('redis');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var order = require('./order');
//var login = require('./login');
var main = require('./routes/main');
var selfAnalysis = require('./routes/selfAnalysis');
var orderTypeListRouter = require('./routes/orderTypeListRouter');
var interceptor = require('./routes/interceptor');
var userAnalysisRouter = require('./routes/userAnalysisRouter');
var trafficRouter = require('./routes/trafficRouter');
var dashboard = require('./routes/dashboard');
var userDashboard = require('./routes/userDashboard');
var productTypeListRouter = require('./routes/productTypeListRouter');

var session = require('express-session');
var RedisStrore = require('connect-redis')(session);

var Path = require('path');
var fs = require('fs');
//var kafkaSender = require('./kafka/kafkaSender');

//配置文件
var config = require('./configuration.json');


//日志配置
log4js.configure({
    appenders:[
        {
            type: 'console'
        },
        {
            type: 'file',
            filename: config.log4js.filename,
            maxLogSize: config.log4js.maxLogSize,
            backups: 3,
            category: 'normal'
        }
    ]
});


var app = express();
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//添加日志中间件`
var logger = log4js.getLogger('normal');
logger.setLevel('DEBUG');
app.use('/', log4js.connectLogger(logger, {level: 'auto'}));

app.use(session({
    name : "sid",
    secret : 'Asecret123-',
    resave : true,
    rolling:true,
    saveUninitialized : false,
    cookie : config.cookie,
    store : new RedisStrore(config.sessionStore)
}));


app.set('view engine', 'ejs');
app.use(interceptor);
app.use('/anaweb', express.static('public'));

app.use(order);
//app.use(login);
app.use(main);
app.use(selfAnalysis);
app.use(userAnalysisRouter);
app.use(trafficRouter);
app.use(orderTypeListRouter);
app.use(dashboard);
app.use(userDashboard);
app.use(productTypeListRouter);

/***
 * 分析报告
 * 5802001
 */
app.get('/report/*.html', (request, response) => {

    //console.log("%s00000##path=[%s]", "5802001", request.path);

    var path = request.path;
    var fileName = path.slice(path.lastIndexOf('/')+1, path.indexOf('.html'));
    ////console.log("fileName: %s", fileName);

    //console.log("%s00000##json -- ", "5802001");
    //console.log(reportmenu);

    var jsFilePath = fileName +'.js';

    var realPath = Path.resolve('public/js', jsFilePath);

    var isRealExist = fs.existsSync(realPath);


    //if (reportmenu) {
    //    var reportlist = reportmenu.filter((item) => {
    //        return item.name === fileName;
    //    });
    //}
    if(isRealExist){
        response.render('charts', {'title':'','scriptfile':'/anaweb/js/'+jsFilePath});
    }else{
        response.status(403).send("'" + request.path + "' NOT FOUND.");
    }

    //if (!reportlist || reportlist.length == 0) {
    //    response.status(403).send("'" + request.path + "' NOT FOUND.");
    //    return;
    //}

    //response.render('charts', {'title':reportlist[0].title,'scriptfile':reportlist[0].script});
});

//use command "sudo node api.js" while running on ubuntu because of the 80 port.
var server = app.listen(config.port, function() {

    var host = server.address().address;
    var port = server.address().port;

    //console.log("server is running on http://%s:%s", host, port);
});

process.on('uncaughtException', (err) => {
    //console.error("UncaughtException === ");
    //console.error(err);
});
