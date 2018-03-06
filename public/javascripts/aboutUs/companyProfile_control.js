$(function(){ 
    //图片轮播
    $('.pic_slide_prove').bxSlider({
        infiniteLoop: false,
        minSlides: 3,
        maxSlides: 6,
        slideWidth: 228,
        slideMargin: 40,
        pager: false
    });
    $('.pic_slide_reward').bxSlider({
        infiniteLoop: false,
        minSlides: 2,
        maxSlides: 6,
        slideWidth: 375,
        slideMargin: 30,
        pager: false
    });
    //图片放大展示
    var $img_group_index = $(".pic_slide");
    $.each($img_group_index, function(index, val) {
        var _index = $(this).attr("data-index");
        $(".pic_slide > li").not(".bx-clone").find(".fancybox"+_index).fancybox({
            helpers: {
                title: {
                    type: 'inside'
                },
                buttons: {}
            },
            afterLoad: function() {
                var _cur_title = "";
                var img_url = this.href; 
                for (var z = 0; z < this.group.length; z++) {
                    var el_href = $(this.group[z].element).attr('href');
                    if (img_url === el_href) {
                        _cur_title = $(this.group[z].element).attr("data-title"); 
                        break;
                    }
                }
                this.title = _cur_title + '&nbsp;&nbsp;&nbsp;&nbsp;' + (this.index + 1) + '\/ ' + this.group.length;
            }
        });
    });

});