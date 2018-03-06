var validationUtils = new CommonValidationUtils();
var commonValidationEmu = new CommonValidationEmu();
var Util = new CommonUtils();
var timer = null;

//数据格式转换 100000 - 100,000.00
function _formatMoney(){
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
}
/*提现金额验证*/
function volidataWithdrawInput(bankCardInfo,userInfo){

	$('#withdraw_input').on("input",function(){
		var withdrawVal = $('#withdraw_input').val().replace(/\s+/g,"");
		var reg = /^[0-9]+(\.{0,1}[0-9]{1,2})?$/g;
		
		$('#withdraw_input').removeClass('error');
		$('#withdraw_input').next().addClass('hide_op');
		$('#withdraw_dzje').html('0.00');


		if(validationUtils.isNull(withdrawVal)){
			return ;
		};
		//提现金额格式是否正确
		if(!reg.test(withdrawVal)){
			$('#withdraw_input').addClass('error');
			$('#withdraw_input').next().removeClass('hide_op').html("<em class='icon icon-er'></em>"+commonValidationEmu.errorMsg.withdraw_withdraw_format_wrong);
			return ;
		}	
		//提现是否大于可用余额
		if(withdrawVal - userInfo.msg.data.balance > 0){
			$('#withdraw_input').addClass('error');
			$('#withdraw_input').next().removeClass('hide_op').html("<em class='icon icon-er'></em>"+commonValidationEmu.errorMsg.withdraw_withdraw_gt);
			return ;
		}
		//实际到账金额的计算
		if(bankCardInfo.data[0].bankCard.handingFee == 2){
			var dzje = Util.floatSub(withdrawVal,bankCardInfo.data[0].bankCard.fee);
			dzje = dzje>0 ? dzje : 0;
			$('#withdraw_dzje').html(Util.formatMoney(dzje));
		}else{
			var dzje = validationUtils.isNull(withdrawVal) ? 0 : withdrawVal;
			$('#withdraw_dzje').html(Util.formatMoney(dzje));
		}
	});
};
/*提现验证*/
function volidataWithdraw(bankCardInfo,userInfo){
	$('#withdraw_sumit_btn').click(function(){

		var withdrawVal = $('#withdraw_input').val();
		var reg = /^[0-9]+(\.{0,1}[0-9]{1,2})?$/g;
		var dealpwdVal = $('#withdraw_dealpwd_input').val();

		$('#withdraw_sumit_btn').val('提现中').addClass('disabled');
		$('#withdraw_sumit_btn').attr('disabled',true);

		$('#withdraw_input').removeClass('error');
		$('#withdraw_input').next().addClass('hide_op');

		$('#withdraw_dealpwd_input').removeClass('error');
		$('#withdraw_dealpwd_input').next().addClass('hide_op');

		//提现金额为空
		if(validationUtils.isNull(withdrawVal)){
			$('#withdraw_input').addClass('error');
			$('#withdraw_input').next().removeClass('hide_op').html("<em class='icon icon-er'></em>"+commonValidationEmu.errorMsg.withdraw_withdraw_no);

			$('#withdraw_sumit_btn').val('提现').removeClass('disabled');
			$('#withdraw_sumit_btn').attr('disabled',false);
			return;
		};
		//提现金额格式错误
		if(!reg.test(withdrawVal)){
			$('#withdraw_input').addClass('error');
			$('#withdraw_input').next().removeClass('hide_op').html("<em class='icon icon-er'></em>"+commonValidationEmu.errorMsg.withdraw_withdraw_format_wrong);

			$('#withdraw_sumit_btn').val('提现').removeClass('disabled');
			$('#withdraw_sumit_btn').attr('disabled',false);
			return;
		};
		//提现是否大于可用余额
		if(withdrawVal - userInfo.msg.data.balance > 0){
			$('#withdraw_input').addClass('error');
			$('#withdraw_input').next().removeClass('hide_op').html("<em class='icon icon-er'></em>"+commonValidationEmu.errorMsg.withdraw_withdraw_gt);

			$('#withdraw_sumit_btn').val('提现').removeClass('disabled');
			$('#withdraw_sumit_btn').attr('disabled',false);
			return;
		}
		//交易密码是否为空
		if(validationUtils.isNull(dealpwdVal)){
			$('#withdraw_dealpwd_input').addClass('error');
			$('#withdraw_dealpwd_input').next().removeClass('hide_op').html("<em class='icon icon-er'></em>"+commonValidationEmu.errorMsg.withdraw_deal_pwd_no);

			$('#withdraw_sumit_btn').val('提现').removeClass('disabled');
			$('#withdraw_sumit_btn').attr('disabled',false);
			return;
		};
		//提现
		submitWithdraw(bankCardInfo,userInfo);
	});
};
/*提现*/
function submitWithdraw(bankCardInfo,userInfo){
	var cardId = bankCardInfo.data[0].id;
	var dealpwdVal = $('#withdraw_dealpwd_input').val().replace(/\s+/g,"");
	var amount = $('#withdraw_input').val().replace(/\s+/g,"");

	$.lbdAjax({
		url:"/account/capital/withdraw",
		dataType:"JSON",
		type:"POST",
		data:{
			tradingPassword:Util.shaPassText(dealpwdVal).toUpperCase(),
			cardId:cardId,
			amount:amount,
			_csrf:$("#_csrf").val()
		},
		success:function(e){

			$('#withdraw_sumit_btn').val('提现').removeClass('disabled');
			$('#withdraw_sumit_btn').attr('disabled',false);

			//交易密码错误
			if(e.state == "FAIL" && e.code == "92014"){
				$('#withdraw_dealpwd_input').addClass('error');
				$('#withdraw_dealpwd_input').next().removeClass('hide_op').html("<em class='icon icon-er'></em>"+commonValidationEmu.errorMsg.withdraw_deal_pwd_wrong);
				return ;
			}
			//交易密码5次输入错误后，密码锁定，3小时后重新操作
			if(e.state == "FAIL" && e.code == "93001"){
				$('#withdraw_dealpwd_input').addClass('error');
				$('#withdraw_dealpwd_input').next().removeClass('hide_op').html("<em class='icon icon-er'></em>"+commonValidationEmu.errorMsg.withdraw_withdraw_gt5_wrong);
				return ;
			}
			//其他错误
			if(e.state == "FAIL"){
				layer.msg(e.message);
				return;
			}
			//提现成功
			if(e.state == 'SUCCESS'){
				//可用余额
				refreshAccountBanlance("topBar_balance");

				var Dialog = $.dialog({
					dialogDom:'<a class="dialog_close_btn icon-zh-close icon" id="recharge_dialog_close_icon_btn"></a><div class="icon icon-ok"></div><p class="orange" style="color:#ff7a33;">恭喜您，提现申请成功！</p><span class="gary">预计3个工作日之内到账</span><ul><li id="withdraw_go_accountCenter" class="btn">我的账户</li><li id="withdraw_go_tradeRecord" class="btn">查看交易记录</li></ul>',
					className:'msgSetting_dialog_wrapper dia_wrapper rzFail_dialog_wrapper withdrawOk_dialog_wrapper',
					isClose:false
				});
				$('#recharge_dialog_close_icon_btn').click(function(){
					Dialog.close();
					changeCurrentMenu('/account/chargeManagement/withdraw','withdraw_sub_m_btn');
				});
				$('#withdraw_go_accountCenter').click(function(){
					Dialog.close();
					changeCurrentMenu('/account/maintain/overview','overview_sub_m_btn');
				});
				$('#withdraw_go_tradeRecord').click(function(){
					Dialog.close();
					window.location.href = "/account/accountOverview?v=/account/chargeManagement/tradeRecord&m=tradeRecord_sub_m_btn&tradeRecordType=2";
				});
			}

		},
		error:function(e){
			$('#withdraw_sumit_btn').val('提现').removeClass('disabled');
			$('#withdraw_sumit_btn').attr('disabled',false);
			layer.msg(JSON.stringify(e));
		}
	});
};
/*初始化页面数据*/
function initWithDraw(){
	/*获取用户的绑卡信息*/
	$.lbdAjax({
		url:"/account/bindBankCard",
		dataType:"JSON",
		type:"POST",
		data:{_csrf:$("#_csrf").val()},
		success:function(e){
			if(e.state == "SUCCESS"){
				var imageUrl = $('#_imageUrl').val();
				var cardType = {
					DC:"储蓄卡",
					CC:"信用卡",
					SCC:"准贷记卡",
					PC:"预付费卡"
				};
				//可用余额
				$.lbdAjax({
					url	:'/user/banlance',
					type:'POST',
					dataType:'JSON',
					data:{_csrf:$("#_csrf").val()},
					success:function(msg){
						//提现按钮可点击
						$('#withdraw_sumit_btn').removeClass('disabled').attr('disabled',false);

						//初始化页面绑定的银行卡的信息
						$('#withdraw_bankcard_img_wrapper').html('<img id="withdraw_bankcard_img" src="'+imageUrl+e.data[0].bankCard.iconUrl+'">');

						//尾号
						$('#withdraw_bankcard_lastcode').html("尾号  "+e.data[0].bankNo);

						//可用余额
						$('#balance_val').html(msg.msg.data.balance).attr("data-balance",msg.msg.data.balance);

						//提现手续费
						if(e.data[0].bankCard.handingFee == 1){
							$('#handingfee').show();
						}else{
							$('#handingfee').hide();
							$('#withdraw_sxf').html(e.data[0].bankCard.fee);
						}
						_formatMoney();
						//提现金额验证
						volidataWithdrawInput(e,msg);
						//提现验证
						volidataWithdraw(e,msg);
					},
					error:function(msg){
						layer.msg(JSON.stringify(msg));
					}
				}); 
			}else{
				//layer.msg(JSON.stringify(e));
			}
		},
		error:function(e){
			layer.msg(JSON.stringify(e));
		}
	});
};

