var commonUtil = new CommonUtils();
var dataDic = new DataDictionary();

//Banner轮播图效果
var createBanner = function(){
	$('.flicker-example').flickerplate({
        auto_flick: true,
        auto_flick_delay: 8,
        flick_animation: 'transform-slide',
		dot_alignment: 'center',
		block_text: false
    });
    //鼠标移入后暂定轮播效果
    $(".litlefot").on("mouseover",function(e){
    	$(".litlefot").css("cursor", "pointer");
    	e.stopPropagation();
    });
};

$(document).ready(function(){
	/*设置页面min-height*/
	var pageH = $('.index_page').height()+260;
	$('.index_page').css('min-height',pageH+'px');

	//Banner轮播图效果
	createBanner();

	//投资统计，投资产品列表数据格式的转换
	$('.formatMoney').each(function(){
		var val = $(this).html();
		if(val.indexOf('￥') != -1){
			var _val = commonUtil.formatMoney(val.replace(/￥/g,''));
			$(this).html('￥'+_val);
		}else{
			var _val = commonUtil.formatMoney(val);
			$(this).html(_val);
		};
	});
	
	//投资产品列表投资产品名称
	$('.index_product_name').each(function(k,v){
		var val = $(this).data('name');
		$(this).html(dataDic.dicProductName(val));
	})

	//预期年化收益率精确计算并保留小数点后两位
	$('.index_per').each(function(k,v){
		var per = $(this).data('per');
		var _per = commonUtil.floatMul(per,100).toFixed(2);
		var arrPer = _per.split('.')
		if(arrPer[1] === '00'){
			_per = arrPer[0];
		}else if(arrPer[1].substr(1,1) === '0'){
			_per = arrPer[0] +'.'+ arrPer[1].substr(0,1);
		}
		var str = _per+'<span>%</span>';
		$(this).html(str);
	});

	//投资进度百分比精确计算
	$('.invest_range').each(function(k,v){
		var amount = $(this).data('amount');
		var htje = $(this).data('htje');
		var range = Math.floor(commonUtil.floatMul(commonUtil.floatDiv(amount,htje),100));
		$(this).css('width',range+'%');
		$(this).parent().next().html(range+'%');
	});
});