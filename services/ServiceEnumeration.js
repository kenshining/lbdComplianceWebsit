//**接口枚举*/
function ServiceEnumeration(){
   //获取图片验证码
   this.COMMON_VALIDATE_PICTRURE = "/var/imgCode";
   //发送短信验证码
   this.COMMON_VALIDATE_SMS = "/sms/code";
   //验证用户是否注册
   this.USER_VALIDATE_USER_EXIST = "/user/verifyTelephone";
   //验证用户邀请码是否正确
   this.USER_VALIDATE_INVATECODE_EXIST = "/user/verifyInvitedCode";
   //用户注册接口
   this.USER_REGIST_SAVE = "/user/register";
   //用户登录验证接口
   this.USER_VALIDATE_LOGIN = "/user/login";
   //修改用户密码接口
   this.USER_MODIFY_PWD = "/user/rest/password";
   //媒体报道列表
   this.MEDIA_NEWS_LIST = "/media/news/list";
   //公司动态列表
   this.MEDIA_COMPANYDYNAMIC_LIST = "/media/companyDynamic/list";
   //平台公告列表
   this.MEDIA_NOTICE_LIST = "/media/notice/list";
   //行业资讯列表
   this.MEDIA_CONSULTATION_LIST = "/media/consultation/list";
   //常见问题列表
   this.MEDIA_FQA_LIST = "/media/faqList/";

   //投资项目列表
   this.INVESTMENT_LIST = "/invest/list";
   //投资项目详情
   this.INVESTMENT_DISCRIPTION = "/invest/projectDetails";
   //我要投资  项目周期
   this.PROJECTTIMENODE="/invest/projectTimeNode";
   //还款计划
   this.INVESTMENT_PAYBACK_PLAN = "/paybackPlan/list";
   //投资记录
   this.INVESTMENT_INVESTRECORD = "/order/investRecord";
   //投资记录总投资人数、总金额
   this.INVESTMENT_COUNT_TAB = "/invest/totleInvestment";
   //获取投资账户余额
   this.INVESTMENT_USER_BALANCE = "/user/balance";
   
   //获取优惠券 
   this.INVESTMENT_USER_COUPON="/userBonus/listAllAvailable";
   //获取优惠券数量
   this.INVESTMENT_BONUS_COUNT="/userBonus/userBonusNumber"; 
   
   //立即投资
   this.INVESTMENT_SUBMIT="/invest/saveInvest";
   //获取预期收益
   this.INVESTMENT_EXPECTED_INCOME="/invest/anticipatedIncome";
   //投资者风险评估测试提交
   this.INVESTORRISKTEST="/evaulationresult/save";



   //贷款申请
   this.LOAN_SUPPLY = "/loan/apply";
   //首页Banner显示
   this.BANNER_PC = "/banner/PC";
   //首页投资产品默认四条数据
   this.INVESTMENT_INVESTMSG = "/invest/investMsg";

   //账户中心
      //资产总览数据
      this.INVESTMENT_USERASSETMSG = "/invest/accountOverview";
      //用户奖励信息
      this.USETBONUS_USERBONUSMSG = "/userBonus/userBonusMsg";
      //我的投资
      this.USET_INVESTMSG = "/order/list";
      //交易记录
      this.INVEST_TRANSACTIONRECORD = "/trading/record";
      //我的借款统计
      this.LOAN_STATISTICS = "/loan/statistics";
      //近期还款
      this.INVEST_RECENTLYPAYBACK = "/paybackPlan/recentlyPayBack";
      //获取绑卡信息
      this.BINDCARD_INFO = "/bindcard/list";
      //获取银行卡列表信息
      this.BINDCARD_LIST = "/bankcard/list";
      //用户认证状态
      this.USER_AUTH = "/user/auth";
      //交易记录统计
      this.RECORD_RECORDSTATISTIC = "/trading/statistics";
      //交易记录列表
      this.RECORD_TRADELIST = "/trading/record";
      //安全设置-修改手机号码
      this.ACCOUNT_REVISE_MOBILE = "/user/update/telephone";
      //安全设置-实名认证验证身份号码是否可用
      this.ID_CARD_VALIDATOR = "/idCard/validator";
      //安全设置-实名认证
      this.USET_REAL_NAME_AUTH = "/user/realName/auth";
      //安全设置-修改登录密码
      this.USER_REST_PASSWORD = "/user/rest/password";
      //安全设置-设置交易密码
      this.USER_SET_TRADINGPASSWORD = "/user/set/tradingPassword";
      //安全设置-验证原交易密码
      this.VOLIDATE_USER_OLDDEALPWD = "/user/verification/tradingPassword";
      //安全设置-修改交易密码
      this.USER_REVISE_DEAL_PWD = "/user/update/tradingPassword";
      //安全设置-邮件发送
      this.EMAIL_SEND = "/email/send";
      //安全设置-邮箱认证结果
      this.USER_UPDATE_EMAIL = "/user/update/email";

  //关于我们
      //公司动态
      this.COMPANYDYNAMIC='/media/companyDynamic/list';
      //平台公告
      this.PLATFORMANNOUNCE='/media/notice/list';
      //媒体报道
      this.MEDIAREPORT='/media/news/list';
      //行业资讯
      this.INDUSTRYNEWS='/media/consultation/list';
      //友情链接
      this.FRIENDLINK='/weblink/list';
      //加入我们
      this.JOINUS='/recruitment/list';
      //新闻详情
      this.NEWSINFO='/media/';
      //网络借贷知识
      this.LENDINGKNOW='/media/netLoanKnowledge/list';

   // 协议接口
      //协议模板
      this.PROTOCOL_EXAM='/agreement/info/CONTRACT';
      //协议分页
      this.PROTOCOL_LIST='/agreement/list';
      //协议详情
      this.PROTOCOL_Detail='/agreement/detail';
      //协议借款人合同
      this.PROTOCOL_LOAN_PERSON='/agreement/detail/CONTRACT/loan';
      //协议投资人合同
      this.PROTOCOL_INVESTMENT_PERSON='/agreement/detail/CONTRACT/invest';
      //下载借款协议
      this.DOWN_LOAN_PROTOCOL='/electronicSignature/searchDownloadAgreementByTargetId';
      //下载投资协议
      this.DOWN_INVESTMENT_PROTOCOL='/electronicSignature/searchDownloadAgreementByOrderId';
      //生成借款协议
      this.CREATE_LOAN_PROTOCOL='/electronicSignature/createLoanContract';
      //生成投资协议
      this.CREATE_INVESTMENT_PROTOCOL='/electronicSignature/createOrderContract';


 














      //我的投资列表
      this.ACCOUNT_INVESTMENTLIST="/invest/userInvestList";
      //我的投资基本信息
      this.ACCOUNT_INVESTMENT_BASEINFO="/invest/overviewInvestment";
      //我的投资详情列表
      this.ACCOUNT_INVESTMENT_DESP_LIST="/personalPaybackPlan/receiptDetails";
      //我的投资详情基本信息
      this.ACCOUNT_INVESTMENT_DESP_BASEINFO="/personalPaybackPlan/paymentDetails"; 
      //我的特权
      this.ACCOUNT_ALL_BONUS='/userBonus/list';
      //邀请记录
      this.ACCOUNT_INVITELIST='/user/invite/list';
      //邀请统计
      this.ACCOUNT_INVITE_COUNT='/user/invite/statistics';
      //我的借款列表
      this.ACCOUNT_LOANLIST='/loan/success/list';
      //我的借款总览
      this.ACCOUNT_LOAN_BASEINFO='/loan/statistics';
      //我的还款详情列表
      this.ACCOUNT_LOAN_DESP_LIST='/paybackPlan/paybackList'; 
      //我的还款详情总览  
      this.ACCOUNT_LOAN_DESP_BASEINFO='/paybackPlan/paybackStatistics';
      //立即还款信息查询
      this.ACCOUNT_PAYBACK_INFO='/paybackPlan/repaymentMsg';
      //立即还款
      this.ACCOUNT_PAYBACK='/paybackPlan/repayment';
      //申请记录
      this.ACCOUNT_APPLY_LIST='/loan/apply/list';
      //保存用户头像
      this.ACCOUNT_USER_PICS='/user/save/headPortrait';
      //银行卡类型检测
      this.BANK_CARD_INFO = "/bank/card/info";
      //根据银行卡类型获取银行卡详情信息
      this.BANKCARD_TYPE_DETAIL = "/bankcard/typeDetail";
      //绑定银行卡
      this.BINDCARD_BINDCARD = "/bindcard/bindcard";
      //快捷充值
      this.CAPITAL_FASTRECHARGE = "/capital/fastRecharge";
      //网银充值
      this.CAPITAL_ONLINERECHARGE = "/capital/onlineRecharge";
      //提现接口
      this.CAPITALWITHDRAW = "/capital/withdraw";

      //运营统计
      this.STATISTIC_OPERATIONS = "/statistic/operations";
}; 
exports.init= function (){
   return new ServiceEnumeration();
};