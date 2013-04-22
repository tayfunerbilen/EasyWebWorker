// Generated by CoffeeScript 1.6.2
var AbstractEasyWebWorker, EasyWebWorker, WorkerSideController,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AbstractEasyWebWorker = (function() {
  function AbstractEasyWebWorker() {}

  AbstractEasyWebWorker.prototype.execute = function(args) {
    var arg, _i, _len, _results;

    _results = [];
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      arg = args[_i];
      _results.push(arg);
    }
    return _results;
  };

  AbstractEasyWebWorker.prototype.listen = function(event) {
    var args, context, depth, func, funcName, nestedFunc, order, _i, _len;

    args = event.data;
    funcName = args[0];
    args = args.slice(1);
    args.unshift(event);
    if (funcName.indexOf(".") !== -1) {
      nestedFunc = funcName.split(".");
      if (nestedFunc[0] === "window" && event.caller === "WebWorker") {
        funcName = window;
        nestedFunc = nestedFunc.slice(1);
      } else {
        funcName = this.self;
      }
      depth = nestedFunc.length;
      for (order = _i = 0, _len = nestedFunc.length; _i < _len; order = ++_i) {
        func = nestedFunc[order];
        funcName = funcName[func];
        if (order === depth - 2) {
          context = funcName;
        }
      }
      return funcName.apply(context, args);
    } else {
      return this.self[funcName].apply(this.self, args);
    }
  };

  AbstractEasyWebWorker.prototype.get = function(variable, callback, from) {
    var funcName, nestedFunc;

    if (funcName.indexOf(".") !== -1) {
      nestedFunc = funcName.split(".");
      if (nestedFunc[0] === "window" && event.caller === "WebWorker") {
        funcName = window;
        return nestedFunc = nestedFunc.slice(1);
      } else {
        return funcName = this.self;
      }
    }
  };

  return AbstractEasyWebWorker;

})();

EasyWebWorker = (function(_super) {
  __extends(EasyWebWorker, _super);

  function EasyWebWorker(fileUrl, self, startupData) {
    var joiner, queryString,
      _this = this;

    this.self = self;
    if (startupData != null) {
      joiner = fileUrl.indexOf("?") !== -1 ? "&" : "?";
      queryString = startupData !== null ? JSON.stringify(startupData) : null;
      fileUrl += joiner + queryString;
    }
    this.worker = new Worker(fileUrl);
    this.worker.onmessage = function() {
      return _this.listen.apply(_this, arguments);
    };
    this.worker.onerror = function(event) {
      return _this.error.call(_this, event, event.filename, event.lineno, event.message);
    };
  }

  EasyWebWorker.prototype.listen = function(event) {
    event.caller = "WebWorker";
    return EasyWebWorker.__super__.listen.call(this, event);
  };

  EasyWebWorker.prototype.execute = function() {
    return this.worker.postMessage(EasyWebWorker.__super__.execute.call(this, arguments));
  };

  EasyWebWorker.prototype.error = function() {
    if (this.onerror instanceof Function) {
      return this.onerror.apply(this.self, arguments);
    }
  };

  EasyWebWorker.prototype.terminate = function() {
    return this.worker.terminate();
  };

  EasyWebWorker.prototype.close = function() {
    return this.worker.terminate();
  };

  return EasyWebWorker;

})(AbstractEasyWebWorker);

WorkerSideController = (function(_super) {
  __extends(WorkerSideController, _super);

  function WorkerSideController(self) {
    var locationHref, splitBy, startupData,
      _this = this;

    this.self = self;
    locationHref = this.self.location.href;
    if (locationHref.indexOf("&") !== -1) {
      splitBy = "&";
    } else if (locationHref.indexOf("?") !== -1) {
      splitBy = "?";
    } else {
      splitBy = false;
    }
    if (splitBy !== false) {
      startupData = locationHref.split(splitBy);
      startupData = startupData[startupData.length - 1];
    }
    if (startupData !== null && startupData !== void 0) {
      this.self.startupData = JSON.parse(decodeURIComponent(startupData));
    } else {
      this.self.startupData = null;
    }
    this.self.onmessage = function() {
      return _this.listen.apply(_this, arguments);
    };
  }

  WorkerSideController.prototype.listen = function(event) {
    event.caller = "WebBrowser";
    return WorkerSideController.__super__.listen.call(this, event);
  };

  WorkerSideController.prototype.execute = function() {
    return this.self.postMessage(WorkerSideController.__super__.execute.call(this, arguments));
  };

  WorkerSideController.prototype.log = function() {
    return this.self.execute("window.console.log", arguments);
  };

  return WorkerSideController;

})(AbstractEasyWebWorker);

if (this.document === void 0) {
  this.caller = new WorkerSideController(this);
  this.execute = this.caller.execute;
  this.log = this.caller.log;
}

/*
//@ sourceMappingURL=easy-web-worker.map
*/