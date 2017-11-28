const Kawaii = require('kawaii');
const logger = require('winston');
class GuildCreateEvent extends Kawaii.Structures.Base.Event {
  constructor(client) {
    super(client, 'guildCreate');

    this.context = {};
  }

  handle(ctx, guild) {
    logger.info(`GUILD JOIN: ${guild.name} [USERS: ${guild.memberCount}] [SHARD: ${guild.shard}] - (${guild.id})`);
    return "Heyoo~, I'm a multi purpose Discord bot here to assist you!\n For information about commands, do m!help. For mod commands, make sure you have the correct permissions on the server.\n For more info, join the support server using m!support."
  }
}

module.exports = GuildCreateEvent;
