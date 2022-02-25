class Services {

  constructor() {
    if (!Services.instance) {
      this._data = {
        tooltipIndex: 0,
        handles: 0,
        tooltipCallbacks: {},
        callbacks: {},
        callbackInfo: {},
        status: {},
        eventListeners: {}
      };
      console.log("got new services instance");
    } else {
      console.log("got old services instance");
    }
  }

  percentHeightWidth(vx) {
    return {
      height: vx * window.innerWidth / 100,
      width: vx * window.innerHeight / 100
    };
  }

  listen(name, callback) {
    if (name == "attachedEvents") {
      console.log("Cannot listen to attachedEvents");
      return null;
    }
  
    let index = this._data.handles;
    this._data.handles++;
    if (! this._data.callbacks[name]) {
      this._data.callbacks[name] = {};
    }

    let id = name + "_" + index;
    this._data.callbacks[name][id] = callback;
    
    console.log("listener created: " + id);
    this._data.callbackInfo[id] = { name: name, toObject: null };
    return id;
  }

  createEventListener(toObject, eventName, callback, name) {
    toObject.addEventListener(eventName, callback);
    this._data.eventListeners[name] = { toObject: toObject, eventName: eventName, callback: callback };
    return name;
  }

  clearEventListener(name) {
    var listener = this._data.eventListeners[name]
    if (listener) {
      listener.toObject.removeEventListener(listener.eventName, listener.callback);
      delete this._data.eventListeners[name];
    } else {
      console.log("attempt to clear non-existent event: " + name);
    }
  }

  removeAllListeners() {
    Object.keys(this._data.listeners).forEach(key => {
      var listener = this._data.listeners[key];
      listener.toObject.removeEventListener(listener.eventName, listener.callback);
    })
    this._data.listeners = {};
  }

  removeListeners(names) {
    names.forEach(key => {
      this.clearEventListener(key);
    })
  }

  attachEvent(toObject, eventName, callback, context) {
    let index = this._data.handles;
    this._data.handles++;
    var name = "attachedEvents";
    if (! this._data.callbacks[name]) {
      this._data.callbacks[name] = {};
    }
    let id = name + "_" + index;
    this._data.callbacks[name][id] = callback;
    
    if (!eventName) {
      console.log("Could not attach null event name");
    } else {
      if (!callback) {
        console.log("Cannot attach event " + eventName + " to null callback");
      } else {
        this._data.callbacks[name][id] = callback;
        toObject.addEventListener(eventName, this._data.callbacks[name][id]);
        
        console.log("attachEvent: " + id + " context: " + context ? context : 'none provided');
        this._data.callbackInfo[id] = { name: name, toObject: toObject, eventName: eventName };
      }
    }
    
    return id;
  }

  log(label, data) {
    console.log(label + ":" + JSON.stringify(data, null, '  '));
  }

  // interpolate(x, data) {
  //   var re = new RegExp(/{(.*?)}/g);
  //   var matches = x.match(re);
  //   var result = [];
  //   matches.forEach(m => {
  //     result.push(m)
  //   });
  //   return result.join();
  // }

  registerTooltip(id, showCallback, hideCallback, refreshCallback) {
    if (id == null || id == "") {
      id = "tooltip_" + this._data.tooltipIndex;
      this._data.tooltipIndex++;
    }
    if (this._data.tooltipCallbacks[id]) {
      console.log("duplicate tooltip register, removing prior callback");
      this.destroyTooltip(id);
    }
    this._data.tooltipCallbacks[id] = { show: showCallback, hide: hideCallback, refresh: refreshCallback };
    window.addEventListener('resize', refreshCallback);
    console.log("registered tooltip: " + id);
    return id;
  }

  closeOpenTooltips(exceptionIds) {
    Object.keys(this._data.tooltipCallbacks).forEach(key => {
      if (!exceptionIds || exceptionIds.indexOf(key) < 0) {
        console.log("closed: " + key);
        this._data.tooltipCallbacks[key].hide();
      }
    });
  }

  showTooltip(id, positioner, wait) {
    if (!wait) {
      wait = 10;
    }
    let that = this;
    let timeout = setTimeout(function () {
    
      if (that._data.tooltipCallbacks[id]) {
        that._data.tooltipCallbacks[id].show(positioner);
      } else {
        console.log("showTooltip: Tooltip " + id + " was not found");
      }
      clearTimeout(timeout);
    }, wait);
    
  }

  hideTooltip(id) {
    if (this._data.tooltipCallbacks[id]) {
      this._data.tooltipCallbacks[id].hide();
    } else {
      console.log("hideTooltip: Tooltip " + id + " was not found");
    }
  }

  refreshTooltip(id) {
    let tooltip = this._data.tooltipCallbacks[id];
    if (tooltip) {
      let timeout = setTimeout(function () {
        tooltip.refresh();
        clearTimeout(timeout);
      }, 100);
    }
  }

  action(name, params) {
    if (!this._data.callbacks[name]) {
      console.log("Unregistered Service Action: " + name);
      return;
    }
    Object.keys(this._data.callbacks[name]).forEach(id => {
      this._data.callbacks[name][id](params);
    });    
  }

  destroyTooltip(id) {
    console.log("Destroyed tooltip: " + id);
    window.removeEventListener('resize', this._data.tooltipCallbacks[id].refresh);
    delete this._data.tooltipCallbacks[id];
  }

  destroy(id) {
    if (id == null) {
      console.log("Cannot destroy null event");
      return;
    }
    var h = this._data.callbackInfo[id];
    if (h.toObject !== null) {
      h.toObject.removeEventListener(h.eventName, this._data.callbacks[h.name][id]);
    }
    console.log("destroyed:" + id);
    delete this._data.callbacks[h.name][id];
    delete this._data.callbackInfo[id];
  }

  destroyAll(ids) {
    ids.forEach(id => { this.destroy(id); });
  }

  setStatus (id, state, status) {
    if (!this._data.status[id]) {
      this._data.status[id] = {};
      console.log("services.setStatus:" + id + "," + state + "," + status);
    }
    this._data.status[id][state] = status;
  }

  getStatus(id, state) {
    if (this._data.status[id]) {
      let value = this._data.status[id][state];
      console.log("services.getStatus:" + id + "," + state + "," + value);
      return value;
    }
    console.log("services.getStatus:" + id + "," + state + ": was undefined");
    return null;
  }

  clearStatus(id) {
    if (this._data.status[id]) {
      delete this._data.status[id];
    }
  }
}

export default new Services();
