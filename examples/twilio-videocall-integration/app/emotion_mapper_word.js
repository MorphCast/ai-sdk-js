import EMO_MAP from './emo_map.js';
import Emotion from './emotion';

export default class EmotionMapper {
    constructor() {
        this._emotions = EMO_MAP.map((emo) => {
            return new Emotion(emo);
        });
    }

    setEmotions({arousal, valence}) {
        let x, y;
        ({x, y} = this._calcCoorinate(arousal, valence));
        this.reset();
        const distances = this._calcDistances(x, y).slice(0, 3);
        distances.forEach((d, i) => {
            d.emo.enlight(i);
            d.emo.show();
        });
        clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.reset();
        },5000);

    }

    _calcCoorinate(arousal, valence) {
        arousal *= 4;
        valence *= 3;
        let x = Math.max(-1, Math.min(valence, 1));
        let y = Math.max(-1, Math.min(arousal, 1));
        let u = (x * Math.sqrt(1 - y * y / 2) + 1) * 50;
        let v = (y * Math.sqrt(1 - x * x / 2) + 1) * 50;
        return {x: u, y: v};
    }

    reset() {
        this._emotions.forEach((emo) => emo.reset());
    }

    _calcDistances(x, y) {
        const distances = [];
        this._emotions.forEach((emo) => {
            const d = Math.sqrt(Math.pow((emo.x - x), 2) + Math.pow((emo.y - y), 2));
            if (d < 25) {
                distances.push({emo: emo, distance: d});
            }
        });
        distances.sort((a, b) => {
            return a.distance - b.distance;
        });

        return distances;
    }
}