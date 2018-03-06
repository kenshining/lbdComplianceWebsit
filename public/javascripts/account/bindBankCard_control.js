var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();
var timer = null;
//获取银行卡类型
function getBankCardInfo(successFn){
	var cardNo = $('#bankCard_input').val().replace(/\s+/g,"");
	$.lbdAjax({
		url:"/securitySetting/bindBankCardType",
		dataType:"JSON",
		type:"POST",
		data:{cardNo:cardNo,_csrf:$("#_csrf").val()},
		success:function(e){
			if(e.state == "SUCCESS"){
				successFn(e);
			}else{
				layer.msg(JSON.stringify(e));

				$('#bindBankCard_btn').attr('disabled',false);
				$('#bindBankCard_btn').removeClass('disabled').val('确定');
			}
		},
		error:function(e){
			layer.msg(e.msg);

			$('#bindBankCard_btn').attr('disabled',false);
			$('#bindBankCard_btn').removeClass('disabled').val('确定');
		}
	});
};

$(document).ready(function(){

	/*文本框获取焦点和失去焦点样式*/
	$('input').not('input[type=button]')
	.on('focus',function(){
		$(this).parent().addClass('onfocus');
	})
	.on('blur',function(){
		$(this).parent().removeClass('onfocus');
	});

	/*文本框值改变的时候，错误提示框隐藏*/
	$('input[type=text]').on('input',function(){
		$(this).parent().removeClass('error');
		$(this).parents('section').find('.s_error_tip').hide();
	});
	/*银行介绍*/
	$('#bank_introduction').click(function(){
		var Dialog = $.dialog({
			dialogDom:'<div class="dia_title">重要提示</div>'+
						'<section>'+
							'<h3>乐百贷平台支持13家快捷银行<span>（推荐绑定快捷银行卡）：</span></h3>'+
							'<div class="recharge_bankcard_wrapper clearfix">'+
								'<section class="recharge_bankcard"><em class="icon icon-zgyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-nyyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-gsyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-jsyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-jtyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-payh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-msyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-zxyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-gdyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-zsyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-gfyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-xyyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-pdyh"></em></section>'+
							'</div>'+
						'</section>'+
						'<section>'+
							'<h3>乐百贷平台支持15家网银银行<span>（非快捷银行在移动端无法充值、提现）：</span></h3>'+
							'<div class="recharge_bankcard_wrapper clearfix">'+
								'<section class="recharge_bankcard"><em class="icon icon-zgyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-nyyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-gsyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-jsyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-jtyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-yzcx"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-msyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-zxyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-gdyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-zsyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-gfyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-bjyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-pdyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-dyyh"></em></section>'+
								'<section class="recharge_bankcard"><em class="icon icon-hxyh"></em></section>'+
							'</div>'+
						'</section><a class="btn bindBanks_btn" id="dialog_close_btn">知道了</a></div>',
			className:'dia_wrapper bindBanks_dialog_wrapper',
			isClose:true
		});
	});	
	/*银行卡号码*/
	$('#bankCard_input').on('blur',function(){

		var val = $('#bankCard_input').val().replace(/\s+/g,"");
		var reg = /^\d+$/;

		//转化银行卡号码格式
		$(this).val(Utils.formatBankCard(val));

		if(ValidationUtils.isNull(val)){
			return ;
		}
		//银行卡号码格式是否正确
		if(!reg.test(val)){
			$('#bankCard_input').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.bind_bank_card_format_wrong);
			$('#bankCard_input').parents('section').find('.s_error_tip').show();
			$('#bankCard_input').parent().addClass('error');
			return ;
		}
		//银行卡位数16-20
		if(val.length < 16 || val.length > 20){
			$('#bankCard_input').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.bind_bank_card_format_wrong);
			$('#bankCard_input').parents('section').find('.s_error_tip').show();
			$('#bankCard_input').parent().addClass('error');
			return ;
		}
		//获取银行卡类型信息
		getBankCardInfo(function(e){
			//成功回调
			$('#bindBankCard_location').html(e.data.bankName);
		});
	});
	/*输入银行卡号*/
	$('#bankCard_input').on('focus',function(){
		var val = $('#bankCard_input').val().replace(/\s+/g,"");
		$('#bankCard_input').val(val);
	});

	/*开户行名称，输入框格式是否正确*/
	$('#bindBankCard_location_input').on('blur',function(){

		var val = $('#bindBankCard_location_input').val().replace(/\s+/g,"");
		var reg = /^[\da-zA-Z]+$/;

		//转化银行卡号码格式
		$(this).val(Utils.formatBankCard(val));

		if(ValidationUtils.isNull(val)){
			return ;
		}
		//开户行名称格式是否正确
		if(reg.test(val)){
			$('#bindBankCard_location_input').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.bind_bank_card_location_format_wrong);
			$('#bindBankCard_location_input').parents('section').find('.s_error_tip').show();
			$('#bindBankCard_location_input').parent().addClass('error');
			return ;
		}
	});
	/*绑定银行卡*/
	$('#bindBankCard_btn').click(function(){
		var val = $('#bankCard_input').val().replace(/\s+/g,"");
		var location = $('#bindBankCard_location_input').val().replace(/\s+/g,"");
		var reg = /^\d+$/;
		var regL = /^[\da-zA-Z]+$/;

		$('#bindBankCard_btn').attr('disabled',true);
		$('#bindBankCard_btn').addClass('disabled').val('保存中...');



		$('#bankCard_input').parent().removeClass('error');
		$('#bankCard_input').parents('section').find('.s_error_tip').hide();

		$('#bindBankCard_location_input').parent().removeClass('error');
		$('#bindBankCard_location_input').parents('section').find('.s_error_tip').hide();

		//银行卡号码是否为空
		if(ValidationUtils.isNull(val)){
			$('#bankCard_input').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.bind_bank_card_no);
			$('#bankCard_input').parents('section').find('.s_error_tip').show();
			$('#bankCard_input').parent().addClass('error');

			$('#bindBankCard_btn').attr('disabled',false);
			$('#bindBankCard_btn').removeClass('disabled').val('确定');
			return ;
		}

		//银行卡号码格式是否正确
		if(!reg.test(val)){
			$('#bankCard_input').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.bind_bank_card_format_wrong);
			$('#bankCard_input').parents('section').find('.s_error_tip').show();
			$('#bankCard_input').parent().addClass('error');

			$('#bindBankCard_btn').attr('disabled',false);
			$('#bindBankCard_btn').removeClass('disabled').val('确定');
			return ;
		}
		//银行卡位数16-20
		if(val.length < 16 || val.length > 20){
			$('#bankCard_input').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.bind_bank_card_format_wrong);
			$('#bankCard_input').parents('section').find('.s_error_tip').show();
			$('#bankCard_input').parent().addClass('error');

			$('#bindBankCard_btn').attr('disabled',false);
			$('#bindBankCard_btn').removeClass('disabled').val('确定');
			return ;
		}
		//开户行是否为空
		if(ValidationUtils.isNull(location)){
			$('#bindBankCard_location_input').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.bind_bank_card_location_no);
			$('#bindBankCard_location_input').parents('section').find('.s_error_tip').show();
			$('#bindBankCard_location_input').parent().addClass('error');

			$('#bindBankCard_btn').attr('disabled',false);
			$('#bindBankCard_btn').removeClass('disabled').val('确定');
			return ;
		}
		//开户行名称格式是否正确
		if(regL.test(location)){
			$('#bindBankCard_location_input').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.bind_bank_card_location_format_wrong);
			$('#bindBankCard_location_input').parents('section').find('.s_error_tip').show();
			$('#bindBankCard_location_input').parent().addClass('error');

			$('#bindBankCard_btn').attr('disabled',false);
			$('#bindBankCard_btn').removeClass('disabled').val('确定');
			return ;
		}
		//获取银行卡类型
		getBankCardInfo(function(e){
			$('#bindBankCard_location').html(e.data.bankName);

			//根据银行卡类型获取银行卡的相关信息
			var shortName = e.data.bank;
			var cardType = e.data.cardType;

			$.lbdAjax({
				url:"/securitySetting/bindBankCardInfoByType",
				dataType:"JSON",
				type:"POST",
				data:{shortName:shortName,cardType:cardType,rechargeType:2,_csrf:$("#_csrf").val()},
				success:function(er){
					//绑定银行卡
					var bankNo = $('#bankCard_input').val().replace(/\s+/g,"");
					var bankBranch = $('#bindBankCard_location_input').val();
					$.lbdAjax({
						url:"/securitySetting/bindcard",
						dataType:"JSON",
						type:"POST",
						data:{
							bankNo:bankNo,
							bankBranch:bankBranch,
							bankCardId:er.data.id,
							_csrf:$("#_csrf").val()
						},
						success:function(e){

							$('#bindBankCard_btn').attr('disabled',false);
							$('#bindBankCard_btn').removeClass('disabled').val('确定');

							if(e.state == "SUCCESS"){
								var Dialog = $.dialog({
									dialogDom:'<div class="icon icon-ok"></div><p class="orange">恭喜您，银行卡认证成功！</p>',
									className:'dia_wrapper revise_mobile_wrapper',
									isClose:false
								});
								timer = setTimeout(function(){
									Dialog.close();
									//用户认证
									topBarAuthenticate();
									changeCurrentMenu('/account/securitySetting/securitySetting','securitySetting_sub_m_btn');
									clearInterval(timer);
								},2000);
							//错误信息
							}else{
								//卡号错误
								//开户行错误

								//该卡已绑定
								if(e.code == "92011"){
									$('#bankCard_input').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.bind_bank_card_is_used);
									$('#bankCard_input').parents('section').find('.s_error_tip').show();
									$('#bankCard_input').parent().addClass('error');
									return ;
								//其他错误
								}else{
									var Dialog = $.dialog({
										dialogDom:'<div class="icon icon-fail"></div><p class="orange">很遗憾，银行卡认证失败！</p><section><h3>可能由于以下原因：</h3><p><strong>·</strong>开户人不是本人</p><p><strong>·</strong>银行卡异常</p></section><ul><li class="btn" id="go_bank_accountCenter" >返回账户</li><li id="dialog_close_btn" onclick="changeCurrentMenu(\'/account/securitySetting/bindBankCard\',\'securitySetting_sub_m_btn\');" class="btn" );">重新认证</li></ul>',
										className:'dia_wrapper rzFail_dialog_wrapper bindBankCard_fail_dia_wrapper',
										isClose:false
									});
									//返回账户
									$('#go_bank_accountCenter').click(function(){
										Dialog.close();
										changeCurrentMenu('/account/maintain/overview','overview_sub_m_btn');
									});
								}	
							}	
						},
						error:function(e){
							layer.msg(e.msg);

							$('#bindBankCard_btn').attr('disabled',false);
							$('#bindBankCard_btn').removeClass('disabled').val('确定');
						}
					});
				},
				error:function(er){
					layer.msg(er.msg);

					$('#bindBankCard_btn').attr('disabled',false);
					$('#bindBankCard_btn').removeClass('disabled').val('确定');
				}
			});		
		});
	});
});