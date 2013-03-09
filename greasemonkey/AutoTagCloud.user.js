// ==UserScript==

// @name		AutoTagCloud
// @description		Language identification button, tag cloud sidebar with styling.
// @namespace		http://AutoTagCloud.com/
// @version		0.1
// @include		*
// @copyright		2013+, Oleg Mazko
// @icon		http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/mars.png

// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/jquery-1.9.1.min.js
// @require  http://mazko.github.com/jssnowball/lib/Snowball.js

// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/Taggregator.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/ca.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/cs.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/da.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/de.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/en.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/es.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/fi.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/fr.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/ga.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/hu.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/hy.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/it.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/nl.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/no.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/pt.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/ro.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/ru.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/sl.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/sv.js
// @require  http://mazko.github.com/jstaggregator/greasemonkey/js/stopaddons/tr.js

// @require  http://mazko.github.com/jsli/lib/LanguageIdentifier.js
// @require  http://mazko.github.com/jsli/lib/Lng/ca.js
// @require  http://mazko.github.com/jsli/lib/Lng/cs.js
// @require  http://mazko.github.com/jsli/lib/Lng/da.js
// @require  http://mazko.github.com/jsli/lib/Lng/de.js
// @require  http://mazko.github.com/jsli/lib/Lng/en.js
// @require  http://mazko.github.com/jsli/lib/Lng/es.js
// @require  http://mazko.github.com/jsli/lib/Lng/fi.js
// @require  http://mazko.github.com/jsli/lib/Lng/fr.js
// @require  http://mazko.github.com/jsli/lib/Lng/ga.js
// @require  http://mazko.github.com/jsli/lib/Lng/hu.js
// @require  http://mazko.github.com/jsli/lib/Lng/hy.js
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
// @resource cs http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/CZ.png
// @resource da http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/DK.png
// @resource de http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/DE.png
// @resource en http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/GB.png
// @resource es http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/ES.png
// @resource fi http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/FI.png
// @resource fr http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/FR.png
// @resource ga http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/IE.png
// @resource hu http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/HU.png
// @resource hy http://mazko.github.com/jstaggregator/greasemonkey/img/flags/64/AM.png
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

// @resource cssstyle http://mazko.github.com/jstaggregator/greasemonkey/css/style.css

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
    
    var tokenStream = Taggregator.create(text, lng, progress);
    
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
                
                tags_array.sort(function(a, b) {
                    return (b.offsetMatrix.length - a.offsetMatrix.length) || 
                        (text.charCodeAt(a.offsetMatrix[0][0].start) - text.charCodeAt(b.offsetMatrix[0][0].start));
                });
                
                //tags_array.sort(function(a, b) {
                //	var res = b.offsetMatrix.length - a.offsetMatrix.length;
                //	if (res) return res;
                //	var aFirst = text.charAt(a.offsetMatrix[0][0].start), bFirst = text.charAt(b.offsetMatrix[0][0].start);
                //	return (aFirst < bFirst ? -1 : (aFirst > bFirst ? 1 : 0)); 
                //});
                
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
                                        GM_log(text + ": " + Array.prototype.map.call(text, function(x) { return x.charCodeAt(0); }));
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
        title: GM_info.script.name + ' v' + GM_info.script.version + ' BETA | ' + LanguageIdentifier.getSupportedLanguages()
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
        GM_openInTab("http://AutoTagCloud.com/");
        zEvent.stopPropagation(); 
        zEvent.preventDefault();
    });
    //--- Style our newly added elements using CSS.
    (function() {
        var cssTxt  = GM_getResourceText("cssstyle");
        GM_addStyle (cssTxt);
    }());
}

