/**我的账户借款管理路由**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo,jsVersion,cssVersion){
	//查询我的账户借款管理中 申请记录
	app.get('/account/loan/applicationList', function(req, res){
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
		},serviceEnumerationInstance.ACCOUNT_APPLY_LIST,"POST");
	}); 
	//查询我的账户借款管理中 借款总览
	app.get('/account/loan/loanBaseinfo', function(req, res){
		var userInfo = req.session.user;  
	 	var userId=userInfo.id;   
		var dataJson={userId:userId};  
		serviceInstance.callServer(dataJson,function(msg){  
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_LOAN_BASEINFO,"POST");
	});   
	//查询我的账户借款管理中 借款列表
	app.get('/account/loan/loanlist', function(req, res){
		var userInfo = req.session.user;  
	 	var userId=userInfo.id;

	 	// console.log(userInfo.telephone);
	 	// var telephone='15633309275'; 
	 	var telephone=userInfo.telephone;
   		var startTime=req.query.startTime;
   		var endTime=req.query.endTime;
   		var investDate=req.query.investDate;
   		var targetState=req.query.targetState;
	 	var page=req.query.page;
	 	var rows=req.query.rows;  
		// var dataJson={userId:userId,startTime:startTime,endTime:endTime,investDate:investDate,targetState:targetState,page:page,rows:rows};  
		var dataJson={
			userId:userId,
			startTime:startTime,
			endTime:endTime,
			investDate:investDate,
			targetState:targetState,
			page:page,
			rows:rows
		};  
		// console.log(JSON.stringify(dataJson));
		serviceInstance.callServer(dataJson,function(msg){  
			// console.log(msg);
			res.json(msg);  
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_LOANLIST,"POST");
	}); 
	// 查询我的账户借款管理中 借款详情总览
	app.get('/account/loan/loanDespBaseinfo', function(req, res){
		var userInfo = req.session.user;  
	 	var userId=userInfo.id;   
   		var targetId=req.query.targetId; 
		var dataJson={targetId:targetId};  
		// console.log(JSON.stringify(dataJson));
		serviceInstance.callServer(dataJson,function(msg){  
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_LOAN_DESP_BASEINFO,"POST");
	}); 

	// 查询我的账户借款管理中 借款详情列表
	app.get('/account/loan/loanDespList', function(req, res){
		var userInfo = req.session.user;  
	 	var userId=userInfo.id;   
   		var targetId=req.query.targetId; 
   		var rows=req.query.rows;
   		var page=req.query.page;
		var dataJson={targetId:targetId,page:page,rows:rows};  
		// console.log(JSON.stringify(dataJson));
		serviceInstance.callServer(dataJson,function(msg){  
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_LOAN_DESP_LIST,"POST");
	}); 
	// 查询我的账户借款管理中 借款详情 立即还款信息
	app.get('/account/loan/loanPaybackInfo', function(req, res){
		var userInfo = req.session.user;  
	 	var userId=userInfo.id;   
   		var planId=req.query.planId;  
   		var dataJson={planId:planId};   
		console.log(JSON.stringify(dataJson)); 
		serviceInstance.callServer(dataJson,function(msg){  
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_PAYBACK_INFO,"POST");
	}); 

	//验证交易密码
	app.get('/account/loan/valadatePass', function(req, res){
		var userInfo = req.session.user;  
	 	var userId=userInfo.id;   
   		var tradingPassword=req.query.tradingPassword;
   		var dataJson={userId:userId,tradingPassword:tradingPassword};  
   		// console.log(JSON.stringify(dataJson));  
		serviceInstance.callServer(dataJson,function(msg){  
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.VOLIDATE_USER_OLDDEALPWD,"POST");
	});

	//下载借款合同 
	app.get('/account/loan/loanProtocolDownload', function(req, res){
   		var targetId=req.query.targetId;
   		var dataJson={targetId:targetId};   
   		console.log(JSON.stringify(dataJson));  
		serviceInstance.callServer(dataJson,function(msg){ 
			console.log(msg); 
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调 
			console.log(msg); 
			res.json(msg);
		},serviceEnumerationInstance.DOWN_LOAN_PROTOCOL,"POST");
	});
	//生成下载合同 
	app.get('/account/loan/loanProtocolCreate', function(req, res){
   		var targetId=req.query.targetId;
   		var dataJson={targetId:targetId};   
   		// console.log(JSON.stringify(dataJson));  
		serviceInstance.callServer(dataJson,function(msg){ 
			// console.log(msg); 
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调 
			// console.log(msg); 
			res.json(msg);
		},serviceEnumerationInstance.CREATE_LOAN_PROTOCOL,"POST");
	});

	// 查询我的账户借款管理中 借款详情 立即还款提交
	app.post('/account/loan/paymentSubmit', function(req, res){
		var userInfo = req.session.user;  
	 	var userId=userInfo.id;   
   		var tradingPassword=req.body.tradingPassword;
   		var id=req.body.id;
   		var dataJson={id:id,userId:userId,tradingPassword:tradingPassword};  
   		// console.log(JSON.stringify(dataJson));  
		serviceInstance.callServer(dataJson,function(msg){  
			res.json(msg); 
		},function(msg){ 
			//接口的失败回调
			res.json(msg);
		},serviceEnumerationInstance.ACCOUNT_PAYBACK,"POST");
	}); 
};