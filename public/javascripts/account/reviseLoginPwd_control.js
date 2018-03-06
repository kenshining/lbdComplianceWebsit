var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();
var dialogCount = 3,_timer = null,timer = null;
//检测原登录密码是否正确
function volidateOldPwd(pwd,callBack){
	//检测用户是否还在有效期范围内
	validateUserValid(
	function(successMsg){
		if(successMsg && successMsg.status === 'ok'){
			$.lbdAjax({
				url	:'/securitySetting/volidateOldPwd',
				type:'POST',
				dataType:'JSON',
				data:{pwd:Utils.shaPassText(pwd.replace(/\s+/g,"")).toUpperCase(),_csrf:$("#_csrf").val()},
				success:function(msg){
					callBack(msg);
				},
				error:function(msg){
					layer.stringify("链接超时！");
				}
			});
		}else{
			logout("/user/login");
		}
	},function(errorMsg){
		layer.msg(errorMsg);
	});
	
};

function volidateControl(newPwd,oldPwd,okPwd){
	//原登录密码是否正确
	volidateOldPwd(oldPwd,function(e){
		if(e.msg.state == "SUCCESS"){
			//验证成功
			//提交保存修改
			submitReviseLoginPwd();
		}
		if(e.count != null &&　e.count > 4){
			$.lbdAjax({
					url	:'/user/logout',
					type:'GET',
					dataType:'JSON',
					data:{},
					success:function(msg){
						var Dialog = $.dialog({
							dialogDom:'<div class="icon icon-fail"></div><p class="orange">为保障您的账户安全</br>请重新登录乐百贷账户</p><div class="href_login"><span id="dialog_count">3</span>s秒后跳转到<a href="/user/login?history=/account/accountOverview" target="_blank">登录</a></div>',
							className:'dia_wrapper rzFail_dialog_wrapper set_dailog_wrpper',
							isClose:false
						});
						_timer = setInterval(function(){
							dialogCount -- ;
							$('#dialog_count').text(dialogCount);
							if(dialogCount<=1){
								dialogCount = 1;
								window.location.href = '/user/login';
								clearInterval(_timer);
							}
						},1000);
					},
					error:function(msg){
						layer.stringify(msg);
					}
			});
		}
		if(e.msg.state == "FAIL" && e.msg.code == "92001"){
			//验证失败
			$('#old_pwd').parent().addClass('error');
			$('#old_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_old_wrong);
			$('#old_pwd').parents('section').find('.s_error_tip').show();

			$('#reviseLoginPwd_btn').attr('disabled',false);
			$('#reviseLoginPwd_btn').removeClass('disabled').html('确定');
		}
	});
};

//提交更改的登录密码
function submitReviseLoginPwd(){
	var pwd = $('#ok_pwd').val();
	$.lbdAjax({
			url	:'/securitySetting/reviseLoginPwd',
			type:'POST',
			dataType:'JSON',
			data:{password:Utils.shaPassText(pwd.replace(/\s+/g,"")).toUpperCase(),_csrf:$("#_csrf").val()},
			success:function(msg){
				if(msg.state == "SUCCESS"){
					var Dialog = $.dialog({
							dialogDom:'<div class="icon icon-ok"></div><p class="orange">恭喜您，登录密码修改成功！</p>',
							className:'dia_wrapper revise_mobile_wrapper',
							isClose:false
						});

					timer = setTimeout(function(){
						Dialog.close();
						changeCurrentMenu('/account/maintain/overview','overview_sub_m_btn','&p=5245');
					},2000);
				}
			},
			error:function(msg){
				layer.stringify(msg);
			}
	});
};
$(document).ready(function(){
	/*文本框获取焦点和失去焦点样式*/
	$('input[type=password]')
		.on('focus',function(){
			$(this).parent().addClass('onfocus');
			$(this).parents('section').find('.set_tip').show();
		})
		.on('blur',function(){
			$(this).parent().removeClass('onfocus');
			$(this).parents('section').find('.set_tip').hide();
		})
		.on('input',function(){
			$(this).parent().removeClass('error');
			$(this).parents('section').find('.s_error_tip').hide();
		});

	/*原登录密码*/
	$('#old_pwd').on('blur',function(){
		var oldPwd = $(this).val();

		if(ValidationUtils.isNull(oldPwd)){
			return ;
		}
		//原登录密码是否正确
		volidateOldPwd(oldPwd,function(e){
			if(e.count != null &&　e.count > 4){
				$.lbdAjax({
						url	:'/user/logout',
						type:'GET',
						dataType:'JSON',
						data:{},
						success:function(msg){
							var Dialog = $.dialog({
								dialogDom:'<div class="icon icon-fail"></div><p class="orange">为保障您的账户安全</br>请重新登录乐百贷账户</p><div class="href_login"><span id="dialog_count">3</span>s秒后跳转到<a href="/user/login?history=/account/accountOverview" target="_blank">登录</a></div>',
								className:'dia_wrapper rzFail_dialog_wrapper set_dailog_wrpper',
								isClose:false
							});
							_timer = setInterval(function(){
								dialogCount -- ;
								$('#dialog_count').text(dialogCount);
								if(dialogCount<=1){
									dialogCount = 1;
									window.location.href = '/user/login';
									clearInterval(_timer);
								}
							},1000);
						}
				});
			}
			if(e.msg.state == "FAIL" && e.msg.code == "92001"){
				//验证失败
				$('#old_pwd').parent().addClass('error');
				$('#old_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_old_wrong);
				$('#old_pwd').parents('section').find('.s_error_tip').show();
				return ;
			}
		});
	});

	/*新登录密码*/
	$('#new_pwd').on('blur',function(){

		var newPwd = $(this).val();

		if(ValidationUtils.isNull(newPwd)){
			return ;
		}
		//新登录密码格式是否正确
		if(!ValidationUtils.checkPwd(newPwd)){
			$('#new_pwd').parent().addClass('error');
			$('#new_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_new_wrong);
			$('#new_pwd').parents('section').find('.s_error_tip').show();
			return ;
		}
	});

	/*确认登录密码*/
	$('#ok_pwd').on('blur',function(){

		var newPwd = $('#new_pwd').val();
		var okPwd = $(this).val();

		if(ValidationUtils.isNull(okPwd)){
			return ;
		}
		//检测两次登录密码输入是否一致
		if(!ValidationUtils.isNull(newPwd) && newPwd != okPwd){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_ok_wrong);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();
			return ;
		}
	});

	/*确定*/
	$('#reviseLoginPwd_btn').on('click',function(){

		var oldPwd = $('#old_pwd').val(); 
		var newPwd = $('#new_pwd').val(); 
		var okPwd = $('#ok_pwd').val(); 

		$('input').parent().removeClass('error');
		$('input').parents('section').find('.s_error_tip').hide();

		$('#reviseLoginPwd_btn').attr('disabled',true);
		$('#reviseLoginPwd_btn').addClass('disabled').html('保存中...');

		//原登录密码是否为空
		if(ValidationUtils.isNull(oldPwd)){
			$('#old_pwd').parent().addClass('error');
			$('#old_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_old_no);
			$('#old_pwd').parents('section').find('.s_error_tip').show();

			$('#reviseLoginPwd_btn').attr('disabled',false);
			$('#reviseLoginPwd_btn').removeClass('disabled').html('确定');
			return ;
		};
		//新登录密码是否为空
		if(ValidationUtils.isNull(newPwd)){
			$('#new_pwd').parent().addClass('error');
			$('#new_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_new_no);
			$('#new_pwd').parents('section').find('.s_error_tip').show();

			$('#reviseLoginPwd_btn').attr('disabled',false);
			$('#reviseLoginPwd_btn').removeClass('disabled').html('确定');
			return ;
		};
		//新登录密码格式是否正确
		if(!ValidationUtils.checkPwd(newPwd)){
			$('#new_pwd').parent().addClass('error');
			$('#new_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_new_wrong);
			$('#new_pwd').parents('section').find('.s_error_tip').show();

			$('#reviseLoginPwd_btn').attr('disabled',false);
			$('#reviseLoginPwd_btn').removeClass('disabled').html('确定');
			return ;
		}
		//确认登录密码是否为空
		if(ValidationUtils.isNull(okPwd)){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_ok_no);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();

			$('#reviseLoginPwd_btn').attr('disabled',false);
			$('#reviseLoginPwd_btn').removeClass('disabled').html('确定');
			return ;
		}
		//检测两次登录密码输入是否一致
		if(newPwd != okPwd){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_ok_wrong);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();

			$('#reviseLoginPwd_btn').attr('disabled',false);
			$('#reviseLoginPwd_btn').removeClass('disabled').html('确定');
			return ;
		}

		/*执行后端序列验证*/
		volidateControl(newPwd,oldPwd,okPwd);
	});

});