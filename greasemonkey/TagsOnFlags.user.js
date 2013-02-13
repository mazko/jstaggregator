// ==UserScript==

// @name		TagsOnFlags
// @description		Language identification button, tag cloud sidebar with styling.
// @namespace		http://TagsOnFlags.com/
// @version		0.1
// @include		*
// @copyright		2013+, Oleg Mazko
// @icon		http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/mars.png

// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/Token.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/FlexTokenizer.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/jquery-1.9.1.min.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/filter/LengthFilter.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/filter/SnowballFilter.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/filter/ShingleStopFilter.js

// @require  http://mazko.github.com/jssnowball/lib/Snowball.js

// @require  http://mazko.github.com/jsli/lib/LanguageIdentifier.js
// @require  http://mazko.github.com/jsli/lib/Lng/ca.js
// @require  http://mazko.github.com/jsli/lib/Lng/da.js
// @require  http://mazko.github.com/jsli/lib/Lng/de.js
// @require  http://mazko.github.com/jsli/lib/Lng/en.js
// @require  http://mazko.github.com/jsli/lib/Lng/es.js
// @require  http://mazko.github.com/jsli/lib/Lng/fi.js
// @require  http://mazko.github.com/jsli/lib/Lng/fr.js
// @require  http://mazko.github.com/jsli/lib/Lng/hu.js
// @require  http://mazko.github.com/jsli/lib/Lng/it.js
// @require  http://mazko.github.com/jsli/lib/Lng/nl.js
// @require  http://mazko.github.com/jsli/lib/Lng/no.js
// @require  http://mazko.github.com/jsli/lib/Lng/pt.js
// @require  http://mazko.github.com/jsli/lib/Lng/ro.js
// @require  http://mazko.github.com/jsli/lib/Lng/ru.js
// @require  http://mazko.github.com/jsli/lib/Lng/sl.js
// @require  http://mazko.github.com/jsli/lib/Lng/sv.js
// @require  http://mazko.github.com/jsli/lib/Lng/tr.js

// @resource ca http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/AD.png
// @resource da http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/DK.png
// @resource de http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/DE.png
// @resource en http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/GB.png
// @resource es http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/ES.png
// @resource fi http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/FI.png
// @resource fr http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/FR.png
// @resource hu http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/HU.png
// @resource it http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/IT.png
// @resource nl http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/NL.png
// @resource no http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/NO.png
// @resource pt http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/PT.png
// @resource ro http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/RO.png
// @resource ru http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/RU.png
// @resource sl http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/SI.png
// @resource sv http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/SE.png
// @resource tr http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/TR.png

// @resource unknown http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/mars.png

// @resource 100-90-5-monochrome http://mazko.github.com/jstaggregator/greasemonkey/img/100-90-5-monochrome.png

// ==/UserScript==

var _is_working = false;

