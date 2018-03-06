var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();
var dialogCount = 3,_timer = null,timer = null;

//原交易密码是否正确
function volidateOldPwd(oldPwd,successFn,errorFn){
	$.lbdAjax({
		url	:'/securitySetting/volidateOldDealPwd',
		type:'POST',
		dataType:'json',
		data:{pwd:Utils.shaPassText(oldPwd.replace(/\s+/g,"")).toUpperCase(),_csrf:$("#_csrf").val()},
		success:function(e){
			successFn(e);
		},
		error:function(e){
			layer.msg(JSON.stringify(e));
			if(errorFn){
				errorFn();
			};
		}
	});
};
//提交修改
function submitReviseDealPwd(newPwd){
	$.lbdAjax({
		url	:'/securitySetting/reviseDealPwd',
		type:'POST',
		dataType:'json',
		data:{pwd:Utils.shaPassText(newPwd.replace(/\s+/g,"")).toUpperCase(),_csrf:$("#_csrf").val()},
		success:function(e){
			if(e.state == "SUCCESS"){
				var Dialog = $.dialog({
					dialogDom:'<div class="icon icon-ok"></div><p class="orange">恭喜您，交易密码修改成功！</p>',
					className:'dia_wrapper revise_mobile_wrapper',
					isClose:false
				});
				timer = setTimeout(function(){
					Dialog.close();
					changeCurrentMenu('/account/securitySetting/securitySetting','securitySetting_sub_m_btn');
					clearInterval(timer);
				},2000);
			}else{
				layer.msg(e.message);
			}
		},
		error:function(e){
			layer.msg(JSON.stringify(e));
		}
	});
};
$(document).ready(function(){

	var regDealPwd = /^\d{6}$/;

	/*原交易密码*/
	$('#old_pwd').on('blur',function(){
		var oldPwd = $(this).val();

		if(ValidationUtils.isNull(oldPwd)){
			return ;
		}
		//原交易密码是否正确
		volidateOldPwd(oldPwd,function(e){
			//原交易密码验证错误次数超过5次，跳转设置交易密码页
			if(e.state == "FAIL" && e.count != null &&　e.count > 4){
				var Dialog = $.dialog({
					dialogDom:'<div class="icon icon-fail"></div><p class="orange">为保障您的资金安全</br>请重新设置乐百贷交易密码</p><div class="href_login"><span id="dialog_count">3</span>s秒后跳转到<a onclick="changeCurrentMenu(\'/account/securitySetting/setDealPwd\',\'securitySetting_sub_m_btn\');" id="dialog_close_btn">设置交易密码</a></div>',
					className:'dia_wrapper rzFail_dialog_wrapper set_dailog_wrpper',
					isClose:false
				});
				_timer = setInterval(function(){
					dialogCount -- ;
					$('#dialog_count').text(dialogCount);
					if(dialogCount<=1){
						dialogCount = 1;
						window.location.href = '/account/accountOverview?v=/account/securitySetting/setDealPwd&m=securitySetting_sub_m_btn';
						clearInterval(_timer);
					}
				},1000);
			}
			//原交易密码验证失败
			if(e.state == "FAIL" && e.code == "92014"){
				$('#old_pwd').parent().addClass('error');
				$('#old_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_old_wrong);
				$('#old_pwd').parents('section').find('.s_error_tip').show();
			}
			//未设置交易密码
			if(e.state == "FAIL" && e.code == "92013"){
				$('#old_pwd').parent().addClass('error');
				$('#old_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_old_no_set);
				$('#old_pwd').parents('section').find('.s_error_tip').show();
			}
			
		});
	});

	/*新交易密码*/
	$('#new_pwd').on('blur',function(){

		var newPwd = $(this).val();

		if(ValidationUtils.isNull(newPwd)){
			return ;
		}
		//新交易密码格式是否正确
		if(!regDealPwd.test(newPwd)){
			$('#new_pwd').parent().addClass('error');
			$('#new_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_new_wrong);
			$('#new_pwd').parents('section').find('.s_error_tip').show();
			return ;
		}
	});

	/*确认交易密码*/
	$('#ok_pwd').on('blur',function(){

		var newPwd = $('#new_pwd').val();
		var okPwd = $(this).val();

		if(ValidationUtils.isNull(okPwd)){
			return ;
		}
		//确认交易密码格式是否正确
		if(!regDealPwd.test(okPwd)){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_new_wrong);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();
			return ;
		}
		//检测两次交易密码输入是否一致
		if(!ValidationUtils.isNull(newPwd) && newPwd != okPwd){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_ok_wrong);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();
			return ;
		}
	});

	/*确定*/
	$('#reviseDealPwd_btn').on('click',function(){

		var oldPwd = $('#old_pwd').val(); 
		var newPwd = $('#new_pwd').val(); 
		var okPwd = $('#ok_pwd').val(); 

		$('input').parent().removeClass('error');
		$('input').parents('section').find('.s_error_tip').hide();

		$('#revisedealPwd_btn').attr('disabled',true);
		$('#revisedealPwd_btn').addClass('disabled').html('保存中...');

		//原交易密码是否为空
		if(ValidationUtils.isNull(oldPwd)){
			$('#old_pwd').parent().addClass('error');
			$('#old_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_old_no);
			$('#old_pwd').parents('section').find('.s_error_tip').show();

			$('#revisedealPwd_btn').attr('disabled',false);
			$('#revisedealPwd_btn').removeClass('disabled').html('确定');
			return ;
		};
		//新交易密码是否为空
		if(ValidationUtils.isNull(newPwd)){
			$('#new_pwd').parent().addClass('error');
			$('#new_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_new_no);
			$('#new_pwd').parents('section').find('.s_error_tip').show();

			$('#revisedealPwd_btn').attr('disabled',false);
			$('#revisedealPwd_btn').removeClass('disabled').html('确定');
			return ;
		};
		//新交易密码格式是否正确
		if(!regDealPwd.test(newPwd)){
			$('#new_pwd').parent().addClass('error');
			$('#new_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_new_wrong);
			$('#new_pwd').parents('section').find('.s_error_tip').show();

			$('#revisedealPwd_btn').attr('disabled',false);
			$('#revisedealPwd_btn').removeClass('disabled').html('确定');
			return ;
		}
		//确认交易密码是否为空
		if(ValidationUtils.isNull(okPwd)){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_ok_no);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();

			$('#revisedealPwd_btn').attr('disabled',false);
			$('#revisedealPwd_btn').removeClass('disabled').html('确定');
			return ;
		}
		//确认交易密码格式是否正确
		if(!regDealPwd.test(okPwd)){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_new_wrong);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();

			$('#revisedealPwd_btn').attr('disabled',false);
			$('#revisedealPwd_btn').removeClass('disabled').html('确定');
			return ;
		}
		//检测两次交易密码输入是否一致
		if(newPwd != okPwd){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_ok_wrong);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();

			$('#revisedealPwd_btn').attr('disabled',false);
			$('#revisedealPwd_btn').removeClass('disabled').html('确定');
			return ;
		}

		//原交易密码是否正确
		volidateOldPwd(oldPwd,function(e){

			$('#revisedealPwd_btn').attr('disabled',false);
			$('#revisedealPwd_btn').removeClass('disabled').html('确定');

			//原交易密码验证错误次数超过5次，跳转设置交易密码页
			if(e.state == "FAIL" && e.count != null &&　e.count > 4){
				var Dialog = $.dialog({
					dialogDom:'<div class="icon icon-fail"></div><p class="orange">为保障您的资金安全</br>请重新设置乐百贷交易密码</p><div class="href_login"><span id="dialog_count">3</span>s秒后跳转到<a onclick="changeCurrentMenu(\'/account/securitySetting/setDealPwd\',\'securitySetting_sub_m_btn\');" id="dialog_close_btn">设置交易密码</a></div>',
					className:'dia_wrapper rzFail_dialog_wrapper set_dailog_wrpper',
					isClose:false
				});
				_timer = setInterval(function(){
					dialogCount -- ;
					$('#dialog_count').text(dialogCount);
					if(dialogCount<=1){
						dialogCount = 1;
						window.location.href = '/account/accountOverview?v=/account/securitySetting/setDealPwd&m=securitySetting_sub_m_btn';
						clearInterval(_timer);
					}
				},1000);
			}
			//原交易密码验证失败
			if(e.state == "FAIL" && e.code == "92014"){
				$('#old_pwd').parent().addClass('error');
				$('#old_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_old_wrong);
				$('#old_pwd').parents('section').find('.s_error_tip').show();
			}
			//未设置交易密码
			if(e.state == "FAIL" && e.code == "92013"){
				$('#old_pwd').parent().addClass('error');
				$('#old_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_deal_pwd_old_no_set);
				$('#old_pwd').parents('section').find('.s_error_tip').show();
			}
			if(e.state == "SUCCESS"){
				//提交修改
				submitReviseDealPwd(newPwd);
			}
		},function(){
			$('#revisedealPwd_btn').attr('disabled',false);
			$('#revisedealPwd_btn').removeClass('disabled').html('确定');
		});
	});

	/*文本框获取焦点和失去焦点样式*/
	$('input[type=password]')
		.on('focus',function(){
			$(this).parents('section').find('.set_tip').show();
			$(this).parent().addClass('onfocus');
		})
		.on('blur',function(){
			$(this).parents('section').find('.set_tip').hide();
			$(this).parent().removeClass('onfocus');
		})
		.on('input',function(){
			$(this).parent().removeClass('error');
			$(this).parents('section').find('.s_error_tip').hide();
		});

});