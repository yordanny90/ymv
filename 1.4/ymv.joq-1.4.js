/**
 * JavaScript Object Query
 * ymv.joq v1.4
 * Fecha: 20170216
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 */
$joq=(function(){
	/**
	 * @param {Array|Object} origin Datos que se utilizarán
	 * @return {$joq}
	 */
	var $joq=function(origin){
		if(this.constructor!=$joq) return new $joq(origin);
		this.origin=origin;
	};
	/**
	 * 
	 * @param o Objeto que se recorre
	 * @param fn Función que se ejecuta por cada elemento del objeto, recibe los parámetros (llave, valor, objeto, idLlave)
	 * Para {a:'val1', b:'val2'} la función se ejecutará de la siguiente forma:
	 * fn('a', 'val1', {a:'val1', b:'val2'}, 0);
	 * fn('b', 'val2', {a:'val1', b:'val2'}, 1);
	 */
	$joq.each=function(o,fn){
		Object.keys(o).filter(function(e,i){
			fn(e,o[e],o,i);
		});
	};
	/**
	 * Convierte un array de objetos listos para ser enviados por GET o por POST en un objeto de javascript
	 * @param {Array} data Array de datos: [{name:'...',value:'...'}]
	 * @returns {Object}
	 */
	$joq.deserialize=function(data){
		return $joq(data).deserialize();
	};
	/**
	 * Devuelve un array de objetos listos para ser enviados por GET o por POST
	 * @param {Object} data Valor raiz
	 * @param {String} name Nombre raiz
	 * @returns {Array}
	 */
	$joq.serialize=function(data,name){
		var r=[];
		if(data!=undefined){
			if(typeof data=='string' || typeof data=='number' || typeof data=='boolean' || (typeof data=='object' && (data.constructor==File))){
				r.push({name: name, value: data});
			}else if(typeof data=='object'){
				$joq.each(data, function(i, e){
					r=r.concat($joq.serialize(e, name ? name+'['+i+']' : i));
				});
			}
		}
		return r;
	};
	$joq.fn=$joq.prototype;
	/**
	 * Devuelve un array de objetos listos para ser enviados por GET o por POST
	 * @param {String} name Nombre del objeto raiz
	 * @returns {Array}
	 */
	$joq.fn.serialize=function(name){
		return $joq.serialize(this.val(),name);
	};
	/**
	 * Convierte un array de objetos listos para ser enviados por GET o por POST en un objeto de javascript
	 * @returns {Object}
	 */
	$joq.fn.deserialize=function(){
		var t=$joq({});
		$joq.each(this.val(),function(i,e){
			if(e && typeof e=='object' && typeof e.name=='string'){
				if(e.name.substring(e.name.length-2)=='[]')
					t.add(e.name.substring(0,e.name.length-2).replace(/\]/g,''),e.value,'[');
				else
					t.set(e.name.replace(/\]/g,''),e.value,'[');
			}
		});
		return t.val();
	};
	/**
	 * Devuelve el valor del objeto
	 * @returns {type}
	 */
	$joq.fn.val=function(){
		return this.origin;
	};
	/**
	 * Devuelve el valor ubicado en el arbol especificado como un string separado por puntos
	 * @param {string} key Llave del valor
	 * @param {string} split Separador. Default="."
	 * @returns {type}
	 */
	$joq.fn.get=function(key,split){
		var t=this.val();
		if(typeof split!='string') split='.';
		$joq.each(key.split(split),function(i,e){
			if(t && typeof t=='object'){
				t=t[e];
			}else{
				t=undefined;
			}
		});
		return t;
	};
	/**
	 * Agrega un valor ubicado en el arbol especificado como un string separado por puntos.
	 * Si existe un array: agrega el valor a ese array.
	 * Si es undefined: crea un array y agrega el valor.
	 * Si existe otro valor que no es array: no modifica el objeto.
	 * @param {String} key Llave del valor
	 * @param {type} value Valor
	 * @param {String} split Separador. Default="."
	 */
	$joq.fn.add=function(key,value,split){
		var t=this.val();
		if(typeof split!='string') split='.';
		var s=key.split(split);
		$joq.each(s,function(i,e){
			if(t){
				if(s.length-1==i){
					if(typeof t[e]=='undefined' || t[e]==null){
						t[e]=[];
					}
					if(typeof t[e]=='object' && t[e].constructor==Array){
						t[e].push(value);
					}
				}else if(!t[e]){
					t[e]={};
				}
				t=t[e];
			}
		});
		return this;
	};
	/**
	 * Asigna un valor ubicado en el arbol especificado como un string separado por puntos
	 * @param {String} key Llave del valor
	 * @param {type} value Valor
	 * @param {String} split Separador. Default="."
	 */
	$joq.fn.set=function(key,value,split){
		var t=this.val();
		if(typeof split!='string') split='.';
		var s=key.split(split);
		$joq.each(s,function(i,e){
			if(t){
				if(s.length-1==i){
					t[e]=value;
				}else if(!t[e]){
					t[e]={};
				}
				t=t[e];
			}
		});
		return this;
	};
	/**
	 * Elimina el valor ubicado en el arbol especificado como un string separado por puntos.
	 * Devuelve el valor eliminado o undefined si no se encuentra.
	 * @param {String} key Llave del valor
	 * @param {String} split Separador. Default="."
	 * @return {type}
	 */
	$joq.fn.unset=function(key,split){
		var t=this.val();
		if(typeof split!='string') split='.';
		var s=key.split(split);
		var d=undefined;
		$joq.each(s,function(i,e){
			if(t){
				if(s.length-1==i){
					d=t[e];
					delete t[e];
				}
				t=t[e];
			}
		});
		return d;
	};
	$joq.fn.valueAsIndex=function(){
		return this.select(function(o,i){return o[i]},function(o,i){return i});
	};
	/**
	 * Copia todos los valores en un objeto nuevo
	 * @param {Function} key es una funcion que recibe a (origin, index). La función devuelve el indice en el que se asignará.
	 * @param {Function} value es una funcion que recibe a (origin, index). La función devuelve el valor que se asignará.
	 * @param {Function} filter es una funcion que recibe a (origin, index). TRUE se agrega, FALSE no se agrega.
	 * @return {$joq}
	 */
	$joq.fn.select=function(key,value,filter){
		var o=this.val();
		if(typeof filter!='function') filter=function(){return true};
		if(typeof value!='function') value=function(o,i){return o[i]};
		if(typeof key!='function') key=function(o,i){return i};
		var n={};
		$joq.each(o,function(i,e,o){
			if(filter(o,i))
				n[key(o,i)]=value(o,i);
		});
		return $joq(n);
	};
	/**
	 * Copia todos los valores diferentes a undefined en origin a un objeto nuevo
	 * @param {Function} key es una funcion que recibe a (origin, index). La función devuelve el indice en el que se asignará.
	 * @param {Function} value es una funcion que recibe a (origin, index). La función devuelve el valor que se asignará.
	 * @param {Function} filter es una funcion que recibe a (origin, index). TRUE se agrega, FALSE no se agrega.
	 * @returns {$joq}
	 */
	$joq.fn.selectDefined=function(key,value,filter){
		if(typeof filter!='function') filter=function(){return true};
		return this.select(key,value,function(o,i){
			return (typeof o[i]!='undefined' && filter(o,i));
		});
	};
	/**
	 * Copia todos los valores iguales a undefined en origin a un objeto nuevo
	 * @param {Function} key es una funcion que recibe a (origin, index). La función devuelve el indice en el que se asignará.
	 * @param {Function} value es una funcion que recibe a (origin, index). La función devuelve el valor que se asignará.
	 * @param {Function} filter es una funcion que recibe a (origin, index). TRUE se agrega, FALSE no se agrega.
	 * @returns {$joq}
	 */
	$joq.fn.selectUndefined=function(key,value,filter){
		if(typeof filter!='function') filter=function(){return true};
		return this.select(key,value,function(o,i){
			return (typeof o[i]=='undefined' && filter(o,i));
		});
	};
	/**
	 * Modifica únicamente los valores existentes en origin.
	 * Solo los valores definidos en source serán actualizados en origin.
	 * @param {Object|Array} source es el Objeto o arreglo de datos usados en este proceso.
	 * @param {Function} key es una funcion que recibe a (origin, source, index). La función devuelve el indice en el que se asignará.
	 * @param {Function} value es una funcion que recibe a (origin, source, index). La función devuelve el valor que se asignará.
	 * @param {Function} filter es una funcion que recibe a (origin, source, index). TRUE se agrega, FALSE no se agrega.
	 * @returns {$joq}
	 */
	$joq.fn.update=function(source,key,value,filter){
		if(!source || typeof source!='object') return this;
		var o=this.val();
		if(source.constructor==$joq) var s=source.val(); else var s=source;
		if(typeof filter!='function') filter=function(o,s,i){return typeof s[i]!='undefined'};
		if(typeof value!='function') value=function(o,s,i){return s[i]};
		if(typeof key!='function') key=function(o,s,i){return i};
		$joq.each(o,function(i,e,o){
			if(filter(o,s,i))
				o[key(o,s,i)]=value(o,s,i);
		});
		return this;
	};
	/**
	 * Inserta los valores de source en el objeto origin.
	 * Solo los valores undefined en origin serán asignados.
	 * @param {Object|Array} source es el Objeto o arreglo de datos usados en este proceso.
	 * @param {Function} key es una funcion que recibe a (origin, source, index). La función devuelve el indice en el que se asignará.
	 * @param {Function} value es una funcion que recibe a (origin, source, index). La función devuelve el valor que se asignará.
	 * @param {Function} filter es una funcion que recibe a (origin, source, index). TRUE se agrega, FALSE no se agrega.
	 * @returns {$joq}
	 */
	$joq.fn.insert=function(source,key,value,filter){
		if(!source || typeof source!='object') return this;
		var o=this.val();
		if(source.constructor==$joq) var s=source.val(); else var s=source;
		if(typeof filter!='function') filter=function(){return true};
		if(typeof value!='function') value=function(o,s,i){return s[i]};
		if(typeof key!='function') key=function(o,s,i){return i};
		$joq.each(s,function(i,e,s){
			if(typeof o[i]=='undefined' && filter(o,s,i))
				o[key(o,s,i)]=value(o,s,i);
		});
		return this;
	};
	/**
	 * Elimina los valores del origin.
	 * Solo los indices en origin que existan en source se eliminarán.
	 * @param {Object|Array} source es el Objeto o arreglo de datos usados en este proceso.
	 * @param {Function} key es una funcion que recibe a (origin, source, index). La función devuelve el indice que se eliminará.
	 * @param {Function} filter es una funcion que recibe a (origin, source, index). TRUE se agrega, FALSE no se agrega.
	 * @returns {$joq}
	 */
	$joq.fn['delete']=function(source,key,filter){
		if(!source || typeof source!='object') return this;
		var o=this.val();
		if(source.constructor==$joq) var s=source.val(); else var s=source;
		if(typeof filter!='function') filter=function(){return true};
		if(typeof key!='function') key=function(o,s,i){return i};
		$joq.each(s,function(i,e,s){
			if(filter(o,s,i))
				delete o[key(o,s,i)];
		});
		return this;
	};
	/**
	 * Copia todos los valores de source a origin.
	 * @param {Object|Array} source es el Objeto o arreglo de datos usados en este proceso.
	 * @param {Function} key es una funcion que recibe a (origin, source, index). La función devuelve el indice en el que se asignará.
	 * @param {Function} value es una funcion que recibe a (origin, source, index). La función devuelve el valor que se asignará.
	 * @param {Function} filter es una funcion que recibe a (origin, source, index). TRUE se agrega, FALSE no se agrega.
	 * @returns {$joq}
	 */
	$joq.fn.merge=function(source,key,value,filter){
		if(!source || typeof source!='object') return this;
		var o=this.val();
		if(source.constructor==$joq) var s=source.val(); else var s=source;
		if(typeof filter!='function') filter=function(o,s,i){return typeof s[i]!='undefined'};
		if(typeof value!='function') value=function(o,s,i){return s[i]};
		if(typeof key!='function') key=function(o,s,i){return i};
		$joq.each(s,function(i,e,s){
			if(filter(o,s,i))
				o[key(o,s,i)]=value(o,s,i);
		});
		return this;
	};
	/**
	 * Genera un arreglo con todos los valores de {o}
	 * @return {Array}
	 */
	$joq.fn.toArray=function(){
		var r=[];
		$joq.each(this.val(),function(i,e,o,n){
			r.push(e);
		});
		return r;
	};
	return $joq;
})();
