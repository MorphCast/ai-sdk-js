export default class Emotion {
  constructor(emo) {
    this._x = emo.x;
    this._y = emo.y;
    this._label = emo.name;
    this._wrapper = document.querySelector('.word_wrap');
    this.addToDom();
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  addToDom() {
    this._element = document.createElement('span');
    this._element.innerHTML = this._label;
    this._element.classList.add('emotion');
    this._element.style.left = this._x + "%";
    this._element.style.bottom = this._y + "%";
    this._wrapper.appendChild(this._element);
  }

  show() {
    this._element.style.opacity = 1;
  }

  hide() {
    this._element.style.opacity = 0;
  }

  enlight(position) {
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

  reset() {
    this.hide();
    this._element.style.fontWeight = "";
    this._element.style.fontSize = "";
  }
}