/**我的账户下投资管理操作路由**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo,jsVersion,cssVersion){
	 
	//查询我的账户投资列表分页
	app.get('/account/investment/findInvestListByPage', function(req, res){
		var userInfo = req.session.user; 
	 	var userId=userInfo.id; 
	 	var startTime=req.query.startTime;
	 	var endTime=req.query.endTime;
	 	var investDate=req.query.investDate;
	 	var targetState=req.query.targetState;
	 	var page=req.query.page;
	 	var rows=req.query.rows;
		var dataJson={userId:userId,startTime:startTime,endTime:endTime,investDate:investDate,targetState:targetState,page:page,rows:rows}; 
		serviceInstance.callServer(dataJson,function(msg){ 
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_INVESTMENTLIST,"POST");
	});  

	//查询我的账户投资基本信息
	app.get('/account/investment/getinvestBaseinfo', function(req, res){
		var userInfo = req.session.user; 
	 	var userId=userInfo.id; 
		var dataJson={userId:userId}; 
		serviceInstance.callServer(dataJson,function(msg){ 
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_INVESTMENT_BASEINFO,"POST");
	});  

	//查询我的账户投资详情列表分页
	app.get('/account/investment/getInvestDespByPage', function(req, res){
		var userInfo = req.session.user; 
	 	var userId=userInfo.id;  
	 	var page=req.query.page;
	 	var rows=req.query.rows;
	 	var orderid=req.query.orderid;
		var dataJson={userId:userId,page:page,rows:rows,orderId:orderid};  
		serviceInstance.callServer(dataJson,function(msg){  
			res.json(msg); 
		},function(msg){  
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_INVESTMENT_DESP_LIST,"POST");
	});  

	//查询我的账户投资详情列表中基本信息
	app.get('/account/investment/getInvestDespBaseinfo', function(req, res){
		var userInfo = req.session.user; 
	 	var userId=userInfo.id; 
	 	var orderid=req.query.orderid; 
	 	var dataJson={userId:userId,orderId:orderid};  
		serviceInstance.callServer(dataJson,function(msg){ 
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_INVESTMENT_DESP_BASEINFO,"POST");
	});  
 
	//下载投资合同 
	app.get('/account/investment/investmentProtocolDown', function(req, res){
   		var orderId=req.query.orderId;
   		var dataJson={orderId:orderId};  
   		// console.log(JSON.stringify(dataJson));  
		serviceInstance.callServer(dataJson,function(msg){   
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.DOWN_INVESTMENT_PROTOCOL,"POST");
	});
	//生成投资合同 
	app.get('/account/investment/investmentProtocolCreate', function(req, res){
   		var orderId=req.query.orderId;
   		var dataJson={orderId:orderId};  
   		// console.log(JSON.stringify(dataJson));  
		serviceInstance.callServer(dataJson,function(msg){   
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.CREATE_INVESTMENT_PROTOCOL,"POST");
	});

};