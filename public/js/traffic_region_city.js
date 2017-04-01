/*订单区域分布*/
var echartsBox = $('.echartsBox');
echartsBox.css({"height": ($(document).height() - 112) + "px"});
$('#toobar').show();

var category = GetQueryString('category');
if(category==null){
    category = 'province';
}
//tabs
var groupw = $(document).width() - 40;
var tab = '<ul id="group" class="nav nav-tabs" style="padding-left:20px;width:' + groupw + 'px;">' +
    '<li '+('province'==category?'class=\"active\"':'')+'><a href="javascript:;" data-toggle="tab" onclick="window.location.href=\'/report/traffic_region.html?category=province\';">流量省份分布</a></li>' +
    '<li '+('city'==category?'class=\"active\"':'')+'><a href="javascript:;" data-toggle="tab" onclick="window.location.href=\'/report/traffic_region.html?category=city\';">流量城市分布</a></li></ul>';

echartsBox.append(tab);

var containH = $(document).height();
var otherH = $("#group").outerHeight(true);
var toolbarH = 46;
var navtop = $(window.parent.document).find('.nav-top');
if(navtop.length>0){
    otherH+=navtop;
}
otherH+=toolbarH;

var chartSize = getChartSize(true);
var chartH = chartSize.height;
var chartW = chartSize.width;

var containW = $(document).width();
var echartboxMargin =2*8;

var otherW = echartboxMargin;

