/*
 * ymv.jquery_visual v1.4
 * Fecha: 20170216
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 */
$(function($){
	$.fn.scrollCenter=function(){
		this.scrollLeft((this[0].scrollWidth-this.width())/2);
		this.scrollTop((this[0].scrollHeight-this.height())/2);
		return this;
	};
	$.fn.autoScroll=function(op){
		if(op=='destroy'){
			this.each(function(i,e){
				if(e.tAutoScroll) clearTimeout(e.tAutoScroll);
				if(e.iAutoScroll) clearInterval(e.iAutoScroll);
			});
		}else{
			var attrs={
				'autoscroll-wait':true,
				'autoscroll-stepup':true,
				'autoscroll-timeup':true,
				'autoscroll-stepdown':true,
				'autoscroll-timedown':true,
			};
			this.autoScroll('destroy');
			this.each(function(i,e){
				var cfg={
					wait:1000,
					stepup:2,
					timeup:50,
					stepdown:1,
					timedown:100,
				};
				$joq(cfg).update($joq(e.attributes).select(function(o,i){return o[i].name.split('-')[1]},function(o,i){return o[i].value},function(o,i){return attrs[o[i].name]}).val());
				$joq(cfg).update(op);
				cfg.scrolldown=function(){
					if(!$(e).parents('body')[0]){
						return clearInterval(e.iAutoScroll);
					}else if(e.scrollTop==(e.scrollHeight-$(e).height())){
						clearInterval(e.iAutoScroll);
						e.tAutoScroll=setTimeout(function(){
							e.iAutoScroll=setInterval(cfg.scrollup,cfg.timeup);
						},cfg.wait);
					}else{
						e.scrollTop+=cfg.stepdown;
					}
				};
				cfg.scrollup=function(){
					if(!$(e).parents('body')[0]){
						return clearInterval(e.iAutoScroll);
					}else if(e.scrollTop==0){
						clearInterval(e.iAutoScroll);
						e.tAutoScroll=setTimeout(function(){
							e.iAutoScroll=setInterval(cfg.scrolldown,cfg.timedown);
						},cfg.wait);
					}else{
						e.scrollTop-=cfg.stepup;
					}
				};
				e.iAutoScroll=setInterval(cfg.scrolldown,cfg.timedown);
			});
		}
		return this;
	};
	$.fn.numberStepUp=function(){
		if(this.is('input')){
			var v=parseFloat(this.val());
			if(isNaN(v)) v=0;
			var s=parseFloat(this.attr('step'));
			if(isNaN(s) || s==0) s=1;
			if(s<0) s*=-1;
			var min=parseFloat(this.attr('min'));
			var max=parseFloat(this.attr('max'));
			v+=s;
			if(v>max)
				v=max;
			if(v<min)
				v=min;
			return this.val(v).val();
		}
	};
	$.fn.numberStepDown=function(){
		if(this.is('input')){
			var v=parseFloat(this.val());
			if(isNaN(v)) v=0;
			var s=parseFloat(this.attr('step'));
			if(isNaN(s) || s==0) s=1;
			if(s>0) s*=-1;
			var min=parseFloat(this.attr('min'));
			var max=parseFloat(this.attr('max'));
			v+=s;
			if(v>max)
				v=max;
			if(v<min)
				v=min;
			return this.val(v).val();
		}
	};
});

$(function(){
	var $listTransformStyle=[
		'transform',
		'WebkitTransform',
		'msTransform',
	];
	$transformStyle='transform';
	$.each($listTransformStyle,function(i,e){
		if(typeof document.body.style[e]!='undefined'){
			$transformStyle=e;
		}
	});
	var $scaleRegex=/scale[(]([-]?[0-9]*[.]?[0-9]*)[,]?[ ]?([-]?[0-9]*[.]?[0-9]*)?[)]/;
	$.fn.transformScale=function(x,y){
		if(typeof x=='number'){
			var $v='scale';
			if(typeof y=='number'){
				$v+='('+x+', '+y+')';
			}else{
				$v+='('+x+')';
			}
			this.each(function(i,e){
				e.style[$transformStyle]=e.style[$transformStyle].replace($(e).transformScale()?$scaleRegex:'',$v);
			});
		}
		var $sc=this[0].style[$transformStyle].match($scaleRegex);
		if($sc) $sc.shift();
		return $sc;
	};
	var $rotateRegex=/rotate[(]([-]?[0-9]*)deg[)]/;
	$.fn.transformRotate=function(deg){
		if(typeof deg=='number'){
			var $v='rotate('+deg+'deg)';
			this.each(function(i,e){
				e.style[$transformStyle]=e.style[$transformStyle].replace($(e).transformRotate()?$rotateRegex:'',$v);
			});
		}
		var $sc=this[0].style[$transformStyle].match($rotateRegex);
		if($sc) $sc.shift();
		return $sc;
	};
});
