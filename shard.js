const Kawaii = require('kawaii');
const winston = require('winston');
const config = require('./config.json');
const { resolve } = require('path');
const client = new Kawaii.Core.Client(config.token, {
  maxShards: config.MAX_SHARDS,
}, { prefixes: config.prefixes });

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
  timestamp: true,
  colorize: true
});

winston.info(`\n-------------------\n[MASTER]: BAE ${config.version} STARTING\n-------------------`);


Kawaii.Helpers.Loader.loadCategories(resolve('./categories'), client);
Kawaii.Helpers.Loader.loadEvents(resolve('./events'), client);
Kawaii.Helpers.Loader.loadPlugins(resolve('./plugins'), client);
Kawaii.Helpers.Loader.loadCommands(resolve('./commands/normal'), client);
Kawaii.Helpers.Loader.loadCommands(resolve('./commands/fun'), client);
Kawaii.Helpers.Loader.loadCommands(resolve('./commands/image'), client);
Kawaii.Helpers.Loader.loadCommands(resolve('./commands/music'), client);

client.handler.on('command', (ctx) => {
  if (typeof ctx.msg.channel.guild !== 'undefined') {
    winston.info(
      `${ctx.msg.channel.guild.name} #${ctx.msg.channel.name}: ${ctx.msg.author.username}> ${ctx.msg.content}`
    );
  } else {
    winston.info(`#DM: ${ctx.msg.author.username}> ${ctx.msg.content}`);
  }
});

client.handler.on('commandError', (err) => {
  winston.error(err);

  return err.ctx.m.channel.createMessage(`${err.message}`);
});

client.connect();
process.on('unhandledRejection', (reason, p) => {
  winston.error('Unhandled Rejection at:', p, 'reason:', reason);
});
process.on('SIGINT', () => {
  winston.warn('Exiting');
  client.disconnect({
    reconnect: false
  });
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

process.on('uncaughtException', err => {
  winston.error(`Unhandled exception, shutting down:\n`, err);
  process.exit(1);
});
