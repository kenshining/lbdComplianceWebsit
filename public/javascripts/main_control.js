//退出系统
var logout = function(backURL){
	$.lbdAjax({
		url	:'/user/logout',
		type:'GET',
		dataType:'JSON',
		data:{},
		success:function(msg){
			if(backURL){
				window.location.href = backURL;
			}else{
				window.location.reload();
			}
		},
		error:function(msg){

		}
	});
};
//更新用户余额
var refreshAccountBanlance = function(container,disformatContainer){
	$.lbdAjax({
		url	:'/user/banlance',
		type:'POST',
		dataType:'JSON',
		data:{_csrf:$("#_csrf").val()},
		success:function(msg){
			var banlance=new String(msg.msg.data.balance).formatMoney();
			if(container){  
				$("#"+container).html(banlance);
			}
			if(disformatContainer){
				$("#"+disformatContainer).html(banlance);
			} 
		},
		error:function(msg){
			layer.msg(JSON.stringify(msg));
		}
	}); 
};

//刷新用户优惠卷
var refreshAccountCoupon = function(container,containerLength,userId){ 
	$.lbdAjax({
		url	:'/investment/userCoupon',
		type:'GET',
		dataType:'JSON',
		data:{userId:userId},
		success:function(msg){ 
			bonusLength=msg.data.number; 
			if(container){
				$("#"+container).html(bonusLength); 
			} 
		},
		error:function(msg){ 
			layer.msg(JSON.stringify(msg.message));  
		}
	}); 
};

//检测用户登录有效性
var validateUserValid = function(callBackFunction,errorFunction){
	$.lbdAjax({
		url	:'/user/validateUserActive',
		type:'GET',
		dataType:'JSON',
		data:{},
		success:function(msg){
			callBackFunction(msg);
		},
		error:function(msg){
			errorFunction(msg);
		}
	});
};

//检测用户认证状态
var validateUserValidAuthenticateType = function(callBackFunction,errorFunction){
	$.lbdAjax({
		url	:'/account/user/auth',
		type:'POST',
		dataType:'JSON',
		data:{_csrf:$("#_csrf").val()},
		success:function(msg){ 
			callBackFunction(msg);
		},
		error:function(msg){
			if(errorFunction){
				errorFunction(msg);
			}
		}
	});
};

//获取绑卡信息
var getUserBindBankCardInfo = function(callBackFunction,errorFunction){
	$.lbdAjax({
		url	:'/account/bindBankCard',
		type:'POST',
		dataType:'JSON',
		data:{_csrf:$("#_csrf").val()},
		success:function(msg){ 
			callBackFunction(msg);
		},
		error:function(msg){
			if(errorFunction){
				errorFunction(msg);
			}
		}
	});
}

//获取常见问题列表
var getCommonProblems = function(type,callBackFunction,errorFunction){
	$.lbdAjax({
		url	:'/helpCenter/CommonProblem',
		type:'POST',
		dataType:'JSON',
		data:{typeCode:type,_csrf:$("#_csrf").val()},
		success:function(msg){ 
			callBackFunction(msg);
		},
		error:function(msg){
			if(errorFunction){
				errorFunction(msg);
			}
		}
	});
}
