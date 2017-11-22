const Kawaii = require('kawaii');

class ExampleEvent extends Kawaii.Structures.Base.Event {
  constructor(client) {
    // Takes a `client` object, an optional `name` string (defaults to class name),
    // and an optional `executor` function (defaults to this.handle)
    super(client, 'eventName');
    this.context = {}; // Not sure if this is needed
  }

  /**
   * Handles the actual event.
   * @param {Client} ctx The client
   * @param ...args The arguments provided from the event
   * TODO: how to format this?
   */
  handle(ctx, ...args) {
    // Do stuff here
  }
}

module.exports = ExampleEvent;
