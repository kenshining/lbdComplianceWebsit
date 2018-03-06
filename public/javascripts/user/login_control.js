var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();

//错误提示文字显示，tip参数为提示的文字
var errorTipShow = function(tip,that){
	$('#login_error_tip').text(tip).removeClass("hide_op");
	$('.input_wrapper').removeClass('error');
	that.parent('.input_wrapper').addClass('error');
};
//错误提示文字消失
var errorTipHide = function(that){
	$('#login_error_tip').addClass("hide_op");
	that.parent('.input_wrapper').removeClass('error');
};

//获取图片验证码
var getLoginImgCode = function(){
	$.lbdAjax({
		url	:'/user/validateImgCode',
		type:'GET',
		dataType:'json',
		data:{_csrf:$("#_csrf").val()},
		success:function(msg){
			//显示验证码
			if(msg.status){
				$("#login_validate_imgCode").attr("src","data:image/png;base64,"+msg.validateCodeImg);
			}else{
				//获取验证码失败
				layer.msg("获取验证码失败！");
			};
		}
	});
};

//提交用户名和密码，进行后端验证
var checkLoginVolidate = function(){
	var tel = $('#login_mobile').val().replace(/\s+/g,"");
	var pwd = $("#login_pwd").val();
	var imgCode = $('#login_img_code').val();
	var imgCodeIsHave=$("#login_img_code_wrapper").is(":visible");

	$.lbdAjax({
		url:"/user/validateUserLogin",
		type:'POST',
		dataType:'JSON',
		data:{
			telephone:tel,
			password:Utils.shaPassText(pwd.replace(/\s+/g,"")).toUpperCase(),
			validateImgCode:imgCode,
			imgCodeIsShow:imgCodeIsHave,
			_csrf:$("#_csrf").val()
		},
		beforeSend:function(){
			$("#login_submit").attr("disabled",true).addClass('disabled');
			$("#login_submit").val("登录中...");
		},
		complete:function(){
			$("#login_submit").attr("disabled",false).removeClass('disabled');
			$("#login_submit").val("登录");
		},
		success:function(message){
			//若用户身份验证错误达到三次，要求用户输入图片验证码。
			if(message.count && message.count >= 3){
				//生成验证码
				getLoginImgCode();
				//验证码显示
				$("#login_img_code_wrapper").show();
			}			
			//图形验证码错误
			if(message.status == false && message.msg == "imgCode" && message.statusCode == 0){
				errorTipShow(ValidationEmu.errorMsg.picture_validate_worng,$("#login_img_code"));
			}
			//用户名与密码不匹配
			else if(message.status == false && message.msg == "userName" && message.statusCode == 1){
				$('#login_error_tip').text(ValidationEmu.errorMsg.mobile_and_pwd_worng,$('#login_mobile')).removeClass("hide_op");
			}
			//用户禁用
			else if(message.status == false && message.msg == 'userName' && message.statusCode == 2){
				$('#login_error_tip').text(ValidationEmu.errorMsg.mobile_not_use,$('#login_mobile')).removeClass("hide_op");
			}		
			else{
				//是否需要记录用户名
				if($('#rem_username_ck').prop('checked') && $('#rem_username_icon').hasClass('icon-cked')){
					$.cookie('lbd-user-username',tel,{expires:100});
				}else{
					$.cookie('lbd-user-username','',{expires:0});
				};

				//判断用户登录成功后跳转到带入的历史页面
				if(message.historyPath){
					window.location.href = message.historyPath;
				}else{
					window.location.href = "/account/accountOverview";
				};
			};
		}
	});
}

//检测用户是否存在
var checkUserIs = function(callBack){
	var tel = $('#login_mobile').val().replace(/\s+/g,"");
	$.lbdAjax({
		url:"/user/validateUserRegist",
		type:'POST',
		dataType:"json",
		data:{validateTel:tel,_csrf:$("#_csrf").val()},
		success:function(msg){
			//用户不存在
			if(!msg.status){
				errorTipShow(ValidationEmu.errorMsg.mobile_no_not_in_use,$('#login_mobile'));
			//用户存在
			}else{
				errorTipHide($('#login_mobile'));
				callBack && callBack();
			}
		}
	});
}

