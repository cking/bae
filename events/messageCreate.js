const Kawaii = require('kawaii');

class MessageCreateEvent extends Kawaii.Structures.Base.Event {
  constructor(client) {
    super(client, 'messageCreate');

    this.context = {};
  }

  handle(ctx, msg) {
    // ctx.Handler
  }
}

module.exports = MessageCreateEvent;
