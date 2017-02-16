/*
 * XML Converter to JavaScript Object
 * ymv.jxml v1.4
 * Fecha: 20170216
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 */
$jxml=(function($,$jxml){
	$jxml=function(xml){
		if(this.constructor!=$jxml) return new $jxml(xml);
		var a=this;
		if(xml.children && xml.children.length){
			$.each(xml.children,function(i,e){
				if(typeof a[e.nodeName]=='undefined'){
					a[e.nodeName]=[$jxml(e)];
				}else{
					a[e.nodeName].push($jxml(e));
				}
			});
		}
		if(xml.attributes && xml.attributes.length){
			$.each(xml.attributes,function(i,e){
				a[e.name]=e.value;
			});
		}
		if(xml.childNodes.length==1 && xml.childNodes[0].nodeName=='#text' && xml.innerHTML){
			this['#text']=xml.innerHTML;
		}
	};
	$jxml.fn=$jxml.prototype;
	$jxml.fn.toString=function(){
		if(typeof this['#text']=='string') return this['#text'];
		return '';
	};
	$jxml.fn.toXML=function(tag){
		var attrs=[];
		var childs='';
		$.each(this,function(i,e){
			if(i!='#text'){
				if(typeof e=='string') attrs+=' '+i+'="'+e.replace(/"/g,'&quot;')+'"';
				else if(typeof e=='object' && e.constructor==Array){
					$.each(e,function(k,v){
						if(v && typeof v=='object' && v.constructor==$jxml)
							childs+=v.toXML(i);
					});
				}
			}
		});
		if(!tag || typeof tag!='string'){
			return childs;
		}else if(typeof this['#text']=='string' || childs){
			return '<'+tag+attrs+'>'+childs+this.toString().replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</'+tag+'>';
		}else{
			return '<'+tag+attrs+'/>';
		}
	};
	return $jxml;
})(jQuery);
