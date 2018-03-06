/**
* 	对基础方法的封装。
*	formatMoney	格式化金额（如无设置则按照三位分割逗号，小数点后两位返回）
*/
function CommonValidationEmu(options){
	this.options = options;
	//枚举信息
	this.errorMsg = {

		mobile_no_already_in_use : 	'手机号码已注册',
		mobile_no_not_in_use : 	'手机号码未注册',
		mobile_no_wrong_format: 	'手机号码格式错误',
		mobile_no_not_null: 		'请输入手机号码',
		mobile_diff: 				'发送手机验证不符，请重新获取',
		mobile_and_pwd_worng:       '手机号码与密码不匹配',
		mobile_not_use:           '该手机号码已被禁用',

		password_not_null: 			'请输入登录密码',
		password_rule_tip: "6~20位字符，至少包含数字,字母(区分大小写),符号中的2种", 
		password_rule_tip_worng: "请输入6~20位字符，至少包含数字,字母(区分大小写),符号中的2种",
		password_repeat_null: 			'请确认登录密码',
		password_repeat_worng: 			'两次输入密码不一致',

		picture_validate_not_null: '请输入图形验证码',
		picture_validate_worng: '图形验证码错误',

		invat_code_worng:'好友邀请码错误',

		proco_agreement_weather:'请先阅读并同意《乐百贷用户协议》',

		sms_code_worng_format:'短信验证码错误',
		sms_code_locked:'手机号码被锁定，请明日再试',
		sms_code_not_null:'请输入短信验证码',
		sms_code_not_send:'请先获取短信验证码',
		sms_code_not_send_error:'短信验证码发送频繁，请稍后再试',
		smg_code_ip_limit:"设备被锁定，请明日再试",
		smg_code_user_limit:"短信验证码发送次数已达上限，请明日再试",

		loan_no_name: '请输入姓名',
		loan_name_wrong_format : '姓名为2~6个汉字',
		loan_no_mobile: '请输入手机号码',
		loan_no_money: '请输入借款金额',
		loan_no_format_money: '请输入1~2000内的整数',
		loan_no_city: '请输入常住城市',
		loan_city_wrong_format : '城市为2~10个汉字',
		loan_is_submited: '该手机号码已经申请贷款，请不要重复提交',


		recharge_no: '请输入充值金额',
		recharge_wrong_format: '充值金额必须为数字且最多到小数点后两位',
		recharge_kjcz_more_single: '快捷充值上线为“银行单笔限额”，超过上线请使用网银充值或分多次充值',
		recharge_wycz_more_single: '网银充值上线为“银行单笔限额”，超过上线请分多次充值',
		recharge_more_oneday: '快捷充值金额已达单日限额，请更换网银充值或明日充值',


		auth_name_no: "请输入真实姓名",
		auth_name_wrong_format:"真实姓名格式错误",
		auth_id_card_no: "请输入身份证号码",
		auth_id_card_wrong_format:"请输入正确的身份证号码",
		auth_id_card_is_used:"该身份证号码已被验证",
		auth_id_card_wrong_one:"同一账户每日可申请验证2次，您已输错1次，请核实身份证信息重新输入",
		auth_id_card_wrong_two:"由于您连续输错2次，请于明日重新操作验证。如有疑问，请联系客服400-898-6699",
		auth_id_card_less:"目前仅支持18岁以上用户实名认证",
		auth_id_and_name_wrong:"身份验证结果不一致",

		revise_login_pwd_old_no:"请输入原登录密码",
		revise_login_pwd_old_wrong:"原登录密码输入错误",
		revise_login_pwd_new_no:"请输入新登录密码",
		revise_login_pwd_new_wrong:"请输入6~20位字符，至少包含数字,字母(区分大小写),符号中的2种",
		revise_login_pwd_ok_no:"请确认登录密码",
		revise_login_pwd_ok_wrong:"两次输入的密码不一致",

		revise_mobile_no:"请输入新手机号码",

		set_deal_pwd_no:"请输入交易密码",
		set_deal_pwd_ok_no:"请确认交易密码",
		set_deal_pwd_format_wrong:"请输入6位纯数字",

		bind_email_no:"请输入邮箱地址",
		bind_new_email_no:"请输入新邮箱地址",
		bind_email_format_wrong:"邮箱地址格式错误",
		bind_email_is_used:"邮箱地址已存在",

		revise_deal_pwd_old_no:"请输入原交易密码",
		revise_deal_pwd_old_wrong:"原交易密码输入错误",
		revise_deal_pwd_new_no:"请输入新交易密码",
		revise_deal_pwd_new_wrong:"请输入6位纯数字",
		revise_deal_pwd_ok_no:"请确认交易密码",
		revise_deal_pwd_ok_wrong:"两次输入的密码不一致",
		revise_deal_pwd_old_no_set:"请先设置交易密码",

		bind_bank_card_no:"请输入银行借记卡号码",
		bind_bank_card_format_wrong:"请输入正确的银行借记卡号码",
		bind_bank_card_location_no:"请输入开户行支行名称",
		bind_bank_card_location_format_wrong:"请输入正确的开户行支行名称",
		bind_bank_card_is_used:"该卡已被绑定",

		withdraw_withdraw_no:"请输入提现金额",
		withdraw_withdraw_format_wrong:"提现金额最多到小数点后两位",
		withdraw_withdraw_gt:"提现金额不可大于可用金额",
		withdraw_deal_pwd_no:"请输入交易密码",
		withdraw_deal_pwd_wrong:"交易密码错误",
		withdraw_withdraw_gt5_wrong:"交易密码被锁定，请3小时后再操作"
	};
}
CommonValidationEmu.prototype = {
  	
};