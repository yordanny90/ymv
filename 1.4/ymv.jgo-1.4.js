/*
 * JavaScript Get Object
 * ymv.jgo v1.4
 * Fecha: 20170216
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 */
$jgo=(function($){
	if(!window['@jgo_ambit'] || typeof window['@jgo_ambit']!='object')
		window['@jgo_ambit']={};
	var ambit=window['@jgo_ambit'];
	var $jgo=function(opts,cfg,save){
		if(arguments.length==1 && typeof opts=='string' && ambit[opts])
			return ambit[opts];
		if(this.constructor!=$jgo){
			o=new $jgo();
			$jgo.init.apply(o, arguments);
			// Almacenar
			if(save)
				ambit[typeof save=='string'?save:o.opts.ambit]=o;
			return o;
		}
	};
	$jgo.init=function(opts,cfg){
		if(!opts || (typeof opts!='string' && typeof opts!='object') || (typeof opts=='object' && !opts.ambit))
			throw new Error('Missing: opts.ambit');
		if(typeof cfg=='string') cfg={url:cfg};
		if(typeof cfg.beforeSend!='undefined')
			throw new Error('Do not update: cfg.beforeSend');
		if(typeof cfg.complete!='undefined')
			throw new Error('Do not update: cfg.complete');
		this.cfg=$joq($jgo.default_cfg).select().merge(cfg).val();
		// Opciones JGO
		if(typeof opts=='string') opts={ambit:opts};
		this.opts=$joq($jgo.default_opts).select().update(opts).val();
		this.opts.root=$((this.opts.root?this.opts.root:document));
		// Fix properties
		this.attrs={};
		this.attrsdom={};
	};
	$jgo.default_opts={
		dom:'jgo',
		ambit:'',
		root:false,
		saveXHR:false,
		validate: false,
		validFilter:function(i,e){
			return $(e).is(':valid,[type=hidden]');
		},
		enabledFilter:':enabled',
	};
	$jgo.default_cfg={
		method:'POST',
		processData:false,
		contentType:false,
		url:window.location.href,
		beforeSend:function(xhr,cfg){
			try{
				cfg.jgo.node('beforesend', true).execAttr(cfg.jgo.attr('beforesend'), 'jgo,xhr,cfg', cfg.jgo, xhr, cfg);
				xhr.jgo=cfg.jgo;
				xhr.responseFields=cfg.responseFields;
			}catch(err){
				console.error('beforeSend');
				console.error(err);
				alert(err);
			}
		},
		complete:function(xhr,status){
			try{
				var jgo=xhr.jgo;
				jgo.log=[];
				jgo.log.begin=Date.now();
				xhr.JSON=xhr[xhr.responseFields.json];
				xhr.TEXT=xhr[xhr.responseFields.text];
				xhr.XML=xhr[xhr.responseFields.xml];
				jgo.node(status).execAttr(jgo.attr(status), 'jgo,xhr,status', jgo, xhr, status);
				if(status=='success'){
					if(typeof xhr.JSON!='undefined'){
						jgo.node('onjson').execAttr(jgo.attr('onjson'), 'jgo,json,xhr,status', jgo, xhr.JSON, xhr, status);
						jgo.setJSON(xhr.JSON);
					}else if(typeof xhr.XML!='undefined'){
						jgo.node('onxml').execAttr(jgo.attr('onxml'), 'jgo,xml,xhr,status', jgo, xhr.XML, xhr, status);
						jgo.setXML(xhr.XML);
					}else if(typeof xhr.TEXT!='undefined'){
						jgo.node('ontext').execAttr(jgo.attr('ontext'), 'jgo,text,xhr,status', jgo, xhr.TEXT, xhr, status);
						jgo.setTEXT(xhr.TEXT);
					}
				}
				jgo.node('complete', true).execAttr(jgo.attr('complete'), 'jgo,xhr,status', jgo, xhr, status);
				jgo.log.end=Date.now();
				jgo.log.duration=jgo.log.end-jgo.log.begin;
			}catch(err){
				console.error('complete');
				console.error(err);
				alert(err);
			}
		}
	};
	$jgo.jsonNodes={
		"for":{fn:function(jgo,json,attr){
			var el=$(this);
			var val=$joq(json).get(el.attr(attr));
			if(typeof val!='undefined'){
				if(el.is('['+jgo.attr('clear_for')+']')) el.html('');
				if(el.is('['+jgo.attr('beforeset_for')+']')){
					var newval=el.execAttr(jgo.attr('beforeset_for'),'jgo,json,value',jgo,json,val)[0];
					if(typeof newval!='undefined'){
						val=newval;
					}
				}
				var each=jgo.attr('each');
				$.each(val,function(index,item){
					el.append(el.execAttr(each,'jgo,json,value,index,item',jgo,json,val,index,item)[0]);
				});
				if(el.is('['+jgo.attr('onset_for')+']')){
					el.execAttr(jgo.attr('onset_for'),'jgo,json,value',jgo,json,val);
				}
			}else{
				if(el.is('['+jgo.attr('offset_for')+']')){
					el.execAttr(jgo.attr('offset_for'),'jgo,json',jgo,json);
				}
			}
		},noempty:true},
		html:{fn:function(jgo,json,attr){
			var el=$(this);
			var val=$joq(json).get(el.attr(attr));
			if(typeof val!='undefined'){
				if(el.is('['+jgo.attr('beforeset_html')+']')){
					var newval=el.execAttr(jgo.attr('beforeset_html'), 'jgo,json,value', jgo, json, val)[0];
					if(typeof newval!='undefined'){
						val=newval;
					}
				}
				el.html(val);
				if(el.is('['+jgo.attr('onset_html')+']')){
					el.execAttr(jgo.attr('onset_html'), 'jgo,json,value', jgo, json, val);
				}
			}else{
				if(el.is('['+jgo.attr('offset_html')+']')){
					el.execAttr(jgo.attr('offset_html'), 'jgo,json', jgo, json);
				}
			}
		},noempty:true},
		text:{fn:function(jgo,json,attr){
			var el=$(this);
			var val=$joq(json).get(el.attr(attr));
			if(typeof val!='undefined'){
				if(el.is('['+jgo.attr('beforeset_text')+']')){
					var newval=el.execAttr(jgo.attr('beforeset_text'),'jgo,json,value',jgo,json,val)[0];
					if(typeof newval!='undefined'){
						val=newval;
					}
				}
				el.text(val);
				if(el.is('['+jgo.attr('onset_text')+']')){
					el.execAttr(jgo.attr('onset_text'),'jgo,json,value',jgo,json,val);
				}
			}else{
				if(el.is('['+jgo.attr('offset_text')+']')){
					el.execAttr(jgo.attr('offset_text'),'jgo,json',jgo,json);
				}
			}
		},noempty:true},
		value:{fn:function(jgo,json,attr){
			var el=$(this);
			var val=$joq(json).get(el.attr(attr));
			if(val) val=val.toString();
			if(typeof val!='undefined'){
				if(el.is('['+jgo.attr('beforeset_value')+']')){
					var newval=el.execAttr(jgo.attr('beforeset_value'),'jgo,json,value',jgo,json,val)[0];
					if(typeof newval!='undefined'){
						val=newval;
					}
				}
				el.val(val);
				if(el.is('['+jgo.attr('onset_value')+']')){
					el.execAttr(jgo.attr('onset_value'),'jgo,json,value',jgo,json,val);
				}
			}else{
				if(el.is('['+jgo.attr('offset_value')+']')){
					el.execAttr(jgo.attr('offset_value'),'jgo,json',jgo,json);
				}
			}
		},noempty:true},
		check:{fn:function(jgo,json,attr){
			var el=$(this);
			var val=$joq(json).get(el.attr(attr));
			if(val) val=val.toString();
			if(typeof val!='undefined'){
				if(el.is('['+jgo.attr('beforeset_check')+']')){
					var newval=el.execAttr(jgo.attr('beforeset_check'),'jgo,json,value',jgo,json,val)[0];
					if(typeof newval!='undefined'){
						val=newval;
					}
				}
				el[0].checked=(val==el[0].value);
				if(el.is('['+jgo.attr('onset_check')+']')){
					el.execAttr(jgo.attr('onset_check'),'jgo,json,value',jgo,json,val);
				}
			}else{
				if(el.is('['+jgo.attr('offset_check')+']')){
					el.execAttr(jgo.attr('offset_check'),'jgo,json',jgo,json);
				}
			}
		},noempty:true},
		attr:{fn:function(jgo,json,attr){
			var el=$(this);
			var val=el.attr(attr);
			var at=val.split('=',1)[0];
			val=val.substr(val.indexOf('=')+1);
			val=$joq(json).get(val);
			if(val) val=val.toString();
			if(typeof val!='undefined'){
				if(el.is('['+jgo.attr('beforeset_attr')+']')){
					var newval=el.execAttr(jgo.attr('beforeset_attr'),'jgo,json,value,attr',jgo,json,val,at)[0];
					if(typeof newval!='undefined'){
						val=newval;
					}
				}
				el.attr(at,val);
				if(el.is('['+jgo.attr('onset_attr')+']')){
					el.execAttr(jgo.attr('onset_attr'),'jgo,json,value,attr',jgo,json,val,at);
				}
			}else{
				if(el.is('['+jgo.attr('offset_attr')+']')){
					el.execAttr(jgo.attr('offset_attr'),'jgo,json,attr',jgo,json,at);
				}
			}
		},noempty:true},
	};
	$jgo.textNodes={
		innerdefault:{fn:function(jgo,text,attr){
			$(this).html($(this).attr(attr));
		},noempty:true},
		innertext:{fn:function(jgo,text,attr){
			$(this).text(text);
		},noempty:false},
		innerhtml:{fn:function(jgo,text,attr){
			$(this).html(text);
		},noempty:false},
		innervalue:{fn:function(jgo,text,attr){
			$(this).val(text);
		},noempty:false},
	};
	$jgo.xmlNodes={
	};
	$jgo.fn=$jgo.prototype;
	$jgo.fn.attrdom=function(attr){
		return (this.attrsdom[attr]?this.attrsdom[attr]:this.attrsdom[attr]=this.opts.dom+'-'+attr);
	};
	$jgo.fn.nodedom=function(attr,noempty){
		return $('['+this.attrdom(attr)+']'+(noempty?'['+this.attrdom(attr)+'!=""]':''));
	};
	$jgo.fn.attr=function(attr){
		return (this.attrs[attr]?this.attrs[attr]:(this.attrs[attr]=this.opts.dom+'-'+this.opts.ambit+'-'+attr));
	};
	$jgo.fn.node=function(attr,noempty){
		return $('['+this.attr(attr)+']'+(noempty?'['+this.attr(attr)+'!=""]':''),this.opts.root);
	};
	$jgo.fn.getDomInputs=function(valids){
		if(valids) return this.getDomInputs().filter(this.opts.validFilter);
		return this.nodedom('name').filter('[name][name!=""]:not(['+this.attr('name')+'])').filter(this.opts.enabledFilter);
	};
	$jgo.fn.getInputs=function(valids){
		if(valids) return this.getInputs().filter(this.opts.validFilter);
		return this.node('name').add(this.node('form').find('[name][name!=""]')).filter('[name][name!=""]').filter(this.opts.enabledFilter);
	};
	$jgo.fn.setJSON=function(json){
		if(!json || typeof json!='object') return;
		var jgo=this;
		jgo.node('beginjson',true).execAttr(jgo.attr('beginjson'),'jgo,json',jgo,json);
		$joq.each($jgo.jsonNodes,function(attr,fn){
			jgo.node(attr,fn.noempty).execJs(fn.fn,jgo,json,jgo.attr(attr));
		});
		jgo.node('endjson',true).execAttr(jgo.attr('endjson'),'jgo,json',jgo,json);
	};
	$jgo.fn.setXML=function(xml){
		if(!xml || typeof xml!='object') return;
		var jgo=this;
		jgo.node('beginxml',true).execAttr(jgo.attr('beginxml'),'jgo,xml',jgo,xml);
		$joq.each($jgo.xmlNodes,function(attr,fn){
			jgo.node(attr,fn.noempty).execJs(fn.fn,jgo,xml,jgo.attr(attr));
		});
		jgo.node('endxml',true).execAttr(jgo.attr('endxml'),'jgo,xml',jgo,xml);
	};
	$jgo.fn.setTEXT=function(text){
		if(typeof text!='string') return;
		var jgo=this;
		jgo.node('begintext',true).execAttr(jgo.attr('begintext'),'jgo,text',jgo,text);
		$joq.each($jgo.textNodes,function(attr,fn){
			jgo.node(attr,fn.noempty).execJs(fn.fn,jgo,text,jgo.attr(attr));
		});
		jgo.node('endtext',true).execAttr(jgo.attr('endtext'),'jgo,text',jgo,text);
	};
	$jgo.fn.formData=function(cfg){
		var jgo=this;
		if(!cfg || (cfg.processData===false && cfg.contentType===false)){
			var fd=new FormData();
			var add=function(name,value){
				fd.append(name,value);
			};
			var addNode=function(name,e){
				if(e.files && typeof e.files=='object' && e.files.constructor==FileList){
					$.each(e.files,function(i,file){
						add(name,file);
					});
				}else if($(e).serialize()){
					add(name,e.value);
				}
			};
		}else{
			var fd=[];
			var add=function(name,value){
				fd.push({name:name,value:value});
			};
			var addNode=function(name,e){
				if($(e).serialize()){
					add(name,e.value);
				}
			};
		}
		if(cfg && cfg.data)
		if(typeof cfg.data=='object' && cfg.data.constructor==FormData){
			var values=cfg.data.entries();
			var v;
			while((v=values.next()).done===false){
				add(v.value[0],v.value[1]);
			}
		}else if(typeof cfg.data=='object'){
			$.each($joq(cfg.data).select(null,null,function(o,i){return (o[i] && typeof o[i]=='object' && typeof o[i].name!='undefined' && typeof o[i].value!='undefined');}).val(),function(i,e){
				if(e.name!=undefined && e.value!=undefined){
					add(e.name,e.value);
				}
			});
		}
		this.getInputs().each(function(i,e){
			var name=$(e).attr(jgo.attr('name'));
			if(!name) name=$(e).attr('name');
			if(name){
				addNode(name,e);
			}
		});
		this.getDomInputs().each(function(i,e){
			var name=$(e).attr(jgo.attrdom('name'));
			if(!name) name=$(e).attr('name');
			if(name){
				addNode(name,e);
			}
		});
		return fd;
	};
	$jgo.fn.go=function(){
		if(!this.opts.validate
				|| (typeof this.opts.validate!='function' && (this.getInputs().length==this.getInputs(true).length && this.getDomInputs().length==this.getDomInputs(true).length)) 
				|| (typeof this.opts.validate=='function' && this.opts.validate(this))){
			var cfg=$joq(this.cfg).select().val();
			cfg.data=this.formData(cfg);
			cfg.jgo=this;
			this.lastXHR=$.ajax(cfg);
			if(!this.opts.saveXHR)
				delete this.lastXHR;
		}
		return this;
	};
	return $jgo;
})(jQuery);
