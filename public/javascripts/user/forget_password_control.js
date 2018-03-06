var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();
var loaderWin;
var hasSendSmsCode = false;
//token
var validateStepToken = "";
//获取图片验证
var getForgetImgCode = function(){

	$.ajax({
		url	:'/user/validateImgCode',
		type:'GET',
		dataType:'json',
		data:{_csrf:$("#_csrf").val()},
		success:function(msg){
			//显示验证码
			if(msg.status){
				$("#forget_imgCode").attr("src","data:image/png;base64,"+msg.validateCodeImg);
				$("#forget_imgCode").css("cursor","pointer");
			}else{
				//获取验证码失败
				layer.msg("获取验证码失败！");
			}
		}
	});
	
};
//验证码倒计时
var downCount = 120;
var setSMSDownCountSecond = function(){
	var obj = $("#sendSMSCodebtn");
	if(downCount === 0){
		obj.attr("disabled",false);
		obj.attr("value","获取短信验证码").removeClass('disabled');
		$("#forget_mobile").attr("disabled",false);

		downCount = 120;
		return;
	}else{
		obj.attr("disabled",true);
		obj.attr("value",""+downCount+"S").addClass('disabled');
		downCount--;
		setTimeout(function(){
			setSMSDownCountSecond();
		},1000);
	}

};
//发送手机验证码
var sendSMSValidateCode = function(){
	hasSendSmsCode = false;
	//手机号
	var mobile = $("#forget_mobile").val();
	var _mobile = mobile.replace(/\s+/g,"");
	var result = ValidationUtils.checkMobileNo(_mobile);
	if(_mobile.length !== 0 ){
		if(!result){
			$("#forget_mobile").parent().addClass("error");
			$("#forget_mobile_tip").find('i').html(ValidationEmu.errorMsg.mobile_no_wrong_format);
			$("#forget_mobile_tip").show();
			return;
		}else{
			$("#forget_mobile").parent().removeClass("error");
			$("#forget_mobile_tip").hide();
		}
	}else{
		//未输入手机号码
		$("#forget_mobile").parent().addClass("error");
		$("#forget_mobile_tip").find('i').html(ValidationEmu.errorMsg.mobile_no_not_null);
		$("#forget_mobile_tip").show();
		return;
	}
	//验证图片验证码
	var _imgValCode = $("#forget_imgValCode").val();
	if(_imgValCode.replace(/\s+/g,"") === ""){
		$("#forget_imgValCode").parent().addClass("error");
		$("#forget_imgValCode_tip").find('i').html(ValidationEmu.errorMsg.picture_validate_not_null);
		$("#forget_imgValCode_tip").show();
		return;
	}else{
		$("#forget_imgValCode").parent().removeClass("error");
		$("#forget_imgValCode_tip").hide();
	}

	loaderWin = layer.load(2);
	//发送手机验证码前先验证手机是否已注册
	$.ajax({
		url	:'/user/validateUserRegist',
		type:'POST',
		dataType:'json',
		data:{
			validateTel:_mobile,
			_csrf:$("#_csrf").val()
		},
		success:function(msg){
			layer.close(loaderWin);
			if(msg.msg.data == false){
				$("#forget_mobile_tip").parent().addClass("error");
				$("#forget_mobile_tip").find('i').html(ValidationEmu.errorMsg.mobile_no_not_in_use);
				$("#forget_mobile_tip").show();
				getForgetImgCode();
				return;
			}else{
				//调用服务方法发送验证码
				$.ajax({
					url	:'/user/validateMsgCode',
					type:'POST',
					dataType:'json',
					data:{
						imgValCode:_imgValCode.replace(/\s+/g,""),
						telephone:_mobile,
						_csrf:$("#_csrf").val()
					},
					success:function(msg){
						if(msg.status){
							//已发送验证码成功开始倒计时
							setSMSDownCountSecond();
							$("#forget_smsValCode_tip").hide();
							$("#forget_mobile_tip").parent().removeClass("error");
							hasSendSmsCode = true;
						}else{
							//服务器验证失败
							getForgetImgCode();
							if(msg.errorFeild && msg.errorFeild === "imgCode"){
								$("#forget_imgValCode_tip").find('i').html(ValidationEmu.errorMsg.picture_validate_worng);
								$("#forget_imgValCode").parent().addClass("error");
								$("#forget_imgValCode_tip").show();
							}else if(msg.errorFeild && msg.errorFeild === "smsCode"){
								$("#forget_smsValCode_tip").find('i').html(ValidationEmu.errorMsg.sms_code_worng_format);
								$("#forget_smsValCode_tip").parent().addClass("error");
								$("#forget_smsValCode_tip").show();
							}else if(msg.errorFeild && msg.errorFeild === "mobile"){
								$("#forget_mobile_tip").find('i').html(ValidationEmu.errorMsg.mobile_no_not_in_use);
								$("#forget_mobile_tip").parent().addClass("error");
								$("#forget_mobile_tip").show();
							}else{
								layer.msg(msg.errorMsg);
							}
						}
					}
				});
			}

		}
	});
	

};
//切换视图2
var submitInStep2 = function(){
	//提交动作之前的校验
	var mobile = $("#forget_mobile").val();
	var _mobile = mobile.replace(/\s+/g,"");
	var result = ValidationUtils.checkMobileNo(_mobile);
	if(_mobile.length !== 0 ){
		if(!result){
			$("#forget_mobile").parent().addClass("error");
			$("#forget_mobile_tip").find('i').html(ValidationEmu.errorMsg.mobile_no_wrong_format);
			$("#forget_mobile_tip").show();
			return;
		}else{
			$("#forget_mobile").parent().removeClass("error");
			$("#forget_mobile_tip").hide();
		}
	}else{
		//未输入手机号码
		$("#forget_mobile").parent().addClass("error");
		$("#forget_mobile_tip").find('i').html(ValidationEmu.errorMsg.mobile_no_not_null);
		$("#forget_mobile_tip").show();
		return;
	}
	//验证图片验证码
	var _imgValCode = $("#forget_imgValCode").val();
	if(_imgValCode.replace(/\s+/g,"") === ""){
		$("#forget_imgValCode").parent().addClass("error");
		$("#forget_imgValCode_tip").find('i').html(ValidationEmu.errorMsg.picture_validate_not_null);
		$("#forget_imgValCode_tip").show();
		return;
	}else{
		$("#forget_imgValCode").parent().removeClass("error");
		$("#forget_imgValCode_tip").hide();
	}
	//验证短信验证码 forget_smsValCode_tip
	var _smsValCode = $("#forget_smsValCode").val();
	if(hasSendSmsCode == false){
		$("#forget_smsValCode").parent().addClass("error");
		$("#forget_smsValCode_tip").find('i').html(ValidationEmu.errorMsg.sms_code_not_send);
		$("#forget_smsValCode_tip").show();
		return;
	}else{
		$("#forget_smsValCode").parent().removeClass("error");
		$("#forget_smsValCode_tip").hide();
	}
	if(_smsValCode.replace(/\s+/g,"") === ""){
		$("#forget_smsValCode").parent().addClass("error");
		$("#forget_smsValCode_tip").find('i').html(ValidationEmu.errorMsg.sms_code_not_null);
		$("#forget_smsValCode_tip").show();
		return;
	}else{
		$("#forget_smsValCode").parent().removeClass("error");
		$("#forget_smsValCode_tip").hide();
	}
	//提交服务器级验证
	$.ajax({
		url	:'/user/validateForgetPwd',
		type:'POST',
		dataType:'json',
		data:{
			imgCode:_imgValCode.replace(/\s+/g,""),
			smsCode:_smsValCode.replace(/\s+/g,""),
			mobile:_mobile,
			_csrf:$("#_csrf").val()
		},
		success:function(msg){
			if(msg.status){
				//设置正确校验token
				validateStepToken = msg.validateStepToken;
				//验证通过切换页面
				$("#yz_one").fadeOut(100,function(){
					$("#yz_two").fadeIn(100);
				});
			}else{
				//服务器验证失败
				getForgetImgCode();
				//服务器验证错误在错误区域显示错误内容
				if(msg.errorFeild && msg.errorFeild === "imgCode"){
					$("#forget_imgValCode_tip").find('i').html(ValidationEmu.errorMsg.picture_validate_worng);
					$("#forget_imgValCode_tip").show();
				}else if(msg.errorFeild && msg.errorFeild === "smsCode"){
					$("#forget_smsValCode_tip").find('i').html(ValidationEmu.errorMsg.sms_code_worng_format);
					$("#forget_smsValCode_tip").show();
				}else if(msg.errorFeild && msg.errorFeild === "mobile"){
					if(msg.errorCode && msg.errorCode == "355"){
						$("#forget_mobile_tip").find('i').html(ValidationEmu.errorMsg.mobile_diff);
					}else{
						$("#forget_mobile_tip").find('i').html(ValidationEmu.errorMsg.mobile_no_not_in_use);
					}	
					$("#forget_mobile_tip").show();
				}else{
					layer.msg("不明错误类型。");
				}
			}
		}
	});
};
//提交验证数据
var submitResetPWD = function(){
	//验证是否为两种以上字符
	var passwordNew = $('#passwordNew').val();
	var passwordRepeat = $('#passwordRepeat').val();
	//为空验证
	if(passwordNew.replace(/\s+/g,"") == "" || passwordNew.length <= 0){
		$('#forget_passwordNew_tip').show();
		$('#forget_passwordNew_tip').find("i").html(ValidationEmu.errorMsg.password_not_null);
		$('#passwordNew').parent().addClass("error");
		return;
	}else{
		$('#forget_passwordNew_tip').hide();
		$('#passwordNew').parent().removeClass("error");
	}

	if(passwordRepeat.replace(/\s+/g,"") == "" || passwordRepeat.length <= 0){
		$('#forget_passwordRepeat_tip').show();
		$('#forget_passwordRepeat_tip').find("i").html(ValidationEmu.errorMsg.password_repeat_null);
		$('#passwordRepeat').parent().addClass("error");
		return;
	}else{
		$('#forget_passwordRepeat_tip').hide();
		$('#passwordRepeat').parent().removeClass("error");
	}

	var passState = ValidationUtils.checkPwd(passwordNew);
	if(!passState || passwordNew.length > 20 || passwordNew.length < 6){
		$('#forget_passwordNew_tip').show();
		$('#forget_passwordNew_tip').find("i").html(ValidationEmu.errorMsg.password_rule_tip_worng);
		$('#passwordNew').parent().addClass("error");
		return;
	}else{
		$('#forget_passwordNew_tip').hide();
		$('#passwordNew').parent().removeClass("error");
	}
	//验证密码是否一致
	if(passwordNew.replace(/\s+/g,"") != passwordRepeat.replace(/\s+/g,"")){
		$('#forget_passwordRepeat_tip').show();
		$('#forget_passwordRepeat_tip').find("i").html(ValidationEmu.errorMsg.password_repeat_worng);
		$('#passwordRepeat').parent().addClass("error");
		return;
	}else{
		$('#forget_passwordRepeat_tip').hide();
		$('#passwordRepeat').parent().removeClass("error");
	}
	//提交动作修改显示确定按钮
	$("#submitChangePwdBtn").attr("value","提交中...");
	$("#submitChangePwdBtn").attr("disabled",true).addClass('disabled');
	var mobile = $("#forget_mobile").val();
	var _mobile = mobile.replace(/\s+/g,"");
	///user/resetPwd
	$.ajax({
		url	:'/user/resetPwd',
		type:'POST',
		dataType:'json',
		data:{
			password:Utils.shaPassText(passwordNew.replace(/\s+/g,"")).toUpperCase(),
			telephone:_mobile,
			token:validateStepToken,
			_csrf:$("#_csrf").val()
		},
		success:function(msg){
			if(msg.status){
				//修改成功跳转到成功页面
				$("#yz_two").fadeOut(100,function(){
					$("#yz_three").fadeIn(100,function(){
						setTimeout(function(){
							window.location.href = "/";
						},4000);
					});
				});
			}else{
				//服务器错误
				layer.msg(msg.msg);
				$("#submitChangePwdBtn").attr("value","确定");
				$("#submitChangePwdBtn").attr("disabled",false).removeClass('disabled');
			}
		}
	});

};
$(document).ready(function(){
	//获取图片验证码
	getForgetImgCode();
	$("#forget_imgCode").on("click",function(){
		getForgetImgCode();
	});
	//获取焦点和失去焦点时的样式变化
  	$('input[type="text"]').on('focus',function(){
      $(this).parent().addClass('onfocus');
    }).on('blur',function(){
      $(this).parent().removeClass('onfocus');
    });
	//绑定输入格式化事件
	$("#forget_mobile").on("focus",function(){
		var val = $(this).val();
		$(this).val(val.replace(/\s+/g,""));
		//失去焦点时
		}).on("blur",function(){
		//验证手机号码格式是否正确
		var mobile = $(this).val();
		var _mobile = mobile.replace(/\s+/g,"");
		var result = ValidationUtils.checkMobileNo(_mobile);

		if(_mobile.length == 11){
			$(this).val(Utils.formatTel(mobile.trim()));
		}
		
		if(_mobile.length !== 0 ){
			if(!result){
				$("#forget_mobile_tip").parent().addClass("error");
				$("#forget_mobile_tip").find('i').html(ValidationEmu.errorMsg.mobile_no_wrong_format);
				$("#forget_mobile_tip").show();
				return;
			}else{
				$("#forget_mobile_tip").parent().removeClass("error");
				$("#forget_mobile_tip").hide();
				//验证手机号是否已经被注册
				loaderWin = layer.load(2);
				$.ajax({
					url	:'/user/validateUserRegist',
					type:'POST',
					dataType:'json',
					data:{
						validateTel:_mobile,
						_csrf:$("#_csrf").val()
					},
					success:function(msg){
						layer.close(loaderWin);
						if(msg.msg.data == false){
							$("#forget_mobile_tip").parent().addClass("error");
							$("#forget_mobile_tip").find('i').html(ValidationEmu.errorMsg.mobile_no_not_in_use);
							$("#forget_mobile_tip").show();
							return;
						}

					}
				});
			}
		}
		
	});

	//绑定切换第二步提交动作
	$("#btn_1_next").on("click",function(){
		submitInStep2();
	});
	//绑定发送手机验证码
	$("#sendSMSCodebtn").on("click",function(){
		sendSMSValidateCode();
	});

	//绑定密码修改窗口事件
	//获取焦点时，提示文案出现
	$('#passwordNew').on('focus',function(){
		$('#forget_pwd_tip').show();
	}).on('blur',function(){
		$('#forget_pwd_tip').hide();
		//触发密码验证动作
		var passwordNew = $(this).val();
		if(passwordNew.replace(/\s+/g,"") == "" || passwordNew.length <= 0){
			$('#forget_passwordNew_tip').show();
			$('#forget_passwordNew_tip').find("i").html(ValidationEmu.errorMsg.password_not_null);
			$('#passwordNew').parent().addClass("error");
			return;
		}else{
			$('#forget_passwordNew_tip').hide();
			$('#passwordNew').parent().removeClass("error");
		}

		var passState = ValidationUtils.checkPwd(passwordNew);
		if(!passState || passwordNew.length > 20 || passwordNew.length < 6){
			$('#forget_passwordNew_tip').show();
			$('#forget_passwordNew_tip').find("i").html(ValidationEmu.errorMsg.password_rule_tip_worng);
			$('#passwordNew').parent().addClass("error");
			return;
		}else{
			$('#forget_passwordNew_tip').hide();
			$('#passwordNew').parent().removeClass("error");
		}



	});
	$('#passwordRepeat').on('focus',function(){
		$('#forget_pwd_tip2').show();
	}).on('blur',function(){
		$('#forget_pwd_tip2').hide();
		var passwordNew = $('#passwordNew').val();
		var passwordRepeat = $('#passwordRepeat').val();
		if(passwordNew.replace(/\s+/g,"") != passwordRepeat.replace(/\s+/g,"")){
			$('#forget_passwordRepeat_tip').show();
			$('#forget_passwordRepeat_tip').find("i").html(ValidationEmu.errorMsg.password_repeat_worng);
			$('#passwordRepeat').parent().addClass("error");
			return;
		}else{
			$('#forget_passwordRepeat_tip').hide();
			$('#passwordRepeat').parent().removeClass("error");
		}
	});
	//绑定提交按钮动作
	$('#submitChangePwdBtn').on("click",function(){
		submitResetPWD();
	});
});