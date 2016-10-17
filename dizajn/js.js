$(document).ready(function(){

if(window.location.pathname.length>2){	// prikaz podstranica
fajlnejm=location.pathname.substring(1).substring(location.pathname.substring(1).lastIndexOf("/")+1);
//fajlnejm=window.location.pathname.replace(/.+ribolov\.hr\/([\S]+.html)/gi,"$1");
$('ul#navigacija>li>a[href*="'+fajlnejm+'"]').addClass("aktivna");
$('div#podnozje>a[href*="'+fajlnejm+'"]').addClass("trenutna");
kojiDio=window.location.search.substring(1);	// prikaz podstranica
if(kojiDio){$("#sadrzaj .podstranica").not("#"+kojiDio).hide();}}

if($.browser.msie && $.browser.version < 7){ // internet explorer 6, jeba ih bilgejts
$("#kontejner").css({margin:"-15px 0 0 6px"});
$("#slogan").hide();
$("#desno a.botun").css({height:80,backgroundPosition:"left -190px",marginTop:12});
$("#podnozje div").css({float:"left",width:220});
$("#navigacija a.aktivna+ul").show();
}; // internet explorer 6, jeba ih bilgejts
$.emajl();
$("#slideShow").nivoSlider({pauseTime:4500});

// testis zona
var tip;
$(".tip_trigger").hover(function(){
	//Caching the tooltip and removing it from container; then appending it to the body
	$(".tip").hide();	// makni stari tip ako ga ima (browser back button)
	tip = $(this).find('.tip').remove();
	$('body').append(tip);
	tip.show(); //Show tooltip
}, function() {
	tip.hide().remove(); //Hide and remove tooltip appended to the body
	$(this).append(tip); //Return the tooltip to its original position
}).mousemove(function(e) {
	  var mousex = e.pageX + 20; //Get X coodrinates
	  var mousey = e.pageY + 20; //Get Y coordinates
	  var tipWidth = tip.width(); //Find width of tooltip
	  var tipHeight = tip.height(); //Find height of tooltip
	 //Distance of element from the right edge of viewport
	  var tipVisX = $(window).width() - (mousex + tipWidth);
	  var tipVisY = $(window).height() - (mousey + tipHeight);
	if ( tipVisX < 20 ) { //If tooltip exceeds the X coordinate of viewport
		mousex = e.pageX - tipWidth - 20;
		$(this).find('.tip').css({  top: mousey, left: mousex });
	} if ( tipVisY < 20 ) { //If tooltip exceeds the Y coordinate of viewport
		mousey = e.pageY - tipHeight - 20;
		tip.css({  top: mousey, left: mousex });
	} else {tip.css({top: mousey, left: mousex});}
});



$.posebnosti.start();

});
jQuery.extend({	// stare metode prebacene u $.namespace
emajl: function(){  // <a class="emajl" href="user_nameATdomain">tekst linka</a> >>> mailto:user_name@domain
$("a.emajl").each(function(){
$(this).attr("href",$(this).attr("href").replace(/([^A]+)AT([\w]+)/,"mailto:$1@$2"));
if(!$(this).text()) $(this).text($(this).attr("href").substr(7));
});}
// testis zona, dodaj zarez prije nove funkcije
,posebnosti: {		//			var brojPosebnosti=5; loop da sakriva i pokazuje po brojevima...
	aktivne:12,
	start: function(){
		window.setInterval('$.posebnosti.dalje()',5000);		// period izmjena
	},
	dalje:function(){
		switch(this.aktivne){
	case 12:
		$("#posebnosti li:visible").fadeOut(500,function(){$("#posebnosti li:eq(2),#posebnosti li:eq(3)").fadeIn();});
		this.aktivne=34;
		break;
	case 34:
		$("#posebnosti li:visible").fadeOut(500,function(){$("#posebnosti li:eq(4)").fadeIn();});
		this.aktivne=5;
		break;
	case 5:
		$("#posebnosti li:visible").fadeOut(500,function(){$("#posebnosti li:lt(2)").fadeIn();});
		this.aktivne=12;
		break;
		}
	}
}

});
