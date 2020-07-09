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

var CameraSwitchInputManager = function CameraSwitchInputManager(camera) {
  classCallCheck(this, CameraSwitchInputManager);

  this._camera = camera;
  this._switcher = document.querySelector("#cameraSwitch");
  this._switcher.onclick = function () {
    return camera.switch();
  };
};

var EMO_MAP = [{ name: "Sleepy", x: 50, y: 0 }, { name: "Tired", x: 50, y: 0 }, { name: "Afraid", x: 44, y: 90 }, { name: "Angry", x: 30, y: 90 }, { name: "Calm", x: 87, y: 16 }, { name: "Relaxed", x: 86, y: 18 }, { name: "Content", x: 91, y: 23 }, { name: "Depressed", x: 9, y: 26 }, { name: "Discontent", x: 16, y: 34 }, { name: "Determined", x: 87, y: 63 }, { name: "Happy", x: 95, y: 59 }, { name: "Anxious", x: 17, y: 12 }, { name: "Good", x: 95, y: 46 }, { name: "Pensive", x: 52, y: 20 }, { name: "Impressed", x: 70, y: 47 }, { name: "Frustrated", x: 20, y: 70 }, { name: "Disappointed", x: 10, y: 49 }, { name: "Bored", x: 33, y: 11 }, { name: "Annoyed", x: 28, y: 88 }, { name: "Enraged", x: 41, y: 92 }, { name: "Excited", x: 85, y: 86 }, { name: "Melancholy", x: 48, y: 18 }, { name: "Satisfied", x: 89, y: 19 }, { name: "Distressed", x: 15, y: 78 }, { name: "Uncomfortable", x: 16, y: 32 }, { name: "Worried", x: 47, y: 34 }, { name: "Amused", x: 78, y: 60 }, { name: "Apathetic", x: 40, y: 44 }, { name: "Peaceful", x: 78, y: 10 }, { name: "Contemplative", x: 79, y: 20 }, { name: "Embarrassed", x: 35, y: 20 }, { name: "Sad", x: 9, y: 30 }, { name: "Hopeful", x: 81, y: 35 }, { name: "Pleased", x: 95, y: 45 }];