$(document).ready(function(){
	//隐藏登录注册导航
	$('#login_href').hide();
	$('#regist_href').hide();

	//获取焦点和失去焦点时的文本框样式变化
	$('input').not('input[type=checkbox]')
		.on('focus',function(){
			$(this).parent().addClass('onfocus');
		})
		.on('blur',function(){
			$(this).parent().removeClass('onfocus');
		});

	//查看是否记录了用户名，若记录了用户名则显示记录用户且“记住用户名”为勾选中状态，并将用户名显示出来
	var userNameCookies = $.cookie('lbd-user-username');
	if(userNameCookies != null && userNameCookies != ""){
		$('#login_mobile').val(Utils.formatTel(userNameCookies.trim()));
		$('#rem_username_ck').attr('checked',"true");
		$('#rem_username_icon').addClass('icon-cked');
	};
	
	//记住用户名
	$('#rem_username_ck').on('click',function(){
		var isCheck = $('#rem_username_icon').hasClass('icon-cked');
		if(!isCheck){
			$('#rem_username_icon').addClass('icon-cked');
		}else{
			$('#rem_username_icon').removeClass('icon-cked');
		};
	});

	//点击图片验证码重新获取
	$('#login_validate_imgCode').click(function(){
		getLoginImgCode();
	});

	//手机号码的验证
	$("#login_mobile")
		//获取焦点，去除空格
		.on("focus",function(){
			var val = $(this).val();
			$(this).val(val.replace(/\s+/g,""));
		//失去焦点，手机号码的前端验证
		}).on("blur",function(){
			var mobile = $(this).val().replace(/\s+/g,"");

			$('.input_wrapper').removeClass('error');

			if(ValidationUtils.isNull(mobile)){
				return;
			};
			//手机号码是否为11位，若是，则转化手机号码格式
			if(mobile.length == 11){
				$(this).val(Utils.formatTel(mobile.trim()));
			};
			//手机号码格式是否正确
			if(!ValidationUtils.checkMobileNo(mobile)){
				errorTipShow(ValidationEmu.errorMsg.mobile_no_wrong_format,$(this));
			}else{
				checkUserIs();
			};
		});

	//点击登录按钮，提交验证
	$("#login_submit").on('click',function(){
		var tel = $('#login_mobile').val().replace(/\s+/g,"");
		var pwd = $("#login_pwd").val();
		var imgCode = $('#login_img_code').val();

		$('#login_error_tip').addClass("hide_op");
		$('.input_wrapper').removeClass('error');

		//用户名是否为空
		if(ValidationUtils.isNull(tel)){
			errorTipShow(ValidationEmu.errorMsg.mobile_no_not_null,$('#login_mobile'));
			return;
		}
		//用户名格式是否正确
		if(!ValidationUtils.checkMobileNo(tel)){
			errorTipShow(ValidationEmu.errorMsg.mobile_no_wrong_format,$('#login_mobile'));
			return;
		}
		//密码是否为空
		if(ValidationUtils.isNull(pwd)){
			errorTipShow(ValidationEmu.errorMsg.password_not_null,$('#login_pwd'));
			return;
		}
		//验证码是否存在，如存在，需要验证是否为空
		if($("#login_img_code_wrapper").is(':visible')){
			 if(ValidationUtils.isNull(imgCode)){
			 	errorTipShow(ValidationEmu.errorMsg.picture_validate_not_null,$('#login_img_code'));
			 	return;
			 }
		}
		//进行后端验证
		checkUserIs(checkLoginVolidate);
	});

	//enter键可登录
	window.onkeyup=function(event){
		var e = event || event.srcElement;
		if(e && e.keyCode == 13){
			$("#login_submit").click();
		}
	};

	//判断初始化条件是否显示验证码输入项
	var loginCount = $("#initValidateCount").val();
	if(loginCount >= 3){
		//生成验证码
		getLoginImgCode();
		//验证码显示
		$("#login_img_code_wrapper").show();
	};
});