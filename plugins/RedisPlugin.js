const Promise = require('bluebird');
const { Plugin } = require('kawaii/src/Structures/Base');
const redis = Promise.promisifyAll(require('redis'));

class RedisPlugin extends Plugin {
  constructor(...args) {
    super(...args);
    this.name = 'redis';
    this.redis = redis.createClient();
  }
  *get(id) {
    let value = yield this.redis.getAsync(id);
    value = JSON.parse(value);
    return Promise.resolve(value);
  }
  *set(id, value) {
    const v = JSON.stringify(value);

    yield this.redis.setAsync(id, v);
    return this.redis.expireAsync(id, 60 * 60);
  }

  *remove(id) {
    return this.redis.delAsync(id);
  }

  *exists(id) {
    return this.redis.existsAsync(id);
  }
}

module.exports = RedisPlugin;
