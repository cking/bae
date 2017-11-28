const Kawaii = require('kawaii');
const logger = require('winston');
class GuildDeleteEvent extends Kawaii.Structures.Base.Event {
  constructor(client) {
    super(client, 'guildDelete');

    this.context = {};
  }

  handle(ctx, guild) {
    logger.info(`GUILD LEFT: ${guild.name} [USERS: ${guild.memberCount}] [SHARD: ${guild.shard}] - (${guild.id})`);
  }
}

module.exports = GuildDeleteEvent;
