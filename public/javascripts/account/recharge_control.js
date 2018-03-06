var validationUtils = new CommonValidationUtils();
var commonValidationEmu = new CommonValidationEmu();
var Util = new CommonUtils();
/*tab切换*/
function tabPage(index){
	$('#tab_titles').find('li').eq(index).addClass('on').siblings().removeClass('on');
	$('#tab_pages').find('.recharge_tabpage').eq(index).show().siblings().hide();
	$('.orange_slider').animate({'left':28+160*index},'fast');
};
/*错误提示框显示*/
function errorTipShow(errorDom,tipText){
	errorDom.removeClass('hide_op').html('<em class="icon icon-er"></em>'+tipText);
	errorDom.parent().find('input').addClass("error");
};
/*错误提示框隐藏*/
function errorTipHide(errorDom){
	errorDom.addClass('hide_op');
	errorDom.parent().find('input').removeClass("error");
};
/*更多银行*/
function moreBank(){
	$('#more_bank_btn').click(function(){
		var bankMoreWrap = $('#recharge_bankcard_more');
		if(bankMoreWrap.is(':hidden')){
			bankMoreWrap.show();
			$(this).find('.icon').hide()
			$(this).find('.icon-down').show();
		}else{
			bankMoreWrap.hide();
			$(this).find('.icon').hide();
			$(this).find('.icon-up').show();
		};
	});
};
/*选择银行*/
function ckBank(){
	$('#recharge_wycz').on('click','.recharge_bankcard',function(){
		$('.recharge_bankcard').removeClass('ck');
		$('.icon-yhck').hide();
		$(this).addClass('ck').find('.icon-yhck').show();
		renderCkBankCardInfo($(this));
	});
};
/*获取用户认证信息，验证用户是否绑卡*/
function isBindBankCard(){
	validateUserValidAuthenticateType(function(e){
		if(e.status){
			var authArray = e.msg.auth;
			//未实名
			if(authArray.indexOf(2) == -1){

			}
			//未绑卡
			if(authArray.indexOf(3) == -1){
				noBindBankCard();
			//已绑卡
			}else{
				//获取绑定的银行卡信息
				getBindBankCardInfo();
			}

			/*//未开通存管账户
			if(authArray.indexOf(4) == -1){
				noBindBankCard();
			//已开通存管账户
			}else{

			}*/
		}else{
			layer.msg(JSON.stringify(e));
		}
	},function(e){
		layer.msg(JSON.stringify(e));
	});
}
/*已绑卡，获取绑卡的银行卡信息*/
function getBindBankCardInfo(){
	$.lbdAjax({
		url:"/account/bindBankCard",
		dataType:"JSON",
		type:"POST",
		data:{_csrf:$("#_csrf").val()},
		success:function(e){
			/*初始化快捷充值绑定的银行卡信息*/
			var data = e.data[0];
			if(e.state == "SUCCESS"){
				var imageUrl = $('#_imageUrl').val();
					var cardType = {
						DC:"储蓄卡",
						CC:"信用卡",
						SCC:"准贷记卡",
						PC:"预付费卡"
					};
					//充值按钮可点击
					$('#recharge_kjcz_btn').attr('disabled',false).removeClass('disabled');

					//银行卡logo
					$('#kjcz_bankCardImgBox').html('<img src="'+imageUrl+data.bankCard.iconUrl+'"/>');

					//银行卡尾号
					$('#kjcz_bankCardNumber').html('尾号 '+data.bankNo);

					//卡种，单笔限额，单日限额
					$('#kjcz_BankCardInfo').html(
						"<tr><td>"+cardType[data.bankCard.cardType]+"</td><td id='kjcz_BankCardSingle' data-single='5'>"+data.bankCard.onceLimit+"</td><td id='kjcz_BankCardOneday' data-oneday='10'>"+data.bankCard.dailyLimit+"</td></tr>"
					);
					
					//手续费是否由平台承担
					if(data.bankCard.handingFee == 1){
						//平台承担
						$('#recharge_kjcz .recharge_sxf_tip').show();
					}else{
						//个人承担
						$('#recharge_kjcz .recharge_sxf').html(Util.formatMoney(data.bankCard.fee));
					}
					KJCZ_rechargeControl(data);
			}else{
				layer.msg(JSON.stringify(e));
			}
		},
		error:function(e){
			layer.msg(JSON.stringify(e));
		}
	});
};
/*未绑卡，显示绑卡弹出框*/
function noBindBankCard(){
	/*快捷充值，未绑卡弹出框*/
	var Dialog = $.dialog({
		dialogDom:'<a class="dialog_close_btn icon-zh-close icon" id="dialog_close_btn"></a><h2 class="dia_title">开通存管账户</h2><p>为满足监管要求，需要为您开通****存管账户，以保障您的资金安全</p><a class="btn">立即开通</a>',
		className:'msgSetting_dialog_wrapper dia_wrapper',
		isClose:false
	},function(){
		tabPage(1);
	});
};
//快捷充值提交验证
function KJCZ_rechargeControl(bankCardInfo){
	//快捷充值输入验证和充值手续费，实际到账金额的计算
	$('#recharge_kjcz_input').on('input',function(){

		var val = $('#recharge_kjcz_input').val().replace(/\s+/g,"");
		var reg = /^[0-9]+(\.{0,1}[0-9]{1,2})?$/g;
		var fee = bankCardInfo.bankCard.fee;
		var dzje = Util.floatSub(val,fee);

		errorTipHide($('#recharge_kjcz').find('.error_tip'));
		$('#recharge_kjcz').find('.recharge_dzje').html('0.00');

		if(ValidationUtils.isNull(val)){
			return ;
		}
		//充值金额必须为数字且最多到小数点后两位
		if(!reg.test(val)){
			errorTipShow($('#recharge_kjcz').find('.error_tip'),commonValidationEmu.errorMsg.recharge_wrong_format);
			return ;
		};
		//充值金额是否大于单笔交易额
		if(val-bankCardInfo.bankCard.onceLimit > 0){
			errorTipShow($('#recharge_kjcz').find('.error_tip'),commonValidationEmu.errorMsg.recharge_kjcz_more_single);
			return ;
		}
		//是否需要用户承担手续费,计算实际到账金额
		if(bankCardInfo.bankCard.handingFee == 2){
			dzje = dzje>0 ? dzje : 0;
			$('#recharge_kjcz .recharge_dzje').html(Util.formatMoney(dzje));
		}else{
			$('#recharge_kjcz .recharge_dzje').html(Util.formatMoney(val));
		}
	});

	//快捷充值验证
	$('#recharge_kjcz_btn').on('click',function(){
		
		var errorDom = $('#recharge_kjcz').find('.error_tip')
		var val = $('#recharge_kjcz_input').val().replace(/\s+/g,"");
		var reg = /^[0-9]+(\.{0,1}[0-9]{1,2})?$/g;

		$('#recharge_kjcz_btn').addClass('disabled').val('充值中...');
		$('#recharge_kjcz_btn').attr('disabled',true);

		errorTipHide(errorDom);

		//充值金额是否为空
		if(validationUtils.isNull(val)){
			errorTipShow(errorDom,commonValidationEmu.errorMsg.recharge_no);

			$('#recharge_kjcz_btn').removeClass('disabled').val('充值');
			$('#recharge_kjcz_btn').attr('disabled',false);
			return ;
		};
		//充值金额格式必须为数字且最多到小数点后两位
		if(!reg.test(val)){
			errorTipShow(errorDom,commonValidationEmu.errorMsg.recharge_wrong_format);

			$('#recharge_kjcz_btn').removeClass('disabled').val('充值');
			$('#recharge_kjcz_btn').attr('disabled',false);
			return ;
		};
		//充值金额是否大于单笔交易额
		if(val-bankCardInfo.bankCard.onceLimit > 0){
			errorTipShow(errorDom,commonValidationEmu.errorMsg.recharge_kjcz_more_single);

			$('#recharge_kjcz_btn').removeClass('disabled').val('充值');
			$('#recharge_kjcz_btn').attr('disabled',false);
			return ;
		}
		//快捷充值
		KJCZ_submit_recharge(bankCardInfo);
	});
};
//快捷充值接口提交
function KJCZ_submit_recharge(bankCardInfo){
	var amount = $('#recharge_kjcz_input').val().replace(/\s+/g,"");
	$.lbdAjax({
		url:"/account/capital/fastRecharge",
		dataType:"JSON",
		type:"POST",
		data:{cardId:bankCardInfo.id,amount:amount,_csrf:$("#_csrf").val()},
		success:function(e){
			$('#recharge_kjcz_btn').removeClass('disabled').val('充值');
			$('#recharge_kjcz_btn').attr('disabled',false);
			if(e.state == 'SUCCESS'){
				//单日限额

				//可用余额
				refreshAccountBanlance("topBar_balance");

				var Dialog = $.dialog({
					dialogDom:'<a class="dialog_close_btn icon-zh-close icon" id="dialog_close_btn"></a><div class="icon icon-ok"></div><p class="orange" style="color:#ff7a33;">恭喜您，充值成功</p><ul><li class="btn recharge_diaCloseBtn_go_accountCenter">我的账户</li><li class="btn recharge_diaCloseBtn_go_invest">去理财</li></ul>',
					className:'msgSetting_dialog_wrapper dia_wrapper rzFail_dialog_wrapper recharge_ok_dialog',
					isClose:false
				},function(){
					//清空快捷充值记录
					$('#recharge_kjcz_input').val('');
					$('#recharge_kjcz .recharge_dzje').html('0.00');
				});
				$('.recharge_diaCloseBtn_go_accountCenter').click(function(){
					Dialog.close();
					
					changeCurrentMenu('/account/maintain/overview','overview_sub_m_btn');
				});
				$('.recharge_diaCloseBtn_go_invest').click(function(){
					Dialog.close();
					window.location.href = '/investment/investmentList';
				});
			}else{
				errorTipShow($('#recharge_kjcz').find('.error_tip'),e.message);
				return ;	
			}	
		},
		error:function(e){
			layer.msg(JSON.stringify(e.message));
			$('#recharge_kjcz_btn').removeClass('disabled').val('充值');
			$('#recharge_kjcz_btn').attr('disabled',false);
		}
	});
};
//网银充值提交验证
function WYCZ_rechargeControl(){
	var shortName = $('#recharge_wycz .ck').attr('data-shortName');
	var cardType = $('#recharge_wycz .ck').attr('data-cardType');
	var onceLimit = $('#recharge_wycz .ck').attr('data-onceLimit');
	var dailyLimit = $('#recharge_wycz .ck').attr('data-dailyLimit');
	var rechargeCondition = $('#recharge_wycz .ck').attr('data-rechargeCondition');
	var handingFee = $('#recharge_wycz .ck').attr('data-handingFee');
	var fee = $('#recharge_wycz .ck').attr('data-fee');

	//网银充值输入验证和充值手续费，实际到账金额的计算
	$('#recharge_wycz_input').on('input',function(){

		var val = $('#recharge_wycz_input').val().replace(/\s+/g,"");
		var reg = /^[0-9]+(\.{0,1}[0-9]{1,2})?$/g;
		var dzje = Util.floatSub(val,fee);

		errorTipHide($('#recharge_wycz').find('.error_tip'));
		$('#recharge_wycz').find('.recharge_dzje').html('0.00');

		if(ValidationUtils.isNull(val)){
			return ;
		}

		//充值金额必须为数字且最多到小数点后两位
		if(!reg.test(val)){
			errorTipShow($('#recharge_wycz').find('.error_tip'),commonValidationEmu.errorMsg.recharge_wrong_format);
			return ;
		};
		//是否超过单笔限额
		if(val-onceLimit > 0){
			errorTipShow($('#recharge_wycz').find('.error_tip'),commonValidationEmu.errorMsg.recharge_wycz_more_single);
			return ;
		}
		//是否需要用户承担手续费,计算实际到账金额
		if(handingFee == 2){	
			dzje = dzje>0 ? dzje : 0;
			$('#recharge_wycz .recharge_dzje').html(Util.formatMoney(dzje));
		}else{
			$('#recharge_wycz .recharge_dzje').html(Util.formatMoney(val));
		}
	});

	//网银充值验证
	$('#recharge_wycz_btn').on('click',function(){
		var onceLimit = $('#recharge_wycz .ck').attr('data-onceLimit');
		var errorDom = $('#recharge_wycz').find('.error_tip')
		var val = $('#recharge_wycz_input').val().replace(/\s+/g,"");
		var reg = /^[0-9]+(\.{0,1}[0-9]{1,2})?$/g;

		$('#recharge_wycz_btn').addClass('disabled').val('充值中...');
		$('#recharge_wycz_btn').attr('disabled',true);

		errorTipHide(errorDom);

		//充值金额是否为空
		if(validationUtils.isNull(val)){
			errorTipShow(errorDom,commonValidationEmu.errorMsg.recharge_no);

			$('#recharge_wycz_btn').removeClass('disabled').val('充值');
			$('#recharge_wycz_btn').attr('disabled',false);
			return ;
		};
		//充值金额格式必须为数字且最多到小数点后两位
		if(!reg.test(val)){
			errorTipShow(errorDom,commonValidationEmu.errorMsg.recharge_wrong_format);

			$('#recharge_wycz_btn').removeClass('disabled').val('充值');
			$('#recharge_wycz_btn').attr('disabled',false);
			return ;
		};
		//是否超过单笔限额
		if(val-onceLimit > 0){
			errorTipShow($('#recharge_wycz').find('.error_tip'),commonValidationEmu.errorMsg.recharge_wycz_more_single);

			$('#recharge_wycz_btn').removeClass('disabled').val('充值');
			$('#recharge_wycz_btn').attr('disabled',false);
			return ;
		}

		//网银充值
		WYCZ_submit_recharge(val);
	});
};
//网银充值提交接口
function WYCZ_submit_recharge(amount){
	$.lbdAjax({
		url:"/account/capital/onlineRecharge",
		dataType:"JSON",
		type:"POST",
		data:{amount:amount,_csrf:$("#_csrf").val()},
		success:function(e){

			$('#recharge_wycz_btn').removeClass('disabled').val('充值');
			$('#recharge_wycz_btn').attr('disabled',false);

			if(e.state == 'SUCCESS'){
				//单日限额
				
				//可用余额
				refreshAccountBanlance("topBar_balance");

				var Dialog = $.dialog({
					dialogDom:'<a class="dialog_close_btn icon-zh-close icon" id="dialog_close_btn"></a><div class="icon icon-ok"></div><p class="orange" style="color:#ff7a33;">恭喜您，充值成功</p><ul><li class="btn recharge_diaCloseBtn_go_accountCenter">我的账户</li><li class="btn recharge_diaCloseBtn_go_invest">去理财</li></ul>',
					className:'msgSetting_dialog_wrapper dia_wrapper rzFail_dialog_wrapper recharge_ok_dialog',
					isClose:false
				},function(){
					//清空网银充值记录
					$('#recharge_wycz_input').val('');
					$('#recharge_wycz .recharge_dzje').html('0.00');
				});
				$('.recharge_diaCloseBtn_go_accountCenter').click(function(){
					Dialog.close();
					changeCurrentMenu('/account/maintain/overview','overview_sub_m_btn');
				});
				$('.recharge_diaCloseBtn_go_invest').click(function(){
					Dialog.close();
					window.location.href = '/investment/investmentList';
				});
			}else{
				errorTipShow($('#recharge_wycz').find('.error_tip'),e.message);
				return ;
			}	
		},
		error:function(e){
			layer.msg(JSON.stringify(e.message));
			$('#recharge_wycz_btn').removeClass('disabled').val('充值');
			$('#recharge_wycz_btn').attr('disabled',false);
		}
	});
};
//选择银行渲染相关信息到页面
function renderCkBankCardInfo(dom){
	var id = dom.attr('data-id');
	var shortName = dom.attr('data-shortName');
	var cardType = dom.attr('data-cardType');
	var onceLimit = dom.attr('data-onceLimit');
	var dailyLimit = dom.attr('data-dailyLimit');
	var rechargeCondition = dom.attr('data-rechargeCondition');
	var handingFee = dom.attr('data-handingFee');
 	var fee = dom.attr('data-fee');
	//渲染所选的银行卡的信息
	//单笔限额，单日限额，网银充值条件
	$('#wycz_BankCardInfo').html(
		"<tr><td>"+onceLimit+"</td><td>"+dailyLimit+"</td><td>"+rechargeCondition+"</td></tr>"
	);

	//手续费是否由平台承担
	if(handingFee == 1){
		//平台承担
		$('#recharge_wycz .recharge_sxf_tip').show();
	}else{
		//个人承担
		$('#recharge_wycz .recharge_sxf').html(Util.formatMoney(fee));
	}
};
/*获取网银充值银行卡信息*/
function getBankCardInfo(type,callBack){
	$.lbdAjax({
		url:"/account/bankCard",
		dataType:"JSON",
		type:"POST",
		data:{rechargeType:type,_csrf:$("#_csrf").val()},
		success:function(e){
			callBack(e);
		},
		error:function(e){
			layer.msg(JSON.stringify(e));
		}
	});
};

