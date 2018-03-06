$(function(){
	//添加滑动事件
	$('.yeartab ul li').bind('click',function(){ 
		var left=$(this).position().left;
		var index=$(this).index(); 
		$('#tab'+index).addClass('show').removeClass('hide').siblings().addClass('hide').removeClass('show');
		var thisWidth=$(this).width();
		$('.slideBorder').css('width',thisWidth+'px'); 
		$(this).addClass('selected').siblings().removeClass('selected'); 
		$('.slideBorder').animate({'left':left+'px'}); 
	}); 

});