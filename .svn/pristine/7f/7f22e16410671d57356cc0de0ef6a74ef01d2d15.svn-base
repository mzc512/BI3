//code by rain.xia xiashan17@163.com


var getChartHeight= function(){
    var containH = $(document).height();  //document height
    var otherH = $("#group").outerHeight(true);  //tab element height
    var toolbarH = 46;                        //datapicker height
    var navtop = $(window.parent.document).find('.nav-top');  // total top element height
    if(navtop.length>0){
        otherH+=navtop;
    }
    otherH+=toolbarH;
    return containH-(otherH?otherH:0);
};



var getChartWidth= function(hasVerticalscollbar){
    var containW = $(document).width(); //document width
    var echartboxMargin =2*8; // chart content with class name echartsBox margine
    var otherW = echartboxMargin;
    var verticalscollbarWidth = 26;  //if has verticalscollbar width minus this width
    if(hasVerticalscollbar){
        otherW += verticalscollbarWidth;
    }
    return containW-(otherW?otherW:0);
};

var getChartSize = function(hasVerticalscollbar){
    if(hasVerticalscollbar){
        return {width: getChartWidth(hasVerticalscollbar),height:getChartHeight()};
    }else{
        return {width: getChartWidth(),height:getChartHeight()};
    }

};

var getScreenSize=function(){
    return {w:screen.width,h:screen.height};
};

var is13metre=function(){
    var size = getScreenSize();
    if(size.w==1280){
        return true;
    }else{
        return false;
    }
};

/*
 * 功能：金额按千位逗号分割
 * 参数：s，需要格式化的金额数值.
 * 参数：type,判断格式化后的金额是否需要小数位.
 * 返回：返回格式化后的数值字符串.
 */
var formatMoney =function(s, type) {
    if (/[^0-9\.]/.test(s)) return "0";
    if (s == null || s == "") return "0";
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    if (type == 0) {  // 不带小数位(默认是有小数位)
        var a = s.split(".");
        if (a[1] == "00") {
            s = a[0];
        }
    }
    return s;
};

//制保留2位小数，如：2，会在2后面补上00.即2.00
var toDecimal2 = function(x,digit) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    var num =2;
    if(digit){
        num= digit;
    }
    while (s.length <= rs + num) {
        s += '0';
    }
    return s;
};
//得到2个小数位的百分百值
var toPercent = function(x,digit) {
    var num ='';
    if(digit){
        num =toDecimal2(x*100,digit);
    }else{
        num =toDecimal2(x*100);
    }
    return num+'%';
};
//获取数组最大值
var maxArrayCell =function(array) {
    var max = array[0];
    for(var i=0,len =array.length;i<len;i++){
        if(max<array[i]){
            max=array[i]
        }
    }
    return max;
};

//获取1年中第几周开始的周结束日期数组
var getStartEndDt = function(year, index) {
    var d = new Date(year, 0, 1);  //设置1月1号为第一周
    var arr = [];

    if (index == 1) {
        while (d.getDay() != 0) {
            var from = d;
            arr.push(from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate());
            d.setDate(d.getDate() + 1);
        }
        if (arr.length < 7) {
            for(var i=arr.length;i<=6;i++) {
                arr[i] = arr[arr.length-1];
            }
        }

        return arr;
    } else {
        while (d.getDay() != 0) {
            d.setDate(d.getDate() + 1);
        }

        var i = 1;
        var to = new Date(year + 1, 0, 1);

        for (var from = d; from < to;) {
            if (i == (index - 1)) {
                arr.push(from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate());
            }
            var j = 6;
            while (j > 0) {
                from.setDate(from.getDate() + 1);
                if (i == (index - 1)) {
                    arr.push(from.getFullYear() + "-" + (from.getMonth() + 1) + "-" + from.getDate());
                }
                j--;
            }
            if (i == (index - 1)) {
                return arr;
            }
            from.setDate(from.getDate() + 1);
            i++;
        }
    }
};

var isLeapYear = function(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

var daysInYear = function(year) {
    return isLeapYear(year) ? 366 : 365;
};

var formatDay2=function(date){
    return date.getFullYear() + '-' + (date.getMonth() + 1)+'-'+date.getDate();
};

var getStartEndDt = function(year, index) {
    var thisY = new Date(year, 0, 1);
    var NextY = new Date(year+1, 0, 1);
    var startDay = thisY.getDay();
    var startOffset =  startDay==0?7:7-startDay;
    var startDayNextY = NextY.getDay();
    var endDay = startDayNextY==0?6:startDayNextY-1;
    var endDayOffset =  endDay+1;
    var weeksInYear = (daysInYear(year)-startOffset-endDayOffset)/7 +2;
    var arr = [];
    var d = new Date(year, 0, 1);
    if(index==1){
        arr.push(formatDay2(d));
        for (var i=1;i<startOffset;i++) {
            d.setDate(d.getDate() + 1);
            arr.push(formatDay2(d));
        }
        if (arr.length < 7) {
            var last = arr[arr.length-1];
            for(var i=arr.length;i<=6;i++) {
                arr.push(last);
            }
        }
        return arr;
    }else if(index == weeksInYear){
        d.setDate(d.getDate() - endDayOffset -1);
        arr.push(formatDay2(d));
        for (var i=1;i<endDayOffset;i++) {
            d.setDate(d.getDate() + 1);
            arr.push(formatDay2(d));
        }
        if (arr.length < 7) {
            var last = arr[arr.length-1];
            for(var i=arr.length;i<=6;i++) {
                arr.push(last);
            }
        }
        return arr;
    }else{
        d.setDate(d.getDate() + startOffset + (index-2)*7);
        arr.push(formatDay2(d));
        for (var i=1;i<7;i++) {
            d.setDate(d.getDate() + 1);
            arr.push(formatDay2(d));
        }
        return arr;
    }
};


/**
 * 将数值四舍五入后格式化.
 *
 * @param num 数值(Number或者String)
 * @param cent 要保留的小数位(Number)
 * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型);
 * @return 格式的字符串,如'1,234,567.45'
 * @type String
 */
var  formatNumber= function(num, cent, isThousand) {
    num = num.toString().replace(/\$|\,/g, '');

    // 检查传入数值为数值类型
    if (isNaN(num))
        num = "0";

    // 获取符号(正/负数)
    sign = (num == (num = Math.abs(num)));

    num = Math.floor(num * Math.pow(10, cent) + 0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
    cents = num % Math.pow(10, cent);       // 求出小数位数值
    num = Math.floor(num / Math.pow(10, cent)).toString();  // 求出整数位数值
    cents = cents.toString();        // 把小数位转换成字符串,以便求小数位长度

    // 补足小数位到指定的位数
    while (cents.length < cent)
        cents = "0" + cents;

    if (isThousand) {
        // 对整数部分进行千分位格式化.
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }

    if (cent > 0)
        return (((sign) ? '' : '-') + num + '.' + cents);
    else
        return (((sign) ? '' : '-') + num);
};

var amtFormatter= function(value, row, index) {
    return formatNumber(value, 2, 1);
};

var cntFormatter= function(value, row, index) {
    return formatNumber(value, 0, 1);
};

var  formatDay=function(date){
    var date = new Date(date);
    return (date.getMonth()+1) + '/' + date.getDate()+'/'+date.getFullYear();
};