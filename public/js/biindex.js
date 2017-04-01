var menuscrollpanel;
$(function(){
    $.get('/getTopMenu',function(d){
        var firstUrl ='/anaweb/nopower.html';
        if(d.result){

            if(d.data && d.data.length>0){
                var array = d.data;
                var str ='';

                array.forEach(function(o,i){
                    var classStr=i==0?'class="active"':'';
                    if(i==0){
                        firstUrl = o.url;
                    }
                    str +='<span class="bi-nav"><a href="javascript:void(0);" data-id="'+o.pageId+'" data-src="'+o.url+'" '+classStr+'>'+o.pageName+'</a></span>';
                });
                $('.top-tab').html(str);

            }
            var iframe =$("#mainIframe");
            iframe.attr("src",firstUrl);  //set begin url
        }else{
            if(d.message=='no power'){
                var iframe =$("#mainIframe");
                iframe.attr("src",'/anaweb/nopower.html');  //set begin url
            }
        }
    },'json');

    // 头部菜单切换
    $('.top-tab').on('click','a',function(){
        if($(this).hasClass("active")){
            return;
        }
        $('.bi-nav a').removeClass("active");
        $(this).addClass("active");
        var src=$(this).data('src');
        $('.main iframe').attr('src',src);
        return false;
    });

    //修改密码和获取用户名称
    $.get('/getUserBaseInfo',function(d){
        if(d.result){
            $('.nav-topright').append('<span class="user-info" title="'+d.data.userName+'">'+d.data.userName+'</span>');
            $('#domidifypwd').on("click",function(){
                var modal =$('#myModal');
                modal.show();
                var close = modal.find('.close');
                close.on("click",function(){
                    modal.hide();
                });
                var footer= modal.find('.modal-footer');
                footer.find('.btn-default').on('click',function(){
                    close.trigger('click');
                });
                footer.find('.btn-primary').on('click',function(){
                    var oldpassword = modal.find('[name="oldpassword"]').val();
                    var password = modal.find('[name="password"]').val();
                    $.post("/toupdatepwd",{oldpassword:oldpassword,password:password},function(r){
                        if(r.result){
                            close.trigger('click');
                            modal.find('[name="oldpassword"]').val('');
                            modal.find('[name="password"]').val('');
                            modal.find(".message").text('');
                        }else{
                            modal.find(".message").text(r.message);
                        }
                    },'json');
                });
            });
        }
    },'json');
    $(".triangle_border").hover(function(){
        $('.triangle_border .popup').show();
    },function(){
        $('.triangle_border .popup').hide();
    });

    $("#iframepage").css("height", $(document).height() - $(".rightcon").css("top"));

    $("#quit").click(function()  {
        $.ajax({
            type: 'GET',
            url: '/router/rest/method/logout',
            success: function(data, status){
                if (status == 'success') {
                    if (data.result == 'success') {
                        location.href = data.data.redirect;
                    }
                }
            }
        });
    });

    //完整菜单效果1
    //$(".menu_list").hide();
    //$(".menu_list").eq(0).show();
    //$(".a_list").eq(0).addClass("active_alist");

    $(".leftmenu1").on('click','.a_list',function(){
        $(".a_list").removeClass("active_alist");
        $(this).addClass("active_alist");
        var len = $('.a_list').length;
        var index = $(".a_list").index(this);
        for(var i=0;i<len;i++){
            if(i == index){
                $('.menu_list').eq(i).slideToggle(300);
            }else{
                $('.menu_list').eq(i).slideUp(300);
            }
        }
        var timerScrollbar = setTimeout(function(){
            menuscrollpanel.data('jsp').reinitialise();
            clearTimeout(timerScrollbar);
        },301);
    });


    var hander = $(".menu-hander");
    var toleft = hander.find(".icon-double-angle-left");
    var toright = hander.find(".icon-double-angle-right");
    hander.click(function(){
        if(hander.hasClass("menu-expand")){
            $(".leftmenu1").animate({left:"-212px"},500);
            $(".rightcon").animate({left:"0px"},500,function(){
                toleft.hide();
                toright.show();
                hander.removeClass("menu-expand").addClass("menu-collapse");
            });

        }else{
            $(".leftmenu1").animate({left:"0px"},500);
            $(".rightcon").animate({left:"160px"},500,function(){
                toright.hide();
                toleft.show();
                hander.removeClass("menu-collapse").addClass("menu-expand");
            });

        }

    });

    var mainHeight = $(window).height();
    $(".leftmenu1").height(mainHeight);
    $.ajax({
        type: "GET",
        url: "/getLeftMenu/2",
        cache:false,
        success: function(d) {
            if (d.result) {
                var firstUrl = '';
                var htmlStr = '';
                var data = d.data;
                for (var i = 0, len1 = data.length; i < len1; i++) {
                    var isFirst = i == 0;
                    var group = data[i];
                    var gTitle = group.pageName;
                    var className = group.className + (isFirst ? ' active_alist' : '');
                    htmlStr += '<li><a class="a_list ' + className + '">' + gTitle + '</a>';
                    var styleStr = isFirst ? 'style="display: block;"' : 'style="display: none;"';
                    htmlStr += '<div class="menu_list comlist" ' + styleStr + '>';
                    if(group.children){
                        for (var j = 0, len2 = group.children.length; j < len2; j++) {
                            var item = group.children[j];
                            var cTitle = item.pageName;
                            var link = item.url;
                            if (firstUrl == '') {
                                firstUrl = link;
                            }
                            var activeStr = (i == 0 && j == 0) ? 'class="active-menu"' : '';
                            htmlStr += '<a href="' + link + '" ' + activeStr + '>' + cTitle + '</a>';
                        }
                    }
                    htmlStr += '</div></li>';
                }
                $('.leftmenu1 ul').html(htmlStr);
                var rightIframe = $(".rightcon iframe");
                if (rightIframe.attr("src") != firstUrl) {
                    rightIframe.attr("src", firstUrl);  //set begin url
                }


                var initEvent = function () {
                    var alist = $(".comlist").find("a");
                    var mainIframe = $(".rightcon iframe");
                    alist.click(function () {
                        $this = $(this);
                        alist.filter(".active-menu").removeClass("active-menu");
                        $this.addClass("active-menu");

                        mainIframe.attr("src", $this.attr("href"));
                        return false;
                    });
                };
                initEvent();

                menuscrollpanel = $(".leftmenu1").jScrollPane();
                menuscrollpanel.hover(function () {
                    if ($(this).find(".jspVerticalBar").length > 0) {
                        $(this).find(".jspVerticalBar").fadeIn();
                    }
                }, function () {
                    if ($(this).find(".jspVerticalBar").length > 0) {
                        $(this).find(".jspVerticalBar").fadeOut();
                    }
                });

            }
        }
    });

});