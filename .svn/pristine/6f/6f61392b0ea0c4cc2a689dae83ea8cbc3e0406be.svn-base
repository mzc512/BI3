
var csc_popuop= {
    getPopInfo:function(){
        var isInIframe =$(window.parent.document).find(".nav-down").length>0;
        var headerDom=isInIframe?$(window.parent.parent.document):$(window.document);
        return {isInIframe:isInIframe,headerDom:headerDom};
    },
    popUp:function(){
        var popInfo = this.getPopInfo();
        var headerDom = popInfo.headerDom;
        var isInIframe = popInfo.isInIframe;
        if(headerDom.find(".pop-chart-wrap").length ==0){
            headerDom.find("body").append('<div class="black-screen-shade"></div>' +
            '<div class="pop-chart-wrap">' +
            '<div class="modal-header"><span class="title"></span><div class="close-btn">&times;</div>' +
            '</div>' +
            '<div class="pop-chart"></div>' +
            '</div>');
        }
        var popChartWrap = headerDom.find(".pop-chart-wrap");
        popChartWrap.find(".pop-chart").html("");
        var backWrap = headerDom.find(".black-screen-shade");
        var domheight = isInIframe?headerDom.height():$(window).height();
        var gapHradio = 0.1;
        var h = domheight*(1-gapHradio*2);

        popChartWrap.height(h);
        var headerH = 59;
        popChartWrap.find(".pop-chart").height(h-headerH);
        backWrap.show();
        popChartWrap.show();
        headerDom.find(".close-btn").off('click').on('click',function(){
            backWrap.hide();
            popChartWrap.hide();
        });
    },
    setPopTitle:function(title){
        var popInfo = this.getPopInfo();
        var headerDom = popInfo.headerDom;
        headerDom.find(".modal-header .title").text(title);
    },
    setContent:function(html){
        var popInfo = this.getPopInfo();
        var headerDom = popInfo.headerDom;
        headerDom.find(".pop-chart").html(html);
    }
};