//code by rain.xia xiashan17@163.com


var express = require('express');
var httpclient= require("../util/httpclient");
var tools= require("../util/tools");
var log4js = require('log4js');
var redis = require('../util/redis');
//配置文件
var config = require('../configuration.json');
var defaultUserSetting = require('../defaultUserSetting.json');

var casfig = config.cas_server;

var systemkey = config.systemkey;
const getUserId=(req)=>{
    if(tools.validateJOSN(req.session,[{t:'p',v:systemkey},{t:'p',v:'user'},{t:'p',v:'userId'}])){
        var userId = req.session[systemkey].user.userId;
        return userId;
    }else{
        return false;
    }
};


var loginApp = express();
var router = express.Router();
loginApp.use('/', router);

router.get('/', (req, res, next)=> {
    res.redirect('/login');
});
router.get('/login', (req, res, next)=> {
   res.render('login');
});

router.post('/tologin', (req, res, next)=> {
    var ipAdress= tools.getRemoteHost(req);
    var systemkey = config.systemkey;
    var account = req.body.account;
    var password = req.body.password;
    var sesssionId= req.session.id;
    var loginUrl = req.headers["referer"];
    var data  = {ipAdress:ipAdress,systemkey:systemkey,account:account,password:password,sesssionId:sesssionId,loginUrl:loginUrl};
    if(!tools.validateJOSNParams(data)){
        res.send("参数异常！");
    }else{
        var url = casfig.url.login;
        httpclient.httppost(casfig,url,data,function(r){
            if(r.result){
                req.session[systemkey]={};
                req.session[systemkey].user = {
                    userId: r.data.userId,
                    isAdmin:r.data.isAdmin
                };
                res.redirect('/anaweb/');
            }else{
                var message= '账号锁定/帐号或密码不正确';
                if(r.code!=-1){
                    message= r.message;
                }
                res.render('login',{data:{result:false,message:message}});
            }
        });
    }
});

router.get('/loginout', (req, res) => {
    var userId = getUserId(req);
    if(userId){
        var url = casfig.url.loginout+'/'+systemkey+'/'+userId;
        httpclient.httpget(casfig,url,function(r){
            if(r.result){
                delete req.session[systemkey];
                res.redirect('/login');
            }else{
                //console.log('server exception');
            }
        });
    }else{
        res.redirect('/login');
    }
});



router.get('/getUserBaseInfo', function(req, res, next) {
    var userId = getUserId(req);
    if(userId){
        var url = casfig.url.getUserBaseInfo+'/'+userId;
        httpclient.httpget(casfig,url,function(r){
            if(r.result){
                res.send({result:true,data:r.data});
            }else{
                res.send({result:false,message:'server error'});
            }
        });
    }else{
        res.send({result:false,message:'no session'});
    }
});



router.post('/toupdatepwd', function (req, res, next) {

    var url = casfig.url.modifpwd;
    var userId = getUserId(req);
    if(userId){
        req.body["userId"]=userId;
        httpclient.httppost(casfig, url, req.body, function (r) {
            if (r.result) {
                res.send({result: true, message: '修改成功'});
            } else {
                res.send({result: false, message: r.message});
            }
        });
    }else{
        res.send({result: false, message: '用户已经退出，请重新登录'});
    }
});

router.get('/getTopMenu', function (req, res, next) {
    var userId = getUserId(req);
    var url = casfig.url.getTopMenu+'/shortName/'+systemkey+'/userId/'+userId;
    httpclient.httpget(casfig, url, function (r) {
        if (r.result) {
            res.send({result: true, data: r.data});
        } else {
            res.send({result: false, message: r.message});
        }
    });

});

/**
 * 通过父id 从树中截取一个分支树
 * @param d
 * @param parentId
 * @param data
 */
var queryChildTree = (d, parentId, data)=> {  //
    if(parentId=='0'){
        Object.assign(data, d);
    }else{
        if (d.pageId) {  //判断是数组还是节点  --如果是节点
            if(d.pageId == parentId){
                Object.assign(data, d);
            }
        } else {
            if (d.children) {  //如果有子节点 向下遍历嵌套调用是否子节点中 匹配子节点的规则
                for(let i=0,len= d.children.length;i<len;i++){
                    if(d.children[i]==parentId){
                        Object.assign(data, d);
                        break;
                    }else{
                        queryChildTree(d.children[i], parentId, data);
                    }
                }
            }
        }
    }
};

