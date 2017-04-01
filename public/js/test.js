/*test.js zwb*/

var echartsBox = $('.echartsBox');
echartsBox.css({"height":"auto"});
echartsBox.append("<div id=\"main\"></div>");
var mainDiv = $("#main");
mainDiv.html("Hello World!");
mainDiv.css("height",($(document).height()-210)+"px");

$(document).ready(function() {
	$('#datepicker').daterangepicker(
		{
			"startDate": "01/01/1970",
			"endDate": moment(Date.now()).format('MM/DD/YYYY')
		}, 
		function(start, end, label) {
			console.log("start: " + start);
			console.log("end: " + end);
			console.log("label: " + label);
		}
	);
});
