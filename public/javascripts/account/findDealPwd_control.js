var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();
var isGetMsgCode = false, timer = null;

//获取图片验证码
function getImgCode(){
	$.lbdAjax({
		url	:'/user/validateImgCode',
		type:'GET',
		dataType:'JSON',
		data:{_csrf:$("#_csrf").val()},
		success:function(msg){
			//显示验证码
			if(msg.status){
				$("#imgCode").attr("src","data:image/png;base64,"+msg.validateCodeImg);
			}else{
				//获取验证码失败
				layer.msg("获取验证码失败！");
			};
		},
		error:function(e){
			layer.msg("链接超时！");
		}
	});
};
//获取短信验证码
function getMsgCode(successCallBack){
	var tel = $('#findDealPwd_telephone').html();
	var imgCode = $('#imgCode_val').val().replace(/\s+/g,"")
	$.lbdAjax({
		url	:'/user/validateMsgCode',
		type:'POST',
		dataType:'JSON',
		data:{telephone:tel,imgValCode:imgCode,_csrf:$("#_csrf").val()},
		success:function(msg){
			//图形验证码错误
			if(msg.status == false && msg.errorFeild == 'imgCode'){
				$('#imgCode_val').parent().addClass('error');
				$('#imgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_worng);
				$('#imgCode_val').parents('section').find('.error_tip').show();
				getImgCode();
				return ;

			//验证短信验证码频繁，发送失败
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91001"){
				$('#msgCode_val').parent().addClass('error');
				$('#msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_not_send_error);
				$('#msgCode_val').parents('section').find('.error_tip').show();

			//是否用户超过上限
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91002"){
				$('#msgCode_val').parent().addClass('error');
				$('#msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.smg_code_user_limit);
				$('#msgCode_val').parents('section').find('.error_tip').show();

			//是否IP超过上限
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91003"){
				$('#msgCode_val').parent().addClass('error');
				$('#msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.smg_code_ip_limit);
				$('#msgCode_val').parents('section').find('.error_tip').show();

			//短信发送平台错误
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91004"){
				$('#msgCode_val').parent().addClass('error');
				$('#msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_locked);
				$('#msgCode_val').parents('section').find('.error_tip').show();

			//发送成功	
			}else if(msg.status && msg.errorMsg === "发送成功"){
				successCallBack();
			}
		},
		error:function(msg){
			layer.msg("链接超时！");
		}
	});
};

//验证短信验证码和图形验证码
function volidateImgAndMsgCode(){

	var imgCode = $('#imgCode_val').val();
	var msgCode = $('#msgCode_val').val();
	var tel = $('#findDealPwd_telephone').html();

	$.lbdAjax({
		url	:'/securitySetting/validateMsgCode',
		type:'POST',
		dataType:'json',
		data:{telephone:tel,imgCode:imgCode.replace(/\s+/g,""),msgCode:msgCode.replace(/\s+/g,""),_csrf:$("#_csrf").val()},
		success:function(msg){
			
			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').removeClass('disabled');

			//图形验证码是否正确
			if(msg.status == false && msg.errorFeild == "imgCode"){
				$('#imgCode_val').parent().addClass('error');
				$('#imgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_worng);
				$('#imgCode_val').parents('section').find('.error_tip').show();
				getImgCode();
				return ;
			};

			//短信验证码是否正确
			if(msg.status == false && msg.errorFeild == "smsCode"){
				$('#msgCode_val').parent().addClass('error');
				$('#msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_worng_format);
				$('#msgCode_val').parents('section').find('.error_tip').show();
				return ;
			};

			//验证通过，解绑成功，进行修改
			if(msg.status == true){
				$('.setDealPwd_wrapper').remove();
				$('.setDealPwd_next_wrapper').show();
				getImgCode();
			};
			
		},
		error:function(msg){
			layer.msg('链接超时！');
			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').removeClass('disabled');
		}
	});

};

//提交设置
function  submitSetDealPwd(pwd){
	$.lbdAjax({
		url	:'/securitySetting/setDealPwd',
		type:'POST',
		dataType:'JSON',
		data:{password:Utils.shaPassText(pwd.replace(/\s+/g,"")).toUpperCase(),_csrf:$("#_csrf").val()},
		success:function(msg){
			$('#ok_pwd_btn').attr('disabled',false);
			$('#ok_pwd_btn').removeClass("disabled").val('确定');

			if(msg.state == "SUCCESS"){
				/*交易密码设置成功*/
				var Dialog = $.dialog({
					dialogDom:'<div class="icon icon-ok"></div><p class="orange">恭喜您，交易密码设置成功！</p>',
					className:'dia_wrapper revise_mobile_wrapper',
					isClose:false
				});
				timer = setTimeout(function(){
					Dialog.close();
					changeCurrentMenu('/account/securitySetting/securitySetting','securitySetting_sub_m_btn');
					clearInterval(timer);
				},2000);
			}else{
				layer.msg(msg.message);
			}
		},
		error:function(msg){
			layer.msg(JSON.stringify(msg));
			$('#ok_pwd_btn').attr('disabled',false);
			$('#ok_pwd_btn').removeClass("disabled").val('确定');
		}
	});
}





$(document).ready(function(){
	/*清除定时器动作*/
	if(REVERS_ECOUNT_TIMER_HANDLER){
		clearInterval(REVERS_ECOUNT_TIMER_HANDLER);
	};

	var regDealPwd = /^\d{6}$/;

	/*文本框获取焦点和失去焦点样式*/
	$('input').not('input[type=button]')
	.on('focus',function(){
		$(this).parent().addClass('onfocus');
		$(this).parents('section').find('.set_tip').show();
	})
	.on('blur',function(){
		$(this).parent().removeClass('onfocus');
		$(this).parents('section').find('.set_tip').hide();
	});
	/*隐藏错误提示*/
	$('input[type=password]')
	.on('input',function(){
		$(this).parent().removeClass('error');
		$(this).parents('section').find('.s_error_tip').hide();
	});

	//初始化图形验证码
	getImgCode();

	//点击图形验证码重新获取
	$("#imgCode").click(function(){
		getImgCode();
	});

	//点击获取短信验证码
	$("#msgCode_btn").click(function(){

		var imgCodeVal = $('#imgCode_val').val(); 
		var time = 120;

		$('#imgCode_val').parent().removeClass('error');
		$('#imgCode_val').parents('section').find('.error_tip').hide();

		$('#msgCode_val').parent().removeClass('error');
		$('#msgCode_val').parents('section').find('.error_tip').hide();

		//是否为可点击状态
		if($(this).hasClass('disabled')){
			return;
		}

		//图形验证码是否为空
		if(ValidationUtils.isNull(imgCodeVal)){
			$('#imgCode_val').parent().addClass('error');
			$('#imgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_not_null);
			$('#imgCode_val').parents('section').find('.error_tip').show();
			return ;
		};

		/*后端验证图形验证码和获取短信验证码*/
		getMsgCode(function(){
				//按钮不可点击，开启120s倒计时
				isGetMsgCode = true;
				REVERS_ECOUNT_TIMER_HANDLER = setInterval(function(){
					time --;
					//倒计时结束后，恢复按钮为可点击状态，并清除定时器
					if(time <= 0){
						$('#msgCode_btn').removeClass('disabled').text('获取短信验证码');
						clearInterval(REVERS_ECOUNT_TIMER_HANDLER);
						//若有效期范围内没有输入完成则重新获取图形验证码
						getImgCode();
					}else{
						$('#msgCode_btn').addClass('disabled').text(time+'s');
					}
				},1000);
		});
	});

	//点击下一步
	$('#findDealPwd_next_btn').click(function(){

		var imgCode = $('#imgCode_val').val();
		var msgCode = $('#msgCode_val').val();

		$('#remove_tel_btn').attr('disabled',true);
		$('#remove_tel_btn').addClass('disabled');

		$('#imgCode_val').parent().removeClass('error');
		$('#imgCode_val').parents('section').find('.error_tip').hide();

		$('#msgCode_val').parent().removeClass('error');
		$('#msgCode_val').parents('section').find('.error_tip').hide();

		//图形验证码是否为空
		if(ValidationUtils.isNull(imgCode)){
			$('#imgCode_val').parent().addClass('error');
			$('#imgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_not_null);
			$('#imgCode_val').parents('section').find('.error_tip').show();

			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').removeClass('disabled');
			return ;
		};

		//是否已经点击了获取验证码
		if(!isGetMsgCode){
			$('#msgCode_val').parent().addClass('error');
			$('#msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_not_send);
			$('#msgCode_val').parents('section').find('.error_tip').show();

			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').removeClass('disabled');
			return ;
		};

		//短信验证码是否为空
		if(ValidationUtils.isNull(msgCode)){
			$('#msgCode_val').parent().addClass('error');
			$('#msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_not_null);
			$('#msgCode_val').parents('section').find('.error_tip').show();

			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').removeClass('disabled');
			return ;
		};

		//后端短信验证码 和 图形验证码
		volidateImgAndMsgCode();
	});


	/*设置交易密码*/
	$('#set_pwd').on("blur",function(){
		var pwd = $('#set_pwd').val();

		$('#set_pwd').parent().removeClass('error');
		$('#set_pwd').parents('section').find('.s_error_tip').hide();

		if(ValidationUtils.isNull(pwd)){
			return ;
		}

		//交易密码格式是否正确
		if(!regDealPwd.test(pwd)){
			$('#set_pwd').parent().addClass('error');
			$('#set_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_format_wrong);
			$('#set_pwd').parents('section').find('.s_error_tip').show();
			return ;
		}
	});

	/*确认交易密码*/
	$('#ok_pwd').on("blur",function(){

		var pwd = $('#ok_pwd').val();
		var _pwd = $('#set_pwd').val();

		$('#ok_pwd').parent().removeClass('error');
		$('#ok_pwd').parents('section').find('.s_error_tip').hide();

		if(ValidationUtils.isNull(pwd)){
			return ;
		}

		//交易密码格式是否正确
		if(!regDealPwd.test(pwd)){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_format_wrong);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();
			return ;
		}

		//两次输入是否一致
		if(!ValidationUtils.isNull(_pwd) && pwd!=_pwd){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_ok_wrong);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();
			return ;
		}
	});


	/*点击确定交易密码*/
	$('#ok_pwd_btn').click(function(){

		var setpwd = $('#set_pwd').val();
		var okpwd = $('#ok_pwd').val(); 

		$('#set_pwd').parent().removeClass('error');
		$('#set_pwd').parents('section').find('.s_error_tip').hide();

		$('#ok_pwd').parent().removeClass('error');
		$('#ok_pwd').parents('section').find('.s_error_tip').hide();

		$('#ok_pwd_btn').attr('disabled',true);
		$('#ok_pwd_btn').addClass("disabled").val('保存中...');

		//设置交易密码是否为空
		if(ValidationUtils.isNull(setpwd)){
			$('#set_pwd').parent().addClass('error');
			$('#set_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_no);
			$('#set_pwd').parents('section').find('.s_error_tip').show();

			$('#ok_pwd_btn').attr('disabled',false);
			$('#ok_pwd_btn').removeClass("disabled").val('确定');
			return ;
		}
		//设置交易密码格式是否正确
		if(!regDealPwd.test(setpwd)){
			$('#set_pwd').parent().addClass('error');
			$('#set_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_format_wrong);
			$('#set_pwd').parents('section').find('.s_error_tip').show();

			$('#ok_pwd_btn').attr('disabled',false);
			$('#ok_pwd_btn').removeClass("disabled").val('确定');
			return ;
		}
		//确认交易密码是否为空
		if(ValidationUtils.isNull(okpwd)){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_no);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();

			$('#ok_pwd_btn').attr('disabled',false);
			$('#ok_pwd_btn').removeClass("disabled").val('确定');
			return ;
		}
		//确认交易密码格式是否正确
		if(!regDealPwd.test(okpwd)){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_format_wrong);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();

			$('#ok_pwd_btn').attr('disabled',false);
			$('#ok_pwd_btn').removeClass("disabled").val('确定');
			return ;
		}
		//两次输入是否一致
		if(setpwd != okpwd){
			$('#ok_pwd').parent().addClass('error');
			$('#ok_pwd').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_ok_wrong);
			$('#ok_pwd').parents('section').find('.s_error_tip').show();

			$('#ok_pwd_btn').attr('disabled',false);
			$('#ok_pwd_btn').removeClass("disabled").val('确定');
			return ;
		}
		submitSetDealPwd(okpwd);
	});

});