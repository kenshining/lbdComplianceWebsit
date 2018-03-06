$(document).ready(function(){
	//检测用户认证状态
	validateUserValidAuthenticateType(function(msg){
		var authArr = msg.msg.auth;
		//手机号认证
		if(msg.status && authArr.indexOf(1) == -1){
			
		}
		//实名认证
		if(msg.status && authArr.indexOf(2) == -1){
			$('#auth_username').find('.state_no').show();
			$('#auth_username').find('.go').show();
		}else{
			$('#auth_username').find('.state_ok').show();
			$('#auth_username').find('.green').show();
		}
		//绑卡认证
		if(msg.status && authArr.indexOf(2) == -1 && authArr.indexOf(3) == -1){
			$('#auth_bankcard').find('.state_no').show();
			$('#auth_bankcard').find('.cannot').show();
		}else if(msg.status && authArr.indexOf(2) != -1 && authArr.indexOf(3) == -1){
			$('#auth_bankcard').find('.state_no').show();
			$('#auth_bankcard').find('.go').show();
		}else{
			//已经绑卡，显示银行卡号尾号和所属银行
			$('#auth_bankcard').find('.state_ok').show();
			$('#auth_bankcard').find('.revise').show();

			getUserBindBankCardInfo(function(e){
				if(e.state == "SUCCESS"){
					var bankNo = e.data[0].bankNo;
					var bankName = e.data[0].bankCard.bankName;
					$('#auth_bankcard .note').html(bankName+'，尾号'+bankNo);
				}
			},function(e){

			});
		}

		//存管认证
		if(msg.status && authArr.indexOf(3) == -1 && authArr.indexOf(4) == -1){
			$('#auth_cg').find('.state_no').show();
			$('#auth_cg').find('.cannot').show();
		}else if(msg.status && authArr.indexOf(3) != -1 && authArr.indexOf(4) == -1){
			$('#auth_cg').find('.state_no').show();
			$('#auth_cg').find('.go').show();
		}else{
			$('#auth_cg').find('.state_ok').show();
			$('#auth_cg').find('.green').show();
		}
		
		//设置交易密码
		if(msg.status && authArr.indexOf(5) == -1){
			$('#auth_deal').find('.state_no').show();
			$('#auth_deal').find('.go').show();
		}else{
			$('#auth_deal').find('.state_ok').show();
			$('#auth_deal').find('.revise').show();
			$('#auth_deal').find('.findpwd').show();
		}
		
		//邮箱认证
		/*if(msg.status && authArr.indexOf(6) == -1){
			$('#auth_email').find('.state_no').show();
			$('#auth_email').find('.go').show();
		}else{
			$('#auth_email').find('.state_ok').show();
			$('#auth_email').find('.revise').show();
		}*/
	},function(msg){
		layer.msg(JSON.stringify(msg));
	});

	//修改银行卡
	$('#revise_bindBankCard').click(function(){
		var Dialog = $.dialog({
				dialogDom:'<h2 class="dia_title">温馨提示</h2><p>请致电400-898-6699，联系客服确认换卡事宜，提交换卡资料。 客服服务时间，周一到周六9:00~18:00。</p><p class="gary">温馨提示：换卡需人工审核，并提交第三方***支付审核确认。换卡周期较 长，请确认是否需要换卡并耐心等待。</p><a class="btn" id="dialog_close_btn">知道了</a>',
				className:'msgSetting_dialog_wrapper dia_wrapper reviseBankCard_dailog',
				isClose:false
			});
	});
});