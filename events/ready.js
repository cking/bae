const Kawaii = require('kawaii');
const logger = require('winston');

class ReadyEvent extends Kawaii.Structures.Base.Event {
  constructor(client) {
    super(client, 'ready');

    this.context = {};
  }

  handle(client) {
    logger.info(`[READY]: (Guilds): ${client.guilds.size} | (Users): ${client.users.size}`)
    client.editStatus('online', { name: 'test' });
  }
}

module.exports = ReadyEvent;
