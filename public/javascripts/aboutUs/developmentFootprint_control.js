$(function() {  
	//年度介绍
	$('.timeYear').bind('click',function(){  
		var flag=$(this).attr('data-flag');  
		if(flag=='1'){
			$(this).find('.showBtn').addClass('showBtnRotate'); 
			$(this).parent().find('.showbox').hide();
			$(this).attr('data-flag','0');
		}else if(flag=='0'){
			$(this).find('.showBtn').removeClass('showBtnRotate'); 
			$(this).parent().find('.showbox').show();
			$(this).attr('data-flag','1'); 
		}  
	});  
});