const Kawaii = require('kawaii');

class ExampleCommand extends Kawaii.Structures.Base.Command {
  constructor(client) {
    super(client);

    this.options = {};

    this.subcommands = {};

    this.context = {};
  }

  * execute(ctx, ...suffix) {

  }
}

module.exports = ExampleCommand;
