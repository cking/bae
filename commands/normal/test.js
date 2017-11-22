const { Command } = require('kawaii/src/Structures/Base');
const Resolver = require('../../structures/Resolver');
class test extends Command {
  constructor(...args) {
    super(...args);
    this.context = {

    };
    this.options = {
      description: 'peng pung',
      category: 'normal'
    };
  }

  *execute(ctx) {
    console.log('test');
    let resolver = new Resolver(ctx.client);
    let result = yield* resolver.get(ctx.suffix);
    console.log('Result:', result);
    return result.toString();
  }
}

module.exports = test;
