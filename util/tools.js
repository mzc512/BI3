//code by rain.xia xiashan17@163.com


var basetools = require("./basetool");
/**
 * p property 判断是否有这个属性
 * i item 判断数组中是否有第几号数组
 * t type
 * l length 判断是否为为空
 * @param data
 * @param option
 * @returns {boolean}
 */

exports.validateJOSN = (data,option) =>{
    for(let i= 0,len= option.length ;i<len;i++){
        var op= option[i];
        switch (op.t) {
            case   "p":
                if(!(op.v in data)){
                    return false;
                }
                data= data[op.v];
                break;
            case   "i":
                if(data.length< (op.v+1)){
                    return false;
                }
                data= data[op.v];
                break;
            case   "l":
                if(data.length==0){
                    return false;
                }
                break;
            default:
                if(!(op.v in data)){
                    return false;
                }
                data= data[op.v];
                break;
        }
    }
    return true;
};

exports.validateJOSNParams = (data) =>{
    var props = Reflect.ownKeys(data);
    //var nohasProp = props.find((n)=>{
    //    return !data[n]
    //});
    var vailidate =true;
    props.forEach((n)=>{
        if(!data[n] && data[n]!=0){
            vailidate=false;
        }
    });
    return vailidate;
};


exports.getRemoteHost =(request) =>{
    var ip = request.headers["x-forwarded-for"];
    if(!ip || basetools.equalsIgnoreCase("unknown",ip)){
        ip = request.headers["Proxy-Client-IP"];
    }
    if(!ip || basetools.equalsIgnoreCase("unknown",ip)){
        ip = request.headers["WL-Proxy-Client-IP"];
    }
    if(!ip || basetools.equalsIgnoreCase("unknown",ip)){
        ip =  request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    }
    //console.log("ip="+ip);
    if(ip=='::1'){
        ip='127.0.0.1';
    }else{
        ip=ip.replace(/^.*:/, '');
    }
    return ip;
};

exports.timeStamp =(distancetime) =>{
    var sec = Math.floor(parseInt(distancetime)/1000%60);
    var min = Math.floor(parseInt(distancetime)/1000/60%60);
    var hour =Math.floor(parseInt(distancetime)/1000/60/60%24);
    if(sec<10){
        sec = "0"+ sec;
    }
    if(min<10){
        min = "0"+ min;
    }
    if(hour<10){
        hour = "0"+ hour;
    }

    return hour + ":" +min + ":" +sec ;
};

exports.getDate =(datestr) =>{
    var temp = datestr.split("-");
    var date = new Date(temp[0],temp[1],temp[2]);
    return date;
};

exports.getDifferDate =(start,end) =>{
    var reArray = [];
    var startTime = exports.getDate(start);
    var endTime = exports.getDate(end);
    while((endTime.getTime()-startTime.getTime())>=0){
        var year = startTime.getFullYear();
        var month = startTime.getMonth().toString().length==1?"0"+startTime.getMonth().toString():startTime.getMonth();
        var day = startTime.getDate().toString().length==1?"0"+startTime.getDate():startTime.getDate();
        reArray.push(year+''+month+''+day);
        startTime.setDate(startTime.getDate()+1);
    }
    return reArray;
};

exports.formatDay =(date) =>{
    var date = new Date(date);
    var m = date.getMonth()+1;
    var d = date.getDate();
    if(m<10){
        m = '0'+m;
    }
    if(d<10){
        d = '0'+d;
    }
    return date.getFullYear() + '' + m + '' + d;
};

exports.stringDay =(date) =>{
    var date = new Date(date);
    var m = date.getMonth()+1;
    var d = date.getDate();
    if(m<10){
        m = '0'+m;
    }
    if(d<10){
        d = '0'+d;
    }
    return date.getFullYear() + '-' + m + '-' + d;
};
exports.getNextDay=(date) =>{
    var date = new Date(date);
    date.setDate(date.getDate() + 1);
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
}

exports.getYearWeek =(dateString) =>{

    var da = this.stringDay(dateString);//日期格式2015-12-30
    //当前日期
    var date1 = new Date(da.substring(0,4), parseInt(da.substring(5,7)) - 1, da.substring(8,10));
    //1月1号
    var date2 = new Date(da.substring(0,4), 0, 1);
    //获取1月1号星期（以周一为第一天，0周一~6周日）
    var dateWeekNum=date2.getDay()-1;
    if(dateWeekNum<0){dateWeekNum=6;}
    if(dateWeekNum<4){
        //前移日期
        date2.setDate(date2.getDate()-dateWeekNum);
    }else{
        //后移日期
        date2.setDate(date2.getDate()+7-dateWeekNum);
    }
    var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    if(d<0){
        var date3 = (date1.getFullYear()-1)+"-12-31";
        return this.getYearWeek(date3);
    }else{
        //得到年数周数
        var year=date1.getFullYear();
        var week=Math.ceil((d+1 )/ 7);
        var reArray = [];
        reArray[0] = year;
        reArray[1] = week;
        return reArray;
    }
}

//通过正则匹配查看是否存在
exports.matchArray =(search,array) =>{
    for(var i in array){
        if (search.match(array[i])){
            return true;
        }
    }
    return false;
};
/**
 * path 如  a.b.c  最后值为obj[a][b][c]
 * @param obj
 * @param path
 * @returns {*}
 */
exports.getValueByPath = (obj,path) =>{
    var arr = path.split(".");
    while(arr.length!=0){
        var key = arr.shift();
        if(obj[key]){
            obj = obj[key];
        }else{
            return {};
        }
    }
    return obj;
};

exports.buildObjByPath = (value,path) =>{
    var arr = path.split(".");
    for(var len = arr.length,i=len-1;i>=0;i--){
        var key = arr[i];
        var temp = {};
        temp[key] = value;
        value = temp;
    }
    return value;
};