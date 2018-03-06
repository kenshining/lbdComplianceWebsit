/** 资金管理：充值、提现、交易记录操作路由**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo,jsVersion,cssVersion){
	//获取绑卡信息
	app.post('/account/bindBankCard',function(req, res){
		//获取用户信息
		var userInfo = req.session.user;
		serviceInstance.callServer({userId:userInfo.id}
		,function(msg){
			//成功回调方法
			res.json(msg);
		},function(msg){
			//失败回调方法
			res.json(msg);
		},
		serviceEnumerationInstance.BINDCARD_INFO);
	});

	//获取银行卡信息列表
	app.post('/account/bankCard',function(req, res){
		
		//获取充值类型 快捷充值：1     网银充值：2
		var type = req.body.rechargeType;

		serviceInstance.callServer({rechargeType:type}
		,function(msg){
			//成功回调方法
			res.json(msg);
		},function(msg){
			//失败回调方法
			res.json(msg);
		},
		serviceEnumerationInstance.BINDCARD_LIST);
	});

	//获取交易记录列表
	app.post('/account/tradeRecordList',function(req, res){
		//获取用户信息
		var userInfo = req.session.user;
		serviceInstance.callServer({
			page:req.body.page,
			rows:req.body.rows,
			type:req.body.type,
			state:req.body.state,
			days:req.body.days,
			beginDate:req.body.beginDate,
			endDate:req.body.endDate,
			userId:userInfo.id
		},function(msg){
			//成功回调方法
			res.json(msg);
		},function(msg){
			//失败回调方法
			res.json(msg);
		},
		serviceEnumerationInstance.RECORD_TRADELIST);
	});

	//快捷充值
	app.post('/account/capital/fastRecharge',function(req, res){
		//获取用户信息
		var userInfo = req.session.user;
		var cardId = req.body.cardId;
		var amount = req.body.amount;
		serviceInstance.callServer({
			userId:userInfo.id,
			cardId:cardId,
			amount:amount
		},function(msg){
			//成功回调方法
			res.json(msg);
		},function(msg){
			//失败回调方法
			res.json(msg);
		},
		serviceEnumerationInstance.CAPITAL_FASTRECHARGE);
	});

	//网银充值
	app.post('/account/capital/onlineRecharge',function(req, res){
		//获取用户信息
		var userInfo = req.session.user;
		var amount = req.body.amount;

		serviceInstance.callServer({
			userId:userInfo.id,
			amount:amount
		},function(msg){
			//成功回调方法
			res.json(msg);
		},function(msg){
			//失败回调方法
			res.json(msg);
		},
		serviceEnumerationInstance.CAPITAL_ONLINERECHARGE);
	});

	//提现
	app.post('/account/capital/withdraw',function(req, res){
		//获取用户信息
		var userInfo = req.session.user;
		var cardId = req.body.cardId;
		var amount = req.body.amount;
		var tradingPassword = req.body.tradingPassword;
		serviceInstance.callServer({
			userId:userInfo.id,
			cardId:cardId,
			amount:amount,
			tradingPassword:tradingPassword
		},function(msg){
			//成功回调方法
			res.json(msg);
		},function(msg){
			//失败回调方法
			res.json(msg);
		},
		serviceEnumerationInstance.CAPITALWITHDRAW);
	});
};