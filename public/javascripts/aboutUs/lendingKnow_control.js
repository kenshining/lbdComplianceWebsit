var rows=10;
visiblePages=5;
//网络借贷知识列表
var getList=function(page){  
    $.lbdAjax({
        url :'/aboutUs/lendingKnowByPage',
        type:'GET',
        dataType:'JSON',
        data:{ 
           page:page,
           rows:rows,
           _csrf:$("#_csrf").val()
        },
        success:function(msg){  
            if(msg.state=='SUCCESS'){ 
                var data=msg.data;   
                Rander(data);  
                if(data.length!=0){
                    $.jqPaginator("#newsListPage",{
                        totalPages : data.totalPages,
                        visiblePages: visiblePages,
                        currentPage: (data.number+1),
                        totalnum:data.totalElements,
                        onPageChange: function (num, type) {
                            getListChange(num);
                        }
                    }); 
                }   
            }else{
                layer.msg(JSON.stringify(msg));
            } 
        },
        error:function(msg){  
            layer.msg(JSON.stringify(msg));

        }
    }); 
};
//平台公告列表分页
var getListChange=function(page){
	$.lbdAjax({
        url :'/aboutUs/lendingKnowByPage',
        type:'GET',
        dataType:'JSON',
        data:{ 
           page:page,
           rows:rows,
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
	if(data.content.length>0){
		for(var i=0;i<data.content.length;i++){
			var content=data.content;
			var title=content[i].title;
			var preview=content[i].preview; 
			var createDate=content[i].createdDate; 
			var id=content[i].id;

			html+='<li class="industryNewsInfo">';
			html+='<em class="icon icon-labout_point"></em>';
			html+='<a onclick="changeCurrentMenu(\'/aboutUs/newsInfo?id='+id+'&type=netLoanKnowledge\',\'menuLendingKnow\');" href="javascript:void(0);">'+title+'</a>';
			// html+='<span class="newsDate right">'+createDate+'</span>';
			html+='</li>'; 
		} 
		$('.lmy_investPage').css('display','block'); 
	}else{
		$('.lmy_investPage').css('display','none'); 
	}
	$('#listHtml').html(html);
};

$(function(){
	getList(1);
});