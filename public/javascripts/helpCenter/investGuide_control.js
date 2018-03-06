$(document).ready(function(){
	var typeCode = $('#_typeCode').val();
	$('.commonProblem_list_wrapper').on('click','li',function(){
		var detailP = $(this).find('.commonProblem_list_item_detail_wrapper');
		if(detailP.is(':visible')){
			detailP.hide();
		}else{
			$('.commonProblem_list_wrapper').find('.commonProblem_list_item_detail_wrapper').hide();
			detailP.show();
		};
	});

	//获取常见问题列表
	getCommonProblems(typeCode,function(e){ 
		if(e.state == "SUCCESS"){
			var data = e.data[0].faqList;
			var	str = "";
			for(var i in data){
				str += "<li>"+
							"<h3>"+(i*1+1)+"、"+data[i].title+"</h3><div class='commonProblem_list_item_detail_wrapper'>"+data[i].preview+"</div>"
						"</li>"
			}
			$('.commonProblem_list_wrapper').html(str);
		}else{
			layer.msg(e.message);
		}
	},function(e){
		layer.msg(JSON.stringify(e));
	});
});