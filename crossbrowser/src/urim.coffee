# content-script.js

# TODO: https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs#Attaching_stylesheets
$('head').append $('<style/>').attr('type', 'text/css').html(urim_sandbox.options.cssiframes)

# UI

class UrimWidget
  constructor: (settings, div_id, css) ->
    div = $ '<div/>', id: div_id
    iframe = $ '<iframe />', settings
      .load ->
        $(@).contents().find('head').append $('<style/>').attr('type', 'text/css').html(css)                
        $(@).contents().find('body').append div
      .appendTo do (to=$ 'body') -> 
        if to.length then to else document.documentElement
    @super_protected = -> div: div, iframe: iframe
    @detach = -> iframe.remove()


class FlagWidget extends UrimWidget
  set_text: (text) ->
    @super_protected().div.text text 
  clear_text: ->
    @super_protected().div.text ''
  set_flag: (lng) ->
    @super_protected().div.attr 
      title: 'ISO 639: ' + lng,
      style: "background-image: url(' #{urim_sandbox.options[lng]} ');"
    
    
class SidebarWidget extends UrimWidget
  constructor: ->
    jquery_window = $ window
    resized_when_sidebar_was_hidden = no
    on_resize_cb = []

    debounce = (func, threshold, execAsap) ->
      timeout = null
      (args...) ->
        obj = this
        delayed = ->
          func.apply(obj, args) unless execAsap
          timeout = null
        if timeout
          clearTimeout(timeout)
        else if (execAsap)
          func.apply(obj, args)
        timeout = setTimeout delayed, threshold || 100

    jquery_window.resize debounce =>
      if @super_protected().iframe.is ':visible' 
        func() for func in on_resize_cb
      else 
        resized_when_sidebar_was_hidden = yes

    @resize = (func) ->
      if func
        on_resize_cb.push func
      else 
        if resized_when_sidebar_was_hidden
          resized_when_sidebar_was_hidden = no
          func() for func in on_resize_cb

    super

  anchorToWidget: (widget) ->
    @super_protected().div.empty()
    @super_protected().iframe.fadeIn 1000
    widget.super_protected().iframe.mouseenter =>
      @super_protected().iframe.fadeIn 1000
      @resize() # recalculate tags to fit in sidebar if need
    @super_protected().iframe.mouseleave =>
      @super_protected().iframe.fadeOut 1000

  showTags: (text, tags_array) ->
    container = @super_protected().div 
    tags_array.sort (a, b) ->
      (b.offsetMatrix.length - a.offsetMatrix.length) or 
      (text.charCodeAt(a.offsetMatrix[0][0].start) - text.charCodeAt(b.offsetMatrix[0][0].start))
    tag_box = $ '<ul/>', class: 'tag_box' 
      .appendTo container

    start = 0

    # TODO: chaining => looks ugly and somewhere loose origin this/@ for last_appended.click
    ugly_self_hide = => @super_protected().iframe.hide()
    ugly_self_fade_in = (v) => @super_protected().iframe.fadeIn(v)

    containerAppendTagsUntillNoOverflow = ->    
      if tag_box.height() > container.height() 
        console.log "Append not require #{tag_box.height()} t : s #{container.height()}"
      else 
        tags_array[start..].some (value) -> 

          # some view helpers

          getOriginEntryText = (offsetArray) -> 
            [first, ..., last] = offsetArray
            text.substring first.start, last.end
                    
          entriesAsTextAndUnique = (entries) -> 
            (getOriginEntryText(v) for v in entries).
              filter (value, index, self) -> 
                self.indexOf(value) is index
                            
          getPrettyEntryText = (offsetArray) -> 
            (text.substring v.start, v.end for v in offsetArray).join ' '
          
          # show begins here
        
          keys = entriesAsTextAndUnique value.offsetMatrix
          last_appended = $ '<li/>'
            .attr title: keys.join '\n'
            .appendTo tag_box
            .click (e) -> 
              items = $ @
                .attr 'title'
                .split '\n'
                .filter (value, index, self) -> 
                  self.indexOf(value) is index
              which_enum = 1: 'left', 2: 'middle', 3: 'right'
              model = 
                which: which_enum[e.which], 
                tags: items, 
                shift: e.shiftKey, 
                ctrl: e.ctrlKey,
                alt: e.altKey
              ugly_self_hide() # prevent self find/highlight
              urim_sandbox.emit_tag_clicked model, ->
                ugly_self_fade_in 1000
              e.preventDefault()
              e.stopPropagation()
          $ '<a/>'
            .attr href: "##{keys.join '#'}"
            .html "#{getPrettyEntryText value.offsetMatrix[0]} <span>#{value.offsetMatrix.length}</span>"
            .appendTo last_appended

          if tag_box.height() > container.height() 
            console.log "Last append overflowed, step back #{tag_box.height()} t : s #{container.height()}"
            last_appended.remove()
            console.log "#{tag_box.height()} t : s #{container.height()}"
            yes # stop iteration
          else 
            start++
            no
      
    containerRemoveTagsUntillOverflow = ->
      if tag_box.height() <= container.height()
        console.log "Remove not require: #{tag_box.height()} t : s #{container.height()}"
      else
        tag_box.children().get().reverse().some (value) ->
          if tag_box.height() > container.height()
            value.remove()
            start--
            no
          else
            yes # stop iteration
        console.log "Last remove: #{tag_box.height()} t : s #{container.height()}"

    @resize ->                         
      console.log "Resize triggered - fit tags in sidebar"
      containerAppendTagsUntillNoOverflow()
      containerRemoveTagsUntillOverflow()

    containerNextPage = ->
      tag_box.empty()
      containerAppendTagsUntillNoOverflow()
         
    container.click (e) ->  
      if e.ctrlKey
        if start < tags_array.length 
          containerNextPage()
      else if e.shiftKey
        start = 0
        containerNextPage()

    # show first tags page
    containerNextPage()
                    

