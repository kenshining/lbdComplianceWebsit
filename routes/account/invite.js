/**我的账户邀请好友路由**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo,jsVersion,cssVersion){
	//邀请记录列表
	app.get('/account/invite/invitelist', function(req, res){
		var userInfo = req.session.user;  
	 	var userId=userInfo.id;  
	 	var page=req.query.page;
	 	var rows=req.query.rows;
		var dataJson={userId:userId,page:page,rows:rows};  
		serviceInstance.callServer(dataJson,function(msg){  
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_INVITELIST,"POST");
	});   
	//邀请统计
	app.get('/account/invite/inviteCount', function(req, res){
		var userInfo = req.session.user;  
	 	var userId=userInfo.id;  
		var dataJson={userId:userId};  
		serviceInstance.callServer(dataJson,function(msg){  
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_INVITE_COUNT,"POST");
	});   
};