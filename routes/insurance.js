//keywords config
var keywords=require('../config/keywords.json');
/**安全保障**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo){
   
  app.get('/insurance/insurance', function(req, res){ 
    //获取传递用户登录信息
    var userInfo = req.session.user;  
    res.render('insurance/insurance', {
      title: keywords.websiteTitle, 
      keywords:keywords.keywords,
      userInfo:userInfo,
      description:keywords.description
    });
  }); 
};