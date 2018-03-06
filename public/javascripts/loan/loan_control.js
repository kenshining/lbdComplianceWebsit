
var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();
//错误提示文字隐藏
var errorHide = function(){
	$('#loan_error_tip').addClass('hide_op');
	$('.input_wrapper').removeClass('error');
}
//错误提示文字显现
var errorShow = function(tip,that){
	$('#loan_error_tip').removeClass('hide_op').text(tip);
	$('.input_wrapper').removeClass('error');
	that.parents('.input_wrapper').addClass('error');
}
//获取图形验证码
var getImgCode = function (){
	$.lbdAjax({
		url	:'/loan/loanImgCode',
		type:'GET',
		dataType:'JSON',
		data:{_csrf:$("#_csrf").val()},
		success:function(msg){
			//图形验证码获取成功，显示验证码
			if(msg.status){
				$("#loan_imgCode").attr("src","data:image/png;base64,"+msg.validateCodeImg);
			}else{
				//获取验证码失败
				layer.msg("获取验证码失败！");
			};
		}
	});
}
//贷款申请提交
var loanSubmit = function(){
	var name = $('#loan_name').val();
	var mobile = $('#loan_mobile').val().replace(/\s+/g,'');
	var money = $('#loan_money').val().trim();
	var imgCode = $('#loan_img_code').val();
	var city = $('#loan_city').val();

	$.lbdAjax({
		url	:'/loan/loanSubmit',
		type:'POST',
		dataType:'JSON',
		data:{name:name,mobile:mobile,money:money,city:city,loanImgCode:imgCode,_csrf:$("#_csrf").val()},
		beforeSend:function(){
			$('#loan_regist_submit').attr('disalbed',true).addClass('disalbed').val('提交中...');
		},
		complete:function(){
			$('#loan_regist_submit').attr('disalbed',false).removeClass('disalbed').val('立即申请');
		},
		success:function(msg){
			//验证码错误
			if(msg.status == false && msg.msg == 'imgCode'){
				errorShow(ValidationEmu.errorMsg.picture_validate_worng,$('#loan_img_code'));
				getImgCode();
			//申请重复提交
			}else if(msg.status == false){
				//根据情况判断返回错误
				getImgCode();
				if(msg.errorMsg && msg.errorMsg.data && msg.errorMsg.data.appAmount){
					errorShow(msg.errorMsg.data.appAmount,$('#loan_mobile'));
				}else if(msg.errorMsg && msg.errorMsg.data && msg.errorMsg.data.appMobile){
					errorShow(msg.errorMsg.data.appMobile,$('#loan_money'));
				}else if(msg.errorMsg && msg.errorMsg.data && msg.errorMsg.data.cityName){
					errorShow(errorMsg.data.cityName,$('#loan_city'));
				}else if(msg.errorMsg && msg.errorMsg.data && msg.errorMsg.data.appName){
					errorShow(msg.errorMsg.data.appName,$('#loan_name'));return;
				}else{
					$('#loan_error_tip').removeClass('hide_op').text(msg.errorMsg.message);
				}
			//提交成功
			}else{
				var Dialog = 
					$.dialog({
						dialogDom:'<div class="dialog_close_btn icon-zh-close"></div><div class="ok icon-ok"></div><p class="orange">恭喜您，提交资料成功！</p><p class="orange">我们将尽快联系您！</p><p class="">您可以在 <a href="/account/accountOverview?v=/account/maintain/overview&m=overview_sub_m_btn">我的账户</a> 了解借款进度 或 去 <a href="/">首页</a> 了解更多乐百贷信息</p>',
						className:'loan_dialog_wrapper',
						isClose:false
					});
				$('.dialog_close_btn').click(function(){
					Dialog.close();
				});
				//提交成功后需要清空表单内容
				$('#loan_name').val('');
				$('#loan_mobile').val('');
				$('#loan_money').val('');
				$('#loan_img_code').val('');
				$('#loan_city').val('');
			}
		}
	});
}
//验证图形验证码是否正确
var checkImgCode = function(){
	var imgCode = $('#loan_img_code').val();
	$.lbdAjax({
		url	:'/loan/checkLoanImgCode',
		type:'POST',
		dataType:'JSON',
		data:{loanImgCode:imgCode,_csrf:$("#_csrf").val()},
		success:function(msg){
			if(msg.status){
				//贷款申请提交
				loanSubmit();
			}else{
				errorShow(ValidationEmu.errorMsg.picture_validate_worng,$('#loan_img_code'));
				getImgCode();
				return;
			}
		}
	});
}
//贷款申请提交验证
var loanSubmitCheck = function(){
	
	var name = $('#loan_name').val();
	var mobile = $('#loan_mobile').val().replace(/\s+/g,'');
	var money = $('#loan_money').val().trim();
	var imgCode = $('#loan_img_code').val();
	var city = $('#loan_city').val();

	//姓名是否为空
	if(ValidationUtils.isNull(name)){
		errorShow(ValidationEmu.errorMsg.loan_no_name,$('#loan_name'));
		return;
	}
	//姓名是否为2~6个的汉字
	if(!ValidationUtils.isName(name)){
		errorShow(ValidationEmu.errorMsg.loan_name_wrong_format,$('#loan_name'));
		return;
	}
	//手机号码是否输入
	if(ValidationUtils.isNull(mobile)){
		errorShow(ValidationEmu.errorMsg.loan_no_mobile,$('#loan_mobile'));
		return;
	}
	//手机号码格式是否正确
	if(!ValidationUtils.checkMobileNo(mobile)){
		errorShow(ValidationEmu.errorMsg.mobile_no_wrong_format,$('#loan_mobile'));
		return;
	}
	//借款金额是否为空
	if(ValidationUtils.isNull(money)){
		errorShow(ValidationEmu.errorMsg.loan_no_money,$('#loan_money'));
		return;
	}
	//借款金额格式是否正确
	if(money<1 || money>2000 || !ValidationUtils.isNumber(money) || isNaN(money)){
		errorShow(ValidationEmu.errorMsg.loan_no_format_money,$('#loan_money'));
		return;
	}
	//常住城市是否为空
	if(ValidationUtils.isNull(city)){
		errorShow(ValidationEmu.errorMsg.loan_no_city,$('#loan_city'));
		return;
	}
	//常住城市名称格式验证
	if(!ValidationUtils.isCityName(city)){
		errorShow(ValidationEmu.errorMsg.loan_city_wrong_format,$('#loan_city'));
		return;
	}
	//图形验证码是否为空
	if(ValidationUtils.isNull(imgCode)){
		errorShow(ValidationEmu.errorMsg.picture_validate_not_null,$('#loan_img_code'));
		return;
	}
	//图形验证码是否正确
	checkImgCode();

}

