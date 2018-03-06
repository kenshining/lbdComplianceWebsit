var Utils = new CommonUtils();
var ValidationUtils = new CommonValidationUtils();
var ValidationEmu = new CommonValidationEmu();

//发送邮件
function sendEmail(successFn){
	var email = $('#email_val').val().replace(/\s+/g,"");
	var serverUrl = $('#_serverUrl').val();
	var serverPort = $('#_serverPort').val();

	$.lbdAjax({
		url	:'/securitySetting/sendEmail',
		type:'POST',
		dataType:'JSON',
		data:{
			toUser:email,
			template:"bindEmail",
			content:JSON.stringify({"link":serverUrl+":"+serverPort+"/account/securitySetting/bindEmailResult?state=0"}),
			_csrf:$("#_csrf").val()
		},
		success:function(msg){

			$('#bind_email_btn').attr("disabled",false);
			$('#bind_email_btn').removeClass('disabled').val('发送验证邮件');

			//发送邮件成功
			if(msg.state == "SUCCESS"){
				var url = email.split('@')[1];
				$('.bindEmail_wrapper').hide();
				$('#bindEmailOk_wrapper').show();
				$('#email_url').html("激活邮件已发送至您的邮箱，请前往验证，接收邮箱："+email);
				$('#go_email_btn').click(function(){
					window.open('//mail.'+url);
				});
				if(successFn){
					successFn();
				}
			//发送邮件失败	
			}else{
				layer.msg("邮件发送失败");
			};
		},
		error:function(e){
			layer.msg("链接超时！");
			$('#bind_email_btn').attr("disabled",false);
			$('#bind_email_btn').removeClass('disabled').val('发送验证邮件');
		}
	});
}


$(document).ready(function(){

	/*文本框获取焦点和失去焦点样式*/
	$('input').not('input[type=button]')
	.on('focus',function(){
		$(this).parent().addClass('onfocus');
	})
	.on('blur',function(){
		$(this).parent().removeClass('onfocus');
	});

	//邮箱输入的模糊匹配
	$('#email_val').on('input',function(){
		var email_val = $(this).val();

		if(ValidationUtils.isNull(email_val)){
			$('#email_like_wrapper').hide();
		};
		$('#email_like_wrapper li').each(function(key,val){
			$(this).find('em').text(email_val);
		});
		$('#email_like_wrapper').show();
	});
	$(document).on('click',":not(.not)",function(){
		$('#email_like_wrapper').hide();
	});
	$('#email_like_wrapper').on('click','li',function(){
		var val = $(this).text();
		$('#email_val').val(val);
	});


	/*点击发送验证邮件*/
	$('#bind_email_btn').click(function(){
		var email = $('#email_val').val().replace(/\s+/g,"");

		$('#email_val').parent().removeClass('error');
		$('#emailError_tip').hide();

		$('#bind_email_btn').attr("disabled",true);
		$('#bind_email_btn').val('发送中...').addClass('disabled');

		//邮箱是否为空
		if(ValidationUtils.isNull(email)){
			$('#email_val').parent().addClass('error');
			$('#emailError_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.bind_email_no).show();

			$('#bind_email_btn').attr("disabled",false);
			$('#bind_email_btn').removeClass('disabled').val('发送验证邮件');
			return ;
		}

		//邮箱格式是否正确
		if(!ValidationUtils.isEmail(email)){
			$('#email_val').parent().addClass('error');
			$('#emailError_tip').html("<em class='icon icon-er'></em>"+ValidationEmu.errorMsg.bind_email_format_wrong).show();

			$('#bind_email_btn').attr("disabled",false);
			$('#bind_email_btn').removeClass('disabled').val('发送验证邮件');
			return ;
		}
		sendEmail();

	});

	/*重新发送*/
	$("#send_email_again").on('click',function(){
		sendEmail(function(){
			layer.msg('已重新发送邮件');
		});
	});
});