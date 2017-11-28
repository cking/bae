const Song = require('../structures/Song.js');
const Promise = require('bluebird');
const ytdl = Promise.promisifyAll(require('ytdl-core'));
const KeyManager = require('../managers/KeyManager');
const superagent = require('superagent');
const keys = require('../config.json').keys;
const crypto = require('crypto');
const keyManager = new KeyManager(keys);
class YouTubeResolver {
  constructor(client) {
    this.client = client;
    this.baseURL = 'https://www.youtube.com/watch?v=';
    this.type = 'youtube';
    this.cache = this.client.plugins.get('redis');
    this.options = {
      key: keyManager.getKey()
    };
  }

  *get(url) {
    const song = yield ytdl.getInfoAsync(url);
    if (song.live_playback === '1') return this.resolveLive(song);
    else return this.resolveVideo(song);
  }
  *resolveLive(data) {
    const song = yield* this.getStream(data);
    const url = `${this.baseURL}${song.video_id}`;
    const stream = this.filterLiveStream(song.formats);
    return new Song({
      id: song.video_id,
      type: this.type,
      url: url,
      streamUrl: stream,
      live: true,
      isOpus: false
    });
  }
  resolveVideo(song) {
    const url = `${this.baseURL}${song.video_id}`;
    let stream = this.filterOpus(song.formats);
    let isOpus = false;
    if(stream) {
      isOpus = true;
    } else {
      stream = this.filterStreams(song.formats);
    }
    const duration = this.convertDuration(song);
    return new Song({
      id: song.video_id,
      type: this.type,
      url: url,
      duration: duration,
      title: song.title,
      isOpus: isOpus,
      streamUrl: stream,
      thumbnail: song.thumbnail_url
    });
  }
  *search(term) {
    const hash = crypto.createHash('md5').update(term).digest('hex');
    let cachedResult = yield this.cache.get(`youtube_search_${hash}`);
    if (cachedResult) return cachedResult;
    let result;
    try {
      result = yield* this.request(term);
    } catch (e) {
      console.error(e);
      this.keyManager.nextKey();
      this.options.key = this.keyManager.getKey();
      result = yield* this.request(term);
    }
    if (result.items.length > 0) {
      result = result.items.map((item) => ({
        id: item.id.videoId,
        url: `https://youtube.com/watch?v=${item.id.videoId}`,
        title: item.snippet.title
      }));
      yield this.cache.set(`youtube_search_${hash}`, result);
      return result;
    }
  }
  *request(term) {
    const res = yield superagent.get('https://www.googleapis.com/youtube/v3/search').query({
      part: 'snippet',
      type: 'video',
      maxResults: 3,
      key: this.options.key,
      order: 'relevance',
      q: term
    });
    return res.body;
  }
  getStream(url) {
    return ytdl.getInfoAsync(url);
  }
  filterLiveStream(formats) {
    for (let i of formats) {
      if (~['94', '93', '95'].indexOf(i.format_id)) return i.url;
      else return false;
    }
  }
  filterOpus(formats) {
    for (let i of formats) {
      if (~['249', '250', '251'].indexOf(i.itag)) return i.url;
    }
    return null;
  }
  filterStreams(formats) {
    for (let i of formats) {
      console.log(i.container);
      if ((i.container === 'mp4' && i.audioEncoding) || (i.container === 'webm' && i.audioEncoding)) return i.url;
      else if (i.audioEncoding) return i.url;
    }
    return null;
  }
  convertDuration(info) {
    let durationConv = '';
    if (typeof info.duration === 'undefined' && typeof info.length_seconds === 'undefined') {
      return durationConv;
    }
    
    if (typeof info.duration !== 'undefined') {
      let durationSplit = info.duration.split(':');
      for (let i = 0; i < durationSplit.length; i++) {
        if (i !== durationSplit.length - 1) {
          if (durationSplit[i].length === 1) {
            durationConv = `${durationConv}0${durationSplit[i]}:`;
          } else {
            durationConv = `${durationConv + durationSplit[i]}:`;
          }
        } else if (durationSplit[i].length === 1) {
          durationConv = `${durationConv}0${durationSplit[i]}`;
        } else {
          durationConv += durationSplit[i];
        }
      }
      return durationConv;
    } else if (typeof info.length_seconds !== 'undefined') {
      let d = Number(info.length_seconds);
      let h = Math.floor(d / 3600);
      let m = Math.floor(d % 3600 / 60);
      let s = Math.floor(d % 3600 % 60);
      return `${(h > 0 ? `${h}:${m < 10 ? '0' : ''}` : '') + m}:${s < 10 ? '0' : ''}${s}`;
    }
  }
}
module.exports = YouTubeResolver;
