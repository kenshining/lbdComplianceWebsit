var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();
var isUserAgreement = true , isMsgCodeBtn = false;
//错误提示文字显示，tip参数为提示的文字
var errorTipShow = function(tip,that){
	$('#regist_error_tip').text(tip).removeClass("hide_op");
	$('.input_wrapper').removeClass('error');
	that.parent('.input_wrapper').addClass('error');
};
//错误提示文字消失
var errorTipHide = function(that){
	$('#regist_error_tip').addClass("hide_op");
	that.parent('.input_wrapper').removeClass('error');
};

//获取图片验证码
var getRegistImgCode = function(){

	$.lbdAjax({
		url	:'/user/validateImgCode',
		type:'GET',
		dataType:'json',
		data:{_csrf:$("#_csrf").val()},
		success:function(msg){
			//显示验证码
			if(msg.status){
				$("#regist_validate_imgCode").attr("src","data:image/png;base64,"+msg.validateCodeImg);
			}else{
				//获取验证码失败
			};
		}
	});	
};
//获取短信验证码
var getRegistMsgCode = function(tel,successCallBack,errorCallBack){
	$.lbdAjax({
		url	:'/user/validateMsgCode',
		type:'POST',
		dataType:'json',
		data:{telephone:tel,imgValCode:$('#regist_img_code').val().replace(/\s+/g,""),_csrf:$("#_csrf").val()},
		success:function(msg){
			//图形验证码错误
			if(msg.status == false && msg.errorFeild == 'imgCode'){
				errorTipShow(ValidationEmu.errorMsg.picture_validate_worng,$('#regist_img_code'));
				getRegistImgCode();

			//验证短信验证码频繁，发送失败
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91001"){
				errorTipShow(ValidationEmu.errorMsg.sms_code_not_send_error,$('#regist_img_code'));

			//当前用户超过上限
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91002"){
				$('#regist_error_tip').text(ValidationEmu.errorMsg.smg_code_user_limit).removeClass("hide_op");
			//当前IP超过上限
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91003"){
				$('#regist_error_tip').text(ValidationEmu.errorMsg.smg_code_ip_limit).removeClass("hide_op");
			//短信发送平台错误	
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91004"){
				$('#regist_error_tip').text(ValidationEmu.errorMsg.sms_code_locked).removeClass("hide_op");
			//发送成功	
			}else if(msg.errorMsg === "发送成功"){
				successCallBack();
			}
		}
	});
};

// 验证用户手机号是否已注册
var validateUserTeleInUse = function(tel,callBack){
	$.lbdAjax({
		url:"/user/validateUserRegist",
		type:'POST',
		dataType:"json",
		data:{validateTel:tel,_csrf:$("#_csrf").val()},
		success:function(msg){
			//状态为True时代表已经注册过用户，不允许注册。
			if(msg.status){
				errorTipShow(ValidationEmu.errorMsg.mobile_no_already_in_use,$("#regist_mobile"));
			}else{
				//未检测到注册用户，允许注册。
				//验证邀请码是否有输入。
				callBack && callBack();
			}
		}
	});
};

// 验证用户输入邀请码是否正确
var validateUserInviteCode = function(){
	var inviteCode = $("#regist_invitation_code").val();

	if(ValidationUtils.isNull(inviteCode)){
		//未输入邀请码
		submitRegist();
	}else{
		//已经输入邀请码需要验证邀请码是否在正确。
		$.lbdAjax({
			url:"/user/validateUserInviteCode",
			type:'POST',
			dataType:"json",
			data:{inviteCode:inviteCode.replace(/\s+/g,""),_csrf:$("#_csrf").val()},
			beforeSend:function(){
				$("#regist_btn").attr("disabled",true).addClass('disabled');
				$("#regist_btn").val("注册中...");
			},
			complete:function(){
				$("#regist_btn").attr("disabled",false).removeClass('disabled');
				$("#regist_btn").val("立即注册");
			},
			success:function(msg){
				//状态为True时邀请码可以使用。
				if(msg.status){
					submitRegist();
				}else{
					//显示邀请码无效错误
					errorTipShow(ValidationEmu.errorMsg.invat_code_worng,$("#regist_invitation_code"));
				}
			}
		});
	}
};

var registSuccess = function(){

	$('#regist_error_tip').addClass("hide_op");
	$('.input_wrapper').removeClass('error');

	$.dialog({
		dialogDom:'<div class="ok icon-ok"></div><p class="orange">恭喜您，注册成功！</p><p class="orange"><span id="dialog_count">3</span>秒后跳转到<a href="/">首页</a></p><p class="orange">温馨提示：请先完成投资前的准备</p>',
		className:'regist_dialog_wrapper',
		isClose:false
	});
	var dialogCount = 3,_timer = null;
	_timer = setInterval(function(){
		dialogCount -- ;
		$('#dialog_count').text(dialogCount);
		if(dialogCount<=1){
			dialogCount = 1;
			window.location.href = '/';
			clearInterval(_timer);
		}
	},1000);
}

