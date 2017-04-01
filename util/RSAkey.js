var fs= require('fs');
var path = require('path');

module.exports = (function(){
    var private = '';//在函数内声明一个变量，作用域是函数内

    return function(){ //返回的一个function能访问到_value，所以_value并不是global级别的变量，但是可以通过这个接口访问到
        if(private=='') {
            var paths = path.resolve(__dirname,'../rsa_prvate.key');
            fs.readFile(paths, 'utf-8', function (err, data) {
                private = data;
                if(private.length!=0){
                    console.log("success read RSA file");
                }
                return private;
            });
        }else{
            return private;
        }
    };

})();//一个立即执行的匿名函数