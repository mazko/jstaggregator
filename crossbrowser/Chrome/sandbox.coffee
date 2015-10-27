# sandbox adapter for Chrome

"use strict";

class UrimSandbox
  make_options = () ->
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
    tr: chrome.extension.getURL('data/images/flags/64/TR.png'),

  loadData = (url) ->
    # Create new promise with the Promise() constructor;
    # This has as its argument a function
    # with two parameters, resolve and reject
    new Promise (resolve, reject) ->
      # Standard XHR to load an image
      request = new XMLHttpRequest()
      request.open 'GET', chrome.extension.getURL url
      # When the request loads, check whether it was successful
      request.onload = ->
        if request.status is 200
          # If successful, resolve the promise by passing back the request response
          resolve request.responseText
        else
          # If it fails, reject the promise with a error message
          reject Error 'Resourse didn\'t load successfully; error code:' + request.statusText

      request.onerror = ->
        # Also deal with the case when the entire request fails to begin with
        # This is probably a network error, so reject the promise with an appropriate message
        reject Error 'There was a network error.'
      # Send the request
      request.send()

  # Constructor

  constructor:(onload) ->
    get_selection_cb = null
    @emit_get_selection = ->
      get_selection_cb? window?.getSelection?().toString?()
    @on_self_got_selection = (cb) ->
      get_selection_cb = cb

    # this worker harakiri mechanism
    is_this_worker_alive = yes
    detach_cb = null
    @on_self_detach = (cb) ->
      detach_cb = cb
    @is_worker_alive = ->
      is_this_worker_alive

    chrome.runtime.onMessage.addListener (request, sender, sendResponse)=>
      console.log 'request: ', request
      switch request?.method
        when 'detach'
          is_this_worker_alive = no
          detach_cb?()
        when 'cloud' 
          is_this_worker_alive = yes
          @emit_get_selection()
          sendResponse result: 'OK'
        else console.log 'unhandled method: ', request.method

    @options = make_options()

    promises = Promise.all [
      loadData('data/css/iframes.css'),
      loadData('data/css/li.css'),
      loadData('data/css/sidebar.css'),
    ]

    promises.then ( values ) =>
      opts = @options
      [opts.cssiframes, opts.cssli, opts.csssidebar] = values
      onload?()

    promises.catch ( exeption ) -> 
      console.warn exeption

  # Constructor end

  # process tag click routine with callback  
  emit_tag_clicked: (model, cb) ->
    hlcolors = ['aqua', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'yellow']
    hlcolor = hlcolors[Math.floor(Math.random() * hlcolors.length)]
      
    # http://stackoverflow.com/questions/5886858/full-text-search-in-html-ignoring-tags#answer-5887719
    doSearch = (text) ->
      if window.find && window.getSelection
        document.designMode = "on"
        try
          sel = window.getSelection()
          sel.collapse document.body, 0

          watchdog = 1000

          while --watchdog and window.find text 
            document.execCommand "HiliteColor", false, hlcolor
            sel.collapseToEnd()

          console.log 'Too many highlights - force break.' if not watchdog
        catch error
          console.log error

        document.designMode = "off"
      else if document.body.createTextRange
        textRange = document.body.createTextRange()
        while textRange.findText text
          textRange.execCommand "BackColor", false, hlcolor
          textRange.collapse false 
      
    try   
      doSearch tag for tag in model.tags
    finally 
      cb?()
    

urim_sandbox = new UrimSandbox ->
