const Kawaii = require('kawaii');
console.log(Kawaii);
const config = require('./config.json');
const { resolve } = require('path');
const client = new Kawaii.Core.Client(config.token, {
  maxShards: config.MAX_SHARDS,
}, { prefixes: config.prefixes });

Kawaii.Helpers.Loader.loadCategories(resolve('./categories'), client);
Kawaii.Helpers.Loader.loadEvents(resolve('./events'), client);
Kawaii.Helpers.Loader.loadPlugins(resolve('./plugins'), client);
Kawaii.Helpers.Loader.loadCommands(resolve('./commands/normal'), client);
Kawaii.Helpers.Loader.loadCommands(resolve('./commands/fun'), client);
Kawaii.Helpers.Loader.loadCommands(resolve('./commands/image'), client);
Kawaii.Helpers.Loader.loadCommands(resolve('./commands/music'), client);

client.handler.on('command', (ctx) => {
  if (typeof ctx.msg.channel.guild !== 'undefined') {
    console.log(
      `${ctx.msg.channel.guild.name} #${ctx.msg.channel.name}: ${ctx.msg.author.username}> ${ctx.msg.content}`
    );
  } else {
    console.log(`#DM: ${ctx.msg.author.username}> ${ctx.msg.content}`);
  }
});

client.handler.on('commandError', (err) => {
  console.error(err.stack);

  return err.ctx.m.channel.createMessage(`${err.message}`);
});

client.connect();
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
process.on('SIGINT', () => {
  console.log('Exiting');
  client.disconnect({
    reconnect: false
  });
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

process.on('uncaughtException', err => {
  console.error(`Unhandled exception, shutting down:\n`, err);
  process.exit(1);
});
