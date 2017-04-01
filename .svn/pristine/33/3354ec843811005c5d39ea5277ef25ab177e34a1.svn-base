/***
 * redis.js
 * //code by rain.xia xiashan17@163.com
 */
var redis = require('redis');
var genericPool = require('generic-pool');

//redis配置
var config = require('../configuration.json');

var pool = genericPool.Pool({
    name: 'redis',
    create: (callback) => {
        console.log("redis creates connection.");
        var client = redis.createClient(config.redis);
        client.on('error', (err) => {
            console.error("redis error is emitted: %s", err.code);
            console.error(err);
            callback(err, client);
        });

        client.on('connect', () => {
            console.log("redis is connected: connection_id=%s.", client.connection_id);
            callback(null, client);
        });

        client.on('end', (err) => {
            console.log("redis connection is closed: connection_id=%s.", client.connection_id);
        });
    },
    destroy: (client) => {
        console.log("redis destroys connection.");
        client.quit();
    },
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    log: false
});




//pool.drain(function() {
//    pool.destroyAllNow();
//});


//设置value为单个值
exports.get=(key,callback)=>{
    pool.acquire((err, client) => {
        if (err) {
            callback({result:false,message:'redis get by key error.'});
        }
        client.get(key, (err, data) => {
            if (err) {
                callback({result:false,message:'redis get by key error.'});
            }else{

                pool.release(client);
                callback({result:true,data:data});
            }
        });
    });
};


exports.set=(key,value,callback)=>{
    pool.acquire((err, client) => {
        if (err) {
            callback && callback({result: false, message: 'redis set value error.'});
        }
        client.set(key,value, (err, data) => {
            if (err) {
                callback && callback({result:false,message:'redis set value error.'});
            }else{

                pool.release(client);
                callback && callback({result:true,data:data});
            }
        });
    });
};

//设置value为一个对象
//NOTE: obj key and value will be coerced to strings
exports.hmset=(key,obj,callback)=>{
    pool.acquire((err, client) => {
        if (err) {
            callback && callback({result:false,message:'redis hmset value error.'});
        }
        client.hmset(key,obj, (err, data) => {
            if (err) {
                callback && callback({result:false,message:'redis hmset value error.'});
            }else{

                pool.release(client);
                callback && callback({result:true,data:data});
            }
        });
    });
};


exports.hgetall=(key,callback)=>{
    pool.acquire((err, client) => {
        if (err) {
            callback({result:false,message:'redis hgetall by key error.'});
        }
        client.hgetall(key, (err, data) => {
            if (err) {
                callback({result:false,message:'redis hgetall by key error.'});
            }else{

                pool.release(client);
                callback({result:true,data:data});
            }
        });
    });
};
