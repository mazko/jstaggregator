function ReadabilityWrapper(urimDocument) {
	/* This Source Code Form is subject to the terms of the Mozilla Public
	 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
	 * You can obtain one at http://mozilla.org/MPL/2.0/. */
	
	/**
	 * This is a relatively lightweight DOMParser that is safe to use in a web
	 * worker. This is far from a complete DOM implementation; however, it should
	 * contain the minimal set of functionality necessary for Readability.js.
	 *
	 * Aside from not implementing the full DOM API, there are other quirks to be
	 * aware of when using the JSDOMParser:
	 *
	 *   1) Properly formed HTML/XML must be used. This means you should be extra
	 *      careful when using this parser on anything received directly from an
	 *      XMLHttpRequest. Providing a serialized string from an XMLSerializer,
	 *      however, should be safe (since the browser's XMLSerializer should
	 *      generate valid HTML/XML). Therefore, if parsing a document from an XHR,
	 *      the recommended approach is to do the XHR in the main thread, use
	 *      XMLSerializer.serializeToString() on the responseXML, and pass the
	 *      resulting string to the worker.
	 *
	 *   2) Live NodeLists are not supported. DOM methods and properties such as
	 *      getElementsByTagName() and childNodes return standard arrays. If you
	 *      want these lists to be updated when nodes are removed or added to the
	 *      document, you must take care to manually update them yourself.
	 */
	(function (global) {
	
	  function error(m) {
	    dump("JSDOMParser error: " + m + "\n");
	  }
	
	  // XML only defines these and the numeric ones:
	
	  var entityTable = {
	    "lt": "<",
	    "gt": ">",
	    "amp": "&",
	    "quot": '"',
	    "apos": "'",
	  };
	
	  var reverseEntityTable = {
	    "<": "&lt;",
	    ">": "&gt;",
	    "&": "&amp;",
	    '"': "&quot;",
	    "'": "&apos;",
	  };
	
	  function encodeTextContentHTML(s) {
	    return s.replace(/[&<>]/g, function(x) {
	      return reverseEntityTable[x];
	    });
	  }
	
	  function encodeHTML(s) {
	    return s.replace(/[&<>'"]/g, function(x) {
	      return reverseEntityTable[x];
	    });
	  }
	
	  function decodeHTML(str) {
	    return str.replace(/&(quot|amp|apos|lt|gt);/g, function(match, tag) {
	      return entityTable[tag];
	    }).replace(/&#(?:x([0-9a-z]{1,4})|([0-9]{1,4}));/gi, function(match, hex, numStr) {
	      var num = parseInt(hex || numStr, hex ? 16 : 10); // read num
	      return String.fromCharCode(num);
	    });
	  }
	
	  // When a style is set in JS, map it to the corresponding CSS attribute
	  var styleMap = {
	    "alignmentBaseline": "alignment-baseline",
	    "background": "background",
	    "backgroundAttachment": "background-attachment",
	    "backgroundClip": "background-clip",
	    "backgroundColor": "background-color",
	    "backgroundImage": "background-image",
	    "backgroundOrigin": "background-origin",
	    "backgroundPosition": "background-position",
	    "backgroundPositionX": "background-position-x",
	    "backgroundPositionY": "background-position-y",
	    "backgroundRepeat": "background-repeat",
	    "backgroundRepeatX": "background-repeat-x",
	    "backgroundRepeatY": "background-repeat-y",
	    "backgroundSize": "background-size",
	    "baselineShift": "baseline-shift",
	    "border": "border",
	    "borderBottom": "border-bottom",
	    "borderBottomColor": "border-bottom-color",
	    "borderBottomLeftRadius": "border-bottom-left-radius",
	    "borderBottomRightRadius": "border-bottom-right-radius",
	    "borderBottomStyle": "border-bottom-style",
	    "borderBottomWidth": "border-bottom-width",
	    "borderCollapse": "border-collapse",
	    "borderColor": "border-color",
	    "borderImage": "border-image",
	    "borderImageOutset": "border-image-outset",
	    "borderImageRepeat": "border-image-repeat",
	    "borderImageSlice": "border-image-slice",
	    "borderImageSource": "border-image-source",
	    "borderImageWidth": "border-image-width",
	    "borderLeft": "border-left",
	    "borderLeftColor": "border-left-color",
	    "borderLeftStyle": "border-left-style",
	    "borderLeftWidth": "border-left-width",
	    "borderRadius": "border-radius",
	    "borderRight": "border-right",
	    "borderRightColor": "border-right-color",
	    "borderRightStyle": "border-right-style",
	    "borderRightWidth": "border-right-width",
	    "borderSpacing": "border-spacing",
	    "borderStyle": "border-style",
	    "borderTop": "border-top",
	    "borderTopColor": "border-top-color",
	    "borderTopLeftRadius": "border-top-left-radius",
	    "borderTopRightRadius": "border-top-right-radius",
	    "borderTopStyle": "border-top-style",
	    "borderTopWidth": "border-top-width",
	    "borderWidth": "border-width",
	    "bottom": "bottom",
	    "boxShadow": "box-shadow",
	    "boxSizing": "box-sizing",
	    "captionSide": "caption-side",
	    "clear": "clear",
	    "clip": "clip",
	    "clipPath": "clip-path",
	    "clipRule": "clip-rule",
	    "color": "color",
	    "colorInterpolation": "color-interpolation",
	    "colorInterpolationFilters": "color-interpolation-filters",
	    "colorProfile": "color-profile",
	    "colorRendering": "color-rendering",
	    "content": "content",
	    "counterIncrement": "counter-increment",
	    "counterReset": "counter-reset",
	    "cursor": "cursor",
	    "direction": "direction",
	    "display": "display",
	    "dominantBaseline": "dominant-baseline",
	    "emptyCells": "empty-cells",
	    "enableBackground": "enable-background",
	    "fill": "fill",
	    "fillOpacity": "fill-opacity",
	    "fillRule": "fill-rule",
	    "filter": "filter",
	    "cssFloat": "float",
	    "floodColor": "flood-color",
	    "floodOpacity": "flood-opacity",
	    "font": "font",
	    "fontFamily": "font-family",
	    "fontSize": "font-size",
	    "fontStretch": "font-stretch",
	    "fontStyle": "font-style",
	    "fontVariant": "font-variant",
	    "fontWeight": "font-weight",
	    "glyphOrientationHorizontal": "glyph-orientation-horizontal",
	    "glyphOrientationVertical": "glyph-orientation-vertical",
	    "height": "height",
	    "imageRendering": "image-rendering",
	    "kerning": "kerning",
	    "left": "left",
	    "letterSpacing": "letter-spacing",
	    "lightingColor": "lighting-color",
	    "lineHeight": "line-height",
	    "listStyle": "list-style",
	    "listStyleImage": "list-style-image",
	    "listStylePosition": "list-style-position",
	    "listStyleType": "list-style-type",
	    "margin": "margin",
	    "marginBottom": "margin-bottom",
	    "marginLeft": "margin-left",
	    "marginRight": "margin-right",
	    "marginTop": "margin-top",
	    "marker": "marker",
	    "markerEnd": "marker-end",
	    "markerMid": "marker-mid",
	    "markerStart": "marker-start",
	    "mask": "mask",
	    "maxHeight": "max-height",
	    "maxWidth": "max-width",
	    "minHeight": "min-height",
	    "minWidth": "min-width",
	    "opacity": "opacity",
	    "orphans": "orphans",
	    "outline": "outline",
	    "outlineColor": "outline-color",
	    "outlineOffset": "outline-offset",
	    "outlineStyle": "outline-style",
	    "outlineWidth": "outline-width",
	    "overflow": "overflow",
	    "overflowX": "overflow-x",
	    "overflowY": "overflow-y",
	    "padding": "padding",
	    "paddingBottom": "padding-bottom",
	    "paddingLeft": "padding-left",
	    "paddingRight": "padding-right",
	    "paddingTop": "padding-top",
	    "page": "page",
	    "pageBreakAfter": "page-break-after",
	    "pageBreakBefore": "page-break-before",
	    "pageBreakInside": "page-break-inside",
	    "pointerEvents": "pointer-events",
	    "position": "position",
	    "quotes": "quotes",
	    "resize": "resize",
	    "right": "right",
	    "shapeRendering": "shape-rendering",
	    "size": "size",
	    "speak": "speak",
	    "src": "src",
	    "stopColor": "stop-color",
	    "stopOpacity": "stop-opacity",
	    "stroke": "stroke",
	    "strokeDasharray": "stroke-dasharray",
	    "strokeDashoffset": "stroke-dashoffset",
	    "strokeLinecap": "stroke-linecap",
	    "strokeLinejoin": "stroke-linejoin",
	    "strokeMiterlimit": "stroke-miterlimit",
	    "strokeOpacity": "stroke-opacity",
	    "strokeWidth": "stroke-width",
	    "tableLayout": "table-layout",
	    "textAlign": "text-align",
	    "textAnchor": "text-anchor",
	    "textDecoration": "text-decoration",
	    "textIndent": "text-indent",
	    "textLineThrough": "text-line-through",
	    "textLineThroughColor": "text-line-through-color",
	    "textLineThroughMode": "text-line-through-mode",
	    "textLineThroughStyle": "text-line-through-style",
	    "textLineThroughWidth": "text-line-through-width",
	    "textOverflow": "text-overflow",
	    "textOverline": "text-overline",
	    "textOverlineColor": "text-overline-color",
	    "textOverlineMode": "text-overline-mode",
	    "textOverlineStyle": "text-overline-style",
	    "textOverlineWidth": "text-overline-width",
	    "textRendering": "text-rendering",
	    "textShadow": "text-shadow",
	    "textTransform": "text-transform",
	    "textUnderline": "text-underline",
	    "textUnderlineColor": "text-underline-color",
	    "textUnderlineMode": "text-underline-mode",
	    "textUnderlineStyle": "text-underline-style",
	    "textUnderlineWidth": "text-underline-width",
	    "top": "top",
	    "unicodeBidi": "unicode-bidi",
	    "unicodeRange": "unicode-range",
	    "vectorEffect": "vector-effect",
	    "verticalAlign": "vertical-align",
	    "visibility": "visibility",
	    "whiteSpace": "white-space",
	    "widows": "widows",
	    "width": "width",
	    "wordBreak": "word-break",
	    "wordSpacing": "word-spacing",
	    "wordWrap": "word-wrap",
	    "writingMode": "writing-mode",
	    "zIndex": "z-index",
	    "zoom": "zoom",
	  };
	
	  // Elements that can be self-closing
	  var voidElems = {
	    "area": true,
	    "base": true,
	    "br": true,
	    "col": true,
	    "command": true,
	    "embed": true,
	    "hr": true,
	    "img": true,
	    "input": true,
	    "link": true,
	    "meta": true,
	    "param": true,
	    "source": true,
	    "wbr": true
	  };
	
	  var whitespace = [" ", "\t", "\n", "\r"];
	
	  // See http://www.w3schools.com/dom/dom_nodetype.asp
	  var nodeTypes = {
	    ELEMENT_NODE: 1,
	    ATTRIBUTE_NODE: 2,
	    TEXT_NODE: 3,
	    CDATA_SECTION_NODE: 4,
	    ENTITY_REFERENCE_NODE: 5,
	    ENTITY_NODE: 6,
	    PROCESSING_INSTRUCTION_NODE: 7,
	    COMMENT_NODE: 8,
	    DOCUMENT_NODE: 9,
	    DOCUMENT_TYPE_NODE: 10,
	    DOCUMENT_FRAGMENT_NODE: 11,
	    NOTATION_NODE: 12
	  };
	
	  function getElementsByTagName(tag) {
	    tag = tag.toUpperCase();
	    var elems = [];
	    var allTags = (tag === "*");
	    function getElems(node) {
	      var length = node.children.length;
	      for (var i = 0; i < length; i++) {
	        var child = node.children[i];
	        if (allTags || (child.tagName === tag))
	          elems.push(child);
	        getElems(child);
	      }
	    }
	    getElems(this);
	    return elems;
	  }
	
	  var Node = function () {};
	
	  Node.prototype = {
	    attributes: null,
	    childNodes: null,
	    localName: null,
	    nodeName: null,
	    parentNode: null,
	    textContent: null,
	    nextSibling: null,
	    previousSibling: null,
	
	    get firstChild() {
	      return this.childNodes[0] || null;
	    },
	
	    get firstElementChild() {
	      return this.children[0] || null;
	    },
	
	    get lastChild() {
	      return this.childNodes[this.childNodes.length - 1] || null;
	    },
	
	    get lastElementChild() {
	      return this.children[this.children.length - 1] || null;
	    },
	
	    appendChild: function (child) {
	      if (child.parentNode) {
	        child.parentNode.removeChild(child);
	      }
	
	      var last = this.lastChild;
	      if (last)
	        last.nextSibling = child;
	      child.previousSibling = last;
	
	      if (child.nodeType === Node.ELEMENT_NODE) {
	        child.previousElementSibling = this.children[this.children.length - 1] || null;
	        this.children.push(child);
	        child.previousElementSibling && (child.previousElementSibling.nextElementSibling = child);
	      }
	      this.childNodes.push(child);
	      child.parentNode = this;
	    },
	
	    removeChild: function (child) {
	      var childNodes = this.childNodes;
	      var childIndex = childNodes.indexOf(child);
	      if (childIndex === -1) {
	        throw "removeChild: node not found";
	      } else {
	        child.parentNode = null;
	        var prev = child.previousSibling;
	        var next = child.nextSibling;
	        if (prev)
	          prev.nextSibling = next;
	        if (next)
	          next.previousSibling = prev;
	
	        if (child.nodeType === Node.ELEMENT_NODE) {
	          prev = child.previousElementSibling;
	          next = child.nextElementSibling;
	          if (prev)
	            prev.nextElementSibling = next;
	          if (next)
	            next.previousElementSibling = prev;
	          this.children.splice(this.children.indexOf(child), 1);
	        }
	
	        child.previousSibling = child.nextSibling = null;
	        child.previousElementSibling = child.nextElementSibling = null;
	
	        return childNodes.splice(childIndex, 1)[0];
	      }
	    },
	
	    replaceChild: function (newNode, oldNode) {
	      var childNodes = this.childNodes;
	      var childIndex = childNodes.indexOf(oldNode);
	      if (childIndex === -1) {
	        throw "replaceChild: node not found";
	      } else {
	        // This will take care of updating the new node if it was somewhere else before:
	        if (newNode.parentNode)
	          newNode.parentNode.removeChild(newNode);
	
	        childNodes[childIndex] = newNode;
	
	        // update the new node's sibling properties, and its new siblings' sibling properties
	        newNode.nextSibling = oldNode.nextSibling;
	        newNode.previousSibling = oldNode.previousSibling;
	        if (newNode.nextSibling)
	          newNode.nextSibling.previousSibling = newNode;
	        if (newNode.previousSibling)
	          newNode.previousSibling.nextSibling = newNode;
	
	        newNode.parentNode = this;
	
	        // Now deal with elements before we clear out those values for the old node,
	        // because it can help us take shortcuts here:
	        if (newNode.nodeType === Node.ELEMENT_NODE) {
	          if (oldNode.nodeType === Node.ELEMENT_NODE) {
	            // Both were elements, which makes this easier, we just swap things out:
	            newNode.previousElementSibling = oldNode.previousElementSibling;
	            newNode.nextElementSibling = oldNode.nextElementSibling;
	            if (newNode.previousElementSibling)
	              newNode.previousElementSibling.nextElementSibling = newNode;
	            if (newNode.nextElementSibling)
	              newNode.nextElementSibling.previousElementSibling = newNode;
	            this.children[this.children.indexOf(oldNode)] = newNode;
	          } else {
	            // Hard way:
	            newNode.previousElementSibling = (function() {
	              for (var i = childIndex - 1; i >= 0; i--) {
	                if (childNodes[i].nodeType === Node.ELEMENT_NODE)
	                  return childNodes[i];
	              }
	              return null;
	            })();
	            if (newNode.previousElementSibling) {
	              newNode.nextElementSibling = newNode.previousElementSibling.nextElementSibling;
	            } else {
	              newNode.nextElementSibling = (function() {
	                for (var i = childIndex + 1; i < childNodes.length; i++) {
	                  if (childNodes[i].nodeType === Node.ELEMENT_NODE)
	                    return childNodes[i];
	                }
	                return null;
	              })();
	            }
	            if (newNode.previousElementSibling)
	              newNode.previousElementSibling.nextElementSibling = newNode;
	            if (newNode.nextElementSibling)
	              newNode.nextElementSibling.previousElementSibling = newNode;
	
	            if (newNode.nextElementSibling)
	              this.children.splice(this.children.indexOf(newNode.nextElementSibling), 0, newNode);
	            else
	              this.children.push(newNode);
	          }
	        } else {
	          // new node is not an element node.
	          // if the old one was, update its element siblings:
	          if (oldNode.nodeType === Node.ELEMENT_NODE) {
	            if (oldNode.previousElementSibling)
	              oldNode.previousElementSibling.nextElementSibling = oldNode.nextElementSibling;
	            if (oldNode.nextElementSibling)
	              oldNode.nextElementSibling.previousElementSibling = oldNode.previousElementSibling;
	            this.children.splice(this.children.indexOf(oldNode), 1);
	          }
	          // If the old node wasn't an element, neither the new nor the old node was an element,
	          // and the children array and its members shouldn't need any updating.
	        }
	
	
	        oldNode.parentNode = null;
	        oldNode.previousSibling = null;
	        oldNode.nextSibling = null;
	        if (oldNode.nodeType === Node.ELEMENT_NODE) {
	          oldNode.previousElementSibling = null;
	          oldNode.nextElementSibling = null;
	        }
	        return oldNode;
	      }
	    },
	
	    __JSDOMParser__: true,
	  };
	
	  for (var i in nodeTypes) {
	    Node[i] = Node.prototype[i] = nodeTypes[i];
	  }
	
	  var Attribute = function (name, value) {
	    this.name = name;
	    this._value = value;
	  };
	
	  Attribute.prototype = {
	    get value() {
	      return this._value;
	    },
	    setValue: function(newValue) {
	      this._value = newValue;
	      delete this._decodedValue;
	    },
	    setDecodedValue: function(newValue) {
	      this._value = encodeHTML(newValue);
	      this._decodedValue = newValue;
	    },
	    getDecodedValue: function() {
	      if (typeof this._decodedValue === "undefined") {
	        this._decodedValue = (this._value && decodeHTML(this._value)) || "";
	      }
	      return this._decodedValue;
	    },
	  };
	
	  var Comment = function () {
	    this.childNodes = [];
	  };
	
	  Comment.prototype = {
	    __proto__: Node.prototype,
	
	    nodeName: "#comment",
	    nodeType: Node.COMMENT_NODE
	  };
	
	  var Text = function () {
	    this.childNodes = [];
	  };
	
	  Text.prototype = {
	    __proto__: Node.prototype,
	
	    nodeName: "#text",
	    nodeType: Node.TEXT_NODE,
	    get textContent() {
	      if (typeof this._textContent === "undefined") {
	        this._textContent = decodeHTML(this._innerHTML || "");
	      }
	      return this._textContent;
	    },
	    get innerHTML() {
	      if (typeof this._innerHTML === "undefined") {
	        this._innerHTML = encodeTextContentHTML(this._textContent || "");
	      }
	      return this._innerHTML;
	    },
	
	    set innerHTML(newHTML) {
	      this._innerHTML = newHTML;
	      delete this._textContent;
	    },
	    set textContent(newText) {
	      this._textContent = newText;
	      delete this._innerHTML;
	    },
	  }
	
	  var Document = function () {
	    this.styleSheets = [];
	    this.childNodes = [];
	    this.children = [];
	  };
	
	  Document.prototype = {
	    __proto__: Node.prototype,
	
	    nodeName: "#document",
	    nodeType: Node.DOCUMENT_NODE,
	    title: "",
	
	    getElementsByTagName: getElementsByTagName,
	
	    getElementById: function (id) {
	      function getElem(node) {
	        var length = node.children.length;
	        if (node.id === id)
	          return node;
	        for (var i = 0; i < length; i++) {
	          var el = getElem(node.children[i]);
	          if (el)
	            return el;
	        }
	        return null;
	      }
	      return getElem(this);
	    },
	
	    createElement: function (tag) {
	      var node = new Element(tag);
	      return node;
	    },
	
	    createTextNode: function (text) {
	      var node = new Text();
	      node.textContent = text;
	      return node;
	    },
	  };
	
	  var Element = function (tag) {
	    this.attributes = [];
	    this.childNodes = [];
	    this.children = [];
	    this.nextElementSibling = this.previousElementSibling = null;
	    this.localName = tag.toLowerCase();
	    this.tagName = tag.toUpperCase();
	    this.style = new Style(this);
	  };
	
	  Element.prototype = {
	    __proto__: Node.prototype,
	
	    nodeType: Node.ELEMENT_NODE,
	
	    getElementsByTagName: getElementsByTagName,
	
	    get className() {
	      return this.getAttribute("class") || "";
	    },
	
	    set className(str) {
	      this.setAttribute("class", str);
	    },
	
	    get id() {
	      return this.getAttribute("id") || "";
	    },
	
	    set id(str) {
	      this.setAttribute("id", str);
	    },
	
	    get href() {
	      return this.getAttribute("href") || "";
	    },
	
	    set href(str) {
	      this.setAttribute("href", str);
	    },
	
	    get src() {
	      return this.getAttribute("src") || "";
	    },
	
	    set src(str) {
	      this.setAttribute("src", str);
	    },
	
	    get nodeName() {
	      return this.tagName;
	    },
	
	    get innerHTML() {
	      function getHTML(node) {
	        var i = 0;
	        for (i = 0; i < node.childNodes.length; i++) {
	          var child = node.childNodes[i];
	          if (child.localName) {
	            arr.push("<" + child.localName);
	
	            // serialize attribute list
	            for (var j = 0; j < child.attributes.length; j++) {
	              var attr = child.attributes[j];
	              // the attribute value will be HTML escaped.
	              var val = attr.value;
	              var quote = (val.indexOf('"') === -1 ? '"' : "'");
	              arr.push(" " + attr.name + '=' + quote + val + quote);
	            }
	
	            if (child.localName in voidElems) {
	              // if this is a self-closing element, end it here
	              arr.push(">");
	            } else {
	              // otherwise, add its children
	              arr.push(">");
	              getHTML(child);
	              arr.push("</" + child.localName + ">");
	            }
	          } else {
	            // This is a text node, so asking for innerHTML won't recurse.
	            arr.push(child.innerHTML);
	          }
	        }
	      }
	
	      // Using Array.join() avoids the overhead from lazy string concatenation.
	      // See http://blog.cdleary.com/2012/01/string-representation-in-spidermonkey/#ropes
	      var arr = [];
	      getHTML(this);
	      return arr.join("");
	    },
	
	    set innerHTML(html) {
	      var parser = new JSDOMParser();
	      var node = parser.parse(html);
	      for (var i = this.childNodes.length; --i >= 0;) {
	        this.childNodes[i].parentNode = null;
	      }
	      this.childNodes = node.childNodes;
	      this.children = node.children;
	      for (var i = this.childNodes.length; --i >= 0;) {
	        this.childNodes[i].parentNode = this;
	      }
	    },
	
	    set textContent(text) {
	      // clear parentNodes for existing children
	      for (var i = this.childNodes.length; --i >= 0;) {
	        this.childNodes[i].parentNode = null;
	      }
	
	      var node = new Text();
	      this.childNodes = [ node ];
	      this.children = [];
	      node.textContent = text;
	      node.parentNode = this;
	    },
	
	    get textContent() {
	      function getText(node) {
	        var nodes = node.childNodes;
	        for (var i = 0; i < nodes.length; i++) {
	          var child = nodes[i];
	          if (child.nodeType === 3) {
	            text.push(child.textContent);
	          } else {
	            getText(child);
	          }
	        }
	      }
	
	      // Using Array.join() avoids the overhead from lazy string concatenation.
	      // See http://blog.cdleary.com/2012/01/string-representation-in-spidermonkey/#ropes
	      var text = [];
	      getText(this);
	      return text.join("");
	    },
	
	    getAttribute: function (name) {
	      for (var i = this.attributes.length; --i >= 0;) {
	        var attr = this.attributes[i];
	        if (attr.name === name)
	          return attr.getDecodedValue();
	      }
	      return undefined;
	    },
	
	    setAttribute: function (name, value) {
	      for (var i = this.attributes.length; --i >= 0;) {
	        var attr = this.attributes[i];
	        if (attr.name === name) {
	          attr.setDecodedValue(value);
	          return;
	        }
	      }
	      this.attributes.push(new Attribute(name, encodeHTML(value)));
	    },
	
	    removeAttribute: function (name) {
	      for (var i = this.attributes.length; --i >= 0;) {
	        var attr = this.attributes[i];
	        if (attr.name === name) {
	          this.attributes.splice(i, 1);
	          break;
	        }
	      }
	    }
	  };
	
	  var Style = function (node) {
	    this.node = node;
	  };
	
	  // getStyle() and setStyle() use the style attribute string directly. This
	  // won't be very efficient if there are a lot of style manipulations, but
	  // it's the easiest way to make sure the style attribute string and the JS
	  // style property stay in sync. Readability.js doesn't do many style
	  // manipulations, so this should be okay.
	  Style.prototype = {
	    getStyle: function (styleName) {
	      var attr = this.node.getAttribute("style");
	      if (!attr)
	        return undefined;
	
	      var styles = attr.split(";");
	      for (var i = 0; i < styles.length; i++) {
	        var style = styles[i].split(":");
	        var name = style[0].trim();
	        if (name === styleName)
	          return style[1].trim();
	      }
	
	      return undefined;
	    },
	
	    setStyle: function (styleName, styleValue) {
	      var value = this.node.getAttribute("style") || "";
	      var index = 0;
	      do {
	        var next = value.indexOf(";", index) + 1;
	        var length = next - index - 1;
	        var style = (length > 0 ? value.substr(index, length) : value.substr(index));
	        if (style.substr(0, style.indexOf(":")).trim() === styleName) {
	          value = value.substr(0, index).trim() + (next ? " " + value.substr(next).trim() : "");
	          break;
	        }
	        index = next;
	      } while (index);
	
	      value += " " + styleName + ": " + styleValue + ";";
	      this.node.setAttribute("style", value.trim());
	    }
	  };
	
	  // For each item in styleMap, define a getter and setter on the style
	  // property.
	  for (var jsName in styleMap) {
	    (function (cssName) {
	      Style.prototype.__defineGetter__(jsName, function () {
	        return this.getStyle(cssName);
	      });
	      Style.prototype.__defineSetter__(jsName, function (value) {
	        this.setStyle(cssName, value);
	      });
	    }) (styleMap[jsName]);
	  }
	
	  var JSDOMParser = function () {
	    this.currentChar = 0;
	
	    // In makeElementNode() we build up many strings one char at a time. Using
	    // += for this results in lots of short-lived intermediate strings. It's
	    // better to build an array of single-char strings and then join() them
	    // together at the end. And reusing a single array (i.e. |this.strBuf|)
	    // over and over for this purpose uses less memory than using a new array
	    // for each string.
	    this.strBuf = [];
	
	    // Similarly, we reuse this array to return the two arguments from
	    // makeElementNode(), which saves us from having to allocate a new array
	    // every time.
	    this.retPair = [];
	  };
	
	  JSDOMParser.prototype = {
	    /**
	     * Look at the next character without advancing the index.
	     */
	    peekNext: function () {
	      return this.html[this.currentChar];
	    },
	
	    /**
	     * Get the next character and advance the index.
	     */
	    nextChar: function () {
	      return this.html[this.currentChar++];
	    },
	
	    /**
	     * Called after a quote character is read. This finds the next quote
	     * character and returns the text string in between.
	     */
	    readString: function (quote) {
	      var str;
	      var n = this.html.indexOf(quote, this.currentChar);
	      if (n === -1) {
	        this.currentChar = this.html.length;
	        str = null;
	      } else {
	        str = this.html.substring(this.currentChar, n);
	        this.currentChar = n + 1;
	      }
	
	      return str;
	    },
	
	    /**
	     * Called when parsing a node. This finds the next name/value attribute
	     * pair and adds the result to the attributes list.
	     */
	    readAttribute: function (node) {
	      var name = "";
	
	      var n = this.html.indexOf("=", this.currentChar);
	      if (n === -1) {
	        this.currentChar = this.html.length;
	      } else {
	        // Read until a '=' character is hit; this will be the attribute key
	        name = this.html.substring(this.currentChar, n);
	        this.currentChar = n + 1;
	      }
	
	      if (!name)
	        return;
	
	      // After a '=', we should see a '"' for the attribute value
	      var c = this.nextChar();
	      if (c !== '"' && c !== "'") {
	        error("Error reading attribute " + name + ", expecting '\"'");
	        return;
	      }
	
	      // Read the attribute value (and consume the matching quote)
	      var value = this.readString(c);
	
	      node.attributes.push(new Attribute(name, value));
	
	      return;
	    },
	
	    /**
	     * Parses and returns an Element node. This is called after a '<' has been
	     * read.
	     *
	     * @returns an array; the first index of the array is the parsed node;
	     *          the second index is a boolean indicating whether this is a void
	     *          Element
	     */
	    makeElementNode: function (retPair) {
	      var c = this.nextChar();
	
	      // Read the Element tag name
	      var strBuf = this.strBuf;
	      strBuf.length = 0;
	      while (whitespace.indexOf(c) == -1 && c !== ">" && c !== "/") {
	        if (c === undefined)
	          return false;
	        strBuf.push(c);
	        c = this.nextChar();
	      }
	      var tag = strBuf.join('');
	
	      if (!tag)
	        return false;
	
	      var node = new Element(tag);
	
	      // Read Element attributes
	      while (c !== "/" && c !== ">") {
	        if (c === undefined)
	          return false;
	        while (whitespace.indexOf(this.html[this.currentChar++]) != -1);
	        this.currentChar--;
	        c = this.nextChar();
	        if (c !== "/" && c !== ">") {
	          --this.currentChar;
	          this.readAttribute(node);
	        }
	      }
	
	      // If this is a self-closing tag, read '/>'
	      var closed = tag in voidElems;
	      if (c === "/") {
	        closed = true;
	        c = this.nextChar();
	        if (c !== ">") {
	          error("expected '>' to close " + tag);
	          return false;
	        }
	      }
	
	      retPair[0] = node;
	      retPair[1] = closed;
	      return true
	    },
	
	    /**
	     * If the current input matches this string, advance the input index;
	     * otherwise, do nothing.
	     *
	     * @returns whether input matched string
	     */
	    match: function (str) {
	      var strlen = str.length;
	      if (this.html.substr(this.currentChar, strlen).toLowerCase() === str.toLowerCase()) {
	        this.currentChar += strlen;
	        return true;
	      }
	      return false;
	    },
	
	    /**
	     * Searches the input until a string is found and discards all input up to
	     * and including the matched string.
	     */
	    discardTo: function (str) {
	      var index = this.html.indexOf(str, this.currentChar) + str.length;
	      if (index === -1)
	        this.currentChar = this.html.length;
	      this.currentChar = index;
	    },
	
	    /**
	     * Reads child nodes for the given node.
	     */
	    readChildren: function (node) {
	      var child;
	      while ((child = this.readNode())) {
	        // Don't keep Comment nodes
	        if (child.nodeType !== 8) {
	          node.appendChild(child);
	        }
	      }
	    },
	
	    readScript: function (node) {
	      while (this.currentChar < this.html.length) {
	        var c = this.nextChar();
	        var nextC = this.peekNext();
	        if (c === "<") {
	          if (nextC === "!" || nextC === "?") {
	            // We're still before the ! or ? that is starting this comment:
	            this.currentChar++;
	            node.appendChild(this.discardNextComment());
	            continue;
	          }
	          if (nextC === "/" && this.html.substr(this.currentChar, 8 /*"/script>".length */).toLowerCase() == "/script>") {
	            // Go back before the '<' so we find the end tag.
	            this.currentChar--;
	            // Done with this script tag, the caller will close:
	            return;
	          }
	        }
	        // Either c wasn't a '<' or it was but we couldn't find either a comment
	        // or a closing script tag, so we should just parse as text until the next one
	        // comes along:
	
	        var haveTextNode = node.lastChild && node.lastChild.nodeType === Node.TEXT_NODE;
	        var textNode = haveTextNode ? node.lastChild : new Text();
	        var n = this.html.indexOf("<", this.currentChar);
	        // Decrement this to include the current character *afterwards* so we don't get stuck
	        // looking for the same < all the time.
	        this.currentChar--;
	        if (n === -1) {
	          textNode.innerHTML += this.html.substring(this.currentChar, this.html.length);
	          this.currentChar = this.html.length;
	        } else {
	          textNode.innerHTML += this.html.substring(this.currentChar, n);
	          this.currentChar = n;
	        }
	        if (!haveTextNode)
	          node.appendChild(textNode);
	      }
	    },
	
	    discardNextComment: function() {
	      if (this.match("--")) {
	        this.discardTo("-->");
	      } else {
	        var c = this.nextChar();
	        while (c !== ">") {
	          if (c === undefined)
	            return null;
	          if (c === '"' || c === "'")
	            this.readString(c);
	          c = this.nextChar();
	        }
	      }
	      return new Comment();
	    },
	
	
	    /**
	     * Reads the next child node from the input. If we're reading a closing
	     * tag, or if we've reached the end of input, return null.
	     *
	     * @returns the node
	     */
	    readNode: function () {
	      var c = this.nextChar();
	
	      if (c === undefined)
	        return null;
	
	      // Read any text as Text node
	      if (c !== "<") {
	        --this.currentChar;
	        var node = new Text();
	        var n = this.html.indexOf("<", this.currentChar);
	        if (n === -1) {
	          node.innerHTML = this.html.substring(this.currentChar, this.html.length);
	          this.currentChar = this.html.length;
	        } else {
	          node.innerHTML = this.html.substring(this.currentChar, n);
	          this.currentChar = n;
	        }
	        return node;
	      }
	
	      c = this.peekNext();
	
	      // Read Comment node. Normally, Comment nodes know their inner
	      // textContent, but we don't really care about Comment nodes (we throw
	      // them away in readChildren()). So just returning an empty Comment node
	      // here is sufficient.
	      if (c === "!" || c === "?") {
	        // We're still before the ! or ? that is starting this comment:
	        this.currentChar++;
	        return this.discardNextComment();
	      }
	
	      // If we're reading a closing tag, return null. This means we've reached
	      // the end of this set of child nodes.
	      if (c === "/") {
	        --this.currentChar;
	        return null;
	      }
	
	      // Otherwise, we're looking at an Element node
	      var result = this.makeElementNode(this.retPair);
	      if (!result)
	        return null;
	
	      var node = this.retPair[0];
	      var closed = this.retPair[1];
	      var localName = node.localName;
	
	      // If this isn't a void Element, read its child nodes
	      if (!closed) {
	        if (localName == "script") {
	          this.readScript(node);
	        } else {
	          this.readChildren(node);
	        }
	        var closingTag = "</" + localName + ">";
	        if (!this.match(closingTag)) {
	          error("expected '" + closingTag + "'");
	          return null;
	        }
	      }
	
	      // Only use the first title, because SVG might have other
	      // title elements which we don't care about (medium.com
	      // does this, at least).
	      if (localName === "title" && !this.doc.title) {
	        this.doc.title = node.textContent.trim();
	      } else if (localName === "head") {
	        this.doc.head = node;
	      } else if (localName === "body") {
	        this.doc.body = node;
	      } else if (localName === "html") {
	        this.doc.documentElement = node;
	      }
	
	      return node;
	    },
	
	    /**
	     * Parses an HTML string and returns a JS implementation of the Document.
	     */
	    parse: function (html) {
	      this.html = html;
	      var doc = this.doc = new Document();
	      this.readChildren(doc);
	
	      // If this is an HTML document, remove root-level children except for the
	      // <html> node
	      if (doc.documentElement) {
	        for (var i = doc.childNodes.length; --i >= 0;) {
	          var child = doc.childNodes[i];
	          if (child !== doc.documentElement) {
	            doc.removeChild(child);
	          }
	        }
	      }
	
	      return doc;
	    }
	  };
	
	  // Attach the standard DOM types to the global scope
	  global.Node = Node;
	  global.Comment = Comment;
	  global.Document = Document;
	  global.Element = Element;
	  global.Text = Text;
	
	  // Attach JSDOMParser to the global scope
	  global.JSDOMParser = JSDOMParser;
	
	}) (this);
  /* fake global scope */
  var Node = this.Node,
      Comment = this.Comment,
      Document = this.Document,
      Element = this.Element,
      Text = this.Text,
      JSDOMParser = this.JSDOMParser;
	/*
	 * Copyright (c) 2010 Arc90 Inc
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *     http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	
	/*
	 * This code is heavily based on Arc90's readability.js (1.7.1) script
	 * available at: http://code.google.com/p/arc90labs-readability
	 */
	var root = this;
	
	/**
	 * Public constructor.
	 * @param {Object}       uri     The URI descriptor object.
	 * @param {HTMLDocument} doc     The document to parse.
	 * @param {Object}       options The options object.
	 */
	var Readability = function(uri, doc, options) {
	  options = options || {};
	
	  this._uri = uri;
	  this._doc = doc;
	  this._biggestFrame = false;
	  this._articleByline = null;
	  this._articleDir = null;
	
	  // Configureable options
	  this._debug = !!options.debug;
	  this._maxElemsToParse = options.maxElemsToParse || this.DEFAULT_MAX_ELEMS_TO_PARSE;
	  this._nbTopCandidates = options.nbTopCandidates || this.DEFAULT_N_TOP_CANDIDATES;
	  this._maxPages = options.maxPages || this.DEFAULT_MAX_PAGES;
	
	  // Start with all flags set
	  this._flags = this.FLAG_STRIP_UNLIKELYS |
	                this.FLAG_WEIGHT_CLASSES |
	                this.FLAG_CLEAN_CONDITIONALLY;
	
	  // The list of pages we've parsed in this call of readability,
	  // for autopaging. As a key store for easier searching.
	  this._parsedPages = {};
	
	  // A list of the ETag headers of pages we've parsed, in case they happen to match,
	  // we'll know it's a duplicate.
	  this._pageETags = {};
	
	  // Make an AJAX request for each page and append it to the document.
	  this._curPageNum = 1;
	
	  // Control whether log messages are sent to the console
	  if (this._debug) {
	    function logEl(e) {
	      var rv = e.nodeName + " ";
	      if (e.nodeType == e.TEXT_NODE) {
	        return rv + '("' + e.textContent + '")';
	      }
	      var classDesc = e.className && ("." + e.className.replace(/ /g, "."));
	      var elDesc = e.id ? "(#" + e.id + classDesc + ")" :
	                          (classDesc ? "(" + classDesc + ")" : "");
	      return rv + elDesc;
	    }
	    this.log = function () {
	      if ("dump" in root) {
	        var msg = Array.prototype.map.call(arguments, function(x) {
	          return (x && x.nodeName) ? logEl(x) : x;
	        }).join(" ");
	        dump("Reader: (Readability) " + msg + "\n");
	      } else if ("console" in root) {
	        var args = ["Reader: (Readability) "].concat(arguments);
	        console.log.apply(console, args);
	      }
	    };
	  } else {
	    this.log = function () {};
	  }
	}
	
	Readability.prototype = {
	  FLAG_STRIP_UNLIKELYS: 0x1,
	  FLAG_WEIGHT_CLASSES: 0x2,
	  FLAG_CLEAN_CONDITIONALLY: 0x4,
	
	  // Max number of nodes supported by this parser. Default: 0 (no limit)
	  DEFAULT_MAX_ELEMS_TO_PARSE: 0,
	
	  // The number of top candidates to consider when analysing how
	  // tight the competition is among candidates.
	  DEFAULT_N_TOP_CANDIDATES: 5,
	
	  // The maximum number of pages to loop through before we call
	  // it quits and just show a link.
	  DEFAULT_MAX_PAGES: 5,
	
	  // Element tags to score by default.
	  DEFAULT_TAGS_TO_SCORE: "section,h2,h3,h4,h5,h6,p,td,pre".toUpperCase().split(","),
	
	  // All of the regular expressions in use within readability.
	  // Defined up here so we don't instantiate them repeatedly in loops.
	  REGEXPS: {
	    unlikelyCandidates: /banner|combx|comment|community|disqus|extra|foot|header|menu|related|remark|rss|share|shoutbox|sidebar|skyscraper|sponsor|ad-break|agegate|pagination|pager|popup/i,
	    okMaybeItsACandidate: /and|article|body|column|main|shadow/i,
	    positive: /article|body|content|entry|hentry|main|page|pagination|post|text|blog|story/i,
	    negative: /hidden|banner|combx|comment|com-|contact|foot|footer|footnote|masthead|media|meta|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|tool|widget/i,
	    extraneous: /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single|utility/i,
	    byline: /byline|author|dateline|writtenby/i,
	    replaceFonts: /<(\/?)font[^>]*>/gi,
	    normalize: /\s{2,}/g,
	    videos: /\/\/(www\.)?(dailymotion|youtube|youtube-nocookie|player\.vimeo)\.com/i,
	    nextLink: /(next|weiter|continue|>([^\|]|$)|»([^\|]|$))/i,
	    prevLink: /(prev|earl|old|new|<|«)/i,
	    whitespace: /^\s*$/,
	    hasContent: /\S$/,
	  },
	
	  DIV_TO_P_ELEMS: [ "A", "BLOCKQUOTE", "DL", "DIV", "IMG", "OL", "P", "PRE", "TABLE", "UL", "SELECT" ],
	
	  ALTER_TO_DIV_EXCEPTIONS: ["DIV", "ARTICLE", "SECTION", "P"],
	
	  /**
	   * Run any post-process modifications to article content as necessary.
	   *
	   * @param Element
	   * @return void
	  **/
	  _postProcessContent: function(articleContent) {
	    // Readability cannot open relative uris so we convert them to absolute uris.
	    this._fixRelativeUris(articleContent);
	  },
	
	  /**
	   * Iterate over a NodeList, which doesn't natively fully implement the Array
	   * interface.
	   *
	   * For convenience, the current object context is applied to the provided
	   * iterate function.
	   *
	   * @param  NodeList nodeList The NodeList.
	   * @param  Function fn       The iterate function.
	   * @return void
	   */
	  _forEachNode: function(nodeList, fn) {
	    return Array.prototype.forEach.call(nodeList, fn, this);
	  },
	
	  /**
	   * Iterate over a NodeList, return true if any of the provided iterate
	   * function calls returns true, false otherwise.
	   *
	   * For convenience, the current object context is applied to the
	   * provided iterate function.
	   *
	   * @param  NodeList nodeList The NodeList.
	   * @param  Function fn       The iterate function.
	   * @return Boolean
	   */
	  _someNode: function(nodeList, fn) {
	    return Array.prototype.some.call(nodeList, fn, this);
	  },
	
	  /**
	   * Concat all nodelists passed as arguments.
	   *
	   * @return ...NodeList
	   * @return Array
	   */
	  _concatNodeLists: function() {
	    var slice = Array.prototype.slice;
	    var args = slice.call(arguments);
	    var nodeLists = args.map(function(list) {
	      return slice.call(list);
	    });
	    return Array.prototype.concat.apply([], nodeLists);
	  },
	
	  _getAllNodesWithTag: function(node, tagNames) {
	    if (node.querySelectorAll) {
	      return node.querySelectorAll(tagNames.join(','));
	    }
	    return [].concat.apply([], tagNames.map(function(tag) {
	      return node.getElementsByTagName(tag);
	    }));
	  },
	
	  /**
	   * Converts each <a> and <img> uri in the given element to an absolute URI.
	   *
	   * @param Element
	   * @return void
	   */
	  _fixRelativeUris: function(articleContent) {
	    var scheme = this._uri.scheme;
	    var prePath = this._uri.prePath;
	    var pathBase = this._uri.pathBase;
	
	    function toAbsoluteURI(uri) {
	      // If this is already an absolute URI, return it.
	      if (/^[a-zA-Z][a-zA-Z0-9\+\-\.]*:/.test(uri))
	        return uri;
	
	      // Scheme-rooted relative URI.
	      if (uri.substr(0, 2) == "//")
	        return scheme + "://" + uri.substr(2);
	
	      // Prepath-rooted relative URI.
	      if (uri[0] == "/")
	        return prePath + uri;
	
	      // Dotslash relative URI.
	      if (uri.indexOf("./") === 0)
	        return pathBase + uri.slice(2);
	
	      // Standard relative URI; add entire path. pathBase already includes a
	      // trailing "/".
	      return pathBase + uri;
	    }
	
	    var links = articleContent.getElementsByTagName("a");
	    this._forEachNode(links, function(link) {
	      var href = link.getAttribute("href");
	      if (href) {
	        // Replace links with javascript: URIs with text content, since
	        // they won't work after scripts have been removed from the page.
	        if (href.indexOf("javascript:") === 0) {
	          var text = this._doc.createTextNode(link.textContent);
	          link.parentNode.replaceChild(text, link);
	        } else {
	          link.setAttribute("href", toAbsoluteURI(href));
	        }
	      }
	    });
	
	    var imgs = articleContent.getElementsByTagName("img");
	    this._forEachNode(imgs, function(img) {
	      var src = img.getAttribute("src");
	      if (src) {
	        img.setAttribute("src", toAbsoluteURI(src));
	      }
	    });
	  },
	
	  /**
	   * Get the article title as an H1.
	   *
	   * @return void
	   **/
	  _getArticleTitle: function() {
	    var doc = this._doc;
	    var curTitle = "";
	    var origTitle = "";
	
	    try {
	      curTitle = origTitle = doc.title;
	
	      // If they had an element with id "title" in their HTML
	      if (typeof curTitle !== "string")
	        curTitle = origTitle = this._getInnerText(doc.getElementsByTagName('title')[0]);
	    } catch(e) {}
	
	    if (curTitle.match(/ [\|\-] /)) {
	      curTitle = origTitle.replace(/(.*)[\|\-] .*/gi,'$1');
	
	      if (curTitle.split(' ').length < 3)
	        curTitle = origTitle.replace(/[^\|\-]*[\|\-](.*)/gi,'$1');
	    } else if (curTitle.indexOf(': ') !== -1) {
	      // Check if we have an heading containing this exact string, so we
	      // could assume it's the full title.
	      var headings = this._concatNodeLists(
	        doc.getElementsByTagName('h1'),
	        doc.getElementsByTagName('h2')
	      );
	      var match = this._someNode(headings, function(heading) {
	        return heading.textContent === curTitle;
	      });
	
	      // If we don't, let's extract the title out of the original title string.
	      if (!match) {
	        curTitle = origTitle.substring(origTitle.lastIndexOf(':') + 1);
	
	        // If the title is now too short, try the first colon instead:
	        if (curTitle.split(' ').length < 3)
	          curTitle = origTitle.substring(origTitle.indexOf(':') + 1);
	      }
	    } else if (curTitle.length > 150 || curTitle.length < 15) {
	      var hOnes = doc.getElementsByTagName('h1');
	
	      if (hOnes.length === 1)
	        curTitle = this._getInnerText(hOnes[0]);
	    }
	
	    curTitle = curTitle.trim();
	
	    if (curTitle.split(' ').length <= 4)
	      curTitle = origTitle;
	
	    return curTitle;
	  },
	
	  /**
	   * Prepare the HTML document for readability to scrape it.
	   * This includes things like stripping javascript, CSS, and handling terrible markup.
	   *
	   * @return void
	   **/
	  _prepDocument: function() {
	    var doc = this._doc;
	
	    // Remove all style tags in head
	    this._forEachNode(doc.getElementsByTagName("style"), function(styleNode) {
	      styleNode.parentNode.removeChild(styleNode);
	    });
	
	    if (doc.body) {
	      this._replaceBrs(doc.body);
	    }
	
	    this._forEachNode(doc.getElementsByTagName("font"), function(fontNode) {
	      this._setNodeTag(fontNode, "SPAN");
	    });
	  },
	
	  /**
	   * Finds the next element, starting from the given node, and ignoring
	   * whitespace in between. If the given node is an element, the same node is
	   * returned.
	   */
	  _nextElement: function (node) {
	    var next = node;
	    while (next
	        && (next.nodeType != Node.ELEMENT_NODE)
	        && this.REGEXPS.whitespace.test(next.textContent)) {
	      next = next.nextSibling;
	    }
	    return next;
	  },
	
	  /**
	   * Replaces 2 or more successive <br> elements with a single <p>.
	   * Whitespace between <br> elements are ignored. For example:
	   *   <div>foo<br>bar<br> <br><br>abc</div>
	   * will become:
	   *   <div>foo<br>bar<p>abc</p></div>
	   */
	  _replaceBrs: function (elem) {
	    this._forEachNode(elem.getElementsByTagName("br"), function(br) {
	      var next = br.nextSibling;
	
	      // Whether 2 or more <br> elements have been found and replaced with a
	      // <p> block.
	      var replaced = false;
	
	      // If we find a <br> chain, remove the <br>s until we hit another element
	      // or non-whitespace. This leaves behind the first <br> in the chain
	      // (which will be replaced with a <p> later).
	      while ((next = this._nextElement(next)) && (next.tagName == "BR")) {
	        replaced = true;
	        var sibling = next.nextSibling;
	        next.parentNode.removeChild(next);
	        next = sibling;
	      }
	
	      // If we removed a <br> chain, replace the remaining <br> with a <p>. Add
	      // all sibling nodes as children of the <p> until we hit another <br>
	      // chain.
	      if (replaced) {
	        var p = this._doc.createElement("p");
	        br.parentNode.replaceChild(p, br);
	
	        next = p.nextSibling;
	        while (next) {
	          // If we've hit another <br><br>, we're done adding children to this <p>.
	          if (next.tagName == "BR") {
	            var nextElem = this._nextElement(next);
	            if (nextElem && nextElem.tagName == "BR")
	              break;
	          }
	
	          // Otherwise, make this node a child of the new <p>.
	          var sibling = next.nextSibling;
	          p.appendChild(next);
	          next = sibling;
	        }
	      }
	    });
	  },
	
	  _setNodeTag: function (node, tag) {
	    this.log("_setNodeTag", node, tag);
	    if (node.__JSDOMParser__) {
	      node.localName = tag.toLowerCase();
	      node.tagName = tag.toUpperCase();
	      return node;
	    }
	
	    var replacement = node.ownerDocument.createElement(tag);
	    while (node.firstChild) {
	      replacement.appendChild(node.firstChild);
	    }
	    node.parentNode.replaceChild(replacement, node);
	    if (node.readability)
	      replacement.readability = node.readability;
	
	    for (var i = 0; i < node.attributes.length; i++) {
	      replacement.setAttribute(node.attributes[i].name, node.attributes[i].value);
	    }
	    return replacement;
	  },
	
	  /**
	   * Prepare the article node for display. Clean out any inline styles,
	   * iframes, forms, strip extraneous <p> tags, etc.
	   *
	   * @param Element
	   * @return void
	   **/
	  _prepArticle: function(articleContent) {
	    this._cleanStyles(articleContent);
	
	    // Clean out junk from the article content
	    this._cleanConditionally(articleContent, "form");
	    this._clean(articleContent, "object");
	    this._clean(articleContent, "embed");
	    this._clean(articleContent, "h1");
	    this._clean(articleContent, "footer");
	
	    // If there is only one h2, they are probably using it as a header
	    // and not a subheader, so remove it since we already have a header.
	    if (articleContent.getElementsByTagName('h2').length === 1)
	      this._clean(articleContent, "h2");
	
	    this._clean(articleContent, "iframe");
	    this._cleanHeaders(articleContent);
	
	    // Do these last as the previous stuff may have removed junk
	    // that will affect these
	    this._cleanConditionally(articleContent, "table");
	    this._cleanConditionally(articleContent, "ul");
	    this._cleanConditionally(articleContent, "div");
	
	    // Remove extra paragraphs
	    this._forEachNode(articleContent.getElementsByTagName('p'), function(paragraph) {
	      var imgCount = paragraph.getElementsByTagName('img').length;
	      var embedCount = paragraph.getElementsByTagName('embed').length;
	      var objectCount = paragraph.getElementsByTagName('object').length;
	      // At this point, nasty iframes have been removed, only remain embedded video ones.
	      var iframeCount = paragraph.getElementsByTagName('iframe').length;
	      var totalCount = imgCount + embedCount + objectCount + iframeCount;
	
	      if (totalCount === 0 && !this._getInnerText(paragraph, false))
	        paragraph.parentNode.removeChild(paragraph);
	    });
	
	    this._forEachNode(articleContent.getElementsByTagName("br"), function(br) {
	      var next = this._nextElement(br.nextSibling);
	      if (next && next.tagName == "P")
	        br.parentNode.removeChild(br);
	    });
	  },
	
	  /**
	   * Initialize a node with the readability object. Also checks the
	   * className/id for special names to add to its score.
	   *
	   * @param Element
	   * @return void
	  **/
	  _initializeNode: function(node) {
	    node.readability = {"contentScore": 0};
	
	    switch(node.tagName) {
	      case 'DIV':
	        node.readability.contentScore += 5;
	        break;
	
	      case 'PRE':
	      case 'TD':
	      case 'BLOCKQUOTE':
	        node.readability.contentScore += 3;
	        break;
	
	      case 'ADDRESS':
	      case 'OL':
	      case 'UL':
	      case 'DL':
	      case 'DD':
	      case 'DT':
	      case 'LI':
	      case 'FORM':
	        node.readability.contentScore -= 3;
	        break;
	
	      case 'H1':
	      case 'H2':
	      case 'H3':
	      case 'H4':
	      case 'H5':
	      case 'H6':
	      case 'TH':
	        node.readability.contentScore -= 5;
	        break;
	    }
	
	    node.readability.contentScore += this._getClassWeight(node);
	  },
	
	  _removeAndGetNext: function(node) {
	    var nextNode = this._getNextNode(node, true);
	    node.parentNode.removeChild(node);
	    return nextNode;
	  },
	
	  /**
	   * Traverse the DOM from node to node, starting at the node passed in.
	   * Pass true for the second parameter to indicate this node itself
	   * (and its kids) are going away, and we want the next node over.
	   *
	   * Calling this in a loop will traverse the DOM depth-first.
	   */
	  _getNextNode: function(node, ignoreSelfAndKids) {
	    // First check for kids if those aren't being ignored
	    if (!ignoreSelfAndKids && node.firstElementChild) {
	      return node.firstElementChild;
	    }
	    // Then for siblings...
	    if (node.nextElementSibling) {
	      return node.nextElementSibling;
	    }
	    // And finally, move up the parent chain *and* find a sibling
	    // (because this is depth-first traversal, we will have already
	    // seen the parent nodes themselves).
	    do {
	      node = node.parentNode;
	    } while (node && !node.nextElementSibling);
	    return node && node.nextElementSibling;
	  },
	
	  /**
	   * Like _getNextNode, but for DOM implementations with no
	   * firstElementChild/nextElementSibling functionality...
	   */
	  _getNextNodeNoElementProperties: function(node, ignoreSelfAndKids) {
	    function nextSiblingEl(n) {
	      do {
	        n = n.nextSibling;
	      } while (n && n.nodeType !== n.ELEMENT_NODE);
	      return n;
	    }
	    // First check for kids if those aren't being ignored
	    if (!ignoreSelfAndKids && node.children[0]) {
	      return node.children[0];
	    }
	    // Then for siblings...
	    var next = nextSiblingEl(node);
	    if (next) {
	      return next;
	    }
	    // And finally, move up the parent chain *and* find a sibling
	    // (because this is depth-first traversal, we will have already
	    // seen the parent nodes themselves).
	    do {
	      node = node.parentNode;
	      if (node)
	        next = nextSiblingEl(node);
	    } while (node && !next);
	    return node && next;
	  },
	
	  _checkByline: function(node, matchString) {
	    if (this._articleByline) {
	      return false;
	    }
	
	    if (node.getAttribute !== undefined) {
	      var rel = node.getAttribute("rel");
	    }
	
	    if ((rel === "author" || this.REGEXPS.byline.test(matchString)) && this._isValidByline(node.textContent)) {
	      this._articleByline = node.textContent.trim();
	      return true;
	    }
	
	    return false;
	  },
	
	  _getNodeAncestors: function(node, maxDepth) {
	    maxDepth = maxDepth || 0;
	    var i = 0, ancestors = [];
	    while (node.parentNode) {
	      ancestors.push(node.parentNode)
	      if (maxDepth && ++i === maxDepth)
	        break;
	      node = node.parentNode;
	    }
	    return ancestors;
	  },
	
	  /***
	   * grabArticle - Using a variety of metrics (content score, classname, element types), find the content that is
	   *         most likely to be the stuff a user wants to read. Then return it wrapped up in a div.
	   *
	   * @param page a document to run upon. Needs to be a full document, complete with body.
	   * @return Element
	  **/
	  _grabArticle: function (page) {
	    this.log("**** grabArticle ****");
	    var doc = this._doc;
	    var isPaging = (page !== null ? true: false);
	    page = page ? page : this._doc.body;
	
	    // We can't grab an article if we don't have a page!
	    if (!page) {
	      this.log("No body found in document. Abort.");
	      return null;
	    }
	
	    var pageCacheHtml = page.innerHTML;
	
	    // Check if any "dir" is set on the toplevel document element
	    this._articleDir = doc.documentElement.getAttribute("dir");
	
	    while (true) {
	      var stripUnlikelyCandidates = this._flagIsActive(this.FLAG_STRIP_UNLIKELYS);
	
	      // First, node prepping. Trash nodes that look cruddy (like ones with the
	      // class name "comment", etc), and turn divs into P tags where they have been
	      // used inappropriately (as in, where they contain no other block level elements.)
	      var elementsToScore = [];
	      var node = this._doc.documentElement;
	
	      while (node) {
	        var matchString = node.className + " " + node.id;
	
	        // Check to see if this node is a byline, and remove it if it is.
	        if (this._checkByline(node, matchString)) {
	          node = this._removeAndGetNext(node);
	          continue;
	        }
	
	        // Remove unlikely candidates
	        if (stripUnlikelyCandidates) {
	          if (this.REGEXPS.unlikelyCandidates.test(matchString) &&
	              !this.REGEXPS.okMaybeItsACandidate.test(matchString) &&
	              node.tagName !== "BODY" &&
	              node.tagName !== "A") {
	            this.log("Removing unlikely candidate - " + matchString);
	            node = this._removeAndGetNext(node);
	            continue;
	          }
	        }
	
	        if (this.DEFAULT_TAGS_TO_SCORE.indexOf(node.tagName) !== -1) {
	          elementsToScore.push(node);
	        }
	
	        // Turn all divs that don't have children block level elements into p's
	        if (node.tagName === "DIV") {
	          // Sites like http://mobile.slate.com encloses each paragraph with a DIV
	          // element. DIVs with only a P element inside and no text content can be
	          // safely converted into plain P elements to avoid confusing the scoring
	          // algorithm with DIVs with are, in practice, paragraphs.
	          if (this._hasSinglePInsideElement(node)) {
	            var newNode = node.children[0];
	            node.parentNode.replaceChild(newNode, node);
	            node = newNode;
	          } else if (!this._hasChildBlockElement(node)) {
	            node = this._setNodeTag(node, "P");
	            elementsToScore.push(node);
	          } else {
	            // EXPERIMENTAL
	            this._forEachNode(node.childNodes, function(childNode) {
	              if (childNode.nodeType === Node.TEXT_NODE) {
	                var p = doc.createElement('p');
	                p.textContent = childNode.textContent;
	                p.style.display = 'inline';
	                p.className = 'readability-styled';
	                node.replaceChild(p, childNode);
	              }
	            });
	          }
	        }
	        node = this._getNextNode(node);
	      }
	
	      /**
	       * Loop through all paragraphs, and assign a score to them based on how content-y they look.
	       * Then add their score to their parent node.
	       *
	       * A score is determined by things like number of commas, class names, etc. Maybe eventually link density.
	      **/
	      var candidates = [];
	      this._forEachNode(elementsToScore, function(elementToScore) {
	        if (!elementToScore.parentNode || typeof(elementToScore.parentNode.tagName) === 'undefined')
	          return;
	
	        // If this paragraph is less than 25 characters, don't even count it.
	        var innerText = this._getInnerText(elementToScore);
	        if (innerText.length < 25)
	          return;
	
	        // Exclude nodes with no ancestor.
	        var ancestors = this._getNodeAncestors(elementToScore, 3);
	        if (ancestors.length === 0)
	          return;
	
	        var contentScore = 0;
	
	        // Add a point for the paragraph itself as a base.
	        contentScore += 1;
	
	        // Add points for any commas within this paragraph.
	        contentScore += innerText.split(',').length;
	
	        // For every 100 characters in this paragraph, add another point. Up to 3 points.
	        contentScore += Math.min(Math.floor(innerText.length / 100), 3);
	
	        // Initialize and score ancestors.
	        this._forEachNode(ancestors, function(ancestor, level) {
	          if (!ancestor.tagName)
	            return;
	
	          if (typeof(ancestor.readability) === 'undefined') {
	            this._initializeNode(ancestor);
	            candidates.push(ancestor);
	          }
	
	          // Node score divider:
	          // - parent:             1 (no division)
	          // - grandparent:        2
	          // - great grandparent+: ancestor level * 3
	          var scoreDivider = level === 0 ? 1 : level === 1 ? 2 : level * 3;
	          ancestor.readability.contentScore += contentScore / scoreDivider;
	        });
	      });
	
	      // After we've calculated scores, loop through all of the possible
	      // candidate nodes we found and find the one with the highest score.
	      var topCandidates = [];
	      for (var c = 0, cl = candidates.length; c < cl; c += 1) {
	        var candidate = candidates[c];
	
	        // Scale the final candidates score based on link density. Good content
	        // should have a relatively small link density (5% or less) and be mostly
	        // unaffected by this operation.
	        var candidateScore = candidate.readability.contentScore * (1 - this._getLinkDensity(candidate));
	        candidate.readability.contentScore = candidateScore;
	
	        this.log('Candidate:', candidate, "with score " + candidateScore);
	
	        for (var t = 0; t < this._nbTopCandidates; t++) {
	          var aTopCandidate = topCandidates[t];
	
	          if (!aTopCandidate || candidateScore > aTopCandidate.readability.contentScore) {
	            topCandidates.splice(t, 0, candidate);
	            if (topCandidates.length > this._nbTopCandidates)
	              topCandidates.pop();
	            break;
	          }
	        }
	      }
	
	      var topCandidate = topCandidates[0] || null;
	      var neededToCreateTopCandidate = false;
	
	      // If we still have no top candidate, just use the body as a last resort.
	      // We also have to copy the body node so it is something we can modify.
	      if (topCandidate === null || topCandidate.tagName === "BODY") {
	        // Move all of the page's children into topCandidate
	        topCandidate = doc.createElement("DIV");
	        neededToCreateTopCandidate = true;
	        // Move everything (not just elements, also text nodes etc.) into the container
	        // so we even include text directly in the body:
	        var kids = page.childNodes;
	        while (kids.length) {
	          this.log("Moving child out:", kids[0]);
	          topCandidate.appendChild(kids[0]);
	        }
	
	        page.appendChild(topCandidate);
	
	        this._initializeNode(topCandidate);
	      } else if (topCandidate) {
	        // Because of our bonus system, parents of candidates might have scores
	        // themselves. They get half of the node. There won't be nodes with higher
	        // scores than our topCandidate, but if we see the score going *up* in the first
	        // few steps up the tree, that's a decent sign that there might be more content
	        // lurking in other places that we want to unify in. The sibling stuff
	        // below does some of that - but only if we've looked high enough up the DOM
	        // tree.
	        var parentOfTopCandidate = topCandidate.parentNode;
	        var lastScore = topCandidate.readability.contentScore;
	        // The scores shouldn't get too low.
	        var scoreThreshold = lastScore / 3;
	        while (parentOfTopCandidate && parentOfTopCandidate.readability) {
	          var parentScore = parentOfTopCandidate.readability.contentScore;
	          if (parentScore < scoreThreshold)
	            break;
	          if (parentScore > lastScore) {
	            // Alright! We found a better parent to use.
	            topCandidate = parentOfTopCandidate;
	            break;
	          }
	          lastScore = parentOfTopCandidate.readability.contentScore;
	          parentOfTopCandidate = parentOfTopCandidate.parentNode;
	        }
	      }
	
	      // Now that we have the top candidate, look through its siblings for content
	      // that might also be related. Things like preambles, content split by ads
	      // that we removed, etc.
	      var articleContent = doc.createElement("DIV");
	      if (isPaging)
	        articleContent.id = "readability-content";
	
	      var siblingScoreThreshold = Math.max(10, topCandidate.readability.contentScore * 0.2);
	      var siblings = topCandidate.parentNode.children;
	
	      for (var s = 0, sl = siblings.length; s < sl; s++) {
	        var sibling = siblings[s];
	        var append = false;
	
	        this.log("Looking at sibling node:", sibling, sibling.readability ? ("with score " + sibling.readability.contentScore) : '');
	        this.log("Sibling has score", sibling.readability ? sibling.readability.contentScore : 'Unknown');
	
	        if (sibling === topCandidate) {
	          append = true;
	        } else {
	          var contentBonus = 0;
	
	          // Give a bonus if sibling nodes and top candidates have the example same classname
	          if (sibling.className === topCandidate.className && topCandidate.className !== "")
	            contentBonus += topCandidate.readability.contentScore * 0.2;
	
	          if (sibling.readability &&
	              ((sibling.readability.contentScore + contentBonus) >= siblingScoreThreshold)) {
	            append = true;
	          } else if (sibling.nodeName === "P") {
	            var linkDensity = this._getLinkDensity(sibling);
	            var nodeContent = this._getInnerText(sibling);
	            var nodeLength = nodeContent.length;
	
	            if (nodeLength > 80 && linkDensity < 0.25) {
	              append = true;
	            } else if (nodeLength < 80 && linkDensity === 0 && nodeContent.search(/\.( |$)/) !== -1) {
	              append = true;
	            }
	          }
	        }
	
	        if (append) {
	          this.log("Appending node:", sibling);
	
	          if (this.ALTER_TO_DIV_EXCEPTIONS.indexOf(sibling.nodeName) === -1) {
	            // We have a node that isn't a common block level element, like a form or td tag.
	            // Turn it into a div so it doesn't get filtered out later by accident.
	            this.log("Altering sibling:", sibling, 'to div.');
	
	            sibling = this._setNodeTag(sibling, "DIV");
	          }
	
	          articleContent.appendChild(sibling);
	          // siblings is a reference to the children array, and
	          // sibling is removed from the array when we call appendChild().
	          // As a result, we must revisit this index since the nodes
	          // have been shifted.
	          s -= 1;
	          sl -= 1;
	        }
	      }
	
	      if (this._debug)
	        this.log("Article content pre-prep: " + articleContent.innerHTML);
	      // So we have all of the content that we need. Now we clean it up for presentation.
	      this._prepArticle(articleContent);
	      if (this._debug)
	        this.log("Article content post-prep: " + articleContent.innerHTML);
	
	      if (this._curPageNum === 1) {
	        if (neededToCreateTopCandidate) {
	          // We already created a fake div thing, and there wouldn't have been any siblings left
	          // for the previous loop, so there's no point trying to create a new div, and then
	          // move all the children over. Just assign IDs and class names here. No need to append
	          // because that already happened anyway.
	          topCandidate.id = "readability-page-1";
	          topCandidate.className = "page";
	        } else {
	          var div = doc.createElement("DIV");
	          div.id = "readability-page-1";
	          div.className = "page";
	          var children = articleContent.childNodes;
	          while (children.length) {
	            div.appendChild(children[0]);
	          }
	          articleContent.appendChild(div);
	        }
	      }
	
	      if (this._debug)
	        this.log("Article content after paging: " + articleContent.innerHTML);
	
	      // Now that we've gone through the full algorithm, check to see if
	      // we got any meaningful content. If we didn't, we may need to re-run
	      // grabArticle with different flags set. This gives us a higher likelihood of
	      // finding the content, and the sieve approach gives us a higher likelihood of
	      // finding the -right- content.
	      if (this._getInnerText(articleContent, true).length < 500) {
	        page.innerHTML = pageCacheHtml;
	
	        if (this._flagIsActive(this.FLAG_STRIP_UNLIKELYS)) {
	          this._removeFlag(this.FLAG_STRIP_UNLIKELYS);
	        } else if (this._flagIsActive(this.FLAG_WEIGHT_CLASSES)) {
	          this._removeFlag(this.FLAG_WEIGHT_CLASSES);
	        } else if (this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY)) {
	          this._removeFlag(this.FLAG_CLEAN_CONDITIONALLY);
	        } else {
	          return null;
	        }
	      } else {
	        return articleContent;
	      }
	    }
	  },
	
	  /**
	   * Check whether the input string could be a byline.
	   * This verifies that the input is a string, and that the length
	   * is less than 100 chars.
	   *
	   * @param possibleByline {string} - a string to check whether its a byline.
	   * @return Boolean - whether the input string is a byline.
	   */
	  _isValidByline: function(byline) {
	    if (typeof byline == 'string' || byline instanceof String) {
	      byline = byline.trim();
	      return (byline.length > 0) && (byline.length < 100);
	    }
	    return false;
	  },
	
	  /**
	   * Attempts to get excerpt and byline metadata for the article.
	   *
	   * @return Object with optional "excerpt" and "byline" properties
	   */
	  _getArticleMetadata: function() {
	    var metadata = {};
	    var values = {};
	    var metaElements = this._doc.getElementsByTagName("meta");
	
	    // Match "description", or Twitter's "twitter:description" (Cards)
	    // in name attribute.
	    var namePattern = /^\s*((twitter)\s*:\s*)?(description|title)\s*$/gi;
	
	    // Match Facebook's Open Graph title & description properties.
	    var propertyPattern = /^\s*og\s*:\s*(description|title)\s*$/gi;
	
	    // Find description tags.
	    this._forEachNode(metaElements, function(element) {
	      var elementName = element.getAttribute("name");
	      var elementProperty = element.getAttribute("property");
	
	      if ([elementName, elementProperty].indexOf("author") !== -1) {
	        metadata.byline = element.getAttribute("content");
	        return;
	      }
	
	      var name = null;
	      if (namePattern.test(elementName)) {
	        name = elementName;
	      } else if (propertyPattern.test(elementProperty)) {
	        name = elementProperty;
	      }
	
	      if (name) {
	        var content = element.getAttribute("content");
	        if (content) {
	          // Convert to lowercase and remove any whitespace
	          // so we can match below.
	          name = name.toLowerCase().replace(/\s/g, '');
	          values[name] = content.trim();
	        }
	      }
	    });
	
	    if ("description" in values) {
	      metadata.excerpt = values["description"];
	    } else if ("og:description" in values) {
	      // Use facebook open graph description.
	      metadata.excerpt = values["og:description"];
	    } else if ("twitter:description" in values) {
	      // Use twitter cards description.
	      metadata.excerpt = values["twitter:description"];
	    }
	
	    if ("og:title" in values) {
	      // Use facebook open graph title.
	      metadata.title = values["og:title"];
	    } else if ("twitter:title" in values) {
	      // Use twitter cards title.
	      metadata.title = values["twitter:title"];
	    }
	
	    return metadata;
	  },
	
	  /**
	   * Removes script tags from the document.
	   *
	   * @param Element
	  **/
	  _removeScripts: function(doc) {
	    this._forEachNode(doc.getElementsByTagName('script'), function(scriptNode) {
	      scriptNode.nodeValue = "";
	      scriptNode.removeAttribute('src');
	
	      if (scriptNode.parentNode)
	        scriptNode.parentNode.removeChild(scriptNode);
	    });
	    this._forEachNode(doc.getElementsByTagName('noscript'), function(noscriptNode) {
	      if (noscriptNode.parentNode)
	        noscriptNode.parentNode.removeChild(noscriptNode);
	    });
	  },
	
	  /**
	   * Check if this node has only whitespace and a single P element
	   * Returns false if the DIV node contains non-empty text nodes
	   * or if it contains no P or more than 1 element.
	   *
	   * @param Element
	  **/
	  _hasSinglePInsideElement: function(element) {
	    // There should be exactly 1 element child which is a P:
	    if (element.children.length != 1 || element.children[0].tagName !== "P") {
	      return false;
	    }
	
	    // And there should be no text nodes with real content
	    return !this._someNode(element.childNodes, function(node) {
	      return node.nodeType === Node.TEXT_NODE &&
	             this.REGEXPS.hasContent.test(node.textContent);
	    });
	  },
	
	  /**
	   * Determine whether element has any children block level elements.
	   *
	   * @param Element
	   */
	  _hasChildBlockElement: function (element) {
	    return this._someNode(element.childNodes, function(node) {
	      return this.DIV_TO_P_ELEMS.indexOf(node.tagName) !== -1 ||
	             this._hasChildBlockElement(node);
	    });
	  },
	
	  /**
	   * Get the inner text of a node - cross browser compatibly.
	   * This also strips out any excess whitespace to be found.
	   *
	   * @param Element
	   * @param Boolean normalizeSpaces (default: true)
	   * @return string
	  **/
	  _getInnerText: function(e, normalizeSpaces) {
	    normalizeSpaces = (typeof normalizeSpaces === 'undefined') ? true : normalizeSpaces;
	    var textContent = e.textContent.trim();
	
	    if (normalizeSpaces) {
	      return textContent.replace(this.REGEXPS.normalize, " ");
	    } else {
	      return textContent;
	    }
	  },
	
	  /**
	   * Get the number of times a string s appears in the node e.
	   *
	   * @param Element
	   * @param string - what to split on. Default is ","
	   * @return number (integer)
	  **/
	  _getCharCount: function(e,s) {
	    s = s || ",";
	    return this._getInnerText(e).split(s).length - 1;
	  },
	
	  /**
	   * Remove the style attribute on every e and under.
	   * TODO: Test if getElementsByTagName(*) is faster.
	   *
	   * @param Element
	   * @return void
	  **/
	  _cleanStyles: function(e) {
	    e = e || this._doc;
	    if (!e)
	      return;
	    var cur = e.firstChild;
	
	    // Remove any root styles, if we're able.
	    if (typeof e.removeAttribute === 'function' && e.className !== 'readability-styled')
	      e.removeAttribute('style');
	
	    // Go until there are no more child nodes
	    while (cur !== null) {
	      if (cur.nodeType === cur.ELEMENT_NODE) {
	        // Remove style attribute(s) :
	        if (cur.className !== "readability-styled")
	          cur.removeAttribute("style");
	
	        this._cleanStyles(cur);
	      }
	
	      cur = cur.nextSibling;
	    }
	  },
	
	  /**
	   * Get the density of links as a percentage of the content
	   * This is the amount of text that is inside a link divided by the total text in the node.
	   *
	   * @param Element
	   * @return number (float)
	  **/
	  _getLinkDensity: function(element) {
	    var textLength = this._getInnerText(element).length;
	    if (textLength === 0)
	      return;
	
	    var linkLength = 0;
	
	    // XXX implement _reduceNodeList?
	    this._forEachNode(element.getElementsByTagName("a"), function(linkNode) {
	      linkLength += this._getInnerText(linkNode).length;
	    });
	
	    return linkLength / textLength;
	  },
	
	  /**
	   * Find a cleaned up version of the current URL, to use for comparing links for possible next-pageyness.
	   *
	   * @author Dan Lacy
	   * @return string the base url
	  **/
	  _findBaseUrl: function() {
	    var uri = this._uri;
	    var noUrlParams = uri.path.split("?")[0];
	    var urlSlashes = noUrlParams.split("/").reverse();
	    var cleanedSegments = [];
	    var possibleType = "";
	
	    for (var i = 0, slashLen = urlSlashes.length; i < slashLen; i += 1) {
	      var segment = urlSlashes[i];
	
	      // Split off and save anything that looks like a file type.
	      if (segment.indexOf(".") !== -1) {
	        possibleType = segment.split(".")[1];
	
	        // If the type isn't alpha-only, it's probably not actually a file extension.
	        if (!possibleType.match(/[^a-zA-Z]/))
	          segment = segment.split(".")[0];
	      }
	
	      // EW-CMS specific segment replacement. Ugly.
	      // Example: http://www.ew.com/ew/article/0,,20313460_20369436,00.html
	      if (segment.indexOf(',00') !== -1)
	        segment = segment.replace(',00', '');
	
	      // If our first or second segment has anything looking like a page number, remove it.
	      if (segment.match(/((_|-)?p[a-z]*|(_|-))[0-9]{1,2}$/i) && ((i === 1) || (i === 0)))
	        segment = segment.replace(/((_|-)?p[a-z]*|(_|-))[0-9]{1,2}$/i, "");
	
	      var del = false;
	
	      // If this is purely a number, and it's the first or second segment,
	      // it's probably a page number. Remove it.
	      if (i < 2 && segment.match(/^\d{1,2}$/))
	        del = true;
	
	      // If this is the first segment and it's just "index", remove it.
	      if (i === 0 && segment.toLowerCase() === "index")
	        del = true;
	
	      // If our first or second segment is smaller than 3 characters,
	      // and the first segment was purely alphas, remove it.
	      if (i < 2 && segment.length < 3 && !urlSlashes[0].match(/[a-z]/i))
	        del = true;
	
	      // If it's not marked for deletion, push it to cleanedSegments.
	      if (!del)
	        cleanedSegments.push(segment);
	    }
	
	    // This is our final, cleaned, base article URL.
	    return uri.scheme + "://" + uri.host + cleanedSegments.reverse().join("/");
	  },
	
	  /**
	   * Look for any paging links that may occur within the document.
	   *
	   * @param body
	   * @return object (array)
	  **/
	  _findNextPageLink: function(elem) {
	    var uri = this._uri;
	    var possiblePages = {};
	    var allLinks = elem.getElementsByTagName('a');
	    var articleBaseUrl = this._findBaseUrl();
	
	    // Loop through all links, looking for hints that they may be next-page links.
	    // Things like having "page" in their textContent, className or id, or being a child
	    // of a node with a page-y className or id.
	    //
	    // Also possible: levenshtein distance? longest common subsequence?
	    //
	    // After we do that, assign each page a score, and
	    for (var i = 0, il = allLinks.length; i < il; i += 1) {
	      var link = allLinks[i];
	      var linkHref = allLinks[i].href.replace(/#.*$/, '').replace(/\/$/, '');
	
	      // If we've already seen this page, ignore it.
	      if (linkHref === "" ||
	        linkHref === articleBaseUrl ||
	        linkHref === uri.spec ||
	        linkHref in this._parsedPages) {
	        continue;
	      }
	
	      // If it's on a different domain, skip it.
	      if (uri.host !== linkHref.split(/\/+/g)[1])
	        continue;
	
	      var linkText = this._getInnerText(link);
	
	      // If the linkText looks like it's not the next page, skip it.
	      if (linkText.match(this.REGEXPS.extraneous) || linkText.length > 25)
	        continue;
	
	      // If the leftovers of the URL after removing the base URL don't contain
	      // any digits, it's certainly not a next page link.
	      var linkHrefLeftover = linkHref.replace(articleBaseUrl, '');
	      if (!linkHrefLeftover.match(/\d/))
	        continue;
	
	      if (!(linkHref in possiblePages)) {
	        possiblePages[linkHref] = {"score": 0, "linkText": linkText, "href": linkHref};
	      } else {
	        possiblePages[linkHref].linkText += ' | ' + linkText;
	      }
	
	      var linkObj = possiblePages[linkHref];
	
	      // If the articleBaseUrl isn't part of this URL, penalize this link. It could
	      // still be the link, but the odds are lower.
	      // Example: http://www.actionscript.org/resources/articles/745/1/JavaScript-and-VBScript-Injection-in-ActionScript-3/Page1.html
	      if (linkHref.indexOf(articleBaseUrl) !== 0)
	        linkObj.score -= 25;
	
	      var linkData = linkText + ' ' + link.className + ' ' + link.id;
	      if (linkData.match(this.REGEXPS.nextLink))
	        linkObj.score += 50;
	
	      if (linkData.match(/pag(e|ing|inat)/i))
	        linkObj.score += 25;
	
	      if (linkData.match(/(first|last)/i)) {
	        // -65 is enough to negate any bonuses gotten from a > or » in the text,
	        // If we already matched on "next", last is probably fine.
	        // If we didn't, then it's bad. Penalize.
	        if (!linkObj.linkText.match(this.REGEXPS.nextLink))
	          linkObj.score -= 65;
	      }
	
	      if (linkData.match(this.REGEXPS.negative) || linkData.match(this.REGEXPS.extraneous))
	        linkObj.score -= 50;
	
	      if (linkData.match(this.REGEXPS.prevLink))
	        linkObj.score -= 200;
	
	      // If a parentNode contains page or paging or paginat
	      var parentNode = link.parentNode;
	      var positiveNodeMatch = false;
	      var negativeNodeMatch = false;
	
	      while (parentNode) {
	        var parentNodeClassAndId = parentNode.className + ' ' + parentNode.id;
	
	        if (!positiveNodeMatch && parentNodeClassAndId && parentNodeClassAndId.match(/pag(e|ing|inat)/i)) {
	          positiveNodeMatch = true;
	          linkObj.score += 25;
	        }
	
	        if (!negativeNodeMatch && parentNodeClassAndId && parentNodeClassAndId.match(this.REGEXPS.negative)) {
	          // If this is just something like "footer", give it a negative.
	          // If it's something like "body-and-footer", leave it be.
	          if (!parentNodeClassAndId.match(this.REGEXPS.positive)) {
	            linkObj.score -= 25;
	            negativeNodeMatch = true;
	          }
	        }
	
	        parentNode = parentNode.parentNode;
	      }
	
	      // If the URL looks like it has paging in it, add to the score.
	      // Things like /page/2/, /pagenum/2, ?p=3, ?page=11, ?pagination=34
	      if (linkHref.match(/p(a|g|ag)?(e|ing|ination)?(=|\/)[0-9]{1,2}/i) || linkHref.match(/(page|paging)/i))
	        linkObj.score += 25;
	
	      // If the URL contains negative values, give a slight decrease.
	      if (linkHref.match(this.REGEXPS.extraneous))
	        linkObj.score -= 15;
	
	      /**
	       * Minor punishment to anything that doesn't match our current URL.
	       * NOTE: I'm finding this to cause more harm than good where something is exactly 50 points.
	       *     Dan, can you show me a counterexample where this is necessary?
	       * if (linkHref.indexOf(window.location.href) !== 0) {
	       *  linkObj.score -= 1;
	       * }
	      **/
	
	      // If the link text can be parsed as a number, give it a minor bonus, with a slight
	      // bias towards lower numbered pages. This is so that pages that might not have 'next'
	      // in their text can still get scored, and sorted properly by score.
	      var linkTextAsNumber = parseInt(linkText, 10);
	      if (linkTextAsNumber) {
	        // Punish 1 since we're either already there, or it's probably
	        // before what we want anyways.
	        if (linkTextAsNumber === 1) {
	          linkObj.score -= 10;
	        } else {
	          linkObj.score += Math.max(0, 10 - linkTextAsNumber);
	        }
	      }
	    }
	
	    // Loop thrugh all of our possible pages from above and find our top
	    // candidate for the next page URL. Require at least a score of 50, which
	    // is a relatively high confidence that this page is the next link.
	    var topPage = null;
	    for (var page in possiblePages) {
	      if (possiblePages.hasOwnProperty(page)) {
	        if (possiblePages[page].score >= 50 &&
	          (!topPage || topPage.score < possiblePages[page].score))
	          topPage = possiblePages[page];
	      }
	    }
	
	    if (topPage) {
	      var nextHref = topPage.href.replace(/\/$/,'');
	
	      this.log('NEXT PAGE IS ' + nextHref);
	      this._parsedPages[nextHref] = true;
	      return nextHref;
	    } else {
	      return null;
	    }
	  },
	
	  _successfulRequest: function(request) {
	    return (request.status >= 200 && request.status < 300) ||
	        request.status === 304 ||
	         (request.status === 0 && request.responseText);
	  },
	
	  _ajax: function(url, options) {
	    var request = new XMLHttpRequest();
	
	    function respondToReadyState(readyState) {
	      if (request.readyState === 4) {
	        if (this._successfulRequest(request)) {
	          if (options.success)
	            options.success(request);
	        } else {
	          if (options.error)
	            options.error(request);
	        }
	      }
	    }
	
	    if (typeof options === 'undefined')
	      options = {};
	
	    request.onreadystatechange = respondToReadyState;
	
	    request.open('get', url, true);
	    request.setRequestHeader('Accept', 'text/html');
	
	    try {
	      request.send(options.postBody);
	    } catch (e) {
	      if (options.error)
	        options.error();
	    }
	
	    return request;
	  },
	
	  _appendNextPage: function(nextPageLink) {
	    var doc = this._doc;
	    this._curPageNum += 1;
	
	    var articlePage = doc.createElement("DIV");
	    articlePage.id = 'readability-page-' + this._curPageNum;
	    articlePage.className = 'page';
	    articlePage.innerHTML = '<p class="page-separator" title="Page ' + this._curPageNum + '">&sect;</p>';
	
	    doc.getElementById("readability-content").appendChild(articlePage);
	
	    if (this._curPageNum > this._maxPages) {
	      var nextPageMarkup = "<div style='text-align: center'><a href='" + nextPageLink + "'>View Next Page</a></div>";
	      articlePage.innerHTML = articlePage.innerHTML + nextPageMarkup;
	      return;
	    }
	
	    // Now that we've built the article page DOM element, get the page content
	    // asynchronously and load the cleaned content into the div we created for it.
	    (function(pageUrl, thisPage) {
	      this._ajax(pageUrl, {
	        success: function(r) {
	
	          // First, check to see if we have a matching ETag in headers - if we do, this is a duplicate page.
	          var eTag = r.getResponseHeader('ETag');
	          if (eTag) {
	            if (eTag in this._pageETags) {
	              this.log("Exact duplicate page found via ETag. Aborting.");
	              articlePage.style.display = 'none';
	              return;
	            } else {
	              this._pageETags[eTag] = 1;
	            }
	          }
	
	          // TODO: this ends up doubling up page numbers on NYTimes articles. Need to generically parse those away.
	          var page = doc.createElement("DIV");
	
	          // Do some preprocessing to our HTML to make it ready for appending.
	          // - Remove any script tags. Swap and reswap newlines with a unicode
	          //   character because multiline regex doesn't work in javascript.
	          // - Turn any noscript tags into divs so that we can parse them. This
	          //   allows us to find any next page links hidden via javascript.
	          // - Turn all double br's into p's - was handled by prepDocument in the original view.
	          //   Maybe in the future abstract out prepDocument to work for both the original document
	          //   and AJAX-added pages.
	          var responseHtml = r.responseText.replace(/\n/g,'\uffff').replace(/<script.*?>.*?<\/script>/gi, '');
	          responseHtml = responseHtml.replace(/\n/g,'\uffff').replace(/<script.*?>.*?<\/script>/gi, '');
	          responseHtml = responseHtml.replace(/\uffff/g,'\n').replace(/<(\/?)noscript/gi, '<$1div');
	          responseHtml = responseHtml.replace(this.REGEXPS.replaceFonts, '<$1span>');
	
	          page.innerHTML = responseHtml;
	          this._replaceBrs(page);
	
	          // Reset all flags for the next page, as they will search through it and
	          // disable as necessary at the end of grabArticle.
	          this._flags = 0x1 | 0x2 | 0x4;
	
	          var nextPageLink = this._findNextPageLink(page);
	
	          // NOTE: if we end up supporting _appendNextPage(), we'll need to
	          // change this call to be async
	          var content = this._grabArticle(page);
	
	          if (!content) {
	            this.log("No content found in page to append. Aborting.");
	            return;
	          }
	
	          // Anti-duplicate mechanism. Essentially, get the first paragraph of our new page.
	          // Compare it against all of the the previous document's we've gotten. If the previous
	          // document contains exactly the innerHTML of this first paragraph, it's probably a duplicate.
	          var firstP = content.getElementsByTagName("P").length ? content.getElementsByTagName("P")[0] : null;
	          if (firstP && firstP.innerHTML.length > 100) {
	            for (var i = 1; i <= this._curPageNum; i += 1) {
	              var rPage = doc.getElementById('readability-page-' + i);
	              if (rPage && rPage.innerHTML.indexOf(firstP.innerHTML) !== -1) {
	                this.log('Duplicate of page ' + i + ' - skipping.');
	                articlePage.style.display = 'none';
	                this._parsedPages[pageUrl] = true;
	                return;
	              }
	            }
	          }
	
	          this._removeScripts(content);
	
	          thisPage.innerHTML = thisPage.innerHTML + content.innerHTML;
	
	          // After the page has rendered, post process the content. This delay is necessary because,
	          // in webkit at least, offsetWidth is not set in time to determine image width. We have to
	          // wait a little bit for reflow to finish before we can fix floating images.
	          setTimeout((function() {
	            this._postProcessContent(thisPage);
	          }).bind(this), 500);
	
	
	          if (nextPageLink)
	            this._appendNextPage(nextPageLink);
	        }
	      });
	    }).bind(this)(nextPageLink, articlePage);
	  },
	
	  /**
	   * Get an elements class/id weight. Uses regular expressions to tell if this
	   * element looks good or bad.
	   *
	   * @param Element
	   * @return number (Integer)
	  **/
	  _getClassWeight: function(e) {
	    if (!this._flagIsActive(this.FLAG_WEIGHT_CLASSES))
	      return 0;
	
	    var weight = 0;
	
	    // Look for a special classname
	    if (typeof(e.className) === 'string' && e.className !== '') {
	      if (this.REGEXPS.negative.test(e.className))
	        weight -= 25;
	
	      if (this.REGEXPS.positive.test(e.className))
	        weight += 25;
	    }
	
	    // Look for a special ID
	    if (typeof(e.id) === 'string' && e.id !== '') {
	      if (this.REGEXPS.negative.test(e.id))
	        weight -= 25;
	
	      if (this.REGEXPS.positive.test(e.id))
	        weight += 25;
	    }
	
	    return weight;
	  },
	
	  /**
	   * Clean a node of all elements of type "tag".
	   * (Unless it's a youtube/vimeo video. People love movies.)
	   *
	   * @param Element
	   * @param string tag to clean
	   * @return void
	   **/
	  _clean: function(e, tag) {
	    var isEmbed = ["object", "embed", "iframe"].indexOf(tag) !== -1;
	
	    this._forEachNode(e.getElementsByTagName(tag), function(element) {
	      // Allow youtube and vimeo videos through as people usually want to see those.
	      if (isEmbed) {
	        var attributeValues = [].map.call(element.attributes, function(attr) {
	          return attr.value;
	        }).join("|");
	
	        // First, check the elements attributes to see if any of them contain youtube or vimeo
	        if (this.REGEXPS.videos.test(attributeValues))
	          return;
	
	        // Then check the elements inside this element for the same.
	        if (this.REGEXPS.videos.test(element.innerHTML))
	          return;
	      }
	
	      element.parentNode.removeChild(element);
	    });
	  },
	
	  /**
	   * Check if a given node has one of its ancestor tag name matching the
	   * provided one.
	   * @param  HTMLElement node
	   * @param  String      tagName
	   * @param  Number      maxDepth
	   * @return Boolean
	   */
	  _hasAncestorTag: function(node, tagName, maxDepth) {
	    maxDepth = maxDepth || 3;
	    tagName = tagName.toUpperCase();
	    var depth = 0;
	    while (node.parentNode) {
	      if (depth > maxDepth)
	        return false;
	      if (node.parentNode.tagName === tagName)
	        return true;
	      node = node.parentNode;
	      depth++;
	    }
	    return false;
	  },
	
	  /**
	   * Clean an element of all tags of type "tag" if they look fishy.
	   * "Fishy" is an algorithm based on content length, classnames, link density, number of images & embeds, etc.
	   *
	   * @return void
	   **/
	  _cleanConditionally: function(e, tag) {
	    if (!this._flagIsActive(this.FLAG_CLEAN_CONDITIONALLY))
	      return;
	
	    var tagsList = e.getElementsByTagName(tag);
	    var curTagsLength = tagsList.length;
	    var isList = tag === "ul" || tag === "ol";
	
	    // Gather counts for other typical elements embedded within.
	    // Traverse backwards so we can remove nodes at the same time
	    // without effecting the traversal.
	    //
	    // TODO: Consider taking into account original contentScore here.
	    for (var i = curTagsLength-1; i >= 0; i -= 1) {
	      var weight = this._getClassWeight(tagsList[i]);
	      var contentScore = 0;
	
	      this.log("Cleaning Conditionally", tagsList[i]);
	
	      if (weight + contentScore < 0) {
	        tagsList[i].parentNode.removeChild(tagsList[i]);
	      } else if (this._getCharCount(tagsList[i],',') < 10) {
	        // If there are not very many commas, and the number of
	        // non-paragraph elements is more than paragraphs or other
	        // ominous signs, remove the element.
	        var p = tagsList[i].getElementsByTagName("p").length;
	        var img = tagsList[i].getElementsByTagName("img").length;
	        var li = tagsList[i].getElementsByTagName("li").length-100;
	        var input = tagsList[i].getElementsByTagName("input").length;
	
	        var embedCount = 0;
	        var embeds = tagsList[i].getElementsByTagName("embed");
	        for (var ei = 0, il = embeds.length; ei < il; ei += 1) {
	          if (!this.REGEXPS.videos.test(embeds[ei].src))
	            embedCount += 1;
	        }
	
	        var linkDensity = this._getLinkDensity(tagsList[i]);
	        var contentLength = this._getInnerText(tagsList[i]).length;
	        var toRemove = false;
	        if (img > p && !this._hasAncestorTag(tagsList[i], "figure")) {
	          toRemove = true;
	        } else if (!isList && li > p) {
	          toRemove = true;
	        } else if (input > Math.floor(p/3)) {
	          toRemove = true;
	        } else if (!isList && contentLength < 25 && (img === 0 || img > 2)) {
	          toRemove = true;
	        } else if (!isList && weight < 25 && linkDensity > 0.2) {
	          toRemove = true;
	        } else if (weight >= 25 && linkDensity > 0.5) {
	          toRemove = true;
	        } else if ((embedCount === 1 && contentLength < 75) || embedCount > 1) {
	          toRemove = true;
	        }
	
	        if (toRemove) {
	          tagsList[i].parentNode.removeChild(tagsList[i]);
	        }
	      }
	    }
	  },
	
	  /**
	   * Clean out spurious headers from an Element. Checks things like classnames and link density.
	   *
	   * @param Element
	   * @return void
	  **/
	  _cleanHeaders: function(e) {
	    for (var headerIndex = 1; headerIndex < 3; headerIndex += 1) {
	      var headers = e.getElementsByTagName('h' + headerIndex);
	      for (var i = headers.length - 1; i >= 0; i -= 1) {
	        if (this._getClassWeight(headers[i]) < 0)
	          headers[i].parentNode.removeChild(headers[i]);
	      }
	    }
	  },
	
	  _flagIsActive: function(flag) {
	    return (this._flags & flag) > 0;
	  },
	
	  _addFlag: function(flag) {
	    this._flags = this._flags | flag;
	  },
	
	  _removeFlag: function(flag) {
	    this._flags = this._flags & ~flag;
	  },
	
	  /**
	   * Decides whether or not the document is reader-able without parsing the whole thing.
	   *
	   * @return boolean Whether or not we suspect parse() will suceeed at returning an article object.
	   */
	  isProbablyReaderable: function(helperIsVisible) {
	    var nodes = this._getAllNodesWithTag(this._doc, ["p", "pre"]);
	
	    // FIXME we should have a fallback for helperIsVisible, but this is
	    // problematic because of jsdom's elem.style handling - see
	    // https://github.com/mozilla/readability/pull/186 for context.
	
	    var score = 0;
	    // This is a little cheeky, we use the accumulator 'score' to decide what to return from
	    // this callback:
	    return this._someNode(nodes, function(node) {
	      if (helperIsVisible && !helperIsVisible(node))
	        return false;
	      var matchString = node.className + " " + node.id;
	
	      if (this.REGEXPS.unlikelyCandidates.test(matchString) &&
	          !this.REGEXPS.okMaybeItsACandidate.test(matchString)) {
	        return false;
	      }
	
	      if (node.matches && node.matches("li p")) {
	        return false;
	      }
	
	      var textContentLength = node.textContent.trim().length;
	      if (textContentLength < 140) {
	        return false;
	      }
	
	      score += Math.sqrt(textContentLength - 140);
	
	      if (score > 20) {
	        return true;
	      }
	      return false;
	    });
	  },
	
	  /**
	   * Runs readability.
	   *
	   * Workflow:
	   *  1. Prep the document by removing script tags, css, etc.
	   *  2. Build readability's DOM tree.
	   *  3. Grab the article content from the current dom tree.
	   *  4. Replace the current DOM tree with the new one.
	   *  5. Read peacefully.
	   *
	   * @return void
	   **/
	  parse: function () {
	    // Avoid parsing too large documents, as per configuration option
	    if (this._maxElemsToParse > 0) {
	      var numTags = this._doc.getElementsByTagName("*").length;
	      if (numTags > this._maxElemsToParse) {
	        throw new Error("Aborting parsing document; " + numTags + " elements found");
	      }
	    }
	
	    if (typeof this._doc.documentElement.firstElementChild === "undefined") {
	      this._getNextNode = this._getNextNodeNoElementProperties;
	    }
	    // Remove script tags from the document.
	    this._removeScripts(this._doc);
	
	    // FIXME: Disabled multi-page article support for now as it
	    // needs more work on infrastructure.
	
	    // Make sure this document is added to the list of parsed pages first,
	    // so we don't double up on the first page.
	    // this._parsedPages[uri.spec.replace(/\/$/, '')] = true;
	
	    // Pull out any possible next page link first.
	    // var nextPageLink = this._findNextPageLink(doc.body);
	
	    this._prepDocument();
	
	    var metadata = this._getArticleMetadata();
	    var articleTitle = metadata.title || this._getArticleTitle();
	
	    var articleContent = this._grabArticle();
	    if (!articleContent)
	      return null;
	
	    this.log("Grabbed: " + articleContent.innerHTML);
	
	    this._postProcessContent(articleContent);
	
	    // if (nextPageLink) {
	    //   // Append any additional pages after a small timeout so that people
	    //   // can start reading without having to wait for this to finish processing.
	    //   setTimeout((function() {
	    //     this._appendNextPage(nextPageLink);
	    //   }).bind(this), 500);
	    // }
	
	    // If we haven't found an excerpt in the article's metadata, use the article's
	    // first paragraph as the excerpt. This is used for displaying a preview of
	    // the article's content.
	    if (!metadata.excerpt) {
	      var paragraphs = articleContent.getElementsByTagName("p");
	      if (paragraphs.length > 0) {
	        metadata.excerpt = paragraphs[0].textContent.trim();
	      }
	    }
	
	    return { uri: this._uri,
	             title: articleTitle,
	             byline: metadata.byline || this._articleByline,
	             dir: this._articleDir,
	             content: articleContent.innerHTML,
	             length: articleContent.textContent.length,
	             excerpt: metadata.excerpt };
	  }
	};
  return (function () {
    var doc = urimDocument || document;
    var location = doc.location;
    var uri = {
      spec: location.href,
      host: location.host,
      prePath: location.protocol + "//" + location.host,
      scheme: location.protocol.substr(0, location.protocol.indexOf(":")),
      pathBase: location.protocol + "//" + location.host + location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)
    };
    var serializedDocument = new XMLSerializer().serializeToString(doc);
    return new Readability(uri, 
      new JSDOMParser().parse(serializedDocument));
  })();
}
