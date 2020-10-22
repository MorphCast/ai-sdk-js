import { createEmptyAudioTrack, createEmptyVideoTrack } from "./media_tools";

export default class UserMediaFactory {
  /**
   * Try to create a MediaStream with at least microphone
   *
   */
  static getCamera(video = true, audio = true) {
    return navigator.mediaDevices.getUserMedia({ audio, video });
  }

  static getMic() {
    return navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(stream => {
        return createEmptyVideoTrack().then(track => {
          stream.addTrack(track);
          return stream;
        });
      });
  }

  static getEmptyMediaStream() {
    return createEmptyVideoTrack().then(track => {
      return new MediaStream([createEmptyAudioTrack(), track]);
    });
  }

  static getDesktopShare() {
    return navigator.mediaDevices.getDisplayMedia({
      audio: false,
      video: true
    });
  }
}
