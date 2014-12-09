// Generated by CoffeeScript 1.8.0
(function() {
  var FlagWidget, SidebarWidget, UrimSandbox, UrimWidget, urim_sandbox,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  UrimSandbox = (function() {
    function UrimSandbox() {
      var detach_cb, get_selection_cb, is_this_worker_alive;
      get_selection_cb = null;
      this.emit_get_selection = function() {
        var _base;
        return typeof get_selection_cb === "function" ? get_selection_cb(typeof window !== "undefined" && window !== null ? typeof window.getSelection === "function" ? typeof (_base = window.getSelection()).toString === "function" ? _base.toString() : void 0 : void 0 : void 0) : void 0;
      };
      this.on_self_got_selection = function(cb) {
        return get_selection_cb = cb;
      };
      is_this_worker_alive = true;
      detach_cb = null;
      this.on_self_detach = function(cb) {
        return detach_cb = cb;
      };
      this.is_worker_alive = function() {
        return is_this_worker_alive;
      };
      chrome.runtime.onMessage.addListener((function(_this) {
        return function(request, sender, sendResponse) {
          console.log('request: ', request);
          switch (request != null ? request.method : void 0) {
            case 'detach':
              is_this_worker_alive = false;
              return typeof detach_cb === "function" ? detach_cb() : void 0;
            case 'cloud':
              is_this_worker_alive = true;
              _this.emit_get_selection();
              return sendResponse({
                result: 'OK'
              });
            default:
              return console.log('unhandled method: ', request.method);
          }
        };
      })(this));
    }

    UrimSandbox.prototype.emit_tag_clicked = function(model, cb) {
      var doSearch, hlcolor, hlcolors, tag, _i, _len, _ref, _results;
      hlcolors = ['aqua', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'yellow'];
      hlcolor = hlcolors[Math.floor(Math.random() * hlcolors.length)];
      doSearch = function(text) {
        var error, sel, textRange, watchdog, _results;
        if (window.find && window.getSelection) {
          document.designMode = "on";
          try {
            sel = window.getSelection();
            sel.collapse(document.body, 0);
            watchdog = 1000;
            while (--watchdog && window.find(text)) {
              document.execCommand("HiliteColor", false, hlcolor);
              sel.collapseToEnd();
            }
            if (!watchdog) {
              console.log('Too many highlights - force break.');
            }
          } catch (_error) {
            error = _error;
            console.log(error);
          }
          return document.designMode = "off";
        } else if (document.body.createTextRange) {
          textRange = document.body.createTextRange();
          _results = [];
          while (textRange.findText(text)) {
            textRange.execCommand("BackColor", false, hlcolor);
            _results.push(textRange.collapse(false));
          }
          return _results;
        }
      };
      try {
        _ref = model.tags;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tag = _ref[_i];
          _results.push(doSearch(tag));
        }
        return _results;
      } finally {
        if (typeof cb === "function") {
          cb();
        }
      }
    };

    UrimSandbox.prototype.options = (function() {
      var loadData;
      loadData = function(css) {
        var req;
        req = new XMLHttpRequest();
        req.open('GET', chrome.extension.getURL(css), false);
        req.send();
        return req.responseText;
      };
      return {
        cssiframes: loadData('data/css/iframes.css'),
        cssli: loadData('data/css/li.css'),
        csssidebar: loadData('data/css/sidebar.css'),
        ca: chrome.extension.getURL('data/images/flags/64/AD.png'),
        cs: chrome.extension.getURL('data/images/flags/64/CZ.png'),
        da: chrome.extension.getURL('data/images/flags/64/DK.png'),
        de: chrome.extension.getURL('data/images/flags/64/DE.png'),
        en: chrome.extension.getURL('data/images/flags/64/GB.png'),
        es: chrome.extension.getURL('data/images/flags/64/ES.png'),
        fi: chrome.extension.getURL('data/images/flags/64/FI.png'),
        fr: chrome.extension.getURL('data/images/flags/64/FR.png'),
        ga: chrome.extension.getURL('data/images/flags/64/IE.png'),
        hu: chrome.extension.getURL('data/images/flags/64/HU.png'),
        hy: chrome.extension.getURL('data/images/flags/64/AM.png'),
        it: chrome.extension.getURL('data/images/flags/64/IT.png'),
        nl: chrome.extension.getURL('data/images/flags/64/NL.png'),
        no: chrome.extension.getURL('data/images/flags/64/NO.png'),
        pt: chrome.extension.getURL('data/images/flags/64/PT.png'),
        ro: chrome.extension.getURL('data/images/flags/64/RO.png'),
        ru: chrome.extension.getURL('data/images/flags/64/UA.png'),
        sl: chrome.extension.getURL('data/images/flags/64/SI.png'),
        sv: chrome.extension.getURL('data/images/flags/64/SE.png'),
        tr: chrome.extension.getURL('data/images/flags/64/TR.png')
      };
    })();

    return UrimSandbox;

  })();

  urim_sandbox = new UrimSandbox;

  $('head').append($('<style/>').attr('type', 'text/css').html(urim_sandbox.options.cssiframes));

  UrimWidget = (function() {
    function UrimWidget(settings, div_id, css) {
      var div, iframe;
      div = $('<div/>', {
        id: div_id
      });
      iframe = $('<iframe />', settings).load(function() {
        $(this).contents().find('head').append($('<style/>').attr('type', 'text/css').html(css));
        return $(this).contents().find('body').append(div);
      }).appendTo((function(to) {
        if (to.length) {
          return to;
        } else {
          return document.documentElement;
        }
      })($('body')));
      this.super_protected = function() {
        return {
          div: div,
          iframe: iframe
        };
      };
      this.detach = function() {
        return iframe.remove();
      };
    }

    return UrimWidget;

  })();

  FlagWidget = (function(_super) {
    __extends(FlagWidget, _super);

    function FlagWidget() {
      return FlagWidget.__super__.constructor.apply(this, arguments);
    }

    FlagWidget.prototype.set_text = function(text) {
      return this.super_protected().div.text(text);
    };

    FlagWidget.prototype.clear_text = function() {
      return this.super_protected().div.text('');
    };

    FlagWidget.prototype.set_flag = function(lng) {
      return this.super_protected().div.attr({
        title: 'ISO 639: ' + lng,
        style: "background-image: url(' " + urim_sandbox.options[lng] + " ');"
      });
    };

    return FlagWidget;

  })(UrimWidget);

  SidebarWidget = (function(_super) {
    __extends(SidebarWidget, _super);

    function SidebarWidget() {
      var debounce, jquery_window, on_resize_cb, resized_when_sidebar_was_hidden;
      jquery_window = $(window);
      resized_when_sidebar_was_hidden = false;
      on_resize_cb = [];
      debounce = function(func, threshold, execAsap) {
        var timeout;
        timeout = null;
        return function() {
          var args, delayed, obj;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          obj = this;
          delayed = function() {
            if (!execAsap) {
              func.apply(obj, args);
            }
            return timeout = null;
          };
          if (timeout) {
            clearTimeout(timeout);
          } else if (execAsap) {
            func.apply(obj, args);
          }
          return timeout = setTimeout(delayed, threshold || 100);
        };
      };
      jquery_window.resize(debounce((function(_this) {
        return function() {
          var func, _i, _len, _results;
          if (_this.super_protected().iframe.is(':visible')) {
            _results = [];
            for (_i = 0, _len = on_resize_cb.length; _i < _len; _i++) {
              func = on_resize_cb[_i];
              _results.push(func());
            }
            return _results;
          } else {
            return resized_when_sidebar_was_hidden = true;
          }
        };
      })(this)));
      this.resize = function(func) {
        var _i, _len, _results;
        if (func) {
          return on_resize_cb.push(func);
        } else {
          if (resized_when_sidebar_was_hidden) {
            resized_when_sidebar_was_hidden = false;
            _results = [];
            for (_i = 0, _len = on_resize_cb.length; _i < _len; _i++) {
              func = on_resize_cb[_i];
              _results.push(func());
            }
            return _results;
          }
        }
      };
      SidebarWidget.__super__.constructor.apply(this, arguments);
    }

    SidebarWidget.prototype.anchorToWidget = function(widget) {
      this.super_protected().div.empty();
      this.super_protected().iframe.fadeIn(1000);
      widget.super_protected().iframe.mouseenter((function(_this) {
        return function() {
          _this.super_protected().iframe.fadeIn(1000);
          return _this.resize();
        };
      })(this));
      return this.super_protected().iframe.mouseleave((function(_this) {
        return function() {
          return _this.super_protected().iframe.fadeOut(1000);
        };
      })(this));
    };

    SidebarWidget.prototype.showTags = function(text, tags_array) {
      var container, containerAppendTagsUntillNoOverflow, containerNextPage, containerRemoveTagsUntillOverflow, start, tag_box, ugly_self_fade_in, ugly_self_hide;
      container = this.super_protected().div;
      tags_array.sort(function(a, b) {
        return (b.offsetMatrix.length - a.offsetMatrix.length) || (text.charCodeAt(a.offsetMatrix[0][0].start) - text.charCodeAt(b.offsetMatrix[0][0].start));
      });
      tag_box = $('<ul/>', {
        "class": 'tag_box'
      }).appendTo(container);
      start = 0;
      ugly_self_hide = (function(_this) {
        return function() {
          return _this.super_protected().iframe.hide();
        };
      })(this);
      ugly_self_fade_in = (function(_this) {
        return function(v) {
          return _this.super_protected().iframe.fadeIn(v);
        };
      })(this);
      containerAppendTagsUntillNoOverflow = function() {
        if (tag_box.height() > container.height()) {
          return console.log("Append not require " + (tag_box.height()) + " t : s " + (container.height()));
        } else {
          return tags_array.slice(start).some(function(value) {
            var entriesAsTextAndUnique, getOriginEntryText, getPrettyEntryText, keys, last_appended;
            getOriginEntryText = function(offsetArray) {
              var first, last;
              first = offsetArray[0], last = offsetArray[offsetArray.length - 1];
              return text.substring(first.start, last.end);
            };
            entriesAsTextAndUnique = function(entries) {
              var v;
              return ((function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = entries.length; _i < _len; _i++) {
                  v = entries[_i];
                  _results.push(getOriginEntryText(v));
                }
                return _results;
              })()).filter(function(value, index, self) {
                return self.indexOf(value) === index;
              });
            };
            getPrettyEntryText = function(offsetArray) {
              var v;
              return ((function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = offsetArray.length; _i < _len; _i++) {
                  v = offsetArray[_i];
                  _results.push(text.substring(v.start, v.end));
                }
                return _results;
              })()).join(' ');
            };
            keys = entriesAsTextAndUnique(value.offsetMatrix);
            last_appended = $('<li/>').attr({
              title: keys.join('\n')
            }).appendTo(tag_box).click(function(e) {
              var items, model, which_enum;
              items = $(this).attr('title').split('\n').filter(function(value, index, self) {
                return self.indexOf(value) === index;
              });
              which_enum = {
                1: 'left',
                2: 'middle',
                3: 'right'
              };
              model = {
                which: which_enum[e.which],
                tags: items,
                shift: e.shiftKey,
                ctrl: e.ctrlKey,
                alt: e.altKey
              };
              ugly_self_hide();
              urim_sandbox.emit_tag_clicked(model, function() {
                return ugly_self_fade_in(1000);
              });
              e.preventDefault();
              return e.stopPropagation();
            });
            $('<a/>').attr({
              href: "#" + (keys.join('#'))
            }).html("" + (getPrettyEntryText(value.offsetMatrix[0])) + " <span>" + value.offsetMatrix.length + "</span>").appendTo(last_appended);
            if (tag_box.height() > container.height()) {
              console.log("Last append overflowed, step back " + (tag_box.height()) + " t : s " + (container.height()));
              last_appended.remove();
              console.log("" + (tag_box.height()) + " t : s " + (container.height()));
              return true;
            } else {
              start++;
              return false;
            }
          });
        }
      };
      containerRemoveTagsUntillOverflow = function() {
        if (tag_box.height() <= container.height()) {
          return console.log("Remove not require: " + (tag_box.height()) + " t : s " + (container.height()));
        } else {
          tag_box.children().get().reverse().some(function(value) {
            if (tag_box.height() > container.height()) {
              value.remove();
              start--;
              return false;
            } else {
              return true;
            }
          });
          return console.log("Last remove: " + (tag_box.height()) + " t : s " + (container.height()));
        }
      };
      this.resize(function() {
        console.log("Resize triggered - fit tags in sidebar");
        containerAppendTagsUntillNoOverflow();
        return containerRemoveTagsUntillOverflow();
      });
      containerNextPage = function() {
        tag_box.empty();
        return containerAppendTagsUntillNoOverflow();
      };
      container.click(function(e) {
        if (e.ctrlKey) {
          if (start < tags_array.length) {
            return containerNextPage();
          }
        } else if (e.shiftKey) {
          start = 0;
          return containerNextPage();
        }
      });
      return containerNextPage();
    };

    return SidebarWidget;

  })(UrimWidget);

  urim_sandbox.on_self_got_selection(function(plain_text) {
    var async, htmlBodyToText, lng, tokenStream, tokensMap, widget_flag, widget_sidebar;
    widget_flag = new FlagWidget({
      id: 'i-li-autotagcloud',
      allowTransparency: 'true',
      frameBorder: '0',
      scrolling: 'no',
      src: 'about:blank'
    }, 'li', urim_sandbox.options.cssli);
    widget_sidebar = new SidebarWidget({
      id: 'i-sidebar-autotagcloud',
      frameBorder: '0',
      scrolling: 'no',
      src: 'about:blank'
    }, 'tags-wrapper', urim_sandbox.options.csssidebar);
    urim_sandbox.on_self_detach(function() {
      var widget, _i, _len, _ref, _results;
      _ref = [widget_flag, widget_sidebar];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        widget = _ref[_i];
        _results.push(widget.detach());
      }
      return _results;
    });
    htmlBodyToText = function(body) {
      return $.trim(body.clone().find('script,noscript,style,#i-li-autotagcloud,#i-sidebar-autotagcloud').remove().end().text());
    };
    plain_text || (plain_text = (function(top) {
      var frame, frameText, res, _i, _len, _ref, _ref1;
      res = top ? [top] : [];
      if ((typeof window !== "undefined" && window !== null ? (_ref = window.frames) != null ? _ref.length : void 0 : void 0) != null) {
        _ref1 = window.frames;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          frame = _ref1[_i];

          /*
          FF: Permission denied to access property 'document'
          Chrome: SecurityError ... Protocols, domains, and ports must match
           */
          try {
            frameText = htmlBodyToText($(frame.document).contents().find('body'));
            if (frameText) {
              res.push(frameText);
            }
          } catch (_error) {}
        }
      }
      return res.join();
    })(htmlBodyToText($('body'))));
    lng = LanguageIdentifier.identify(plain_text).language;
    tokenStream = Taggregator.create(plain_text, lng, function(pos, total) {
      return widget_flag.set_text(Math.floor(100 * pos / total) + ' %');
    });
    widget_flag.set_flag(lng);
    tokensMap = {};
    return (async = function() {
      var item, key, offsetMatrix, tags_array, token, tokenTerm, value;
      token = tokenStream.incrementToken();
      if (token) {
        tokenTerm = token.term;
        item = tokensMap.hasOwnProperty(tokenTerm) && tokensMap[tokenTerm];
        if (item) {
          offsetMatrix = item.offsetMatrix;
          offsetMatrix.push(token.offset);
        } else {
          tokensMap[tokenTerm] = {
            'offsetMatrix': [token.offset]
          };
        }
        return urim_sandbox.is_worker_alive() && setTimeout(async, 1);
      } else {
        widget_flag.clear_text();
        widget_sidebar.anchorToWidget(widget_flag);
        tags_array = (function() {
          var _results;
          _results = [];
          for (key in tokensMap) {
            if (!__hasProp.call(tokensMap, key)) continue;
            value = tokensMap[key];
            _results.push(value);
          }
          return _results;
        })();
        return widget_sidebar.showTags(plain_text, tags_array);
      }
    })();
  });

  urim_sandbox.emit_get_selection();

}).call(this);
