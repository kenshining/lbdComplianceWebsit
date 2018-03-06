var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();
var isGetMsgCode = false ,timer = null;
//获取图片验证码
function getImgCode(){
	$.lbdAjax({
		url	:'/user/validateImgCode',
		type:'GET',
		dataType:'json',
		data:{_csrf:$("#_csrf").val()},
		success:function(msg){
			//显示验证码
			if(msg.status){
				$("#imgCode").attr("src","data:image/png;base64,"+msg.validateCodeImg);
			}else{
				//获取验证码失败
				layer.msg("获取验证码失败！");
			};
		}
	});
};

//获取短信验证码
function getMsgCode(tel,imgInput,msgInput,successCallBack){
	$.lbdAjax({
		url	:'/user/validateMsgCode',
		type:'POST',
		dataType:'json',
		data:{telephone:tel,imgValCode:imgInput.val().replace(/\s+/g,""),_csrf:$("#_csrf").val()},
		success:function(msg){
			//图形验证码错误
			if(msg.status == false && msg.errorFeild == 'imgCode'){
				imgInput.parent().addClass('error');
				imgInput.parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_worng);
				imgInput.parents('section').find('.s_error_tip').show();
				getImgCode();
				return ;

			//验证短信验证码频繁，发送失败
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91001"){
				msgInput.parent().addClass('error');
				msgInput.parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_not_send_error);
				msgInput.parents('section').find('.s_error_tip').show();

			//是否超过上限
			}else if(msg.status == false &&  msg.errorCode && (msg.errorCode == "91003" || msg.errorCode == "91002")){
				msgInput.parent().addClass('error');
				msgInput.parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_locked);
				msgInput.parents('section').find('.s_error_tip').show();

			//短信发送平台错误
			}else if(msg.status == false &&  msg.errorCode && msg.errorCode == "91004"){
				msgInput.parent().addClass('error');
				msgInput.parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_locked);
				msgInput.parents('section').find('.s_error_tip').show();

			//发送成功	
			}else if(msg.status && msg.errorMsg === "发送成功"){
				successCallBack();
			}
		},
		error:function(msg){
			layer.msg(JSON.stringify(msg));
		}
	});
};

