const { Category } = require('kawaii/src/Structures/Base');
const config = require('../config.json');
class NormalCategory extends Category {
  constructor(...args) {
    super(...args);

    this.name = 'normal';
    this.prefixes = Array.isArray(config.prefixes) ? config.prefixes : [config.prefixes];
  }
}

module.exports = NormalCategory;
