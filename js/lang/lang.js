var _langs = {"zh_CN":1, "en":0};
var _lang = LDB.item("_language") || "zh_CN";
_lang = _langs[_lang] ? _lang : "zh_CN";

document.write('<script type="text/javascript" src="/js/lang/'+_lang+'.js"></script>');

$(function() {
	function languageItem(k, def) {
		def = def || k;
		
		if(_LANGUAGE[k] == undefined) return false;
		if(_LANGUAGE[k] == "") return def;
		return _LANGUAGE[k];
	}
	
	$("lang").each(function() {
		var l = languageItem($(this).html());
		if(l) $(this)[0].outerHTML = l;
	});
});