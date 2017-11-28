const sanic = require('sanic');
class Cache {
  constructor(redisClient) {
    this.client = redisClient;
    this.get = sanic(this.get).bind(this);
    this.set = sanic(this.set).bind(this);
    this.remove = sanic(this.remove).bind(this);
    this.exists = sanic(this.exists).bind(this);
  }
  *get(id) {
    const value = yield this.client.getAsync(id);
    return Promise.resolve(value);
  }

  *set(id, value) {
    const v = JSON.stringify(value);

    yield this.client.setAsync(id, v);
    return this.client.expireAsync(id, 60 * 60);
  }

  *remove(id) {
    return this.client.delAsync(id);
  }

  *exists(id) {
    return this.client.existsAsync(id);
  }
}
module.exports = Cache;