// 注册提交
var submitRegist = function(){

	var tel = $("#regist_mobile").val();
	var pwd = $('#regist_pwd').val();
	var imgCode = $('#regist_img_code').val();
	var msgCode = $('#regist_msg_code').val();
	var inviteCode = $('#regist_invitation_code').val();
	$.lbdAjax({
		url:"/user/submitRegist",
		type:'POST',
		dataType:"json",
		data:{
			inviteCode:inviteCode.replace(/\s+/g,""),
			telephone:tel.replace(/\s+/g,""),
			password:Utils.shaPassText(pwd.replace(/\s+/g,"")).toUpperCase(),
			imgCode:imgCode,
			msgCode:msgCode,
			_csrf:$("#_csrf").val()
		},
		beforeSend:function(){
			$("#regist_btn").attr("disabled",true).addClass('disabled');
			$("#regist_btn").val("注册中...");
		},
		complete:function(){
			$("#regist_btn").attr("disabled",false).removeClass('disabled');
			$("#regist_btn").val("立即注册");
		},
		success:function(msg){
			//注册成功
			if(msg.status){
				registSuccess();
			}else{
				//根据错误类型区分显示错误位置
				if(msg.errorFeild && msg.errorFeild == "imgCode"){
					//图片验证码错误
					errorTipShow(ValidationEmu.errorMsg.picture_validate_worng,$("#regist_img_code"));
					getRegistImgCode();
					return;
				}
				if(isMsgCodeBtn === false){
					//检测是否已经发送短信验证码
					errorTipShow(ValidationEmu.errorMsg.sms_code_not_send,$("#regist_msg_code"));
					return;
				}
				if(msg.errorFeild && msg.errorFeild == "smsCode"){
					//短信验证码错误
					errorTipShow(ValidationEmu.errorMsg.sms_code_worng_format,$("#regist_msg_code"));
					return;
				}
				if(msg.errorFeild && msg.errorFeild == "mobile"){
					//发送手机非短信接收手机
					errorTipShow(ValidationEmu.errorMsg.mobile_diff,$("#regist_mobile"));
					return;
				}
				if((!msg.errorFeild || msg.errorFeild == "" )&& msg.sObj && msg.sObj.code == "92003"){
					//手机号码已存在
					errorTipShow(ValidationEmu.errorMsg.mobile_no_already_in_use,$("#regist_mobile"));
					return;
				}
				if((!msg.errorFeild || msg.errorFeild == "") && msg.sObj){
					layer.msg(msg.sObj.message);
					return;
				}
			}
		}
	});
};

