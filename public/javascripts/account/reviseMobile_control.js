var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();
var isGetMsgCode = false, isGetMsgNewCode = false;
var timer = null;
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
				$("#reviseMobile_img_code").attr("src","data:image/png;base64,"+msg.validateCodeImg);
				$("#n_reviseMobile_img_code").attr("src","data:image/png;base64,"+msg.validateCodeImg);
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
function getMsgCode(tel,imgInput,msgInput,ip,successCallBack){
	$.lbdAjax({
		url	:'/user/validateMsgCode',
		type:'POST',
		dataType:'JSON',
		data:{telephone:tel,imgValCode:imgInput.val().replace(/\s+/g,""),ip:ip,_csrf:$("#_csrf").val()},
		success:function(msg){
			//图形验证码错误
			if(msg.status == false && msg.errorFeild == 'imgCode'){
				imgInput.parent().addClass('error');
				imgInput.parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_worng);
				imgInput.parents('section').find('.error_tip').show();
				getImgCode();
				return ;

			//验证短信验证码频繁，发送失败
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91001"){
				msgInput.parent().addClass('error');
				msgInput.parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_not_send_error);
				msgInput.parents('section').find('.error_tip').show();

			//当前用户超过限制
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91002"){
				msgInput.parent().addClass('error');
				msgInput.parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.smg_code_user_limit);
				msgInput.parents('section').find('.error_tip').show();

			//当前IP超过限制
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91003"){
				msgInput.parent().addClass('error');
				msgInput.parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.smg_code_ip_limit);
				msgInput.parents('section').find('.error_tip').show();
			//短信发送平台错误
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91004"){
				msgInput.parent().addClass('error');
				msgInput.parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_locked);
				msgInput.parents('section').find('.error_tip').show();

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

	var imgCode = $('#reviseMobile_imgCode_val').val();
	var msgCode = $('#reviseMobile_msgCode_val').val();
	var tel = $('#reviseMobile_y_telephone').html();

	$.lbdAjax({
		url	:'/securitySetting/validateMsgCode',
		type:'POST',
		dataType:'json',
		data:{telephone:tel,imgCode:imgCode.replace(/\s+/g,""),msgCode:msgCode.replace(/\s+/g,""),_csrf:$("#_csrf").val()},
		success:function(msg){
			
			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').val("解绑").removeClass('disabled');

			//图形验证码是否正确
			if(msg.status == false && msg.errorFeild == "imgCode"){
				$('#reviseMobile_imgCode_val').parent().addClass('error');
				$('#reviseMobile_imgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_worng);
				$('#reviseMobile_imgCode_val').parents('section').find('.error_tip').show();
				getImgCode();
				return ;
			};

			//短信验证码是否正确
			if(msg.status == false && msg.errorFeild == "smsCode"){
				$('#reviseMobile_msgCode_val').parent().addClass('error');
				$('#reviseMobile_msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_worng_format);
				$('#reviseMobile_msgCode_val').parents('section').find('.error_tip').show();
				return ;
			};

			//验证通过，解绑成功，进行修改
			if(msg.status == true){
				$('#remove_mobile_wrapper').remove();
				$('#set_newMobile_wrapper').show();
				getImgCode();
			};
			
		},
		error:function(msg){
			layer.msg('链接超时！');
			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').val("解绑").removeClass('disabled');
		}
	});

};
//手机号码是否已经被注册过
function checkTelphoneIsUsed(tel,successFn){
	$.lbdAjax({
		url	:'/user/validateUserRegist',
		type:'POST',
		dataType:'json',
		data:{validateTel:tel.replace(/\s+/g,""),_csrf:$("#_csrf").val()},
		success:function(msg){
			successFn(msg);
		},
		error:function(msg){
			layer.msg("链接超时！");
		}
	});
};

//提交保存验证
function submitCheck(){
	var tel = $('#n_reviseMobile_telephone').val().replace(/\s+/g,"");
	$.lbdAjax({
		url:"/securitySetting/reviseMobile",
		type:'POST',
		dataType:"json",
		data:{
			telephone:tel,
			imgCode:$('#n_reviseMobile_imgCode_val').val(),
			msgCode:$('#n_reviseMobile_msgCode_val').val(),
			_csrf:$("#_csrf").val()
		},
		success:function(msg){
			//修改成功
			if(msg.status == true){
				/*手机号码修改成功弹出框*/
				var Dialog = $.dialog({
					dialogDom:'<div class="icon icon-ok"></div><p class="orange">恭喜您，手机号码修改成功！</p>',
					className:'dia_wrapper revise_mobile_wrapper',
					isClose:false
				});
				timer = setTimeout(function(){
					Dialog.close();
					//头部手机号码更新，格式
					var regmobile=/^(.{3})(.{4})(.{4})$/;
					$('#telephone').html(tel.replace(regmobile,'$1****$3'));
					$('#topBar_telephone').html(tel);
					changeCurrentMenu('/account/securitySetting/securitySetting','securitySetting_sub_m_btn');
				},2000);
			}else{
				//根据错误类型区分显示错误位置
				$('#remove_tel_btn').attr('disabled',false);
				$('#remove_tel_btn').val("确定").removeClass('disabled');

				if(msg.errorFeild && msg.errorFeild == "imgCode"){
					//图片验证码错误
					$('#n_reviseMobile_imgCode_val').parent().addClass('error');
					$('#n_reviseMobile_imgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_worng);
					$('#n_reviseMobile_imgCode_val').parents('section').find('.error_tip').show();
					getImgCode();
					return;
				}
				if(msg.errorFeild && msg.errorFeild == "smsCode"){
					//短信验证码错误
					$('#n_reviseMobile_msgCode_val').parent().addClass('error');
					$('#n_reviseMobile_msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_worng_format);
					$('#n_reviseMobile_msgCode_val').parents('section').find('.error_tip').show();
					return;
				}
				if(msg.errorFeild && msg.errorFeild == "mobile"){
					//发送手机非短信接收手机
					$('#n_reviseMobile_telephone').parent().addClass('error');
					$('#n_reviseMobile_telephone').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.mobile_diff);
					$('#n_reviseMobile_telephone').parents('section').find('.error_tip').show();
					return;
				}
				if((!msg.errorFeild || msg.errorFeild == "") && msg.sObj){
					layer.msg(JSON.stringify(msg.sObj));
					return;
				}
			}
		},
		error:function(msg){
			layer.msg("链接超时！");
		}
	});
};


$(document).ready(function(){
	/*清除定时器动作*/
	if(REVERS_ECOUNT_TIMER_HANDLER){
		clearInterval(REVERS_ECOUNT_TIMER_HANDLER);
	};
	/*清除定时器动作*/
	if(REVERS_ECOUNT_TIMER_HANDLER_TWO){
		clearInterval(REVERS_ECOUNT_TIMER_HANDLER_TWO);
	};
	/*文本框获取焦点和失去焦点样式*/
	$('input').not('input[type=button]')
	.on('focus',function(){
		$(this).parent().addClass('onfocus');
	})
	.on('blur',function(){
		$(this).parent().removeClass('onfocus');
	});


	/*解绑部分*/
	//初始化图形验证码
	getImgCode();

	//点击图形验证码重新获取
	$("#reviseMobile_img_code").click(function(){
		getImgCode();
	});
	//点击图形验证码重新获取
	$("#n_reviseMobile_img_code").click(function(){
		getImgCode();
	});

	//点击获取短信验证码
	$("#reviseMobile_msg_code").click(function(){

		var imgCodeVal = $('#reviseMobile_imgCode_val').val(); 
		var time = 120;

		$('#reviseMobile_imgCode_val').parent().removeClass('error');
		$('#reviseMobile_imgCode_val').parents('section').find('.error_tip').hide();

		$('#reviseMobile_msgCode_val').parent().removeClass('error');
		$('#reviseMobile_msgCode_val').parents('section').find('.error_tip').hide();

		//是否为可点击状态
		if($(this).hasClass('disabled')){
			return;
		}

		//图形验证码是否为空
		if(ValidationUtils.isNull(imgCodeVal)){
			$('#reviseMobile_imgCode_val').parent().addClass('error');
			$('#reviseMobile_imgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_not_null);
			$('#reviseMobile_imgCode_val').parents('section').find('.error_tip').show();
			return ;
		};

		/*后端验证图形验证码和获取短信验证码*/
		getMsgCode($('#reviseMobile_y_telephone').html(),$('#reviseMobile_imgCode_val'),$('#reviseMobile_msgCode_val'),1
			//成功回调
			,function(){
				//按钮不可点击，开启120s倒计时
				isGetMsgCode = true;
				REVERS_ECOUNT_TIMER_HANDLER_TWO = setInterval(function(){
					time --;
					//倒计时结束后，恢复按钮为可点击状态，并清除定时器
					if(time <= 0){
						$('#reviseMobile_msg_code').removeClass('disabled').text('获取短信验证码');
						clearInterval(REVERS_ECOUNT_TIMER_HANDLER_TWO);
						//若有效期范围内没有输入完成则重新获取图形验证码
						getImgCode();
					}else{
						$('#reviseMobile_msg_code').addClass('disabled').text(time+'s');
					}
				},1000);
		});
	});

	//点击解绑
	$('#remove_tel_btn').click(function(){

		var imgCode = $('#reviseMobile_imgCode_val').val();
		var msgCode = $('#reviseMobile_msgCode_val').val();

		$('#remove_tel_btn').attr('disabled',true);
		$('#remove_tel_btn').val("解绑中...").addClass('disabled');

		$('#reviseMobile_imgCode_val').parent().removeClass('error');
		$('#reviseMobile_imgCode_val').parents('section').find('.error_tip').hide();

		$('#reviseMobile_msgCode_val').parent().removeClass('error');
		$('#reviseMobile_msgCode_val').parents('section').find('.error_tip').hide();

		//图形验证码是否为空
		if(ValidationUtils.isNull(imgCode)){
			$('#reviseMobile_imgCode_val').parent().addClass('error');
			$('#reviseMobile_imgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_not_null);
			$('#reviseMobile_imgCode_val').parents('section').find('.error_tip').show();

			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').val("解绑").removeClass('disabled');
			return ;
		};

		//是否已经点击了获取验证码
		if(!isGetMsgCode){
			$('#reviseMobile_msgCode_val').parent().addClass('error');
			$('#reviseMobile_msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_not_send);
			$('#reviseMobile_msgCode_val').parents('section').find('.error_tip').show();

			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').val("解绑").removeClass('disabled');
			return ;
		};

		//短信验证码是否为空
		if(ValidationUtils.isNull(msgCode)){
			$('#reviseMobile_msgCode_val').parent().addClass('error');
			$('#reviseMobile_msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_not_null);
			$('#reviseMobile_msgCode_val').parents('section').find('.error_tip').show();

			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').val("解绑").removeClass('disabled');
			return ;
		};

		//后端短信验证码 和 图形验证码
		volidateImgAndMsgCode();
	});






/*修改手机号部分*/
	//手机号码验证
	$('#n_reviseMobile_telephone').on("blur",function(){

		var tel = $(this).val();

		$('#n_reviseMobile_telephone').parent().removeClass('error');
		$('#n_reviseMobile_telephone').parents('section').find('.error_tip').hide();

		if(ValidationUtils.isNull(tel)){
			return;
		};

		//手机号码格式是否正确
		if(!ValidationUtils.checkMobileNo(tel)){
			$('#n_reviseMobile_telephone').parent().addClass('error');
			$('#n_reviseMobile_telephone').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.mobile_no_wrong_format);
			$('#n_reviseMobile_telephone').parents('section').find('.error_tip').show();
			return ;
		};

		//手机号码是否已经注册
		checkTelphoneIsUsed(tel,function(msg){
			if(msg.status == true && msg.errorCode == "mobile"){
				//手机号码已经注册，不能注册
				$('#n_reviseMobile_telephone').parent().addClass('error');
				$('#n_reviseMobile_telephone').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.mobile_no_already_in_use);
				$('#n_reviseMobile_telephone').parents('section').find('.error_tip').show();
				return ;
			};
		});
	});


	//点击获取短信验证码
	$("#n_reviseMobile_msg_code").click(function(){

		var imgCodeVal = $('#n_reviseMobile_imgCode_val').val(); 
		var tel = $('#n_reviseMobile_telephone').val();
		var time = 120;

		$('#n_reviseMobile_imgCode_val').parent().removeClass('error');
		$('#n_reviseMobile_imgCode_val').parents('section').find('.error_tip').hide();

		$('#n_reviseMobile_msgCode_val').parent().removeClass('error');
		$('#n_reviseMobile_msgCode_val').parents('section').find('.error_tip').hide();

		//是否为可点击状态
		if($(this).hasClass('disabled')){
			return;
		}

		//验证手机号码是否为空
		if(ValidationUtils.isNull(tel)){
			$('#n_reviseMobile_telephone').parent().addClass('error');
			$('#n_reviseMobile_telephone').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.loan_no_mobile);
			$('#n_reviseMobile_telephone').parents('section').find('.error_tip').show();
			return ;
		};

		//手机号码格式是否正确
		if(!ValidationUtils.checkMobileNo(tel)){
			$('#n_reviseMobile_telephone').parent().addClass('error');
			$('#n_reviseMobile_telephone').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.mobile_no_wrong_format);
			$('#n_reviseMobile_telephone').parents('section').find('.error_tip').show();
			return ;
		};
		
		//手机号码是否已经注册
		checkTelphoneIsUsed(tel,function(msg){
			if(msg.status == true && msg.errorCode == "mobile"){
				//手机号码已经注册，不能注册
				$('#n_reviseMobile_telephone').parent().addClass('error');
				$('#n_reviseMobile_telephone').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.mobile_no_already_in_use);
				$('#n_reviseMobile_telephone').parents('section').find('.error_tip').show();
				return ;
			}else{
				/*图形验证码的验证*/
				//图形验证码是否为空
				if(ValidationUtils.isNull(imgCodeVal)){
					$('#n_reviseMobile_imgCode_val').parent().addClass('error');
					$('#n_reviseMobile_imgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_not_null);
					$('#n_reviseMobile_imgCode_val').parents('section').find('.error_tip').show();
					return ;
				};
				//验证短信验证码
				getMsgCode($('#n_reviseMobile_telephone').val(),$('#n_reviseMobile_imgCode_val'),$('#n_reviseMobile_msgCode_val'),0
					,function(){
						isGetMsgNewCode = true;
						REVERS_ECOUNT_TIMER_HANDLER = setInterval(function(){
							time --;
							//倒计时结束后，恢复按钮为可点击状态，并清除定时器
							if(time <= 0){
								$('#n_reviseMobile_msg_code').removeClass('disabled').text('获取短信验证码');
								clearInterval(REVERS_ECOUNT_TIMER_HANDLER);
								//若有效期范围内没有输入完成则重新获取图形验证码
								getImgCode();
							}else{
								$('#n_reviseMobile_msg_code').addClass('disabled').text(time+'s');
							}
						},1000);
					});
				};
			});
		});


	//点击确定保存手机号码
	$('#reviseMobile_btn').click(function(){

		var tel = $('#n_reviseMobile_telephone').val();
		var msgCode = $('#n_reviseMobile_msgCode_val').val();
		var imgCodeVal = $('#n_reviseMobile_imgCode_val').val();

		$('#remove_tel_btn').attr('disabled',true);
		$('#remove_tel_btn').val("保存中...").addClass('disabled');

		$('#n_reviseMobile_telephone').parent().removeClass('error');
		$('#n_reviseMobile_imgCode_val').parent().removeClass('error');
		$('#n_reviseMobile_msgCode_val').parent().removeClass('error');

		$('.error_tip').hide();

		//验证手机号码是否为空
		if(ValidationUtils.isNull(tel)){
			$('#n_reviseMobile_telephone').parent().addClass('error');
			$('#n_reviseMobile_telephone').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_mobile_no);
			$('#n_reviseMobile_telephone').parents('section').find('.error_tip').show();

			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').val("确定").removeClass('disabled');
			return ;
		};

		//手机号码格式是否正确
		if(!ValidationUtils.checkMobileNo(tel)){
			$('#n_reviseMobile_telephone').parent().addClass('error');
			$('#n_reviseMobile_telephone').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.mobile_no_wrong_format);
			$('#n_reviseMobile_telephone').parents('section').find('.error_tip').show();

			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').val("确定").removeClass('disabled');
			return ;
		};

		//图形验证码是否为空
		if(ValidationUtils.isNull(imgCodeVal)){
			$('#n_reviseMobile_imgCode_val').parent().addClass('error');
			$('#n_reviseMobile_imgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_not_null);
			$('#n_reviseMobile_imgCode_val').parents('section').find('.error_tip').show();

			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').val("确定").removeClass('disabled');
			return ;
		};

		//是否已经点击了获取验证码
		if(!isGetMsgNewCode){
			$('#n_reviseMobile_msgCode_val').parent().addClass('error');
			$('#n_reviseMobile_msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_not_send);
			$('#n_reviseMobile_msgCode_val').parents('section').find('.error_tip').show();

			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').val("确定").removeClass('disabled');
			return ;
		};

		//短信验证码是否为空
		if(ValidationUtils.isNull(msgCode)){
			$('#n_reviseMobile_msgCode_val').parent().addClass('error');
			$('#n_reviseMobile_msgCode_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_not_null);
			$('#n_reviseMobile_msgCode_val').parents('section').find('.error_tip').show();

			$('#remove_tel_btn').attr('disabled',false);
			$('#remove_tel_btn').val("确定").removeClass('disabled');
			return ;
		};

		/*后端验证序列*/
		//手机号码是否已经注册
		checkTelphoneIsUsed(tel,function(msg){
			if(msg.status == true && msg.errorCode == "mobile"){
				//手机号码已经注册，不能注册
				$('#n_reviseMobile_telephone').parent().addClass('error');
				$('#n_reviseMobile_telephone').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.mobile_no_already_in_use);
				$('#n_reviseMobile_telephone').parents('section').find('.error_tip').show();

				$('#remove_tel_btn').attr('disabled',false);
				$('#remove_tel_btn').val("确定").removeClass('disabled');
				return ;
			}else{
				//提交修改验证
				submitCheck();
			};
		});

	});
});