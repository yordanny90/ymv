(function($){
	$.jbind('append',function(data,odata,subtype){
		this.append(data);
	});
	$.jbind('append_each',function(data,odata,subtype){
		if(Array.isArray(data)){
			var t=this;
			$.each(data,function(i,e){
				t.append(e);
			});
		}
	});
	$.jbind('append_template',function(data,odata,subtype){
		var a=this.data(subtype);
		this.append($.jbind_replaceKeys(a,$.jbind_findKeys(a),data));
	});
	$.jbind('append_template_each',function(data,odata,subtype){
		if(Array.isArray(data)){
			var a=this.data(subtype);
			var t=this;
			$.each(data,function(i,e){
				t.append($.jbind_replaceKeys(a,$.jbind_findKeys(a),e));
			});
		}
	});
	$.jbind('class', function(data, odata, subtype){
		if(data){
			$(this).addClass(subtype);
		}else{
			$(this).removeClass(subtype);
		}
	});
	$.jbind('show', function(data, odata, subtype){
		if(data)
			$(this).show();
		else
			$(this).hide();
	});
	$.jbind('hide', function(data, odata, subtype){
		if(data)
			$(this).hide();
		else
			$(this).show();
	});
	$.jbind('data', function(data, odata, subtype){
		$(this).data(subtype,data);
	});
	$.jbind('attr', function(data, odata, subtype){
		$(this).attr(subtype,data);
	});
	$.jbind('prop', function(data, odata, subtype){
		$(this).prop(subtype,data);
	});
	$.jbind('css', function(data, odata, subtype){
		$(this).css(subtype,data);
	});
	$.jbind('value', function(data, odata, subtype){
		$(this).val(data);
	});
	$.jbind('innerText', function(data, odata, subtype){
		if(typeof data=='string' || typeof data=='number'){
			$(this).text(data);
		}
	});
	$.jbind('innerHtml', function(data, odata, subtype){
		if(typeof data=='string' || typeof data=='number'){
			$(this).html(data);
		}
	});
	$.jbind('orderby', function(data, odata, subtype){
		if(data.orderby==subtype && typeof data.ordertype=='string'){
			if(data.ordertype+''.toUpperCase()=='ASC'){
				$(this).html($(this).data('orderup')||'&#x25B2;');
			}else{
				$(this).html($(this).data('orderdown')||'&#x25BC;');
			}
		}else{
			$(this).html('');
		}
	});
})(jQuery);
