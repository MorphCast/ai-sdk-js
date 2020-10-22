import {connect, LocalDataTrack} from 'twilio-video';

export default class TwilioHelper {
  constructor(id, room, onEnd) {
    this.id = id;
    this.room = room;
    this._onEnd = onEnd;
    this._onDataCb = e => e;
  }

  disconnect() {
    if (!this.room) return;
    this.room.disconnect();
    this.room = null;
    this._onEnd();
  }

  async join(mediaStream) {
    const resp = await this._getToken();
    const config = {name: this.room};
    this._dataTrack = new LocalDataTrack();
    if (mediaStream) {
      config.tracks = mediaStream.getTracks().concat(this._dataTrack);
    } else {
      config.video = false;
      config.audio = false;
    }

    try {
      this.room = await connect(resp.token, config);

      this.room.on('participantConnected', participant => {
        console.log(`A remote Participant connected: ${participant}`);
      });
      this.room.on('participantDisconnected', participant => {
        console.log(`A remote Participant disconnected: ${participant}`);
        if (this.id !== 'prof') this.disconnect();
      });
    } catch (e) {
      console.error(`Unable to connect to Room: ${e.message}`);
    }
  }


  sendData(message) {
    this._dataTrack.send(message);
  }

  onData(cb) {
    this._onDataCb = cb;
  }

  showTrack(id, domElement) {
    return new Promise((res, rej) => {
      if (this.room == null) {
        rej("You need to be connected to show a Track");
        return;
      }
      this.room.participants.forEach(participant => {
        if (participant.identity === id) {
          participant.tracks.forEach(publication => {
            if (publication.track) {
              if (publication.track.kind !== 'data') domElement.appendChild(publication.track.attach());
              if (publication.track.kind === 'video') res();
              if (publication.track.kind === 'data') {
                publication.track.on('message', data => {
                  this._onDataCb(data);
                });
              }
            }
          });
          participant.on('trackSubscribed', track => {
            if (track.kind !== 'data') domElement.appendChild(track.attach());
            if (track.kind === 'video') res();
            if (track.kind === 'data') {
              track.on('message', data => {
                this._onDataCb(data);
              });
            }
          });
        }
      });
      this.room.on('participantConnected', participant => {
        if (participant.identity === id) {
          participant.tracks.forEach(publication => {
            if (publication.track) {
              if (publication.track.kind !== 'data') domElement.appendChild(publication.track.attach());
              if (publication.track.kind === 'video') res();
              if (publication.track.kind === 'data') {
                publication.track.on('message', data => {
                  this._onDataCb(data);
                });
              }
            }
          });
          participant.on('trackSubscribed', track => {
            if (track.kind !== 'data') domElement.appendChild(track.attach());
            if (track.kind === 'video') res();
            if (track.kind === 'data') {
              track.on('message', data => {
                this._onDataCb(data);
              });
            }
          });
        }
      });
    });
  }

  _getToken() {
    /*
        get Twilio token from your server.
        You can implement the server to return tokens for specific room passing
        {
          identity: this.id,
          roomId: this.room
        };
     */
  }
}