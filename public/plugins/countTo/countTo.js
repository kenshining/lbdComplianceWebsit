$.fn.countTo = function(options){

	var settings = $.extend({},{
		from: 0,
		to:"",
		speed:1500,
		refreshInterval:100,
		formatMoney:true,
		decimals:2
	},options);

	var loops = Math.ceil(settings.speed / settings.refreshInterval),
		increment = (settings.to - settings.from) / loops,
		countTimer = null,
		value = settings.from,
		loopCount = 0,
		self = $(this);


	if (countTimer) {
		clearInterval(countTimer);
	};

	countTimer = setInterval(function(){

		value += increment;
		loopCount++;

		if (loopCount >= loops) {
			clearInterval(countTimer);
			value = settings.to;
		}
		self.data('counttoinit','1');
		render(value);

	},100);

	function render(value) {
		if(settings.formatMoney){
			self.html("￥"+_formatMoney(value.toFixed(settings.decimals)));
		}else{
			self.html(value.toFixed(0).replace(/\B(?=(?:\d{3})+(?!\d))/g, ','));
		}
	};

	function _formatMoney(number, places, symbol, thousand, decimal) {
	    places = !isNaN(places = Math.abs(places)) ? places : 2;
	    symbol = symbol !== undefined ? symbol : "";
	    thousand = thousand || ",";
	    decimal = decimal || ".";
	    var negative = number < 0 ? "-" : "", i = parseInt(number = Math.abs(number || 0).toFixed(places), 10) + "";
	    var j = (j = i.length) > 3 ? j % 3 : 0;
	    var result =	symbol	+ negative	+ (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
		return result;
	};
};