$(document).ready(function(){
	//头部导航的高亮样式
	$('#header_nav').find('li').removeClass('select').end().find('#nav_header_loan_sub').addClass('select');

	/*设置页面min-height*/
	var pageH = $('.loan_page_wrapper').height()+260;
	$('.loan_page_wrapper').css('min-height',pageH+'px');

	//获取焦点和失去焦点时的样式变化
	$('.loan_application_wrapper input').not('input[type=button]')
		.on('focus',function(){
			$(this).parent().addClass('onfocus');
		})
		.on('blur',function(){
			$(this).parent().removeClass('onfocus');
		});

	//初始化图形验证码
	getImgCode();

	//点击切换图形验证码
	$('#loan_imgCode').click(function(){
		getImgCode();
	});

	//姓名验证
	$('#loan_name').blur(function(){
		var name = $(this).val();
		if(ValidationUtils.isNull(name)){
			return;
		}
		//姓名格式验证
		if(!ValidationUtils.isName(name)){
			errorShow(ValidationEmu.errorMsg.loan_name_wrong_format,$('#loan_name'));
		}else{
			errorHide();
		}
	})

	//手机号码格式转化
	$('#loan_mobile').focus(function(){
		$(this).val($(this).val().replace(/\s+/g,''));
	});
	$('#loan_mobile').blur(function(){
		var mobile = $(this).val();
		if(mobile.length == 11){
			$(this).val(Utils.formatTel(mobile.trim()));
		}
		//手机号码为空时不验证格式
		if(ValidationUtils.isNull(mobile)){
			return;
		}
		//手机号码不为空时，验证格式是否正确
		if(!ValidationUtils.checkMobileNo(mobile)){
			errorShow(ValidationEmu.errorMsg.mobile_no_wrong_format,$('#loan_mobile'));
		}else{
			errorHide();
		}
	});

	//借款金额验证
	$('#loan_money').blur(function(){
		var money = $(this).val();
		var _money = money.replace(/^(0+)([0-9]+)/g,function(a,b,c){
			return c;
		});
		$(this).val(_money);
		if(ValidationUtils.isNull(money)){
			return;
		}
		//借款金额格式
		if(money<1 || money>2000 || !ValidationUtils.isNumber(money) || isNaN(money)){
			errorShow(ValidationEmu.errorMsg.loan_no_format_money,$('#loan_money'));
			return;
		}else{
			errorHide();
		}
	});

	//城市名称验证
	$('#loan_city').blur(function(){
		var city = $(this).val();
		if(ValidationUtils.isNull(city)){
			return;
		}
		//城市名称格式验证
		if(!ValidationUtils.isCityName(city)){
			errorShow(ValidationEmu.errorMsg.loan_city_wrong_format,$('#loan_city'));
		}else{
			errorHide();
		}
	})

	//贷款申请提交
	$('#loan_regist_submit').click(function(){
		errorHide();
		loanSubmitCheck();
	});
})