var moment = require('moment');


exports.getCaiYearInfo =()=>{
    var nowDate = new Date();
    var year = nowDate.getFullYear();
    var caiYear = year;
    if(nowDate.getTime()< new Date(year,4-1,2).getTime()){  //小于 4.2 0时0分0秒
        caiYear = year-1;
    }
    var caiYearStart = new Date(caiYear,4-1,1);
    var caiYearEnd = new Date(caiYear+1,3-1,31);
    var BeforeAQuarterStart = new Date(caiYear,0,1);
    var start = moment(caiYearStart).format('YYYY-MM-DD');
    var end = moment(caiYearEnd).format('YYYY-MM-DD');
    var bstart =moment(BeforeAQuarterStart).format('YYYY-MM-DD');
    return {caiYear:caiYear,timeAcross:[start,end],timeAcrossForCalc:[bstart,end]};
};


exports.percentage =(num, total)=> {
    return (Math.round(num / total * 10000) / 100.00 + "%");// 2percent fixed
};