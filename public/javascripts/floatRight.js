//右侧浮窗
(function($,window,document,undefined){  
	$.fn.floatRight=function(options){
		var defaults={
			navTopEl:'#btn_up_page'
		};
		var thisElement=this;
		//构造函数
		function RightFloatNav(options){ 
			this.element=thisElement;
			//将默认属性对象和传递的参数对象合并到第一个空对象中
			this.settings=$.extend({},defaults,options);
			this._defaults=defaults; 
			this.init(); 
		};
		RightFloatNav.prototype={
			init:function(){
				var self=this;
				//向上滚动 
				var $navTopEl=$(self.element).find(self.settings.navTopEl);
				if($navTopEl.length>0){
					$(window).scroll(function(event){
						var el_h=$(document).scrollTop();
						if(el_h>0){ //显示向上按钮
							$navTopEl.removeClass('up_disable'); 
						}else{
							$navTopEl.addClass('up_disable');
						}
					});
					$navTopEl.on('click',function(){
						$('html,body').animate({
							scrollTop:0
						},500);
					});
				}
				$(self.element).find("> li:not(.up)").hover(function(){
					$(this).addClass('enable');
				},function(){
					$(this).removeClass('enable');
				}); 
				$(self.element).find('.common_online_custom').bind('click',function(){
					window.open("http://lebaidai.udesk.cn/im_client?cur_url="+escape(location.href)+"&pre_url="+escape(document.referrer),"udesk_im","width=780,height=560,top=200,left=350,resizable=yes");
				});
				

			},
			_destory:function(){
				$(this.element).remove();
			}
		};
		return new RightFloatNav(options);
	}
	 
})(jQuery,window,document)