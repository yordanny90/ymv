/*
 * JavaScript Bind
 * ymv.jform v1.0
 * Creado: 2017-09-19
 * Modificado: 2017-10-06
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 * Atributos:
 * [jbind] Nombre identificador del jbind. Cuando se ejecuta $.jbind, solo se asignarán valores a los nodos con el mismo nombre de jbind
 * [jbind-party] Nombre del conjunto jbind que actua como un solo nodo
 * [jbind-text] Si existe y el data es string, se hace bind. Si es un script JS, se utiliza el valor devuelto por este
 * [jbind-json] Si existe y el data es un objeto, se hace bind. Si es un script JS, se utiliza el valor devuelto por este
 * [jbind-before] Script JS que se ejecuta antes de los tipos de jbind
 * [jbind-type] Lista de tipos de jbind (seperados por comas) que se ejecutarán par el nodo
 * [jbind-after] Script JS que se ejecuta después de los tipos de jbind
 */
(function($){
	var jbind={
		attr_root: 'jbind',
		types: {},
		bind: function(attr_data_type, odata){
			var el=this;
			if(el.is('['+jbind.attr_once+']'))
				el.attr(jbind.attr_root, null);
			var data=odata;
			if(el.attr(attr_data_type)!=''){
				data=el.jbind_applyAttr(attr_data_type, 'data,odata', [data, odata]);
			}
			if(el.attr(jbind.attr_before)) el.jbind_applyAttr(jbind.attr_before, 'data,odata', [data, odata]);
			if(typeof el.attr(jbind.attr_type)=='string'){
				$.each(el.attr(jbind.attr_type).split(','), function(k, fulltype){
					var type=fulltype, subtype='';
					if(type.search('-')> -1){
						subtype=type.split('-');
						type=subtype.shift();
						subtype=subtype.join('-');
					}
					if($.jbind(type)){
						var typedata=attr_data_type+'-'+fulltype;
						if(typeof el.attr(typedata)=='string' && el.attr(typedata)!=''){
							typedata=el.jbind_applyAttr(typedata, 'data,odata', [data, odata]);
						}else{
							typedata=data;
						}
						el.jbind_applyJs($.jbind(type), [typedata, odata, subtype]);
					}
				});
			}
			if(el.attr(jbind.attr_after)) el.jbind_applyAttr(jbind.attr_after, 'data,odata', [data, odata]);
			return true;
		}
	};
	$.extend(jbind, {
		attr_party: jbind.attr_root+'-party', // Tipo de dato string
		attr_text: jbind.attr_root+'-text', // Tipo de dato string
		attr_json: jbind.attr_root+'-json', // Tipo de dato object
		attr_xml: jbind.attr_root+'-xml', // Tipo de dato xml
		attr_before: jbind.attr_root+'-before', // JS antes de la ejecución de los type
		attr_type: jbind.attr_root+'-type', // Lista de los type separados por comas
		attr_after: jbind.attr_root+'-after', // JS después de la ejecución de los type
		attr_once: jbind.attr_root+'-once' // Los nodos con este atributo ejecutarán el bind solo una vez
	});
	/**
	 * Ejecuta la función JavaScript en los nodos.
	 *     Los argumentos extra se pasan como argumentos a la función
	 * @param {Function} fn Funcion que se ejecutará
	 * @param {Array} oArgs Valores de los argumentos
	 * @returns {*} Retorno del codigo ejecutado en los nodos
	 */
	$.fn.jbind_applyJs=function(fn, oArgs){
		if(typeof fn==='function')
			try{
				return fn.apply(this, oArgs);
			}catch(err){
				console.error(err);
			}
		return undefined;
	};
	/**
	 * Ejecuta la función JavaScript en cada nodo individualmente.
	 *     Los argumentos extra se pasan como argumentos a la función
	 * @param {Function} fn Funcion que se ejecutará
	 * @param {Array} oArgs Valores de los argumentos
	 * @returns {Array} Retornos del codigo ejecutado en cada nodo
	 */
	$.fn.jbind_applyJs_each=function(fn, oArgs){
		var resp=[];
		if(this.length){
			this.each(function(id, el){
				resp[id]=$(el).jbind_applyJs(fn, oArgs);
			});
		}
		return resp;
	};
	/**
	 * Ejecuta el código JavaScript almacenado en un atributo de los nodos.
	 *     Los argumentos extra se pasan como argumentos al código del atributo
	 * @param {string} attr Nombre del atributo
	 * @param {Array|string} args Lista de nombres de argumentos. Array o String separado por comas
	 * @param {Array} oArgs Valores de los argumentos
	 * @returns {*} Retorno del codigo ejecutado en los nodos
	 */
	$.fn.jbind_applyAttr=function(attr, args, oArgs){
		try{
			if(typeof this.attr(attr)=='string' && this.attr(attr)!='')
				return Function(args, this.attr(attr)).apply(this, oArgs);
		}catch(err){
			console.error(err);
		}
		return undefined;
	};
	/**
	 * Ejecuta el código JavaScript almacenado en un atributo de cada nodo individualmente.
	 *     Los argumentos extra se pasan como argumentos al código del atributo
	 * @param {string} attr String. Nombre del atributo
	 * @param {Array|string} args Lista de nombres de argumentos. Array o String separado por comas
	 * @param {Array} oArgs Valores de los argumentos
	 * @returns {Array} Retornos del codigo ejecutado en cada nodo
	 */
	$.fn.jbind_applyAttr_each=function(attr, args, oArgs){
		var resp=[];
		this.each(function(id, el){
			resp[id]=$(el).jbind_applyAttr(attr, args, oArgs);
		});
		return resp;
	};
	$.jbind=function(type, fn){
		if(typeof fn=='function')
			jbind.types[type]=fn;
		if(typeof jbind.types[type]=='function')
			return jbind.types[type];
		return false;
	};
	/**
	 * Extrae un valor del dato inicial.
	 * Para ello utiliza una lista (array) de indices que se recorre en busca del valor,
	 * por cada índice se obtiene un valor, dentro del cual se buscará el siguiente indice, así sucesiva hasta el último índice.
	 * fn({a:'texto'},['a']) devuelve 'texto'
	 * fn({a:'texto'},['a','length']) devuelve 5
	 * fn({a:'texto'},'a.constructor.name') devuelve 'string'
	 * fn({a:'texto'},['x']) devuelve undefined
	 * fn({a:'texto'},'x','') devuelve ''
	 * fn({a:'texto'},'x',null) devuelve null
	 * @param data {*} Dato inicial en el que se buscará el valor.
	 * @param index array|string Lista de indices que se buscarán. Si es un string, se utilizarán los valores separados por puntos
	 * @param notfound {*} Valor que se devuelve si no se encuentra el valor o es de tipo 'undefined'
	 * @return {*}
	 */
	$.jbind_subval=function(data, index, notfound){
		var i;
		if(typeof index=='string') index=index.split('.');
		if(!Array.isArray(index)) index=[];
		while(typeof data!='undefined' && typeof (i=index.shift())!='undefined'){
			data=data[i];
		}
		if(typeof data=='undefined') data=notfound;
		return data;
	};
	/**
	 * Encuentra las llaves en un string
	 * La llave "data" está representada por "{{data}}" en el string
	 * @param str String
	 * @return {{}}
	 */
	$.jbind_findKeys=function(str){
		var regexp=/\{\{([^\{^\}]+)\}\}/;
		var rep={};
		var i=0;
		while((res=regexp.exec(str.substr(i)))){
			rep[res[0]]=res[1];
			i+=res.index+res[0].length;
		}
		return rep;
	};
	/**
	 * Reemplaza las llaves encontradas por medio de $.jbind_findKeys.
	 * Busca el valor de cada llave dentro del objeto data y los reemplaza en el string
	 * @param str string
	 * @param keys object Llaves obtenidas por $.jbind_findKeys
	 * @param data object Objeto de donde se obtiene el reemplazo para cada llave
	 * @return string
	 */
	$.jbind_replaceKeys=function(str, keys, data){
		$.each(keys, function(i, e){
			str=str.split(i).join($.jbind_subval(data, e, ''));
		});
		return str;
	};
	/**
	 * Busca los nodos que pertenecen a un conjunto o party
	 * @param name Nombre del conjunto jbind
	 * @return {*|HTMLElement}
	 */
	$.jbind_getParty=function(name){
		if(typeof name=='string'){
			return $($('['+jbind.attr_party+'="'+name+'"]'));
		}
		return $();
	};
	$.fn.jbind_getName=function(){
		return this.attr(jbind.attr_root);
	};
	/**
	 * Obtiene los nodos que partenecen a un nombre de jbind específico
	 * @param name string Nombre del jbind
	 * @return {*|HTMLElement}
	 */
	$.fn.jbind_getNodes=function(name){
		if(typeof name=='undefined') name='';
		return $(this.filter('['+jbind.attr_root+'="'+name+'"]').add(this.find('['+jbind.attr_root+'="'+name+'"]')));
	};
	/**
	 * @param name Nombre de los jbind a los que se aplicará
	 * @param odata Dato que se aplicará a los jbind
	 * @param useParty Default TRUE.
	 * Si es FALSE, no se incluirá el conjunto jbind [jbind-party].
	 * Si es TRUE, se incluirá la party con el nombre del jbind especificado.
	 * Si es de tipo string, se incluirá la party con el nombre igual a este valor.
	 * @return {*}
	 */
	$.fn.jbind=function(name, odata, useParty){
		if(typeof name!='string') return false;
		var attr_data_type;
		if(typeof odata=='object' && odata!=null){
			if(odata.constructor.name=='XMLDocument'){
				attr_data_type=jbind.attr_xml;
			}else{
				attr_data_type=jbind.attr_json;
			}
		}else if(typeof odata=='string'){
			attr_data_type=jbind.attr_text;
		}else{
			return false;
		}
		var el=this;
		if(useParty || typeof useParty=='undefined'){
			if(typeof useParty!='string') useParty=name;
			el=el.add($.jbind_getParty(useParty));
		}
		var nodes=$(el.jbind_getNodes(name).filter('['+attr_data_type+']'));
		return {root_nodes: el, nodes: nodes, results: nodes.jbind_applyJs_each(jbind.bind, [attr_data_type, odata])};
	};
	$.jbind.my=jbind;
})(jQuery);
/*
 * JavaScript Form
 * ymv.jform v1.0
 * Creado: 2017-09-19
 * Modificado: 2017-10-06
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 * Atributos:
 * [jform]
 *     [method] Método de envío de datos dle formualrio. Default: 'POST'.
 *     [action] Url a la que se envían los datos del formulario. Default: ''.
 *     [enctype] Tipo de codificación de datos enviados por el formulario. Default: 'multipart/form-data'.
 * [jform-party] Nombre del conjunto jform que actua como un solo jform. Los datos dentro de los nodos que tengan el mismo nombre que el jform que se está ejecutando, se incluirán en el request
 * [jform-party_global] Los datos de estos nodos se incluirán en todos los request jform
 * [jform-jbind] Si el jform tiene este atributo, se ejecutará el jbind con la respuesta del request sobre el jform que se está ejecutando
 * [jform-on{event}] Se ejecuta el jform padre con el mismo nombre que el valor de este atributo al ocurrir el evento indicado
 * [jform-one{event}] Se ejecuta el jform padre con el mismo nombre que el valor de este atributo al ocurrir el evento indicado. Solo se ejecuta una vez.
 */
