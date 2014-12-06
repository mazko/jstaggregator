# sandbox adapter for FF

class UrimSandbox
  constructor: ->
    # this worker harakiri mechanism
    is_this_worker_alive = yes
    detach_cb = null
    self.port.on 'detach', ->
      is_this_worker_alive = no
      detach_cb?()
    @on_self_detach = (cb) ->
      detach_cb = cb
    @is_worker_alive = ->
      is_this_worker_alive

    # process tag click routine in addon space with callback  
    tag_clicked_cb = null
    self.port.on 'urim_on_tag_click_processed', ->
      tag_clicked_cb?()
      tag_clicked_cb = null
    @emit_tag_clicked = (model, cb) ->
      tag_clicked_cb = cb
      self.port.emit 'urim_tag_clicked', model

  emit_get_selection: ->
    self.port.emit 'urim_get_selection'

  on_self_got_selection: (cb) ->
    self.port.on 'urim_on_got_selection', cb

  options: self.options


urim_sandbox = new UrimSandbox