$(document).ready(function(){
	//文本输入框获取焦点和失去焦点的样式变化
	$('input[type=text]').focus(function(){
		$(this).addClass('onfocus');
	}).blur(function(){
		$(this).removeClass('onfocus');
	});
	//获取焦点的时候修改type类型
	$('#withdraw_dealpwd_input').focus(function() { 
		this.type='password';
	});

	// $('input[type=password]').focus(function(){
	// 	$(this).addClass('onfocus');
	// }).blur(function(){
	// 	$(this).removeClass('onfocus');
	// });
	/*获取用户认证信息*/
	validateUserValidAuthenticateType(function(e){
		if(e.status){
			var auth = e.msg.auth;
			//未实名
			if(auth.indexOf(2) == -1){
				
			}
			//未绑卡
			if(auth.indexOf(3) == -1){
				var Dialog = $.dialog({
						dialogDom:'<a class="dialog_close_btn icon-zh-close icon" id="dialog_close_btn"></a><h2 class="dia_title">开通存管账户</h2><p>为满足监管要求，需要为您开通****存管账户，以保障您的资金安全</p><a class="btn">立即开通</a>',
						className:'msgSetting_dialog_wrapper dia_wrapper',
						isClose:false
					});
			}
			//未开通存管账户
			/*if(auth.indexOf(4) == -1){
				var Dialog = $.dialog({
						dialogDom:'<a class="dialog_close_btn icon-zh-close icon" id="dialog_close_btn"></a><h2 class="dia_title">开通存管账户</h2><p>为满足监管要求，需要为您开通****存管账户，以保障您的资金安全</p><a class="btn">立即开通</a>',
						className:'msgSetting_dialog_wrapper dia_wrapper',
						isClose:false
					});
				return ;
			}*/
			//未设置交易密码
			if(auth.indexOf(5) == -1){
				var Dialog = $.dialog({
						dialogDom:'<a class="dialog_close_btn icon-zh-close icon" id="dialog_close_btn"></a><h2 class="dia_title">设置交易密码</h2><p>为保障您的提现安全，请先设置交易密码后再还款</p><a class="btn" id="go_setDealPwd_btn" >立即设置</a>',
						className:'msgSetting_dialog_wrapper dia_wrapper',
						isClose:false
					});
					$('#go_setDealPwd_btn').click(function(){
						Dialog.close();
						changeCurrentMenu('/account/securitySetting/setDealPwd','securitySetting_sub_m_btn');
					});
			}
			//初始化页面
			initWithDraw();
		}else{
			layer.msg(e.message);
		}
	},function(e){
		layer.msg(JSON.stringify(e));
	});
});