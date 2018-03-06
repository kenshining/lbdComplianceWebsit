var common=new CommonUtils();
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
	$("#aboutUsView").load(urlPath,function() {
	}); 
};
//显示菜单变更动态效果
// var acitveMenuHighLight = function(mId){
// 	if(!mId){
// 		return;
// 	}
// 	var top = $("#"+mId).find('p').offset().top-276;
// 	var that = $("#"+mId).find('p');
// 	$('#aboutUsMenu').find('p').removeClass('on');
// 	$('#menu_slider').animate({'top':top+'px'},'fast',function(){
// 		that.addClass('on');
// 	});
// }; 
var acitveMenuHighLight = function(mId){
	if(!mId){
		return;
	}  
	var top=$("#"+mId).parent('li').position()==undefined?0:$("#"+mId).parent('li').position().top; 
	$('.menuBack').animate({'top':top+'px'},'fast',function(){
		$("#"+mId).addClass('selected').parent('li').siblings().find('a').removeClass('selected');
	});

};

$(document).ready(function() {

	/*去掉底部的固定定位*/
	$('.footer_bar').css('position','static');

	//加载菜单显示内容
	$("#aboutUsMenu").load('/aboutUs/aboutUsMenu');

	 
	var v = $("#aboutUsViewParam").val();
	var m = $("#aboutUsMenuParam").val();

	var type=common.getUrlParams('type');
	var id=common.getUrlParams('id'); 
	if(v != "" && m != "" && type == 'null'){
		//按照跳转参数选择加载视图
		changeCurrentMenu(v,m);
	}else if(v != "" && m != "" && type != "" && id != ""){
		var url=v+'?id='+id+'&type='+type; 
		changeCurrentMenu(url,m);
	}else{
		//默认加载账户总览
		changeCurrentMenu('/aboutUs/companyProfile','menuCompanyProfile','&p=5245');
	};

	//变更主菜单样式   
	$('#header_nav').find('li').removeClass('select').end().find('#nav_header_aboutUsOverview_sub').addClass('select');
	
});