(function($){
	var jform={
		attr_root: 'jform',
		request_fromAttr: {
			// name : attr
			'method': 'method',
			'url': 'action',
			'contentType': 'enctype',
		},
		events: {},
		default_request: {
			/**
			 * Posbles valores:
			 * POST
			 * GET
			 * PUT
			 */
			method: 'POST',
			url: '',
			/**
			 * Posibles valores:
			 * multipart/form-data
			 * application/x-www-form-urlencoded
			 * text/plain
			 * json
			 * json/form-data
			 */
			contentType: 'multipart/form-data'
		},
		default_config: {
			validateInput: function(i, e){
				return $(e).is(':valid,[type=hidden],[readonly]');
			},
			oninvalid: function(xhr, cfg, invalidInputs){
				invalidInputs.each(function(i, e){
					try{
						e.reportValidity();
					}catch(err){
						console.error(err);
					}
				});
			},
			onjbind: function(xhr, data, status){
				if(typeof this.attr(jform.attr_jbind)==='string'){
					this.jbind(this.attr(jform.attr_jbind), data);
				}
			}
		},
		filterInputs: 'input[name][name!=""]:enabled,textarea[name][name!=""]:enabled,select[name][name!=""]:enabled',
		request_byName: {},
		config_byName: {},
		final_request: {
			beforeSend: function(xhr, cfg){
				try{
					if(typeof cfg.jform_config.beforeSend=='function')
						cfg.jform_form.jbind_applyJs(cfg.jform_config.beforeSend, [xhr, cfg]);
					if(!cfg.validInputs){
						xhr.abort();
						if(typeof cfg.jform_config.oninvalid=='function'){
							cfg.jform_form.jbind_applyJs(cfg.jform_config.oninvalid, [xhr, cfg, cfg.invalidInputs]);
						}
					}
					xhr.jform_form=cfg.jform_form;
					xhr.jform_config=cfg.jform_config;
					xhr.responseFields=cfg.responseFields;
				}catch(err){
					console.error('jform.beforeSend');
					console.error(err);
				}
			},
			complete: function(xhr, status){
				var form=xhr.jform_form;
				var config=xhr.jform_config;
				try{
					xhr.JSON=xhr[xhr.responseFields.json];
					xhr.TEXT=xhr[xhr.responseFields.text];
					xhr.XML=xhr[xhr.responseFields.xml];
					var data=undefined;
					if(status=='success'){
						if(typeof xhr.JSON!='undefined'){
							data=form.jbind_applyJs(config['onjson'], [xhr, xhr.JSON, xhr.status]);
							if(typeof data=='undefined') data=xhr.JSON;
						}else if(typeof xhr.XML!='undefined'){
							data=form.jbind_applyJs(config['onxml'], [xhr, xhr.XML, xhr.status]);
							if(typeof data=='undefined') data=xhr.XML;
						}else if(typeof xhr.TEXT!='undefined'){
							data=form.jbind_applyJs(config['ontext'], [xhr, xhr.TEXT, xhr.status]);
							if(typeof data=='undefined') data=xhr.TEXT;
						}
					}
					/**
					 * Posibles valores de status code:
					 * "on200", "on201", "on204", "on500"
					 */
					form.jbind_applyJs(config['on'+xhr.status], [xhr, data, xhr.status]);
					/**
					 * Posibles valores de status:
					 * "success", "notmodified", "nocontent", "error", "timeout", "abort", or "parsererror"
					 */
					form.jbind_applyJs(config['on'+status], [xhr, data, xhr.status]);
					form.jbind_applyJs(config['onjbind'], [xhr, data, xhr.status]);
					form.jbind_applyJs(config['oncomplete'], [xhr, data, xhr.status]);
				}catch(err){
					console.error('jform.complete');
					console.error(err);
				}
				if(typeof form.complete=='function'){
					form.jbind_applyJs(config['complete'], [xhr, status]);
				}
			}
		}
	};
	$.extend(jform, {
		attr_party: jform.attr_root+'-party',
		attr_party_global: jform.attr_root+'-party_global',
		attr_jbind: jform.attr_root+'-jbind',
	});
	$(document).off('.'+jform.attr_root);
	$(document).on('submit.'+jform.attr_root, 'form['+jform.attr_root+']', function(event){
		event.preventDefault();
		$(this).jform_submit();
	});
	$.jform_request=function(name, request){
		if(request && typeof request=='object')
			jform.request_byName[name]=request;
		if(typeof jform.request_byName[name]=='object')
			return jform.request_byName[name];
		return false;
	};
	/**
	 * @param name {string} Nombre de los jform a los que se aplicará la configuración
	 * @param config {object} contiene la lista de eventos, cuyo valor es una función a ejecutar:
	 *
	 *     Valores para el parámetro <b>[config]</b>:
	 *     <b>validateInput</b>: Filtro jQuery para filtrar los inputs válidos
	 *     <b>oninvalid</b>: Cuando algún input tiene un valor inválido
	 *     <b>onjson</b>: Si la respuesta es un objeto JSON. Si devuelve un valor distinto a undefined, este se utilizará como data en las siguientes funciones
	 *     <b>onxml</b>: Si la respuesta es un documento XML. Si devuelve un valor distinto a undefined, este se utilizará como data en las siguientes funciones
	 *     <b>ontext</b>: Si la respuesta es texto plano o html. Si devuelve un valor distinto a undefined, este se utilizará como data en las siguientes funciones
	 *     <b>on{status}</b>: Donde status es el código de status HTTP: 200, 202, 204, 404, 500, ...
	 *     <b>on{statusText}</b>: Donde statusText es el evento disparado por $.ajax: "success", "notmodified", "nocontent", "error", "timeout", "abort", or "parsererror"
	 *     <b>onjbind</b>: Se aplica el $.jbind a la party del actual nodo jform, si el atributo [jform-jbind] tiene un valor.
	 *     <b>oncomplete</b>: Siempres se ejecuta al final del proceso.}
	 *     * Cada función on{..} recibe tres parámetros: xhr, data, statusText.
	 * @return {*}
	 */
	$.jform_config=function(name, config){
		if(config && typeof config=='object')
			jform.config_byName[name]=config;
		if(typeof jform.config_byName[name]=='object')
			return jform.config_byName[name];
		return false;
	};
	$.jform=function(name){
		return $($('['+jform.attr_root+'="'+name+'"]'));
	};
	$.jform_addEvent=function(e, attr, condition){
		if(typeof attr!='string') attr=e;
		var attr_on=jform.attr_root+'-on'+attr,
			attr_one=jform.attr_root+'-one'+attr;
		jform.events[e+'['+attr_one+']']={
			event: e,
			attr: attr_one,
			condition: condition
		};
		$(document).off(e+'.'+jform.attr_root, '['+attr_one+']').on(e+'.'+jform.attr_root, '['+attr_one+']', function(event){
			if(typeof condition=='function' && !$(this).jbind_applyJs(condition, [event])) return false;
			event.stopPropagation();
			$(this).jform_find($(this).attr(attr_one)).jform_submit();
		});
		jform.events[e+'['+attr_on+']']={
			event: e,
			attr: attr_on,
			condition: condition
		};
		$(document).off(e+'.'+jform.attr_root, '['+attr_on+']').on(e+'.'+jform.attr_root, '['+attr_on+']', function(event){
			if(typeof condition=='function' && !$(this).jbind_applyJs(condition, [event])) return false;
			event.stopPropagation();
			$(this).jform_find($(this).attr(attr_on)).jform_submit();
		});
		return {'on': attr_on, 'one': attr_one};
	};
	$.each([
		'afterprint',
		'beforeprint',
		'beforeunload',
		'error',
		'hashchange',
		'load',
		'message',
		'offline',
		'online',
		'pagehide',
		'pageshow',
		'popstate',
		'resize',
		'storage',
		'unload',
		'blur',
		'change',
		'contextmenu',
		'focus',
		'input',
		'invalid',
		'reset',
		'search',
		'select',
		'submit',
		'keydown',
		'keypress',
		'keyup',
		'click',
		'dblclick',
		'mousedown',
		'mousemove',
		'mouseout',
		'mouseover',
		'mouseup',
		'mousewheel',
		'wheel',
		'drag',
		'dragend',
		'dragenter',
		'dragleave',
		'dragover',
		'dragstart',
		'drop',
		'scroll',
		'copy',
		'cut',
		'paste',
		'abort',
		'canplay',
		'canplaythrough',
		'cuechange',
		'durationchange',
		'emptied',
		'ended',
		'error',
		'loadeddata',
		'loadedmetadata',
		'loadstart',
		'pause',
		'play',
		'playing',
		'progress',
		'ratechange',
		'seeked',
		'seeking',
		'stalled',
		'suspend',
		'timeupdate',
		'volumechange',
		'waiting',
		'show',
		'toggle',
	], function(i, e){
		$.jform_addEvent(e);
	});
	//
	$.fn.is_jform=function(){
		return (typeof this.first().attr(jform.attr_root)=='string');
	};
	$.fn.jform_find=function(name){
		if(typeof name!='string') return $();
		var form=$(this.first());
		if(form.jform_getName()!==name){
			form=$(form.parents('['+jform.attr_root+'="'+name+'"]').first());
		}
		return form;
	};
	$.fn.jform_getName=function(){
		return this.attr(jform.attr_root);
	};
	$.jform_getParty=function(name){
		if(typeof name=='string'){
			return $($('['+jform.attr_party+'="'+name+'"]'));
		}
		return $();
	};
	$.jform_getGlobalInputs=function(){
		return $('['+jform.attr_party_global+']').jform_getInputs();
	};
	$.fn.jform_getInputs=function(){
		return $(this.find(jform.filterInputs).add(this.filter(jform.filterInputs)));
	};
	$.fn.jform_getParty=function(){
		return $($.jform_getParty(this.attr(jform.attr_root)).add(this));
	};
	$.fn.jform_getPartyInputs=function(){
		return $.jform_getParty(this.attr(jform.attr_root)).jform_getInputs();
	};
	$.fn.jform_getConfigAjax=function(){
		if(!this.is_jform()) return false;
		var form=$(this.first()),
			req={},
			config={},
			data,
			addVal,
			addNode,
			inputs;
		$.extend(config, jform.default_config, $.jform_config(form.jform_getName()));
		$.extend(req, jform.default_request, $.jform_request(form.jform_getName()));
		$.each(jform.request_fromAttr, function(i, e){
			if(typeof form.attr(e)=='string'){
				req[i]=form.attr(e);
			}
		});
		if(typeof req.beforeSend=='function') config.beforeSend=req.beforeSend;
		if(typeof req.complete=='function') config.complete=req.complete;
		$.extend(req, jform.final_request);
		if(!req.contentType)
			req.contentType='multipart/form-data';
		if(req.contentType=='multipart/form-data' && req.method.toUpperCase()=='POST')
			req.contentType=false;
		if(req.contentType===false){
			req.contentType=false;
			req.method='POST';
			data=new FormData();
			addVal=function(name, value){
				data.append(name, value);
			};
			addNode=function(i, e){
				if(e.files && typeof e.files=='object' && e.files.constructor==FileList){
					$.each(e.files, function(i, file){
						addVal(e.name, file);
					});
				}else{
					try{
						$.each($(e).serializeArray(), function(i, data){
							addVal(data.name, data.value);
						});
					}catch(err){
					}
				}
			};
		}else{
			if(req.contentType=='multipart/form-data'){
				req.contentType='';
			}
			data=[];
			addVal=function(name, value){
				data.push({name: name, value: value});
			};
			if(req.contentType=='json'){
				data={};
				addVal=function(name, value){
					data[name]=value;
				};
			}
			addNode=function(i, e){
				try{
					$.each($(e).serializeArray(), function(i, data){
						addVal(data.name, data.value);
					});
				}catch(err){
				}
			};
		}
		req.processData=(data.constructor!=FormData);
		inputs=form.jform_getInputs();
		partyInputs=form.jform_getPartyInputs().not(inputs);
		req.validInputs=true;
		if(config.validateInput){
			req.invalidInputs=$(inputs.add(partyInputs).not(config.validateInput));
			if(req.invalidInputs.length){
				req.validInputs=false;
			}
		}
		if(typeof req.data=='object'){
			if(Array.isArray(req.data)){
				$.each(req.data, function(i, e){
					if(typeof e=='object' && typeof e.name!='undefined' && typeof e.value!='undefined'){
						addVal(e.name, e.value);
					}
				});
			}else{
				$.each(req.data, addVal);
			}
		}
		$.jform_getGlobalInputs().not(inputs).each(addNode);
		partyInputs.each(addNode);
		inputs.each(addNode);
		if(req.contentType=='json' || req.contentType=='json/form-data'){
			data=JSON.stringify(data);
		}
		req.data=data;
		req.jform_form=form;
		req.jform_config=config;
		return req;
	};
	$.fn.jform_submit=function(){
		if(!this.is_jform()) return false;
		var req=this.jform_getConfigAjax();
		return $.ajax(req);
	};
	$.jform.my=jform;
})(jQuery);