function buildTagCloud(text, lng, ahref, sidebar, progress) {
    var gwindow = $(window);
    if (_is_working) {
        _is_working = false;
        ahref.text("");
        ahref.unbind("mouseenter");
        gwindow.unbind();
        sidebar.unbind();
        return;
    }
    GM_log(text);
    
    var tokenStream = new LengthFilter(
        new ShingleStopFilter(
            new SnowballFilter(
                new FlexTokenizer(text, progress), 
                lng
            ),
            3 /* tags 3 words max */
        ),
        2 /* Skip tags < 2 total chars */, 50 /* Skip tags > 50 total chars */ 
    );
    
    var token, tokensMap = {};
    _is_working = true;
    var async = function() {
        if (_is_working) {
            if (token = tokenStream.incrementToken()) {
                var tokenTerm = token.term, item = tokensMap.hasOwnProperty(tokenTerm) ? tokensMap[tokenTerm] : false;
                if (item) {
                    var offsetMatrix = item.offsetMatrix;
                    offsetMatrix.push(token.offset);
                } else {
                    tokensMap[tokenTerm] = {
                        "offsetMatrix" : [token.offset]//,
                        //"boost" : token.boost
                    };
                }
                setTimeout(async, 1);
            } else {
                /* Tag cloud is ready */
                
                var window_was_resized_when_sidebar_was_hidden = false;
                
                _is_working = false;
                ahref.mouseenter(function() {
                    sidebar.fadeIn(1000);
                    if (window_was_resized_when_sidebar_was_hidden) {
                        gwindow.resize(); // fire event to recalculate tags to fit in sidebar
                        window_was_resized_when_sidebar_was_hidden = false;
                    }
                });
                sidebar.mouseenter(function() {
                    sidebar.unbind("mouseenter");
                    sidebar.mouseleave(function() {
                        sidebar.fadeOut(1000);
                    });
                });
                //sidebar.mousedown(function(zEvent) {
                //    zEvent.preventDefault(); //--- prevent clear selection before click() event.
                //});
                sidebar.fadeIn(1000);
                
                ahref.text("");
                sidebar.empty();
                
                var tag_box_wrapper = $('<div/>', {
                    id: 'nongreedy-tags-wrapper'
                }).appendTo(sidebar);
                
                var tag_box = $('<ul/>', {
                    class: 'tag_box'
                }).appendTo(tag_box_wrapper);
                
                var tags_array = [], forlog = [];
                $.each( tokensMap, function( key, value ) {
                    tags_array.push(value);
                    forlog.push(key);
                });
                
                GM_log(forlog);
                
                tags_array.sort(function(a, b) {return b.offsetMatrix.length-a.offsetMatrix.length;});
                
                (function() {
                    var start = 0;
                    
                    function sidebarAppendTagsUntillNoOverflow() {
                        
                        if (tag_box.height() > tag_box_wrapper.height()) {
                            GM_log("Append not require " + tag_box.height() + " t : s " + tag_box_wrapper.height());
                            return;
                        }
                        
                        $.each(tags_array.slice(start), function(index, value) {
                            
                            function getOriginEntryText(offsetArray) {
                                return text.substring(offsetArray[0].start,
                                                      offsetArray[offsetArray.length - 1].end);
                            }
                            
                            function entriesAsTextAndUnique(entries) {
                                var res = [];
                                
                                $.each(entries, function(index, value) {
                                    var text = getOriginEntryText(value);
                                    if ($.inArray(text, res) === -1) {
                                        res.push(text);
                                    }
                                });
                                
                                return res;
                            }
                            
                            /* Always whitespace separator between words in token */
                            
                            function getPrettyEntryText(offsetArray) {
                                var res = [];
                                $.each(offsetArray, function(index, value) {
                                    res.push(text.substring(value.start, value.end));
                                });
                                return res.join(" ");
                            }
                            
                            var keys = entriesAsTextAndUnique(value.offsetMatrix);
                            var last_appended = $('<li/>').appendTo(tag_box);
                            last_appended.attr({
                                title: keys.join("\n")
                            });
                            $('<a/>').appendTo(last_appended).attr({
                                href: '#"' + keys.join('\",\"') + '"'
                            }).html(getPrettyEntryText(value.offsetMatrix[0]) + ' <span>' + value.offsetMatrix.length + '</span>');
                            last_appended.click(function(zEvent) {
                                
                                /* Highlight http://stackoverflow.com/questions/5886858/full-text-search-in-html-ignoring-tags */
                                
                                function doSearch(text) {
                                    if (window.find && window.getSelection) {
                                        document.designMode = "on";
                                        var sel = window.getSelection();
                                        sel.collapse(document.body, 0);
                                        
                                        while (window.find(text)) {
                                            document.execCommand("HiliteColor", false, "yellow");
                                            sel.collapseToEnd();
                                        }
                                        document.designMode = "off";
                                    } else if (document.body.createTextRange) {
                                        var textRange = document.body.createTextRange();
                                        while (textRange.findText(text)) {
                                            textRange.execCommand("BackColor", false, "yellow");
                                            textRange.collapse(false);
                                        }
                                    }
                                }
                                
                                /* Temporary remove sidebar from DOM preventing highlight itself */
                                
                                var sidebarparent = sidebar.parent();
                                sidebar.detach();
                                var searchitems = $(this).attr("title").split("\n");
                                try {
                                    $.each(searchitems, function(index, value) {
                                        doSearch(value);
                                    });
                                } catch (err) {
                                    GM_log("Error trying search/highlight tag '" + searchitems + "'. Err: " + err);
                                }
                                sidebar.appendTo(sidebarparent);
                                zEvent.stopPropagation();
                                zEvent.preventDefault();
                            });
                            
                            if (tag_box.height() > tag_box_wrapper.height()) {
                                GM_log("Last append overflowed. Back " + tag_box.height() + " t : s " + tag_box_wrapper.height());
                                last_appended.remove();
                                GM_log(tag_box.height() + " t : s " + tag_box_wrapper.height());
                                return false;
                            } else {
                                start++;
                            }
                        });
                    }
                    
                    function sidebarNextPage() {
                        tag_box.empty();
                        sidebarAppendTagsUntillNoOverflow();
                    }
                    
                    sidebarNextPage();
                    
                    function sidebarRemoveTagsUntillOverflow() {
                        if (tag_box.height() <= tag_box_wrapper.height()) {
                            GM_log("Remove not require: " + tag_box.height() + " t : s " + tag_box_wrapper.height());
                            return;
                        }
                        $.each(tag_box.children().get().reverse(), function() {
                            if (tag_box.height() <= tag_box_wrapper.height()) {
                                GM_log("Last remove: " + tag_box.height() + " t : s " + tag_box_wrapper.height());
                                return false;
                            }
                            $(this).remove();
                            start--;
                        });
                    }
                    
                    /* http://underscorejs.org/underscore.js, http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing */
                    
                    // Returns a function, that, as long as it continues to be invoked, will not
                    // be triggered. The function will be called after it stops being called for
                    // N milliseconds. If `immediate` is passed, trigger the function on the
                    // leading edge, instead of the trailing.
                    function debounce(func, wait, immediate) {
                        var timeout, result;
                        return function() {
                            var context = this, args = arguments;
                            var later = function() {
                                timeout = null;
                                if (!immediate) result = func.apply(context, args);
                            };
                            var callNow = immediate && !timeout;
                            clearTimeout(timeout);
                            timeout = setTimeout(later, wait);
                            if (callNow) result = func.apply(context, args);
                            return result;
                        };
                    };
                    
                    gwindow.resize(debounce(function() {
                        
                        /* if display:none skip calculations */
                        
                        if (sidebar.is(':visible')) {
                            GM_log("Resize triggered - fit tags in sidebar");
                            sidebarAppendTagsUntillNoOverflow();
                            sidebarRemoveTagsUntillOverflow();
                        } else {
                            window_was_resized_when_sidebar_was_hidden = true;
                        }
                    }, 300));
                    
                    sidebar.click(function(zEvent) {
                        if (zEvent.ctrlKey) {
                            if (start < tags_array.length) {
                                sidebarNextPage();
                            }
                        } else if (zEvent.shiftKey) {
                            start = 0;
                            sidebarNextPage();
                        } else {
                            
                            /* Close sidebar */
                            
                            ahref.unbind("mouseenter");
                            sidebar.unbind();
                            gwindow.unbind();
                            sidebar.fadeOut(1000);
                        }
                        zEvent.stopPropagation();
                        zEvent.preventDefault();
                    });
                    
                }());
                
            }
        }
    } 
    async();
}

