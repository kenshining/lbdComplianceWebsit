var rows=10;
var visiblePages=5;
//友情链接
var getList=function(){  
    $.lbdAjax({
        url :'/aboutUs/friendLinkData',
        type:'GET',
        dataType:'JSON',
        data:{  
           _csrf:$("#_csrf").val()
        },
        success:function(msg){  
            if(msg.state=='SUCCESS'){ 
                var data=msg.data; 
                Rander(data);   
            }else{
                layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg)); 
        }
    }); 
};
 
//渲染
var Rander=function(data){ 
	$('#listHtml').html('');
	var html='';  
	if(data.length>0){ 
		for(var i=0;i<data.length;i++){
			var content=data;
			var name=content[i].name;
			var linkUrl=content[i].linkUrl;   
			var imgUrl=content[i].imgUrl;
			var id=content[i].id;  
            html+='<li><a target="_blank" href="//'+linkUrl+'">'+name+'</a></li>'; 
		}   
	} 
	$('#listHtml').html(html); 
};

$(function(){
	getList();
});