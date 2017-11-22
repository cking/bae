const VoiceChannelManager = require('./VoiceChannelManager');
const Resolver = require('../structures/Resolver');
const Queue = require('double-ended-queue');

class QueueManager {
  constructor(client, connection, channel) {
    this.client = client;
    this.connection = connection;
    this.queue = { id: this.connection };
    this.queue.songs = new Queue();
    this.cache = this.client.plugins.get('redis');
    this.playing = false;
    this.channel = channel;
    this.resolver = new Resolver(this.client);
    this.voiceChannel = new VoiceChannelManager(this.client, this.connection, this.channel, this);
  }
  *addToQueue(term, author) {
    const song = yield* this.resolver.get(term);
    this.queue.songs.push(song);
    if (!this.playing) {
      this.playing = true;
      yield* this.voiceChannel.play(this.queue.songs.get(0));
      return this.queue.songs.shift();
    } else {
      yield* this.announce(song, `Queued ${song.title}! \n Duration: ${song.duration} \n Requested by: ${author.username}`);
      this.queue.songs.push(song);
      return song;
    }
  }

  pause() {
    this.voiceChannel.pause();
  }
  resume() {
    this.voiceChannel.resume();
  }
  *nextSong() {
    if (this.queue.songs.isEmpty() || typeof this.queue.songs.get(0) === 'undefined') {
      this.playing = false;
      yield this.voiceChannel.destroy();
    } else {
      this.queue.songs.shift();
      console.log(this.queue.songs.get(0));
      yield* this.voiceChannel.play(this.queue.songs.get(0));
    }
  }
  *write() {
    yield this.cache.setAsync(`queue_${this.queue.id}`, JSON.stringify(this.queue.songs));
    return this.cache.expireAsync(`queue_${this.queue.id}`, 60 * 60 * 4);
  }
  *load() {
    const queue = JSON.parse(yield this.cache.getAsync(`queue_${this.queue.id}`));
    this.queue.songs = queue;
    return this.queue.songs;
  }
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
}
module.exports = QueueManager;
