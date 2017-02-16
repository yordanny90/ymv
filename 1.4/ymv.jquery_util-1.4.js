/*
 * ymv.jquery_util v1.4
 * Fecha: 20170216
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 * Borrados:
 * 		$.execJs
 * Optimizados:
 * 		$.fn.execJs
 * 		$.fn.execAttr
 */
$(function($){
	/**
	 * Ejecuta la función JavaScript en cada nodo.
	 *     Los argumentos extra se pasan como argumentos a la función
	 * @param {Function} fn Funcion que se ejecutará
	 * @returns {Array} Retornos del codigo ejecutado en cada nodo
	 */
	$.fn.execJs=function(fn /* , arg1, arg2, ... Argumentos para la funcion */){
		var resp=[];
		if(this.length){
			var oArgs=$joq(arguments).toArray();
			oArgs.shift();
			this.each(function(id, el){
				try{
					resp[id]=fn.apply(el, oArgs);
				}catch(er){
					console.error(er);
				}
			});
		}
		return resp;
	};
	/**
	 * Ejecuta el código JavaScript almacenado en un atributo del nodo.
	 *     Los argumentos extra se pasan como argumentos al código del atributo
	 * @param {string} attr String. Nombre del atributo
	 * @param {Array|string} args Lista de nombres de argumentos. Array o String separado por comas
	 * @returns {Array} Retornos del codigo ejecutado en cada nodo
	 */
	$.fn.execAttr=function(attr, args /* , arg1, arg2, ... Argumentos para la funcion */){
		if(typeof args!='string' && typeof args!='object' && !args) args=[];
		var oArgs=$joq(arguments).toArray();
		oArgs.shift();
		oArgs.shift();
		var resp=[];
		this.each(function(id, el){
			if(!$(el).is('['+attr+']['+attr+'!=""]')) return (resp[id]=undefined);
			try{
				resp[id]=Function(args, $(el).attr(attr)).apply(el, oArgs);
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
		this.filter('[countdown][countdown!=""]').each(function(k, el){
			var count=parseInt($(el).attr('countdown-count'));
			var time=parseInt($(el).attr('countdown-time'));
			if(isNaN(count)) count=1;
			if(isNaN(time)) time=1000;
			var fnEach=Function('count,time', $(el).attr('countdown'));
			var fnEnd=Function('', $(el).attr('countdown-end'));
			var i=setInterval(function(){
				if(--count>=0)
					fnEach.apply(el, [count, time]);
				else if(count<0){
					clearInterval(i);
					fnEnd.apply(el);
				}
			}, time);
		});
		return this;
	};
});
