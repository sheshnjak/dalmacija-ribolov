// Slimbox v2.04 | jQuery Nivo Slider v2.3
/*!
	Slimbox v2.04 - The ultimate lightweight Lightbox clone for jQuery
	(c) 2007-2010 Christophe Beyls <http://www.digitalia.be>
	MIT-style license.
	
	ADDITIONS BY  ..:: sheshnjak ::..
197(143)	images[activeImage][1]=images[activeImage][1].replace(/([^:]+)(: )([^$]+)/,'<a href="'+activeURL+'">$1</a><div>$3</div>');	// divides caption into name: caption
252(189)	if($("html").attr("lang")=="hr-HR") $("#lbCloseLink").text("zatvori").attr("title","Za zatvaranje klikni na tamno polje izvan slike.");	// replaces close image with localized text
			else $("#lbCloseLink").text("close").attr("title","Click on dark area to close.");
*/
// Slimbox v2.04
(function($){
var win=$(window),options,images,activeImage=-1,activeURL,prevImage,nextImage,compatibleOverlay,middle,centerWidth,centerHeight,
ie6=!window.XMLHttpRequest,hiddenElements=[],documentElement=document.documentElement,
preload={},preloadPrev=new Image(),preloadNext=new Image(),
overlay,center,image,sizer,prevLink,nextLink,bottomContainer,bottom,caption,number;
$(function(){
$("body").append(
$([
overlay=$('<div id="lbOverlay" />')[0],
center=$('<div id="lbCenter" />')[0],
bottomContainer=$('<div id="lbBottomContainer" />')[0]
]).css("display","none")
);
image=$('<div id="lbImage" />').appendTo(center).append(
sizer=$('<div style="position: relative;" />').append([
prevLink=$('<a id="lbPrevLink" href="#" />').click(previous)[0],
nextLink=$('<a id="lbNextLink" href="#" />').click(next)[0]
])[0]
)[0];
bottom=$('<div id="lbBottom" />').appendTo(bottomContainer).append([
$('<a id="lbCloseLink" href="#" />').add(overlay).click(close)[0],
caption=$('<div id="lbCaption" />')[0],
number=$('<div id="lbNumber" />')[0],
$('<div style="clear: both;" />')[0]
])[0];
});
$.slimbox=function(_images,startImage,_options){
options=$.extend({
loop:false,
overlayOpacity:0.8,
overlayFadeDuration:400,
resizeDuration:400,
resizeEasing:"swing",
initialWidth:250,
initialHeight:250,
imageFadeDuration:400,
captionAnimationDuration:400,
counterText:"{x} / {y}",
closeKeys:[27,88,67],
previousKeys:[37,80],
nextKeys:[39,78]
},_options);
if(typeof _images=="string"){
_images=[[_images,startImage]];
startImage=0;
}
middle=win.scrollTop()+(win.height()/2);
centerWidth=options.initialWidth;
centerHeight=options.initialHeight;
$(center).css({top:Math.max(0,middle-(centerHeight/2)),width:centerWidth,height:centerHeight,marginLeft:-centerWidth/2}).show();
compatibleOverlay=ie6||(overlay.currentStyle&&(overlay.currentStyle.position!="fixed"));
if(compatibleOverlay)overlay.style.position="absolute";
$(overlay).css("opacity",options.overlayOpacity).fadeIn(options.overlayFadeDuration);
position();
setup(1);
images=_images;
options.loop=options.loop&&(images.length>1);
return changeImage(startImage);
};
$.fn.slimbox=function(_options,linkMapper,linksFilter){
linkMapper=linkMapper||function(el){
return[el.href,el.title];
};
linksFilter=linksFilter||function(){
return true;
};
var links=this;
return links.unbind("click").click(function(){
var link=this,startIndex=0,filteredLinks,i=0,length;
filteredLinks=$.grep(links,function(el,i){
return linksFilter.call(link,el,i);
});
for(length=filteredLinks.length;i<length;++i){
if(filteredLinks[i]==link)startIndex=i;
filteredLinks[i]=linkMapper(filteredLinks[i],i);
}
return $.slimbox(filteredLinks,startIndex,_options);
});
};
function position(){
var l=win.scrollLeft(),w=win.width();
$([center,bottomContainer]).css("left",l+(w/2));
if(compatibleOverlay)$(overlay).css({left:l,top:win.scrollTop(),width:w,height:win.height()});
}
function setup(open){
if(open){
$("object").add(ie6?"select":"embed").each(function(index,el){
hiddenElements[index]=[el,el.style.visibility];
el.style.visibility="hidden";
});
}else{
$.each(hiddenElements,function(index,el){
el[0].style.visibility=el[1];
});
hiddenElements=[];
}
var fn=open?"bind":"unbind";
win[fn]("scroll resize",position);
$(document)[fn]("keydown",keyDown);
}
function keyDown(event){
var code=event.keyCode,fn=$.inArray;
return(fn(code,options.closeKeys)>=0)?close()
:(fn(code,options.nextKeys)>=0)?next()
:(fn(code,options.previousKeys)>=0)?previous()
:false;
}
function previous(){
return changeImage(prevImage);
}
function next(){
return changeImage(nextImage);
}
function changeImage(imageIndex){
if(imageIndex>=0){
activeImage=imageIndex;
activeURL=images[activeImage][0];
prevImage=(activeImage||(options.loop?images.length:0))-1;
nextImage=((activeImage+1)%images.length)||(options.loop?0:-1);
stop();
center.className="lbLoading";
preload=new Image();
preload.onload=animateBox;
preload.src=activeURL;
}
return false;
}
function animateBox(){
center.className="";
$(image).css({backgroundImage:"url("+activeURL+")",visibility:"hidden",display:""});
$(sizer).width(preload.width);
$([sizer,prevLink,nextLink]).height(preload.height);
images[activeImage][1]=images[activeImage][1].replace(/([^:]+)(: )([^$]+)/,'<a href="'+activeURL+'">$1</a><div>$3</div>');
$(caption).html(images[activeImage][1]||"");
$(number).html((((images.length>1)&&options.counterText)||"").replace(/{x}/,activeImage+1).replace(/{y}/,images.length));
if(prevImage>=0)preloadPrev.src=images[prevImage][0];
if(nextImage>=0)preloadNext.src=images[nextImage][0];
centerWidth=image.offsetWidth;
centerHeight=image.offsetHeight;
var top=Math.max(0,middle-(centerHeight/2));
if(center.offsetHeight!=centerHeight){
$(center).animate({height:centerHeight,top:top},options.resizeDuration,options.resizeEasing);
}
if(center.offsetWidth!=centerWidth){
$(center).animate({width:centerWidth,marginLeft:-centerWidth/2},options.resizeDuration,options.resizeEasing);
}
$(center).queue(function(){
$(bottomContainer).css({width:centerWidth,top:top+centerHeight,marginLeft:-centerWidth/2,visibility:"hidden",display:""});
$(image).css({display:"none",visibility:"",opacity:""}).fadeIn(options.imageFadeDuration,animateCaption);
});
}
function animateCaption(){
if(prevImage>=0)$(prevLink).show();
if(nextImage>=0)$(nextLink).show();
$(bottom).css("marginTop",-bottom.offsetHeight).animate({marginTop:0},options.captionAnimationDuration);
bottomContainer.style.visibility="";
}
function stop(){
preload.onload=null;
preload.src=preloadPrev.src=preloadNext.src=activeURL;
$([center,image,bottom]).stop(true);
$([prevLink,nextLink,image,bottomContainer]).hide();
}
function close(){
if(activeImage>=0){
stop();
activeImage=prevImage=nextImage=-1;
$(center).hide();
$(overlay).stop().fadeOut(options.overlayFadeDuration,setup);
}
return false;
}
})(jQuery);
if(!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)){
jQuery(function($){
$("a[rel^='lbx']").slimbox({overlayOpacity:0.9},null,function(el){
return(this==el)||((this.rel.length>8)&&(this.rel==el.rel));
});
if($("html").attr("lang")=="hr-HR") $("#lbCloseLink").text("zatvori").attr("title","Za zatvaranje klikni na tamno polje izvan slike.");
else $("#lbCloseLink").text("close").attr("title","Click on dark area to close.");
});
}

