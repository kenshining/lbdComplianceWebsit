// express support
var express = require('express');
var session = require('express-session');
var config = require("../config/config.json");
var config_seo=require('../config/config_seohis_mapping.json');
var config_mobile=require('../config/config_mobileH5_mapping.json');
var urlTool = require('url');

module.exports = function(app,logInfo){
	//session filter
	app.use(function (req, res, next) {
		var url = urlTool.parse(req.originalUrl);
		/*console.log("accept url:"+url.pathname);
		logInfo.info("accept url:"+url.pathname);*/
		//console.log("sessionID:"+req.sessionID);
		//处理多端混合访问，移动端访问转发到H5 URL
		var deviceAgent = req.headers['user-agent'].toLowerCase();
		var mobileUrl = redirectMobileUrl(url.pathname,deviceAgent,url.search);
		if(mobileUrl != ""){
			return res.redirect(mobileUrl);
		}
		//处理SEO遗留问题
		var seoRedirectUrl = redirectSEOUrl(url.pathname);
		if(seoRedirectUrl != ""){
		   return res.redirect(seoRedirectUrl);
		}
		//判断是否为移动端访问若是手机访问PC端页面则直接跳转手机端URL

  		//过滤需要登录才能执行的操作
		var needs = config.roleURL;
		  for(var i = 0 ; i < needs.length ; i++){
		    if(url.pathname == needs[i]){
		      if(!req.session || !req.session.user){
		        return res.redirect("/user/login");
		      }
		    }
		}
  		next();
	});
	
	/**
	* 映射旧的SEO路径到新的应用。
	* 旧应用的SEO与新应用的SEO URL对等，若不存则返回空字符串。
	**/
	var redirectSEOUrl = function(partten){
	  var comps = config_seo.seoPathConfig;
	  for(var i = 0 ; i < comps.length ; i ++){
	    if(partten.indexOf(comps[i].acceptURL) == 0){
	      //包含过滤内容
	      if(comps[i].acceptURL == "/detail"){
	        var id = partten.replace(/[^0-9]/ig,"")
	        return comps[i].redirectURL + "?id="+id;
	      }else{
	        return comps[i].redirectURL;
	      }
	    }
	  }
	  return "";
	};

	var redirectMobileUrl = function(partten,user_agent,params){
		var h5comps = config_mobile.h5PathConfig;
		//console.info("-------------------user_agent:"+user_agent+"+++++++++++++partten:"+partten);
		var agentID = user_agent.match(/(iphone|ipod|ipad|android)/);
		//console.info("-------------------user_agent_state:"+agentID);
		if(agentID){
			//指定到手机
			
			for(var i = 0 ; i < h5comps.length ; i ++){
				//console.info("----p:"+partten+"----h:"+h5comps[i].acceptURL);
		    	if(partten == h5comps[i].acceptURL){
			      //包含过滤内容
			      //console.info("-------------------redirect:"+config_mobile.h5Host + h5comps[i].redirectURL + params);
			      return config_mobile.h5Host + h5comps[i].redirectURL + params;
			    }
			}
		}
		return "";
	};

};