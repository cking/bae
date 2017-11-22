const Kawaii = require('kawaii');
const logger = require('winston');

class shardDisconnectEvent extends Kawaii.Structures.Base.Event {
  constructor(client) {
    super(client, 'shardDisconnect');

    this.context = {};
  }

  handle(client, error, id) {
    logger.warn(`[SHARD] - DISCONNECT: Shard ${id}`);
  }
}

module.exports = shardDisconnectEvent;
