/*
 * JavaScript Hash Event
 * ymv.jhash v1.4
 * Fecha: 20170109
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 */
$(function($){
	if(typeof window['@jhash_ambit']!='object' || !window['@jhash_ambit'])
		window['@jhash_ambit']={};
	/**
	 *
	 * Agrega o retorna un evento jhash del registro.
	 * Si no recibe parámetros, retorn la función para el hash actual
	 * @param id String que identifica al evento. Ejemplo "#echo" para ejecutarse cuando haya un hash que inicie con #echo:
	 * @param fn function. Los parámetros son el resultado del split.
	 * La variable this será el string despues del id.
	 * Para el hash #echo::hola::mundo:...
	 * Los parámetros de la función serán ['hola','mundo:...']
	 * El valor de this será 'hola::mundo:...'
	 * @returns {*}
	 */
	$jhash=function(id,fn){
		if(arguments.length<1)
			return $jhash.ambit[$jhash.getId()];
		else if(arguments.length==1)
			return $jhash.ambit[id];
		else if(arguments.length>1)
			$jhash.ambit[id]=fn;
	};
	/**
	 * Divisor del id y los parámetros de la función
	 * @type {string}
	 */
	$jhash.split='::';
	/**
	 * Conjunto de funciones que se ejecutan según el valor de location.hash
	 */
	$jhash.ambit=window['@jhash_ambit'];
	$jhash.getId=function(){
		return window.location.hash.split($jhash.split,1)[0];
	};
	$jhash.getArgs=function(){
		var args=window.location.hash.split($jhash.split);
		args.shift();
		return args;
	};
	$jhash.getString=function(){
		return window.location.hash.substring($jhash.getId().length+$jhash.split.length);
	};
	/**
	 * Ejecuta la función correspondiente al hash actual.
	 * El acceso a $jhash puede hacerse por la variable this
	 * @returns {*} El retorno de la función
	 */
	$jhash.exec=function(){
		return $jhash.apply($jhash());
	};
	/**
	 * Ejecuta la función que se recibe como parámetro.
	 * @param fn Función que se ejecuta
	 * @returns {*}
	 */
	$jhash.apply=function(fn){
		if(typeof fn=='function'){
			return fn.apply($jhash.getString(),$jhash.getArgs());
		}
	};
	/**
	 * Agrega o elimina el evento para ejecutar las funciones automáticamente
	 * @param auto Si es FALSE elimina el evento
	 * @returns {boolean} TRUE si se agregó el evento, FALSE si se eliminó
	 */
	$jhash.auto=function(auto){
		$(window).off('hashchange.jhash');
		if(auto!==false){
			$(window).on('hashchange.jhash', function(event){
				$jhash.exec();
			});
			return true;
		}
		return false;
	};
});
