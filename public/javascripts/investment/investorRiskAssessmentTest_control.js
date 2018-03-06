var dataTypeText=[
					'',
					'你对投资的风险和回报都有深刻的了解，你更愿意用最小的风险来获得确定的投资收益。你是一个比较平稳的投资者。风险偏好偏低，稳健是你一贯的风格。',
					'你的风险偏好偏高，但还没有达到热爱风险的地步，你对投资的期望是用适度的风险换取合理的回报。如果你能坚持自己的判断并进行合理的理财规划。你会取得良好的投资回报。',
					'你明白高风险高回报、低风险低回报的定律。你可能还年轻，对未来的收入充分乐观。在对待风险的问题上，你属于风险偏好型。 '
				];
var dataType=[
				'',
				'稳健型投资者',
				'平衡型投资者',
				'进取型投资者'
			];
//评估测试结果
var riskResult=function(data){ 
	$("#score").html(data.score); 
	$("#type").html(dataType[data.level]);
	$("#typeText").html(dataTypeText[data.level]); 
	$('#riskTestResult').addClass('show').removeClass('hide');
};
$(function() {
	//选择事件
	$('.questionAnswer span').bind('click',function(){
		//点击添加删除相应样式
		$(this).find('em').addClass('selected'); 
		$(this).siblings().find('em').removeClass('selected');
		$(this).addClass('selected').siblings().removeClass('selected');
		$(this).parent().attr('data-flag',"1");
		$(this).parent().attr('data-value',$(this).attr('data-value')); 
		//点击判断是否全部都选 修改提交按钮可以点击
		var flag='1';
		for(var i=0;i<$('.questionAnswer').length;i++){ 
			if($('.questionAnswer').eq(i).attr('data-flag')==0){
				flag='0' 
				return;
			} 
		} 
		if(flag=="1"){
			$('#btnTest').removeClass('disabled');
		}   
	});


	//提交事件
	$('#btnTest').bind('click',function(){
		if(!$(this).hasClass('disabled')){
			var arr=[];
			for(var i=0;i<$('.questionAnswer').length;i++){ 
				arr.push(parseInt($('.questionAnswer').eq(i).attr('data-value')));
			}  
			console.log(arr);
			$.lbdAjax({
				url	:'/investment/investorRiskTestSave',
				type:'GET',
				dataType:'JSON',
				data:{ 
					arr:arr, 
					_csrf:$("#_csrf").val()
				},
				success:function(msg){ 
					console.log(msg);
					riskResult(msg);
				},
				error:function(msg){  
					layer.msg(JSON.stringify(msg.message)); 
				}
			}); 
		} 
	});

});