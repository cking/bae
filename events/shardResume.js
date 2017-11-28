const Kawaii = require('kawaii');
const logger = require('winston');

class shardResumeEvent extends Kawaii.Structures.Base.Event {
  constructor(client) {
    super(client, 'shardResume');

    this.context = {};
  }

  handle(client, id) {
    logger.warn(`[SHARD] - RESUME: Shard #${id}`)
  }
}

module.exports = shardResumeEvent;
