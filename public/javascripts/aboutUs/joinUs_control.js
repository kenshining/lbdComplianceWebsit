var getContent=function(){
	$.lbdAjax({
        url :'/aboutUs/joinUsContent',
        type:'GET',
        dataType:'JSON',
        data:{  
           _csrf:$("#_csrf").val()
        },
        success:function(msg){  
           // console.log(msg);
           if(msg.state=='SUCCESS'){
           		var data=msg.data;
           		var html='';
           		var contentHtml='';
           		for(var i=0;i<data.length;i++){
           			if(i==0){
           				html+='<li class="selected">'+data[i].jobType+'</li>'; 
           				contentHtml+='<div id="tab'+i+'" class="recruitDesp show">';
           				contentHtml+=data[i].content;
           				contentHtml+='</div>';
           			}else if(i==6){
           				html+='<li class="last">'+data[i].jobType+'</li>';
           				contentHtml+='<div id="tab'+i+'" class="recruitDesp hide">';
           				contentHtml+=data[i].content;
           				contentHtml+='</div>';
           			}else{
           				html+='<li>'+data[i].jobType+'</li>';
           				contentHtml+='<div id="tab'+i+'" class="recruitDesp hide">';
           				contentHtml+=data[i].content;
           				contentHtml+='</div>';
           			} 
           		}
           		$('#recruitNamelist').html(html); 
           		$('#recruitContent').html(contentHtml);
           		//添加默认的宽度 
				var thisWidth=$('.recruitName ul li').eq(0).width();
				$('.slideBorder').css('width',thisWidth+'px'); 
           		addSlideClick();
           }
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg));
        }
    }); 
};
//添加事件
var addSlideClick=function(){
	//添加滑动事件
	$('.recruitName ul li').bind('click',function(){ 
		var left=$(this).position().left;
		var index=$(this).index(); 
		$('#tab'+index).addClass('show').removeClass('hide').siblings().addClass('hide').removeClass('show');
		var thisWidth=$(this).width();
		$('.slideBorder').css('width',thisWidth+'px'); 
		$(this).addClass('selected').siblings().removeClass('selected'); 
		$('.slideBorder').animate({'left':left+'px'}); 
	}); 
};
$(function() {   
	//获取数据
 	getContent();

});