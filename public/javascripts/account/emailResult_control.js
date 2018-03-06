//获取地址栏目标参数
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null){
     	return  unescape(r[2]);
     }else{
		return null;
     }
};

$(document).ready(function(){
	var _able = $('#_able').val();
	var email = $('#_email').val();
	var state = GetQueryString("state");

	/*链接是否过期*/

	if(_able == "true"){
		//检测认证结果
		$.lbdAjax({
			url	:'/securitySetting/emailResult',
			type:'POST',
			dataType:'JSON',
			data:{
				email:email,
				_csrf:$("#_csrf").val()
			},
			success:function(e){
				if(e.state == "SUCCESS"){
					//bind
					if(state == 0){
						$('#result_set_ok').show();
					}
					//changes
					if(state == 1){
						$('#result_revise_ok').show();
					}
				}else{
					$('#result_isUsed').show();
				}
			},
			error:function(e){
				layer.msg(JSON.stringify(e));
			}
		});
	}else{
		$('#result_overdue').show();
		console.log(0)
	}
});