// 前段验证数据是否正确
var doValidateSubmit =function(){

	var tel = $("#regist_mobile").val().replace(/\s+/g,"");
	var pwd = $('#regist_pwd').val();
	var imgCode = $('#regist_img_code').val();
	var msgCode = $('#regist_msg_code').val();
	var volidateCode = $('#regist_invitation_code').val();

	//用户名是否为空
	if(ValidationUtils.isNull(tel)){
		errorTipShow(ValidationEmu.errorMsg.mobile_no_not_null,$('#regist_mobile'));
		return;
	}
	//用户名格式是否正确
	if(!ValidationUtils.checkMobileNo(tel)){
		errorTipShow(ValidationEmu.errorMsg.mobile_no_wrong_format,$('#regist_mobile'));
		return;
	}
	//密码是否为空
	if(pwd.length == 0){
		errorTipShow(ValidationEmu.errorMsg.password_not_null,$('#regist_pwd'));
		return;
	}
	//密码格式是否正确
	if(!ValidationUtils.checkPwd(pwd)){
		errorTipShow(ValidationEmu.errorMsg.password_no_wrong_format,$('#regist_pwd'));
		return;
	}
	//验证码是否为空
	 if(ValidationUtils.isNull(imgCode)){
	 	errorTipShow(ValidationEmu.errorMsg.picture_validate_not_null,$('#regist_img_code'));
	 	return;
	 }
	//是否获取了短信验证码
	if(isMsgCodeBtn == false){
		//是否点击了请输入短信验证码按钮
		errorTipShow(ValidationEmu.errorMsg.sms_code_not_send,$('#regist_msg_code'));
		return;
	}
	//短信验证码是否为空
	if(ValidationUtils.isNull(msgCode)){	
		errorTipShow(ValidationEmu.errorMsg.sms_code_not_null,$('#regist_msg_code'));
		return;
	}
	//乐百贷用户协议是否同意
	if(!isUserAgreement){
		$('#regist_error_tip').text(ValidationEmu.errorMsg.proco_agreement_weather).removeClass("hide_op");
		return;
	}
	//执行服务器验证序列
	validateUserTeleInUse(tel,validateUserInviteCode);
	
};
$(document).ready(function(){

	/*当前地址链接是否存在邀请码*/
	var invit = Utils.getUrlParams('invit');
	if(invit){
		$('#regist_invitation_code').val(invit);
	}

	//隐藏登录注册导航
	$('#login_href').hide();
	$('#regist_href').hide();

	//获取焦点和失去焦点时的样式变化
	$('input').not('input[type=checkbox]')
		.on('focus',function(){
			$(this).parent().addClass('onfocus');
		}).on('blur',function(){
			$(this).parent().removeClass('onfocus');
		});

	//密码是否可见状态的切换
	$('#ishidden_btn').on('click',function(){
		if($(this).hasClass('icon-show')){
			$(this).removeClass('icon-show');
			$('#regist_pwd').attr('type','password');
		}else{
			$(this).addClass('icon-show');
			$('#regist_pwd').attr('type','text');
		};
	});

	//输入框失去焦点时进行前端矫正
		//1.手机号码
		$("#regist_mobile")
			//手机号码输入时以 XXX XXXX XXXX 格式显示
			.on("focus",function(){
				var val = $(this).val();
				$(this).val(val.replace(/\s+/g,""));
			//失去焦点时
			}).on("blur",function(){

				var mobile = $(this).val().replace(/\s+/g,"");

				//请输入手机号码
				if(ValidationUtils.isNull(mobile)){
					errorTipShow(ValidationEmu.errorMsg.mobile_no_not_null,$(this));
					return false;
				}
				if(mobile.length == 11){
					$(this).val(Utils.formatTel(mobile.trim()));
				}
				//如果手机号码已输入，判断手机号码格式是否正确
				if(!ValidationUtils.checkMobileNo(mobile)){
					errorTipShow(ValidationEmu.errorMsg.mobile_no_wrong_format,$(this));
					return false;
				}else{
					errorTipHide($(this));
					validateUserTeleInUse(mobile);
				}
			});

		//2.登录密码
		$('#regist_pwd')
			//获取焦点时，提示文案出现
			.on('focus',function(){
				$('#regist_pwd_tip').show();
			}).on('blur',function(){
				//失去焦点时，提示文案消失
				$('#regist_pwd_tip').hide();

				//失去焦点时，验证密码
				var registPwd = $(this).val();

				//是否已经输入，如果没有，提示请输入登录密码
				if(ValidationUtils.isNull(registPwd)){
					errorTipShow(ValidationEmu.errorMsg.password_not_null,$(this));
					return ;
				}
				//如果密码已输入，验证登录密码格式
				if(ValidationUtils.checkPwd(registPwd)){
					errorTipHide($(this));
				}else{
					errorTipShow(ValidationEmu.errorMsg.password_rule_tip,$(this));
					return;				
				}
			});

	//获取图片验证码
	getRegistImgCode();

	//点击图片验证码重新获取
	$('#regist_validate_imgCode').click(function(){
		getRegistImgCode();
	});

	//获取短信验证码
	$('#get_msg_code').on('click',function(){

		var tel = $("#regist_mobile").val().replace(/\s+/g,"");
		var imgCode = $('#regist_img_code').val();
		var time = 120;
		var timer = null;

		//是否为可点击状态
		if($(this).hasClass('disabled')){
			return;
		}
		//手机号是否为空
		if(ValidationUtils.isNull(tel)){
			errorTipShow(ValidationEmu.errorMsg.mobile_no_not_null,$('#regist_mobile'));
			return;
		}
		//手机号格式是否正确 
		if(!ValidationUtils.checkMobileNo(tel)){
			errorTipShow(ValidationEmu.errorMsg.mobile_no_wrong_format,$('#regist_mobile'));
			return;
		}
			
		//是否已经注册
		validateUserTeleInUse(tel,function(){
			if(ValidationUtils.isNull(imgCode)){
				errorTipShow(ValidationEmu.errorMsg.picture_validate_not_null,$('#regist_img_code'));
				return;
			}
			//图形验证码是否为空
			errorTipHide($('#regist_img_code'));			
			getRegistMsgCode(tel,function(){
				//获取成功后，修改短信验证码按钮状态为灰色，并开始倒计时
				//是否点击了获取短信验证码
				isMsgCodeBtn = true;
				timer = setInterval(function(){
					time --;
					//倒计时结束后，回复按钮为可点击状态，并清除定时器
					if(time <= 0){
						$('#get_msg_code').removeClass('disabled').text('获取短信验证码');
						clearInterval(timer);
						//若有效期范围内没有输入完成则重新获取图形验证码
						getRegistImgCode();
					}else{
						$('#get_msg_code').addClass('disabled').text(time+'s');
					}
				},1000);
			});
		});	
	});

	//阅读并同意协议
	$('#read_agreement_ck').on('click',function(){
		var isCheck = $('#read_agreement_icon').hasClass('icon-cked');
		if(!isCheck){
			$('#read_agreement_icon').addClass('icon-cked');
			isUserAgreement = true;
		}else{
			$('#read_agreement_icon').removeClass('icon-cked');
			isUserAgreement = false;
		};
	});

	//注册验证
	$('#regist_btn').on('click',function(){
		//验证并提交用户数据
		doValidateSubmit();
	});
});