// 用于数据字典判断
function DataDictionary(options){
	this.options=options;
}
DataDictionary.prototype={
	 // 贷款类型
	 dicProductid:function (index) {
	 	index=index.toString();
	 	if(index=='103'){
	 		return '车辆周转贷';
	 	}else if(index=='104'){
	 		return '房产周转贷';
	 	}else if(index=='105'){
	 		return '个人消费贷';
	 	}else if(index=='106'){
	 		return '个体经营贷';
	 	}else if(index=='107'){
	 		return '农业贷';
	 	}else if(index=='108'){
	 		return '企业经营贷';
	 	}else{
	 		return '';
	 	}
	 },
	 //奖励类型
	 dicRewardType:function (index) { 
	 	index=index.toString(); 
	 	//返回值说明 奖励类型名称 选择的奖励类型名称 奖励的单位
	 	if(index=="1"){ 
	 		return ['红包','红包','元',1]; 
		}else if(index=="2"){ 
			return ['加息卷','加息卷','%',100];
		}else if(index=="3"){ 
			return ['特权本金','特权本金','元',1];
		} 
	 },
	 //适用产品
	 dicUseProduct:function(index){  
	 	index=index.toString();
	 	var indexArray=index.split(',');
	 	var str='';
	 	for(var i=0;i<indexArray.length;i++){
	 		if(indexArray[i]=="1"){
	 			if(str==""){
	 				str+="散标购买";
	 			}  
		 	}else if(indexArray[i]=="2"){
		 		if(str==""){
	 				str+= "债权转让标签";
	 			}else{
	 				str+= " / 债权转让标签";
	 			} 
		 	}else{
		 		str='无';
		 	}
	 	}
	 	return str;
	 	
	 },
	 //奖励来源
	 dicBonusOrigin:function(index){
	 	index=index.toString(); 
	 	if(index=='1'){
	 		return '注册红包';
	 	}else if(index=='2'){
	 		return '实名认证红包';
	 	}else if(index=='3'){
	 		return '绑定银行卡红包';
	 	}else if(index=='4'){
	 		return '首次投资红包';
	 	}else if(index=='5'){
	 		return '投资红包';
	 	}else if(index=='6'){
	 		return '首次充值红包';
	 	}else if(index=='7'){
	 		return '资金存管红包';
	 	}else if(index=='8'){
	 		return '活动红包';
	 	}else if(index=='9'){
	 		return '系统发放红包';
	 	}else if(index=='21'){
	 		return '注册加息券';
	 	}else if(index=='22'){
	 		return '投资加息券';
	 	}else{
	 		return '';
	 	}
	 },
	 // 还款方式
	 dicRepaymentMethod:function(index) { 
	 	index=index.toString();
	 	if(index=='1'){
	 		return '一次性还本付息 ';
	 	}else if(index=='2'){
	 		return '按月付息到期还本';
	 	}else if(index=='3'){
	 		return '等额本息';
	 	}else{
	 		return '';
	 	}
	 },
	 //借款管理  还款计划 状态
	 dicPaymentState:function(index){
	 	index=index.toString();
	 	if(index=='1'){
	 		return '已完结';
	 	}else if(index=='2'){
	 		return '已逾期';
	 	}else if(index=='3'){
	 		return '还款中';
	 	}
	 },
	 //投资管理  还款计划 状态
	 dicInvestmentState:function(index){
	 	index=index.toString();
	 	if(index=='1'){
	 		return '已完结';
	 	}else if(index=='2'){
	 		return '已逾期';
	 	}else if(index=='3'){
	 		return '回款中';
	 	}
	 },
	 //我的账户 投资管理列表 标的状态
	 dicInvestmentTargetState:function(index){
	 	index=index.toString();
	 	if(index=='1'){
	 		return '投资中';
	 	}else if(index=='2'){
	 		return '回款中';
	 	}else if(index=='3'){
	 		return '已完结';
	 	}else if(index=='4'){
	 		return '已流标';
	 	}
	 },
	 //我的账户 借款管理列表 标的状态
	 dicLoanTargetState:function(index){
	 	index=index.toString();
	 	if(index=='1'){
	 		return '借款中';
	 	}else if(index=='2'){
	 		return '还款中';
	 	}else if(index=='3'){
	 		return '已完结';
	 	}else if(index=='4'){
	 		return '已流标';
	 	} 
	 },
	 //平台来源
	 dicplantFrom:function(index){
	 	index=index.toString();
	 	if(index=='1'){
	 		return 'PC';
	 	}else if(index=='2'){
	 		return '微信';
	 	}else if(index=='3'){
	 		return 'APP';
	 	}
	 },
	 //是否充值
	 dicIsDO:function(index){
	 	index=index.toString();
	 	if(index=='1'){
	 		return '是';
	 	}else if(index=='0'){
	 		return '否';
	 	} 
	 },
	 //新闻的分类
	 dicNewsType:function(str){
	 	str=str.toString();
	 	if(str=='news'){
	 		return '媒体报道';
	 	}else if(str=='companyDynamic'){
	 		return '公司动态';
	 	}else if(str=='notice'){
	 		return '平台公告';
	 	}else if(str=='consultation'){
	 		return '行业资讯';
	 	}else if(str=='netLoanKnowledge'){
	 		return "网络借贷知识";
	 	}  
	 },
	 //新闻的url
	 dicNewsHref:function(str){
	 	str=str.toString();
	 	if(str=='news'){
	 		return ['/aboutUs/mediaReport','menuMediaReport'];
	 		// return "/aboutUs/aboutUsOverview?v=/aboutUs/mediaReport&m=menuMediaReport";
	 	}else if(str=='companyDynamic'){
	 		return ['/aboutUs/companyNews','menuCompanyNews']; 
	 		// return "/aboutUs/aboutUsOverview?v=/aboutUs/companyNews&m=menuCompanyNews";
	 	}else if(str=='notice'){
	 		return ['/aboutUs/platformAnnounce','menuPlatformAnnounce']; 
	 		// return "/aboutUs/aboutUsOverview?v=/aboutUs/platformAnnounce&m=menuPlatformAnnounce";
	 	}else if(str=='consultation'){
	 		return ['/aboutUs/industryNews','menuIndustryNews'];  
	 		// return "/aboutUs/aboutUsOverview?v=/aboutUs/industryNews&m=menuIndustryNews";
	 	}else if(str=='netLoanKnowledge'){
	 		return ['/aboutUs/lendingKnow','menuLendingKnow'];
	 		// return "/aboutUs/aboutUsOverview?v=/aboutUs/lendingKnow&m=menuLendingKnow";
	 	}  
	 },
	 //交易状态
	 dicTradeState:function(index){
	 	var tradeState = {
	 		"1":"处理中",
	 		"2":"成功",
	 		"3":"失败",
	 		"4":"其他"
	 	};
	 	return tradeState[index];
	 },
	 //交易类型
	 dicTradeType:function(index){
		var tradeType = {
			"1":"充值",
			"2":"提现",
			"3":"投资",
			"4":"流标回款",
			"5":"满标放款",
			"6":"投资回款",
			"7":"到期还款"
		};
		return tradeType[index];
	 },
	 //投资状态
	 divInvestState:function(index){
	 	var investState = {
	 		"1":"回款中",
	 		"2":"投资中",
	 		"3":"已完结",
	 		"5":"已流标",
	 		"6":"转让中",
	 		"7":"已转出"
	 	};
	 	return investState[index];
	 },
	 //首页标的类型
	 dicProductName:function(index){
	 	var productName = {
	 		'103':'车辆周转贷',
	 		'104':'房产周转贷',
	 		'105':'个人消费贷',
	 		'106':'个体经营贷',
	 		'107':'农业贷',
	 		'108':'企业经营贷'
	 	};
	 	return productName[index];
	 }

};