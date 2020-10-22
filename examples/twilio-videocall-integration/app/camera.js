export default class Camera {
  constructor(camera) {
    this.video = camera;
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext("2d");
    this._stopped = true;
  }

  getFrame() {
    if(this.video.videoHeight === 0 || this.video.videoWidth === 0) return Promise.reject();
    this._canvas.height = this.video.videoHeight;
    this._canvas.width = this.video.videoWidth;
    this._ctx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
    return Promise.resolve(this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height));
  }

  start() {
    this._stopped = false;
    return Promise.resolve();
  }

  stop() {
    this._stopped = true;
    return Promise.resolve();
  }

  get stopped(){
    return this._stopped;
  }

  get width() {
    return this.video.videoWidth;
  }

  get height() {
    return this.video.videoHeight;
  }
}