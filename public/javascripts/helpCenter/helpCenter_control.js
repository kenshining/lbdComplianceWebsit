function reviseBindBankCard(){
	var Dialog = $.dialog({
			dialogDom:'<h2 class="dia_title">温馨提示</h2><p>请致电400-898-6699，联系客服确认换卡事宜，提交换卡资料。 客服服务时间，周一到周六9:00~18:00。</p><p class="gary">温馨提示：换卡需人工审核，并提交第三方***支付审核确认。换卡周期较 长，请确认是否需要换卡并耐心等待。</p><a class="btn" id="dialog_close_btn">知道了</a>',
			className:'msgSetting_dialog_wrapper dia_wrapper reviseBankCard_dailog',
			isClose:false
		});
};
$(document).ready(function() {
	/*去掉主导航高亮样式*/
	$('#header_nav').find('li').removeClass('select');
	/*添加帮助中心高亮样式*/
	$("#nav_header_bar_helpCenter").css('color','#ff6121');
});