function isTopOrUsefulFrame() {
    if (frameElement) {
        
        /* Skip any external domain frames like twitter.com, disqus.com and other */
        
        try {
            
            /* Permissin error must be here if frame is from another domain than top (top.location throws) */
            
            if (top.location.hostname !== self.location.hostname) {
                GM_log("Actually this could never happen: " + self.location);
                return false;
            }
            
            /* This frame is in the same domain. Check if there any useful text inside */
            
            if (!$.trim($("body").clone().find("script,noscript,style").remove().end().text())) {
                GM_log("Skip frame because no text inside: " + self.location);
                return false;
            }
            
        } catch (e) {
            GM_log("Skip frame from another domain: " + self.location + ". Err: " + e);
            return false;
        }
    }
    
    /* Top (main) window. Check if there any useful text inside */
    
    if (!$.trim($("body").clone().find("script,noscript,style").remove().end().text())) {
        GM_log("Skip top window because no text inside: " + self.location);
        return false;
    }
    
    return true;
}

/* Main */

if (document.body && isTopOrUsefulFrame()) {
    
    var nongreedyjsli = $('<a/>', {
        id: 'nongreedy-jsli',
        href: '#',
        text: '^_^',
        title: GM_info.script.name + ' v' + GM_info.script.version + ' ALFA | ' + LanguageIdentifier.getSupportedLanguages()
    }).appendTo('body');
    
    var nongreedysidebar = $('<div/>', {
        id: 'nongreedy-sidebar'
    }).appendTo('body');
    
    nongreedyjsli.click (function (zEvent) {
        
        /* http://help.dottoro.com/ljcvonpc.php */
        
        function getSelectedText () {
            var selText = "";
            if (window.getSelection) {  // all browsers, except IE before version 9
                if (document.activeElement && 
                    (document.activeElement.tagName.toLowerCase () == "textarea" || 
                    document.activeElement.tagName.toLowerCase () == "input")) 
                    {
                        var text = document.activeElement.value;
                        selText = text.substring (document.activeElement.selectionStart, 
                                                  document.activeElement.selectionEnd);
                    }
                else {
                    var selRange = window.getSelection ();
                    selText = selRange.toString ();
                }
            }
            else {
                if (document.selection.createRange) { // Internet Explorer
                    var range = document.selection.createRange ();
                    selText = range.text;
                }
            }
            return selText;
        }
        
        var text = getSelectedText() || $("body").clone().find("script,noscript,style,#nongreedy-jsli,#nongreedy-sidebar").remove().end().text();
        
        var lng = LanguageIdentifier.identify(text).language, cntr = 0; 
        buildTagCloud(text, lng, nongreedyjsli, nongreedysidebar, function(pos, total){if (!cntr--) {cntr = 5; nongreedyjsli.text(Math.round(100*pos/total) + " %");}});
        nongreedyjsli.attr({
            title: 'ISO 639: ' + lng,
            style: 'background-image: url(' + GM_getResourceURL(lng) + ')!important; background-repeat: no-repeat!important;background-position: 50% 50%!important;vertical-align: middle!important;line-height: 0!important;width: 64px!important;height:64px!important;border:none!important;background-color:transparent!important;'
        });
        
        zEvent.stopPropagation();
        zEvent.preventDefault();
    });
    
    //--- prevent clear selection before click() event. http://stackoverflow.com/questions/826782/css-rule-to-disable-text-selection-highlighting. css trick not work for trxtarea - still cleaning selection after click. Behind solution fix this, but i dont like it(same in sidebar.mousedown handler higher).
    //nongreedyjsli.mousedown(function(zEvent) {
    //    zEvent.preventDefault();
    //});
    
    //--- trademark - open site in tab.
    nongreedyjsli.dblclick (function (zEvent) {
        GM_openInTab("http://nongreedy.ru/");
        zEvent.stopPropagation(); 
        zEvent.preventDefault();
    });
    //--- Style our newly added elements using CSS.
    GM_addStyle ("\
#nongreedy-jsli {\
  z-index: 99999!important;\
  display: block!important;\
  border: 1px solid rgb(204, 204, 204)!important;\
  background: none repeat scroll 0% 0% rgb(247, 247, 247)!important;\
  text-align: center!important;\
  position: fixed!important;\
  bottom: 10px!important;\
  right: 10px!important;\
  cursor: pointer!important;\
  color: rgb(51, 51, 51)!important;\
  font-family: verdana!important;\
  font-size: 11px!important;\
  font-weight: normal!important;\
  padding: 5px!important;\
  text-decoration:none!important;\
  opacity:0.3!important;\
  filter:alpha(opacity=40)!important; /* For IE8 and earlier */\
  transition: opacity .25s ease-in-out!important;\
  -moz-transition: opacity .25s ease-in-out!important;\
  -webkit-transition: opacity .25s ease-in-out!important;\
  -webkit-touch-callout: none!important;\
  -webkit-user-select: none!important;\
  -khtml-user-select: none!important;\
  -moz-user-select: none!important;\
  -ms-user-select: none!important;\
  user-select: none!important;\
}\
#nongreedy-jsli:hover {\
  opacity:1.0!important;\
  filter:alpha(opacity=100)!important; /* For IE8 and earlier */\
}\
\
#nongreedy-sidebar {\
  display:none;\
  overflow: hidden!important;\
  font: 15px Verdana,helvetica,arial,clean,sans-serif!important;\
  padding:0!important;\
  margin:0!important;\
  z-index: 99999!important;\
  background: url('" + GM_getResourceURL("100-90-5-monochrome") + "') repeat 0 0 #999999!important;\
  text-align: center!important;\
  position: fixed!important;\
  top: 10px!important;\
  bottom: 10px!important;\
  right: 10px!important;\
  width: 33%!important;\
  border-radius: 5px 5px 5px 5px!important;\
  color: rgb(51, 51, 51)!important;\
  text-decoration:none!important;\
  -moz-box-shadow: 0 0 10px rgba(0,0,0,0.5)!important; /* Для Firefox */\
  -webkit-box-shadow: 0 0 10px rgba(0,0,0,0.5)!important; /* Для Safari и Chrome */\
  box-shadow: 0 0 10px rgba(0,0,0,0.5)!important; /* Параметры тени */\
  -webkit-touch-callout: none!important;\
  -webkit-user-select: none!important;\
  -khtml-user-select: none!important;\
  -moz-user-select: none!important;\
  -ms-user-select: none!important;\
  user-select: none!important;\
}\
\
#nongreedy-tags-wrapper {\
  overflow: hidden!important;\
  margin:0!important;\
  position: absolute!important;\
  margin: 0.35em!important;\
  top: 0!important;\
  bottom: 0!important;\
  right: 0!important;\
  left: 0!important;\
  border: 1px solid grey;\
  border-radius: 5px 5px 5px 5px!important;\
}\
\
/* tag cloud */\
#nongreedy-sidebar .tag_box {\
  *zoom: 1!important;\
  padding: 0!important;\
  margin: 0!important; \
  list-style: none!important;\
  -webkit-border-radius: 3px!important;\
  -moz-border-radius: 3px!important;\
  border-radius: 3px!important;\
  -moz-background-clip: padding!important;\
  -webkit-background-clip: padding-box!important;\
  background-clip: padding-box!important;\
}\
#nongreedy-sidebar .tag_box li {\
  display: inline!important;\
  line-height: normal!important;\
  vertical-align: middle!important;\
}\
#nongreedy-sidebar .tag_box a {\
  color: #2d2d2d!important;\
  text-decoration: none!important;\
  background-color: #99cc99!important;\
  float: left!important;\
  border: 1px solid #448844!important;\
  padding: 3px 6px 3px 6px!important;\
  -webkit-border-radius: 3px!important;\
  -moz-border-radius: 3px!important;\
  border-radius: 3px!important;\
  margin: 5px!important;\
  -moz-background-clip: padding!important;\
  -webkit-background-clip: padding-box!important;\
  background-clip: padding-box!important;\
  text-shadow: 0 -1px 0 rgba(255, 255, 255, 0.4)!important;\
  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2)!important;\
  -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2)!important;\
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2)!important;\
  -webkit-transition-duration: 0.2s!important;\
  -moz-transition-duration: 0.2s!important;\
  transition-duration: 0.2s!important;\
  -webkit-user-select: none!important;\
  -moz-user-select: none!important;\
  -ms-user-select: none!important;\
  user-select: none!important;\
}\
#nongreedy-sidebar .tag_box a:active {\
  -webkit-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6)!important;\
  -moz-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6)!important;\
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6)!important;\
  background: #336633!important;\
  border: solid #336633!important;\
}\
#nongreedy-sidebar .tag_box a:hover {\
  background-color: #77bb77!important;\
  border: 1px solid #336633!important;\
}\
\
#nongreedy-sidebar .tag_box a:visited {\
  color: #141414!important;\
  text-decoration: none!important;\
}\
#nongreedy-sidebar .tag_box a:hover {\
  color: #474747!important;\
  text-decoration: none!important;\
}\
\
#nongreedy-sidebar .tag_box a:hover span {\
  background-color: #e1e1e1!important;\
  border: 1px solid #77bb77!important;\
}\
#nongreedy-sidebar .tag_box span {\
  background-color: #fafafa!important;\
  border: 1px solid #99cc99!important;\
  padding: 1px 4px!important;\
  -webkit-border-radius: 7px!important;\
  -moz-border-radius: 7px!important;\
  border-radius: 7px!important;\
  color: #1a1a1a!important;\
  display: inline-block!important;\
  position: relative!important;\
  vertical-align: middle!important;\
  top: -1px!important;\
  font-weight: bold!important;\
  font-size: 7px!important;\
  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2)!important;\
  -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2)!important;\
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2)!important;\
}\
#nongreedy-sidebar .tag_box:before,\
#nongreedy-sidebar .tag_box:after { content: \"\"!important; display: table!important; }\
\
#nongreedy-sidebar .tag_box:after { clear: both!important; }\
");
}

