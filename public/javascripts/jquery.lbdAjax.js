;(function($){

	var _ajax = $.ajax;
	$.lbdAjax=function(opt){
		//备份opt中error和success方法
		var fn = {
			error:function(XMLHttpRequest, textStatus, errorThrown){},
			success:function(data, textStatus){},
			beforeSend:function(){},
			complete:function(){},
			ajaxLoadWaitingIndex:0
		}
		if(opt.error){
			fn.error=opt.error;
		}
		if(opt.success){
			fn.success=opt.success;
		}
		if(opt.beforeSend){
			fn.beforeSend = opt.beforeSend;
		}
		if(opt.complete){
			fn.complete = opt.complete;
		}
		//扩展增强处理
		var _opt = $.extend(opt,{
			error:function(XMLHttpRequest, textStatus, errorThrown){
				//错误方法增强处理
				layer.close(fn.ajaxLoadWaitingIndex);
				fn.error(XMLHttpRequest, textStatus, errorThrown);
			},
			success:function(data, textStatus){
				//成功回调方法增强处理
				layer.close(fn.ajaxLoadWaitingIndex);
				fn.success(data, textStatus);
			},
			beforeSend:function(XHR){
				//提交前回调方法
				fn.ajaxLoadWaitingIndex = layer.load(2);
				fn.beforeSend();
			},
			complete:function(XHR, TS){
				//请求完成后回调函数 (请求成功或失败之后均调用)。
				layer.close(fn.ajaxLoadWaitingIndex);
				fn.complete();
			}
		});
		_ajax(_opt);
	};

})(jQuery);