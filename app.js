var express = require('express');
var compression = require('compression');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var config=require('./config/config.json');
var keywords=require('./config/keywords.json');
var lusca = require('lusca');

//log4jsConfigration
var log4js = require('log4js');
log4js.configure(config.log4js);
var logInfo = log4js.getLogger('logInfo');

//拦截器和路由
var routes = require('./routes/index');
var filters = require('./filters/MainFilter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', ejs.__express);

// uncomment after placing your favicon in /public
app.use(compression());//压缩文件
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '5mb', extended: false}));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

//connect to redits to configrate session state
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
// session configerations
app.use(session({
  store: new RedisStore({
    host: config.redisConfig.host,
    port: config.redisConfig.post
  }),
  secret: 'cookie-parser',
  //session invalid configeration
  cookie: {maxAge: 60000*60*24*config.redisConfig.sessionDay },
  resave:true,
  saveUninitialized:false
}));

app.use(lusca({
    csrf: true,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
    xssProtection: true,
    nosniff: true
}));

//引用过滤器
filters(app,logInfo);
//引用路由
routes(app,logInfo,keywords);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  var userInfo = req.session.user;
  res.render('404',{
      title: keywords.pages._404,
      keywords:keywords.pages._404,
      description:keywords.pages._404,
      userInfo:userInfo
    });
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      userInfo:req.session.user,
      title: keywords.websiteTitle
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    userInfo:req.session.user,
    title: keywords.websiteTitle
  });
});

module.exports = app;
