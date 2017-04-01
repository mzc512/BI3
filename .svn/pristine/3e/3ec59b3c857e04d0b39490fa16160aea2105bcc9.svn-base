var dbhelper = require('../util/mysql');
var sql = require('../sql/dashboard-sql');
var httpclient = require("../util/httpclient");
var businessTools = require('../util/businessTools');

var config = require('../configuration.json');
var casfig = config.cas_server;
casfig.port="5555";

var kafka = require('kafka-node');
var connectionString = 'tdata215:2181/k1';
var clientId = 'kafka-node-client';
var zkOptions = {
    sessionTimeout: 30000,
    spinDelay: 1000,
    retries: 0
};
var noAckBatchOptions = {noAckBatchSize: null, noAckBatchAge: null};
var sslOptions = null;

var client = new kafka.Client(connectionString, clientId, zkOptions, noAckBatchOptions, sslOptions);

var Consumer = kafka.Consumer,
    consumer = new Consumer(
        client,
        [
            {
                topic: 'pageview',
                offset: 0
            }
        ],
        {
            groupId: 'dailyGroupChart',//consumer group id, default `kafka-node-group`
            // Auto commit config
            autoCommit: true,
            autoCommitIntervalMs: 5000,
            // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
            fetchMaxWaitMs: 100,
            // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
            fetchMinBytes: 1,
            // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
            fetchMaxBytes: 1024 * 1024,
            // If set true, consumer will fetch message from the given offset in the payloads
            fromOffset: false,
            // If set to 'buffer', values will be returned as raw buffer objects.
            encoding: 'utf8'
        }
    );

consumer.on('message', function (message) {
    console.log(message);
    if(message.topic='1'){  //会员总数  =历史会员加上新增会员
        dbhelper.query(sql.getMemberCount,(resp) =>{
            if(resp.result){
                var num = message+resp.data[0].num;
                var url= '/api.php?page=anaweb&chart=initMemberCount&data={"num":'+num+'}';
                httpclient.httpget(casfig, url, function (r) {
                    if (r.result) {
                        console.log(message);
                    }
                });

            }
        });
    }else if((message.topic='2')){ //总CMV = 历史GMV +新增GMV
        var caiYearInfo = businessTools.getCaiYearInfo();
        var param = caiYearInfo.timeAcross;
        dbhelper.query(sql.getCurrentYearSummary1,[param],(resp) =>{
            if(resp.result){
                var num = message+resp.data[0].order_amt_gmv;
                var url= '/api.php?page=anaweb&chart=initGmvAll&data={"num":'+num+'}';
                httpclient.httpget(casfig, url, function (r) {
                    if (r.result) {
                        console.log(message);
                    }
                });
            }
        });

    }else if((data.topic='3')){  //今日GMV数据
        var num = message;
        var url= '/api.php?page=anaweb&chart=todayGmvl&data={"num":'+num+'}';
        httpclient.httpget(casfig, url, function (r) {
            if (r.result) {
                console.log(message);
            }
        });
    }else if((data.topic='4')){  //今日新增会员
        var num = message;
        var url= '/api.php?page=anaweb&chart=memberUpToday&data={"num":'+num+'}';
        httpclient.httpget(casfig, url, function (r) {
            if (r.result) {
                console.log(message);
            }
        });
    }else if((data.topic='5')){  //在线会员
        var num = message;
        var url= '/api.php?page=anaweb&chart=memberOnline&data={"num":'+num+'}';
        httpclient.httpget(casfig, url, function (r) {
            if (r.result) {
                console.log(message);
            }
        });
    }

});

consumer.on('error', function (err) {
    console.log('12'+err);
});
