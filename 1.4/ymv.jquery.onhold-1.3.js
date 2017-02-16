/*
 * ymv.jquery.onhold v1.3
 * Fecha: 20161121
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 * 
 * Atributos:
 * [onhold] [onhold-time] [onhold-wait]
 * [onmousehold] [onmousehold-time] [onmousehold-wait]
 * [ontouchhold] [ontouchhold-time] [ontouchhold-wait]
 * Funciones:
 * $.fn.onhold()
 * $.fn.onmousehold()
 * $.fn.ontouchhold()
 */
$(function($){
	$.onholdwait=500;
	$.onholdtime=30;
	$(document).on('mousedown.hold touchstart.hold','[onhold]',function(event){
		if(event.type=='touchstart')
			event.preventDefault();
		this.hold=new Function('event,count,last',$(this).attr('onhold'));
		var time=(isNaN(parseFloat($(this).attr('onhold-time')))?$.onholdtime:parseFloat($(this).attr('onhold-time')));
		var wait=(isNaN(parseFloat($(this).attr('onhold-wait')))?$.onholdwait:parseFloat($(this).attr('onhold-wait')));
		if(this.tHold)
			clearTimeout(this.tHold);
		if(this.iHold)
			clearInterval(this.iHold);
		var count=0;
		var e=this;
		var last=undefined;
		e.tHold=setTimeout(function(){
			e.iHold=setInterval(function(){
				count++;
				if((last=e.hold(event,count,last))===false)
					clearInterval(e.iHold);
			},time);
		},wait);
		if((last=e.hold(event,count,last))===false)
			clearInterval(e.iHold);
	}).on('mouseup.hold mouseout.hold touchend.hold touchcancel.hold','[onhold]',function(event){
		if(this.tHold)
			clearTimeout(this.tHold);
		if(this.iHold)
			clearInterval(this.iHold);
	});
	$.fn.onHold=function(f,time,wait,ns){
		ns='.hold'+(ns?'.'+ns:'');
		if(isNaN(time)) time=$.onholdtime;
		if(isNaN(wait)) wait=$.onholdwait;
		return $(this).each(function(i,e){
			if(e.hold){
				$(e).off(ns);
				delete e.tHold;
				delete e.iHold;
				delete e.hold;
			}
			if(typeof f=='function'){
				e.hold=f;
				$(e).on('mousedown'+ns+' touchstart'+ns,function(event){
					if(this.tHold)
						clearTimeout(this.tHold);
					if(this.iHold)
						clearInterval(this.iHold);
					var count=0;
					var last=undefined;
					e.tHold=setTimeout(function(){
						e.iHold=setInterval(function(){
							count++;
							if((last=e.hold(event,count,last))===false)
								clearInterval(e.iHold);
						},time);
					},wait);
					if((last=e.hold(event,count,last))===false)
						clearInterval(e.iHold);
				}).on('mouseup'+ns+' mouseout'+ns+' touchend'+ns+' touchcancel'+ns,function(){
					if(this.tHold)
						clearTimeout(this.tHold);
					if(this.iHold)
						clearInterval(this.iHold);
				});
			}
		});
	};

	$(document).on('mousedown.mousehold','[onmousehold]',function(event){
		this.mouseHold=new Function('event,count,last',$(this).attr('onmousehold'));
		var time=(isNaN(parseFloat($(this).attr('onmousehold-time')))?$.onholdtime:parseFloat($(this).attr('onmousehold-time')));
		var wait=(isNaN(parseFloat($(e).attr('onmousehold-wait')))?$.onholdwait:parseFloat($(e).attr('onmousehold-wait')));
		if(this.tMouseHold)
			clearTimeout(this.tMouseHold);
		if(this.iMouseHold)
			clearInterval(this.iMouseHold);
		var count=0;
		var e=this;
		var last=undefined;
		e.tMouseHold=setTimeout(function(){
			e.iMouseHold=setInterval(function(){
				count++;
				if((last=e.mouseHold(event,count,last))===false)
					clearInterval(e.iMouseHold);
			},time);
		},wait);
		if((last=e.mouseHold(event,count,last))===false)
			clearInterval(e.iMouseHold);
	}).on('mouseup.mousehold mouseout.mousehold','[onmousehold]',function(event){
		if(this.tMouseHold)
			clearTimeout(this.tMouseHold);
		if(this.iMouseHold)
			clearInterval(this.iMouseHold);
	});
	$.fn.onMouseHold=function(f,time,wait,ns){
		ns='.mousehold'+(ns?'.'+ns:'');
		if(isNaN(time)) time=$.onholdtime;
		if(isNaN(wait)) wait=$.onholdwait;
		return $(this).each(function(i,e){
			if(e.mouseHold){
				$(e).off(ns);
				delete e.tMouseHold;
				delete e.iMouseHold;
				delete e.mouseHold;
			}
			if(typeof f=='function'){
				e.mouseHold=f;
				$(e).on('mousedown'+ns,function(event){
					if(this.tMouseHold)
						clearTimeout(this.tMouseHold);
					if(this.iMouseHold)
						clearInterval(this.iMouseHold);
					var count=0;
					var last=undefined;
					e.tMouseHold=setTimeout(function(){
						e.iMouseHold=setInterval(function(){
							count++;
							if((last=e.mouseHold(event,count,last))===false)
								clearInterval(e.iMouseHold);
						},time);
					},wait);
					if((last=e.mouseHold(event,count,last))===false)
						clearInterval(e.iMouseHold);
				}).on('mouseup'+ns+' mouseout'+ns,function(){
					if(this.tMouseHold)
						clearTimeout(this.tMouseHold);
					if(this.iMouseHold)
						clearInterval(this.iMouseHold);
				});
			}
		});
	};
	
	$(document).on('touchstart.touchhold','[ontouchhold]',function(event){
		event.preventDefault();
		this.touchHold=new Function('event,count,last',$(this).attr('ontouchhold'));
		var time=(isNaN(parseFloat($(this).attr('ontouchhold-time')))?$.onholdtime:parseFloat($(this).attr('ontouchhold-time')));
		var wait=(isNaN(parseFloat($(e).attr('ontouchhold-wait')))?$.onholdwait:parseFloat($(e).attr('ontouchhold-wait')));
		if(this.tTouchHold)
			clearTimeout(this.tTouchHold);
		if(this.iTouchHold)
			clearInterval(this.iTouchHold);
		var count=0;
		var e=this;
		var last=undefined;
		e.tTouchHold=setTimeout(function(){
			e.iTouchHold=setInterval(function(){
				count++;
				if((last=e.touchHold(event,count,last))===false)
					clearInterval(e.iTouchHold);
			},time);
		},wait);
		if((last=e.touchHold(event,count,last))===false)
			clearInterval(e.iTouchHold);
	}).on('touchend.touchhold touchcancel.touchhold','[ontouchhold]',function(event){
		if(this.tTouchHold)
			clearTimeout(this.tTouchHold);
		if(this.iTouchHold)
			clearInterval(this.iTouchHold);
	});
	$.fn.onTouchHold=function(f,time,wait,ns){
		ns='.touchhold'+(ns?'.'+ns:'');
		if(isNaN(time)) time=$.onholdtime;
		if(isNaN(wait)) wait=$.onholdwait;
		return $(this).each(function(i,e){
			if(e.touchHold){
				$(e).off(ns);
				delete e.tTouchHold;
				delete e.iTouchHold;
				delete e.touchHold;
			}
			if(typeof f=='function'){
				e.touchHold=f;
				$(e).on('touchstart'+ns,function(event){
					event.preventDefault();
					if(this.tTouchHold)
						clearTimeout(this.tTouchHold);
					if(this.iTouchHold)
						clearInterval(this.iTouchHold);
					var count=0;
					var last=undefined;
					e.tTouchHold=setTimeout(function(){
						e.iTouchHold=setInterval(function(){
							count++;
							if((last=e.touchHold(event,count,last))===false)
								clearInterval(e.iTouchHold);
						},time);
					},wait);
					if((last=e.touchHold(event,count,last))===false)
						clearInterval(e.iTouchHold);
				}).on('touchend'+ns+' touchcancel'+ns,function(){
					if(this.tTouchHold)
						clearTimeout(this.tTouchHold);
					if(this.iTouchHold)
						clearInterval(this.iTouchHold);
				});
			}
		});
	};
});
