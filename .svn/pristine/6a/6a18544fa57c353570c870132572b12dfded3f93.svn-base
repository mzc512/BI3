/**
 * dashboard router
 */

var express = require('express');
var router = express.Router();
var dbhelper = require('../util/mysql');
var dbhbase = require('../util/hbase');
var businessTools = require('../util/businessTools');
var sql = require('../sql/dashboard-sql');
var moment = require('moment');
var nodeExcel = require('excel-export');
var server = express();
server.use('/userDashboard', router);


/**
 * type  excel chart
 */
router.get('/loginInfo/userid/:userid/type/:type', function (req, res, next) {
    var type = req.params.type;
    var userid = req.params.userid;
    var surface = "rst_ns:user_login_mth"; //会员登录


    var grepUser = userid + ".*";
    var option = {
        filter: {
            "op": "EQUAL",
            "type": "RowFilter",
            "comparator": {"value": grepUser, "type": "RegexStringComparator"}
        }
    };

    dbhbase.queryByScan(surface, option, function (resp) {
        if (resp.result) {
            var rstArray = [];

            function chkUnfined(value) {
                if (typeof(value) == 'undefined') {
                    return "";
                }
                return value;
            }
            var xAxis =[];

            for (key in resp.data) {
                var rstData = [];
                var month = chkUnfined(resp.data[key]['info:log_mth']);
                rstData[0] = month;
                rstData[1] = chkUnfined(resp.data[key]['info:log_cnt']);
                if(xAxis.length<12){   //max 12 month
                    xAxis.push(month);
                    rstArray.push(rstData);
                }

            }
            //type string date  bool  number
            if (type == 'excel') {
                var conf = {};
                conf.cols = [{
                    caption: '月份',
                    type: 'string'
                },
                    {
                        caption: '登录天数',
                        type: 'string'
                    }
                ];
                conf.rows = rstArray;
                var result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
                res.setHeader("Content-Disposition", "attachment; filename=" +encodeURIComponent("最近12月登录趋势")+".xlsx");
                res.end(result, 'binary');
            } else {
                res.send({result: true, code: 0, message: "data success", data: rstArray,xAxis:xAxis});
            }
        } else {
            res.json({result: false, code: -1, message: "data fail"});
        }
    });


});


router.get('/baseInfo/userid/:userid', function (req, res, next) {
    var userId = req.params.userid;
      //rst_ns:user_briefly
    dbhbase.queryByKey("rst_ns:user_briefly",userId,[],[],function (resp) {
        if (resp.result && resp.result!='error') {
            var resData = {};

            function chkUnfined(value) {
                if (typeof(value) == 'undefined') {
                    return "";
                }
                return value;
            }
            resData['user_id'] = chkUnfined(resp.data['info:user_id']);
            resData['user_nm'] = chkUnfined(resp.data['info:user_nm']);
            resData['email'] = chkUnfined(resp.data['info:email']);
            resData['phone'] = chkUnfined(resp.data['info:phone']);
            resData['province'] = chkUnfined(resp.data['info:province']);
            resData['city'] = chkUnfined(resp.data['info:city']);
            resData['last_login'] = chkUnfined(resp.data['info:last_login']);
            resData['last_order'] = chkUnfined(resp.data['info:last_order']);
            resData['indry'] = chkUnfined(resp.data['info:indry']);

            res.send({result: true, code: 0, message: "data success", data: resData});
        } else {
            res.json({result: false, code: -1, message: "data fail"});
        }
    });

});





/*
 * 用户基本信息接口
 * zhangchao
 */
