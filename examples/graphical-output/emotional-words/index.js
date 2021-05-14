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

  var EMO_MAP = [
    {name: "Sleepy", x: 50, y: 0}, {name: "Tired", x: 50, y: 0}, {
    name: "Afraid",
    x: 44,
    y: 90
  }, {name: "Angry", x: 30, y: 90}, {name: "Calm", x: 87, y: 16}, {name: "Relaxed", x: 86, y: 18}, {
    name: "Content",
    x: 91,
    y: 23
  }, {name: "Depressed", x: 9, y: 26}, {name: "Discontent", x: 16, y: 34}, {
    name: "Determined",
    x: 87,
    y: 63
  }, {name: "Happy", x: 95, y: 59}, {name: "Anxious", x: 17, y: 12}, {name: "Good", x: 95, y: 46}, {
    name: "Pensive",
    x: 52,
    y: 20
  }, {name: "Impressed", x: 70, y: 47}, {name: "Frustrated", x: 20, y: 70}, {
    name: "Disappointed",
    x: 10,
    y: 49
  }, {name: "Bored", x: 33, y: 11}, {name: "Annoyed", x: 28, y: 88}, {name: "Enraged", x: 41, y: 92}, {
    name: "Excited",
    x: 85,
    y: 86
  }, {name: "Melancholy", x: 48, y: 18}, {name: "Satisfied", x: 89, y: 19}, {
    name: "Distressed",
    x: 15,
    y: 78
  }, {name: "Uncomfortable", x: 16, y: 32}, {name: "Worried", x: 47, y: 34}, {
    name: "Amused",
    x: 78,
    y: 60
  }, {name: "Apathetic", x: 40, y: 44}, {name: "Peaceful", x: 78, y: 10}, {
    name: "Contemplative",
    x: 79,
    y: 20
  }, {name: "Embarrassed", x: 35, y: 20}, {name: "Sad", x: 9, y: 30}, {name: "Hopeful", x: 81, y: 35}, {
    name: "Pleased",
    x: 95,
    y: 45
  }];

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

        var x = void 0, y = void 0;

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
        return {x: u, y: v};
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
            distances.push({emo: emo, distance: d});
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

  /* global CY */
  var source = CY.getUserMediaCameraFactory().createCamera({video: document.getElementById('video')});

  var loader = CY.loader()
    //.licenseKey("insert-here-your-license-key")
    .source(source)
    .addModule(CY.modules().FACE_AROUSAL_VALENCE.name, {smoothness: 0.6});

  loader.load().then(function (_ref) {
    var start = _ref.start;

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
}());
