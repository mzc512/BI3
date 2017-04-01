 var w=$(document.body).width();
   var h=$(document.body).height();
   var loadw=(w-400)/2;
   var loadh=(h-400)/2;
   $(".waitload").css({'margin-top':loadh,"margin-left":loadw});
    function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;}

    var userid = GetQueryString("userid");
    var userides = GetQueryString("userides");
    $('#table').bootstrapTable({
        url: '/router/rest/method/userLookCorder/userId/'+userid+'/t/0'
    });
  
    $(".callback").click(function(){
        location.href="/anaweb/report/userInfo.html?userides="+userides  
    });