var $ = require("../../components/jquery/dist/jquery");

var test = {
	init: function(){
		test.isFn();
	},
	
	isFn: function(){
		$("a").html("ok")
	}
}

test.init();