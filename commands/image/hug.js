const { Command } = require('kawaii/src/Structures/Base');
const superagent = require('superagent');
const url = 'https://rra.ram.moe/i/r?type=hug';
class hug extends Command {
  constructor(...args) {
    super(...args);

    this.options = {
      description: 'Hug a person!',
      category: 'image'
    };
  }

  *execute(ctx) {
    if (!ctx.m.mentions.length) return 'Hey, you need to mention someone!';
    if (ctx.m.mentions[0] === ctx.author.id) return `Hey don't hug yourself, hug me instead!`;
    try {
      const response = yield superagent.get(url);
      const image = yield superagent.get(`https://rra.ram.moe${response.body.path}`);
      yield ctx.channel.createMessage(
        `Hey **${ctx.m.mentions[0].username}**, **${ctx.author.username}** gave you a hug!`, {
          file: image.body,
          name: url.body.path.substring(url.body.path.lastIndexOf('/') + 1)
        });
    } catch (e) {
      console.error(e);
      return `I could not execute the command!`;
    }
    return null;
  }
}

module.exports = hug;
