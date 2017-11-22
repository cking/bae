const { Command } = require('kawaii/src/Structures/Base');
const request = require('superagent');
const url = 'http://catfacts-api.appspot.com/api/facts?number=1'
class catfact extends Command {
  constructor(...args) {
    super(...args);

    this.options = {
      description: 'Tells a cat fact!',
      category: 'fun',
      aliases: ['cf', 'catfacts']
    };
  }

  *execute(ctx) {
    try {
      const res = yield request.get(url).buffer()
      const fact = JSON.parse(res.text)
      yield ctx.channel.createMessage(fact);
    } catch (e) {
      return 'I could not execute the command!';
    }
  }
}

module.exports = catfact;
