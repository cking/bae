const { Plugin } = require('kawaii/src/Structures/Base');

function remove(arr, item) {
  return arr.splice(arr.indexOf(item), 1);
}

class SettingsPlugin extends Plugin {
  constructor(...args) {
    super(...args);

    this.name = 'settings';
  }

  saveGuild(guild) {
    return this.client.plugins
      .get('r')
      .table('guilds')
      .get(guild.id)
      .replace(guild)
      .run();
  }

  getGuild(id) {
    return new Promise((resolve, reject) => {
      this.client.plugins
        .get('r')
        .table('guilds')
        .get(id)
        .run()
        .then(arr => {
          if (arr[0] === undefined) {
            resolve({
              ignores: [],
              ignoredUsers: {},
              ignoredChannels: {}
              // TODO
            });
          } else { resolve(arr[0]); }
        }, reject);
    });
  }

  *addChannelIgnore(guild_id, channel_id, ignore) {
    const guild = yield this.getGuild(guild_id);
    if (!guild.ignoredChannels[channel_id]) guild.ignoredChannels[channel_id] = [];
    guild.ignoredChannels[channel_id].push(ignore);
    yield this.saveGuild(guild);
    return guild;
  }

  *removeChannelIgnore(guild_id, channel_id, ignore) {
    const guild = yield this.getGuild(guild_id);
    remove(guild.ignoredChannels[channel_id] || [], ignore);
    yield this.saveGuild(guild);
    return guild;
  }

  *addUserIgnore(guild_id, user_id, ignore) {
    const guild = yield this.getGuild(guild_id);
    if (!guild.ignoredUsers[user_id]) guild.ignoredUsers[user_id] = [];
    guild.ignoredChannels[user_id].push(ignore);
    yield this.saveGuild(guild);
    return guild;
  }

  *removeUserIgnore(guild_id, user_id, ignore) {
    const guild = yield this.getGuild(guild_id);
    remove(guild.ignoredChannels[user_id] || [], ignore);
    yield this.saveGuild(guild);
    return guild;
  }

  *addGuildIgnore(guild_id, ignore) {
    const guild = yield this.getGuild(guild_id);
    if (!guild.ignores) guild.ignores = [];
    guild.ignores.push(ignore);
    yield this.saveGuild(guild);
    return guild;
  }

  *removeGuildIgnore(guild_id, ignore) {
    const guild = yield this.getGuild(guild_id);
    remove(guild.ignores || [], ignore);
    yield this.saveGuild(guild);
    return guild;
  }

  *allowIgnored(guild_id, channel_id, author_id, command) {
    const guild = yield this.getGuild(guild_id);
    if (guild.bypass.includes(author_id)) return true;
    if (guild.ignores.includes(command.name) || guild.ignores.includes('all')) {
      return false;
    }
    if (guild.ignoredChannels[channel_id] && guild.ignoredChannels[author_id].includes(command.name)) return false;
    if (guild.ignoredUsers[author_id] && guild.ignoredUsers[author_id].includes(command.name)) return false;
    return true;
  }

  *setGreet(guild_id, channel_id, message) {
    const guild = yield this.getGuild(guild_id);
    guild.greeting = {};
    guild.greeting.message = message;
    guild.greeting.channel_id = channel_id;
    yield this.saveGuild(guild);
    return guild;
  }

  *getGreet(guild_id) {
    return (yield this.getGuild(guild_id)).gretting;
  }
}

module.exports = SettingsPlugin;
