//keywords config
var keywords=require('../config/keywords.json');
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo){
	//跳转帮助中心页面
	app.get('/helpCenter/helpCenter', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/helpCenter', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题页面
	app.get('/helpCenter/commonProblemOverview', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	//获取携带页面指定参数
	  	var view = req.query.v;
	  	var menu = req.query.m;
	  	res.render('helpCenter/commonProblemOverview', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description,
		    view:view,
		    menu:menu
	 	});
	});

	//跳转帮助中心-常见问题菜单
	app.get('/helpCenter/commonProblemMenu', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/commonProblemMenu', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-投资指引
	app.get('/helpCenter/investmentProblem/investGuide', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/investmentProblem/investGuide', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-投资演示
	app.get('/helpCenter/investmentProblem/investPlay', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/investmentProblem/investPlay', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-转让操作
	app.get('/helpCenter/investmentProblem/transferOperation', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/investmentProblem/transferOperation', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-投资常见问题
	app.get('/helpCenter/investmentProblem/investCommonProblem', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/investmentProblem/investCommonProblem', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-借款指引
	app.get('/helpCenter/loanManagement/loanGuide', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/loanManagement/loanGuide', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});


	//跳转帮助中心-常见问题-借款演示
	app.get('/helpCenter/loanManagement/loanPlay', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/loanManagement/loanPlay', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});
	
	//跳转帮助中心-常见问题-还款
	app.get('/helpCenter/loanManagement/repayment', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/loanManagement/repayment', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-借款常见问题
	app.get('/helpCenter/loanManagement/loanCommonProblem', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/loanManagement/loanCommonProblem', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-注册/登录
	app.get('/helpCenter/accountManagement/loginAndRegist', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/accountManagement/loginAndRegist', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-密码设置
	app.get('/helpCenter/accountManagement/setPassword', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/accountManagement/setPassword', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-充值
	app.get('/helpCenter/accountManagement/rechargeProblem', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/accountManagement/rechargeProblem', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-提现
	app.get('/helpCenter/accountManagement/withdrawProblem', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/accountManagement/withdrawProblem', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-安全认证
	app.get('/helpCenter/accountManagement/authProblem', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/accountManagement/authProblem', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-消息
	app.get('/helpCenter/accountManagement/newsProblem', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/accountManagement/newsProblem', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-奖励
	app.get('/helpCenter/accountManagement/rewardProblem', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/accountManagement/rewardProblem', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-政策与法律
	app.get('/helpCenter/securityGuarantee/policyAndLaw', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/securityGuarantee/policyAndLaw', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-风控体系
	app.get('/helpCenter/securityGuarantee/windControlSystem', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/securityGuarantee/windControlSystem', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-资金安全
	app.get('/helpCenter/securityGuarantee/capitalSecurity', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/securityGuarantee/capitalSecurity', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//跳转帮助中心-常见问题-信息安全
	app.get('/helpCenter/securityGuarantee/informationSafety', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('helpCenter/securityGuarantee/informationSafety', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description
	 	});
	});

	//获取常见问题列表
	app.post('/helpCenter/CommonProblem', function(req, res){
		var typeCode = req.body.typeCode;
		serviceInstance.callServer({typeCode:typeCode},function(msg){
		    //成功回调方法
		    res.json(msg);
		},function(msg){
		    //失败回调方法
			res.json(msg);
		},
		serviceEnumerationInstance.MEDIA_FQA_LIST);
	});
};