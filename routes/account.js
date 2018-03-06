var async = require('async');
var redis = require("redis");
//keywords config
var keywords=require('../config/keywords.json');
var config=require('../config/config.json');
/**用户账户管理**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo){
  
  /**跳转我的账户**/
  app.get('/account/accountOverview', function(req, res){
    
    //获取传递用户登录信息
    var userInfo = req.session.user;
    //获取携带页面指定参数
    var view = req.query.v;
    var menu = req.query.m;
    res.render('account/accountOverview', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description,
      view:view,
      menu:menu
   });
  });

  /**跳转我的账户**/
  //我的账户菜单
  app.get('/account/accountMenu', function(req, res){
    res.render('account/accountMenu', {});
  });

  //我的账户头部
  app.get('/account/accountBasicTopBar', function(req, res){

    //获取传递用户登录信息
    var userInfo = req.session.user;

    res.render('account/accountBasicTopBar', {
        title: keywords.websiteTitle,
        userInfo:userInfo,
        keywords:keywords.keywords,
        description:keywords.description,
        imageServer:config.imageServer.url
    });
  });

  //账户总览
  app.get('/account/maintain/overview', function(req, res){
    
    //获取传递用户登录信息
    var userInfo = req.session.user;

    //异步获取账户总览基础数据   
    async.parallel([
      function(resultCallBackFun){
        //获取账户总览用户数据
        if(req.session && req.session.user){
          resultCallBackFun(null,{user:req.session.user});
        }else{
          resultCallBackFun(null,{user:null});
        }

      },function(resultCallBackFun){
        //获取账户总览资产总览数据
        serviceInstance.callServer({userId:userInfo.id},function(msg){
          //接口成功的回调
          resultCallBackFun(null,{overviewAsset:msg});
        },function(msg){
          //接口的失败回调
          resultCallBackFun(null,{overviewAsset:msg});
        },serviceEnumerationInstance.INVESTMENT_USERASSETMSG,"POST");

      },function(resultCallBackFun){
        //获取账户总览用户奖励数据
        serviceInstance.callServer({userId:userInfo.id},function(msg){
          //接口成功的回调
          resultCallBackFun(null,{userBonus:msg});
        },function(msg){
          //接口的失败回调
          resultCallBackFun(null,{userBonus:msg});
        },serviceEnumerationInstance.USETBONUS_USERBONUSMSG,"POST");

      },function(resultCallBackFun){
        //获取账户总览我的投资数据
        serviceInstance.callServer({userId:userInfo.id,rows:5},function(msg){
          //接口成功的回调
          resultCallBackFun(null,{userInvest:msg});
        },function(msg){
          //接口的失败回调
          resultCallBackFun(null,{userInvest:msg});
        },serviceEnumerationInstance.USET_INVESTMSG,"POST");

      },function(resultCallBackFun){
        //获取账户总览交易记录数据
        serviceInstance.callServer({userId:userInfo.id,rows:5},function(msg){
          //接口成功的回调
          resultCallBackFun(null,{userRecord:msg});
        },function(msg){
          //接口的失败回调
          resultCallBackFun(null,{userRecord:msg});
        },serviceEnumerationInstance.INVEST_TRANSACTIONRECORD,"POST");

      },function(resultCallBackFun){
        //获取账户总览近期还款数据
        serviceInstance.callServer({userId:userInfo.id,rows:3},function(msg){
          //接口成功的回调
          resultCallBackFun(null,{userPayBack:msg});
        },function(msg){
          //接口的失败回调
          resultCallBackFun(null,{userPayBack:msg});
        },serviceEnumerationInstance.INVEST_RECENTLYPAYBACK,"POST");

      },function(resultCallBackFun){
        //获取账户总览近期还款数据
        serviceInstance.callServer({userId:userInfo.id},function(msg){
          //接口成功的回调
          resultCallBackFun(null,{loanTotol:msg});
        },function(msg){
          //接口的失败回调
          resultCallBackFun(null,{loanTotol:msg});
        },serviceEnumerationInstance.LOAN_STATISTICS,"POST");
      }
    ],function(err,results){
      res.render('account/maintain/overview', { 
        title:keywords.websiteTitle,
        keywords:keywords.keywords,
        description:keywords.description,
        overviewDatas:results,
        userInfo:results[0].user
      });
    });

  });

  //投资管理-我的投资
  app.get('/account/investment/investmentView', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/investment/investmentView', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description
    });
  });

  //投资管理-我的投资协议
  app.get('/account/investment/investmentProtocol', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    //获取跳转参数targetId
     var targetId=req.query.targetId;
     var orderId=req.query.orderId;
    res.render('account/investment/investmentProtocol', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description,
      targetId:targetId,
      orderId:orderId
    });
  });

  //投资管理-我的投资协议内容
  app.get('/account/investment/investmentProtocolContent', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user; 
    //获取跳转参数targetId
    var targetid=req.query.targetId;
    //获取跳转参数orderId
    var orderId=req.query.orderId;
    
      //获取协议内容 
      serviceInstance.callServer(
        {
          targetId:targetid, 
          orderId:orderId,
          userId:userInfo.id
        },
        function(msg){ 
          res.json(msg);
        },
        function(msg){
          //接口的失败回调
          res.json(msg);
        },
        serviceEnumerationInstance.PROTOCOL_INVESTMENT_PERSON,
        "POST"
      ); 
  });

  //投资管理-我的投资详情
  app.get('/account/investment/investmentViewDesp', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    var orderid = req.query.orderid; 
    var targetId=req.query.targetId;
    var contractServer=config.contractServer.url;
    res.render('account/investment/investmentViewDesp', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description,
      orderid:orderid,
      targetId:targetId,
      contractServer:contractServer
    });
  });

  //投资管理-债权转让
  app.get('/account/investment/equitableAssignment', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/investment/equitableAssignment', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description
    });
  });

  //我的借款-我的借款
  app.get('/account/loan/loanView', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/loan/loanView', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description
    });
  });

  //我的借款-我的借款详情
  app.get('/account/loan/loanViewDesp', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user; 
    var targetId=req.query.targetid; 
    var contractServer=config.contractServer.url;
    res.render('account/loan/loanViewDesp', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description,
      targetId:targetId,
      contractServer:contractServer
    });
  });

  //我的借款-申请记录
  app.get('/account/loan/applicationRecord', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/loan/applicationRecord', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description
    });
  });

  //我的借款-我的借款协议
  app.get('/account/loan/loanProtocol', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    //获取跳转参数targetId
    var targetId=req.query.targetId;
    res.render('account/loan/loanProtocol', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description,
      targetId:targetId
    });
  });

  //我的借款-我的借款协议内容
  app.get('/account/loan/loanProtocolContent', function(req, res){
      //获取传递用户登录信息
      var userInfo = req.session.user; 
      //获取跳转参数targetId
      var targetid=req.query.targetId;
      
      //获取协议内容 
      serviceInstance.callServer(
        {
          targetId:targetid 
        },
        function(msg){ 
          res.json(msg);
        },
        function(msg){
          //接口的失败回调
          res.json(msg);
        },
        serviceEnumerationInstance.PROTOCOL_LOAN_PERSON,
        "POST"
      ); 
  });

  //资金管理-充值
  app.get('/account/chargeManagement/recharge', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/chargeManagement/recharge', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description,
       imageServerUrl:config.imageServer.url
    });
  });

  //资金管理-提现
  app.get('/account/chargeManagement/withdraw', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/chargeManagement/withdraw', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description,
       imageServerUrl:config.imageServer.url
    });
  });

  //资金管理-交易记录
  app.get('/account/chargeManagement/tradeRecord', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;

    serviceInstance.callServer({userId:userInfo.id,rows:4}
    ,function(msg){
      //成功回调方法
      if(msg.state === "SUCCESS"){
        res.render('account/chargeManagement/tradeRecord', {
           title: keywords.websiteTitle,
           userInfo:userInfo,
           keywords:keywords.keywords,
           description:keywords.description,
           tradeDatas:msg.data
        });
      }else{
        res.json({
          status:false,
          msg:msg.message
        });
      };
    },function(msg){
      //失败回调方法
      console.log('接口访问失败');
    },
    serviceEnumerationInstance.RECORD_RECORDSTATISTIC);

  });

  //邀请好友-我要邀请
  app.get('/account/friends/invite', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user; 
    // //注册的时候填写的属于我的邀请码
    // var inviteCode=userInfo.inviteCode; 
    //注册的时候填写邀请人的手机号
    var inviteCode=userInfo.telephone;
    //邀请链接
    var sharelink=config.shareLink.url;
    res.render('account/friends/invite', {
      title: keywords.websiteTitle,
      keywords:keywords.keywords,
      description:keywords.description,
      inviteCode:inviteCode,
      sharelink:sharelink
    });
  });

  //邀请好友-邀请记录
  app.get('/account/friends/inviteRecord', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/friends/inviteRecord', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description
    });
  });

  //奖励管理-我的特权
  app.get('/account/bonus/bonusView', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/bonus/bonusView', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description
    });
  });

  //安全设置-账户信息
  app.get('/account/securitySetting/securitySetting', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/securitySetting/securitySetting', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description
    });
  });

  //安全设置-头像设置
  app.get('/account/securitySetting/setUserPhoto', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    //根据参数判断是否为未设置过头像还是设置过进行修改
    var control = req.query.control;
    //查询已设置头像
    res.render('account/securitySetting/setUserPhoto', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description,
       imageServer:config.imageServer.url,
       control:control//若未设置过头像则为“new”若已设置过头像则为“update”
    });
  });

  //安全设置-修改手机号码
  app.get('/account/securitySetting/reviseMobile', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/securitySetting/reviseMobile', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description
    });
  });

  //安全设置-实名认证
  app.get('/account/securitySetting/certification', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/securitySetting/certification', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description
    });
  });

  //安全设置-绑定银行卡
  app.get('/account/securitySetting/bindBankCard', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/securitySetting/bindBankCard', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description
    });
  });

  //安全设置-修改登录密码
  app.get('/account/securitySetting/reviseLoginPwd', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/securitySetting/reviseLoginPwd', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description
    });
  });

  //安全设置-设置交易密码
  app.get('/account/securitySetting/setDealPwd', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/securitySetting/setDealPwd', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description
    });
  });

  //安全设置-修改交易密码
  app.get('/account/securitySetting/reviseDealPwd', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/securitySetting/reviseDealPwd', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description
    });
  });

  //安全设置-找回交易密码
  app.get('/account/securitySetting/findDealPwd', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/securitySetting/findDealPwd', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description
    });
  });

  //安全设置-邮箱认证
  app.get('/account/securitySetting/bindEmail', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/securitySetting/bindEmail', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description,
       serverInfo:config.serverInfo
    });
  });

  //安全设置-修改邮箱
  app.get('/account/securitySetting/reviseEmail', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/securitySetting/reviseEmail', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description,
       serverInfo:config.serverInfo
    });
  });

  //安全设置-邮箱认证结果页
  app.get('/account/securitySetting/bindEmailResult', function(req, res){
      var userInfo = req.session.user;
      var state = req.query.state;
      //创建链接
      var RDS_PORT = config.redisConfig.post,//端口号
        RDS_HOST = config.redisConfig.host,//服务器IP
        RDS_OPTS = {},            //设置项
        client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
         //链接创建成功回调函数执行    
        client.on('connect', function(results) {
          //保存数据
          client.hgetall('validate:emailValidate_'+userInfo.id, function(err,object){
            //数据保存数据结果
            console.info(object);
            client.del('validate:emailValidate_'+userInfo.id);
            //处理完成关闭链接
            client.quit();
            if(object){
              //验证成功
              //调用修改邮箱接口设置邮箱数据
              res.render('account/securitySetting/bindEmailResult', {
                 title: keywords.websiteTitle,
                 userInfo:userInfo,
                 keywords:keywords.keywords,
                 description:keywords.description,
                 able:true,
                 email:object.email
              });
            }else{
              //验证失败
              res.render('account/securitySetting/bindEmailResult', {
                 title: keywords.websiteTitle,
                 userInfo:userInfo,
                 keywords:keywords.keywords,
                 description:keywords.description,
                 able:false,
                 email:""
              });
            }
          });
      });
       
  });

  //消息中心-系统消息
  app.get('/account/msgCenter/sysMsg', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/msgCenter/sysMsg', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description
    });
  });

  //消息中心-消息设置
  app.get('/account/msgCenter/msgSetting', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    res.render('account/msgCenter/msgSetting', {
       title: keywords.websiteTitle,
       userInfo:userInfo,
       keywords:keywords.keywords,
       description:keywords.description
    });
  });


  //获取用户认证状态
  app.post('/account/user/auth', function(req, res){
    //获取传递用户登录信息
    var userInfo = req.session.user;
    serviceInstance.callServer({userId:userInfo.id}
    ,function(msg){
      //成功回调方法
      if(msg.state === "SUCCESS"){
        res.json({
          status:true,
          msg:msg.data
        });
      }else{
        res.json({
          status:false,
          msg:msg.message
        });
      };
    },function(msg){
      //失败回调方法
      res.json(msg);
    },
    serviceEnumerationInstance.USER_AUTH);
  });

};