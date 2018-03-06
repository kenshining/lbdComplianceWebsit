var tools= require('../lib/tools');
//keywords config
var keywords=require('../config/keywords.json');
/**
* 我要借款模块
**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo){
  
/**跳转我要借款页面**/
  app.get('/loan/loan', function(req, res){
  //获取跳转参数
      var history = req.query.history;
      var userInfo = req.session.user;
      req.session.historyPath = history;
      res.render('loan/loan', {
        title: keywords.websiteTitle,
        userInfo:userInfo,
        keywords:keywords.keywords,
        description:keywords.description
     });
  });

  /**跳转我要借款协议页模板**/
  app.get('/agreement/sb_loan_protocol', function(req, res){
    //获取跳转参数
      var history = req.query.history;
      req.session.historyPath = history;
      var targetId=req.query.targetId;
      res.render('agreement/sb_loan_protocol', {
      title: keywords.websiteTitle,
      keywords:keywords.keywords,
      description:keywords.description,
      targetId:targetId
    });
  });
  // 查询模板协议内容
  app.get('/agreement/getLoanProtocolExample', function(req, res){ 
      //获取跳转参数targetId
      var targetid=req.query.targetId;
 
      //获取协议内容 
      serviceInstance.callServer(
        {
          targetId:targetid, 
        },
        function(msg){ 
          res.json(msg);
        },
        function(msg){
          //接口的失败回调
          res.json(msg);
        },
        serviceEnumerationInstance.PROTOCOL_EXAM,
        "POST"
      ); 
  });

  /**跳转协议页详情页**/
  app.get('/agreement/protocol_detail', function(req, res){
    //获取跳转参数
      var history = req.query.history;
      req.session.historyPath = history;
      var protocolId=req.query.protocolId;
      res.render('agreement/protocol_detail', {
      title: keywords.websiteTitle,
      keywords:keywords.keywords,
      description:keywords.description,
      protocolId:protocolId
    });
  });
  // 查询协议详情内容
  app.get('/agreement/getProtocolDetail', function(req, res){ 
      //获取跳转参数targetId
      var protocolId=req.query.protocolId;
 
      //获取协议内容 
      serviceInstance.callServer(
        {
          id:protocolId, 
        },
        function(msg){ 
          res.json(msg);
        },
        function(msg){
          //接口的失败回调
          res.json(msg);
        },
        serviceEnumerationInstance.PROTOCOL_Detail,
        "POST"
      ); 
  });




  /**跳转我要借款协议页**/
  app.get('/agreement/bl_risk_protocol', function(req, res){
    //获取跳转参数
      var history = req.query.history;
      req.session.historyPath = history;
      res.render('agreement/bl_risk_protocol', {
      title: keywords.websiteTitle,
      keywords:keywords.keywords,
      description:keywords.description
    });
  });

/*获取图形验证码*/
  app.get('/loan/loanImgCode',function(req, res){
    serviceInstance.callServer({length:4},function(msg){
      //成功回调方法
      if(msg.state === "SUCCESS"){
        //暂存图形验证码至Session
        req.session.loanImgCode = msg.data.code.toUpperCase().toString();
        res.json({
          status:true,
          validateCodeImg:msg.data.img
        });
      }
    },function(msg){
      //失败回调方法
    },serviceEnumerationInstance.COMMON_VALIDATE_PICTRURE);
  });

/*验证图形验证码是否正确*/
  app.post('/loan/checkLoanImgCode',function(req, res){
      var imgCode = req.session.loanImgCode;
      var inputImgCode = req.body.loanImgCode;
      //验证图形验证码是否正确
      if(imgCode.toUpperCase() != inputImgCode.toUpperCase()){
        res.json({status:false,msg:'imgCode'});
      }else{
        res.json({status:true,msg:'imgCode'});
      }
  });

/*贷款申请提交*/
  app.post('/loan/loanSubmit',function(req, res){
      var imgCode = req.session.loanImgCode;
      var inputImgCode = req.body.loanImgCode;
      //验证图形验证码是否正确
      if(imgCode.toUpperCase() != inputImgCode.toUpperCase()){
        res.json({status:false,msg:'imgCode'});
      }else{
        //提交贷款申请
        var name = req.body.name;
        var mobile = req.body.mobile;
        var money = req.body.money;
        var city = req.body.city;
        //提交数据
        serviceInstance.callServer(
          { 
            appName:name,
            appMobile:mobile,
            appAmount:money,
            cityName:city,
            appSource:'1'//订单来源PC

          },function(msg){
            //成功回调方法
            if(msg.state === "FAIL"){
              //失败，重复申请
              res.json({status:false,msg:"mobile",errorMsg:msg});
            }else{
              //成功
              res.json({status:true});
            }
        },function(msg){
          //失败回调方法
        },serviceEnumerationInstance.LOAN_SUPPLY);

      }
  });
};