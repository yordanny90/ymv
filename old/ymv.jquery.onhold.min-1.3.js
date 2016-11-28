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
$(function(a){a.onholdwait=500,a.onholdtime=30,a(document).on("mousedown.hold touchstart.hold","[onhold]",function(b){"touchstart"==b.type&&b.preventDefault(),this.hold=new Function("event,count,last",a(this).attr("onhold"));var c=isNaN(parseFloat(a(this).attr("onhold-time")))?a.onholdtime:parseFloat(a(this).attr("onhold-time")),d=isNaN(parseFloat(a(this).attr("onhold-wait")))?a.onholdwait:parseFloat(a(this).attr("onhold-wait"));this.tHold&&clearTimeout(this.tHold),this.iHold&&clearInterval(this.iHold);var e=0,f=this,g=void 0;f.tHold=setTimeout(function(){f.iHold=setInterval(function(){e++,(g=f.hold(b,e,g))===!1&&clearInterval(f.iHold)},c)},d),(g=f.hold(b,e,g))===!1&&clearInterval(f.iHold)}).on("mouseup.hold mouseout.hold touchend.hold touchcancel.hold","[onhold]",function(a){this.tHold&&clearTimeout(this.tHold),this.iHold&&clearInterval(this.iHold)}),a.fn.onHold=function(b,c,d,e){return e=".hold"+(e?"."+e:""),isNaN(c)&&(c=a.onholdtime),isNaN(d)&&(d=a.onholdwait),a(this).each(function(f,g){g.hold&&(a(g).off(e),delete g.tHold,delete g.iHold,delete g.hold),"function"==typeof b&&(g.hold=b,a(g).on("mousedown"+e+" touchstart"+e,function(a){this.tHold&&clearTimeout(this.tHold),this.iHold&&clearInterval(this.iHold);var b=0,e=void 0;g.tHold=setTimeout(function(){g.iHold=setInterval(function(){b++,(e=g.hold(a,b,e))===!1&&clearInterval(g.iHold)},c)},d),(e=g.hold(a,b,e))===!1&&clearInterval(g.iHold)}).on("mouseup"+e+" mouseout"+e+" touchend"+e+" touchcancel"+e,function(){this.tHold&&clearTimeout(this.tHold),this.iHold&&clearInterval(this.iHold)}))})},a(document).on("mousedown.mousehold","[onmousehold]",function(b){this.mouseHold=new Function("event,count,last",a(this).attr("onmousehold"));var c=isNaN(parseFloat(a(this).attr("onmousehold-time")))?a.onholdtime:parseFloat(a(this).attr("onmousehold-time")),d=isNaN(parseFloat(a(f).attr("onmousehold-wait")))?a.onholdwait:parseFloat(a(f).attr("onmousehold-wait"));this.tMouseHold&&clearTimeout(this.tMouseHold),this.iMouseHold&&clearInterval(this.iMouseHold);var e=0,f=this,g=void 0;f.tMouseHold=setTimeout(function(){f.iMouseHold=setInterval(function(){e++,(g=f.mouseHold(b,e,g))===!1&&clearInterval(f.iMouseHold)},c)},d),(g=f.mouseHold(b,e,g))===!1&&clearInterval(f.iMouseHold)}).on("mouseup.mousehold mouseout.mousehold","[onmousehold]",function(a){this.tMouseHold&&clearTimeout(this.tMouseHold),this.iMouseHold&&clearInterval(this.iMouseHold)}),a.fn.onMouseHold=function(b,c,d,e){return e=".mousehold"+(e?"."+e:""),isNaN(c)&&(c=a.onholdtime),isNaN(d)&&(d=a.onholdwait),a(this).each(function(f,g){g.mouseHold&&(a(g).off(e),delete g.tMouseHold,delete g.iMouseHold,delete g.mouseHold),"function"==typeof b&&(g.mouseHold=b,a(g).on("mousedown"+e,function(a){this.tMouseHold&&clearTimeout(this.tMouseHold),this.iMouseHold&&clearInterval(this.iMouseHold);var b=0,e=void 0;g.tMouseHold=setTimeout(function(){g.iMouseHold=setInterval(function(){b++,(e=g.mouseHold(a,b,e))===!1&&clearInterval(g.iMouseHold)},c)},d),(e=g.mouseHold(a,b,e))===!1&&clearInterval(g.iMouseHold)}).on("mouseup"+e+" mouseout"+e,function(){this.tMouseHold&&clearTimeout(this.tMouseHold),this.iMouseHold&&clearInterval(this.iMouseHold)}))})},a(document).on("touchstart.touchhold","[ontouchhold]",function(b){b.preventDefault(),this.touchHold=new Function("event,count,last",a(this).attr("ontouchhold"));var c=isNaN(parseFloat(a(this).attr("ontouchhold-time")))?a.onholdtime:parseFloat(a(this).attr("ontouchhold-time")),d=isNaN(parseFloat(a(f).attr("ontouchhold-wait")))?a.onholdwait:parseFloat(a(f).attr("ontouchhold-wait"));this.tTouchHold&&clearTimeout(this.tTouchHold),this.iTouchHold&&clearInterval(this.iTouchHold);var e=0,f=this,g=void 0;f.tTouchHold=setTimeout(function(){f.iTouchHold=setInterval(function(){e++,(g=f.touchHold(b,e,g))===!1&&clearInterval(f.iTouchHold)},c)},d),(g=f.touchHold(b,e,g))===!1&&clearInterval(f.iTouchHold)}).on("touchend.touchhold touchcancel.touchhold","[ontouchhold]",function(a){this.tTouchHold&&clearTimeout(this.tTouchHold),this.iTouchHold&&clearInterval(this.iTouchHold)}),a.fn.onTouchHold=function(b,c,d,e){return e=".touchhold"+(e?"."+e:""),isNaN(c)&&(c=a.onholdtime),isNaN(d)&&(d=a.onholdwait),a(this).each(function(f,g){g.touchHold&&(a(g).off(e),delete g.tTouchHold,delete g.iTouchHold,delete g.touchHold),"function"==typeof b&&(g.touchHold=b,a(g).on("touchstart"+e,function(a){a.preventDefault(),this.tTouchHold&&clearTimeout(this.tTouchHold),this.iTouchHold&&clearInterval(this.iTouchHold);var b=0,e=void 0;g.tTouchHold=setTimeout(function(){g.iTouchHold=setInterval(function(){b++,(e=g.touchHold(a,b,e))===!1&&clearInterval(g.iTouchHold)},c)},d),(e=g.touchHold(a,b,e))===!1&&clearInterval(g.iTouchHold)}).on("touchend"+e+" touchcancel"+e,function(){this.tTouchHold&&clearTimeout(this.tTouchHold),this.iTouchHold&&clearInterval(this.iTouchHold)}))})}});
