const Streamer = require('../structures/Streamer');
const EventEmitter = require('eventemitter3');
const sanic = require('sanic');
class VoiceChannelManager extends EventEmitter {
  constructor(client, connection, channel, queue) {
    super();
    this.setMaxListeners(10);
    this.client = client;
    this.connection = connection;
    this.channel = channel;
    this.queue = queue;
    this.stream = null;
    this.streamOptions = {};
  }

  /**
  * Play a given Song object
  * @private
  * @param {Song} song | Song to play
  */
  *play(song) {
    if (!this.connection) return;
    if (!this.connection.ready) yield this.warmUpConnection(this.connection);
    switch (song.type) {
      case 'youtube': {
        yield* this.handleYouTube(song);
        break;
      }
      default: {
        yield* this.handleDefault(song);
        break;
      }
    }
    this.connection.play(this.stream, this.streamOptions);
    yield* this.announce(song, `Now playing ${song.title}! \n Duration: ${song.duration}`);
    this.connection.once('error', sanic(function* () {
      yield* this.announce('An error occurred during playback, skipping to the next song!');
      yield* this.queue.nextSong();
    }.bind(this)));
    this.connection.once('end', sanic(function* () {
      yield* this.queue.nextSong();
    }.bind(this)));
  }

  /**
  * Pauses playback in the current voiceChannel
  * @private
  */
  pause() {
    this.connection.pause();
    this.announce('Playback was paused!');
  }

  /**
  * Resumes playback in the current voiceChannel
  * @private
  */
  resume() {
    this.connection.resume();
    this.announce('Playback resumed!');
  }

  /**
  * Announces a song in the guild's music channelID
  * @public
  * @param {message} message, a message to return as string, or a Message object
                     | containing a message string and song thumbnail
  * @param {title} title, The song title
  */
  *announce(message, title) {
    console.log(this.channel);
    if (typeof message === 'string') { yield this.client.createMessage(this.channel, message); } else if (typeof message === 'object' && title) {
      yield this.client.createMessage(this.channel, {
        embed: {
          description: title,
          color: 0xeac641,
          thumbnail: {
            url: `${message.thumbnail}`
          }
        }
      });
    }
  }

  *handleYouTube(song) {
    if (!song.streamUrl) yield* this.queue.nextSong();
    if (song.isOpus) {
      this.stream = new Streamer(song.streamUrl);
      this.streamOptions.format = 'webm';
      this.streamOptions.frameDuration = 20;
    } else {
      this.handleDefault(song);
    }
  }
  *handleDefault(song) {
    if (!song.streamUrl) yield* this.queue.nextSong();
    this.stream = song.streamUrl;
    this.streamOptions.inputArgs = ['-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '2'];
  }

  warmUpConnection(connection) {
    return new Promise((resolve, reject) => {
      if (connection.ready) resolve(connection);
      connection.once('ready', () => resolve(connection));
    });
  }
  *reset() {
    this.connection.stopPlaying();
    yield* this.queue.write();
    this.connection.disconnect();
    this.connection = null;
  }
  *destroy() {
    yield* this.announce('Nothing left in the queue, exiting!');
    yield* this.reset();
  }

}
module.exports = VoiceChannelManager;
