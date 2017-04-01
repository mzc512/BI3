$(function () {
        $("#loginRecordHeader").on("click", function () {
            var that = $(this); 
            that.find(".icon-double-angle-down").toggle();
            that.find(".icon-double-angle-up").toggle();
            $("#loginRecord").toggle();
        });

        $("#orderRecordHeader").on("click", function () {
            var that = $(this);
           
            that.find(".icon-double-angle-down").toggle();
            that.find(".icon-double-angle-up").toggle();
            $("#orderRecord").toggle();
        });

        $("#userLooks").on("click", function () {
            var that = $(this);
            that.find(".icon-double-angle-down").toggle();
            that.find(".icon-double-angle-up").toggle();
            $("#userLook").toggle();
        });
    });

    //load baseinfo demo
    var source = $("#baseInfo-template").html();
    var template = Handlebars.compile(source);

    //var userId = 'a08659fd-ace4-4b59-ade5-79f26c8b963c';
    var userId = '';
    userlist(userId);
    //var userId='578df378-ddf5-4ef7-8c64-f890cceacf8c';
    //var userId='00000464-57b4-4ff2-ba32-390b2a777490';
    function userlist(userId){
    if(userId!="") {
        $.get("/router/rest/method/UserMessage/userId/" + userId, function (data, status) {
            if (status == "success") {
                var respObj = data;
                if (respObj.result == true) {
                    var listArray = respObj.data;
                    var mockdata1 = {
                        "user_id": userId,
                        "user_nm": listArray[0],
                        "sex": listArray[1],
                        "birth_dt": listArray[2],
                        "pro_id": listArray[3],
                        "city_Id": listArray[4],
                        "area_cd": listArray[5],
                        "tel_no": listArray[6],
                        "phone": listArray[7],
                        "email": listArray[8],
                        "auth_Ind": listArray[9],
                        "ent_mem_Ind": listArray[10],
                        "register_tm": listArray[11],
                        "register_ip": listArray[12],
                        "register_source": listArray[13],
                        "auth_method": listArray[14],
                        "auth_account": listArray[15]
                    };

                    var html = template(mockdata1);
                    $('#baseInfo .common_con').html(html);

                    if (listArray[10] == "N") {
                        $("#memberInfo").hide();
                    } else {
                        $.get("/router/rest/method/CorporateMember/userId/" + userId, function (data, status) {
                            if (status == "success") {
                                var respObj = data;
                                if (respObj.result == true) {
                                    var memberArray = respObj.data;
                                    if (memberArray.length) {
                                        var memberdata = {
                                            'name': memberArray[0],
                                            'register-tm': memberArray[1],
                                            'pro': memberArray[2],
                                            'city': memberArray[3],
                                            'area': memberArray[4],
                                            'addr': memberArray[5],
                                            'web': memberArray[6]
                                        };
                                    } else {
                                        var memberdata = {
                                            'name': '',
                                            'register-tm': '',
                                            'pro': '',
                                            'city': '',
                                            'area': '',
                                            'addr': '',
                                            'web': ''
                                        };
                                    }
                                    var members = $("#memberInfo-template").html();
                                    var templates = Handlebars.compile(members);
                                    var htmls = templates(memberdata);
                                    $('#memberInfo .common_con').html(htmls);
                                    $("#memberInfo").show();
                                }
                            }
                        });
                    }

                } else {
                    $("#keyes").attr("value", "");
                    $("#keyes").addClass("bluesinput");
                    $("#keyes").val("您搜索的用户ID不存在,请重新搜索");
                    return false;
                }
            }
        });

        $.get("/router/rest/method/MemberLoad/userId/" + userId + "/t/1", function (data, status) {
            if (status == "success") {
                var resObj = data;
                if (resObj.result == true) {
                    var logoArrays = resObj.data;

                    if (logoArrays.length) {
                        var rstData = [];
                        if (logoArrays.length > 10) {
                            var len = 10;
                        } else {
                            var len = logoArrays.length;
                        }
                        for (var i = 0, len; i < len; i++) {
                            var rstDat = {
                                'ip': logoArrays[i][0],
                                'count': logoArrays[i][1],
                                'first': logoArrays[i][2],
                                'last': logoArrays[i][3]
                            };
                            rstData.push(rstDat);
                        }
                    } else {
                        var rstDat = {
                            'ip': '',
                            'count': '',
                            'first': '',
                            'last': ''
                        };
                    }
                    var source2 = $("#loginRecord-template").html();
                    var template2 = Handlebars.compile(source2);
                    var mockdata2 = {
                        "record": rstData
                    };

                    var html2 = template2(mockdata2);
                    $('#loginRecord .common_con').html(html2);

                }
            }
        });


        $.get("/router/rest/method/MemberLoad/userId/" + userId + "/t/0", function (data, status) {
            if (status == "success") {
                var resObj = data;
                if (resObj.result == true) {
                    var logoArrays = resObj.data;
                    if (logoArrays.length) {
                        var rstData = [];
                        if (logoArrays.length > 10) {
                            var lena = 10;
                        } else {
                            var lena = logoArrays.length;
                        }
                        for (var i = 0, lena; i < lena; i++) {
                            var rstDat = {
                                'order_id': logoArrays[i][0],
                                'order_tm': logoArrays[i][1],
                                'pay_sts': logoArrays[i][2],
                                'pay_tm': logoArrays[i][3],
                                'order_sts': logoArrays[i][4],
                                'total_amt': logoArrays[i][5],
                                'fav_amt': logoArrays[i][6],
                                'real_amt': logoArrays[i][7]
                            };
                            rstData.push(rstDat);
                        }
                    } else {
                        var rstDat = {
                            'order_id': '',
                            'order_tm': '',
                            'pay_sts': '',
                            'pay_tm': '',
                            'order_sts': '',
                            'total_amt': '',
                            'fav_amt': '',
                            'real_amt': ''
                        };
                    }
                    var source3 = $("#orderRecord-template").html();
                    var template3 = Handlebars.compile(source3);
                    var mockdata3 = {
                        "records": rstData
                    };
                    var html3 = template3(mockdata3);
                    $('#orderRecord .common_con').html(html3);

                }

            }
        });

        //userId="00f53fa3-11ac-4579-8071-0b41bdeea5d7";

        // userIds = "FE9D6B326776476F8C87800C09D8E856";
        $.get("/router/rest/method/userLookCorder/userId/" + userId + "/t/1", function (data, status) {
            if (status == "success") {
                var resObj = data;
                if (resObj.result == true) {
                    var logoArrays = resObj.data;
                    if (logoArrays.length) {
                        var rstData = [];
                        if (logoArrays.length > 10) {
                            var lenb = 10;
                        } else {
                            var lenb = logoArrays.length;
                        }
                        for (var i = 0, lenb; i < lenb; i++) {
                            var rstDat = {
                                'session_id': logoArrays[i][0],
                                'pv': logoArrays[i][1],
                                'load_page': logoArrays[i][2],
                                'load_tm': logoArrays[i][3],
                                'out_page': logoArrays[i][4],
                                'exit_tm': logoArrays[i][5],
                                'dates': logoArrays[i][6],
                                'userides':userId
                            };
                            rstData.push(rstDat);
                        }
                    } else {
                        var rstDat = {
                            'session_id': '',
                            'pv': '',
                            'load_page': '',
                            'load_tm': '',
                            'out_page': '',
                            'exit_tm': '',
                            'userides':userId
                        };
                    }
                    var sources = $("#userLook-template").html();
                    var templates = Handlebars.compile(sources);
                    var mockdatas = {
                        "recordes": rstData
                    };
                    var html3 = templates(mockdatas);
                    $('#userLook .common_con').html(html3);

                }

            }
        });
    }
   }


 $(".f-blue-btn").click(function(){
       var  keys=$("#keyes").val();
           if(keys==""){
                $("#keyes").attr("value","");
                $("#keyes").addClass("redsinput");
                $("#keyes").val("您还没有填写用户ID,请重新填写!!!");
            }else{      
                userlist(keys);
            }
    });
     function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
$("#keyes").focus(function(){
    $("#keyes").val("");
    $("#keyes").removeClass("redsinput");
    $("#keyes").removeClass("bluesinput");
})
var userids = GetQueryString("userides");
if (userids && userids!="") {
    userlist(userids);
}