(function($){"use strict";if(!$.browser){$.browser={};$.browser.mozilla=/mozilla/.test(navigator.userAgent.toLowerCase())&&!/webkit/.test(navigator.userAgent.toLowerCase());$.browser.webkit=/webkit/.test(navigator.userAgent.toLowerCase());$.browser.opera=/opera/.test(navigator.userAgent.toLowerCase());$.browser.msie=/msie/.test(navigator.userAgent.toLowerCase());}
var methods={destroy:function(){$(this).unbind(".maskMoney");if($.browser.msie){this.onpaste=null;}
return this;},mask:function(value){return this.each(function(){var $this=$(this),decimalSize;if(typeof value==="number"){$this.trigger("mask");decimalSize=$($this.val().split(/\D/)).last()[0].length;value=value.toFixed(decimalSize);$this.val(value);}
return $this.trigger("mask");});},unmasked:function(){return this.map(function(){var value=($(this).val()||"0"),isNegative=value.indexOf("-")!==-1,decimalPart;$(value.split(/\D/).reverse()).each(function(index,element){if(element){decimalPart=element;return false;}});value=value.replace(/\D/g,"");value=value.replace(new RegExp(decimalPart+"$"),"."+ decimalPart);if(isNegative){value="-"+ value;}
return parseFloat(value);});},init:function(settings){settings=$.extend({prefix:"",suffix:"",affixesStay:true,thousands:",",decimal:".",precision:2,allowZero:false,allowNegative:false},settings);return this.each(function(){var $input=$(this),onFocusValue;settings=$.extend(settings,$input.data());function getInputSelection(){var el=$input.get(0),start=0,end=0,normalizedValue,range,textInputRange,len,endRange;if(typeof el.selectionStart==="number"&&typeof el.selectionEnd==="number"){start=el.selectionStart;end=el.selectionEnd;}else{range=document.selection.createRange();if(range&&range.parentElement()===el){len=el.value.length;normalizedValue=el.value.replace(/\r\n/g,"\n");textInputRange=el.createTextRange();textInputRange.moveToBookmark(range.getBookmark());endRange=el.createTextRange();endRange.collapse(false);if(textInputRange.compareEndPoints("StartToEnd",endRange)>-1){start=end=len;}else{start=-textInputRange.moveStart("character",-len);start+=normalizedValue.slice(0,start).split("\n").length- 1;if(textInputRange.compareEndPoints("EndToEnd",endRange)>-1){end=len;}else{end=-textInputRange.moveEnd("character",-len);end+=normalizedValue.slice(0,end).split("\n").length- 1;}}}}
return{start:start,end:end};}
function canInputMoreNumbers(){var haventReachedMaxLength=!($input.val().length>=$input.attr("maxlength")&&$input.attr("maxlength")>=0),selection=getInputSelection(),start=selection.start,end=selection.end,haveNumberSelected=(selection.start!==selection.end&&$input.val().substring(start,end).match(/\d/))?true:false,startWithZero=($input.val().substring(0,1)==="0");return haventReachedMaxLength||haveNumberSelected||startWithZero;}
function setCursorPosition(pos){$input.each(function(index,elem){if(elem.setSelectionRange){elem.focus();elem.setSelectionRange(pos,pos);}else if(elem.createTextRange){var range=elem.createTextRange();range.collapse(true);range.moveEnd("character",pos);range.moveStart("character",pos);range.select();}});}
function setSymbol(value){var operator="";if(value.indexOf("-")>-1){value=value.replace("-","");operator="-";}
return operator+ settings.prefix+ value+ settings.suffix;}
function maskValue(value){var negative=(value.indexOf("-")>-1)?"-":"",onlyNumbers=value.replace(/[^0-9]/g,""),integerPart=onlyNumbers.slice(0,onlyNumbers.length- settings.precision),newValue,decimalPart,leadingZeros;integerPart=integerPart.replace(/^0/g,"");integerPart=integerPart.replace(/\B(?=(\d{3})+(?!\d))/g,settings.thousands);if(integerPart===""){integerPart="0";}
newValue=negative+ integerPart;if(settings.precision>0){decimalPart=onlyNumbers.slice(onlyNumbers.length- settings.precision);leadingZeros=new Array((settings.precision+ 1)- decimalPart.length).join(0);newValue+=settings.decimal+ leadingZeros+ decimalPart;}
return setSymbol(newValue);}
function maskAndPosition(startPos){var originalLen=$input.val().length,newLen;$input.val(maskValue($input.val()));newLen=$input.val().length;startPos=startPos-(originalLen- newLen);setCursorPosition(startPos);}
function mask(){var value=$input.val();$input.val(maskValue(value));}
function changeSign(){var inputValue=$input.val();if(settings.allowNegative){if(inputValue!==""&&inputValue.charAt(0)==="-"){return inputValue.replace("-","");}else{return"-"+ inputValue;}}else{return inputValue;}}
function preventDefault(e){if(e.preventDefault){e.preventDefault();}else{e.returnValue=false;}}
function keypressEvent(e){e=e||window.event;var key=e.which||e.charCode||e.keyCode,keyPressedChar,selection,startPos,endPos,value;if(key===undefined){return false;}
if(key<48||key>57){if(key===45){$input.val(changeSign());return false;}else if(key===43){$input.val($input.val().replace("-",""));return false;}else if(key===13||key===9){return true;}else if($.browser.mozilla&&(key===37||key===39)&&e.charCode===0){return true;}else{preventDefault(e);return true;}}else if(!canInputMoreNumbers()){return false;}else{preventDefault(e);keyPressedChar=String.fromCharCode(key);selection=getInputSelection();startPos=selection.start;endPos=selection.end;value=$input.val();$input.val(value.substring(0,startPos)+ keyPressedChar+ value.substring(endPos,value.length));maskAndPosition(startPos+ 1);return false;}}
function keydownEvent(e){e=e||window.event;var key=e.which||e.charCode||e.keyCode,selection,startPos,endPos,value,lastNumber;if(key===undefined){return false;}
selection=getInputSelection();startPos=selection.start;endPos=selection.end;if(key===8||key===46||key===63272){preventDefault(e);value=$input.val();if(startPos===endPos){if(key===8){if(settings.suffix===""){startPos-=1;}else{lastNumber=value.split("").reverse().join("").search(/\d/);startPos=value.length- lastNumber- 1;endPos=startPos+ 1;}}else{endPos+=1;}}
$input.val(value.substring(0,startPos)+ value.substring(endPos,value.length));maskAndPosition(startPos);return false;}else if(key===9){return true;}else{return true;}}
function focusEvent(){onFocusValue=$input.val();mask();var input=$input.get(0),textRange;if(input.createTextRange){textRange=input.createTextRange();textRange.collapse(false);textRange.select();}}
function getDefaultMask(){var n=parseFloat("0")/ Math.pow(10, settings.precision);
return(n.toFixed(settings.precision)).replace(new RegExp("\\.","g"),settings.decimal);}
function blurEvent(e){if($.browser.msie){keypressEvent(e);}
if($input.val()===""||$input.val()===setSymbol(getDefaultMask())){if(!settings.allowZero){$input.val("");}else if(!settings.affixesStay){$input.val(getDefaultMask());}else{$input.val(setSymbol(getDefaultMask()));}}else{if(!settings.affixesStay){var newValue=$input.val().replace(settings.prefix,"").replace(settings.suffix,"");$input.val(newValue);}}
if($input.val()!==onFocusValue){$input.change();}}
function clickEvent(){var input=$input.get(0),length;if(input.setSelectionRange){length=$input.val().length;input.setSelectionRange(length,length);}else{$input.val($input.val());}}
$input.unbind(".maskMoney");$input.bind("keypress.maskMoney",keypressEvent);$input.bind("keydown.maskMoney",keydownEvent);$input.bind("blur.maskMoney",blurEvent);$input.bind("focus.maskMoney",focusEvent);$input.bind("click.maskMoney",clickEvent);$input.bind("mask.maskMoney",mask);});}};$.fn.maskMoney=function(method){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1));}else if(typeof method==="object"||!method){return methods.init.apply(this,arguments);}else{$.error("Method "+ method+" does not exist on jQuery.maskMoney");}};})(window.jQuery||window.Zepto);