var Emotion = function () {
  function Emotion(emo) {
    classCallCheck(this, Emotion);

    this._x = emo.x;
    this._y = emo.y;
    this._label = emo.name;
    this._wrapper = document.querySelector('.face_tracker_out');
    this.addToDom();
  }

  createClass(Emotion, [{
    key: 'addToDom',
    value: function addToDom() {
      this._element = document.createElement('span');
      this._element.innerHTML = this._label;
      this._element.classList.add('emotion');
      this._element.style.left = this._x + "%";
      this._element.style.bottom = this._y + "%";
      this._wrapper.appendChild(this._element);
    }
  }, {
    key: 'show',
    value: function show() {
      this._element.style.opacity = 1;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this._element.style.opacity = 0;
    }
  }, {
    key: 'enlight',
    value: function enlight(position) {
      switch (position) {
        case 0:
          this._element.style.fontWeight = 700;
          this._element.style.fontSize = "48px";
          break;
        case 1:
          this._element.style.fontSize = "41px";
          break;
        case 2:
          this._element.style.fontWeight = 200;
          this._element.style.fontSize = "31px";
          break;
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.hide();
      this._element.style.fontWeight = "";
      this._element.style.fontSize = "";
    }
  }, {
    key: 'x',
    get: function get$$1() {
      return this._x;
    }
  }, {
    key: 'y',
    get: function get$$1() {
      return this._y;
    }
  }]);
  return Emotion;
}();

var EmotionMapper = function () {
    function EmotionMapper() {
        classCallCheck(this, EmotionMapper);

        this._emotions = EMO_MAP.map(function (emo) {
            return new Emotion(emo);
        });
    }

    createClass(EmotionMapper, [{
        key: 'setEmotions',
        value: function setEmotions(_ref) {
            var arousal = _ref.arousal,
                valence = _ref.valence;

            var x = void 0,
                y = void 0;

            var _calcCoorinate2 = this._calcCoorinate(arousal, valence);

            x = _calcCoorinate2.x;
            y = _calcCoorinate2.y;

            this.reset();
            var distances = this._calcDistances(x, y).slice(0, 3);
            distances.forEach(function (d, i) {
                d.emo.enlight(i);
                d.emo.show();
            });
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
        key: 'reset',
        value: function reset() {
            this._emotions.forEach(function (emo) {
                return emo.reset();
            });
        }
    }, {
        key: '_calcDistances',
        value: function _calcDistances(x, y) {
            var distances = [];
            this._emotions.forEach(function (emo) {
                var d = Math.sqrt(Math.pow(emo.x - x, 2) + Math.pow(emo.y - y, 2));
                if (d < 25) {
                    distances.push({ emo: emo, distance: d });
                }
            });
            distances.sort(function (a, b) {
                return a.distance - b.distance;
            });

            return distances;
        }
    }]);
    return EmotionMapper;
}();

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

var Dimensions = function () {
  function Dimensions(width, height) {
    var _this = this;

    classCallCheck(this, Dimensions);

    this._initDomElements();
    this._camAR = width / height;
    this.resize();
    window.onresize = function () {
      _this.resize();
    };
  }

  createClass(Dimensions, [{
    key: "_initDomElements",
    value: function _initDomElements() {
      this._wrapper = document.getElementById("video_overlay");
      this._tacker = document.querySelector(".face_tracker_out");
      this._dotsWrapper = document.querySelector("#dots_wrapper");
      this._video = document.querySelector("#video");
    }
  }, {
    key: "resize",
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
      this._tacker.style.width = this._tacker.style.height = guard * 0.83 + "px";
      this._wrapper.style.opacity = 1;
    }
  }]);
  return Dimensions;
}();

var Camera = function () {
  function Camera(video) {
    classCallCheck(this, Camera);

    this._video = video;
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext("2d");
    this._stopped = true;
  }

  createClass(Camera, [{
    key: "getFrame",
    value: function getFrame() {
      this._canvas.height = this._video.videoHeight;
      this._canvas.width = this._video.videoWidth;
      this._ctx.drawImage(this._video, 0, 0, this._video.videoWidth, this._video.videoHeight);
      return Promise.resolve(this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height));
    }
  }, {
    key: "start",
    value: function start() {
      this._video.play();
      this._stopped = false;
      return Promise.resolve();
    }
  }, {
    key: "stop",
    value: function stop() {
      this._stopped = true;
      return Promise.resolve();
    }
  }, {
    key: "stopped",
    get: function get$$1() {
      return this._stopped;
    }
  }, {
    key: "width",
    get: function get$$1() {
      return this._video.videoWidth;
    }
  }, {
    key: "height",
    get: function get$$1() {
      return this._video.videoHeight;
    }
  }]);
  return Camera;
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
    key: 'init',
    value: function init(isVideoSource) {
      var _this = this;

      if (isVideoSource) {
        this._deviceList.push(new Camera(document.querySelector('#video')));
        return Promise.resolve();
      } else {
        return navigator.mediaDevices.enumerateDevices().then(function (deviceInfos) {
          return _this._setUpDevices(deviceInfos);
        });
      }
    }
  }, {
    key: '_setUpDevices',
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
    key: 'getFrame',
    value: function getFrame() {
      var _this2 = this;

      return new Promise(function (resolve) {
        _this2.camera.getFrame().then(function (img) {
          return resolve(_this2._resize(img));
        });
      });
    }
  }, {
    key: '_resize',
    value: function _resize(imgData) {
      this._canvas.width = imgData.width;
      this._canvas.height = imgData.height;
      var x = (imgData.width - imgData.width / this.zoom) / 2;
      var y = (imgData.height - imgData.height / this.zoom) / 2;
      this._ctx.putImageData(imgData, 0, 0);
      return this._ctx.getImageData(x, y, imgData.width / this.zoom, imgData.height / this.zoom);
    }
  }, {
    key: 'start',
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
    key: 'stop',
    value: function stop() {
      return this.camera.stop();
    }
  }, {
    key: 'switch',
    value: function _switch() {
      if (this._starting) return;
      this.stop();
      this._counter = (this._counter + 1) % this._deviceList.length;
      return this.start();
    }
  }, {
    key: 'zoom',
    set: function set$$1(x) {
      this._zoom = x;
    },
    get: function get$$1() {
      return this._zoom;
    }
  }, {
    key: 'camera',
    get: function get$$1() {
      return this._deviceList[this._counter];
    }
  }, {
    key: 'width',
    get: function get$$1() {
      return this.camera.width;
    }
  }, {
    key: 'height',
    get: function get$$1() {
      return this.camera.height;
    }
  }]);
  return CameraManager;
}();

function getConstraintForId(id) {
  return { audio: false, video: { groupId: { exact: id } } };
}

function parseUrl() {
  var searchParams = location.search.replace("?", "").split("&");
  var result = {};
  searchParams.forEach(function (param) {
    var index = param.indexOf("=");
    if (index > 0) {
      var key = param.substring(0, index);
      var value = param.substring(index + 1);
      result[key] = value === "true" || value === "false" ? value === "true" : value;
    } else {
      result[param] = null;
    }
  });
  return result;
}

/* global CY */

if (location.protocol !== "https:" && !location.host.includes("localhost") && !location.host.includes("192.168.")) {
  alert("[WARNING]: This page may not work if the https protocol is not used, please reload the page with https://");
  location.href = location.href.replace(/^http:/g, "https:");
}

var opacity = parseUrl().opacity;
if (opacity != null) document.querySelector("#velina").style['background-color'] = 'rgba(1,1,1,' + opacity + ')';

var source = new CameraManager();
var video = parseUrl().video;
document.querySelector("#video").src = decodeURIComponent(video);
source.init(video != null).then(function () {
  var loader = CY.loader().addModule(CY.modules().FACE_AROUSAL_VALENCE.name, { smoothness: 0.6 }).licenseKey(***REMOVED***).source(source);

  loader.load().then(function (_ref) {
    var start = _ref.start;

    new CameraSwitchInputManager(source);
    new Zoom(source);
    source.start().then(function () {
      new Dimensions(source.width, source.height);
      var emoMapper = new EmotionMapper();
      start();
      var crtDisableTimeout = setTimeout(function () {
        return emoMapper.reset();
      }, 2500);
      window.addEventListener(CY.modules().FACE_AROUSAL_VALENCE.eventName, function (evt) {
        clearTimeout(crtDisableTimeout);
        emoMapper.setEmotions(evt.detail.output.arousalvalence);
        crtDisableTimeout = setTimeout(function () {
          return emoMapper.reset();
        }, 2500);
      });
    });
  });
});

}());
