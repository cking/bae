const sanic = require('sanic');
const Song = require('../structures/Song.js');
const EventEmitter = require('eventemitter3');
const Promise = require('bluebird');
const ytdl = require('ytdl-core');
Promise.promisifyAll(ytdl);
const regex = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)(&.*|)/;
class YTResolver extends EventEmitter {
  constructor() {
    super();
    this.resolve = sanic(this.resolve).bind(this);
  }

  canResolve(url) {
    return regex.test(url);
  }

  *resolve(url) {
    console.log(`url is ${url}`);
    const song = yield ytdl.getInfoAsync(url);
    if (song.live_playback === '1') { return false; } else {
      let isOpus = false;
      const songUrl = `https://www.youtube.com/watch?v=${song.video_id}`;
      let streamUrl = this.filterOpus(song.formats);
      if (streamUrl) isOpus = true;
      else streamUrl = this.filterStreams(song.formats);
      let durationa = this.convertDuration(song)
      console.log(`in resolver ${song.thumbnail}`);
      return new Song({
        id: song.video_id,
        type: 'youtube',
        url: songUrl,
        duration: durationa,
        title: song.title,
        isOpus: isOpus,
        streamUrl: streamUrl,
        thumbnail: song.thumbnail_url
      });
    }
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
  filterOpus(formats) {
    for (let i = 0; i < formats.length; i++) {
      console.log(formats[i].itag);
      if (formats[i].itag === '250' || formats[i].itag === '251' || formats[i].itag === '249') {
        return formats[i].url;
      }
    }
    return null;
  }
  filterStreams(formats) {
    for (let i = 0; i < formats.length; i++) {
      console.log(formats[i].itag);
      if (formats[i].itag === '250' || formats[i].itag === '251' || formats[i].itag === '249') {
        console.log(formats[i]);
        return formats[i].url;
      }
      if (formats[i].container === 'mp4' && formats[i].audioEncoding || formats[i].container === 'webm' && formats[i].audioEncoding) {
        return formats[i].url;
      }
      if (formats[i].audioEncoding) {
        return formats[i].url;
      }
    }
    return null;
  }
}
module.exports = new YTResolver();
