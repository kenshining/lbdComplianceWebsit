var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();
var timer = null ;
//身份证有效性的验证
function _checkIdCard(){
	var idCard = $('#auth_idCard_val').val().replace(/\s+/g,"");
	$.lbdAjax({
		url:"/securitySetting/validateIdCard",
		type:"POST",
		dataType:"JSON",
		data:{idCard:idCard,_csrf:$("#_csrf").val()},
		success:function(msg){

			$('#certification_btn').attr('disabled',false);
			$('#certification_btn').val("认证").removeClass('disabled');

			//接口返回数据成功
			if(msg.state == 'SUCCESS'){
				//小于18岁
				if(msg.data.gt18 == false){
					$('#auth_idCard_val').parent().addClass('error');
					$('#auth_idCard_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.auth_id_card_less);
					$('#auth_idCard_val').parents('section').find('.error_tip').show();
				}
				//身份证号码不可用
				if(msg.data.idCard == false){
					$('#auth_idCard_val').parent().addClass('error');
					$('#auth_idCard_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.auth_id_card_wrong_format);
					$('#auth_idCard_val').parents('section').find('.error_tip').show();
				}
				//身份证号合法，进行平台的实名验证
				if(msg.data.idCard == true && msg.data.gt18 == true){
					checkNameAndIdCard();
				}
			//接口返回数据错误
			}else{
				layer.msg(JSON.stringify(e));
			}
		},
		error:function(e){
			layer.msg(JSON.stringify(e));
		}
	});
};

//平台实名认证
function checkNameAndIdCard(){

	var name = $('#auth_name_val').val().replace(/\s+/g,"");
	var idCard = $('#auth_idCard_val').val().replace(/\s+/g,"");
	
	$.lbdAjax({
		url:"/securitySetting/validateRealName",
		type:"GET",
		dataType:"JSON",
		data:{idCard:idCard,name:name,_csrf:$("#_csrf").val()},
		success:function(msg){
			//实名认证失败
			if(msg.state == "FAIL" && msg.message != ""){
				$('#auth_idCard_val').parent().addClass('error');
				$('#auth_idCard_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+msg.message);
				$('#auth_idCard_val').parents('section').find('.error_tip').show();

				$('#certification_btn').attr('disabled',false);
				$('#certification_btn').val("认证").removeClass('disabled');
				return;
			}
			//实名认证成功
			if(msg.state == "SUCCESS"){
				//2.成功弹框
				var Dialog = $.dialog({
						dialogDom:'<div class="icon icon-ok"></div><p class="orange">恭喜您，实名认证成功！</p>',
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
			}
		},
		//接口调用失败
		error:function(e){
			layer.msg(JSON.stringify(e));
		}
	});
};

$(document).ready(function(){
	/*检测姓名格式正则表达式：全部是汉字*/
	var regName = /^[\u4e00-\u9fa5]+$/;

	/*文本框获取焦点和失去焦点样式*/
	$('input').not('input[type=button]')
	.on('focus',function(){
		$(this).parent().addClass('onfocus');
	})
	.on('blur',function(){
		$(this).parent().removeClass('onfocus');
	});

	/*文本框输入时错误飘窗隐藏*/
	$('input').on('input',function(){
		$(this).parent().removeClass('error');
		$(this).parents('section').find('.error_tip').hide();
	});

	/*姓名输入框失去焦点验证*/
	$('#auth_name_val').on('blur',function(){
		var name = $('#auth_name_val').val().replace(/\s+/g,"");

		$('#auth_name_val').parent().removeClass('error');
		$('#auth_name_val').parents('section').find('.error_tip').hide();

		if(ValidationUtils.isNull(name)){
			return ;
		}
		//姓名格式是否正确
		if(!regName.test(name)){
			$('#auth_name_val').parent().addClass('error');
			$('#auth_name_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.auth_name_wrong_format);
			$('#auth_name_val').parents('section').find('.error_tip').show();
			return ;
		}
	});

	/*身份证号输入框失去焦点验证*/
	$('#auth_idCard_val').on('blur',function(){
		var idCard = $(this).val();

		$('#auth_idCard_val').parent().removeClass('error');
		$('#auth_idCard_val').parents('section').find('.error_tip').hide();

		if(ValidationUtils.isNull(idCard)){
			return ;
		}

		//身份证号格式是否正确
		if(!ValidationUtils.checkIdCard(idCard)){
			$('#auth_idCard_val').parent().addClass('error');
			$('#auth_idCard_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.auth_id_card_wrong_format);
			$('#auth_idCard_val').parents('section').find('.error_tip').show();
			return ;
		}

	});

	/*点击实名认证*/
	$('#certification_btn').click(function(){
		var name = $('#auth_name_val').val().replace(/\s+/g,"");
		var idCard = $('#auth_idCard_val').val().replace(/\s+/g,"");
		
		//按钮置灰，不可用状态
		$('#certification_btn').attr('disabled',true);
		$('#certification_btn').val("认证中...").addClass('disabled');

		//隐藏所以错误飘窗
		$('input').parent().removeClass("error");
		$('.error_tip').hide();

		/*前端验证*/
		//姓名是否为空
		if(ValidationUtils.isNull(name)){
			$('#auth_name_val').parent().addClass('error');
			$('#auth_name_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.auth_name_no);
			$('#auth_name_val').parents('section').find('.error_tip').show();

			$('#certification_btn').attr('disabled',false);
			$('#certification_btn').val("认证").removeClass('disabled');
			return ;
		}
		//姓名格式是否正确
		if(regName.test(name) == false){
			$('#auth_name_val').parent().addClass('error');
			$('#auth_name_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.auth_name_wrong_format);
			$('#auth_name_val').parents('section').find('.error_tip').show();

			$('#certification_btn').attr('disabled',false);
			$('#certification_btn').val("认证").removeClass('disabled');
			return ;
		}
		//身份证号是否为空
		if(ValidationUtils.isNull(idCard)){
			$('#auth_idCard_val').parent().addClass('error');
			$('#auth_idCard_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.auth_id_card_no);
			$('#auth_idCard_val').parents('section').find('.error_tip').show();

			$('#certification_btn').attr('disabled',false);
			$('#certification_btn').val("认证").removeClass('disabled');
			return ;
		}
		//身份证号格式是否正确
		if(!ValidationUtils.checkIdCard(idCard)){
			$('#auth_idCard_val').parent().addClass('error');
			$('#auth_idCard_val').parents('section').find('.error_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.auth_id_card_wrong_format);
			$('#auth_idCard_val').parents('section').find('.error_tip').show();

			$('#certification_btn').attr('disabled',false);
			$('#certification_btn').val("认证").removeClass('disabled');
			return ;
		}

		/*后端矫正*/
		//身份证号码验证
		_checkIdCard();
	});
});