/**我的账户我的特权路由**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo,jsVersion,cssVersion){
	 //查询我的账户我的特权列表
	app.get('/account/bonus/findBonusListByPage', function(req, res){
		var userInfo = req.session.user;  
	 	var userId=userInfo.id; 
	 	var type=req.query.type;
	 	var state=req.query.state; 
	 	var page=req.query.page;
	 	var rows=req.query.rows;  
	 	var amount=req.query.amount; 
		var dataJson={userId:userId,type:type,state:state,page:page,rows:rows,amount:amount};  
		serviceInstance.callServer(dataJson,function(msg){   
			res.json(msg); 
		},function(msg){   
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_ALL_BONUS,"POST");
	});  
};