router.get('/UserMessage/userId/:userId', function(req, res, next) {
    var userId = req.params.userId;
dbhbase.queryByKey("rst_ns:user_info",userId,[],[],function(resp) {
    if(resp.result=="success"){
        var rstArray = {};

        function chkUnfined(value) {
            if (typeof(value) == 'undefined') {
                return "";
            }
            return value;
        }
        rstArray['user_nm1'] = chkUnfined(resp.data['info:user_nm']);
        rstArray['sex1'] = chkUnfined(resp.data['info:sex']);
        rstArray['birth_dt1'] = chkUnfined(resp.data['info:birth_dt']);
        rstArray['pro_nm1'] = chkUnfined(resp.data['info:pro_nm']);
        rstArray['city_nm1'] = chkUnfined(resp.data['info:city_nm']);
        rstArray['area_cd1'] = chkUnfined(resp.data['info:area_cd']);
        rstArray['tel_no1'] = chkUnfined(resp.data['info:tel_no']);
        rstArray['phone1'] = chkUnfined(resp.data['info:phone']);
        rstArray['email1'] = chkUnfined(resp.data['info:email']);
        rstArray['auth_Ind1'] = chkUnfined(resp.data['info:auth_Ind']);
        rstArray['ent_mem_Ind1'] = (chkUnfined(resp.data['info:ent_mem_Ind'])=='N')?'非企业会员':'企业会员';
        rstArray['register_tm1'] = chkUnfined(resp.data['info:register_tm']);
        rstArray['register_ip1'] = chkUnfined(resp.data['info:register_ip']);
        rstArray['register_source1'] = chkUnfined(resp.data['info:register_source']);
        rstArray['auth_method1'] = chkUnfined(resp.data['info:auth_method']);
        rstArray['auth_account1'] = chkUnfined(resp.data['info:auth_account']);
        rstArray['user_id'] = userId;
        res.send({result:true,code:0,message:"data success",data:rstArray});
    }else {
        res.json({result:false,code:-1,message:"data fail"});
    }
});
});




/*
 * 企业会员信息接口
 *  zhangchao
 */
