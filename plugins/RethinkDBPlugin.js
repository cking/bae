const { Plugin } = require('kawaii/src/Structures/Base');
const r = require('rethinkdbdash');
const config = require('../config.json');

class RethinkDBPlugin extends Plugin {
  constructor(...args) {
    super(...args);
    // TODO: Redo config
    this.name = 'r';
    this.r = r({
      pool: true,
      cursor: true,
      db: config.db.database || 'maya',
      servers: [{ host: config.db.host || 'localhost', port: config.db.port || 28015 }],
      password: config.db.password
    });
  }

  table(name) {
    return this.r.table(name);
  }

  db(name) {
    return this.r.db(name);
  }
}

module.exports = RethinkDBPlugin;
