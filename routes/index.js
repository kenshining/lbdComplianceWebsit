var express = require('express');
var async = require('async');
var mainService = require('../services/MainService');
var serviceEnumeration = require('../services/ServiceEnumeration');
var tools = require('../lib/tools');
var config=require('../config/config.json');

//监控与错误日志
var monitorRotes = require("./monitor");
//用户与用户管理
var userAccountRoutes = require("./userAccount");
//我要投资
var investmentRoutes = require("./investment");
//我要借款
var loanRoutes = require("./loan");
//账户管理
var accountRotes = require("./account");
	//账户中心-账户中心
	var maintainRotes = require("./account/maintain");
	//账户中心-投资管理
	var accountInvestRotes = require("./account/investment");
	//账户中心-借款管理
	var accountLoanRotes = require("./account/loan");
	//账户中心-邀请好友
	var accountInviteRotes = require("./account/invite");
	//账户中心-奖励管理
	var accountBonusRotes = require("./account/bonus");
	//账户中心-资金管理
	var chargeManagementRotes = require("./account/chargeManagement");
	//账户中心-安全设置
	var accountSecuritySetting = require("./account/securitySetting");
//关于我们
var aboutUs=require("./aboutUs");
//安全保障
var insurance=require("./insurance");
//帮助中心
var helpCenter = require("./helpCenter");
//新手指引
var noviceGuide = require("./noviceGuide");
//运营数据
var operationData = require("./operationData");

module.exports = function(app,logInfo,keywords){
	//init service instace
	var serviceInstance = mainService.init();
	//init serverside enumerations service instance
	var serviceEnumerationInstance = serviceEnumeration.init();

	app.get("/",function(req,res,next){
		async.parallel([
			function(resultCallBackFun){
				//获取首页用户数据
				if(req.session && req.session.user){
					resultCallBackFun(null,{user:req.session.user});
				}else{
					resultCallBackFun(null,{user:null});
				}
			},function(resultCallBackFun){
				//获取平台公告列表
				serviceInstance.callServer({page:1,rows:1,sort:""},function(msg){
					resultCallBackFun(null,{announcementList:msg});
				},function(msg){
					//接口的失败回调
					resultCallBackFun(null,{announcementList:msg});
				},serviceEnumerationInstance.MEDIA_NOTICE_LIST,"POST");
			},
			function(resultCallBackFun){
				//获取首页投资统计
				serviceInstance.callServer({},function(msg){
					resultCallBackFun(null,{acount:msg});
				},function(msg){
					//接口的失败回调
					resultCallBackFun(null,{acount:msg});
				},serviceEnumerationInstance.INVESTMENT_COUNT_TAB,"POST");
			},
			function(resultCallBackFun){
				//获取首页banner条数据
				serviceInstance.callServer({},function(msg){
					resultCallBackFun(null,{banner:msg});
				},function(msg){
					//接口的失败回调
					resultCallBackFun(null,{banner:msg});
				},serviceEnumerationInstance.BANNER_PC,"POST");
			},
			function(resultCallBackFun){
				//获取首页投资产品列表
				serviceInstance.callServer({},function(msg){
					console.log('成功'+msg.data.content)
					resultCallBackFun(null,{investmentList:msg});
				},function(msg){
					//接口的失败回调
					resultCallBackFun(null,{investmentList:msg});
				},serviceEnumerationInstance.INVESTMENT_INVESTMSG,"POST");
			},
			function(resultCallBackFun){
				//获取首页媒体报道列表
				serviceInstance.callServer({page:1,rows:3},function(msg){
					resultCallBackFun(null,{mediaNews:msg});
				},function(msg){
					//接口的失败回调
					resultCallBackFun(null,{mediaNews:msg});
				},serviceEnumerationInstance.MEDIA_NEWS_LIST,"POST");
			},
			function(resultCallBackFun){
				//获取首页公司动态报道列表
				serviceInstance.callServer({page:1,rows:3},function(msg){
					resultCallBackFun(null,{campanyDynamic:msg});
				},function(msg){
					//接口的失败回调
					resultCallBackFun(null,{campanyDynamic:msg});
				},serviceEnumerationInstance.MEDIA_COMPANYDYNAMIC_LIST,"POST");
			},
			function(resultCallBackFun){
				//获取首页网络借贷知识列表
				serviceInstance.callServer({page:1,rows:4},function(msg){
					resultCallBackFun(null,{lendingKnow:msg});
				},function(msg){
					//接口的失败回调
					resultCallBackFun(null,{lendingKnow:msg});
				},serviceEnumerationInstance.LENDINGKNOW,"POST");
			}
		],function(err,results){
			res.render('index', { 
				title:keywords.websiteTitle,
				keywords:keywords.keywords,
				description:keywords.description,
				indexDatas:results,
				userInfo:results[0].user,
				configImgUrl:config.imageServer.url
			});
		});
  		
	});
	
	app.get("/index",function(req,res,next){
  		res.render('index', { 
  			title:keywords.websiteTitle,
			keywords:keywords.keywords,
			description:keywords.description

  		});
	});
 
	//加入路由
	monitorRotes.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
	userAccountRoutes.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
	investmentRoutes.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
	loanRoutes.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
	accountRotes.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
		maintainRotes.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
		accountInvestRotes.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
		accountLoanRotes.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
		accountInviteRotes.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
		accountBonusRotes.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
		chargeManagementRotes.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
		accountSecuritySetting.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
	aboutUs.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
	insurance.init(app,serviceInstance,serviceEnumerationInstance,logInfo); 
	helpCenter.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
	noviceGuide.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
	operationData.init(app,serviceInstance,serviceEnumerationInstance,logInfo);
};
