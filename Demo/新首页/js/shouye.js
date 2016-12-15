$(document).ready(function(){
	var sudu=700;
	a=$(window).height();
	b=(a-775)/2;
	$(window).resize(function() {//窗口大小变化时改变a的值
  		a=$(window).height();
		b=(a-775)/2;
	});
	$("#axl-11").on("click", function(event){
		event.preventDefault();
		$("body,html").animate({
			scrollTop: 1460-b,
		 	},sudu
		);
	});
	$("#axl-12").on("click", function(event){
		event.preventDefault();
		$("body,html").animate({
			scrollTop: 2793-b,
		 	},sudu
		);
	});
	$("#axl-13").on("click", function(event){
		event.preventDefault();
		$("body,html").animate({
			scrollTop: 4126-b,
		 	},sudu
		);
	});
});
