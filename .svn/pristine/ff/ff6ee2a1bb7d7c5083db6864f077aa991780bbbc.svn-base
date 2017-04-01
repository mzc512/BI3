

$(function() {
	var index = {
			// 加载数据表
			tablist:function(){
                var self = this;
				$.ajax({
					url:"/selfAnalysis/tablelist",
					type:"get",
					dataType:"json",
					success:function(d){
                        if(d.result) {
                            var tablist = $(".tabs-list"),
                                thead = $(".tabs-content>div>table>thead").find("tr");
                            var tabarr = [];
                            var table = d.data;
                            var tableel=[];
                            for (var i = 0,len = table.length; i < len; i++) {
                                tabarr.push(table[i].name);
                                var items = "<li><a href='#' title=" + table[i].title + ">" + table[i].name + "<\/a><\/li>";
                                tableel.push(items);
                            }
                            tablist.append(tableel.join(""));
                            var detail=['表名','字段名','字段类型','字段描述'];
                            var detailel =[];
                            for (var j = 0,len= detail.length; j < len; j++) {
                                var th = "<th>" + detail[j] + "<\/th>";
                                detailel.push(th);
                            }
                            thead.append(detailel.join(""));
                            self.bindEvent();
                            $(".tabs-list a:first").trigger("click");
                            $(".tabs-content").height($(".tabs-vertical").height());
                        }
					},
					error:function(){
						console.info("AJAX ERROR");
					}
				});
			},
            bindEvent:function(){
                var self = this;
                $(".tabs-list a").on("click",function(){
                    var text = $(this).text();
                    self.getMainInfo(text);
                });
            },
            getMainInfo:function(name){
                var content = $('.tabs-content');
                $.ajax({
                    url:"/selfAnalysis/tableinfo/"+name,
                    type:"get",
                    dataType:"json",
                    success:function(d){
                        if(d.result) {
                            var content = $('.tabs-content tbody');
                            var thead=[];
                            var data = d.data;
                            var detail=['tablename','columnname','columntype','columncomment'];

                            for (var j = 0,len= data.length; j < len; j++) {
                                thead.push("<tr>");
                                for(var i= 0,l=detail.length;i<l;i++){
                                    var th = "<td>" + data[j][detail[i]] + "</td>";
                                    thead.push(th);
                                }
                                thead.push("</tr>");
                            }
                            content.html(thead.join(""));
                        }
                    },
                    error:function(){
                        console.info("AJAX ERROR");
                    }
                });
            },


			// tab切换
			tabs:function(){
				var widget = $('.tabs-vertical'),
					title = $('.tabs-content caption > h3');
				widget.find(".tabs-list").on('click','a', function (e) {
					var $this = $(this);
					e.preventDefault();//取消a标签默认事件
                    title.html($this.attr("title"));
					$this.addClass("tab-active").parent().siblings().find("a").removeClass("tab-active");
				});
			}
		};
	index.tablist();
	index.tabs();	

});