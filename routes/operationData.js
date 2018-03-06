var keywords=require('../config/keywords.json');
var async = require('async');

exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo){

	app.get('/operationData/operationData', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	 	async.parallel([
	 		function(resultCallBackFun){
	 			//获取运营数据
	 			serviceInstance.callServer({},function(msg){
	 				//接口成功回调
	 				resultCallBackFun(null,{operationData:msg});
	 			},function(msg){
	 				//接口的失败回调
	 				resultCallBackFun(null,{operationData:msg});
	 			},serviceEnumerationInstance.STATISTIC_OPERATIONS,"POST");
	 		}
	 	],function(err,results){
 		  	res.render('operationData/operationData', {
 			    title: keywords.websiteTitle,
 			    userInfo:userInfo,
 			    keywords:keywords.keywords,
 			    description:keywords.description,
 			    operationData:results[0].operationData
 		 	});
	 	});
	});
};