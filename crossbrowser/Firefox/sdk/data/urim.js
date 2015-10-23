// Generated by CoffeeScript 1.10.0
(function() {
  var FlagWidget, SidebarWidget, UrimSandbox, UrimWidget, urim_sandbox,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  UrimSandbox = (function() {
    function UrimSandbox() {
      var detach_cb, is_this_worker_alive, tag_clicked_cb;
      is_this_worker_alive = true;
      detach_cb = null;
      self.port.on('detach', function() {
        is_this_worker_alive = false;
        return typeof detach_cb === "function" ? detach_cb() : void 0;
      });
      this.on_self_detach = function(cb) {
        return detach_cb = cb;
      };
      this.is_worker_alive = function() {
        return is_this_worker_alive;
      };
      tag_clicked_cb = null;
      self.port.on('urim_on_tag_click_processed', function() {
        if (typeof tag_clicked_cb === "function") {
          tag_clicked_cb();
        }
        return tag_clicked_cb = null;
      });
      this.emit_tag_clicked = function(model, cb) {
        tag_clicked_cb = cb;
        return self.port.emit('urim_tag_clicked', model);
      };
    }

    UrimSandbox.prototype.emit_get_selection = function() {
      return self.port.emit('urim_get_selection');
    };

    UrimSandbox.prototype.on_self_got_selection = function(cb) {
      return self.port.on('urim_on_got_selection', cb);
    };

    UrimSandbox.prototype.options = self.options;

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

  FlagWidget = (function(superClass) {
    extend(FlagWidget, superClass);

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

  SidebarWidget = (function(superClass) {
    extend(SidebarWidget, superClass);

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
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
          var func, i, len, results;
          if (_this.super_protected().iframe.is(':visible')) {
            results = [];
            for (i = 0, len = on_resize_cb.length; i < len; i++) {
              func = on_resize_cb[i];
              results.push(func());
            }
            return results;
          } else {
            return resized_when_sidebar_was_hidden = true;
          }
        };
      })(this)));
      this.resize = function(func) {
        var i, len, results;
        if (func) {
          return on_resize_cb.push(func);
        } else {
          if (resized_when_sidebar_was_hidden) {
            resized_when_sidebar_was_hidden = false;
            results = [];
            for (i = 0, len = on_resize_cb.length; i < len; i++) {
              func = on_resize_cb[i];
              results.push(func());
            }
            return results;
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
                var i, len, results;
                results = [];
                for (i = 0, len = entries.length; i < len; i++) {
                  v = entries[i];
                  results.push(getOriginEntryText(v));
                }
                return results;
              })()).filter(function(value, index, self) {
                return self.indexOf(value) === index;
              });
            };
            getPrettyEntryText = function(offsetArray) {
              var v;
              return ((function() {
                var i, len, results;
                results = [];
                for (i = 0, len = offsetArray.length; i < len; i++) {
                  v = offsetArray[i];
                  results.push(text.substring(v.start, v.end));
                }
                return results;
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
            }).html((getPrettyEntryText(value.offsetMatrix[0])) + " <span>" + value.offsetMatrix.length + "</span>").appendTo(last_appended);
            if (tag_box.height() > container.height()) {
              console.log("Last append overflowed, step back " + (tag_box.height()) + " t : s " + (container.height()));
              last_appended.remove();
              console.log((tag_box.height()) + " t : s " + (container.height()));
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
      var i, len, ref, results, widget;
      ref = [widget_flag, widget_sidebar];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        widget = ref[i];
        results.push(widget.detach());
      }
      return results;
    });
    htmlBodyToText = function(body) {
      return $.trim(body.clone().find('script,noscript,style,#i-li-autotagcloud,#i-sidebar-autotagcloud').remove().end().text());
    };
    plain_text || (plain_text = (function(top) {
      var frame, frameText, i, len, ref, ref1, res;
      res = top ? [top] : [];
      if ((typeof window !== "undefined" && window !== null ? (ref = window.frames) != null ? ref.length : void 0 : void 0) != null) {
        ref1 = window.frames;
        for (i = 0, len = ref1.length; i < len; i++) {
          frame = ref1[i];

          /*
          FF: Permission denied to access property 'document'
          Chrome: SecurityError ... Protocols, domains, and ports must match
           */
          try {
            frameText = htmlBodyToText($(frame.document).contents().find('body'));
            if (frameText) {
              res.push(frameText);
            }
          } catch (undefined) {}
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
          var results;
          results = [];
          for (key in tokensMap) {
            if (!hasProp.call(tokensMap, key)) continue;
            value = tokensMap[key];
            results.push(value);
          }
          return results;
        })();
        return widget_sidebar.showTags(plain_text, tags_array);
      }
    })();
  });

  urim_sandbox.emit_get_selection();

}).call(this);