var getCacheKey = (shortName)=>{
    return shortName+'_'+config.redisKeyPrefix.systemPurviewCacheRefreshTime;
};


router.get('/getLeftMenu/:pageId', function (req, res, next) {
    var parentId = req.params.pageId;
    var userId = getUserId(req);
    var url = casfig.url.getLeftMenu+'/shortName/'+systemkey+'/pageId/'+parentId+'/userId/'+userId;
    var key = systemkey+'_'+userId+'_'+config.redisKeyPrefix.leftMenuKey;
    var cacheTimekey = getCacheKey(systemkey);

    var queryTreeFromServer = ()=>{
        httpclient.httpget(casfig, url, function (r) {
            if (r.result) {
                res.send({result: true, data: r.data});
            } else {
                res.send({result: false, message: r.message});
            }
        });
    };

    redis.get(cacheTimekey,function(r){  //获取系统缓存最后刷新时间
        if(r.result  && r.data){
            var historyTime = r.data;
            redis.hgetall(key,function(r1) {
                if (r1.result && r1.data) {
                    var oldCacheData = r1.data;
                    var currentCacheTime = oldCacheData.time;
                    if(parseFloat(currentCacheTime)<parseFloat(historyTime)) {  //缓存过期
                        queryTreeFromServer();
                    }else{
                        //从缓存中获取data
                        var startData = JSON.parse(oldCacheData.data);
                        var data = {};
                        queryChildTree(startData, parentId, data);
                        if (data.children) {
                            res.send({result: true, code: 0, data: data.children});
                        } else {
                            res.send({result: false, code: -1, message: 'no power'});
                        }

                    }
                } else {
                    queryTreeFromServer();
                }
            });
        }else{
            var nowTime = new Date().getTime();
            redis.set(cacheTimekey,nowTime);
            queryTreeFromServer();
        }
    });
});

const pathKeys = {dashboardDisplay :"dashboard.tabDisplay"} ;
/**
 * pathKey为路径，中间使用.分割  "dashboard.tabDisplay"
 */
router.get('/getUserSetting/pathKey/:pathKey', function (req, res, next) {
    var userId = getUserId(req);
    var url = casfig.url.getUserSetting;
    var pathKey =req.params.pathKey;
    var data = {userId:userId,shortName:systemkey,pathKey:pathKeys[pathKey]};
    httpclient.httppost(casfig, url, data,function (r) {
        if (r.result) {
            if(Object.keys(r.data).length==0){
                res.send({result: true, data: tools.getValueByPath(defaultUserSetting,pathKeys[pathKey])});
            }else{
                res.send({result: true, data: r.data});
            }
        } else {
            res.send({result: false, message: r.message});
        }
    });

});

router.post('/refreshUserSetting/pathKey/:pathKey', function (req, res, next) {
    var userId = getUserId(req);
    var queryUrl = casfig.url.getUserSetting;
    var refreshUrl = casfig.url.refreshUserSetting;
    var pathKey =req.params.pathKey;
    var settingContent = JSON.parse(req.body.settingContent);
    var data = {userId:userId,shortName:systemkey};
    httpclient.httppost(casfig, queryUrl, data,function (r) {
        if (r.result) {
            var postData = tools.buildObjByPath(settingContent,pathKeys[pathKey]);
            if(Object.keys(r.data).length==0){ //该用户没有setting内容
                var data1 =  {userId:userId,shortName:systemkey,settingContent:JSON.stringify(postData)};
                httpclient.httppost(casfig, refreshUrl, data1,function (r1) {
                    if (r.result) {
                        res.send({result: true, data: r.data});
                    }
                });
            }else{
                postData = Object.assign(JSON.parse(r.data),postData);
                var data2 =  {userId:userId,shortName:systemkey,settingContent:JSON.stringify(postData)};
                httpclient.httppost(casfig, refreshUrl, data2,function (r1) {
                    if (r.result) {
                        res.send({result: true, data: r.data});
                    }
                });
            }
        } else {
            res.send({result: false, message: r.message});
        }
    });

});


//获取配置文件中websocket
router.get('/getWebsocket', (req, res) => {
    res.send({result: true, data: config.websocket});
});

module.exports = loginApp;
