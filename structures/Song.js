class Song {
  constructor({ id, type, url, duration, title, isOpus, streamUrl, thumbnail }) {
    this.id = id;
    this.type = type;
    this.url = url;
    this.duration = duration;
    this.title = title ? title : 'unresolved';
    this.isOpus = isOpus;
    this.streamUrl = streamUrl;
    this.thumbnail = thumbnail;
  }
}
module.exports = Song;