//验证短信验证码和图形验证码
function volidateImgAndMsgCode(){
	var imgCode = $('#imgCode_val').val();
	var msgCode = $('#msgCode_val').val();
	var tel = $('#reviseMobile_y_telephone').html();
	$.lbdAjax({
		url	:'/securitySetting/validateMsgCode',
		type:'POST',
		dataType:'json',
		data:{telephone:tel,imgCode:imgCode.replace(/\s+/g,""),msgCode:msgCode.replace(/\s+/g,""),_csrf:$("#_csrf").val()},
		success:function(msg){
			
			$('#next_btn').attr('disabled',false);
			$('#next_btn').removeClass('disabled');

			//图形验证码错误
			if(msg.status == false && msg.errorFeild == "imgCode"){
				$('#imgCode_val').parent().addClass('error');
				$('#imgCode_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_worng);
				$('#imgCode_val').parents('section').find('.s_error_tip').show();
				getImgCode();
				return ;
			};

			//短信验证码错误
			if(msg.status == false && msg.errorFeild == "smsCode"){
				$('#msgCode_val').parent().addClass('error');
				$('#msgCode_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_worng_format);
				$('#msgCode_val').parents('section').find('.s_error_tip').show();
				return ;
			};
			if(msg.status == true){
				$('#setDealPwd_wrapper').remove();
				$('#setDealPwd_next_wrapper').show();
				getImgCode();
			};
			
		},
		error:function(msg){
			layer.msg(JSON.stringify(msg));
			$('#next_btn').attr('disabled',false);
			$('#next_btn').removeClass('disabled');
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
			$('#setDealPwd_ok_btn').attr('disabled',false);
			$('#setDealPwd_ok_btn').removeClass("disabled").val('确定');

			if(msg.state == "SUCCESS"){
				/*修改成功弹出框*/
				var Dialog = $.dialog({
					dialogDom:'<div class="icon icon-ok"></div><p class="orange">恭喜您，交易密码设置成功！</p>',
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
			}else{
				layer.msg(msg.message);
			}
		},
		error:function(msg){
			layer.msg(JSON.stringify(msg));
			$('#setDealPwd_ok_btn').attr('disabled',false);
			$('#setDealPwd_ok_btn').removeClass("disabled").val('确定');
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
		})

	//初始化图片验证码
	getImgCode();
	//点击图片刷新图片验证码
	$('#imgCode').click(function(){
		getImgCode();
	});
	/*点击获取验证码*/
	$('#msgCode_btn').click(function(){
		var imgCodeVal = $('#imgCode_val').val(); 
		var time = 120;

		$('#imgCode_val').parent().removeClass('error');
		$('#imgCode_val').parents('section').find('.s_error_tip').hide();

		$('#msgCode_val').parent().removeClass('error');
		$('#msgCode_val').parents('section').find('.s_error_tip').hide();

		//是否为可点击状态
		if($(this).hasClass('disabled')){
			return;
		}

		//图形验证码是否为空
		if(ValidationUtils.isNull(imgCodeVal)){
			$('#imgCode_val').parent().addClass('error');
			$('#imgCode_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_not_null);
			$('#imgCode_val').parents('section').find('.s_error_tip').show();
			return ;
		};

		//验证短信验证码
		getMsgCode($('#setDealPwd_user_telephone').html(),$('#imgCode_val'),$('#msgCode_val'),function(){

			isGetMsgCode = true;

			REVERS_ECOUNT_TIMER_HANDLER = setInterval(function(){
				time --;
				//倒计时结束后，回复按钮为可点击状态，并清除定时器
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

	/*点击下一步*/
	$('#next_btn').click(function(){

		var imgCode = $('#imgCode_val').val();
		var msgCode = $('#msgCode_val').val();

		$('#next_btn').attr('disabled',true);
		$('#next_btn').addClass('disabled');

		$('#imgCode_val').parent().removeClass('error');
		$('#imgCode_val').parents('section').find('.s_error_tip').hide();

		$('#msgCode_val').parent().removeClass('error');
		$('#msgCode_val').parents('section').find('.s_error_tip').hide();

		//图形验证码是否为空
		if(ValidationUtils.isNull(imgCode)){
			$('#imgCode_val').parent().addClass('error');
			$('#imgCode_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.picture_validate_not_null);
			$('#imgCode_val').parents('section').find('.s_error_tip').show();

			$('#next_btn').attr('disabled',false);
			$('#next_btn').removeClass('disabled');
			return ;
		};

		//是否已经点击了获取验证码
		if(!isGetMsgCode){
			$('#msgCode_val').parent().addClass('error');
			$('#msgCode_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_not_send);
			$('#msgCode_val').parents('section').find('.s_error_tip').show();

			$('#next_btn').attr('disabled',false);
			$('#next_btn').removeClass('disabled');
			return ;
		};

		//短信验证码是否为空
		if(ValidationUtils.isNull(msgCode)){
			$('#msgCode_val').parent().addClass('error');
			$('#msgCode_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.sms_code_not_null);
			$('#msgCode_val').parents('section').find('.s_error_tip').show();

			$('#next_btn').attr('disabled',false);
			$('#next_btn').removeClass('disabled');
			return ;
		};

		//后端短信验证码 和 图形验证码
		volidateImgAndMsgCode();
	});




	/*设置交易密码*/
	$('#setDealPwd_val').on('blur',function(){

		var pwd = $(this).val();

		if(ValidationUtils.isNull(pwd)){
			return ;
		}
		//格式是否正确
		if(!regDealPwd.test(pwd)){
			$('#setDealPwd_val').parent().addClass('error');
			$('#setDealPwd_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_format_wrong);
			$('#setDealPwd_val').parents('section').find('.s_error_tip').show();
			return ;
		}
	});

	/*确认交易密码*/
	$('#okDealPwd_val').on('blur',function(){

		var pwd = $(this).val(); 
		var _pwd = $('#setDealPwd_val').val();

		if(ValidationUtils.isNull(pwd)){
			return ;
		}
		//格式是否正确
		if(!regDealPwd.test(pwd)){
			$('#okDealPwd_val').parent().addClass('error');
			$('#okDealPwd_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_format_wrong);
			$('#okDealPwd_val').parents('section').find('.s_error_tip').show();
			return ;
		}
		//两次密码是否一致
		if(!ValidationUtils.isNull(_pwd) && pwd != _pwd){
			$('#okDealPwd_val').parent().addClass('error');
			$('#okDealPwd_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_ok_wrong);
			$('#okDealPwd_val').parents('section').find('.s_error_tip').show();
			return ;
		}
	});


	/*点击确定交易密码*/
	$('#setDealPwd_ok_btn').click(function(){
		var setpwd = $('#setDealPwd_val').val();
		var okpwd = $('#okDealPwd_val').val(); 

		$('#setDealPwd_val').parent().removeClass('error');
		$('#setDealPwd_val').parents('section').find('.s_error_tip').hide();

		$('#okDealPwd_val').parent().removeClass('error');
		$('#okDealPwd_val').parents('section').find('.s_error_tip').hide();

		$('#setDealPwd_ok_btn').attr('disabled',true);
		$('#setDealPwd_ok_btn').addClass("disabled").val('保存中...');

		//设置交易密码是否为空
		if(ValidationUtils.isNull(setpwd)){
			$('#setDealPwd_val').parent().addClass('error');
			$('#setDealPwd_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_no);
			$('#setDealPwd_val').parents('section').find('.s_error_tip').show();

			$('#setDealPwd_ok_btn').attr('disabled',false);
			$('#setDealPwd_ok_btn').removeClass("disabled").val('确定');
			return ;
		}
		//设置交易密码格式是否正确
		if(!regDealPwd.test(setpwd)){
			$('#setDealPwd_val').parent().addClass('error');
			$('#setDealPwd_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_format_wrong);
			$('#setDealPwd_val').parents('section').find('.s_error_tip').show();

			$('#setDealPwd_ok_btn').attr('disabled',false);
			$('#setDealPwd_ok_btn').removeClass("disabled").val('确定');
			return ;
		}
		//确认交易密码是否为空
		if(ValidationUtils.isNull(okpwd)){
			$('#okDealPwd_val').parent().addClass('error');
			$('#okDealPwd_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_ok_no);
			$('#okDealPwd_val').parents('section').find('.s_error_tip').show();

			$('#setDealPwd_ok_btn').attr('disabled',false);
			$('#setDealPwd_ok_btn').removeClass("disabled").val('确定');
			return ;
		}
		//确认交易密码格式是否正确
		if(!regDealPwd.test(okpwd)){
			$('#okDealPwd_val').parent().addClass('error');
			$('#okDealPwd_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.set_deal_pwd_format_wrong);
			$('#okDealPwd_val').parents('section').find('.s_error_tip').show();

			$('#setDealPwd_ok_btn').attr('disabled',false);
			$('#setDealPwd_ok_btn').removeClass("disabled").val('确定');
			return ;
		}
		//两次输入是否一致
		if(setpwd != okpwd){
			$('#okDealPwd_val').parent().addClass('error');
			$('#okDealPwd_val').parents('section').find('.s_error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.revise_login_pwd_ok_wrong);
			$('#okDealPwd_val').parents('section').find('.s_error_tip').show();

			$('#setDealPwd_ok_btn').attr('disabled',false);
			$('#setDealPwd_ok_btn').removeClass("disabled").val('确定');
			return ;
		}
		submitSetDealPwd(okpwd);
	});

});