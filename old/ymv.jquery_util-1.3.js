/*
 * ymv.jquery_util v1.3
 * Fecha: 20161121
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 */
$(function($){
	$.execJs=function(ob,fn,a,b,c,d,e,f){
		var id='execJS_fn$temp#';
		if(typeof ob[id]!='undefined'){
			var co=0;
			while(typeof ob[id+(++co)]!='undefined');
			id+=co;
		}
		var resp;
		try {
			ob[id]=fn;
			resp=ob[id](a,b,c,d,e,f);
		}catch(er){
			console.error(er);
		}
		delete ob[id];
		return resp;
	};
	$.fn.execJs=function(fn,a,b,c,d,e,f){
		var resp=[];
		this.each(function(id,el){
			resp[id]=$.execJs(el,fn,a,b,c,d,e,f);
		});
		return resp;
	};
	$.fn.execAttr=function(attr,args,a,b,c,d,e,f){
		if(typeof args!='string') args='';
		var resp=[];
		this.each(function(id,el){
			if(!$(el).is('['+attr+']['+attr+'!=""]')) return (resp[id]=undefined);
			try{
				resp[id]=$.execJs(el,Function(args,$(el).attr(attr)),a,b,c,d,e,f);
			}catch(er){
				console.error(er);
			}
		});
		return resp;
	};
	/**
	 * Ejecuta un codigo javascript n veces hasta que el conteo termine.
	 * Atributos:
	 * [countdown] Código javascript. Recibe el parametro count y time en cada iteracion
	 * [countdown-end] Código javascript que se ejecuta al finalizar
	 * [countdown-count] Numero del conteo inicial. Default: 1
	 * [countdown-time] Tiempo de espera en microsegundos entre cada iteracion. Default: 1000
	 * @returns {jQuery}
	 */
	$.fn.countdown=function(){
		this.filter('[countdown][countdown!=""]').each(function(k,el){
			var count=parseInt($(el).attr('countdown-count'));
			var time=parseInt($(el).attr('countdown-time'));
			if(isNaN(count)) count=1;
			if(isNaN(time)) time=1000;
			var fnEach=Function('count,time',$(el).attr('countdown'));
			var fnEnd=Function('',$(el).attr('countdown-end'));
			var i=setInterval(function(){
				if(--count>=0)
					$.execJs(el,fnEach,count,time);
				else if(count<0){
					clearInterval(i);
					$.execJs(el,fnEnd);
				}
			},time);
		})
		return this;
	};
});
