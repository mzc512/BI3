//code by rain.xia xiashan17@163.com
var tools= require("../util/tools");
var httpclient= require("../util/httpclient");
var config = require('../configuration.json');
var casfig = config.cas_server;

var interceptor =(req, res, next) => {
    var passUrl = ['/TrafficDaily','/TrafficSource','/trafficSearchTop','/SelectedProvince','/TrafficSystemOSAPP'];//白名单
    var exg = /(.jpg|.png|.gif|.ps|.jpeg|.css|.js|.otf|.eot|.svg|.ttf|.woff)$/;  // static resource pass
    if (exg.test(req.path)) {
        //console.log('static resource');
        return next();
    } else if (req.path.match("/login") || req.path.match("/tologin")) {  //login page pass
        return next();
    } else if(tools.matchArray(req.path,passUrl)){ //不用登陆白名单
        return next();
    } else {
        var systemkey = config.systemkey;
        if (req.session && req.session[systemkey] && req.session[systemkey].user) {
            var ipAdress= tools.getRemoteHost(req);
            var sesssionId= req.session.id;
            var userId = req.session[systemkey].user.userId;
            var url = casfig.url.checkloginstate+'/'+ipAdress+'/'+systemkey+'/'+sesssionId+'/'+userId;
            var maxAge = config.cookie.maxAge;
            httpclient.httpget(casfig,url,function(r){
                if(r.result){
                    //console.log("req.session.cookie.expires"+req.session.cookie.expires);
                    var checkMenuUrl = casfig.url.getPurviewMenuUrl+'/shortName/'+systemkey+'/userId/'+userId;
                    httpclient.httpget(casfig,checkMenuUrl,function(r2){
                        if(r2.result){
                            if(!tools.matchArray(req.path,r2.data)){  //如果没有限制url访问的，全部通过
                                return next();
                            }else{
                                //跳转到无权限页面
                                res.redirect('/anaweb/nopower.html');
                            }
                        }else{
                            res.send(500, {error: 'server data error'});
                        }
                    });


                }else{
                    //console.log('用户登录状态已经失效');
                    res.redirect('/login');
                }
            });
        } else {
            if(req.headers['x-reqed-with'] =='XMLHttpRequest'){
                var resp = {
                    result: false,
                    message: "NoSession",
                    data: {
                        redirect: "/login"
                    }
                };
                res.json(resp);
            }else{
                res.redirect('/login');
            }
        }
    }
};



module.exports = interceptor;