var container = [];
container.push('<div id="tabs" class="tab-content" >');
container.push('<div id="province" class="tab-pane active chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('<div id="city" class="tab-pane chart" style="height:' + chartH + 'px;width:' + chartW + 'px;"></div>');
container.push('</div>');
echartsBox.append(container.join(""));

var provinceChart = echarts.init(document.getElementById('province'));
var cityChart = echarts.init(document.getElementById('city'));


option = {
    tooltip : {
        trigger: 'item'
    },
    toolbox: {
        show : true,
        orient: 'vertical',
        x:'right',
        y:'center',
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false}
        }
    },
    series : [
        {
            tooltip: {
                trigger: 'item',
                formatter: '{b}'
            },
            name: '选择器',
            type: 'map',
            mapType: 'china',
            mapLocation: {
                x: 'left',
                y: 'top',
                width: '30%'
            },
            roam: true,
            selectedMode : 'single',
            itemStyle:{
                //normal:{label:{show:true}},
                emphasis:{label:{show:true}}
            },
            data:[
                {name: '北京', selected:false},
                {name: '天津', selected:false},
                {name: '上海', selected:false},
                {name: '重庆', selected:false},
                {name: '河北', selected:false},
                {name: '河南', selected:false},
                {name: '云南', selected:false},
                {name: '辽宁', selected:false},
                {name: '黑龙江', selected:false},
                {name: '湖南', selected:false},
                {name: '安徽', selected:false},
                {name: '山东', selected:false},
                {name: '新疆', selected:false},
                {name: '江苏', selected:false},
                {name: '浙江', selected:false},
                {name: '江西', selected:false},
                {name: '湖北', selected:false},
                {name: '广西', selected:false},
                {name: '甘肃', selected:false},
                {name: '山西', selected:false},
                {name: '内蒙古', selected:false},
                {name: '陕西', selected:false},
                {name: '吉林', selected:false},
                {name: '福建', selected:false},
                {name: '贵州', selected:false},
                {name: '广东', selected:false},
                {name: '青海', selected:false},
                {name: '西藏', selected:false},
                {name: '四川', selected:false},
                {name: '宁夏', selected:false},
                {name: '海南', selected:false},
                {name: '台湾', selected:false},
                {name: '香港', selected:false},
                {name: '澳门', selected:false}
            ]
        }
    ],
    animation: false
};
provinceChart.on('click', function (param){
    var selected = param.selected;
    var selectedProvince;
    var name;
    for (var i = 0, l = option.series[0].data.length; i < l; i++) {
        name = option.series[0].data[i].name;
        option.series[0].data[i].selected = selected[name];
        if (selected[name]) {
            selectedProvince = name;
        }
    }
    if (typeof selectedProvince == 'undefined') {
        option.series.splice(1);
        option.legend = null;
        option.dataRange = null;
        provinceChart.setOption(option, true);
        return;
    }
    option.series[1] = {
        name: '随机数据',
        type: 'map',
        mapType: selectedProvince,
        itemStyle:{
            normal:{label:{show:true}},
            emphasis:{label:{show:true}}
        },
        mapLocation: {
            x: '35%'
        },
        roam: true,
        data:[
            {name: '重庆市',value: Math.round(Math.random()*1000)},
            {name: '北京市',value: Math.round(Math.random()*1000)},
            {name: '天津市',value: Math.round(Math.random()*1000)},
            {name: '上海市',value: Math.round(Math.random()*1000)},
            {name: '香港',value: Math.round(Math.random()*1000)},
            {name: '澳门',value: Math.round(Math.random()*1000)},
            {name: '巴音郭楞蒙古自治州',value: Math.round(Math.random()*1000)},
            {name: '和田地区',value: Math.round(Math.random()*1000)},
            {name: '哈密地区',value: Math.round(Math.random()*1000)},
            {name: '阿克苏地区',value: Math.round(Math.random()*1000)},
            {name: '阿勒泰地区',value: Math.round(Math.random()*1000)},
            {name: '喀什地区',value: Math.round(Math.random()*1000)},
            {name: '塔城地区',value: Math.round(Math.random()*1000)},
            {name: '昌吉回族自治州',value: Math.round(Math.random()*1000)},
            {name: '克孜勒苏柯尔克孜自治州',value: Math.round(Math.random()*1000)},
            {name: '吐鲁番地区',value: Math.round(Math.random()*1000)},
            {name: '伊犁哈萨克自治州',value: Math.round(Math.random()*1000)},
            {name: '博尔塔拉蒙古自治州',value: Math.round(Math.random()*1000)},
            {name: '乌鲁木齐市',value: Math.round(Math.random()*1000)},
            {name: '克拉玛依市',value: Math.round(Math.random()*1000)},
            {name: '阿拉尔市',value: Math.round(Math.random()*1000)},
            {name: '图木舒克市',value: Math.round(Math.random()*1000)},
            {name: '五家渠市',value: Math.round(Math.random()*1000)},
            {name: '石河子市',value: Math.round(Math.random()*1000)},
            {name: '那曲地区',value: Math.round(Math.random()*1000)},
            {name: '阿里地区',value: Math.round(Math.random()*1000)},
            {name: '日喀则地区',value: Math.round(Math.random()*1000)},
            {name: '林芝地区',value: Math.round(Math.random()*1000)},
            {name: '昌都地区',value: Math.round(Math.random()*1000)},
            {name: '山南地区',value: Math.round(Math.random()*1000)},
            {name: '拉萨市',value: Math.round(Math.random()*1000)},
            {name: '呼伦贝尔市',value: Math.round(Math.random()*1000)},
            {name: '阿拉善盟',value: Math.round(Math.random()*1000)},
            {name: '锡林郭勒盟',value: Math.round(Math.random()*1000)},
            {name: '鄂尔多斯市',value: Math.round(Math.random()*1000)},
            {name: '赤峰市',value: Math.round(Math.random()*1000)},
            {name: '巴彦淖尔市',value: Math.round(Math.random()*1000)},
            {name: '通辽市',value: Math.round(Math.random()*1000)},
            {name: '乌兰察布市',value: Math.round(Math.random()*1000)},
            {name: '兴安盟',value: Math.round(Math.random()*1000)},
            {name: '包头市',value: Math.round(Math.random()*1000)},
            {name: '呼和浩特市',value: Math.round(Math.random()*1000)},
            {name: '乌海市',value: Math.round(Math.random()*1000)},
            {name: '海西蒙古族藏族自治州',value: Math.round(Math.random()*1000)},
            {name: '玉树藏族自治州',value: Math.round(Math.random()*1000)},
            {name: '果洛藏族自治州',value: Math.round(Math.random()*1000)},
            {name: '海南藏族自治州',value: Math.round(Math.random()*1000)},
            {name: '海北藏族自治州',value: Math.round(Math.random()*1000)},
            {name: '黄南藏族自治州',value: Math.round(Math.random()*1000)},
            {name: '海东地区',value: Math.round(Math.random()*1000)},
            {name: '西宁市',value: Math.round(Math.random()*1000)},
            {name: '甘孜藏族自治州',value: Math.round(Math.random()*1000)},
            {name: '阿坝藏族羌族自治州',value: Math.round(Math.random()*1000)},
            {name: '凉山彝族自治州',value: Math.round(Math.random()*1000)},
            {name: '绵阳市',value: Math.round(Math.random()*1000)},
            {name: '达州市',value: Math.round(Math.random()*1000)},
            {name: '广元市',value: Math.round(Math.random()*1000)},
            {name: '雅安市',value: Math.round(Math.random()*1000)},
            {name: '宜宾市',value: Math.round(Math.random()*1000)},
            {name: '乐山市',value: Math.round(Math.random()*1000)},
            {name: '南充市',value: Math.round(Math.random()*1000)},
            {name: '巴中市',value: Math.round(Math.random()*1000)},
            {name: '泸州市',value: Math.round(Math.random()*1000)},
            {name: '成都市',value: Math.round(Math.random()*1000)},
            {name: '资阳市',value: Math.round(Math.random()*1000)},
            {name: '攀枝花市',value: Math.round(Math.random()*1000)},
            {name: '眉山市',value: Math.round(Math.random()*1000)},
            {name: '广安市',value: Math.round(Math.random()*1000)},
            {name: '德阳市',value: Math.round(Math.random()*1000)},
            {name: '内江市',value: Math.round(Math.random()*1000)},
            {name: '遂宁市',value: Math.round(Math.random()*1000)},
            {name: '自贡市',value: Math.round(Math.random()*1000)},
            {name: '黑河市',value: Math.round(Math.random()*1000)},
            {name: '大兴安岭地区',value: Math.round(Math.random()*1000)},
            {name: '哈尔滨市',value: Math.round(Math.random()*1000)},
            {name: '齐齐哈尔市',value: Math.round(Math.random()*1000)},
            {name: '牡丹江市',value: Math.round(Math.random()*1000)},
            {name: '绥化市',value: Math.round(Math.random()*1000)},
            {name: '伊春市',value: Math.round(Math.random()*1000)},
            {name: '佳木斯市',value: Math.round(Math.random()*1000)},
            {name: '鸡西市',value: Math.round(Math.random()*1000)},
            {name: '双鸭山市',value: Math.round(Math.random()*1000)},
            {name: '大庆市',value: Math.round(Math.random()*1000)},
            {name: '鹤岗市',value: Math.round(Math.random()*1000)},
            {name: '七台河市',value: Math.round(Math.random()*1000)},
            {name: '酒泉市',value: Math.round(Math.random()*1000)},
            {name: '张掖市',value: Math.round(Math.random()*1000)},
            {name: '甘南藏族自治州',value: Math.round(Math.random()*1000)},
            {name: '武威市',value: Math.round(Math.random()*1000)},
            {name: '陇南市',value: Math.round(Math.random()*1000)},
            {name: '庆阳市',value: Math.round(Math.random()*1000)},
            {name: '白银市',value: Math.round(Math.random()*1000)},
            {name: '定西市',value: Math.round(Math.random()*1000)},
            {name: '天水市',value: Math.round(Math.random()*1000)},
            {name: '兰州市',value: Math.round(Math.random()*1000)},
            {name: '平凉市',value: Math.round(Math.random()*1000)},
            {name: '临夏回族自治州',value: Math.round(Math.random()*1000)},
            {name: '金昌市',value: Math.round(Math.random()*1000)},
            {name: '嘉峪关市',value: Math.round(Math.random()*1000)},
            {name: '普洱市',value: Math.round(Math.random()*1000)},
            {name: '红河哈尼族彝族自治州',value: Math.round(Math.random()*1000)},
            {name: '文山壮族苗族自治州',value: Math.round(Math.random()*1000)},
            {name: '曲靖市',value: Math.round(Math.random()*1000)},
            {name: '楚雄彝族自治州',value: Math.round(Math.random()*1000)},
            {name: '大理白族自治州',value: Math.round(Math.random()*1000)},
            {name: '临沧市',value: Math.round(Math.random()*1000)},
            {name: '迪庆藏族自治州',value: Math.round(Math.random()*1000)},
            {name: '昭通市',value: Math.round(Math.random()*1000)},
            {name: '昆明市',value: Math.round(Math.random()*1000)},
            {name: '丽江市',value: Math.round(Math.random()*1000)},
            {name: '西双版纳傣族自治州',value: Math.round(Math.random()*1000)},
            {name: '保山市',value: Math.round(Math.random()*1000)},
            {name: '玉溪市',value: Math.round(Math.random()*1000)},
            {name: '怒江傈僳族自治州',value: Math.round(Math.random()*1000)},
            {name: '德宏傣族景颇族自治州',value: Math.round(Math.random()*1000)},
            {name: '百色市',value: Math.round(Math.random()*1000)},
            {name: '河池市',value: Math.round(Math.random()*1000)},
            {name: '桂林市',value: Math.round(Math.random()*1000)},
            {name: '南宁市',value: Math.round(Math.random()*1000)},
            {name: '柳州市',value: Math.round(Math.random()*1000)},
            {name: '崇左市',value: Math.round(Math.random()*1000)},
            {name: '来宾市',value: Math.round(Math.random()*1000)},
            {name: '玉林市',value: Math.round(Math.random()*1000)},
            {name: '梧州市',value: Math.round(Math.random()*1000)},
            {name: '贺州市',value: Math.round(Math.random()*1000)},
            {name: '钦州市',value: Math.round(Math.random()*1000)},
            {name: '贵港市',value: Math.round(Math.random()*1000)},
            {name: '防城港市',value: Math.round(Math.random()*1000)},
            {name: '北海市',value: Math.round(Math.random()*1000)},
            {name: '怀化市',value: Math.round(Math.random()*1000)},
            {name: '永州市',value: Math.round(Math.random()*1000)},
            {name: '邵阳市',value: Math.round(Math.random()*1000)},
            {name: '郴州市',value: Math.round(Math.random()*1000)},
            {name: '常德市',value: Math.round(Math.random()*1000)},
            {name: '湘西土家族苗族自治州',value: Math.round(Math.random()*1000)},
            {name: '衡阳市',value: Math.round(Math.random()*1000)},
            {name: '岳阳市',value: Math.round(Math.random()*1000)},
            {name: '益阳市',value: Math.round(Math.random()*1000)},
            {name: '长沙市',value: Math.round(Math.random()*1000)},
            {name: '株洲市',value: Math.round(Math.random()*1000)},
            {name: '张家界市',value: Math.round(Math.random()*1000)},
            {name: '娄底市',value: Math.round(Math.random()*1000)},
            {name: '湘潭市',value: Math.round(Math.random()*1000)},
            {name: '榆林市',value: Math.round(Math.random()*1000)},
            {name: '延安市',value: Math.round(Math.random()*1000)},
            {name: '汉中市',value: Math.round(Math.random()*1000)},
            {name: '安康市',value: Math.round(Math.random()*1000)},
            {name: '商洛市',value: Math.round(Math.random()*1000)},
            {name: '宝鸡市',value: Math.round(Math.random()*1000)},
            {name: '渭南市',value: Math.round(Math.random()*1000)},
            {name: '咸阳市',value: Math.round(Math.random()*1000)},
            {name: '西安市',value: Math.round(Math.random()*1000)},
            {name: '铜川市',value: Math.round(Math.random()*1000)},
            {name: '清远市',value: Math.round(Math.random()*1000)},
            {name: '韶关市',value: Math.round(Math.random()*1000)},
            {name: '湛江市',value: Math.round(Math.random()*1000)},
            {name: '梅州市',value: Math.round(Math.random()*1000)},
            {name: '河源市',value: Math.round(Math.random()*1000)},
            {name: '肇庆市',value: Math.round(Math.random()*1000)},
            {name: '惠州市',value: Math.round(Math.random()*1000)},
            {name: '茂名市',value: Math.round(Math.random()*1000)},
            {name: '江门市',value: Math.round(Math.random()*1000)},
            {name: '阳江市',value: Math.round(Math.random()*1000)},
            {name: '云浮市',value: Math.round(Math.random()*1000)},
            {name: '广州市',value: Math.round(Math.random()*1000)},
            {name: '汕尾市',value: Math.round(Math.random()*1000)},
            {name: '揭阳市',value: Math.round(Math.random()*1000)},
            {name: '珠海市',value: Math.round(Math.random()*1000)},
            {name: '佛山市',value: Math.round(Math.random()*1000)},
            {name: '潮州市',value: Math.round(Math.random()*1000)},
            {name: '汕头市',value: Math.round(Math.random()*1000)},
            {name: '深圳市',value: Math.round(Math.random()*1000)},
            {name: '东莞市',value: Math.round(Math.random()*1000)},
            {name: '中山市',value: Math.round(Math.random()*1000)},
            {name: '延边朝鲜族自治州',value: Math.round(Math.random()*1000)},
            {name: '吉林市',value: Math.round(Math.random()*1000)},
            {name: '白城市',value: Math.round(Math.random()*1000)},
            {name: '松原市',value: Math.round(Math.random()*1000)},
            {name: '长春市',value: Math.round(Math.random()*1000)},
            {name: '白山市',value: Math.round(Math.random()*1000)},
            {name: '通化市',value: Math.round(Math.random()*1000)},
            {name: '四平市',value: Math.round(Math.random()*1000)},
            {name: '辽源市',value: Math.round(Math.random()*1000)},
            {name: '承德市',value: Math.round(Math.random()*1000)},
            {name: '张家口市',value: Math.round(Math.random()*1000)},
            {name: '保定市',value: Math.round(Math.random()*1000)},
            {name: '唐山市',value: Math.round(Math.random()*1000)},
            {name: '沧州市',value: Math.round(Math.random()*1000)},
            {name: '石家庄市',value: Math.round(Math.random()*1000)},
            {name: '邢台市',value: Math.round(Math.random()*1000)},
            {name: '邯郸市',value: Math.round(Math.random()*1000)},
            {name: '秦皇岛市',value: Math.round(Math.random()*1000)},
            {name: '衡水市',value: Math.round(Math.random()*1000)},
            {name: '廊坊市',value: Math.round(Math.random()*1000)},
            {name: '恩施土家族苗族自治州',value: Math.round(Math.random()*1000)},
            {name: '十堰市',value: Math.round(Math.random()*1000)},
            {name: '宜昌市',value: Math.round(Math.random()*1000)},
            {name: '襄樊市',value: Math.round(Math.random()*1000)},
            {name: '黄冈市',value: Math.round(Math.random()*1000)},
            {name: '荆州市',value: Math.round(Math.random()*1000)},
            {name: '荆门市',value: Math.round(Math.random()*1000)},
            {name: '咸宁市',value: Math.round(Math.random()*1000)},
            {name: '随州市',value: Math.round(Math.random()*1000)},
            {name: '孝感市',value: Math.round(Math.random()*1000)},
            {name: '武汉市',value: Math.round(Math.random()*1000)},
            {name: '黄石市',value: Math.round(Math.random()*1000)},
            {name: '神农架林区',value: Math.round(Math.random()*1000)},
            {name: '天门市',value: Math.round(Math.random()*1000)},
            {name: '仙桃市',value: Math.round(Math.random()*1000)},
            {name: '潜江市',value: Math.round(Math.random()*1000)},
            {name: '鄂州市',value: Math.round(Math.random()*1000)},
            {name: '遵义市',value: Math.round(Math.random()*1000)},
            {name: '黔东南苗族侗族自治州',value: Math.round(Math.random()*1000)},
            {name: '毕节地区',value: Math.round(Math.random()*1000)},
            {name: '黔南布依族苗族自治州',value: Math.round(Math.random()*1000)},
            {name: '铜仁地区',value: Math.round(Math.random()*1000)},
            {name: '黔西南布依族苗族自治州',value: Math.round(Math.random()*1000)},
            {name: '六盘水市',value: Math.round(Math.random()*1000)},
            {name: '安顺市',value: Math.round(Math.random()*1000)},
            {name: '贵阳市',value: Math.round(Math.random()*1000)},
            {name: '烟台市',value: Math.round(Math.random()*1000)},
            {name: '临沂市',value: Math.round(Math.random()*1000)},
            {name: '潍坊市',value: Math.round(Math.random()*1000)},
            {name: '青岛市',value: Math.round(Math.random()*1000)},
            {name: '菏泽市',value: Math.round(Math.random()*1000)},
            {name: '济宁市',value: Math.round(Math.random()*1000)},
            {name: '德州市',value: Math.round(Math.random()*1000)},
            {name: '滨州市',value: Math.round(Math.random()*1000)},
            {name: '聊城市',value: Math.round(Math.random()*1000)},
            {name: '东营市',value: Math.round(Math.random()*1000)},
            {name: '济南市',value: Math.round(Math.random()*1000)},
            {name: '泰安市',value: Math.round(Math.random()*1000)},
            {name: '威海市',value: Math.round(Math.random()*1000)},
            {name: '日照市',value: Math.round(Math.random()*1000)},
            {name: '淄博市',value: Math.round(Math.random()*1000)},
            {name: '枣庄市',value: Math.round(Math.random()*1000)},
            {name: '莱芜市',value: Math.round(Math.random()*1000)},
            {name: '赣州市',value: Math.round(Math.random()*1000)},
            {name: '吉安市',value: Math.round(Math.random()*1000)},
            {name: '上饶市',value: Math.round(Math.random()*1000)},
            {name: '九江市',value: Math.round(Math.random()*1000)},
            {name: '抚州市',value: Math.round(Math.random()*1000)},
            {name: '宜春市',value: Math.round(Math.random()*1000)},
            {name: '南昌市',value: Math.round(Math.random()*1000)},
            {name: '景德镇市',value: Math.round(Math.random()*1000)},
            {name: '萍乡市',value: Math.round(Math.random()*1000)},
            {name: '鹰潭市',value: Math.round(Math.random()*1000)},
            {name: '新余市',value: Math.round(Math.random()*1000)},
            {name: '南阳市',value: Math.round(Math.random()*1000)},
            {name: '信阳市',value: Math.round(Math.random()*1000)},
            {name: '洛阳市',value: Math.round(Math.random()*1000)},
            {name: '驻马店市',value: Math.round(Math.random()*1000)},
            {name: '周口市',value: Math.round(Math.random()*1000)},
            {name: '商丘市',value: Math.round(Math.random()*1000)},
            {name: '三门峡市',value: Math.round(Math.random()*1000)},
            {name: '新乡市',value: Math.round(Math.random()*1000)},
            {name: '平顶山市',value: Math.round(Math.random()*1000)},
            {name: '郑州市',value: Math.round(Math.random()*1000)},
            {name: '安阳市',value: Math.round(Math.random()*1000)},
            {name: '开封市',value: Math.round(Math.random()*1000)},
            {name: '焦作市',value: Math.round(Math.random()*1000)},
            {name: '许昌市',value: Math.round(Math.random()*1000)},
            {name: '濮阳市',value: Math.round(Math.random()*1000)},
            {name: '漯河市',value: Math.round(Math.random()*1000)},
            {name: '鹤壁市',value: Math.round(Math.random()*1000)},
            {name: '大连市',value: Math.round(Math.random()*1000)},
            {name: '朝阳市',value: Math.round(Math.random()*1000)},
            {name: '丹东市',value: Math.round(Math.random()*1000)},
            {name: '铁岭市',value: Math.round(Math.random()*1000)},
            {name: '沈阳市',value: Math.round(Math.random()*1000)},
            {name: '抚顺市',value: Math.round(Math.random()*1000)},
            {name: '葫芦岛市',value: Math.round(Math.random()*1000)},
            {name: '阜新市',value: Math.round(Math.random()*1000)},
            {name: '锦州市',value: Math.round(Math.random()*1000)},
            {name: '鞍山市',value: Math.round(Math.random()*1000)},
            {name: '本溪市',value: Math.round(Math.random()*1000)},
            {name: '营口市',value: Math.round(Math.random()*1000)},
            {name: '辽阳市',value: Math.round(Math.random()*1000)},
            {name: '盘锦市',value: Math.round(Math.random()*1000)},
            {name: '忻州市',value: Math.round(Math.random()*1000)},
            {name: '吕梁市',value: Math.round(Math.random()*1000)},
            {name: '临汾市',value: Math.round(Math.random()*1000)},
            {name: '晋中市',value: Math.round(Math.random()*1000)},
            {name: '运城市',value: Math.round(Math.random()*1000)},
            {name: '大同市',value: Math.round(Math.random()*1000)},
            {name: '长治市',value: Math.round(Math.random()*1000)},
            {name: '朔州市',value: Math.round(Math.random()*1000)},
            {name: '晋城市',value: Math.round(Math.random()*1000)},
            {name: '太原市',value: Math.round(Math.random()*1000)},
            {name: '阳泉市',value: Math.round(Math.random()*1000)},
            {name: '六安市',value: Math.round(Math.random()*1000)},
            {name: '安庆市',value: Math.round(Math.random()*1000)},
            {name: '滁州市',value: Math.round(Math.random()*1000)},
            {name: '宣城市',value: Math.round(Math.random()*1000)},
            {name: '阜阳市',value: Math.round(Math.random()*1000)},
            {name: '宿州市',value: Math.round(Math.random()*1000)},
            {name: '黄山市',value: Math.round(Math.random()*1000)},
            {name: '巢湖市',value: Math.round(Math.random()*1000)},
            {name: '亳州市',value: Math.round(Math.random()*1000)},
            {name: '池州市',value: Math.round(Math.random()*1000)},
            {name: '合肥市',value: Math.round(Math.random()*1000)},
            {name: '蚌埠市',value: Math.round(Math.random()*1000)},
            {name: '芜湖市',value: Math.round(Math.random()*1000)},
            {name: '淮北市',value: Math.round(Math.random()*1000)},
            {name: '淮南市',value: Math.round(Math.random()*1000)},
            {name: '马鞍山市',value: Math.round(Math.random()*1000)},
            {name: '铜陵市',value: Math.round(Math.random()*1000)},
            {name: '南平市',value: Math.round(Math.random()*1000)},
            {name: '三明市',value: Math.round(Math.random()*1000)},
            {name: '龙岩市',value: Math.round(Math.random()*1000)},
            {name: '宁德市',value: Math.round(Math.random()*1000)},
            {name: '福州市',value: Math.round(Math.random()*1000)},
            {name: '漳州市',value: Math.round(Math.random()*1000)},
            {name: '泉州市',value: Math.round(Math.random()*1000)},
            {name: '莆田市',value: Math.round(Math.random()*1000)},
            {name: '厦门市',value: Math.round(Math.random()*1000)},
            {name: '丽水市',value: Math.round(Math.random()*1000)},
            {name: '杭州市',value: Math.round(Math.random()*1000)},
            {name: '温州市',value: Math.round(Math.random()*1000)},
            {name: '宁波市',value: Math.round(Math.random()*1000)},
            {name: '舟山市',value: Math.round(Math.random()*1000)},
            {name: '台州市',value: Math.round(Math.random()*1000)},
            {name: '金华市',value: Math.round(Math.random()*1000)},
            {name: '衢州市',value: Math.round(Math.random()*1000)},
            {name: '绍兴市',value: Math.round(Math.random()*1000)},
            {name: '嘉兴市',value: Math.round(Math.random()*1000)},
            {name: '湖州市',value: Math.round(Math.random()*1000)},
            {name: '盐城市',value: Math.round(Math.random()*1000)},
            {name: '徐州市',value: Math.round(Math.random()*1000)},
            {name: '南通市',value: Math.round(Math.random()*1000)},
            {name: '淮安市',value: Math.round(Math.random()*1000)},
            {name: '苏州市',value: Math.round(Math.random()*1000)},
            {name: '宿迁市',value: Math.round(Math.random()*1000)},
            {name: '连云港市',value: Math.round(Math.random()*1000)},
            {name: '扬州市',value: Math.round(Math.random()*1000)},
            {name: '南京市',value: Math.round(Math.random()*1000)},
            {name: '泰州市',value: Math.round(Math.random()*1000)},
            {name: '无锡市',value: Math.round(Math.random()*1000)},
            {name: '常州市',value: Math.round(Math.random()*1000)},
            {name: '镇江市',value: Math.round(Math.random()*1000)},
            {name: '吴忠市',value: Math.round(Math.random()*1000)},
            {name: '中卫市',value: Math.round(Math.random()*1000)},
            {name: '固原市',value: Math.round(Math.random()*1000)},
            {name: '银川市',value: Math.round(Math.random()*1000)},
            {name: '石嘴山市',value: Math.round(Math.random()*1000)},
            {name: '儋州市',value: Math.round(Math.random()*1000)},
            {name: '文昌市',value: Math.round(Math.random()*1000)},
            {name: '乐东黎族自治县',value: Math.round(Math.random()*1000)},
            {name: '三亚市',value: Math.round(Math.random()*1000)},
            {name: '琼中黎族苗族自治县',value: Math.round(Math.random()*1000)},
            {name: '东方市',value: Math.round(Math.random()*1000)},
            {name: '海口市',value: Math.round(Math.random()*1000)},
            {name: '万宁市',value: Math.round(Math.random()*1000)},
            {name: '澄迈县',value: Math.round(Math.random()*1000)},
            {name: '白沙黎族自治县',value: Math.round(Math.random()*1000)},
            {name: '琼海市',value: Math.round(Math.random()*1000)},
            {name: '昌江黎族自治县',value: Math.round(Math.random()*1000)},
            {name: '临高县',value: Math.round(Math.random()*1000)},
            {name: '陵水黎族自治县',value: Math.round(Math.random()*1000)},
            {name: '屯昌县',value: Math.round(Math.random()*1000)},
            {name: '定安县',value: Math.round(Math.random()*1000)},
            {name: '保亭黎族苗族自治县',value: Math.round(Math.random()*1000)},
            {name: '五指山市',value: Math.round(Math.random()*1000)}
        ]
    };
    option.legend = {
        x:'right',
        data:['随机数据']
    };
    option.dataRange = {
        orient: 'horizontal',
        x: 'right',
        min: 0,
        max: 1000,
        color:['orange','yellow'],
        text:['高','低'],           // 文本，默认为数值文本
        splitNumber:0
    };
    provinceChart.setOption(option, true);
})

function getNextDay(date){
    var date = new Date(date);
    date.setDate(date.getDate() + 1);
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
}
function formatDay(date){
    var date = new Date(date);
    return (date.getMonth()+1) + '/' + date.getDate()+'/'+date.getFullYear();
}
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}