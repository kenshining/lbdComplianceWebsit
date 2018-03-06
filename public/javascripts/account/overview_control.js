var commonUtil = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var dataDic = new DataDictionary();

$(document).ready(function(){
	//待还本息
	$('#myLoan_dhbx').html(commonUtil.floatAdd($('#myLoan_dhBj').html(),$('#myLoan_dhLx').html()));
	//交易类型
	$('.overview_trading_record').each(function(){
		$(this).html(dataDic.dicTradeType($(this).attr('data-type')));
	});
	
	//投资的交易状态
	$('#user_investment .invest_state').each(function(){
		var stateId = $(this).data('state');
		$(this).html(dataDic.divInvestState(stateId));
	});
	//数据格式转换 100000 - 100,000.00
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

	//资产总额飘窗
	$('#total_float_icon').on('mouseover',function(){
		$(this).removeClass('icon-float').addClass("icon-float-h");
		$(this).next().show();
	}).on('mouseout',function(){
		$(this).addClass('icon-float').removeClass("icon-float-h");
		$(this).next().hide();
	});
});
