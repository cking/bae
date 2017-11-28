const { Command } = require('kawaii/src/Structures/Base');
const superagent = require('superagent');
const url = 'http://random.cat/meow';
class cat extends Command {
  constructor(...args) {
    super(...args);

    this.options = {
      description: 'Shows you a cat!',
      category: 'image'
    };
  }

  * execute() {
    try {
      const response = yield superagent.get(url);
      return response.body.file;
    } catch (e) {
      console.error(e);
      return `I could not execute the command!`;
    }
  }
}

module.exports = cat;
