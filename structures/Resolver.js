const YouTube = require('../resolvers/YouTubeResolver');

class Resolver {
  constructor(client) {
    this.youtubeResolver = new YouTube(client);
    this.youtube = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)(?:&.*|)/;
  }

  *get(term) {
    const type = this.check(term);
    switch (type) {
      case 'youtube': {
        return yield* this.youtubeResolver.get(term);
      }
      case 'search': {
        return yield* this.youtubeResolver.search(term);
      }
    }
  }
  check(url) {
    if (this.youtube.test(url)) { return 'youtube'; } else {
      return 'search';
    }
  }
}
module.exports = Resolver;
