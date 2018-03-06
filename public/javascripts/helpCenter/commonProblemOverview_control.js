//切换显示菜单
var changeCurrentMenu = function(urlPath,mId,urlParams){
	//避免URL缓存添加时间戳
	var timestamp = new Date().getTime();
	urlPath = urlPath + "?t="+timestamp;
	if(urlParams){
		urlPath = urlPath + urlParams;
	}
	//变更菜单显示
	acitveMenuHighLight(mId);
	$("#commonProblemView").load(urlPath,function() {
	});
};
//显示菜单变更动态效果
var acitveMenuHighLight = function(mId){
	if(!mId){
		return;
	}
	var top = $("#"+mId).find('p').offset().top-130;
	var that = $("#"+mId).find('p');
	$('#commonProblemMenu').find('p').removeClass('on');
	$('#problem_menu_slider').animate({'top':top+'px'},'fast',function(){
		that.addClass('on');
	});
};
$(document).ready(function() {
	/*去掉底部的固定定位*/
	$('.footer_bar').css('position','static');
	/*去掉主导航高亮样式*/
	$('#header_nav').find('li').removeClass('select');
	/*添加帮助中心高亮样式*/
	$("#nav_header_bar>li").eq(5).find('a').css('color','#ff6121');

	//加载菜单显示内容
	$("#commonProblemMenu").load('/helpCenter/commonProblemMenu');

	var v = $("#commonProblemViewParam").val();
	var m = $("#commonProblemMenuParam").val();
	if(v != "" && m != ""){
		//按照跳转参数选择加载视图
		changeCurrentMenu(v,m);
	}else{
		//默认加载账户总览
		changeCurrentMenu('/helpCenter/investmentProblem/investGuide','investGuide_sub_m_btn','&p=5245');
	};
});