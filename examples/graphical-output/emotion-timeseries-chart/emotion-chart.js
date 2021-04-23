const EMOTIONS = [
  'Anger',
  'Disgust',
  'Fear',
  'Happiness',
  'Sadness',
  'Surprise',
  'Neutral'
];
EMOTIONS.ANGER = EMOTIONS[0];
EMOTIONS.DISGUST = EMOTIONS[1];
EMOTIONS.FEAR = EMOTIONS[2];
EMOTIONS.HAPPINESS = EMOTIONS[3];
EMOTIONS.SADNESS = EMOTIONS[4];
EMOTIONS.SURPRISE = EMOTIONS[5];
EMOTIONS.NEUTRAL = EMOTIONS[6];

const colorMap = {
  [EMOTIONS.ANGER]: '#cc002e',
  [EMOTIONS.DISGUST]: '#36c341',
  [EMOTIONS.FEAR]: '#9a59a0',
  [EMOTIONS.HAPPINESS]: '#e1ef00',
  [EMOTIONS.SADNESS]: '#83c0e4',
  [EMOTIONS.SURPRISE]: '#FFC0CB',
  [EMOTIONS.NEUTRAL]: '#FFFFFF',
};

const MAX = 30;
const STEP = 2;

class EmoChart {
  constructor(el) {
    this._element = el;
    const datasets = EMOTIONS.slice(0, 7).map((emotion) => {
      return {
        label: emotion,
        fill: false,
        borderColor: colorMap[emotion],
        borderWidth: 2,
        data: [],
        // lineTension: 0,
        pointRadius: 0
      };
    }).concat([{
      label: 'Face not detected',
      fill: true,
      backgroundColor: 'rgba(170,170,170,0.6)',
      borderColor: 'rgba(170,170,170,0.6)',
      data: [],
      lineTension: 0,
      pointRadius: 0
    }]);

    const ctx = el.getContext('2d');
    const config = {
      type: 'line',
      data: {
        datasets
      },
      options: {
        responsive: false,
        animation: {
          duration: 0,
        },
        scales: {
          xAxes: [{
            type: 'linear',
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'time (sec)'
            },
            ticks: {
              min: 0,
              suggestedMax: MAX + STEP,
              stepSize: STEP
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Emotion level (%)'
            },
            ticks: {
              display: false,
              min: 0,
              max: 1
            }
          }]
        },
        legend: {
          position: 'top'
        }
      }
    };
    Chart.defaults.global.defaultFontColor = "#fff";
    this._chart = new Chart(ctx, config);
    this._datasets = datasets;
    this._config = config;
    this._noDataTime = null;
    this._lastUpdateTime = null;
  }

  set visible(visible) {
    this._element.style.display = visible ? 'block' : 'none';
  }

  reset() {
    this._datasets.forEach((dataset) => {
      dataset.data = [];
    });
    this._chart.update();
  }

  update(time, _emotions) {
    const emotions = [_emotions.Angry, _emotions.Disgust, _emotions.Fear, _emotions.Happy, _emotions.Sad, _emotions.Surprise, _emotions.Neutral];

    emotions.forEach((value, index) => {
      this._datasets[index].data.push({y: value, x: time});
    });

    if (this._noDataTime !== null) {
      this._datasets[this._datasets.length - 1].data.push({x: time, y: 1});
      this._datasets[this._datasets.length - 1].data.push({x: time, y: undefined});
      this._noDataTime = null;
    }

    this._updateMinMax(time);
    this._chart.update();
    this._lastUpdateTime = time;
  }

  updateNoData(time) {
    if (this._lastUpdateTime) {
      this._datasets[this._datasets.length - 1].data.push({x: this._lastUpdateTime, y: 1});
      this._lastUpdateTime = null;
    }

    this._datasets.forEach((dataset, index) => {
      let y = undefined;
      if (index === this._datasets.length - 1) {
        y = 1;
      }
      dataset.data.push({y, x: time});

    });

    this._updateMinMax(time);
    this._chart.update();
    this._noDataTime = time;
  }

  _updateMinMax(time) {
    const max = this._config.options.scales.xAxes[0].ticks.max || MAX;
    if (time >= max) {
      this._config.options.scales.xAxes[0].ticks.min = max;
      this._config.options.scales.xAxes[0].ticks.max = max + MAX + STEP;
      this._datasets.forEach(d => d.data = []);
    }
  }
}

export {EmoChart};