router.get('/CorporateMember/userId/:userId', function(req, res, next) {
    var userId = req.params.userId;
    dbhbase.queryByKey("rst_ns:user_info_enterprise",userId,[],[],function(resp) {

        if(resp.result){

            var memArray = {};

            function chkUnfined(value) {
                if (typeof(value) == 'undefined') {
                    return "";
                }
                return value;
            }
            memArray['enterprise_nm2'] = chkUnfined(resp.data['info:enterprise_nm']);
            memArray['ent_crt_tm2'] = chkUnfined(resp.data['info:ent_crt_tm']);
            memArray['pro_nm2'] = chkUnfined(resp.data['info:pro_nm']);
            memArray['city_nm2'] = chkUnfined(resp.data['info:city_nm']);
            memArray['area_nm2'] = chkUnfined(resp.data['info:area_nm']);
            memArray['addr_dtl2'] = chkUnfined(resp.data['info:addr_dtl']);
            memArray['website2'] = chkUnfined(resp.data['info:website']);
            res.send({result:true,code:0,message:"data success",data:memArray});
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

/*
 * 用户轨迹曲线接口
 * tangy
 */
router.get('/usermemberline/userid/:userid/type/:type', function(req, res, next) {
    var userId = req.params.userid;
    var type = req.params.type;
    var surface="rst_ns:user_pv_mth";
    var grepUser = userId+'.*';
    var option = {
        filter:{"op":"EQUAL",
            "type":"RowFilter",
            "comparator":{"value":grepUser,"type":"RegexStringComparator"}
        }
    };

    dbhbase.queryByScan(surface,option,function(resp) {

        if(resp.result){
            var rstArray = [];
            var xAxis =[];
            function chkUnfined (value){
                if(typeof(value) == 'undefined'){
                    return "";}
                return value;}

            for(key in resp.data) {
                var rstData = [];

                // info:user_id,info:webuserid,info:sessionid

                var month =chkUnfined(resp.data[key]['info:pv_mth']);
                rstData[0] =month
                rstData[1] = chkUnfined(resp.data[key]['info:pv_cnt']);//Pv
                xAxis.push(month);
                rstArray.push(rstData);
            }
            if (type == 'excel') {
                var conf = {};
                conf.cols = [{
                    caption: '月份',
                    type: 'string'
                },
                    {
                        caption: 'PV数量',
                        type: 'string'
                    }
                ];
                conf.rows = rstArray;
                var result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
                res.setHeader("Content-Disposition", "attachment; filename=" +encodeURIComponent("最近12月PV数量")+".xlsx");
                res.end(result, 'binary');
            } else {
                res.send({result: true, code: 0, message: "data success", data: rstArray,xAxis:xAxis});
            }

        }else{

            res.json({result:false,code:-1,message:"data fail"});
        }



    });
});


/*
 * 会员订单接口
 */

router.get('/method/MemberOrderMonthly/userId/:userId/type/:type', function(req, res, next) {
    var userId = req.params.userId;
    var type=req.params.type;
    var surface;

    surface="rst_ns:user_order_mth";  //月下单记录

    var grepUser = userId + ".*";
    var option = {
        filter:{"op":"EQUAL",
            "type":"RowFilter",
            "comparator":{"value":grepUser,"type":"RegexStringComparator"}
        }
    };

    dbhbase.queryByScan(surface,option,function(resp) {

        if(resp.result){
            var rstArray = [];
            function chkUnfined (value){
                if(typeof(value) == 'undefined'){
                    return "";}
                return value;}
            //下单记录信息
            for(key in resp.data) {
                    var rstData = [];
                    rstData[0] = chkUnfined(resp.data[key]['info:order_mth']);
                    rstData[1] = chkUnfined(resp.data[key]['info:order_cnt']);
                    rstData[2] = chkUnfined(resp.data[key]['info:order_amt']);
                    rstArray.push(rstData);
            }
            rstArray=rstArray.reverse();
           if(rstArray.length>12){
               rstArray= rstArray.slice(0,11);
           }
            if (type == 'excel') {
                var conf = {};
                conf.cols = [{
                    caption: '月份',
                    type: 'string'
                },
                    {
                        caption: '订单数',
                        type: 'string'
                    },
                    {
                        caption: '订单金额',
                        type: 'string'
                    }
                ];
                conf.rows = rstArray;
                var result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
                res.setHeader("Content-Disposition", "attachment; filename=" +encodeURIComponent("每月订单数和金额")+".xlsx");
                res.end(result, 'binary');
            }else {
                res.send({result: true, code: 0, message: "data success", data: rstArray});
            }
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});


/*
 * 商品种类接口
 */

router.get('/method/commodityType/userId/:userId/type/:type', function(req, res, next) {
    var userId = req.params.userId;
    var type=req.params.type;
    var surface;

    //surface="rst_ns:user_order_mth";  //月下单记录
    //
    //var grepUser = userId + ".*";
    //var option = {
    //    filter:{"op":"EQUAL",
    //        "type":"RowFilter",
    //        "comparator":{"value":grepUser,"type":"RegexStringComparator"}
    //    }
    //};
    //
    //dbhbase.queryByScan(surface,option,function(resp) {
    var data=[['五金耗材','88','89000'],['无纺布','85','98800'],['焊锡','86','98880'],['紧固件','89','108888'],['纺织皮革','81','1188888']];
        if(data){
            var rstArray = [];
            function chkUnfined (value){
                if(typeof(value) == 'undefined'){
                    return "";}
                return value;}
            //下单记录信息
            for(key in data) {
                var rstData = [];
                rstData[0] = chkUnfined(data[key][0]);
                rstData[1] = chkUnfined(data[key][1]);
               rstData[2] = chkUnfined(data[key][2]);
                rstArray.push(rstData);
            }
            if (type == 'excel') {
                var conf = {};
                conf.cols = [{
                    caption: '商品种类名称',
                    type: 'string'
                },
                    {
                        caption: '订单数',
                        type: 'string'
                    },
                    {
                        caption: '订单金额',
                        type: 'string'
                    }
                ];
                conf.rows = rstArray;
                var result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
                res.setHeader("Content-Disposition", "attachment; filename=" +encodeURIComponent("商品种类")+".xlsx");
                res.end(result, 'binary');
            }else { rstArray.reverse();
                res.send({result: true, code: 0, message: "data success", data: rstArray});
            }
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    //});
});

/*
 * 热点标签接口
 */

router.get('/method/hotSpotAnalysis/userId/:userId/type/:type', function(req, res, next) {
    var userId = req.params.userId;
    var type=req.params.type;
    var surface;

    //surface="rst_ns:user_order_mth";  //月下单记录
    //
    //var grepUser = userId + ".*";
    //var option = {
    //    filter:{"op":"EQUAL",
    //        "type":"RowFilter",
    //        "comparator":{"value":grepUser,"type":"RegexStringComparator"}
    //    }
    //};
    //
    //dbhbase.queryByScan(surface,option,function(resp) {
    var data = [];
    data.push({
        name: "偏好五金商品",
        value: 666
    }, {
        name: "土豪",
        value: 520
    }, {
        name: "手机控",
        value: "999"
    }, {
        name: "IOS",
        value: "888"
    }, {
        name: "微信",
        value: "777"
    }, {
        name: "WIFI",
        value: "688"
    }, {
        name: "广东深圳",
        value: "588"
    }, {
        name: "下单即付",
        value: "516"
    }, {
        name: "无纺布",
        value: "515"
    }, {
        name: "焊锡",
        value: "483"
    }, {
        name: "忠诚会员",
        value: "462"
    }, {
        name: "谷歌浏览器",
        value: "449"
    }, {
        name: "电工电气",
        value: "429"
    }, {
        name: "数码电子",
        value: "407"
    }, {
        name: "数码达人",
        value: "406"
    }, {
        name: "供应商",
        value: "406"
    }, {
        name: "采购商",
        value: "386"
    }, {
        name: "采购五金",
        value: "385"
    }, {
        name: "管件",
        value: "375"
    }, {
        name: "手机",
        value: "355"
    }, {
        name: "五金工具",
        value: "11"
    });

    if(data){
        var rstArray = [];
        function chkUnfined (value){
            if(typeof(value) == 'undefined'){
                return "";}
            return value;}
        //下单记录信息
        for(key in data) {
            var rstData = [];
            rstData[0] = chkUnfined(data[key]['name']);
            rstData[1] = chkUnfined(data[key]['value']);
            //rstData[2] = chkUnfined(data[key][2]);
            rstArray.push(rstData);
        }
        if (type == 'excel') {
            var conf = {};
            conf.cols = [{
                caption: '用户标签',
                type: 'string'
            },
                {
                    caption: '热点数',
                    type: 'string'
                }
            ];
            conf.rows = rstArray;
            var result = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
            res.setHeader("Content-Disposition", "attachment; filename=" +encodeURIComponent("用户标签")+".xlsx");
            res.end(result, 'binary');
        }else { rstArray.reverse();
            res.send({result: true, code: 0, message: "data success", data: rstArray});
        }
    }else{
        res.json({result:false,code:-1,message:"data fail"});
    }
    //});
});


/*
 * 会员采购地址接口
 */

router.get('/method/purchasingAddressTable/userId/:userId/type/:type', function(req, res, next) {
    var userId = req.params.userId;
    var type=req.params.type;
    var surface;

    surface="rst_ns:user_ship_devy_adr";

    var grepUser = userId + ".*";
    var option = {
        filter:{"op":"EQUAL",
            "type":"RowFilter",
            "comparator":{"value":grepUser,"type":"RegexStringComparator"}
        }
    };

    dbhbase.queryByScan(surface,option,function(resp) {

        if(resp.result){
            var rstArray = [];
            function chkUnfined (value){
                if(typeof(value) == 'undefined'){
                    return "";}
                return value;}

            var rstArrayes=[]

            for(key in resp.data) {
                rstArray.push({
                'incity': chkUnfined(resp.data[key]['info:devy_city']),//收货城市
                'outcity': chkUnfined(resp.data[key]['info:ship_city']),//发货城市
                'ordercnt':  chkUnfined(resp.data[key]['info:order_cnt']),//下单数
                'orderamt': chkUnfined(resp.data[key]['info:order_amt'])//下单金额

            });
            }
                res.send({result: true, code: 0, message: "data success", data: rstArray});
            } else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
router.get('/method/purchasingAddress/userId/:userId/type/:type', function(req, res, next) {
    var userId = req.params.userId;
    var type=req.params.type;
    var surface;

    surface="rst_ns:user_ship_devy_adr";

    var grepUser = userId + ".*";
    var option = {
        filter:{"op":"EQUAL",
            "type":"RowFilter",
            "comparator":{"value":grepUser,"type":"RegexStringComparator"}
        }
    };

    dbhbase.queryByScan(surface,option,function(resp) {

        if(resp.result){
            var rstArray = [];
            function chkUnfined (value){
                if(typeof(value) == 'undefined'){
                    return "";}
                return value;}

            var rstArrayes=[]
            for(key in resp.data) {
                var rstDatas=[];
                rstDatas[0]= chkUnfined(resp.data[key]['info:devy_city']);
                rstArrayes.push(rstDatas);
            }


            var temp ={},tempArr=[]; // 去重
            for(var i =0; i < rstArrayes.length; i++){
                if(!temp[rstArrayes[i]]){
                    temp[rstArrayes[i]] =true;
                    tempArr.push(rstArrayes[i]);
                }
            }
            var colors=['red','orange', '#46bee9','#a6c84c', '#ffa022','#FF00FF','#F08080','#CDCD00','#8B450','#473C8B']
            //下单记录信息
            for(key in resp.data) {
                var rstData = [];
                rstData[0] = chkUnfined(resp.data[key]['info:devy_city']);//收货城市
                rstData[1] = chkUnfined(resp.data[key]['info:devy_lng']);//收货城市纬度
                rstData[2] = chkUnfined(resp.data[key]['info:devy_lat']);//收货城市经度
                rstData[3] = chkUnfined(resp.data[key]['info:ship_city']);//发货城市
                rstData[4] = chkUnfined(resp.data[key]['info:ship_lng']);//发货城市纬度
                rstData[5] = chkUnfined(resp.data[key]['info:ship_lat']);//发货城市经度
                rstData[6] = chkUnfined(resp.data[key]['info:order_cnt']);//下单数
                rstData[7] = chkUnfined(resp.data[key]['info:order_amt']);//下单金额
                if(tempArr.length>0){
                    for(keys in tempArr ){
                        if(keys<=9){
                            if( chkUnfined(resp.data[key]['info:devy_city'])==tempArr[keys]){
                                rstData[8] =colors[keys];
                            }
                        }
                    }
                }
                rstArray.push(rstData);
            }
            if (type == 'excel') {
                var conf = {};
                conf.cols = [{
                    caption: '收货城市',
                    type: 'string'
                },
                    {
                        caption: '收货城市纬度',
                        type: 'string'
                    },
                    {
                        caption: '收货城市经度',
                        type: 'string'
                    },
                    {
                        caption: '发货城市',
                        type: 'string'
                    },
                    {
                        caption: '发货城市纬度',
                        type: 'string'
                    },
                    {
                        caption: '发货城市经度',
                        type: 'string'
                    },
                    {
                        caption: '下单数',
                        type: 'string'
                    },
                    {
                        caption: '下单金额',
                        type: 'string'
                    }
                ];
                conf.rows = rstArray;
                var result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
                res.setHeader("Content-Disposition", "attachment; filename=" +encodeURIComponent("会员采购地址")+".xlsx");
                res.end(result, 'binary');
            }else { rstArray.reverse();
                res.send({result: true, code: 0, message: "data success", data: rstArray});
            }
        }else{
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});

/*
 * 雷达接口
 */

router.get('/method/memberRadar/userId/:userId/type/:type', function(req, res, next) {
    var userId = req.params.userId;
    var type=req.params.type;
    dbhbase.queryByKey("rst_ns:user_summary",userId,[],[],function(resp) {
        if(resp.result=="success"){
            var rstArray = new Array(
                resp.data['info:order_inter'],resp.data['info:order_freq'],resp.data['info:avg_amt']
                ,resp.data['info:max_amt'],resp.data['info:order_cat'],resp.data['info:all_max_inter']
                ,resp.data['info:all_min_inter'],resp.data['info:all_max_freq'],resp.data['info:all_min_freq']
                ,resp.data['info:all_max_avg'],resp.data['info:all_min_avg'],resp.data['info:all_max_amt']
                ,resp.data['info:all_min_amt'],resp.data['info:all_max_cat'],resp.data['info:all_min_cat']
            );

            var rstArrays=[];
            rstArrays.push(rstArray);

            //    resp.data['info:order_inter'];//购买时间间隔
            //    resp.data[0]['info:order_freq'];//购买频率
            //    resp.data[0]['info:avg_amt'];//平均每次交易额
            //    resp.data[0]['info:max_amt'];//单次最高交易额
            //    resp.data[0]['info:order_cat'];//购买商品种类
            //    resp.data[0]['info:all_max_inter'];//最大时间间隔
            //   resp.data[0]['info:all_min_inter'];//最小时间间隔
            //   resp.data[0]['info:all_max_freq'];//最大购买频率
            //   resp.data[0]['info:all_min_freq'];//最小购买频率
            //   resp.data[0]['info:all_max_avg'];//最大平均交易额
            //    resp.data[0]['info:all_min_avg'];//最小平均交易额
            //   resp.data[0]['info:all_max_amt'];//最大单次最高交易额
            //    resp.data[0]['info:all_min_amt'];//最小单次最高交易额
            //    resp.data[0]['info:all_max_cat'];//最大购买商品种类
            //    resp.data[0]['info:all_min_cat'];//最小购买商品种类

            if (type == 'excel') {
                var conf = {};
                conf.cols = [{
                    caption: '购买时间间隔',
                    type: 'number'
                },
                    {
                        caption: '购买频率',
                        type: 'number'
                    },
                    {
                        caption: '平均每次交易额',
                        type: 'number'
                    },
                    {
                        caption: '单次最高交易额',
                        type: 'number'
                    },
                    {
                        caption: '购买商品种类',
                        type: 'number'
                    }
                ];
                conf.rows = rstArrays;
                var result = nodeExcel.execute(conf);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
                res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent("会员综合评分") + ".xlsx");
                res.end(result, 'binary');

            }else{
                res.send({result: true, code: 0, message: "data success", data: rstArray});
            }
        }else {
            res.json({result:false,code:-1,message:"data fail"});
        }
    });
});
module.exports = server;
