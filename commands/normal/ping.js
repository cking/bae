const { Command } = require('kawaii/src/Structures/Base');

class ping extends Command {
  constructor(...args) {
    super(...args);

    this.options = {
      description: 'peng pung',
      category: 'normal'
    };
  }

  execute() {
    return `**Pong!**`;
  }
}

module.exports = ping;
