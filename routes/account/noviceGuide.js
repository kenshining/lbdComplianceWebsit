//keywords config
var keywords=require('../config/keywords.json');
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo,jsVersion,cssVersion){
	//跳转新手指引页面
	app.get('/noviceGuide/noviceGuide', function(req, res){
	  	//获取传递用户登录信息
	  	var userInfo = req.session.user;
	  	res.render('noviceGuide/noviceGuide', {
		    title: keywords.websiteTitle,
		    userInfo:userInfo,
		    keywords:keywords.keywords,
		    description:keywords.description,
		    jsVersion:jsVersion,
		    cssVersion:cssVersion
	 	});
	});
};