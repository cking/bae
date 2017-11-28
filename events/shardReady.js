const Kawaii = require('kawaii');
const logger = require('winston');

class shardReadyEvent extends Kawaii.Structures.Base.Event {
  constructor(client) {
    super(client, 'shardReady');

    this.context = {};
  }

  handle(client, id) {
    logger.warn(`[SHARD] - READY: Shard #${id}`)
  }
}

module.exports = shardReadyEvent;