# If no selection, convert page html to text
urim_sandbox.on_self_got_selection (plain_text) ->

  htmlBodyToText = (body) -> 
    $.trim(body
      .clone()
      .find 'script,noscript,style,code,#i-li-autotagcloud,#i-sidebar-autotagcloud'
      .remove()
      .end()
      .text())

  plain_text or= do ->
    try
      readability = new ReadabilityWrapper document
      if readability.isProbablyReaderable()
        article = readability.parse()
        if article
          readable = [
            article.title,
            article.byline,
            htmlBodyToText $ article.content
          ].join()
          console.log "Total Readable characters #{readable.length}:\n" + 
            if readable.length > 777
              "#{readable[..333]}\n<-...->\n#{readable[-333..]}"
            else
              readable
          return readable
    catch error
      console.log "Readability ? -> #{error}, #{error.stack}"

  plain_text or= do (top=htmlBodyToText $ 'body') ->
    res = if top then [top] else []
    # window.frames is a list of frame objects. 
    # It is similar to an array in that it has a 
    # length property and its items can be 
    # accessed using the [i] notation
    if window?.frames?.length?
      for frame in window.frames
        ###
        FF: Permission denied to access property 'document'
        Chrome: SecurityError ... Protocols, domains, and ports must match
        ###
        try 
          frameText = htmlBodyToText(
            $ frame.document
            .contents()
            .find 'body')
          res.push frameText if frameText 
    res.join() 

  lng = LanguageIdentifier.identify(plain_text).language

  widget_flag = new FlagWidget {
      id: 'i-li-autotagcloud',
      allowTransparency: 'true',
      frameBorder: '0',
      scrolling: 'no',
      src: 'about:blank'
    },
    'li',
    urim_sandbox.options.cssli

  widget_sidebar = new SidebarWidget {
      id: 'i-sidebar-autotagcloud',
      frameBorder: '0',
      scrolling: 'no',
      src: 'about:blank'
    },
    'tags-wrapper',
    urim_sandbox.options.csssidebar

  # cleanup DOM
  urim_sandbox.on_self_detach ->
    widget.detach() for widget in [widget_flag, widget_sidebar,]

  tokenStream = Taggregator.create plain_text, lng, (pos, total) -> 
    widget_flag.set_text 100*pos//total + ' %'

  widget_flag.set_flag lng
     
  tokensMap = {}
  do async = -> 
    token = tokenStream.incrementToken()
    if token
      tokenTerm = token.term
      item = tokensMap.hasOwnProperty(tokenTerm) and tokensMap[tokenTerm];
      if item
        offsetMatrix = item.offsetMatrix
        offsetMatrix.push token.offset
      else 
        tokensMap[tokenTerm] = 'offsetMatrix' : [token.offset]
      urim_sandbox.is_worker_alive() and setTimeout async, 1 
    else
      widget_flag.clear_text()
      widget_sidebar.anchorToWidget widget_flag

      tags_array = (value for own key, value of tokensMap)
      widget_sidebar.showTags plain_text, tags_array


# Auto start tag cloud build when script attached.
urim_sandbox.emit_get_selection()
