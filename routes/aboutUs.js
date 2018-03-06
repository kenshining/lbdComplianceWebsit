var async = require('async');
//keywords config
var keywords=require('../config/keywords.json');
var config=require('../config/config.json');
/**关于我们**/
exports.init= function(app,serviceInstance,serviceEnumerationInstance,logInfo){
  
  /**跳转公司简介**/
  app.get('/aboutUs/aboutUsOverview', function(req, res){ 
    //获取传递用户登录信息
    var userInfo = req.session.user; 
    //获取携带页面指定参数
    var view = req.query.v;
    var menu = req.query.m;
    res.render('aboutUs/aboutUsOverview', {
      title: keywords.websiteTitle,
      userInfo:userInfo,
      keywords:keywords.keywords,
      description:keywords.description,
      aboutview:view,
      aboutmenu:menu
   });
  });
 
  // 关于我们 公共左侧菜单
  app.get('/aboutUs/aboutUsMenu', function(req, res){
    res.render('aboutUs/aboutUsMenu', {});
  }); 
  //关于我们 公司简介
  app.get('/aboutUs/companyProfile', function(req, res){ 
    res.render('aboutUs/companyProfile', {}); 
  });
  //关于我们 团队介绍
  app.get('/aboutUs/team', function(req, res){ 
    res.render('aboutUs/team', {}); 
  }); 
  //关于我们 股东介绍
  app.get('/aboutUs/shareholderIntroduce', function(req, res){ 
    res.render('aboutUs/shareholderIntroduce', {}); 
  });
  //关于我们 发展足迹
  app.get('/aboutUs/developmentFootprint', function(req, res){ 
    res.render('aboutUs/developmentFootprint', {}); 
  });
  //关于我们 业绩报告
  app.get('/aboutUs/performanceReport', function(req, res){ 
    res.render('aboutUs/performanceReport', {}); 
  });
  //关于我们 平台协议
  app.get('/aboutUs/platformProtocol', function(req, res){ 
    res.render('aboutUs/platformProtocol', {}); 
  });

  //关于我们 平台协议列表
  app.get('/aboutUs/platformProtocolList', function(req, res){ 
    var userInfo = req.session.user;   
    var page=req.query.page;
    var rows=req.query.rows;
    var max=req.query.max;
    var dataJson={page:page,rows:rows,max:max};

    serviceInstance.callServer(dataJson,function(msg){  
      res.json(msg); 
    },function(msg){ 
      //接口的失败回调
      res.json(msg);
    },serviceEnumerationInstance.PROTOCOL_LIST,"POST"); 

  }); 
 

  //关于我们 联系我们
  app.get('/aboutUs/contactUs', function(req, res){ 
    res.render('aboutUs/contactUs', {}); 
  });

  //关于我们 联系我们
  app.get('/aboutUs/contactUs', function(req, res){ 
    res.render('aboutUs/contactUs', {}); 
  }); 

  //关于我们 新闻详情
  app.get('/aboutUs/newsInfo', function(req, res){  
    var newsId=req.query.id.split('?')[0];
    var type=req.query.type.split('?')[0];
    res.render('aboutUs/newsInfo', {
      newsId:newsId,
      type:type
    }); 
  }); 
  //关于我们 新闻详情内容
  app.get('/aboutUs/newsInfoContent', function(req, res){ 
    var newsId=req.query.newsId;
    //接口名称由type决定
    var type=req.query.type;
    var dataJson={id:newsId};  
    serviceInstance.callServer(dataJson,function(msg){  
      res.json(msg); 
    },function(msg){ 
      //接口的失败回调
      res.json(msg);
    },serviceEnumerationInstance.NEWSINFO+type,"POST");
  }); 

  //关于我们 加入我们
  app.get('/aboutUs/joinUs', function(req, res){ 
    res.render('aboutUs/joinUs', {}); 
  }); 
  //关于我们 加入我们
  app.get('/aboutUs/joinUsContent', function(req, res){    
    var dataJson={};  
    serviceInstance.callServer(dataJson,function(msg){  
      res.json(msg); 
    },function(msg){ 
      //接口的失败回调
      res.json(msg);
    },serviceEnumerationInstance.JOINUS,"POST");
  });  


  //关于我们 平台公告
  app.get('/aboutUs/platformAnnounce', function(req, res){ 
    res.render('aboutUs/platformAnnounce', {}); 
  });  
  
  //关于我们 平台公告列表分页
  app.get('/aboutUs/platformAnnounceByPage', function(req, res){ 
    var page=req.query.page;
    var rows=req.query.rows;  
    var dataJson={page:page,rows:rows};  
    serviceInstance.callServer(dataJson,function(msg){  
      res.json(msg); 
    },function(msg){ 
      //接口的失败回调
      res.json(msg);
    },serviceEnumerationInstance.PLATFORMANNOUNCE,"POST");
  });   
 
  //关于我们 公司动态
  app.get('/aboutUs/companyNews', function(req, res){ 
    res.render('aboutUs/companyNews', {
      
      imageServer:config.imageServer.url 
    }); 
  });  
  //关于我们 公司动态列表分页
  app.get('/aboutUs/companyNewsByPage', function(req, res){ 
    var page=req.query.page;
    var rows=req.query.rows;  
    var dataJson={page:page,rows:rows};  
    serviceInstance.callServer(dataJson,function(msg){  
      res.json(msg); 
    },function(msg){ 
      //接口的失败回调
      res.json(msg);
    },serviceEnumerationInstance.COMPANYDYNAMIC,"POST");
  });   


  //关于我们 媒体报道
  app.get('/aboutUs/mediaReport', function(req, res){ 
    res.render('aboutUs/mediaReport', {
      imageServer:config.imageServer.url
    }); 
  }); 
  //关于我们 媒体报道列表分页
  app.get('/aboutUs/mediaReportByPage', function(req, res){ 
    var page=req.query.page;
    var rows=req.query.rows;  
    var dataJson={page:page,rows:rows};  
    serviceInstance.callServer(dataJson,function(msg){ 
      res.json(msg); 
    },function(msg){ 
      //接口的失败回调
      res.json(msg);
    },serviceEnumerationInstance.MEDIAREPORT,"POST");
  });   
 

  //关于我们 行业资讯
  app.get('/aboutUs/industryNews', function(req, res){ 
    res.render('aboutUs/industryNews', {}); 
  }); 

  //关于我们 行业资讯列表分页
  app.get('/aboutUs/industryNewsByPage', function(req, res){ 
    var page=req.query.page;
    var rows=req.query.rows;  
    var dataJson={page:page,rows:rows};  
    serviceInstance.callServer(dataJson,function(msg){  
      res.json(msg); 
    },function(msg){ 
      //接口的失败回调
      res.json(msg);
    },serviceEnumerationInstance.INDUSTRYNEWS,"POST");
  }); 


  //关于我们 友情链接
  app.get('/aboutUs/friendLink', function(req, res){ 
    res.render('aboutUs/friendLink', {}); 
  }); 

  //关于我们 友情链接获取数据
  app.get('/aboutUs/friendLinkData', function(req, res){  
    var dataJson={};  
    serviceInstance.callServer(dataJson,function(msg){  
      res.json(msg); 
    },function(msg){ 
      //接口的失败回调
      res.json(msg);
    },serviceEnumerationInstance.FRIENDLINK,"POST");
  });  

  //关于我们 平台公告
  app.get('/aboutUs/lendingKnow', function(req, res){ 
    res.render('aboutUs/lendingKnow', {}); 
  }); 
  //关于我们 网络借贷知识列表分页
  app.get('/aboutUs/lendingKnowByPage', function(req, res){ 
    var page=req.query.page;
    var rows=req.query.rows;  
    var dataJson={page:page,rows:rows};  
    serviceInstance.callServer(dataJson,function(msg){  
      res.json(msg); 
    },function(msg){ 
      //接口的失败回调
      res.json(msg);
    },serviceEnumerationInstance.LENDINGKNOW,"POST");
  });  

};