/*
 * XML Converter to JavaScript Object
 * ymv.jxml v1.3
 * Fecha: 20161121
 * Autor: Yordanny Mejías V. yordanny90@gmail.com
 */
$jxml=function(a,b){return b=function(c){if(this.constructor!=b)return new b(c);var d=this;c.children&&c.children.length&&a.each(c.children,function(a,c){"undefined"==typeof d[c.nodeName]?d[c.nodeName]=[b(c)]:d[c.nodeName].push(b(c))}),c.attributes&&c.attributes.length&&a.each(c.attributes,function(a,b){d[b.name]=b.value}),1==c.childNodes.length&&"#text"==c.childNodes[0].nodeName&&c.innerHTML&&(this["#text"]=c.innerHTML)},b.fn=b.prototype,b.fn.toString=function(){return"string"==typeof this["#text"]?this["#text"]:""},b.fn.toXML=function(c){var d=[],e="";return a.each(this,function(c,f){"#text"!=c&&("string"==typeof f?d+=" "+c+'="'+f.replace(/"/g,"&quot;")+'"':"object"==typeof f&&f.constructor==Array&&a.each(f,function(a,d){d&&"object"==typeof d&&d.constructor==b&&(e+=d.toXML(c))}))}),c&&"string"==typeof c?"string"==typeof this["#text"]||e?"<"+c+d+">"+e+this.toString().replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</"+c+">":"<"+c+d+"/>":e},b}(jQuery);