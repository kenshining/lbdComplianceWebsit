var REVERS_ECOUNT_TIMER_HANDLER;
var REVERS_ECOUNT_TIMER_HANDLER_TWO;
//切换显示菜单
var changeCurrentMenu = function(urlPath,mId,urlParams){
	//避免URL缓存添加时间戳
	var timestamp = new Date().getTime();
	urlPath = urlPath + "?t="+timestamp;
	if(urlParams){
		urlPath = urlPath + urlParams;
	}
	//检测用户是否还在有效期范围内
	validateUserValid(
	function(successMsg){
		if(successMsg && successMsg.status === 'ok'){
			//变更菜单显示 
			acitveMenuHighLight(mId);
			$("#accountView").load(urlPath,function() {
			});
		}else{
			logout("/user/login");
		}

	},function(errorMsg){
		layer.msg(errorMsg);
	});
};
//显示菜单变更动态效果
var acitveMenuHighLight = function(mId){
	if(!mId){
		return;
	}
	// var offetTop = $("#"+mId).find('p').offset().top-276;
	var top=$("#"+mId).find('p').position().top;
	var that = $("#"+mId).find('p');
	$('#accountMenu').find('p').removeClass('on');
	$('#menu_slider').animate({'top':top+'px'},'fast',function(){
		that.addClass('on');
	});
};
//头部认证提示信息
var authenticateInfo =[
	["手机已认证","立即认证","实名后绑卡","绑卡后开通",""], 
	["手机已认证","已完成实名认证","立即绑卡","绑卡后开通",""],
	["手机已认证","已完成实名认证","已绑定银行卡","立即开通存管账户",""],
	["手机已认证","已完成实名认证","已绑定银行卡","已开通存管账户",""]
];
//头部认证，安全级别部分
var topBarAuthenticate = function(){
	validateUserValidAuthenticateType(function(e){	
		if(e.status === true){

			var authenticateWrap = $('#authenticate');
			var leave = e.msg.leave;
			var authMax = e.msg.auth;
			
			//安全等级
			$('.account_safety_wrapper').hide().eq(leave-1).show();


			var nextauthIdx = 1;

			//步骤认证：手机-实名-绑卡-存管
			if(authMax.indexOf(2) == -1){
				addIconTipText(0);
				nextauthIdx = 1;
			}else if(authMax.indexOf(3) == -1){
				addIconTipText(1);
				nextauthIdx = 2;
			}else if(authMax.indexOf(4) == -1){
				addIconTipText(2);
				nextauthIdx = 3;
			}

			//交易密码设置
			if(authMax.indexOf(5) == -1){
				$('#authenticate_pwd').find('.float').html('立即设置交易密码');
				addEventSetDealPwd();
			}else{
				$('#authenticate_pwd').find('.float').html('已设置交易密码');
				$('#authenticate_pwd').find('.icon').removeClass('icon-zh-account-topB5').addClass('icon-zh-account-topA5');
			}
			
			addEvents(nextauthIdx);

			//认证图标和文字
			function addIconTipText(idx){
				$('#authenticate>li').each(function(key,val){
					$(this).find('.float').html(authenticateInfo[idx][key]);
					$(this).find('.icon').addClass('icon-zh-account-topB'+(key+1));		
				});
				for(var i in authMax){
					$('#authenticate>li').eq(authMax[i]-1).find('.icon').removeClass('icon-zh-account-topB'+(authMax[i])).addClass('icon-zh-account-topA'+(authMax[i]));
					$('#authenticate>li').eq(authMax[i]-1).find('.float').addClass('done');
				};
				
			};
			//事件绑定
			function addEvents(nextauthIdx){
				//滑过事件
				authenticateWrap.on('mouseover','li',function(){
					var idx = $(this).index();

					authenticateWrap.find('.float').hide();
					$(this).find('.float').show();

					if(idx == nextauthIdx){
						$(this).addClass('hover');
						$(this).find('.icon').addClass('icon-zh-account-topH'+(nextauthIdx+1));
					};
				}).on('mouseout','li',function(){
					var idx = $(this).index();

					$(this).find('.float').hide();

					if(idx == nextauthIdx){
						$(this).removeClass('hover');
						$(this).find('.icon').removeClass('icon-zh-account-topH'+(nextauthIdx+1));
					};
				});

				//点击事件，跳转
				authenticateWrap.find('li').eq(nextauthIdx).click(function(){
					var href = $(this).attr('data-href');
					changeCurrentMenu(href,'securitySetting_sub_m_btn');
				});
			};
			//设置交易密码
			function addEventSetDealPwd(){
				$('#authenticate_pwd').click(function(){
					var href = $(this).attr('data-href');
					changeCurrentMenu(href,'securitySetting_sub_m_btn');
				}).mouseover(function(){
					$(this).addClass('hover');
					$(this).find('.icon').addClass('icon-zh-account-topH5');
				}).mouseout(function(){
					$(this).removeClass('hover');
					$(this).find('.icon').removeClass('icon-zh-account-topH5');
				});
			};
		};
	},function(e){
		//layer.msg(JSON.stringify(e));
	});
};
//头部js
function topBarControl(){
	//获取用户认证信息
	topBarAuthenticate();
	//可用余额
	refreshAccountBanlance("topBar_balance");
	
};
$(document).ready(function() {

	//头部导航的高亮样式
	$('#header_nav').find('li').removeClass('select').end().find('#nav_header_accountOverview_sub').addClass('select');

	/*去掉底部的固定定位*/
	$('.footer_bar').css('position','static');

	//加载菜单显示内容
	$("#accountMenu").load('/account/accountMenu');

	//加载头部
	$("#accountBasicTopBar").load('/account/accountBasicTopBar','',function(response,status,xhr){
		topBarControl();
	});
	var v = $("#accountViewParam").val();
	var m = $("#accountMenuParam").val();
	if(v != "" && m != ""){
		//按照跳转参数选择加载视图
		changeCurrentMenu(v,m);
	}else{
		//默认加载账户总览
		changeCurrentMenu('/account/maintain/overview','overview_sub_m_btn','&p=5245');
	};
});
