(function () {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var COLOR_MAP = './assets/color_map.jpg';

var ColorMapper = function () {
  function ColorMapper() {
    var _this = this;

    classCallCheck(this, ColorMapper);

    var map = new Image();
    map.onload = function () {
      return _this._init(map);
    };
    map.src = COLOR_MAP;
  }

  createClass(ColorMapper, [{
    key: '_init',
    value: function _init(map) {
      this._canvas = document.createElement('canvas');
      this._canvas.width = map.width;
      this._canvas.height = map.height;
      this._context = this._canvas.getContext('2d');
      this._context.drawImage(map, 0, 0, map.width, map.height);
      this._ready = true;
    }
  }, {
    key: 'getPixelColor',
    value: function getPixelColor(x, y) {
      if (!this._ready) return "rgba(0,0,0,0)";

      var u = x * this._canvas.width / 100;
      var v = y * this._canvas.height / 100;
      v = this._canvas.height - v;
      var pixelData = this._context.getImageData(u, v, 1, 1).data;
      return "rgba(" + pixelData[0] + "," + pixelData[1] + "," + pixelData[2] + "," + pixelData[3] / 255 + ")";
    }
  }]);
  return ColorMapper;
}();

var GRID_IMG = './assets/spectrum.png';

var Overlays = function () {
  function Overlays(width, height) {
    var _this = this;

    classCallCheck(this, Overlays);

    this._colorMap = new ColorMapper();
    this._initDomElements();
    this._camAR = width / height;
    this.resize();
    window.onresize = function () {
      _this.resize();
    };
  }

  createClass(Overlays, [{
    key: '_initDomElements',
    value: function _initDomElements() {
      this._wrapper = document.getElementById("video_overlay");
      this._tacker = document.querySelector(".face_tracker_out");
      this._tacker.style.backgroundImage = "url('" + GRID_IMG + "')";
      this._pin = document.querySelector(".pin");
      this._pinWrapper = document.querySelector(".pin_wrapper");
    }
  }, {
    key: 'resize',
    value: function resize() {
      this._wrapper.style.height = "100%";
      this._wrapper.style.width = "100%";
      var divAR = this._wrapper.clientWidth / this._wrapper.clientHeight;
      if (this._wrapper.clientWidth > 768 || this._wrapper.clientHeight > 768) {
        if (this._camAR > divAR) {
          this._wrapper.style.height = this._wrapper.clientWidth / this._camAR + "px";
          this._wrapper.style.width = "100%";
        } else {
          this._wrapper.style.width = this._wrapper.clientHeight * this._camAR + "px";
          this._wrapper.style.height = "100%";
        }
      }

      var guard = this._wrapper.clientWidth > this._wrapper.clientHeight ? this._wrapper.clientHeight * 0.9 : this._wrapper.clientWidth;
      this._tacker.style.width = this._tacker.style.height = guard + "px";
    }
  }, {
    key: 'showPin',
    value: function showPin() {
      this._pin.style.opacity = 0.7;
    }
  }, {
    key: 'hidePin',
    value: function hidePin() {
      this._pin.style.opacity = 0;
    }
  }, {
    key: 'setEmotion',
    value: function setEmotion(_ref) {
      var arousal = _ref.arousal,
          valence = _ref.valence;

      var x = void 0,
          y = void 0;

      var _calcCoorinate2 = this._calcCoorinate(arousal, valence);

      x = _calcCoorinate2.x;
      y = _calcCoorinate2.y;


      this._setPinPosition(x, y);
      this._setPinColor(x, y);
    }
  }, {
    key: '_calcCoorinate',
    value: function _calcCoorinate(arousal, valence) {
      arousal *= 4;
      valence *= 3;
      var x = Math.max(-1, Math.min(valence, 1));
      var y = Math.max(-1, Math.min(arousal, 1));
      var u = (x * Math.sqrt(1 - y * y / 2) + 1) * 50;
      var v = (y * Math.sqrt(1 - x * x / 2) + 1) * 50;
      return { x: u, y: v };
    }
  }, {
    key: '_setPinPosition',
    value: function _setPinPosition(x, y) {
      var X = x * this._pinWrapper.clientWidth / 100 - 25;
      var Y = y * this._pinWrapper.clientHeight / 100 - 25;
      this._pin.style.left = X + "px";
      this._pin.style.bottom = Y + "px";
    }
  }, {
    key: '_setPinColor',
    value: function _setPinColor(x, y) {
      var color = this._colorMap.getPixelColor(x, y);
      this._pin.style["background-color"] = color;
      this._pin.style["color"] = color;
    }
  }]);
  return Overlays;
}();

var CameraSwitchInputManager = function CameraSwitchInputManager(camera) {
  classCallCheck(this, CameraSwitchInputManager);

  this._camera = camera;
  this._switcher = document.querySelector("#cameraSwitch");
  this._switcher.onclick = function () {
    return camera.switch();
  };
};

var Zoom = function () {
  function Zoom(camera) {
    classCallCheck(this, Zoom);

    this._camera = camera;
    this._initDomElement();
  }

  createClass(Zoom, [{
    key: "_initDomElement",
    value: function _initDomElement() {
      var _this = this;

      this._zoom = document.querySelector("#zoom");
      this._video = document.querySelector("#video");
      this._minus = document.querySelector("#zoom_minus");
      this._plus = document.querySelector("#zoom_plus");

      this._zoom.oninput = function () {
        return _this._oninput();
      };
      this._plus.onclick = function () {
        _this._zoom.value = Math.min(_this._zoom.value * 1 + 0.1, 1.5);
        _this._oninput();
      };
      this._minus.onclick = function () {
        _this._zoom.value = Math.max(_this._zoom.value - 0.1, 1.0);
        _this._oninput();
      };
    }
  }, {
    key: "_oninput",
    value: function _oninput() {
      this._video.style.transform = "scale(" + this._zoom.value + ")";
      this._camera.zoom = this._zoom.value;
    }
  }]);
  return Zoom;
}();

var FpsMeter = function () {
  function FpsMeter(callback) {
    classCallCheck(this, FpsMeter);

    this._callback = callback;
    this._counter = 0;
    this._refreshInterval = 1000;
    this._accumulationInterval = 2000;
  }

  createClass(FpsMeter, [{
    key: "start",
    value: function start() {
      var _this = this;

      var onRaf = function onRaf(time) {
        _this._rafId = requestAnimationFrame(onRaf);
        if (_this._lastRefreshTime === undefined) {
          _this._lastRefreshTime = time;
          _this._lastTime = time;
        }
        _this._counter++;
        var elapsedFromRefresh = time - _this._lastRefreshTime;
        var elapsed = time - _this._lastTime;
        if (elapsedFromRefresh > _this._refreshInterval) {
          _this._lastRefreshTime = time;
          _this._callback(_this._counter / elapsed * 1000);
        }
        if (elapsed > _this._accumulationInterval) {
          _this._lastTime = time;
          _this._counter = 0;
        }
      };
      this._rafId = requestAnimationFrame(onRaf);
    }
  }, {
    key: "stop",
    value: function stop() {
      cancelAnimationFrame(this._rafId);
    }
  }]);
  return FpsMeter;
}();

/* global CY */

var CameraManager = function () {
  function CameraManager() {
    classCallCheck(this, CameraManager);

    this._switcher = document.querySelector("#cameraSwitch");
    this._counter = 0;
    this._deviceList = [];
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext("2d");
    this._zoom = 1;
    this._starting = false;
  }

  createClass(CameraManager, [{
    key: "init",
    value: function init() {
      var _this = this;

      return navigator.mediaDevices.enumerateDevices().then(function (deviceInfos) {
        return _this._setUpDevices(deviceInfos);
      });
    }
  }, {
    key: "_setUpDevices",
    value: function _setUpDevices(deviceInfos) {
      for (var i = 0; i !== deviceInfos.length; ++i) {
        var deviceInfo = deviceInfos[i];
        if (deviceInfo.kind === 'videoinput') {
          this._deviceList.push(CY.getUserMediaCameraFactory().createCamera({
            constraints: getConstraintForId(deviceInfo.groupId),
            video: document.getElementById('video')
          }));
        }
      }
      if (this._deviceList.length > 1) {
        this._switcher.style.display = "block";
      }
    }
  }, {
    key: "getFrame",
    value: function getFrame() {
      var _this2 = this;

      return new Promise(function (resolve) {
        _this2.camera.getFrame().then(function (img) {
          return resolve(_this2._resize(img));
        });
      });
    }
  }, {
    key: "_resize",
    value: function _resize(imgData) {
      this._canvas.width = imgData.width;
      this._canvas.height = imgData.height;
      var x = (imgData.width - imgData.width / this.zoom) / 2;
      var y = (imgData.height - imgData.height / this.zoom) / 2;
      this._ctx.putImageData(imgData, 0, 0);
      return this._ctx.getImageData(x, y, imgData.width / this.zoom, imgData.height / this.zoom);
    }
  }, {
    key: "start",
    value: function start() {
      var _this3 = this;

      if (this._starting) return;
      this._starting = true;
      return this.camera.start().then(function (res) {
        _this3._starting = false;
        return res;
      });
    }
  }, {
    key: "stop",
    value: function stop() {
      return this.camera.stop();
    }
  }, {
    key: "switch",
    value: function _switch() {
      if (this._starting) return;
      this.stop();
      this._counter = (this._counter + 1) % this._deviceList.length;
      return this.start();
    }
  }, {
    key: "zoom",
    set: function set$$1(x) {
      this._zoom = x;
    },
    get: function get$$1() {
      return this._zoom;
    }
  }, {
    key: "camera",
    get: function get$$1() {
      return this._deviceList[this._counter];
    }
  }, {
    key: "width",
    get: function get$$1() {
      return this.camera.width;
    }
  }, {
    key: "height",
    get: function get$$1() {
      return this.camera.height;
    }
  }]);
  return CameraManager;
}();

function getConstraintForId(id) {
  return { audio: false, video: { groupId: { exact: id } } };
}

/* global CY */

if (location.protocol !== "https:" && !location.host.includes("localhost") && !location.host.includes("192.168.")) {
    alert("[WARNING]: This page may not work if the https protocol is not used, please reload the page with https://");
    location.href = location.href.replace(/^http:/g, "https:");
}

document.querySelector(".disclaimer .btn").onclick = function () {
    document.querySelector(".disclaimer").style.display = "none";
    document.querySelector("#placeholder").style.display = "none";
    var source = new CameraManager();
    source.init().then(function () {
        var loader = CY.loader().addModule(CY.modules().FACE_AROUSAL_VALENCE.name, { smoothness: 0.6 }).source(source);

        loader.load().then(function (_ref) {
            var start = _ref.start;

            new CameraSwitchInputManager(source);
            new Zoom(source);
            source.start().then(function () {
                var overlayManager = new Overlays(source.width, source.height);
                start();
                var crtDisableTimeout = setTimeout(function () {
                    return overlayManager.hidePin();
                }, 1500);
                window.addEventListener(CY.modules().FACE_AROUSAL_VALENCE.eventName, function (evt) {
                    clearTimeout(crtDisableTimeout);
                    overlayManager.showPin();
                    overlayManager.setEmotion(evt.detail.output.arousalvalence);
                    crtDisableTimeout = setTimeout(function () {
                        return overlayManager.hidePin();
                    }, 3000);
                });
            });
        });
    });
};

if (location.search.includes('fps=true')) {
    var fpsElement = document.querySelector('.fps');
    new FpsMeter(function (fps) {
        fpsElement.innerHTML = fps.toFixed(1) + ' fps';
    }).start();
}

}());
