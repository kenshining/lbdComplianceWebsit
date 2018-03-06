;(function($){
/**
	*dialog 弹出框功能插件
	*options 参数说明：
		dialogDom：弹出框的页面元素
		isClose：是否支持点击任意处关闭，默认为true
		className:  弹出框wrapper的样式

	*callBack 关闭弹出框后执行的回调函数，有则执行
**/
	var isNotHave = true // 判断是否存在，如果已经存在，不再重复添加;
	$.dialog=function(options,callBack){
		function Dialog(options,callBack){
			this.options = options;
			this.callBack = callBack;
			this.isClose = this.options.isClose === false ? !1 : !0;
			this.init();
			this._close();
			this.addCloseBtn();
		}
		Dialog.prototype={
			//添加元素
			init:function(){
				var $mask = $("<div class='mask'></div>");//遮罩层
				var $dialogWrapper = $("<div class='dialog_wrapper " + this.options.className + "'>"+this.options.dialogDom + "</div>");//遮罩层
				if(isNotHave){
					$('body')
						.append($mask)
						.append($dialogWrapper)
						.addClass('body_overflow');
					isNotHave = false;
				}
			},
			//关闭功能
			close:function(){
				$('.dialog_wrapper').remove();
				$('.mask').remove();
				$('body').removeClass('body_overflow')
				isNotHave = true;
				this.callBack && this.callBack();
			},
			//是否支持点击任意处关闭
			_close:function(){ 
				var self = this;
				if(this.isClose){
					$('.mask').click(function(e){ 
						self.close();
					});
					$('.invet_dialog_wrapper').click(function(e){ 
						e.stopPropagation();
					});
				}
			},
			addCloseBtn:function(){
				var that =this
				$('#dialog_close_btn').click(function(){
					that.close();
				})
			}
		}
		return new Dialog(options,callBack);
	}
})(jQuery)