/*
 * jQuery Nivo Slider v2.3
 * http://nivo.dev7studios.com
 *
 * Copyright 2010, Gilbert Pellegrom
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * May 2010 - Pick random effect from specified set of effects by toronegro
 * May 2010 - controlNavThumbsFromRel option added by nerd-sh
 * May 2010 - Do not start nivoRun timer if there is only 1 slide by msielski
 * April 2010 - controlNavThumbs option added by Jamie Thompson (http://jamiethompson.co.uk)
 * March 2010 - manualAdvance option added by HelloPablo (http://hellopablo.co.uk)
 */

(function($){var NivoSlider=function(element,options){var settings=$.extend({},$.fn.nivoSlider.defaults,options);var vars={currentSlide:0,currentImage:'',totalSlides:0,randAnim:'',running:false,paused:false,stop:false};var slider=$(element);slider.data('nivo:vars',vars);slider.css('position','relative');slider.addClass('nivoSlider');var kids=slider.children();kids.each(function(){var child=$(this);var link='';if(!child.is('img')){if(child.is('a')){child.addClass('nivo-imageLink');link=child;}
child=child.find('img:first');}
var childWidth=child.width();if(childWidth==0)childWidth=child.attr('width');var childHeight=child.height();if(childHeight==0)childHeight=child.attr('height');if(childWidth>slider.width()){slider.width(childWidth);}
if(childHeight>slider.height()){slider.height(childHeight);}
if(link!=''){link.css('display','none');}
child.css('display','none');vars.totalSlides++;});if(settings.startSlide>0){if(settings.startSlide>=vars.totalSlides)settings.startSlide=vars.totalSlides-1;vars.currentSlide=settings.startSlide;}
if($(kids[vars.currentSlide]).is('img')){vars.currentImage=$(kids[vars.currentSlide]);}else{vars.currentImage=$(kids[vars.currentSlide]).find('img:first');}
if($(kids[vars.currentSlide]).is('a')){$(kids[vars.currentSlide]).css('display','block');}
slider.css('background','url("'+vars.currentImage.attr('src')+'") no-repeat');for(var i=0;i<settings.slices;i++){var sliceWidth=Math.round(slider.width()/settings.slices);if(i==settings.slices-1){slider.append($('<div class="nivo-slice"></div>').css({left:(sliceWidth*i)+'px',width:(slider.width()-(sliceWidth*i))+'px'}));}else{slider.append($('<div class="nivo-slice"></div>').css({left:(sliceWidth*i)+'px',width:sliceWidth+'px'}));}}
slider.append($('<div class="nivo-caption"><p></p></div>').css({display:'none',opacity:settings.captionOpacity}));if(vars.currentImage.attr('title')!=''){var title=vars.currentImage.attr('title');if(title.substr(0,1)=='#')title=$(title).html();$('.nivo-caption p',slider).html(title);$('.nivo-caption',slider).fadeIn(settings.animSpeed);}
var timer=0;if(!settings.manualAdvance&&kids.length>1){timer=setInterval(function(){nivoRun(slider,kids,settings,false);},settings.pauseTime);}
if(settings.directionNav){slider.append('<div class="nivo-directionNav"><a class="nivo-prevNav">Prev</a><a class="nivo-nextNav">Next</a></div>');if(settings.directionNavHide){$('.nivo-directionNav',slider).hide();slider.hover(function(){$('.nivo-directionNav',slider).show();},function(){$('.nivo-directionNav',slider).hide();});}
$('a.nivo-prevNav',slider).live('click',function(){if(vars.running)return false;clearInterval(timer);timer='';vars.currentSlide-=2;nivoRun(slider,kids,settings,'prev');});$('a.nivo-nextNav',slider).live('click',function(){if(vars.running)return false;clearInterval(timer);timer='';nivoRun(slider,kids,settings,'next');});}
if(settings.controlNav){var nivoControl=$('<div class="nivo-controlNav"></div>');slider.append(nivoControl);for(var i=0;i<kids.length;i++){if(settings.controlNavThumbs){var child=kids.eq(i);if(!child.is('img')){child=child.find('img:first');}
if(settings.controlNavThumbsFromRel){nivoControl.append('<a class="nivo-control" rel="'+i+'"><img src="'+child.attr('rel')+'" alt="" /></a>');}else{nivoControl.append('<a class="nivo-control" rel="'+i+'"><img src="'+child.attr('src').replace(settings.controlNavThumbsSearch,settings.controlNavThumbsReplace)+'" alt="" /></a>');}}else{nivoControl.append('<a class="nivo-control" rel="'+i+'">'+(i+1)+'</a>');}}
$('.nivo-controlNav a:eq('+vars.currentSlide+')',slider).addClass('active');$('.nivo-controlNav a',slider).live('click',function(){if(vars.running)return false;if($(this).hasClass('active'))return false;clearInterval(timer);timer='';slider.css('background','url("'+vars.currentImage.attr('src')+'") no-repeat');vars.currentSlide=$(this).attr('rel')-1;nivoRun(slider,kids,settings,'control');});}
if(settings.keyboardNav){$(window).keypress(function(event){if(event.keyCode=='37'){if(vars.running)return false;clearInterval(timer);timer='';vars.currentSlide-=2;nivoRun(slider,kids,settings,'prev');}
if(event.keyCode=='39'){if(vars.running)return false;clearInterval(timer);timer='';nivoRun(slider,kids,settings,'next');}});}
if(settings.pauseOnHover){slider.hover(function(){vars.paused=true;clearInterval(timer);timer='';},function(){vars.paused=false;if(timer==''&&!settings.manualAdvance){timer=setInterval(function(){nivoRun(slider,kids,settings,false);},settings.pauseTime);}});}
slider.bind('nivo:animFinished',function(){vars.running=false;$(kids).each(function(){if($(this).is('a')){$(this).css('display','none');}});if($(kids[vars.currentSlide]).is('a')){$(kids[vars.currentSlide]).css('display','block');}
if(timer==''&&!vars.paused&&!settings.manualAdvance){timer=setInterval(function(){nivoRun(slider,kids,settings,false);},settings.pauseTime);}
settings.afterChange.call(this);});var nivoRun=function(slider,kids,settings,nudge){var vars=slider.data('nivo:vars');if(vars&&(vars.currentSlide==vars.totalSlides-1)){settings.lastSlide.call(this);}
if((!vars||vars.stop)&&!nudge)return false;settings.beforeChange.call(this);if(!nudge){slider.css('background','url("'+vars.currentImage.attr('src')+'") no-repeat');}else{if(nudge=='prev'){slider.css('background','url("'+vars.currentImage.attr('src')+'") no-repeat');}
if(nudge=='next'){slider.css('background','url("'+vars.currentImage.attr('src')+'") no-repeat');}}
vars.currentSlide++;if(vars.currentSlide==vars.totalSlides){vars.currentSlide=0;settings.slideshowEnd.call(this);}
if(vars.currentSlide<0)vars.currentSlide=(vars.totalSlides-1);if($(kids[vars.currentSlide]).is('img')){vars.currentImage=$(kids[vars.currentSlide]);}else{vars.currentImage=$(kids[vars.currentSlide]).find('img:first');}
if(settings.controlNav){$('.nivo-controlNav a',slider).removeClass('active');$('.nivo-controlNav a:eq('+vars.currentSlide+')',slider).addClass('active');}
if(vars.currentImage.attr('title')!=''){var title=vars.currentImage.attr('title');if(title.substr(0,1)=='#')title=$(title).html();if($('.nivo-caption',slider).css('display')=='block'){$('.nivo-caption p',slider).fadeOut(settings.animSpeed,function(){$(this).html(title);$(this).fadeIn(settings.animSpeed);});}else{$('.nivo-caption p',slider).html(title);}
$('.nivo-caption',slider).fadeIn(settings.animSpeed);}else{$('.nivo-caption',slider).fadeOut(settings.animSpeed);}
var i=0;$('.nivo-slice',slider).each(function(){var sliceWidth=Math.round(slider.width()/settings.slices);$(this).css({height:'0px',opacity:'0',background:'url("'+vars.currentImage.attr('src')+'") no-repeat -'+((sliceWidth+(i*sliceWidth))-sliceWidth)+'px 0%'});i++;});if(settings.effect=='random'){var anims=new Array("sliceDownRight","sliceDownLeft","sliceUpRight","sliceUpLeft","sliceUpDown","sliceUpDownLeft","fold","fade");vars.randAnim=anims[Math.floor(Math.random()*(anims.length+1))];if(vars.randAnim==undefined)vars.randAnim='fade';}
if(settings.effect.indexOf(',')!=-1){var anims=settings.effect.split(',');vars.randAnim=$.trim(anims[Math.floor(Math.random()*anims.length)]);}
vars.running=true;if(settings.effect=='sliceDown'||settings.effect=='sliceDownRight'||vars.randAnim=='sliceDownRight'||settings.effect=='sliceDownLeft'||vars.randAnim=='sliceDownLeft'){var timeBuff=0;var i=0;var slices=$('.nivo-slice',slider);if(settings.effect=='sliceDownLeft'||vars.randAnim=='sliceDownLeft')slices=$('.nivo-slice',slider)._reverse();slices.each(function(){var slice=$(this);slice.css('top','0px');if(i==settings.slices-1){setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed,'',function(){slider.trigger('nivo:animFinished');});},(100+timeBuff));}else{setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed);},(100+timeBuff));}
timeBuff+=50;i++;});}
else if(settings.effect=='sliceUp'||settings.effect=='sliceUpRight'||vars.randAnim=='sliceUpRight'||settings.effect=='sliceUpLeft'||vars.randAnim=='sliceUpLeft'){var timeBuff=0;var i=0;var slices=$('.nivo-slice',slider);if(settings.effect=='sliceUpLeft'||vars.randAnim=='sliceUpLeft')slices=$('.nivo-slice',slider)._reverse();slices.each(function(){var slice=$(this);slice.css('bottom','0px');if(i==settings.slices-1){setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed,'',function(){slider.trigger('nivo:animFinished');});},(100+timeBuff));}else{setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed);},(100+timeBuff));}
timeBuff+=50;i++;});}
else if(settings.effect=='sliceUpDown'||settings.effect=='sliceUpDownRight'||vars.randAnim=='sliceUpDown'||settings.effect=='sliceUpDownLeft'||vars.randAnim=='sliceUpDownLeft'){var timeBuff=0;var i=0;var v=0;var slices=$('.nivo-slice',slider);if(settings.effect=='sliceUpDownLeft'||vars.randAnim=='sliceUpDownLeft')slices=$('.nivo-slice',slider)._reverse();slices.each(function(){var slice=$(this);if(i==0){slice.css('top','0px');i++;}else{slice.css('bottom','0px');i=0;}
if(v==settings.slices-1){setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed,'',function(){slider.trigger('nivo:animFinished');});},(100+timeBuff));}else{setTimeout(function(){slice.animate({height:'100%',opacity:'1.0'},settings.animSpeed);},(100+timeBuff));}
timeBuff+=50;v++;});}
else if(settings.effect=='fold'||vars.randAnim=='fold'){var timeBuff=0;var i=0;$('.nivo-slice',slider).each(function(){var slice=$(this);var origWidth=slice.width();slice.css({top:'0px',height:'100%',width:'0px'});if(i==settings.slices-1){setTimeout(function(){slice.animate({width:origWidth,opacity:'1.0'},settings.animSpeed,'',function(){slider.trigger('nivo:animFinished');});},(100+timeBuff));}else{setTimeout(function(){slice.animate({width:origWidth,opacity:'1.0'},settings.animSpeed);},(100+timeBuff));}
timeBuff+=50;i++;});}
else if(settings.effect=='fade'||vars.randAnim=='fade'){var i=0;$('.nivo-slice',slider).each(function(){$(this).css('height','100%');if(i==settings.slices-1){$(this).animate({opacity:'1.0'},(settings.animSpeed*2),'',function(){slider.trigger('nivo:animFinished');});}else{$(this).animate({opacity:'1.0'},(settings.animSpeed*2));}
i++;});}}
var trace=function(msg){if(this.console&&typeof console.log!="undefined")
console.log(msg);}
this.stop=function(){if(!$(element).data('nivo:vars').stop){$(element).data('nivo:vars').stop=true;trace('Stop Slider');}}
this.start=function(){if($(element).data('nivo:vars').stop){$(element).data('nivo:vars').stop=false;trace('Start Slider');}}
settings.afterLoad.call(this);};$.fn.nivoSlider=function(options){return this.each(function(){var element=$(this);if(element.data('nivoslider'))return;var nivoslider=new NivoSlider(this,options);element.data('nivoslider',nivoslider);});};$.fn.nivoSlider.defaults={effect:'random',slices:15,animSpeed:500,pauseTime:3000,startSlide:0,directionNav:true,directionNavHide:true,controlNav:true,controlNavThumbs:false,controlNavThumbsFromRel:false,controlNavThumbsSearch:'.jpg',controlNavThumbsReplace:'_thumb.jpg',keyboardNav:true,pauseOnHover:true,manualAdvance:false,captionOpacity:0.8,beforeChange:function(){},afterChange:function(){},slideshowEnd:function(){},lastSlide:function(){},afterLoad:function(){}};$.fn._reverse=[].reverse;})(jQuery);