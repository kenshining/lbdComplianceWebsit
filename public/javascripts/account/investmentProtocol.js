//获取协议内容
var getProtocolContent=function(){ 
	$.lbdAjax({
        url :'/account/investment/investmentProtocolContent',
        type:'GET',
        dataType:'JSON',
        data:{  
        	targetId:$("#targetId").val(),
            orderId:$("#orderId").val(),
           _csrf:$("#_csrf").val()
        },
        success:function(msg){   
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;   
                $('#protocolContent').html(data.content);
                  
            }else{
            	layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg));
        }
    }); 
};
$(function(){ 
	getProtocolContent();
});