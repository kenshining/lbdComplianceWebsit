(function ($) {
    'use strict';

    $.jqPaginator = function (el, options) {
        var self = this;

        self.$container = $(el);

        self.$container.data('jqPaginator', self);

        self.init = function () {

            var opts = self.options = $.extend({}, $.jqPaginator.defaultOptions, options); 

            if (!opts.totalPages && !opts.totalCounts) {
                throw new Error('[jqPaginator] totalCounts or totalPages is required');
            }

            if (!opts.totalPages && opts.totalCounts && !opts.pageSize) {
                throw new Error('[jqPaginator] pageSize is required');
            }

            if (!opts.totalPages && opts.totalCounts && opts.pageSize) {
                opts.totalPages = Math.ceil(opts.totalCounts / opts.pageSize);
            }

            if (opts.currentPage < 1 || opts.currentPage > opts.totalPages) {
                throw new Error('[jqPaginator] currentPage is incorrect');
            }

            if (opts.totalPages < 1) {
                throw new Error('[jqPaginator] totalPages cannot be less currentPage');
            }

            self.render();

        };

        self.render = function () {
            self.renderHtml();
            self.bindEvents();
            //触发配置回调方法
            self.fireEvent(self.options.currentPage);
        };

        self.renderHtml = function () {
            var pagesHtml = '';
            var pages = self.getPages();
            for (var i = 0, j = pages.length; i < j; i++) {
                if (self.options.currentPage == pages[i]) { 
                    pagesHtml += '<span class="pageSelect">'+pages[i]+'</span>'; 
                }else{
                    pagesHtml += '<span>'+pages[i]+'</span>';
                }
            }
            var allnum=self.options.totalnum;
            var firstPage=1;
            var lastPage=self.options.totalPages;
            // var preHtml = '<div class="items auto" id="'+self.$container.attr('id')+'_prv">&lt;</div>';
            // var nextHtml = '<div class="items auto" id="'+self.$container.attr('id')+'_nex">&gt;</div>';
            // var jumpToHtml = '<div class="items" id="'+self.$container.attr('id')+'_jump"><input type="text" value="'+self.options.currentPage+'" class="jumpTo"/>&nbsp;/&nbsp;'+self.options.totalPages+'页</div>';
            // var resultHTML = preHtml + '<div class="items" id="'+self.$container.attr('id')+'_page">'+pagesHtml+'</div>'
            //                 + jumpToHtml + nextHtml;
            var preHtml = '<div class="items auto" id="'+self.$container.attr('id')+'_prv">&lt;</div>';
            var nextHtml = '<div class="items auto" id="'+self.$container.attr('id')+'_nex">&gt;</div>';
            // var jumpToHtml = '<div class="items" id="'+self.$container.attr('id')+'_jump"><input type="text" value="'+self.options.currentPage+'" class="jumpTo"/>&nbsp;/&nbsp;'+self.options.totalPages+'页</div>';

            var fisrtPageHtml='<span id="firstPage" class="spanpage" data-id="1">首页</span>';
            var centerPageHtml='<span class="spannum">共：'+allnum+'条</span>';
            var lastPageHtml='<span id="lastPage" class="spanpage" data-id='+lastPage+'>末页</span>';
         

            var elsehtml=fisrtPageHtml+centerPageHtml+lastPageHtml;
            var resultHTML = preHtml + '<div class="items" id="'+self.$container.attr('id')+'_page">'+pagesHtml+'</div>'
                            + nextHtml+elsehtml;
            self.$container.addClass("pagenation");
            self.$container.html(resultHTML);
        };

        self.getPages = function () {
            var pages = [],
            visiblePages = self.options.visiblePages,
            currentPage = self.options.currentPage,
            totalPages = self.options.totalPages; 

            if (visiblePages > totalPages) {
                visiblePages = totalPages;
            }

            var half = Math.floor(visiblePages / 2);
            var start = currentPage - half + 1 - visiblePages % 2;
            var end = currentPage + half;

            if (start < 1) {
                start = 1;
                end = visiblePages;
            }
            if (end > totalPages) {
                end = totalPages;
                start = (totalPages - visiblePages) + 1;
            }

            var itPage = start;
            while (itPage <= end) {
                pages.push(itPage);
                itPage++;
            }

            return pages;
        };

        self.switchPage = function (pageIndex) {
            self.options.currentPage = pageIndex;
            self.render();
        };

        self.bindEvents = function () {
            //bind event
            var prv = $('#'+self.$container.attr('id')+'_prv');
            var nex = $('#'+self.$container.attr('id')+'_nex');
            var jump = $('#'+self.$container.attr('id')+'_jump .jumpTo');
            var nums = $('#'+self.$container.attr('id')+'_page').find("span");

            //首页
            var firstPage=$("#firstPage");
            //末页
            var lastPage=$("#lastPage");
            //为首页和末页绑定事件
            var spanpage=$('.spanpage'); 

            // console.log(self.options.flagPage);

            //为每一个页码绑定事件
            $.each(nums, function() {

                $(this).on("click",function(){
                    //当页无动作
                    if(parseInt(num) == self.options.currentPage){
                        return;
                    }else{
                        var num = $(this).html();
                        self.options.currentPage = parseInt(num); 
                        self.render();
                    } 
                });

            }, []);
            //为首页和末页绑定事件
             $.each(spanpage, function() { 

                $(this).on("click",function(){

                    var index=$(this).attr('data-id'); 
                    //当页无动作
                    if(parseInt(index) == self.options.currentPage){
                        return;
                    }else{ 
                        self.options.currentPage = parseInt(index); 
                        self.render();
                    }
                    
                });

            }, []);


            if( 1 === self.options.currentPage){
                prv.unbind();
                prv.addClass('itemsgray');

                firstPage.unbind();
                firstPage.addClass('itemsgray');

            }else{
                prv.removeClass('itemsgray'); 
                prv.on("click",function(){
                    self.options.currentPage = self.options.currentPage - 1;
                    self.render();
                });
 
                firstPage.removeClass('itemsgray');
                firstPage.on("click",function(){ 
                    self.options.currentPage = parseInt(index); 
                    self.render();
                });
            }

            if(self.options.currentPage >= self.options.totalPages){
                nex.unbind();
                nex.addClass('itemsgray');

                lastPage.unbind();
                lastPage.addClass('itemsgray');

            }else{
                nex.removeClass('itemsgray');  
                nex.on("click",function(){
                    self.options.currentPage = self.options.currentPage + 1;
                    self.render();
                });

                lastPage.removeClass('itemsgray');
                lastPage.on("click",function(){ 
                    self.options.currentPage = parseInt(index); 
                    self.render();
                });
            }
            
            
            //绑定跳转事件
            jump.on("change",function(){
                var jumpNum = $(this).val();
                var re = /^\d+$/;
                //是否为空或者整数
                if (!re.test(jumpNum) || jumpNum == ''){
                    $(this).val(self.options.currentPage);
                    return;
                }
                //验证是否有效
                if(parseInt(jumpNum) > self.options.totalPages || parseInt(jumpNum) < 1){
                    $(this).val(self.options.currentPage);
                    return;
                }
                self.options.currentPage = parseInt(jumpNum);
                self.render();
            });
           
        };

        self.fireEvent = function (pageIndex) {
            return (typeof self.options.onPageChange !== 'function') || (self.options.onPageChange(pageIndex) !== false);
        };

        self.init();
        return self.$container;
    };

})(jQuery);