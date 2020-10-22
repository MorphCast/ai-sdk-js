import EMO_MAP from './emo_map.js';

export default class EmotionMapper {
  constructor() {
    this._ar = [];
    this._val = [];
  }

  add(x, y) {
    this._ar.push(x);
    this._val.push(y);
  }

  get distances() {
    if (this._ar.length === 0) return [];
    const x = this._ar.reduce((a, b) => a + b) / this._ar.length;
    const y = this._val.reduce((a, b) => a + b) / this._val.length;

    let distances = this._calcDistances(x, y);

    return distances.map(d => {
      return [d.name, (((1 - Math.max(Math.min(d.distance / 50, 1), 0)) * 100).toFixed(0)) + "%"];
    });
  }

  reset() {
    this._ar = [];
    this._val = [];
  }

  _calcDistances(x, y) {
    const distances = [];
    EMO_MAP.forEach((emo) => {
      const d = Math.sqrt(Math.pow((emo.x - x), 2) + Math.pow((emo.y - y), 2));
      distances.push({name: emo.name, distance: d});
    });
    distances.sort((a, b) => {
      return a.distance - b.distance;
    });

    return distances;
  }
}