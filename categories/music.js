const { Category } = require('kawaii/src/Structures/Base');
const config = require('../config.json');
class MusicCategory extends Category {
  constructor(...args) {
    super(...args);

    this.name = 'music';
    this.prefixes = Array.isArray(config.prefixes) ? config.prefixes : [config.prefixes];
  }
}

module.exports = MusicCategory;
