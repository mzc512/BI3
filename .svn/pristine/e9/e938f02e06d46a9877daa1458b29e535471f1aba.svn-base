
var NodeRSA = require('node-rsa');
/**
 * 加密
 * @constructor
 */
exports.RSAencrypt =(before,privatevalue)=>{
    var privatekey= new NodeRSA(privatevalue);
    var after = privatekey.encrypt(before, 'base64');
    return after;
}

/**
 *解密
 * @constructor
 */
exports.RSAdecrypt =(after,privatevalue)=>{
    try{
        var privatekey= new NodeRSA(privatevalue);
        var before = privatekey.decrypt(after, 'utf8');
        return before;
    }catch(e){
        console.log(e.message);
        return before;
    }
}