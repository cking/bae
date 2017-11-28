const Kawaii = require('kawaii');
const logger = require('winston');

class shardPreReadyEvent extends Kawaii.Structures.Base.Event {
  constructor(client) {
    super(client, 'shardPreReady');

    this.context = {};
  }

  handle(client, id) {
    logger.warn(`[SHARD] - PREREADY: Shard #${id}`)
  }
}

module.exports = shardPreReadyEvent;
