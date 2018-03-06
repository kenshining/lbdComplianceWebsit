$(document).ready(function() {
	/*去掉底部的固定定位*/
	$('.footer_bar').css('position','static');
	/*去掉主导航高亮样式*/
	$('#header_nav').find('li').removeClass('select');
	/*添加帮助中心高亮样式*/
	$("#nav_header_bar_noviceGuide").css('color','#ff6121');

	/*简单三步走*/
	var index = 1;
	var max = $('#sliderWrap').find('.slider_item').size();
	function Tab(idx,domId){
		$('#sliderWrap').find('.slider_item').eq(idx).show().siblings('.slider_item').hide();
		$('#'+domId).removeClass('icon-zh-novice-arrow').addClass('icon-zh-novice-arrowH');
	};

	//左 --
	$('#arrowL').click(function(){
		index -- ;
		if(index < 1){
			index = 0 ;
			$('#arrowL').removeClass('icon-zh-novice-arrowH').addClass('icon-zh-novice-arrow');
		}
		Tab(index,'arrowR');
	});

	//右 ++
	$('#arrowR').click(function(){
		index ++ ;
		if(index > max-2){
			index = max-1 ;
			$('#arrowR').removeClass('icon-zh-novice-arrowH').addClass('icon-zh-novice-arrow');
		}
		Tab(index,'arrowL');
	});
});