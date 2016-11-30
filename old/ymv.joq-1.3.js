/*
 * JavaScript Object Query
 * ymv.joq v1.3
 * Fecha: 20161121
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 */
$joq=(function($joq){
	$joq=function(o){
		if(this.constructor!=$joq) return new $joq(o);
		this.o=o;
	};
	$joq.each=function(o,fn){
		for(var i in o){
			fn(i,o[i],o);
		};
	};
	/**
	 * Devuelve un array de objetos listos para ser enviados por GET o por POST
	 * @param {type} v Valor raiz
	 * @param {type} n Nombre raiz
	 * @returns {Array}
	 */
	$joq.serialize=function(v,n){
		var r=[];
		if(v!=undefined)
		if(typeof v=='string' || typeof v=='number' || typeof v=='boolean' || (typeof v=='object' && (v.constructor==File))){
			r.push({name:n,value:v});
		}else if(typeof v=='object'){
			$joq.each(v,function(i,e){
				r=r.concat($joq.serialize(e,n?n+'['+i+']':i));
			});
		}
		return r;
	};
	$joq.fn=$joq.prototype;
	/**
	 * Devuelve un array de objetos listos para ser enviados por GET o por POST
	 * @param {String} n Nombre del objeto raiz
	 * @returns {Array}
	 */
	$joq.fn.serialize=function(n){
		return $joq.serialize(this.val(),n);
	};
	/**
	 * Convierte un array de objetos listos para ser enviados por GET o por POST en un objeto de javascript
	 * @param {type} s Array de datos: [{name:'...',value:'...'}]
	 * @returns {$joq}
	 */
	$joq.fn.deserialize=function(s){
		var t=this;
		$joq.each(s,function(i,e){
			if(e && typeof e=='object' && typeof e.name=='string'){
				if(e.name.substring(e.name.length-2)=='[]')
					t.add(e.name.substring(0,e.name.length-2).replace(/\]/g,''),e.value,'[');
				else
					t.set(e.name.replace(/\]/g,''),e.value,'[');
			}
		});
		return this;
	};
	/**
	 * Devuelve el valor del objeto
	 * @returns {type}
	 */
	$joq.fn.val=function(){
		return this.o;
	};
	/**
	 * Devuelve el valor ubicado en el arbol especificado como un string separado por puntos
	 * @param {string} k Llave del valor
	 * @param {string} split Separador. Default="."
	 * @returns {type}
	 */
	$joq.fn.get=function(k,split){
		var t=this.val();
		if(typeof split!='string') split='.';
		$joq.each(k.split(split),function(i,e){
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
	 * @param {type} k Llave del valor
	 * @param {type} v Valor
	 * @param {type} split Separador. Default="."
	 */
	$joq.fn.add=function(k,v,split){
		var t=this.val();
		if(typeof split!='string') split='.';
		var s=k.split(split);
		$joq.each(s,function(i,e){
			if(t){
				if(s.length-1==i){
					if(typeof t[e]=='undefined' || t[e]==null){
						t[e]=[];
					}
					if(typeof t[e]=='object' && t[e].constructor==Array){
						t[e].push(v);
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
	 * @param {type} k Llave del valor
	 * @param {type} v Valor
	 * @param {type} split Separador. Default="."
	 */
	$joq.fn.set=function(k,v,split){
		var t=this.val();
		if(typeof split!='string') split='.';
		var s=k.split(split);
		$joq.each(s,function(i,e){
			if(t){
				if(s.length-1==i){
					t[e]=v;
				}else if(!t[e]){
					t[e]={};
				}
				t=t[e];
			}
		});
		return this;
	};
	/**
	 * Elimina el valor ubicado en el arbol especificado como un string separado por puntos
	 * @param {type} k Llave del valor
	 * @param {type} split Separador. Default="."
	 */
	$joq.fn.unset=function(k,split){
		var t=this.val();
		if(typeof split!='string') split='.';
		var s=k.split(split);
		var d=false;
		$joq.each(s,function(i,e){
			if(t){
				if(s.length-1==i){
					delete t[e];
					d=true;
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
	 * Copia todos los valores en o en un objeto nuevo
	 * El índice: k es una funcion que recibe a (o,i) donde i es el indice que se recorre. La función devuelve el indice en el que se asignará.
	 * El valor : v es una funcion que recibe a (o,i) donde i es el indice que se recorre. La función devuelve el valor que se asignará.
	 * El filtro: f es una funcion que recibe a (o,i) donde i es el indice que se recorre. TRUE se puede agregar, FALSE no se puede agregar
	 * @returns {$joq}
	 */
	$joq.fn.select=function(k,v,f){
		var o=this.val();
		if(typeof f!='function') f=function(){return true};
		if(typeof v!='function') v=function(o,i){return o[i]};
		if(typeof k!='function') k=function(o,i){return i};
		var n=new Object();
		$joq.each(o,function(i){
			if(f(o,i))
				n[k(o,i)]=v(o,i);
		});
		return $joq(n);
	};
	/**
	 * Copia todos los valores diferentes a undefined en o a un objeto nuevo
	 * El índice: k es una funcion que recibe a (o,i) donde i es el indice que se recorre. La funcion devuelve el indice que se eliminará. Default: return i;
	 * El valor : v es una funcion que recibe a (o,i) donde i es el indice que se recorre. La función devuelve el valor que se asignará.
	 * El filtro: f es una funcion que recibe a (o,i) donde i es el indice que se recorre. TRUE se puede agregar, FALSE no se puede agregar
	 * @returns {$joq}
	 */
	$joq.fn.selectDefined=function(k,v,f){
		if(typeof f!='function') f=function(){return true};
		return this.select(k,v,function(o,i){
			return (typeof o[i]!='undefined' && f(o,i));
		});
	};
	/**
	 * Copia todos los valores iguales a undefined en o a un objeto nuevo
	 * El índice: k es una funcion que recibe a (o,i) donde i es el indice que se recorre. La funcion devuelve el indice que se eliminará. Default: return i;
	 * El valor : v es una funcion que recibe a (o,i) donde i es el indice que se recorre. La función devuelve el valor que se asignará.
	 * El filtro: f es una funcion que recibe a (o,i) donde i es el indice que se recorre. TRUE se puede agregar, FALSE no se puede agregar
	 * @returns {$joq}
	 */
	$joq.fn.selectUndefined=function(k,v,f){
		if(typeof f!='function') f=function(){return true};
		return this.select(k,v,function(o,i){
			return (typeof o[i]=='undefined' && f(o,i));
		});
	};
	/**
	 * Modifica únicamente los valores existentes en o.
	 * Solo los valores definidos en s serán actualizados en o.
	 * El índice: k es una funcion que recibe a (o,s,i) donde i es el indice que se recorre. La funcion devuelve el indice que se eliminará. Default: return i;
	 * El valor : v es una funcion que recibe a (o,s,i) donde i es el indice que se recorre. La función devuelve el valor que se asignará.
	 * El filtro: f es una funcion que recibe a (o,s,i) donde i es el indice que se recorre. TRUE se puede modificar, FALSE no se puede modificar
	 * @returns {$joq}
	 */
	$joq.fn.update=function(s0,k,v,f){
		if(!s0 || typeof s0!='object') return this;
		var o=this.val();
		if(s0.constructor==$joq) var s=s0.val(); else var s=s0;
		if(typeof f!='function') f=function(o,s,i){return typeof s[i]!='undefined'};
		if(typeof v!='function') v=function(o,s,i){return s[i]};
		if(typeof k!='function') k=function(o,s,i){return i};
		$joq.each(o,function(i){
			if(f(o,s,i))
				o[k(o,s,i)]=v(o,s,i);
		});
		return this;
	};
	/**
	 * Inserta los valores de s en el objeto o.
	 * Solo los valores undefined en o serán asignados.
	 * El índice: k es una funcion que recibe a (o,s,i) donde i es el indice que se recorre. La funcion devuelve el indice que se eliminará. Default: return i;
	 * El valor : v es una funcion que recibe a (o,s,i) donde i es el indice que se recorre. La función devuelve el valor que se asignará.
	 * El filtro: f es una funcion que recibe a (o,s,i) donde i es el indice que se recorre. TRUE se puede insertar, FALSE no se puede insertar
	 * @returns {$joq}
	 */
	$joq.fn.insert=function(s0,k,v,f){
		if(!s0 || typeof s0!='object') return this;
		var o=this.val();
		if(s0.constructor==$joq) var s=s0.val(); else var s=s0;
		if(typeof f!='function') f=function(){return true};
		if(typeof v!='function') v=function(o,s,i){return s[i]};
		if(typeof k!='function') k=function(o,s,i){return i};
		$joq.each(s,function(i){
			if(typeof o[i]=='undefined' && f(o,s,i))
				o[k(o,s,i)]=v(o,s,i);
		});
		return this;
	};
	/**
	 * Elimina los valores del o.
	 * Solo los indices en o que existan en s se eliminarán.
	 * El índice: k es una funcion que recibe a (o,s,i) donde i es el indice que se recorre. La funcion devuelve el indice que se eliminará. Default: return i;
	 * El filtro: f es una funcion que recibe a (o,s,i) donde i es el indice que se recorre. TRUE se puede eliminar, FALSE no se puede eliminar
	 * @returns {$joq}
	 */
	$joq.fn.delete=function(s0,k,f){
		if(!s0 || typeof s0!='object') return this;
		var o=this.val();
		if(s0.constructor==$joq) var s=s0.val(); else var s=s0;
		if(typeof f!='function') f=function(){return true};
		if(typeof k!='function') k=function(o,s,i){return i};
		$joq.each(s,function(i){
			if(f(o,s,i))
				delete o[k(o,s,i)];
		});
		return this;
	};
	/**
	 * Copia todos los valores de {s} a {o}.
	 * El índice: k es una funcion que recibe a (o,s,i) donde i es el indice que se recorre. La función devuelve el indice en el que se asignará.
	 * El valor : v es una funcion que recibe a (o,s,i) donde i es el indice que se recorre. La función devuelve el valor que se asignará.
	 * El filtro: f es una funcion que recibe a (o,s,i) donde i es el indice que se recorre. TRUE se puede agregar, FALSE no se puede agregar
	 * @returns {$joq}
	 */
	$joq.fn.merge=function(s0,k,v,f){
		if(!s0 || typeof s0!='object') return this;
		var o=this.val();
		if(s0.constructor==$joq) var s=s0.val(); else var s=s0;
		if(typeof f!='function') f=function(o,s,i){return typeof s[i]!='undefined'};
		if(typeof v!='function') v=function(o,s,i){return s[i]};
		if(typeof k!='function') k=function(o,s,i){return i};
		$joq.each(s,function(i){
			if(f(o,s,i))
				o[k(o,s,i)]=v(o,s,i);
		});
		return this;
	};
	return $joq;
})();
