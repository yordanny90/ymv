/*
 * ymv.jquery_util v1.3
 * Fecha: 20161121
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 */
$(function(a){a.execJs=function(a,b,c,d,e,f,g,h){var i="execJS_fn$temp#";if("undefined"!=typeof a[i]){for(var j=0;"undefined"!=typeof a[i+ ++j];);i+=j}var k;try{a[i]=b,k=a[i](c,d,e,f,g,h)}catch(a){console.error(a)}return delete a[i],k},a.fn.execJs=function(b,c,d,e,f,g,h){var i=[];return this.each(function(j,k){i[j]=a.execJs(k,b,c,d,e,f,g,h)}),i},a.fn.execAttr=function(b,c,d,e,f,g,h,i){"string"!=typeof c&&(c="");var j=[];return this.each(function(k,l){if(!a(l).is("["+b+"]["+b+'!=""]'))return j[k]=void 0;try{j[k]=a.execJs(l,Function(c,a(l).attr(b)),d,e,f,g,h,i)}catch(a){console.error(a)}}),j},a.fn.countdown=function(){return this.filter('[countdown][countdown!=""]').each(function(b,c){var d=parseInt(a(c).attr("countdown-count")),e=parseInt(a(c).attr("countdown-time"));isNaN(d)&&(d=1),isNaN(e)&&(e=1e3);var f=Function("count,time",a(c).attr("countdown")),g=Function("",a(c).attr("countdown-end")),h=setInterval(function(){--d>=0?a.execJs(c,f,d,e):d<0&&(clearInterval(h),a.execJs(c,g))},e)}),this}});
