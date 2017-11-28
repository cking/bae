const sanic = require('sanic');
const axios = require('axios');
const keys = require('../config.json').keys;
const Promise = require('bluebird');
const crypto = require('crypto');
const redis = Promise.promisifyAll(require('redis'));
const redisClient = redis.createClient();
const Cache = require('../structures/Cache');
const YT = require('../resolvers/YTResolver');
const KeyManager = require('./KeyManager');
const keyManager = new KeyManager(keys);
const opts = {
  maxResults: 10,
  key: keyManager.getKey(),
  type: 'video',
  order: 'relevance'
};
class SongResolver {
  constructor() {
    this.redis = redisClient;
    this.resolvers = { YT };
    this.cache = new Cache(redisClient);
    this.resolve = sanic(this.resolve).bind(this);
    this.search = sanic(this.search).bind(this);
    this.request = sanic(this.request).bind(this);
  }

  checkUrl(url) {
    url = this.removeBracket(url);
    for (let resolver in this.resolvers) {
      if (this.resolvers.hasOwnProperty(resolver)) {
        if (this.resolvers[resolver].canResolve(url)) {
          return true;
        }
      }
    }
    return false;
  }

  *resolve(url) {
    url = this.removeBracket(url);
    for (let resolver in this.resolvers) {
      if (this.resolvers.hasOwnProperty(resolver)) {
        if (this.resolvers[resolver].canResolve(url)) {
          return this.resolvers[resolver].resolve(url);
        }
      }
    }
  }

  *search(term) {
    const hash = crypto.createHash('md5').update(term).digest('hex');
    const result = yield this.cache.get(`yt_${hash}`);
    console.log(`RECEIVED RESULT FROM CACHE!!! ${result}`);
    if (result !== null) { return result; } else {
      let res;
      try {
        res = yield this.request(term);
      } catch (e) {
        console.log('Switching keys!');
        keyManager.nextKey();
        opts.key = keyManager.getKey();
        res = yield this.request(term);
      }
      if (res.items.length > 0) {
        const items = res.items.map((item) => ({
          id: item.id.videoId,
          url: `https://youtube.com/watch?v=${item.id.videoId}`,
          title: item.snippet.title
        }));
        yield this.cache.set(`yt_${hash}`, items);
        console.log(items);
        return items;
      } else {
        return false;
      }
    }
  }
  *request(term) {
    console.log(opts.key);
    console.log(term);
    const res = yield axios({
      url: 'https://www.googleapis.com/youtube/v3/search',
      method: 'get',
      params: {
        part: 'snippet',
        type: 'video',
        maxResults: 3,
        key: opts.key,
        order: 'relevance',
        q: term
      }
    });
    return res.data;
  }
  removeBracket(url) {
    if (url.startsWith('<')) {
      url = url.substr(1);
    }
    if (url.endsWith('>')) {
      url = url.substr(0, url.length - 1);
    }
    return url;
  }
}
module.exports = SongResolver;
