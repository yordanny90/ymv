/*
 * Javascript Fix Console
 * ymv.fix v1.3
 * Fecha: 20161121
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 */
//	Crea el objeto console, y agrega las funciones faltantes para evitar errores en browsers que no soportan este objeto
$(function($){
	if(typeof console!='object') console=new Object();
	$joq(console).insert({
		debug:function(){},
		error:function(){},
		info:function(){},
		log:function(){},
		warn:function(){},
		dir:function(){},
		dirxml:function(){},
		group:function(){},
		groupCollapsed:function(){},
		groupEnd:function(){},
		clear:function(){},
		count:function(){},
		assert:function(){},
		profile:function(){},
		profileEnd:function(){},
		time:function(){},
		timeEnd:function(){},
		timeStamp:function(){},
	});
});