$(document).ready(function(){
	/*快捷充值，网银充值tab切换*/
	$('#tab_titles').on('click','li',function(){
		var idx = $(this).index();
		tabPage(idx);
	}).on('click','li:first-child',function(){
		isBindBankCard();
	});

	//文本输入框获取焦点和失去焦点的样式变化
	$('input[type=text]').focus(function(){
		$(this).addClass('onfocus');
	}).blur(function(){
		$(this).removeClass('onfocus');
	});

	/*更多银行*/
	moreBank();
	
	/*是否绑卡，如果未绑卡，弹出框提示请开通存管账户，点击立即开通，跳转第三方，关闭则进入网银充值画面*/
	isBindBankCard();

	/*获取网银充值的银行卡信息，初始化页面*/
	getBankCardInfo(2,function(e){
		if(e.state == 'SUCCESS'){
			//初始化网银银行卡列表
			var imageUrl = $('#_imageUrl').val();
			var str = "";
			for(var i in e.data){
				str += '<section  data-handingFee="'+e.data[i].handingFee+'" data-fee="'+e.data[i].fee+'" data-shortName="'+e.data[i].shortName+'" data-cardType="'+e.data[i].cardType+'"  data-rechargeCondition="'+e.data[i].rechargeCondition+'" data-onceLimit="'+e.data[i].onceLimit+'" data-dailyLimit="'+e.data[i].dailyLimit+'" class="recharge_bankcard auto_parent"><img class="icon auto_sun" src="'+imageUrl+e.data[i].iconUrl+'" /><em class="icon-yhck hide"></em></section>'
			};
			$('#recharge_bankcard_more').html(str);
			//按钮可点击状态
			$('#recharge_wycz_btn').attr('disabled',false).removeClass('disabled');

			//初始化常用银行卡信息
			$('#recharge_wycz_isUsed').html('<section data-handingFee="'+e.data[0].handingFee+'" data-fee="'+e.data[0].fee+'" data-shortName="'+e.data[0].shortName+'" data-cardType="'+e.data[0].cardType+'"  data-rechargeCondition="'+e.data[0].rechargeCondition+'" data-onceLimit="'+e.data[0].onceLimit+'" data-dailyLimit="'+e.data[0].dailyLimit+'" class="recharge_bankcard auto_parent ck"><img class="icon auto_sun" src="'+imageUrl+e.data[0].iconUrl+'" /><em class="icon-yhck"></em></section>');
			
			//初始化选择的银行卡相关信息
			renderCkBankCardInfo($('#recharge_wycz_isUsed').find('.ck'));

			//选择银行点击事件
			ckBank();

			//网银充值提交验证
			WYCZ_rechargeControl();
		}else{
			layer.msg(JSON.stringify(e.message));
		}
	});

	
});